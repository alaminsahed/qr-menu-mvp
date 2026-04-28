import type { NextRequest } from "next/server";

export type MenuQuery = {
  category?: string;
  available?: boolean;
  q?: string;
};

function normalizeSearchTerm(value: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function parseBooleanParam(value: string | null) {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return undefined;
}

export function parseMenuQuery(request: NextRequest): MenuQuery {
  const searchParams = request.nextUrl.searchParams;
  return {
    category: normalizeSearchTerm(searchParams.get("category")),
    available: parseBooleanParam(searchParams.get("available")),
    q: normalizeSearchTerm(searchParams.get("q")),
  };
}
