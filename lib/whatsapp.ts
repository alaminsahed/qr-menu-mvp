export type OrderLine = {
  name: string;
  quantity: number;
};

export function buildWhatsAppMessage(params: {
  orderType: "dinein" | "delivery";
  table?: string;
  address?: string;
  lines: OrderLine[];
  total: number;
}) {
  const header =
    params.orderType === "delivery"
      ? `Delivery\nAddress: ${params.address || "N/A"}`
      : `Table ${params.table || "N/A"}`;

  const orderLines = params.lines.map(
    (line) => `${line.quantity}x ${line.name}`,
  );

  return [header, ...orderLines, `Total: ${params.total} BDT`].join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string) {
  const normalized = phoneNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
