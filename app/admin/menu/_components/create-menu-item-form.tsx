import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
} from "@/app/admin/_components/admin-primitives";
import { MenuImagePicker } from "@/app/admin/menu/_components/menu-image-picker";
import { type MenuCategoryOption } from "@/app/admin/menu/_components/types";

type CreateMenuItemFormProps = {
  categories: MenuCategoryOption[];
  onCreateMenuItem: (formData: FormData) => Promise<void>;
};

export function CreateMenuItemForm({
  categories,
  onCreateMenuItem,
}: CreateMenuItemFormProps) {
  return (
    <AdminCard
      title="Create menu item"
      description="Upload image with bilingual details and availability defaults."
    >
      <form action={onCreateMenuItem} className="grid gap-3 lg:grid-cols-2">
        <AdminField label="Name (English)" htmlFor="create_name_en">
          <AdminInput
            id="create_name_en"
            name="name_en"
            placeholder="Naga King Burger"
            required
          />
        </AdminField>
        <AdminField label="Name (Bangla)" htmlFor="create_name_bn">
          <AdminInput id="create_name_bn" name="name_bn" placeholder="Optional" />
        </AdminField>
        <AdminField label="Category" htmlFor="create_category_id">
          <select
            id="create_category_id"
            name="category_id"
            required
            className="ui-input pr-10"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_en}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Price" htmlFor="create_price">
          <AdminInput
            id="create_price"
            name="price"
            type="number"
            defaultValue={0}
            required
          />
        </AdminField>
        <div className="lg:col-span-2">
          <AdminField
            label="Upload image"
            htmlFor="create_image_file"
            helpText="JPG, PNG, or WebP up to 5MB."
          >
            <MenuImagePicker
              inputId="create_image_file"
              inputName="image_file"
              required
              helpText="Preview appears instantly after you select an image."
            />
          </AdminField>
        </div>
        <div className="lg:col-span-2">
          <AdminField label="Description (English)" htmlFor="create_description_en">
            <textarea
              id="create_description_en"
              name="description_en"
              required
              className="ui-input min-h-24"
            />
          </AdminField>
        </div>
        <div className="lg:col-span-2">
          <AdminField label="Description (Bangla)" htmlFor="create_description_bn">
            <textarea
              id="create_description_bn"
              name="description_bn"
              className="ui-input min-h-24"
              placeholder="Optional"
            />
          </AdminField>
        </div>
        <div className="lg:col-span-2 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-secondary-ui">
            <input type="checkbox" name="available" value="true" defaultChecked />
            Available
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-secondary-ui">
            <input type="checkbox" name="featured" value="true" />
            Featured
          </label>
        </div>
        <div className="lg:col-span-2">
          <AdminButton type="submit" className="inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span>
            Add menu item
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
