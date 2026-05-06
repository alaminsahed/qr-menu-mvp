import type { Metadata } from "next";
import Link from "next/link";
import { WishlistForm } from "@/app/wishlist/_components/wishlist-form";

export const metadata: Metadata = {
  title: "Wish list — QR Menu",
  description:
    "Restaurant owners: apply for onboarding and early access to QR Menu.",
};

export default function WishlistPage() {
  const formspreeFormId =
    process.env.NEXT_PUBLIC_FORMSPREE_WISHLIST_ID?.trim() || null;

  return (
    <main className="bg-app ui-screen min-h-screen pb-12">
      <div className="mb-8">
        <Link
          href="/"
          className="ui-text-body-sm text-secondary-ui hover:underline"
        >
          ← Back to home
        </Link>
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-primary-ui">
        Join the wish list
      </h1>
      <p className="mb-4 max-w-md ui-text-body-sm text-secondary-ui">
        Restaurant owners: tell us about your venue. We will email you when
        onboarding is available.
      </p>
      <p className="mb-8 max-w-md ui-text-body-sm text-secondary-ui">
        Questions? Email{" "}
        <a
          href="mailto:hello@tapbite.org"
          className="text-primary-ui underline underline-offset-2 hover:no-underline"
        >
          hello@tapbite.org
        </a>{" "}
        or{" "}
        <a
          href="mailto:info@tapbite.org"
          className="text-primary-ui underline underline-offset-2 hover:no-underline"
        >
          info@tapbite.org
        </a>
        .
      </p>
      <WishlistForm formspreeFormId={formspreeFormId} />
    </main>
  );
}
