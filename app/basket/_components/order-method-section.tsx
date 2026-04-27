"use client";

type OrderMethodSectionProps = {
  orderType: "dinein" | "delivery";
  tableFromQuery: string;
  table: string;
  address: string;
  onSelectDinein: () => void;
  onSelectDelivery: () => void;
  onTableChange: (value: string) => void;
  onAddressChange: (value: string) => void;
};

export function OrderMethodSection({
  orderType,
  tableFromQuery,
  table,
  address,
  onSelectDinein,
  onSelectDelivery,
  onTableChange,
  onAddressChange,
}: OrderMethodSectionProps) {
  return (
    <section className="ui-panel space-y-3">
      <h2 className="ui-text-title">Order Method</h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSelectDinein}
          className={`flex-1 ${
            orderType === "dinein" ? "ui-btn-primary" : "ui-btn-secondary"
          }`}
        >
          At Restaurant
        </button>
        <button
          type="button"
          onClick={onSelectDelivery}
          className={`flex-1 ${
            orderType === "delivery" ? "ui-btn-primary" : "ui-btn-secondary"
          }`}
        >
          Delivery
        </button>
      </div>

      {orderType === "dinein" ? (
        tableFromQuery ? (
          <div className="ui-input bg-elevated">Table {tableFromQuery}</div>
        ) : (
          <input
            type="text"
            value={table}
            onChange={(e) => onTableChange(e.target.value)}
            placeholder="Table number"
            className="ui-input"
          />
        )
      ) : (
        <textarea
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Delivery address"
          className="ui-input min-h-24"
        />
      )}
    </section>
  );
}
