import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  badRequest,
  requireAdminUser,
  serverError,
  unauthorized,
} from "@/lib/admin/api";
import {
  parseCategoryCreate,
  parseCategoryDelete,
  parseCategoryReorder,
  parseCategoryToggle,
  parseCategoryUpdate,
  toSlug,
} from "@/lib/admin/schemas";
import { createServiceRoleClient } from "@/lib/supabase/server";

type CategoryAction = "create" | "update" | "delete" | "toggle" | "reorder";

function revalidateCategoryViews() {
  revalidatePath("/menu");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/menu");
  revalidatePath("/admin");
}

export async function POST(request: Request) {
  const member = await requireAdminUser();
  if (!member) return unauthorized();

  const { restaurant_id } = member;
  const serviceClient = createServiceRoleClient();
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  if (!payload || typeof payload !== "object") {
    return badRequest("Invalid request payload.");
  }

  const action = (payload as { action?: unknown }).action as
    | CategoryAction
    | undefined;
  const input = (payload as { input?: unknown }).input;

  if (!action) return badRequest("Action is required.");

  if (action === "create") {
    const parsed = parseCategoryCreate(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { data, error } = await serviceClient
      .from("menu_categories")
      .insert({
        restaurant_id,
        slug: toSlug(parsed.data.name_en),
        name_en: parsed.data.name_en,
        name_bn: parsed.data.name_bn,
        sort_order: parsed.data.sort_order,
        is_active: parsed.data.is_active,
      })
      .select("id")
      .maybeSingle();

    if (error) return serverError("Failed to create category.");
    revalidateCategoryViews();
    return NextResponse.json({ ok: true, id: data?.id ?? null });
  }

  if (action === "update") {
    const parsed = parseCategoryUpdate(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { error } = await serviceClient
      .from("menu_categories")
      .update({
        slug: toSlug(parsed.data.name_en),
        name_en: parsed.data.name_en,
        name_bn: parsed.data.name_bn,
        sort_order: parsed.data.sort_order,
        is_active: parsed.data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (error) return serverError("Failed to update category.");
    revalidateCategoryViews();
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const parsed = parseCategoryDelete(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { count, error: countError } = await serviceClient
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("category_id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (countError) return serverError("Failed to validate category usage.");
    if ((count ?? 0) > 0) {
      return badRequest("Cannot delete category with menu items.");
    }

    const { error } = await serviceClient
      .from("menu_categories")
      .delete()
      .eq("id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (error) return serverError("Failed to delete category.");
    revalidateCategoryViews();
    return NextResponse.json({ ok: true });
  }

  if (action === "toggle") {
    const parsed = parseCategoryToggle(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { error } = await serviceClient
      .from("menu_categories")
      .update({
        is_active: parsed.data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (error) return serverError("Failed to update category status.");
    revalidateCategoryViews();
    return NextResponse.json({ ok: true });
  }

  if (action === "reorder") {
    const parsed = parseCategoryReorder(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { data: rows, error: fetchError } = await serviceClient
      .from("menu_categories")
      .select("id, sort_order, name_en")
      .eq("restaurant_id", restaurant_id)
      .order("sort_order", { ascending: true })
      .order("name_en", { ascending: true });

    if (fetchError || !rows?.length) {
      return serverError("Failed to load categories for sorting.");
    }

    const currentIndex = rows.findIndex((row) => row.id === parsed.data.id);
    if (currentIndex < 0) return badRequest("Category not found.");

    const swapIndex =
      parsed.data.direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetRow = rows[swapIndex];
    const currentRow = rows[currentIndex];

    if (!targetRow || !currentRow) {
      return badRequest("Category is already at the edge.");
    }

    const { error: firstError } = await serviceClient
      .from("menu_categories")
      .update({
        sort_order: targetRow.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentRow.id)
      .eq("restaurant_id", restaurant_id);

    if (firstError) return serverError("Failed to reorder categories.");

    const { error: secondError } = await serviceClient
      .from("menu_categories")
      .update({
        sort_order: currentRow.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetRow.id)
      .eq("restaurant_id", restaurant_id);

    if (secondError) return serverError("Failed to reorder categories.");
    revalidateCategoryViews();
    return NextResponse.json({ ok: true });
  }

  return badRequest("Unsupported action.");
}
