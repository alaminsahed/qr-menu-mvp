import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/app/admin/_components/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin/is-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=unauthorized");
  const admin = await isAdminUser(supabase, user.id);
  if (!admin) redirect("/login?error=unauthorized");

  async function signOut() {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f5] text-primary-ui">
      <aside className="hidden w-64 flex-col border-r border-default bg-[#f8f7f4] p-4 lg:flex">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-ui text-white">
            <span className="material-symbols-outlined text-xl">restaurant</span>
          </div>
          <div>
            <p className="text-xl font-bold leading-tight text-primary-ui">Bengal Earth</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-ui">
              Restaurateur Suite
            </p>
          </div>
        </div>

        <div className="flex-1">
          <AdminNav />
        </div>

        <div className="mt-4 border-t border-default pt-4">
          <div className="space-y-1">
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-ui hover:bg-surface-soft hover:text-primary-ui"
            >
              <span className="material-symbols-outlined text-base leading-none">help</span>
              Support
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-ui hover:bg-surface-soft hover:text-primary-ui"
            >
              <span className="material-symbols-outlined text-base leading-none">settings</span>
              Settings
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-default bg-white px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-secondary-ui">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary-ui">Administrator</p>
              <p className="truncate text-xs text-muted-ui">{user.email ?? "Main Kitchen"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-default bg-white/80 px-4 backdrop-blur sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-3">
            <div className="relative w-full max-w-lg">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-ui">
                search
              </span>
              <input
                type="text"
                placeholder="Search menu items, ingredients..."
                className="w-full rounded-lg border border-transparent bg-surface-soft py-2 pl-10 pr-4 text-sm text-primary-ui outline-none transition focus:border-default focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-secondary-ui hover:bg-surface-soft"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <Link
                href="/menu"
                className="hidden rounded-full border border-default bg-surface px-4 py-2 text-sm font-medium text-secondary-ui hover:bg-surface-soft sm:inline-flex"
              >
                View public menu
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-primary-ui px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="mt-4 border-t border-default pt-3 lg:hidden">
            <AdminNav />
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
        <footer className="border-t border-default bg-white px-6 py-5 text-center text-xs uppercase tracking-[0.14em] text-muted-ui">
          © 2024 Bhojon Hub. Artisanal Bangladeshi culinary management platform.
        </footer>
      </div>
    </div>
  );
}
