"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AdminToastProps = {
  status?: string;
  message?: string;
  clearPath: string;
};

export function AdminToast({ status, message, clearPath }: AdminToastProps) {
  const router = useRouter();

  useEffect(() => {
    if (!status || !message) return;

    if (status === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }

    router.replace(clearPath);
  }, [clearPath, message, router, status]);

  return null;
}
