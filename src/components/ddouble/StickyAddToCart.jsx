import { useState, useEffect } from "react";
import Price from "@/components/ddouble/Price";

export default function StickyAddToCart({
  product,
  selectedVariant,
  selectedOptions,
  options,
  displayPrice,
  handleAddToCart,
  cartLoading,
  sentinelRef,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef?.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelRef]);

  const hasOptions = options?.some((opt) => opt.values.length > 1) ?? false;
  const needsSelection = !selectedVariant && hasOptions;

  const variantLabel = Object.values(selectedOptions || {}).filter(Boolean).join(" · ");

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E5E1] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 max-w-[1440px] mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1A1A1A] truncate">
            {product?.title}
          </p>
          {variantLabel && (
            <p className="text-xs text-[#6B6B67] mt-0.5 truncate">{variantLabel}</p>
          )}
          <p className="text-sm text-[#1A1A1A] mt-0.5">
            <Price amount={displayPrice} />
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="shrink-0 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] px-6 py-3 hover:bg-[#2A2A2A] transition-all duration-300 disabled:opacity-50"
        >
          {cartLoading ? "Adding..." : needsSelection ? "Select Options" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}