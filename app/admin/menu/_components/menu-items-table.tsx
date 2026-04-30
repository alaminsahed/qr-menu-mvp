import { AdminButton } from "@/app/admin/_components/admin-primitives";
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
    <section className="overflow-hidden rounded-3xl border border-default bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-default bg-surface-soft">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-ui">
                Item
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-ui">
                Category
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-ui">
                Price (BDT)
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-ui">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-ui">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => {
                const category = categoriesById.get(item.category_id);
                return (
                  <tr key={item.id} className="border-b border-default last:border-b-0 hover:bg-surface-soft/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl border border-default bg-surface-soft">
                          {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image_url}
                              alt={item.name_en}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-semibold text-primary-ui">{item.name_en}</p>
                          <p className="text-xs text-secondary-ui">{item.name_bn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-secondary-ui">
                        {category?.name_en ?? "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-primary-ui">
                      ৳ {item.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <form action={onToggleAvailability}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_available" value={String(!item.available)} />
                        <button
                          type="submit"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            item.available ? "bg-secondary-ui" : "bg-zinc-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              item.available ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/menu?edit=${item.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-ui hover:bg-surface-soft hover:text-primary-ui"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </a>
                        <form action={onDeleteMenuItem}>
                          <input type="hidden" name="id" value={item.id} />
                          <AdminButton
                            type="submit"
                            variant="secondary"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-0! bg-transparent! p-0 text-muted-ui! hover:bg-red-50! hover:text-red-600!"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </AdminButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-ui">
                  No menu items found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-default px-5 py-4 text-sm text-secondary-ui sm:flex-row">
        <p>
          Showing <span className="font-semibold text-primary-ui">{items.length ? 1 : 0}-{items.length}</span> of{" "}
          <span className="font-semibold text-primary-ui">{items.length}</span> items
        </p>
        <div className="flex items-center gap-1">
          <span className="rounded-lg bg-primary-ui px-2.5 py-1 text-xs font-semibold text-white">1</span>
        </div>
      </div>
    </section>
  );
}
