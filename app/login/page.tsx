import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminRestaurant } from "@/lib/admin/get-restaurant";

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
    const admin = await getAdminRestaurant(supabase);
    if (admin) redirect("/admin");
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

    redirect("/admin");
  }

  const unauthorized = error === "unauthorized";
  const invalidCredentials = error === "invalid_credentials";
  const hasError = unauthorized || invalidCredentials;

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "var(--color-bg-app)" }}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--color-action-primary)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--color-action-secondary)" }}
        />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div
          className="ui-card flex flex-col gap-7 px-8 py-9"
          style={{ borderRadius: "var(--radius-panel)" }}
        >
          {/* Brand */}
          <div className="flex flex-col items-center">
            <Link href="/" className="block">
              <Image
                src="/logo/logo3.png"
                alt="Tab Bite"
                width={96}
                height={96}
                className="rounded-xl object-contain"
              />
            </Link>
            <div className="text-center">
              <h1
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Welcome back
              </h1>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Admin portal · Tab Bite
              </p>
            </div>
          </div>

          {/* Error alerts */}
          {hasError && (
            <div
              className="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                background: "#fff1f0",
                borderColor: "#ffc5c0",
                color: "#b42318",
              }}
            >
              <span
                className="material-symbols-outlined mt-px shrink-0"
                style={{ fontSize: 18 }}
              >
                error
              </span>
              <span>
                {unauthorized
                  ? "You don't have permission to access this area."
                  : "Invalid email or password. Please try again."}
              </span>
            </div>
          )}

          {/* Form */}
          <form action={signInWithEmail} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Email address
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ fontSize: 22, color: "var(--color-text-muted)" }}
                >
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="ui-input py-3 text-base transition-shadow focus:outline-none focus:ring-2"
                  style={
                    {
                      paddingLeft: "2.75rem",
                      "--tw-ring-color": "var(--color-action-primary)",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Password
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ fontSize: 22, color: "var(--color-text-muted)" }}
                >
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="ui-input py-3 text-base transition-shadow focus:outline-none focus:ring-2"
                  style={
                    {
                      paddingLeft: "2.75rem",
                      "--tw-ring-color": "var(--color-action-primary)",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="ui-btn-primary mt-1 flex w-full items-center justify-center gap-2 py-3.5 text-base transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer"
            >
              <span
                className="material-symbols-outlined cursor-pointer"
                style={{ fontSize: 22 }}
              >
                login
              </span>
              Sign in
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center ">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm transition-colors hover:underline cursor-pointer"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                arrow_back
              </span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
