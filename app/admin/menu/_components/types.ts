export type MenuCategoryOption = {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  is_active: boolean;
};

export type MenuItemRow = {
  id: string;
  slug: string;
  category_id: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  price: number;
  image_url: string;
  featured: boolean;
  available: boolean;
};
