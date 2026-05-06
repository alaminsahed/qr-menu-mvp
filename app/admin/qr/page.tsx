import { redirect } from "next/navigation";
import { QrTableGenerator } from "@/app/admin/qr/_components/qr-table-generator";
import { getAdminRestaurant } from "@/lib/admin/get-restaurant";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQrPage() {
  const supabase = await createClient();
  const member = await getAdminRestaurant(supabase);
  if (!member) redirect("/login?error=unauthorized");

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "tapbite.org";
  const restaurantSlug = member.restaurant.slug;
  const menuBaseUrl = `https://${restaurantSlug}.${rootDomain}/menu`;

  return (
    <section className="ui-card flex flex-col gap-2">
      <h2 className="text-base font-semibold text-primary-ui">QR tools</h2>
      <QrTableGenerator menuBaseUrl={menuBaseUrl} restaurantSlug={restaurantSlug} />
    </section>
  );
}
