import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminCard } from "@/app/admin/_components/admin-primitives";
import { AdminToast } from "@/app/admin/_components/admin-toast";
import {
  SettingsForm,
  type RestaurantSettingsValues,
} from "@/app/admin/settings/_components/settings-form";
import {
  parseStoragePathFromPublicUrl,
  removeMenuImage,
  uploadRestaurantLogo,
} from "@/app/admin/menu/_lib/menu-image-storage";
import { getAdminRestaurant } from "@/lib/admin/get-restaurant";
import { parseRestaurantSettings } from "@/lib/admin/schemas";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type AdminSettingsPageProps = {
  searchParams?: Promise<{ status?: string; message?: string }>;
};

async function getRestaurantId(): Promise<string> {
  const supabase = await createClient();
  const member = await getAdminRestaurant(supabase);
  if (!member) redirect("/login?error=unauthorized");
  return member.restaurant_id;
}

async function refreshSettings(status: "success" | "error", message: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/menu");
  redirect(`/admin/settings?status=${status}&message=${encodeURIComponent(message)}`);
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const restaurantId = await getRestaurantId();
  const serviceClient = createServiceRoleClient();
  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  const message = params?.message;

  const { data, error } = await serviceClient
    .from("restaurant_settings")
    .select(
      "id, restaurant_name, logo_url, whatsapp_number, phone, address, hours, maps_url",
    )
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  const settings: RestaurantSettingsValues = {
    restaurant_name: data?.restaurant_name ?? "",
    logo_url: data?.logo_url?.trim() || null,
    whatsapp_number: data?.whatsapp_number ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
    hours: data?.hours ?? "",
    maps_url: data?.maps_url ?? "",
  };

  async function saveSettings(formData: FormData) {
    "use server";
    const restaurantIdInner = await getRestaurantId();
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
    const { data: currentRow } = await service
      .from("restaurant_settings")
      .select("id, logo_url")
      .eq("restaurant_id", restaurantIdInner)
      .maybeSingle();

    const clearLogo = formData.get("clear_logo") === "1";
    const logoFile = formData.get("logo");
    const hasNewLogoFile = logoFile instanceof File && logoFile.size > 0;

    let logo_url: string | null = currentRow?.logo_url?.trim() || null;

    if (hasNewLogoFile && logoFile instanceof File) {
      const upload = await uploadRestaurantLogo(logoFile, restaurantIdInner);
      if ("error" in upload) {
        await refreshSettings("error", upload.error);
        return;
      }
      const previousPath = currentRow?.logo_url
        ? parseStoragePathFromPublicUrl(currentRow.logo_url)
        : null;
      if (previousPath) {
        await removeMenuImage(previousPath);
      }
      logo_url = upload.publicUrl;
    } else if (clearLogo) {
      const previousPath = currentRow?.logo_url
        ? parseStoragePathFromPublicUrl(currentRow.logo_url)
        : null;
      if (previousPath) {
        await removeMenuImage(previousPath);
      }
      logo_url = null;
    }

    const nameTrimmed = parsed.data.restaurant_name.trim();
    const rowPayload = {
      restaurant_name: nameTrimmed ? nameTrimmed : null,
      whatsapp_number: parsed.data.whatsapp_number,
      phone: parsed.data.phone,
      address: parsed.data.address,
      hours: parsed.data.hours,
      maps_url: parsed.data.maps_url,
      logo_url,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await service
      .from("restaurant_settings")
      .upsert(
        { ...rowPayload, restaurant_id: restaurantIdInner },
        { onConflict: "restaurant_id" },
      );

    if (upsertError) {
      await refreshSettings("error", "Failed to save settings.");
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
