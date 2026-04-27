import type { MenuItem } from "@/lib/menu";

export type Language = "en" | "bn";

export function getLocalizedName(item: MenuItem, language: Language) {
  return language === "bn" ? item.name_bn : item.name_en;
}

export function getLocalizedDescription(item: MenuItem, language: Language) {
  return language === "bn" ? item.description_bn : item.description_en;
}

export function formatBdt(value: number) {
  return `৳${value}`;
}
