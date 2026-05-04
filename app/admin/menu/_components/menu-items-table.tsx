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
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-soft shadow-[inset_0_-1px_0_rgba(15,23,42,0.06)]">
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Item
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Category
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Price (BDT)
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Status
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => {
                const category = categoriesById.get(item.category_id);
                return (
                  <tr
                    key={item.id}
                    className="shadow-[inset_0_-1px_0_rgba(15,23,42,0.05)] transition hover:bg-surface-soft/30 hover:shadow-[inset_0_-1px_0_rgba(15,23,42,0.05),0_6px_14px_rgba(15,23,42,0.06)]"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 overflow-hidden rounded-md border border-default bg-surface-soft">
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
                          <p className="text-xs font-semibold leading-tight text-primary-ui">
                            {item.name_en}
                          </p>
                          <p className="text-[10px] leading-tight text-secondary-ui">{item.name_bn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface-soft px-2.5 py-0.5 text-[10px] font-semibold text-secondary-ui">
                          {category?.name_en ?? "Unknown"}
                        </span>
                        {item.featured ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs font-semibold text-primary-ui">
                      ৳ {item.price.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <form
                        action={onToggleAvailability}
                        className="inline-flex items-center gap-1.5 rounded-full border border-default bg-surface-soft/90 px-2 py-1 shadow-sm"
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_available" value={String(!item.available)} />
                        <span
                          className={`text-[11px] font-semibold tracking-tight ${
                            item.available ? "text-emerald-800" : "text-zinc-600"
                          }`}
                        >
                          {item.available ? "In stock" : "Out"}
                        </span>
                        <button
                          type="submit"
                          className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full shadow-inner transition hover:opacity-95 active:scale-95 ${
                            item.available ? "bg-secondary-ui" : "bg-zinc-300"
                          }`}
                          aria-label={item.available ? "Mark unavailable" : "Mark available"}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition ${
                              item.available ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </form>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <a
                          href={`/admin/menu?edit=${item.id}`}
                          className="inline-flex items-center gap-1 rounded-full border border-primary-ui/25 bg-primary-ui/[0.07] px-2.5 py-1 text-[11px] font-semibold tracking-tight text-primary-ui shadow-sm transition hover:border-primary-ui/40 hover:bg-primary-ui/[0.11] hover:shadow-md active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[16px] opacity-90">edit</span>
                          Edit
                        </a>
                        <form action={onDeleteMenuItem} className="inline-flex">
                          <input type="hidden" name="id" value={item.id} />
                          <AdminButton
                            type="submit"
                            variant="secondary"
                            className="inline-flex h-auto min-h-0! min-w-0! items-center gap-1 rounded-full! border border-red-200/90! bg-red-50/95! px-2.5! py-1! text-[11px] font-semibold tracking-tight text-red-800! shadow-sm! transition hover:border-red-300! hover:bg-red-100! hover:shadow-md active:scale-[0.98]"
                          >
                            <span className="material-symbols-outlined text-[16px] opacity-90">delete</span>
                            Delete
                          </AdminButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-xs text-muted-ui">
                  No menu items found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-1.5 px-3 py-2 text-xs text-secondary-ui shadow-[inset_0_1px_0_rgba(15,23,42,0.06)] sm:flex-row">
        <p className="leading-tight">
          Showing <span className="font-semibold text-primary-ui">{items.length ? 1 : 0}-{items.length}</span> of{" "}
          <span className="font-semibold text-primary-ui">{items.length}</span> items
        </p>
        <div className="flex items-center gap-1">
          <span className="rounded-md bg-primary-ui px-2 py-0.5 text-[10px] font-semibold text-white">1</span>
        </div>
      </div>
    </section>
  );
}
