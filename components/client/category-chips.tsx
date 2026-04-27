"use client";

type CategoryChipsProps = {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
};

export function CategoryChips({
  categories,
  active,
  onChange,
}: CategoryChipsProps) {
  return (
    <div className="ui-top-offset sticky z-30 -mx-5 mb-6 overflow-x-auto border-b border-default bg-app px-5 py-3">
      <div className="flex gap-2">
        {categories.map((category) => {
          const isActive = active === category;
          return (
            <button
              type="button"
              key={category}
              onClick={() => onChange(category)}
              className={`ui-chip ${isActive ? "ui-chip-active" : "ui-chip-inactive"}`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
