import { type SupabaseClient } from "@supabase/supabase-js";

export async function isAdminUser(
  supabase: SupabaseClient,
  userId: string | null | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}
