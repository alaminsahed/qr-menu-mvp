"use client";

type CheckoutBarProps = {
  error: string;
  disabled: boolean;
  onOrder: () => void;
};

export function CheckoutBar({ error, disabled, onOrder }: CheckoutBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-3 z-30 mx-auto w-[calc(100%-1rem)] max-w-sm rounded-3xl border border-[#eadfd3]/70 bg-[#fff9f3]/92 p-3.5 shadow-[0_14px_34px_rgba(93,43,21,0.2)] backdrop-blur-xl">
      {error ? <p className="ui-error mb-2">{error}</p> : null}
      <button
        type="button"
        onClick={onOrder}
        className="ui-btn-whatsapp shadow-[0_8px_18px_rgba(86,31,14,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
      >
        Order via WhatsApp
      </button>
    </div>
  );
}
