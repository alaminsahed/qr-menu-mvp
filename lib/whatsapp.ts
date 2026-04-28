export type OrderLine = {
  name: string;
  quantity: number;
};

export function buildWhatsAppMessage(params: {
  orderType: "dinein" | "delivery";
  table?: string;
  address?: string;
  lines: OrderLine[];
  subtotal: number;
  fee: number;
  total: number;
}) {
  const now = new Date();
  const orderTypeLabel =
    params.orderType === "delivery" ? "Delivery" : "At Restaurant";
  const locationLine =
    params.orderType === "delivery"
      ? `Address: ${params.address || "N/A"}`
      : `Table: ${params.table || "N/A"}`;

  const orderLines = params.lines.map(
    (line, index) => `${index + 1}. ${line.name} (Qty: ${line.quantity})`,
  );

  const slipLines = [
    "RECEIPT / ORDER SLIP",
    "------------------------------",
    `Time: ${now.toLocaleString()}`,
    `Type: ${orderTypeLabel}`,
    locationLine,
    "------------------------------",
    "Items:",
    ...orderLines,
    "------------------------------",
    `Subtotal: ${params.subtotal} BDT`,
    `Service/Delivery: ${params.fee} BDT`,
    `TOTAL: ${params.total} BDT`,
    "------------------------------",
    "Please confirm this order.",
  ];

  return `\`\`\`\n${slipLines.join("\n")}\n\`\`\``;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string) {
  const normalized = phoneNumber.replace(/[^\d]/g, "");
  const normalizedMessage = message.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const encodedText = normalizedMessage
    .split("\n")
    .map((line) => encodeURIComponent(line))
    .join("%0A");

  return `https://wa.me/${normalized}?text=${encodedText}`;
}
