import { headers } from "next/headers";
import { MenuScreen } from "@/app/menu/_components/menu-screen";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resolveRestaurantId } from "@/lib/tenant";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const params = await searchParams;
  const headersList = await headers();
  const tenantSlug = headersList.get("x-tenant-slug");

  const serviceClient = createServiceRoleClient();
  const restaurantId = await resolveRestaurantId(tenantSlug);

  let restaurantData: {
    restaurant_name: string | null;
    logo_url: string | null;
    whatsapp_number: string;
  } | null = null;

  if (restaurantId) {
    const { data } = await serviceClient
      .from("restaurant_settings")
      .select("restaurant_name, logo_url, whatsapp_number")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();
    restaurantData = data ?? null;
  }

  return (
    <MenuScreen
      tableNumber={params.table ?? null}
      restaurantName={restaurantData?.restaurant_name?.trim() ?? ""}
      restaurantLogoUrl={restaurantData?.logo_url?.trim() || null}
      whatsappNumber={restaurantData?.whatsapp_number?.trim() || "+8801685765411"}
    />
  );
}
