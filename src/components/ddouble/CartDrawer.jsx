import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import { useCurrency } from "@/lib/CurrencyContext";
import Price from "@/components/ddouble/Price";
import { Link } from "react-router-dom";
import { shopifyImage } from "@/lib/utils";

export default function CartDrawer({ open, onClose }) {
  const { country } = useCurrency();
  const { items, updateQuantity, removeItem, totalItems, totalPrice, checkout, loading } = useShopifyCart(country);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#F9F9F7] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E1]">
          <h2 className="text-xs uppercase tracking-[0.15em] font-medium">
            Cart ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1 hover:text-[#6B6B67] transition-colors" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={32} className="text-[#D9D2C5]" />
              <p className="text-sm text-[#6B6B67]">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#1A1A1A]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const linePrice = item.price * item.quantity;
                return (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={shopifyImage(item.image, 160)}
                      alt={item.title}
                      className="w-20 h-24 object-cover bg-[#F1F0EC]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.handle}`}
                          onClick={onClose}
                          className="text-sm font-medium text-[#1A1A1A] truncate pr-2 hover:text-[#6B6B67] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#6B6B67] hover:text-[#1A1A1A] transition-colors flex-shrink-0"
                          aria-label="Remove from cart"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {item.selectedOptions && (
                        <p className="text-xs text-[#6B6B67] mt-1">
                          {item.selectedOptions.map((o) => o.value).join(" · ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 border border-[#E5E5E1]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-[#6B6B67] hover:text-[#1A1A1A]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#6B6B67] hover:text-[#1A1A1A]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-medium"><Price amount={linePrice} /></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E5E5E1] px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.1em] text-[#6B6B67]">Subtotal</span>
              <span className="text-lg font-medium"><Price amount={totalPrice} /></span>
            </div>
            <p className="text-[11px] text-[#6B6B67]">
              Shipping and taxes calculated at checkout
            </p>
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] py-4 hover:bg-[#2A2A2A] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Checkout"}
            </button>
            <button
              onClick={onClose}
              className="w-full text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#6B6B67] py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}