import { type ReactNode } from "react";

type AdminButtonVariant = "primary" | "secondary";

type AdminButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: AdminButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export function AdminButton({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
}: AdminButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-primary-ui text-white hover:opacity-95"
      : "border border-default bg-surface text-secondary-ui hover:bg-surface-soft";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}

type AdminInputProps = {
  id: string;
  name: string;
  type?: "text" | "email" | "number" | "url" | "password";
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
};

export function AdminInput({
  id,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required = false,
}: AdminInputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="ui-input"
    />
  );
}

type AdminFieldProps = {
  label: string;
  htmlFor: string;
  helpText?: string;
  error?: string;
  children: ReactNode;
};

export function AdminField({
  label,
  htmlFor,
  helpText,
  error,
  children,
}: AdminFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-primary-ui">
        {label}
      </label>
      {children}
      {error ? (
        <p className="ui-error" role="alert">
          {error}
        </p>
      ) : null}
      {!error && helpText ? (
        <p className="text-xs text-muted-ui">{helpText}</p>
      ) : null}
    </div>
  );
}

type AdminCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminCard({ title, description, children }: AdminCardProps) {
  return (
    <section className="ui-card flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="ui-text-title">{title}</h2>
        {description ? <p className="ui-text-body-sm">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

type AdminTableProps = {
  columns: string[];
  rows: ReactNode[][];
  emptyMessage?: string;
};

export function AdminTable({
  columns,
  rows,
  emptyMessage = "No records yet.",
}: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-default bg-surface">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-surface-soft">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-secondary-ui"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-default">
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="border-t border-default">
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-muted-ui"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
