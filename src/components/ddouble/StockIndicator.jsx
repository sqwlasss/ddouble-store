export default function StockIndicator({ variant }) {
  const quantity = variant?.quantityAvailable;

  let status;
  let dotColor;

  if (variant && !variant.availableForSale) {
    status = "Out of Stock";
    dotColor = "bg-red-500";
  } else if (quantity === undefined || quantity === null) {
    status = "In Stock";
    dotColor = "bg-green-500";
  } else if (quantity === 0) {
    status = "Out of Stock";
    dotColor = "bg-red-500";
  } else if (quantity <= 5) {
    status = `Low Stock — Only ${quantity} left`;
    dotColor = "bg-orange-400";
  } else {
    status = "In Stock";
    dotColor = "bg-green-500";
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="text-xs text-[#6B6B67]">{status}</span>
    </div>
  );
}