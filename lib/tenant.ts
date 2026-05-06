import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Resolves a restaurant_id from the tenant slug injected by the proxy.
 * Falls back to NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG for local dev
 * (where no subdomain exists).
 */
export async function resolveRestaurantId(
  tenantSlug: string | null,
): Promise<string | null> {
  const slug =
    tenantSlug ?? process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG ?? null;

  if (!slug) return null;

  const serviceClient = createServiceRoleClient();
  const { data } = await serviceClient
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  return data?.id ?? null;
}
