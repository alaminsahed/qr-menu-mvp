"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/menu", label: "Menu Management", icon: "restaurant_menu" },
  { href: "/admin/categories", label: "Categories", icon: "list_alt" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/admin/qr", label: "QR Tools", icon: "qr_code_2" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex w-full flex-col gap-1">
      {ADMIN_LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
