import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminToast } from "@/app/admin/_components/admin-toast";
import { CreateMenuItemForm } from "@/app/admin/menu/_components/create-menu-item-form";
import { EditMenuItemModal } from "@/app/admin/menu/_components/edit-menu-item-modal";
import { MenuItemsTable } from "@/app/admin/menu/_components/menu-items-table";
import {
  type MenuCategoryOption,
  type MenuItemRow,
} from "@/app/admin/menu/_components/types";
import {
  parseStoragePathFromPublicUrl,
  removeMenuImage,
  uploadMenuImage,
} from "@/app/admin/menu/_lib/menu-image-storage";
import { isAdminUser } from "@/lib/admin/is-admin";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type AdminMenuPageProps = {
  searchParams?: Promise<{ status?: string; message?: string; edit?: string; category?: string }>;
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

function parsePrice(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function parseBool(value: FormDataEntryValue | null) {
  return String(value ?? "").toLowerCase() === "true";
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

async function refreshMenu(status: "success" | "error", message: string) {
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  redirect(`/admin/menu?status=${status}&message=${encodeURIComponent(message)}`);
}

export default async function AdminMenuPage({ searchParams }: AdminMenuPageProps) {
  const supabase = createServiceRoleClient();
  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  const message = params?.message;
  const editId = params?.edit;

  const { data: categoryData, error: categoryError } = await supabase
    .from("menu_categories")
    .select("id, slug, name_en, name_bn, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name_en", { ascending: true });

  const { data: itemData, error: itemError } = await supabase
    .from("menu_items")
    .select(
      "id, slug, category_id, name_en, name_bn, description_en, description_bn, price, image_url, featured, available",
    )
    .order("featured", { ascending: false })
    .order("name_en", { ascending: true });

  const categories = (categoryData ?? []) as MenuCategoryOption[];
  const items = ((itemData ?? []) as MenuItemRow[]).map((item) => ({
    ...item,
    price: Number(item.price),
  }));
  const selectedCategoryId = categories.some((category) => category.id === params?.category)
    ? params?.category
    : undefined;
  const filteredItems = selectedCategoryId
    ? items.filter((item) => item.category_id === selectedCategoryId)
    : items;
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const itemToEdit = editId ? items.find((item) => item.id === editId) : undefined;

  function getCategoryHref(categoryId?: string) {
    if (!categoryId) return "/admin/menu";
    return `/admin/menu?category=${encodeURIComponent(categoryId)}`;
  }

  async function createMenuItem(formData: FormData) {
    "use server";
    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const nameEn = String(formData.get("name_en") ?? "").trim();
    const nameBn = String(formData.get("name_bn") ?? "").trim() || nameEn;
    const categoryId = String(formData.get("category_id") ?? "").trim();
    const descriptionEn = String(formData.get("description_en") ?? "").trim();
    const descriptionBn =
      String(formData.get("description_bn") ?? "").trim() || descriptionEn;
    const imageFile = formData.get("image_file");
    const price = parsePrice(formData.get("price"));
    const available = parseBool(formData.get("available"));
    const featured = parseBool(formData.get("featured"));
    const slug = toSlug(nameEn);
    let imageUrl = "";

    if (imageFile instanceof File && imageFile.size > 0) {
      const upload = await uploadMenuImage(imageFile);
      if ("error" in upload) {
        await refreshMenu("error", upload.error);
      } else {
        imageUrl = upload.publicUrl;
      }
    }

    if (!nameEn || !categoryId || !descriptionEn || !imageUrl || !slug) {
      await refreshMenu("error", "Name, category, description, and image are required.");
    }

    const { error } = await serviceClient.from("menu_items").insert({
      slug,
      category_id: categoryId,
      name_en: nameEn,
      name_bn: nameBn,
      description_en: descriptionEn,
      description_bn: descriptionBn,
      price,
      image_url: imageUrl,
      available,
      featured,
      is_active: true,
    });

    if (error) await refreshMenu("error", "Failed to create menu item.");
    await refreshMenu("success", "Menu item created.");
  }

  async function updateMenuItem(formData: FormData) {
    "use server";
    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    const nameEn = String(formData.get("name_en") ?? "").trim();
    const nameBn = String(formData.get("name_bn") ?? "").trim() || nameEn;
    const categoryId = String(formData.get("category_id") ?? "").trim();
    const descriptionEn = String(formData.get("description_en") ?? "").trim();
    const descriptionBn =
      String(formData.get("description_bn") ?? "").trim() || descriptionEn;
    const currentImageUrl = String(formData.get("current_image_url") ?? "").trim();
    const imageFile = formData.get("image_file");
    const price = parsePrice(formData.get("price"));
    const available = parseBool(formData.get("available"));
    const featured = parseBool(formData.get("featured"));
    const slug = toSlug(nameEn);
    let imageUrl = currentImageUrl;

    if (imageFile instanceof File && imageFile.size > 0) {
      const upload = await uploadMenuImage(imageFile);
      if ("error" in upload) {
        await refreshMenu("error", upload.error);
      } else {
        imageUrl = upload.publicUrl;
        const oldPath = parseStoragePathFromPublicUrl(currentImageUrl);
        if (oldPath) {
          await removeMenuImage(oldPath);
        }
      }
    }

    if (!id || !nameEn || !categoryId || !descriptionEn || !imageUrl || !slug) {
      await refreshMenu("error", "Required fields are missing.");
    }

    const { error } = await serviceClient
      .from("menu_items")
      .update({
        slug,
        category_id: categoryId,
        name_en: nameEn,
        name_bn: nameBn,
        description_en: descriptionEn,
        description_bn: descriptionBn,
        price,
        image_url: imageUrl,
        available,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) await refreshMenu("error", "Failed to update menu item.");
    await refreshMenu("success", "Menu item updated.");
  }

  async function deleteMenuItem(formData: FormData) {
    "use server";
    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    if (!id) await refreshMenu("error", "Menu item id is required.");

    const { data: item, error: itemFetchError } = await serviceClient
      .from("menu_items")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    if (itemFetchError) await refreshMenu("error", "Failed to load menu item.");

    const { error } = await serviceClient.from("menu_items").delete().eq("id", id);
    if (error) await refreshMenu("error", "Failed to delete menu item.");

    const imagePath = parseStoragePathFromPublicUrl(item?.image_url ?? "");
    if (imagePath) {
      await removeMenuImage(imagePath);
    }

    await refreshMenu("success", "Menu item deleted.");
  }

  async function toggleAvailability(formData: FormData) {
    "use server";
    await ensureAdmin();
    const serviceClient = createServiceRoleClient();
    const id = String(formData.get("id") ?? "").trim();
    const nextAvailable = parseBool(formData.get("next_available"));
    if (!id) await refreshMenu("error", "Menu item id is required.");

    const { error } = await serviceClient
      .from("menu_items")
      .update({ available: nextAvailable, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) await refreshMenu("error", "Failed to update availability.");
    await refreshMenu(
      "success",
      nextAvailable ? "Item marked available." : "Item marked unavailable.",
    );
  }

  return (
    <div className="space-y-6">
      <AdminToast
        status={status}
        message={message}
        clearPath={editId ? `/admin/menu?edit=${editId}` : "/admin/menu"}
      />
      {categoryError || itemError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load menu management data.
        </div>
      ) : null}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-ui">Menu Management</h1>
          <p className="text-secondary-ui">Manage your restaurant&apos;s digital menu items</p>
        </div>
      </section>

      <section className="rounded-2xl border border-default bg-white p-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          <Link
            href={getCategoryHref()}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              !selectedCategoryId
                ? "bg-secondary-ui text-white"
                : "bg-surface-soft text-secondary-ui"
            }`}
          >
            All Items
          </Link>
          {categories.slice(0, 8).map((category) => (
            <Link
              href={getCategoryHref(category.id)}
              key={category.id}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                selectedCategoryId === category.id
                  ? "bg-secondary-ui text-white"
                  : "bg-surface-soft text-secondary-ui"
              }`}
            >
              {category.name_en}
            </Link>
          ))}
        </div>
      </section>

      <CreateMenuItemForm categories={categories} onCreateMenuItem={createMenuItem} defaultOpen={status === "error"} />
      <MenuItemsTable
        items={filteredItems}
        categoriesById={categoriesById}
        onDeleteMenuItem={deleteMenuItem}
        onToggleAvailability={toggleAvailability}
      />
      {itemToEdit ? (
        <EditMenuItemModal
          item={itemToEdit}
          categories={categories}
          onUpdateMenuItem={updateMenuItem}
        />
      ) : null}
    </div>
  );
}
