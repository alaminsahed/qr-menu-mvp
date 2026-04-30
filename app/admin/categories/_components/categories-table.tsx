import {
  AdminButton,
  AdminCard,
  AdminTable,
} from "@/app/admin/_components/admin-primitives";
import { type CategoryRow } from "@/app/admin/categories/_components/types";

type CategoriesTableProps = {
  categories: CategoryRow[];
  onMoveCategory: (formData: FormData) => Promise<void>;
  onDeleteCategory: (formData: FormData) => Promise<void>;
  onToggleAvailability: (formData: FormData) => Promise<void>;
};

export function CategoriesTable({
  categories,
  onMoveCategory,
  onDeleteCategory,
  onToggleAvailability,
}: CategoriesTableProps) {
  return (
    <AdminCard
      title="Current categories"
      description="Table view with icon actions."
    >
      <AdminTable
        columns={["Name", "Sort", "Status", "Actions"]}
        rows={categories.map((category, index) => [
          <div key={`${category.id}-name`} className="space-y-1">
            <p className="font-semibold text-primary-ui">{category.name_en}</p>
            <p className="text-xs text-secondary-ui">{category.name_bn}</p>
          </div>,

          <span key={`${category.id}-sort`} className="text-sm">
            {category.sort_order}
          </span>,
          <span
            key={`${category.id}-status`}
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              category.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            {category.is_active ? "Active" : "Inactive"}
          </span>,
          <div key={`${category.id}-actions`} className="flex flex-wrap gap-2">
            <form action={onMoveCategory}>
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="direction" value="up" />
              <AdminButton
                type="submit"
                variant="secondary"
                className="inline-flex items-center gap-1.5 border-violet-200! bg-violet-50! px-3 py-1 text-xs text-violet-700! hover:bg-violet-100! disabled:border-zinc-200! disabled:bg-zinc-100! disabled:text-zinc-400!"
                disabled={index === 0}
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_upward
                </span>
                Up
              </AdminButton>
            </form>
            <form action={onMoveCategory}>
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="direction" value="down" />
              <AdminButton
                type="submit"
                variant="secondary"
                className="inline-flex items-center gap-1.5 border-violet-200! bg-violet-50! px-3 py-1 text-xs text-violet-700! hover:bg-violet-100! disabled:border-zinc-200! disabled:bg-zinc-100! disabled:text-zinc-400!"
                disabled={index === categories.length - 1}
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_downward
                </span>
                Down
              </AdminButton>
            </form>
            <a
              href={`/admin/categories?edit=${category.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200! bg-blue-50! px-3 py-1 text-xs font-semibold text-blue-700! hover:bg-blue-100!"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit
            </a>
            <form action={onToggleAvailability}>
              <input type="hidden" name="id" value={category.id} />
              <input
                type="hidden"
                name="next_is_active"
                value={String(!category.is_active)}
              />
              <AdminButton
                type="submit"
                variant="secondary"
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs ${
                  category.is_active
                    ? "border-amber-200! bg-amber-50! text-amber-700! hover:bg-amber-100!"
                    : "border-emerald-200! bg-emerald-50! text-emerald-700! hover:bg-emerald-100!"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {category.is_active ? "toggle_off" : "toggle_on"}
                </span>
                {category.is_active ? "Disable" : "Enable"}
              </AdminButton>
            </form>
            <form action={onDeleteCategory}>
              <input type="hidden" name="id" value={category.id} />
              <AdminButton
                type="submit"
                variant="secondary"
                className="inline-flex items-center gap-1.5 border-red-200! bg-red-50! px-3 py-1 text-xs text-red-700! hover:bg-red-100!"
              >
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>
                Delete
              </AdminButton>
            </form>
          </div>,
        ])}
        emptyMessage="No categories found yet."
      />
    </AdminCard>
  );
}
