import {
  AdminButton,
  AdminCard,
  AdminTable,
} from "@/app/admin/_components/admin-primitives";
import {
  type MenuCategoryOption,
  type MenuItemRow,
} from "@/app/admin/menu/_components/types";

type MenuItemsTableProps = {
  items: MenuItemRow[];
  categoriesById: Map<string, MenuCategoryOption>;
  onDeleteMenuItem: (formData: FormData) => Promise<void>;
  onToggleAvailability: (formData: FormData) => Promise<void>;
};

export function MenuItemsTable({
  items,
  categoriesById,
  onDeleteMenuItem,
  onToggleAvailability,
}: MenuItemsTableProps) {
  return (
    <AdminCard
      title="Current menu items"
      description="Edit, delete, and toggle availability directly from the table."
    >
      <AdminTable
        columns={["Item", "Category", "Price", "Status", "Actions"]}
        rows={items.map((item) => {
          const category = categoriesById.get(item.category_id);
          return [
            <div key={`${item.id}-name`} className="space-y-1">
              <p className="font-semibold text-primary-ui">{item.name_en}</p>
              <p className="text-xs text-secondary-ui">{item.name_bn}</p>
            </div>,
            <div key={`${item.id}-category`} className="text-sm text-secondary-ui">
              {category?.name_en ?? "Unknown"}
            </div>,
            <span key={`${item.id}-price`} className="text-sm font-medium">
              BDT {item.price.toFixed(2)}
            </span>,
            <div key={`${item.id}-status`} className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  item.available
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {item.available ? "Available" : "Unavailable"}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  item.featured
                    ? "bg-amber-100 text-amber-700"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {item.featured ? "Featured" : "Standard"}
              </span>
            </div>,
            <div key={`${item.id}-actions`} className="flex flex-wrap gap-2">
              <a
                href={`/admin/menu?edit=${item.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-default bg-surface px-3 py-1 text-xs font-semibold text-secondary-ui hover:bg-surface-soft"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </a>
              <form action={onToggleAvailability}>
                <input type="hidden" name="id" value={item.id} />
                <input
                  type="hidden"
                  name="next_available"
                  value={String(!item.available)}
                />
                <AdminButton
                  type="submit"
                  variant="secondary"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs"
                >
                  <span className="material-symbols-outlined text-sm">
                    {item.available ? "toggle_off" : "toggle_on"}
                  </span>
                  {item.available ? "Disable" : "Enable"}
                </AdminButton>
              </form>
              <form action={onDeleteMenuItem}>
                <input type="hidden" name="id" value={item.id} />
                <AdminButton
                  type="submit"
                  variant="secondary"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </AdminButton>
              </form>
            </div>,
          ];
        })}
        emptyMessage="No menu items found yet."
      />
    </AdminCard>
  );
}
