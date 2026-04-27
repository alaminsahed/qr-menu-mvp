type QuantityPickerProps = {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
};

export function QuantityPicker({
  quantity,
  onAdd,
  onRemove,
}: QuantityPickerProps) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="rounded-full bg-[#8c2d0f] px-5 py-1.5 text-sm font-semibold text-white"
      >
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#f3f0ea] px-1 py-1">
      <button
        type="button"
        onClick={onRemove}
        className="h-7 w-7 rounded-full bg-white text-sm text-[#423733]"
      >
        -
      </button>
      <span className="min-w-7 text-center text-sm font-semibold text-[#3b2f2a]">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onAdd}
        className="h-7 w-7 rounded-full bg-[#8c2d0f] text-sm text-white"
      >
        +
      </button>
    </div>
  );
}
