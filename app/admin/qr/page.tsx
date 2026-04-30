import { AdminCard } from "@/app/admin/_components/admin-primitives";

export default function AdminQrPage() {
  return (
    <AdminCard
      title="QR tools"
      description="Table link generator and printable QR sheets will be implemented next."
    >
      <p className="ui-text-body-sm">
        This route is available now inside the shared admin shell.
      </p>
    </AdminCard>
  );
}
