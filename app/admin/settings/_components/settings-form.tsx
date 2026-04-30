"use client";

import { useFormStatus } from "react-dom";
import {
  AdminButton,
  AdminField,
  AdminInput,
} from "@/app/admin/_components/admin-primitives";

export type RestaurantSettingsValues = {
  restaurant_name: string;
  whatsapp_number: string;
  phone: string;
  address: string;
  hours: string;
  maps_url: string;
};

type SettingsFormProps = {
  settings: RestaurantSettingsValues;
  onSave: (formData: FormData) => Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={pending}>
      <span className="inline-flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[18px]">
          {pending ? "progress_activity" : "save"}
        </span>
        <span>{pending ? "Saving..." : "Save settings"}</span>
      </span>
    </AdminButton>
  );
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  return (
    <form action={onSave} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <AdminField
          label="Restaurant name"
          htmlFor="restaurant_name"
          helpText="Shown on menu pages and shared links."
        >
          <AdminInput
            id="restaurant_name"
            name="restaurant_name"
            required
            defaultValue={settings.restaurant_name}
            placeholder="e.g. Spice Garden"
          />
        </AdminField>
      </div>

      <AdminField
        label="WhatsApp number"
        htmlFor="whatsapp_number"
        helpText="Use international format if possible."
      >
        <AdminInput
          id="whatsapp_number"
          name="whatsapp_number"
          defaultValue={settings.whatsapp_number}
          placeholder="+8801XXXXXXXXX"
        />
      </AdminField>

      <AdminField label="Phone" htmlFor="phone">
        <AdminInput
          id="phone"
          name="phone"
          defaultValue={settings.phone}
          placeholder="+8801XXXXXXXXX"
        />
      </AdminField>

      <div className="md:col-span-2">
        <AdminField label="Address" htmlFor="address">
          <AdminInput
            id="address"
            name="address"
            defaultValue={settings.address}
            placeholder="Street, city, area"
          />
        </AdminField>
      </div>

      <AdminField label="Business hours" htmlFor="hours">
        <AdminInput
          id="hours"
          name="hours"
          defaultValue={settings.hours}
          placeholder="11:00 AM - 10:00 PM"
        />
      </AdminField>

      <AdminField
        label="Maps URL"
        htmlFor="maps_url"
        helpText="Optional Google Maps or location URL."
      >
        <AdminInput
          id="maps_url"
          name="maps_url"
          type="url"
          defaultValue={settings.maps_url}
          placeholder="https://maps.google.com/..."
        />
      </AdminField>

      <div className="md:col-span-2 flex items-center justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
