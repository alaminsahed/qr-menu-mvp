import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/app/admin/_components/admin-nav";
import { FormSubmitButton } from "@/app/admin/_components/form-submit-button";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAdminRestaurant } from "@/lib/admin/get-restaurant";

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

  const member = await getAdminRestaurant(supabase);
  if (!member) redirect("/login?error=unauthorized");

  const serviceClient = createServiceRoleClient();
  const { data: restaurantSettings } = await serviceClient
    .from("restaurant_settings")
    .select("restaurant_name, logo_url")
    .eq("restaurant_id", member.restaurant_id)
    .maybeSingle();

  const restaurantName =
    restaurantSettings?.restaurant_name?.trim() ||
    member.restaurant.name ||
    "Your Restaurant";
  const logoUrl = restaurantSettings?.logo_url?.trim() || null;

  async function signOut() {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f5] text-primary-ui">
      <aside className="hidden w-64 flex-col bg-[#f8f7f4] p-4 shadow-[6px_0_20px_rgba(15,23,42,0.06)] lg:flex">
        <div className="mb-6 flex items-center gap-3 px-2">
          {logoUrl ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
              <Image
                src={logoUrl}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-ui text-white">
              <span className="material-symbols-outlined text-xl">
                restaurant
              </span>
            </div>
          )}
          <div>
            <p className="text-xl font-bold leading-tight text-primary-ui">
              {restaurantName}
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-ui">
              Restaurateur Suite
            </p>
          </div>
        </div>

        <div className="flex-1">
          <AdminNav />
        </div>

        <div className="mt-4 pt-4">
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-secondary-ui">
              <span className="material-symbols-outlined text-xl">
                account_circle
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary-ui">
                Administrator
              </p>
              <p className="truncate text-xs text-muted-ui">
                {user.email ?? "Main Kitchen"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 bg-white/80 px-3 shadow-sm backdrop-blur sm:px-6">
          <div className="flex min-h-16 flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-0">
            <div className="relative min-w-0 w-full lg:max-w-lg">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-ui">
                search
              </span>
              <input
                type="text"
                placeholder="Search menu items, ingredients..."
                className="w-full rounded-lg border border-transparent bg-surface-soft py-2 pl-10 pr-4 text-sm text-primary-ui outline-none transition focus:border-default focus:bg-white"
              />
            </div>
            <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 lg:w-auto lg:flex-nowrap">
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-secondary-ui hover:bg-surface-soft"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </button>
              <Link
                href="/menu"
                className="hidden rounded-full border border-default bg-surface px-4 py-2 text-sm font-medium text-secondary-ui hover:bg-surface-soft sm:inline-flex"
              >
                View public menu
              </Link>
              <form action={signOut} className="shrink-0">
                <FormSubmitButton
                  className="cursor-pointer whitespace-nowrap rounded-full bg-primary-ui px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                  pendingChildren={
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined animate-spin text-base">
                        progress_activity
                      </span>
                      Signing out...
                    </span>
                  }
                >
                  Sign out
                </FormSubmitButton>
              </form>
            </div>
          </div>
          <div className="mt-2 pt-3 lg:hidden">
            <AdminNav variant="rail" />
          </div>
        </header>

        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-6">{children}</main>
        <footer className="bg-white px-3 py-4 text-center text-xs uppercase tracking-[0.14em] text-muted-ui shadow-[0_-4px_14px_rgba(15,23,42,0.04)] sm:px-6 sm:py-5">
          © 2024 Bhojon Hub. Artisanal Bangladeshi culinary management platform.
        </footer>
      </div>
    </div>
  );
}
