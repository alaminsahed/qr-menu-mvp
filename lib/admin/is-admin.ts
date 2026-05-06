import { type SupabaseClient } from "@supabase/supabase-js";
import { getAdminRestaurant } from "@/lib/admin/get-restaurant";

/** @deprecated Use getAdminRestaurant instead */
export async function isAdminUser(
  supabase: SupabaseClient,
  _userId: string | null | undefined,
): Promise<boolean> {
  const member = await getAdminRestaurant(supabase);
  return !!member;
}
