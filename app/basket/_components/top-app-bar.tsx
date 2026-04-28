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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#ebe7df] bg-[#f7f5f1]/95 px-4 backdrop-blur-lg">
      <div className="w-20">{left}</div>
      <h1 className="ui-text-title text-center">{title}</h1>
      <div className="flex w-20 justify-end">{right}</div>
    </header>
  );
}
