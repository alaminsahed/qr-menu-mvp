import { type SupabaseClient } from "@supabase/supabase-js";

export type AdminRestaurant = {
  restaurant_id: string;
  role: string;
  restaurant: {
    id: string;
    slug: string;
    name: string;
  };
};

export async function getAdminRestaurant(
  supabase: SupabaseClient,
): Promise<AdminRestaurant | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role, restaurants(id, slug, name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const restaurant = Array.isArray(data.restaurants)
    ? data.restaurants[0]
    : data.restaurants;

  if (!restaurant) return null;

  return {
    restaurant_id: data.restaurant_id,
    role: data.role,
    restaurant: restaurant as { id: string; slug: string; name: string },
  };
}
