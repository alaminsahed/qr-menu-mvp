const MAX_PRICE = 999999;

type ParseOk<T> = { ok: true; data: T };
type ParseErr = { ok: false; message: string };
type ParseResult<T> = ParseOk<T> | ParseErr;

export type MenuCreateInput = {
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  category_id: string;
  price: number;
  image_url: string;
  available: boolean;
  featured: boolean;
};

export type MenuUpdateInput = MenuCreateInput & { id: string };
export type MenuDeleteInput = { id: string };
export type MenuToggleInput = { id: string; available: boolean };

export type CategoryCreateInput = {
  name_en: string;
  name_bn: string;
  sort_order: number;
  is_active: boolean;
};

export type CategoryUpdateInput = CategoryCreateInput & { id: string };
export type CategoryDeleteInput = { id: string };
export type CategoryToggleInput = { id: string; is_active: boolean };
export type CategoryReorderInput = { id: string; direction: "up" | "down" };
export type RestaurantSettingsInput = {
  restaurant_name: string;
  whatsapp_number: string;
  phone: string;
  address: string;
  hours: string;
  maps_url: string;
};

function parseText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseBoolean(value: unknown, defaultValue = false) {
  return typeof value === "boolean" ? value : defaultValue;
}

function parsePrice(value: unknown): ParseResult<number> {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return { ok: false, message: "Price must be a valid number." };
  }
  if (parsed <= 0 || parsed > MAX_PRICE) {
    return { ok: false, message: "Price must be between 0 and 999999." };
  }
  return { ok: true, data: Number(parsed.toFixed(2)) };
}

function parseSortOrder(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function parseId(value: unknown, fieldName: string): ParseResult<string> {
  const id = parseText(value);
  if (!id) {
    return { ok: false, message: `${fieldName} is required.` };
  }
  return { ok: true, data: id };
}

function resolveBilingual(primary: string, secondary: string) {
  return secondary || primary;
}

function isValidPhone(value: string) {
  if (!value) return true;
  return /^\+?[0-9()\-\s]{7,20}$/.test(value);
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseMenuCreate(payload: unknown): ParseResult<MenuCreateInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }

  const obj = payload as Record<string, unknown>;
  const name_en = parseText(obj.name_en);
  const name_bn = resolveBilingual(name_en, parseText(obj.name_bn));
  const description_en = parseText(obj.description_en);
  const description_bn = resolveBilingual(description_en, parseText(obj.description_bn));
  const category_id = parseText(obj.category_id);
  const image_url = parseText(obj.image_url);
  const available = parseBoolean(obj.available, true);
  const featured = parseBoolean(obj.featured, false);
  const priceResult = parsePrice(obj.price);

  if (!name_en || !description_en || !category_id || !image_url) {
    return { ok: false, message: "Name, description, category, and image are required." };
  }
  if (!toSlug(name_en)) {
    return { ok: false, message: "Unable to generate a valid slug." };
  }
  if (!priceResult.ok) return priceResult;

  return {
    ok: true,
    data: {
      name_en,
      name_bn,
      description_en,
      description_bn,
      category_id,
      price: priceResult.data,
      image_url,
      available,
      featured,
    },
  };
}

export function parseMenuUpdate(payload: unknown): ParseResult<MenuUpdateInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Menu item id");
  if (!idResult.ok) return idResult;

  const createResult = parseMenuCreate(payload);
  if (!createResult.ok) return createResult;

  return { ok: true, data: { id: idResult.data, ...createResult.data } };
}

export function parseMenuDelete(payload: unknown): ParseResult<MenuDeleteInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Menu item id");
  if (!idResult.ok) return idResult;
  return { ok: true, data: { id: idResult.data } };
}

export function parseMenuToggle(payload: unknown): ParseResult<MenuToggleInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Menu item id");
  if (!idResult.ok) return idResult;
  return {
    ok: true,
    data: { id: idResult.data, available: parseBoolean(obj.available, false) },
  };
}

export function parseCategoryCreate(payload: unknown): ParseResult<CategoryCreateInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const name_en = parseText(obj.name_en);
  const name_bn = resolveBilingual(name_en, parseText(obj.name_bn));
  const sort_order = parseSortOrder(obj.sort_order);
  const is_active = parseBoolean(obj.is_active, true);

  if (!name_en) {
    return { ok: false, message: "English name is required." };
  }
  if (!toSlug(name_en)) {
    return { ok: false, message: "Unable to generate a valid slug." };
  }

  return { ok: true, data: { name_en, name_bn, sort_order, is_active } };
}

export function parseCategoryUpdate(payload: unknown): ParseResult<CategoryUpdateInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Category id");
  if (!idResult.ok) return idResult;

  const createResult = parseCategoryCreate(payload);
  if (!createResult.ok) return createResult;

  return { ok: true, data: { id: idResult.data, ...createResult.data } };
}

export function parseCategoryDelete(payload: unknown): ParseResult<CategoryDeleteInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Category id");
  if (!idResult.ok) return idResult;
  return { ok: true, data: { id: idResult.data } };
}

export function parseCategoryToggle(payload: unknown): ParseResult<CategoryToggleInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Category id");
  if (!idResult.ok) return idResult;
  return {
    ok: true,
    data: { id: idResult.data, is_active: parseBoolean(obj.is_active, false) },
  };
}

export function parseCategoryReorder(payload: unknown): ParseResult<CategoryReorderInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }
  const obj = payload as Record<string, unknown>;
  const idResult = parseId(obj.id, "Category id");
  if (!idResult.ok) return idResult;

  const direction = parseText(obj.direction);
  if (direction !== "up" && direction !== "down") {
    return { ok: false, message: "Direction must be either up or down." };
  }
  return { ok: true, data: { id: idResult.data, direction } };
}

export function parseRestaurantSettings(
  payload: unknown,
): ParseResult<RestaurantSettingsInput> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid request payload." };
  }

  const obj = payload as Record<string, unknown>;
  const restaurant_name = parseText(obj.restaurant_name);
  const whatsapp_number = parseText(obj.whatsapp_number);
  const phone = parseText(obj.phone);
  const address = parseText(obj.address);
  const hours = parseText(obj.hours);
  const maps_url = parseText(obj.maps_url);

  if (!isValidPhone(whatsapp_number) || !isValidPhone(phone)) {
    return {
      ok: false,
      message: "WhatsApp and phone must use a valid phone number format.",
    };
  }
  if (maps_url) {
    try {
      const parsed = new URL(maps_url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { ok: false, message: "Maps URL must start with http:// or https://." };
      }
    } catch {
      return { ok: false, message: "Maps URL must be a valid URL." };
    }
  }

  return {
    ok: true,
    data: {
      restaurant_name,
      whatsapp_number,
      phone,
      address,
      hours,
      maps_url,
    },
  };
}
