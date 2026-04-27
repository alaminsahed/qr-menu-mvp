"use client";

type CheckoutBarProps = {
  error: string;
  disabled: boolean;
  onOrder: () => void;
};

export function CheckoutBar({ error, disabled, onOrder }: CheckoutBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-default bg-surface p-4">
      {error ? <p className="ui-error mb-2">{error}</p> : null}
      <button
        type="button"
        onClick={onOrder}
        className="ui-btn-whatsapp disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
      >
        Order via WhatsApp
      </button>
    </div>
  );
}
