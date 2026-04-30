import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminToast } from "@/app/admin/_components/admin-toast";
import { CategoriesTable } from "@/app/admin/categories/_components/categories-table";
import { CreateCategoryForm } from "@/app/admin/categories/_components/create-category-form";
import { EditCategoryModal } from "@/app/admin/categories/_components/edit-category-modal";
import { type CategoryRow } from "@/app/admin/categories/_components/types";
import { isAdminUser } from "@/lib/admin/is-admin";
import { createServiceRoleClient, createClient } from "@/lib/supabase/server";

type AdminCategoriesPageProps = {
  searchParams?: Promise<{ status?: string; message?: string; edit?: string }>;
};

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSortOrder(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=unauthorized");
  const admin = await isAdminUser(supabase, user.id);
  if (!admin) redirect("/login?error=unauthorized");
}

async function refreshCategories(status: "success" | "error", message: string) {
  revalidatePath("/admin/categories");
  redirect(
    `/admin/categories?status=${status}&message=${encodeURIComponent(message)}`,
  );
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const supabase = createServiceRoleClient();
  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  const message = params?.message;
  const editId = params?.edit;

  const { data, error } = await supabase
    .from("menu_categories")
    .select("id, slug, name_en, name_bn, sort_order, is_active, created_at")
    .order("sort_order", { ascending: true })
    .order("name_en", { ascending: true });

  const categories = (data ?? []) as CategoryRow[];
  const categoryToEdit = editId
    ? categories.find((category) => category.id === editId)
    : undefined;

  async function createCategory(formData: FormData) {
    "use server";

    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const nameEn = String(formData.get("name_en") ?? "").trim();
    const nameBn = String(formData.get("name_bn") ?? "").trim();
    const resolvedNameBn = nameBn || nameEn;
    const sortOrder = parseSortOrder(formData.get("sort_order"));

    if (!nameEn) {
      await refreshCategories("error", "English name is required.");
    }

    const slug = toSlug(nameEn);
    if (!slug) {
      await refreshCategories("error", "Unable to generate a valid slug.");
    }

    const { error: insertError } = await serviceClient
      .from("menu_categories")
      .insert({
        slug,
        name_en: nameEn,
        name_bn: resolvedNameBn,
        sort_order: sortOrder,
        is_active: true,
      });

    if (insertError) {
      await refreshCategories("error", "Failed to create category.");
    }

    await refreshCategories("success", "Category created.");
  }

  async function updateCategory(formData: FormData) {
    "use server";

    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    const nameEn = String(formData.get("name_en") ?? "").trim();
    const nameBn = String(formData.get("name_bn") ?? "").trim();
    const resolvedNameBn = nameBn || nameEn;
    const sortOrder = parseSortOrder(formData.get("sort_order"));
    const isActive = String(formData.get("current_is_active") ?? "true") === "true";

    if (!id || !nameEn) {
      await refreshCategories("error", "English name is required.");
    }

    const slug = toSlug(nameEn);
    if (!slug) {
      await refreshCategories("error", "Unable to generate a valid slug.");
    }

    const { error: updateError } = await serviceClient
      .from("menu_categories")
      .update({
        slug,
        name_en: nameEn,
        name_bn: resolvedNameBn,
        sort_order: sortOrder,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      await refreshCategories("error", "Failed to update category.");
    }

    await refreshCategories("success", "Category updated.");
  }

  async function toggleCategoryAvailability(formData: FormData) {
    "use server";

    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    const nextIsActive =
      String(formData.get("next_is_active") ?? "false") === "true";

    if (!id) {
      await refreshCategories("error", "Category id is required.");
    }

    const { error: updateError } = await serviceClient
      .from("menu_categories")
      .update({
        is_active: nextIsActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      await refreshCategories("error", "Failed to update category status.");
    }

    await refreshCategories(
      "success",
      nextIsActive ? "Category enabled." : "Category disabled.",
    );
  }

  async function deleteCategory(formData: FormData) {
    "use server";

    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      await refreshCategories("error", "Category id is required.");
    }

    const { count, error: countError } = await serviceClient
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      await refreshCategories("error", "Failed to validate category usage.");
    }

    if ((count ?? 0) > 0) {
      await refreshCategories(
        "error",
        "Cannot delete category with menu items. Move items first.",
      );
    }

    const { error: deleteError } = await serviceClient
      .from("menu_categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      await refreshCategories("error", "Failed to delete category.");
    }

    await refreshCategories("success", "Category deleted.");
  }

  async function moveCategory(formData: FormData) {
    "use server";

    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    const direction = String(formData.get("direction") ?? "").trim();
    if (!id || (direction !== "up" && direction !== "down")) {
      await refreshCategories("error", "Invalid reorder request.");
    }

    const { data: rows, error: fetchError } = await serviceClient
      .from("menu_categories")
      .select("id, sort_order")
      .order("sort_order", { ascending: true })
      .order("name_en", { ascending: true });

    if (fetchError || !rows?.length) {
      await refreshCategories(
        "error",
        "Failed to load categories for sorting.",
      );
    }
    const orderedRows = rows ?? [];

    const currentIndex = orderedRows.findIndex((row) => row.id === id);
    if (currentIndex < 0) {
      await refreshCategories("error", "Category not found.");
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetRow = orderedRows[swapIndex];
    const currentRow = orderedRows[currentIndex];

    if (!targetRow || !currentRow) {
      await refreshCategories("error", "Category is already at the edge.");
    }

    const { error: firstUpdateError } = await serviceClient
      .from("menu_categories")
      .update({
        sort_order: targetRow.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentRow.id);

    if (firstUpdateError) {
      await refreshCategories("error", "Failed to reorder categories.");
    }

    const { error: secondUpdateError } = await serviceClient
      .from("menu_categories")
      .update({
        sort_order: currentRow.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetRow.id);

    if (secondUpdateError) {
      await refreshCategories("error", "Failed to reorder categories.");
    }

    await refreshCategories("success", "Category order updated.");
  }

  return (
    <div className="space-y-4">
      <AdminToast
        status={status}
        message={message}
        clearPath={
          editId ? `/admin/categories?edit=${editId}` : "/admin/categories"
        }
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load categories.
        </div>
      ) : null}

      <CreateCategoryForm
        defaultSortOrder={categories.length}
        onCreateCategory={createCategory}
      />

      <CategoriesTable
        categories={categories}
        onMoveCategory={moveCategory}
        onDeleteCategory={deleteCategory}
        onToggleAvailability={toggleCategoryAvailability}
      />

      {categoryToEdit ? (
        <EditCategoryModal
          category={categoryToEdit}
          onUpdateCategory={updateCategory}
        />
      ) : null}
    </div>
  );
}
