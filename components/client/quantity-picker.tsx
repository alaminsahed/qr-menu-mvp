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
      <button type="button" onClick={onAdd} className="ui-btn-primary text-sm">
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center rounded-full bg-elevated px-1 py-1">
      <button
        type="button"
        onClick={onRemove}
        className="h-8 w-8 rounded-full bg-surface text-sm"
      >
        -
      </button>
      <span className="px-3 text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={onAdd}
        className="h-8 w-8 rounded-full bg-primary-ui text-sm text-white"
      >
        +
      </button>
    </div>
  );
}
