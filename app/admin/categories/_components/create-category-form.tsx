"use client";

import { useEffect, useState } from "react";
import {
  AdminButton,
  AdminField,
  AdminInput,
} from "@/app/admin/_components/admin-primitives";

type CreateCategoryFormProps = {
  defaultSortOrder: number;
  onCreateCategory: (formData: FormData) => Promise<void>;
  defaultOpen?: boolean;
};

export function CreateCategoryForm({
  defaultSortOrder,
  onCreateCategory,
  defaultOpen = false,
}: CreateCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <details
      id="create-category"
      className="overflow-hidden rounded-2xl border border-default bg-surface [&_summary::-webkit-details-marker]:hidden"
      open={isOpen}
      onToggle={(event) => {
        setIsOpen(event.currentTarget.open);
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-primary-ui">Create category</h2>
          <p className="text-sm text-secondary-ui">
            Bilingual names and sort order for the public menu.
          </p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpen((previous) => !previous);
          }}
          className="inline-flex items-center justify-center rounded-lg bg-primary-ui px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-ui/40"
        >
          Add Category
        </button>
      </summary>
      <div className="border-t border-default px-4 py-4 sm:px-5">
        <form action={onCreateCategory} className="grid gap-3 lg:grid-cols-3">
          <AdminField label="Name (English)" htmlFor="create_name_en">
            <AdminInput
              id="create_name_en"
              name="name_en"
              placeholder="Burgers"
              required
            />
          </AdminField>
          <AdminField label="Name (Bangla)" htmlFor="create_name_bn">
            <AdminInput id="create_name_bn" name="name_bn" placeholder="Optional" />
          </AdminField>
          <AdminField label="Sort order" htmlFor="create_sort_order">
            <AdminInput
              id="create_sort_order"
              name="sort_order"
              type="number"
              defaultValue={defaultSortOrder}
            />
          </AdminField>
          <div className="lg:col-span-3">
            <AdminButton type="submit" className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-base">add</span>
              Add category
            </AdminButton>
          </div>
        </form>
      </div>
    </details>
  );
}
