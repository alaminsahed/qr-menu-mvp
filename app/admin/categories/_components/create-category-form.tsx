import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
} from "@/app/admin/_components/admin-primitives";

type CreateCategoryFormProps = {
  defaultSortOrder: number;
  onCreateCategory: (formData: FormData) => Promise<void>;
};

export function CreateCategoryForm({
  defaultSortOrder,
  onCreateCategory,
}: CreateCategoryFormProps) {
  return (
    <AdminCard
      title="Create Category"
      description="Create, edit, delete, and control display order for categories."
    >
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
    </AdminCard>
  );
}
