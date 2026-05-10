"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  logo_url: string | null;
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

function LogoUploadField({ currentUrl }: { currentUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="logo"
            className="mb-1.5 block text-sm font-medium text-primary-ui"
          >
            Restaurant logo
          </label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="ui-input block max-w-xs cursor-pointer text-sm text-secondary-ui file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-surface-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-ui"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return file ? URL.createObjectURL(file) : null;
              });
            }}
          />
          <p className="mt-1 text-xs text-muted-ui">
            Optional. JPG, PNG, or WebP, up to 5MB. Display size on the public
            menu is fixed.
          </p>
        </div>
        {preview || currentUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-default bg-white p-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-surface-soft ring-1 ring-black/5">
              <Image
                src={preview ?? currentUrl ?? ""}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
                unoptimized={Boolean(preview)}
              />
            </div>
            {currentUrl ? (
              <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary-ui">
                <input
                  type="checkbox"
                  name="clear_logo"
                  value="1"
                  className="rounded border-default"
                />
                Remove saved logo on save
              </label>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  return (
    <form action={onSave} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <AdminField
          label="Restaurant name"
          htmlFor="restaurant_name"
          helpText="Optional. Shown on menu pages and shared links."
        >
          <AdminInput
            id="restaurant_name"
            name="restaurant_name"
            defaultValue={settings.restaurant_name}
            placeholder="e.g. Spice Garden"
          />
        </AdminField>
      </div>

      <div className="md:col-span-2">
        <LogoUploadField currentUrl={settings.logo_url} />
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
