import { QrTableGenerator } from "@/app/admin/qr/_components/qr-table-generator";

export default function AdminQrPage() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const initialMenuBaseUrl = configuredSiteUrl ? `${configuredSiteUrl}/menu` : "";

  return (
    <section className="ui-card flex flex-col gap-2">
      <h2 className="text-base font-semibold text-primary-ui">QR tools</h2>
      <QrTableGenerator initialMenuBaseUrl={initialMenuBaseUrl} />
    </section>
  );
}
