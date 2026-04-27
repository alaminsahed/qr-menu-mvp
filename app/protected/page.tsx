import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function signOut() {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-semibold">Protected page</h1>
      <p className="text-sm text-zinc-600">
        You are signed in as <span className="font-semibold">{user.email}</span>
        .
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
