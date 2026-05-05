import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tab Bite — Modern QR Ordering for Restaurants",
  description:
    "Per-table QR menus and WhatsApp ordering for restaurants: guests scan at their table, you see the right table number, and you can run dine-in or local delivery without marketplace commission.",
};

const JOURNEY = [
  {
    icon: "qr_code_2",
    title: "Scan the Table’s QR",
    body: "Print a different code per table or zone. Guests open your menu in the browser—no app install.",
  },
  {
    icon: "shopping_basket",
    title: "Order in WhatsApp with the Table #",
    body: "The link carries the table number, so staff see exactly where to serve or pack—no guessing at the counter.",
  },
  {
    icon: "local_dining",
    title: "Serve the Table or Send a Rider",
    body: "Dine-in goes to the right table. For delivery, your local rider WhatsApp group handles the run—still no marketplace commission.",
  },
];

const HIGHLIGHTS = [
  "No app install for guests",
  "Per-table QR so orders match the right table",
  "Bangla + English menu",
];

const METRICS = [
  { label: "Commission Fees", value: "0%" },
  { label: "Free Trial", value: "3 months" },
  { label: "Monthly Plan", value: "৳200" },
] as const;

const COST_SAVINGS = [
  {
    icon: "percent",
    title: "No Third-Party Commission",
    body: "Keep your margin. Guests order directly instead of through marketplaces that charge 15-30%.",
  },
  {
    icon: "schedule",
    title: "Save Waiter Time",
    body: "Guests browse and place orders themselves, so staff can focus on service quality and table turnover.",
  },
  {
    icon: "hourglass_bottom",
    title: "No Counter Waiting Line",
    body: "Orders start from the table. Less crowd at the counter means faster operations in peak hours.",
  },
  {
    icon: "groups",
    title: "Use a Local Rider WhatsApp Group",
    body: "Create your own nearby rider network and dispatch quickly without paying platform delivery commissions.",
  },
] as const;

const FEATURES = [
  {
    icon: "language",
    title: "Bilingual Menu",
    body: "Bangla and English toggle on every page.",
  },
  {
    icon: "image",
    title: "Food Photography",
    body: "Upload item images directly from the admin workspace.",
  },
  {
    icon: "category",
    title: "Category Management",
    body: "Create, reorder, and rename categories in seconds.",
  },
  {
    icon: "toggle_on",
    title: "Availability Toggle",
    body: "Mark items sold-out in real time without deleting them.",
  },
  {
    icon: "local_dining",
    title: "Dine-in & Delivery",
    body: "Guests pick order type and enter their table or address.",
  },
  {
    icon: "lock",
    title: "Secure Admin Panel",
    body: "Staff-only workspace with Supabase auth protecting all data.",
  },
];

const MOCK_ITEMS = [
  { name: "Beef Bhuna", price: "৳220", available: true },
  { name: "Chicken Rezala", price: "৳180", available: true },
  { name: "Dal Tadka", price: "৳120", available: false },
];

const PRICING_INCLUDES =
  "Includes your domain, hosting, and Tab Bite — no separate domain or hosting bills.";

const PRICING = [
  {
    name: "Free Trial",
    price: "Free",
    period: "for 3 months",
    detail:
      "Full access while you launch. Domain and hosting are included during the trial at no extra cost.",
    badge: "Start Here" as const,
    highlight: false,
    ctaDisabled: false,
  },
  {
    name: "Monthly",
    price: "৳200",
    period: "per month",
    detail: `After your trial. ${PRICING_INCLUDES}`,
    badge: null,
    highlight: false,
    ctaDisabled: true,
  },
  {
    name: "Yearly",
    price: "৳2,000",
    period: "per year",
    detail: `Save ৳400 vs twelve monthly payments. ${PRICING_INCLUDES}`,
    badge: "Best Value" as const,
    highlight: true,
    ctaDisabled: true,
  },
] as const;

/** Matches `public/logo/download.png`; keeps Next/Image aspect ratio correct. */
const TAB_BITE_LOGO_PX = { w: 1000, h: 1000 } as const;

export default function Home() {
  return (
    <div className="bg-app min-h-screen overflow-x-hidden font-sans">
      <nav className="lp-fade-up sticky top-0 z-50 border-b border-(--color-border-soft) bg-(--color-bg-app)/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-5">
          <Link
            href="/"
            className="inline-flex items-center gap-3.5 rounded-lg -mx-1.5 -my-1 px-1.5 py-1 text-(--color-action-primary) transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-action-primary)/35"
          >
            <span className="relative inline-block h-18 w-20 shrink-0 overflow-hidden sm:h-18 sm:w-28">
              <Image
                src="/logo/logo3.png"
                alt=""
                width={TAB_BITE_LOGO_PX.w}
                height={TAB_BITE_LOGO_PX.h}
                sizes="(max-width: 640px) 96px, 112px"
                className="h-full w-full origin-center scale-[1.5] object-contain sm:scale-[1.7]"
                priority
              />
            </span>
            <span className="text-sm font-bold tracking-[0.16em] uppercase sm:text-base">
              Tab Bite
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs sm:gap-4 sm:text-sm">
            <Link
              href="/wishlist"
              className="font-medium text-(--color-action-primary) transition-opacity hover:opacity-75"
            >
              Request to Join
            </Link>
            <Link
              href="/login"
              className="text-secondary-ui transition-colors hover:text-primary-ui"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pt-5 pb-16 sm:px-5 sm:pb-20 md:pt-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(140,45,15,0.1)_0%,transparent_70%)] blur-3xl" />
            <div className="absolute -left-14 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(71,100,75,0.08)_0%,transparent_70%)] blur-3xl" />
          </div>

          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2">
            <div>
              <span className="lp-fade-up inline-flex items-center gap-2.5 rounded-2xl border border-(--color-border-default) bg-surface px-3 py-2 text-[11px] font-semibold tracking-wide text-(--color-action-secondary) sm:gap-3 sm:px-4 sm:text-xs">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden sm:h-12 sm:w-12">
                  <Image
                    src="/logo/logo3.png"
                    alt="Tab Bite"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </span>
                Tab Bite for Restaurant Owners
              </span>

              <h1 className="lp-fade-up lp-d1 mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-primary-ui sm:text-4xl md:text-6xl">
                Modern QR Ordering for
                <span className="text-(--color-action-primary)">
                  {" "}
                  Faster Tables
                </span>{" "}
                and Lower Costs
              </h1>

              <p className="lp-fade-up lp-d2 mt-5 max-w-xl text-pretty text-base leading-relaxed text-secondary-ui sm:text-lg">
                Put a QR on each table (or section): guests scan, browse, and
                order in WhatsApp with that table already attached. You skip
                marketplace commission, keep the floor calm, and use your own
                rider group when guests want delivery.
              </p>

              <div className="lp-fade-up lp-d3 mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/wishlist"
                  className="ui-btn-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm transition-transform duration-200 hover:scale-[1.03] sm:w-auto"
                >
                  Request to join
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/menu?table=5"
                  className="inline-flex w-full items-center justify-center gap-1 text-sm font-medium text-secondary-ui transition-colors duration-200 hover:-translate-y-0.5 hover:text-primary-ui sm:w-auto"
                >
                  See Live Demo
                  <span className="material-symbols-outlined text-base">
                    arrow_outward
                  </span>
                </Link>
              </div>

              <ul className="lp-fade-up lp-d4 mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-ui sm:gap-x-5 sm:text-sm">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-(--color-action-secondary)">
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="lp-fade-up lp-d5 mt-8 grid gap-3 sm:grid-cols-3">
                {METRICS.map(({ label, value }) => (
                  <div
                    key={label}
                    className="lp-hover rounded-2xl border border-(--color-border-soft) bg-surface px-4 py-3"
                  >
                    <p className="text-2xl font-semibold text-primary-ui">
                      {value}
                    </p>
                    <p className="text-xs text-secondary-ui">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-slide-left lp-d2 rounded-3xl border border-(--color-border-default) bg-surface p-5 shadow-xl">
              <div className="lp-float rounded-2xl border border-(--color-border-soft) bg-(--color-bg-surface-soft) p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-ui">Table 5</p>
                    <p className="font-semibold text-primary-ui">
                      Bengal Kitchen
                    </p>
                  </div>
                  <span className="rounded-full bg-(--color-action-primary)/10 px-3 py-1 text-xs font-medium text-(--color-action-primary)">
                    Live Order Flow
                  </span>
                </div>

                <div className="space-y-2">
                  {MOCK_ITEMS.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-xl border border-(--color-border-soft) bg-surface p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary-ui">
                          {item.name}
                        </p>
                        <p className="text-xs text-secondary-ui">
                          {item.price}
                        </p>
                      </div>
                      {item.available ? (
                        <span className="rounded-full bg-(--color-action-primary)/15 px-2.5 py-1 text-xs font-medium text-(--color-action-primary)">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-(--color-state-disabled-bg) px-2.5 py-1 text-xs text-muted-ui">
                          Sold Out
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-(--color-action-primary) px-4 py-3 text-white">
                  <p className="text-xs text-white/80">
                    Order sent to WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    2 items • ৳400 • Ready for dispatch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <p className="lp-reveal mb-2 text-center text-xs font-semibold tracking-widest text-(--color-action-secondary) uppercase">
              Table QR to WhatsApp
            </p>
            <h2 className="lp-reveal mb-10 text-center text-2xl font-semibold tracking-tight text-primary-ui sm:text-3xl md:mb-12 md:text-4xl">
              Right Table or Doorstep
            </h2>
            <div className="lp-stagger grid gap-4 md:grid-cols-3">
              {JOURNEY.map(({ icon, title, body }, index) => (
                <div
                  key={title}
                  className="lp-hover relative rounded-(--radius-panel) border border-(--color-border-soft) bg-(--color-bg-app) p-6"
                >
                  <span className="absolute right-5 top-4 text-5xl font-bold text-(--color-border-default)">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-action-primary)/12 text-(--color-action-primary)">
                    <span className="material-symbols-outlined text-xl">
                      {icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-ui">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-ui">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <p className="lp-reveal mb-2 text-center text-xs font-semibold tracking-widest text-(--color-action-secondary) uppercase">
              Cost Savings
            </p>
            <h2 className="lp-reveal mb-4 text-center text-2xl font-semibold tracking-tight text-primary-ui sm:text-3xl md:text-4xl">
              Profit-Boosting by Design
            </h2>
            <p className="lp-reveal mx-auto mb-10 max-w-2xl text-center text-sm text-secondary-ui">
              Tab Bite removes hidden operational costs while making ordering
              faster for both dine-in and delivery customers.
            </p>

            <div className="lp-stagger grid gap-4 sm:grid-cols-2">
              {COST_SAVINGS.map(({ icon, title, body }) => (
                <article
                  key={title}
                  className="lp-hover rounded-(--radius-panel) border border-(--color-border-soft) bg-surface p-6"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-action-primary)/12 text-(--color-action-primary)">
                    <span className="material-symbols-outlined text-xl">
                      {icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-ui">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-ui">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <p className="lp-reveal mb-2 text-center text-xs font-semibold tracking-widest text-(--color-action-secondary) uppercase">
              Product Features
            </p>
            <h2 className="lp-reveal mb-10 text-center text-2xl font-semibold tracking-tight text-primary-ui sm:text-3xl md:mb-12 md:text-4xl">
              Everything Your Team Needs
            </h2>
            <div className="lp-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="lp-hover rounded-(--radius-panel) border border-(--color-border-soft) bg-(--color-bg-app) p-5"
                >
                  <span className="material-symbols-outlined text-2xl text-(--color-action-primary)">
                    {icon}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-primary-ui">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-secondary-ui">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <p className="lp-reveal mb-2 text-center text-xs font-semibold tracking-widest text-(--color-action-secondary) uppercase">
              Pricing
            </p>
            <h2 className="lp-reveal mb-4 text-center text-2xl font-semibold tracking-tight text-primary-ui sm:text-3xl md:text-4xl">
              One Price for Software, Domain, and Hosting
            </h2>
            <p className="lp-reveal mx-auto mb-10 max-w-xl text-center text-sm text-secondary-ui">
              Start free for 3 months, then choose monthly or yearly billing. No
              separate hosting or domain costs.
            </p>
            <div className="lp-stagger grid gap-5 md:grid-cols-3">
              {PRICING.map(
                ({
                  name,
                  price,
                  period,
                  detail,
                  badge,
                  highlight,
                  ctaDisabled,
                }) => (
                  <div
                    key={name}
                    className={`lp-hover relative flex flex-col rounded-(--radius-panel) border p-7 ${
                      highlight
                        ? "border-(--color-action-primary) bg-(--color-bg-surface-soft) shadow-lg ring-1 ring-(--color-action-primary)/20"
                        : "border-(--color-border-default) bg-surface"
                    }`}
                  >
                    {badge ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--color-action-primary) px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                        {badge}
                      </span>
                    ) : null}
                    <h3 className="text-lg font-semibold text-primary-ui">
                      {name}
                    </h3>
                    <p className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-primary-ui">
                        {price}
                      </span>
                      <span className="text-sm text-secondary-ui">
                        {period}
                      </span>
                    </p>
                    <p className="mt-2 flex-1 text-sm text-secondary-ui">
                      {detail}
                    </p>
                    {ctaDisabled ? (
                      <button
                        type="button"
                        disabled
                        className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-(--color-border-default) bg-(--color-state-disabled-bg) px-5 py-3 text-sm font-semibold text-(--color-state-disabled-text)"
                      >
                        Request to Join
                      </button>
                    ) : (
                      <Link
                        href="/wishlist"
                        className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                          highlight
                            ? "bg-(--color-action-primary) text-white"
                            : "border border-(--color-border-default) bg-(--color-bg-app) text-primary-ui"
                        }`}
                      >
                        Request to Join
                      </Link>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="bg-(--color-action-primary) py-16 sm:py-20">
          <div className="lp-reveal mx-auto max-w-3xl px-4 text-center sm:px-5">
            <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20">
              <span className="material-symbols-outlined text-6xl text-white/80 md:text-7xl">
                restaurant_menu
              </span>
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to Modernize Your Restaurant?
            </h2>
            <p className="mt-4 text-white/80">
              Send a join request today. We will help you launch per-table QR
              codes, WhatsApp ordering with table numbers, and your local
              delivery flow when you need it.
            </p>
            <Link
              href="/wishlist"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-(--color-action-primary) transition-transform duration-200 hover:scale-[1.04]"
            >
              Submit a Join Request
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--color-border-soft) bg-surface py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden sm:h-24 sm:w-24">
              <Image
                src="/logo/logo3.png"
                alt="Tab Bite logo"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <p className="text-[0.9rem] font-bold tracking-[0.16em] uppercase text-(--color-action-primary)">
                Tab Bite
              </p>
              <p className="mt-1 text-xs text-muted-ui">
                Modern QR Ordering for Restaurants
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-ui">
            <Link
              href="/wishlist"
              className="transition-colors duration-200 hover:text-primary-ui"
            >
              Join Request
            </Link>
            <Link
              href="/menu?table=5"
              className="transition-colors duration-200 hover:text-primary-ui"
            >
              Demo Menu
            </Link>
            <Link
              href="/login"
              className="transition-colors duration-200 hover:text-primary-ui"
            >
              Login
            </Link>
            <Link
              href="/admin"
              className="transition-colors duration-200 hover:text-primary-ui"
            >
              Admin
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-5 max-w-6xl border-t border-(--color-border-soft) px-4 pt-4 text-xs text-muted-ui sm:px-5">
          © {new Date().getFullYear()} Tab Bite. Built for Restaurants in
          Bangladesh.
        </div>
      </footer>
    </div>
  );
}
