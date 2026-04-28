import { jsonError } from "@/lib/api/responses";
import { createClient } from "@/lib/supabase/server";

type Params = { slug: string };
type CategoryRef = {
  slug: string;
  name_en: string;
  name_bn: string;
  sort_order: number;
};

function getCategoryRef(categoryRef: CategoryRef | CategoryRef[] | null) {
  if (!categoryRef) return null;
  if (Array.isArray(categoryRef)) return categoryRef[0] ?? null;
  return categoryRef;
}

export async function GET(
  _request: Request,
  context: { params: Promise<Params> },
) {
  const { slug } = await context.params;
  if (!slug?.trim()) {
    return jsonError("Menu slug is required.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(
      `
      id,
      slug,
      name_en,
      name_bn,
      description_en,
      description_bn,
      price,
      image_url,
      featured,
      available,
      category_ref:menu_categories!inner(slug, name_en, name_bn, sort_order)
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return jsonError("Menu item not found.", 404);
    }
    return jsonError("Failed to load menu item.", 500);
  }

  const categoryRef = getCategoryRef(
    (data as { category_ref: CategoryRef | CategoryRef[] | null }).category_ref,
  );
  const item = {
    id: data.id,
    slug: data.slug,
    category: categoryRef?.name_en ?? "Uncategorized",
    category_slug: categoryRef?.slug ?? "",
    name_en: data.name_en,
    name_bn: data.name_bn,
    description_en: data.description_en,
    description_bn: data.description_bn,
    price: Number(data.price),
    image_url: data.image_url,
    featured: data.featured,
    available: data.available,
  };

  return Response.json({ item });
}
