import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin/is-admin";

export default async function LoginPage({
  searchParams,
}: {
  // Next.js can pass searchParams as an async/dynamic value.
  // Unwrap it before reading properties to avoid runtime errors.
  searchParams?: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error = resolvedSearchParams?.error;

  if (user) {
    const admin = await isAdminUser(supabase, user.id);
    if (admin) redirect("/protected");
    // Avoid redirect loops if we're already on the unauthorized page.
    if (error !== "unauthorized") {
      redirect("/login?error=unauthorized");
    }
  }

  async function signInWithEmail(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email) {
      redirect("/login?error=missing_email");
    }
    if (!password) {
      redirect("/login?error=missing_password");
    }

    const supabaseServer = await createClient();
    const { error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect("/login?error=invalid_credentials");
    }

    redirect("/protected");
  }

  const unauthorized = error === "unauthorized";
  const invalidCredentials = error === "invalid_credentials";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="text-sm text-zinc-600">
        Sign in with email and password (admin only).
      </p>
      {unauthorized ? (
        <p className="text-sm font-medium text-red-600">Access denied.</p>
      ) : null}
      {invalidCredentials ? (
        <p className="text-sm font-medium text-red-600">
          Invalid email or password.
        </p>
      ) : null}
      <form action={signInWithEmail} className="flex flex-col gap-4">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md border px-3 py-2"
        />
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Your password"
          className="rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Sign in
        </button>
      </form>
      <Link href="/" className="text-sm underline">
        Back home
      </Link>
    </main>
  );
}
