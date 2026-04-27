import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/protected");
  }

  async function signInWithEmail(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    if (!email) {
      redirect("/login?error=missing_email");
    }

    const supabaseServer = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await supabaseServer.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    redirect("/login?success=check_email");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="text-sm text-zinc-600">
        Use your email to receive a magic link from Supabase.
      </p>
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
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Send magic link
        </button>
      </form>
      <Link href="/" className="text-sm underline">
        Back home
      </Link>
    </main>
  );
}
