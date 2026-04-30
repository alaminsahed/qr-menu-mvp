import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminCard } from "@/app/admin/_components/admin-primitives";
import { AdminToast } from "@/app/admin/_components/admin-toast";
import {
  SettingsForm,
  type RestaurantSettingsValues,
} from "@/app/admin/settings/_components/settings-form";
import { isAdminUser } from "@/lib/admin/is-admin";
import { parseRestaurantSettings } from "@/lib/admin/schemas";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type AdminSettingsPageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>;
};

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=unauthorized");
  const admin = await isAdminUser(supabase, user.id);
  if (!admin) redirect("/login?error=unauthorized");
}

async function refreshSettings(status: "success" | "error", message: string) {
  revalidatePath("/admin/settings");
  revalidatePath("/menu");
  redirect(`/admin/settings?status=${status}&message=${encodeURIComponent(message)}`);
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const serviceClient = createServiceRoleClient();
  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  const message = params?.message;
  const { data, error } = await serviceClient
    .from("restaurant_settings")
    .select(
      "id, restaurant_name, whatsapp_number, phone, address, hours, maps_url",
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const existingSettingsId = data?.id ?? null;

  const settings: RestaurantSettingsValues = {
    restaurant_name: data?.restaurant_name ?? "",
    whatsapp_number: data?.whatsapp_number ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
    hours: data?.hours ?? "",
    maps_url: data?.maps_url ?? "",
  };

  async function saveSettings(formData: FormData) {
    "use server";
    await ensureAdmin();
    const parsed = parseRestaurantSettings({
      restaurant_name: formData.get("restaurant_name"),
      whatsapp_number: formData.get("whatsapp_number"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      hours: formData.get("hours"),
      maps_url: formData.get("maps_url"),
    });
    if (!parsed.ok) {
      await refreshSettings("error", parsed.message);
      return;
    }

    const service = createServiceRoleClient();
    const now = new Date().toISOString();
    if (existingSettingsId) {
      const { error: updateError } = await service
        .from("restaurant_settings")
        .update({
          ...parsed.data,
          updated_at: now,
        })
        .eq("id", existingSettingsId);
      if (updateError) {
        await refreshSettings("error", "Failed to save settings.");
      }
    } else {
      const { error: insertError } = await service.from("restaurant_settings").insert({
        ...parsed.data,
        updated_at: now,
      });
      if (insertError) {
        await refreshSettings("error", "Failed to save settings.");
      }
    }

    await refreshSettings("success", "Restaurant settings saved.");
  }

  return (
    <div className="space-y-4">
      <AdminToast status={status} message={message} clearPath="/admin/settings" />
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load saved settings.
        </div>
      ) : null}
      <AdminCard
        title="Restaurant settings"
        description="Update contact details and profile info used by menu experiences."
      >
        <SettingsForm settings={settings} onSave={saveSettings} />
      </AdminCard>
    </div>
  );
}
