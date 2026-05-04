import { AdminButton } from "@/app/admin/_components/admin-primitives";
import { type CategoryRow } from "@/app/admin/categories/_components/types";

type CategoriesTableProps = {
  /** Rows to display (may be filtered). */
  categories: CategoryRow[];
  /** Full ordered list for reorder boundary checks. */
  allCategories: CategoryRow[];
  onMoveCategory: (formData: FormData) => Promise<void>;
  onDeleteCategory: (formData: FormData) => Promise<void>;
  onToggleAvailability: (formData: FormData) => Promise<void>;
};

export function CategoriesTable({
  categories,
  allCategories,
  onMoveCategory,
  onDeleteCategory,
  onToggleAvailability,
}: CategoriesTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-soft shadow-[inset_0_-1px_0_rgba(15,23,42,0.06)]">
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Name
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-ui">
                Sort
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
            {categories.length ? (
              categories.map((category) => {
                const globalIndex = allCategories.findIndex((c) => c.id === category.id);
                return (
                <tr
                  key={category.id}
                  className="shadow-[inset_0_-1px_0_rgba(15,23,42,0.05)] transition hover:bg-surface-soft/30 hover:shadow-[inset_0_-1px_0_rgba(15,23,42,0.05),0_6px_14px_rgba(15,23,42,0.06)]"
                >
                  <td className="px-3 py-2">
                    <p className="text-xs font-semibold leading-tight text-primary-ui">{category.name_en}</p>
                    <p className="text-[10px] leading-tight text-secondary-ui">{category.name_bn}</p>
                  </td>
                  <td className="px-3 py-2 text-xs font-semibold text-primary-ui">
                    {category.sort_order}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        category.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <form action={onMoveCategory} className="inline-flex">
                        <input type="hidden" name="id" value={category.id} />
                        <input type="hidden" name="direction" value="up" />
                        <AdminButton
                          type="submit"
                          variant="secondary"
                          disabled={globalIndex <= 0}
                          className="inline-flex h-auto min-h-0! min-w-0! items-center gap-1 rounded-full! border border-violet-200/90! bg-violet-50/95! px-2.5! py-1! text-[11px] font-semibold tracking-tight text-violet-900! shadow-sm! transition hover:border-violet-300! hover:bg-violet-100/95! hover:shadow-md active:scale-[0.98] disabled:border-zinc-200! disabled:bg-zinc-100/80! disabled:text-zinc-400! disabled:opacity-100!"
                        >
                          <span className="material-symbols-outlined text-[16px] opacity-90">arrow_upward</span>
                          Up
                        </AdminButton>
                      </form>
                      <form action={onMoveCategory} className="inline-flex">
                        <input type="hidden" name="id" value={category.id} />
                        <input type="hidden" name="direction" value="down" />
                        <AdminButton
                          type="submit"
                          variant="secondary"
                          disabled={globalIndex < 0 || globalIndex >= allCategories.length - 1}
                          className="inline-flex h-auto min-h-0! min-w-0! items-center gap-1 rounded-full! border border-violet-200/90! bg-violet-50/95! px-2.5! py-1! text-[11px] font-semibold tracking-tight text-violet-900! shadow-sm! transition hover:border-violet-300! hover:bg-violet-100/95! hover:shadow-md active:scale-[0.98] disabled:border-zinc-200! disabled:bg-zinc-100/80! disabled:text-zinc-400! disabled:opacity-100!"
                        >
                          <span className="material-symbols-outlined text-[16px] opacity-90">arrow_downward</span>
                          Down
                        </AdminButton>
                      </form>
                      <a
                        href={`/admin/categories?edit=${category.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-primary-ui/25 bg-primary-ui/[0.07] px-2.5 py-1 text-[11px] font-semibold tracking-tight text-primary-ui shadow-sm transition hover:border-primary-ui/40 hover:bg-primary-ui/[0.11] hover:shadow-md active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[16px] opacity-90">edit</span>
                        Edit
                      </a>
                      <form action={onToggleAvailability} className="inline-flex items-center gap-1.5 rounded-full border border-default bg-surface-soft/90 px-2 py-1 shadow-sm">
                        <input type="hidden" name="id" value={category.id} />
                        <input
                          type="hidden"
                          name="next_is_active"
                          value={String(!category.is_active)}
                        />
                        <span
                          className={`text-[11px] font-semibold tracking-tight ${
                            category.is_active ? "text-emerald-800" : "text-zinc-600"
                          }`}
                        >
                          {category.is_active ? "On" : "Off"}
                        </span>
                        <button
                          type="submit"
                          className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full shadow-inner transition hover:opacity-95 active:scale-95 ${
                            category.is_active ? "bg-secondary-ui" : "bg-zinc-300"
                          }`}
                          aria-label={category.is_active ? "Disable category" : "Enable category"}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition ${
                              category.is_active ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </form>
                      <form action={onDeleteCategory} className="inline-flex">
                        <input type="hidden" name="id" value={category.id} />
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
                <td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-ui">
                  No categories found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-1.5 px-3 py-2 text-xs text-secondary-ui shadow-[inset_0_1px_0_rgba(15,23,42,0.06)] sm:flex-row">
        <p className="leading-tight">
          Showing{" "}
          <span className="font-semibold text-primary-ui">
            {categories.length ? 1 : 0}-{categories.length}
          </span>{" "}
          of <span className="font-semibold text-primary-ui">{categories.length}</span> categories
        </p>
        <div className="flex items-center gap-1">
          <span className="rounded-md bg-primary-ui px-2 py-0.5 text-[10px] font-semibold text-white">
            1
          </span>
        </div>
      </div>
    </section>
  );
}
