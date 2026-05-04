import {
  AdminButton,
  AdminField,
  AdminInput,
} from "@/app/admin/_components/admin-primitives";
import { MenuImagePicker } from "@/app/admin/menu/_components/menu-image-picker";
import {
  type MenuCategoryOption,
  type MenuItemRow,
} from "@/app/admin/menu/_components/types";

type EditMenuItemModalProps = {
  item: MenuItemRow;
  categories: MenuCategoryOption[];
  onUpdateMenuItem: (formData: FormData) => Promise<void>;
};

export function EditMenuItemModal({
  item,
  categories,
  onUpdateMenuItem,
}: EditMenuItemModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <div className="max-h-[min(92vh,880px)] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-default bg-surface p-5 shadow-2xl sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-primary-ui">Edit menu item</h2>
            <p className="text-sm text-secondary-ui">Update details for {item.name_en}</p>
          </div>
          <a
            href="/admin/menu"
            aria-label="Close modal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-default text-secondary-ui hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </a>
        </div>
        <form action={onUpdateMenuItem} className="grid gap-3 lg:grid-cols-2">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="current_image_url" value={item.image_url} />
          <AdminField label="Name (English)" htmlFor="edit_name_en">
            <AdminInput
              id="edit_name_en"
              name="name_en"
              defaultValue={item.name_en}
              required
            />
          </AdminField>
          <AdminField label="Name (Bangla)" htmlFor="edit_name_bn">
            <AdminInput id="edit_name_bn" name="name_bn" defaultValue={item.name_bn} />
          </AdminField>
          <AdminField label="Category" htmlFor="edit_category_id">
            <select
              id="edit_category_id"
              name="category_id"
              required
              className="ui-input pr-10"
              defaultValue={item.category_id}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_en}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Price" htmlFor="edit_price">
            <AdminInput
              id="edit_price"
              name="price"
              type="number"
              defaultValue={item.price}
              required
            />
          </AdminField>
          <div className="lg:col-span-2">
            <AdminField
              label="Replace image"
              htmlFor="edit_image_file"
              helpText="Leave empty to keep current image."
            >
              <MenuImagePicker
                inputId="edit_image_file"
                inputName="image_file"
                currentImageUrl={item.image_url}
                helpText="Current image preview stays visible until a new one is selected."
              />
            </AdminField>
          </div>
          <div className="lg:col-span-2">
            <AdminField label="Description (English)" htmlFor="edit_description_en">
              <textarea
                id="edit_description_en"
                name="description_en"
                required
                className="ui-input min-h-24"
                defaultValue={item.description_en}
              />
            </AdminField>
          </div>
          <div className="lg:col-span-2">
            <AdminField label="Description (Bangla)" htmlFor="edit_description_bn">
              <textarea
                id="edit_description_bn"
                name="description_bn"
                className="ui-input min-h-24"
                defaultValue={item.description_bn}
              />
            </AdminField>
          </div>
          <div className="lg:col-span-2 flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-secondary-ui">
              <input
                type="checkbox"
                name="available"
                value="true"
                defaultChecked={item.available}
              />
              Available
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-secondary-ui">
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={item.featured}
              />
              Featured
            </label>
          </div>
          <div className="lg:col-span-2 flex flex-wrap gap-2">
            <AdminButton type="submit" className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-base">save</span>
              Save changes
            </AdminButton>
            <a
              href="/admin/menu"
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
