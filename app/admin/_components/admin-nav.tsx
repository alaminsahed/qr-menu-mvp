"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin/menu", label: "Menu Management", icon: "restaurant_menu" },
  { href: "/admin/categories", label: "Categories", icon: "list_alt" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/admin/qr", label: "QR Tools", icon: "qr_code_2" },
] as const;

type AdminNavProps = {
  /** Horizontal pill strip for narrow screens; default stacked links for the sidebar. */
  variant?: "sidebar" | "rail";
};

export function AdminNav({ variant = "sidebar" }: AdminNavProps) {
  const pathname = usePathname();
  const isRail = variant === "rail";

  return (
    <nav
      aria-label="Admin sections"
      className={
        isRail
          ? "flex w-full flex-nowrap gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex w-full flex-col gap-1"
      }
    >
      {ADMIN_LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors sm:gap-3 ${
              isActive
                ? "bg-primary-ui/10 text-primary-ui"
                : "text-secondary-ui hover:bg-surface-soft hover:text-primary-ui"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="material-symbols-outlined text-base leading-none">
              {link.icon}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
