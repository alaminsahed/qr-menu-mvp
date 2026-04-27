"use client";

import Link from "next/link";

type BasketEmptyStateProps = {
  menuHref: string;
};

export function BasketEmptyState({ menuHref }: BasketEmptyStateProps) {
  return (
    <div className="ui-card p-6 text-center">
      <p className="ui-text-body-sm">No product in basket.</p>
      <Link
        href={menuHref}
        className="ui-text-body-sm mt-3 inline-block text-primary-ui underline"
      >
        Go to menu
      </Link>
    </div>
  );
}
