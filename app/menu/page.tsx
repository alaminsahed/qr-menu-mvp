import { MenuScreen } from "@/app/menu/_components/menu-screen";
import { createServiceRoleClient } from "@/lib/supabase/server";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const params = await searchParams;
  const serviceClient = createServiceRoleClient();
  const { data } = await serviceClient
    .from("restaurant_settings")
    .select("restaurant_name, whatsapp_number")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <MenuScreen
      tableNumber={params.table ?? null}
      restaurantName={data?.restaurant_name ?? "Shonali Bhoj"}
      whatsappNumber={data?.whatsapp_number ?? "+8801685765411"}
    />
  );
}
