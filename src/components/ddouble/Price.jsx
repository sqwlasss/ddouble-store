import { useCurrency } from "@/lib/CurrencyContext";

export default function Price({ amount, className = "" }) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(amount)}</span>;
}