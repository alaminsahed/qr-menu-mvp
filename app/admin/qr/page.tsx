import { AdminCard } from "@/app/admin/_components/admin-primitives";
import { QrTableGenerator } from "@/app/admin/qr/_components/qr-table-generator";

export default function AdminQrPage() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const menuBasePath = configuredSiteUrl ? `${configuredSiteUrl}/menu` : "/menu";

  return (
    <AdminCard
      title="QR tools"
      description="Generate table links and print a QR card sheet for each table."
    >
      {!configuredSiteUrl ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Set `NEXT_PUBLIC_SITE_URL` for production-ready absolute links in QR codes.
        </p>
      ) : null}
      <QrTableGenerator initialBasePath={menuBasePath} />
    </AdminCard>
  );
}
