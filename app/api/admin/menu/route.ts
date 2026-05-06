import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  badRequest,
  requireAdminUser,
  serverError,
  unauthorized,
} from "@/lib/admin/api";
import {
  parseMenuCreate,
  parseMenuDelete,
  parseMenuToggle,
  parseMenuUpdate,
  toSlug,
} from "@/lib/admin/schemas";
import { createServiceRoleClient } from "@/lib/supabase/server";

type MenuAction = "create" | "update" | "delete" | "toggle";

function revalidateMenuViews() {
  revalidatePath("/menu");
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

  const action = (payload as { action?: unknown }).action as MenuAction | undefined;
  const input = (payload as { input?: unknown }).input;

  if (!action) {
    return badRequest("Action is required.");
  }

  if (action === "create") {
    const parsed = parseMenuCreate(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { data, error } = await serviceClient
      .from("menu_items")
      .insert({
        restaurant_id,
        slug: toSlug(parsed.data.name_en),
        category_id: parsed.data.category_id,
        name_en: parsed.data.name_en,
        name_bn: parsed.data.name_bn,
        description_en: parsed.data.description_en,
        description_bn: parsed.data.description_bn,
        price: parsed.data.price,
        image_url: parsed.data.image_url,
        available: parsed.data.available,
        featured: parsed.data.featured,
        is_active: true,
      })
      .select("id")
      .maybeSingle();

    if (error) return serverError("Failed to create menu item.");
    revalidateMenuViews();
    return NextResponse.json({ ok: true, id: data?.id ?? null });
  }

  if (action === "update") {
    const parsed = parseMenuUpdate(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { error } = await serviceClient
      .from("menu_items")
      .update({
        slug: toSlug(parsed.data.name_en),
        category_id: parsed.data.category_id,
        name_en: parsed.data.name_en,
        name_bn: parsed.data.name_bn,
        description_en: parsed.data.description_en,
        description_bn: parsed.data.description_bn,
        price: parsed.data.price,
        image_url: parsed.data.image_url,
        available: parsed.data.available,
        featured: parsed.data.featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (error) return serverError("Failed to update menu item.");
    revalidateMenuViews();
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const parsed = parseMenuDelete(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { error } = await serviceClient
      .from("menu_items")
      .delete()
      .eq("id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (error) return serverError("Failed to delete menu item.");
    revalidateMenuViews();
    return NextResponse.json({ ok: true });
  }

  if (action === "toggle") {
    const parsed = parseMenuToggle(input);
    if (!parsed.ok) return badRequest(parsed.message);

    const { error } = await serviceClient
      .from("menu_items")
      .update({
        available: parsed.data.available,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id)
      .eq("restaurant_id", restaurant_id);

    if (error) return serverError("Failed to update menu item availability.");
    revalidateMenuViews();
    return NextResponse.json({ ok: true });
  }

  return badRequest("Unsupported action.");
}
