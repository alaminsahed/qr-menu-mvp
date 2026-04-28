"use client";

type CheckoutBarProps = {
  error: string;
  disabled: boolean;
  onOrder: () => void;
};

export function CheckoutBar({ error, disabled, onOrder }: CheckoutBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-sm rounded-t-2xl border-t border-[#ebe7df] bg-[#f7f5f1]/95 p-4 shadow-[0_-4px_20px_rgba(172,68,37,0.08)] backdrop-blur-lg">
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
