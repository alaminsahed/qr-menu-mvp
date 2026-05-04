import {
  AdminButton,
  AdminField,
  AdminInput,
} from "@/app/admin/_components/admin-primitives";
import { type CategoryRow } from "@/app/admin/categories/_components/types";

type EditCategoryModalProps = {
  category: CategoryRow;
  onUpdateCategory: (formData: FormData) => Promise<void>;
};

export function EditCategoryModal({
  category,
  onUpdateCategory,
}: EditCategoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <div className="max-h-[min(92vh,880px)] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-default bg-surface p-5 shadow-2xl sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-primary-ui">
              Edit category
            </h2>
            <p className="text-sm text-secondary-ui">
              Update details for {category.name_en}
            </p>
          </div>
          <a
            href="/admin/categories"
            aria-label="Close modal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-default text-secondary-ui hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </a>
        </div>
        <form action={onUpdateCategory} className="grid gap-3">
          <input type="hidden" name="id" value={category.id} />
          <input
            type="hidden"
            name="current_is_active"
            value={String(category.is_active)}
          />
          <AdminField label="Name (English)" htmlFor="edit_name_en">
            <AdminInput
              id="edit_name_en"
              name="name_en"
              defaultValue={category.name_en}
              required
            />
          </AdminField>
          <AdminField label="Name (Bangla)" htmlFor="edit_name_bn">
            <AdminInput
              id="edit_name_bn"
              name="name_bn"
              defaultValue={category.name_bn}
            />
          </AdminField>
          <AdminField label="Sort order" htmlFor="edit_sort_order">
            <AdminInput
              id="edit_sort_order"
              name="sort_order"
              type="number"
              defaultValue={category.sort_order}
              required
            />
          </AdminField>
          <div className="flex flex-wrap gap-2">
            <AdminButton
              type="submit"
              className="inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Save changes
            </AdminButton>
            <a
              href="/admin/categories"
              className="inline-flex items-center gap-2 rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-secondary-ui hover:bg-surface-soft"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
