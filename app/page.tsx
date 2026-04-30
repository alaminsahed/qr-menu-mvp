import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-6 px-6">
      <h1 className="text-4xl font-semibold">Next.js + Supabase starter</h1>
      <p className="text-zinc-600">
        This project includes an auth starter with a login route, callback
        handler, and protected page.
      </p>
      <div className="flex gap-3">
        <Link href="/menu?table=5" className="rounded-md border px-4 py-2">
          Open customer menu
        </Link>
        <Link
          href="/login"
          className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Go to login
        </Link>
        <Link href="/admin" className="rounded-md border px-4 py-2">
          Open admin panel
        </Link>
      </div>
    </main>
  );
}
