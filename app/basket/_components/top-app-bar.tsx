import type { ReactNode } from "react";

export function TopAppBar({
  title,
  left,
  right,
}: {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#f7f5f1]/95 px-4 shadow-[0_8px_12px_-10px_rgba(26,26,26,0.12)] backdrop-blur-lg">
      <div className="w-20">{left}</div>
      <h1 className="ui-text-title inline-flex items-center gap-1 text-center">
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-[19px]"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          shopping_basket
        </span>
        {title}
      </h1>
      <div className="flex w-20 justify-end">{right}</div>
    </header>
  );
}
