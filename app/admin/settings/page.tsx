import { AdminCard } from "@/app/admin/_components/admin-primitives";

export default function AdminSettingsPage() {
  return (
    <AdminCard
      title="Restaurant settings"
      description="Settings editor scaffolding is ready for backend integration."
    >
      <p className="ui-text-body-sm">
        Contact info, hours, and profile fields will be added next.
      </p>
    </AdminCard>
  );
}
