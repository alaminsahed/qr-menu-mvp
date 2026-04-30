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
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
      <header className="ui-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-ui">
            QR Menu Admin
          </p>
          <h1 className="text-xl font-semibold text-primary-ui">Control Panel</h1>
          <p className="text-sm text-secondary-ui">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/menu"
            className="rounded-full border border-default bg-surface px-4 py-2 text-sm font-medium text-secondary-ui hover:bg-surface-soft"
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
      </header>
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}
