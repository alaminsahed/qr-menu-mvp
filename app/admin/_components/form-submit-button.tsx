"use client";

import { type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AdminButton } from "@/app/admin/_components/admin-primitives";

type PendingContent = ReactNode | ((pending: boolean) => ReactNode);

type AdminSubmitButtonProps = Omit<ComponentProps<typeof AdminButton>, "type" | "disabled" | "children"> & {
  children: PendingContent;
  pendingChildren?: ReactNode;
  disabled?: boolean;
};

type FormSubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "children"> & {
  children: PendingContent;
  pendingChildren?: ReactNode;
  disabled?: boolean;
};

function resolveChildren(children: PendingContent, pending: boolean) {
  return typeof children === "function" ? children(pending) : children;
}

export function AdminSubmitButton({
  children,
  pendingChildren,
  disabled = false,
  ...props
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" disabled={disabled || pending} {...props}>
      {pending ? pendingChildren ?? resolveChildren(children, true) : resolveChildren(children, false)}
    </AdminButton>
  );
}

export function FormSubmitButton({
  children,
  pendingChildren,
  disabled = false,
  className,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`cursor-pointer disabled:cursor-not-allowed ${className ?? ""}`}
      {...props}
    >
      {pending ? pendingChildren ?? resolveChildren(children, true) : resolveChildren(children, false)}
    </button>
  );
}
