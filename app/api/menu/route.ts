import type { NextRequest } from "next/server";
import { parseMenuQuery } from "@/lib/api/schemas";
import { jsonError } from "@/lib/api/responses";
import { createClient } from "@/lib/supabase/server";

type MenuRow = {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  price: number;
  image_url: string;
  featured: boolean;
  available: boolean;
  category_ref:
    | {
        slug: string;
        name_en: string;
        name_bn: string;
        sort_order: number;
      }
    | {
        slug: string;
        name_en: string;
        name_bn: string;
        sort_order: number;
      }[]
    | null;
};

function getCategoryRef(
  categoryRef: MenuRow["category_ref"],
): {
  slug: string;
  name_en: string;
  name_bn: string;
  sort_order: number;
} | null {
  if (!categoryRef) return null;
  if (Array.isArray(categoryRef)) return categoryRef[0] ?? null;
  return categoryRef;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const query = parseMenuQuery(request);

  let menuQuery = supabase
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
    .order("sort_order", { referencedTable: "menu_categories", ascending: true })
    .order("featured", { ascending: false })
    .order("name_en", { ascending: true });

  if (query.category) {
    menuQuery = menuQuery.eq("menu_categories.slug", query.category.toLowerCase());
  }

  if (typeof query.available === "boolean") {
    menuQuery = menuQuery.eq("available", query.available);
  }

  if (query.q) {
    const escaped = query.q.replaceAll(",", "\\,");
    menuQuery = menuQuery.or(
      `name_en.ilike.%${escaped}%,name_bn.ilike.%${escaped}%,description_en.ilike.%${escaped}%,description_bn.ilike.%${escaped}%`,
    );
  }

  const { data, error } = await menuQuery;
  if (error) {
    return jsonError("Failed to load menu items.", 500);
  }

  const rows = (data ?? []) as MenuRow[];
  const items = rows.map((row) => {
    const categoryRef = getCategoryRef(row.category_ref);
    return {
      id: row.id,
      slug: row.slug,
      category: categoryRef?.name_en ?? "Uncategorized",
      category_slug: categoryRef?.slug ?? "",
      category_name_en: categoryRef?.name_en ?? "Uncategorized",
      category_name_bn: categoryRef?.name_bn ?? "অনির্ধারিত",
      name_en: row.name_en,
      name_bn: row.name_bn,
      description_en: row.description_en,
      description_bn: row.description_bn,
      price: Number(row.price),
      image_url: row.image_url,
      featured: row.featured,
      available: row.available,
    };
  });
  return Response.json({ items });
}
