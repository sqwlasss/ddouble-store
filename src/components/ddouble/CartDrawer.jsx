import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import { Link } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, checkout, loading } = useShopifyCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#F9F9F7] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E1]">
          <h2 className="text-xs uppercase tracking-[0.15em] font-medium">
            Cart ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1 hover:text-[#757571] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={32} className="text-[#D9D2C5]" />
              <p className="text-sm text-[#757571]">Your cart is empty</p>
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
                const options = item.selectedOptions
                  .map((o) => o.value)
                  .join(" · ");
                return (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-24 object-cover bg-[#F1F0EC]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.handle}`}
                          onClick={onClose}
                          className="text-sm font-medium text-[#1A1A1A] truncate pr-2 hover:text-[#757571] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#757571] hover:text-[#1A1A1A] transition-colors flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {options && (
                        <p className="text-xs text-[#757571] mt-1">{options}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 border border-[#E5E5E1]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-[#757571] hover:text-[#1A1A1A]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#757571] hover:text-[#1A1A1A]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{linePrice} lei</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E5E1] px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.1em] text-[#757571]">Subtotal</span>
              <span className="text-lg font-medium">{totalPrice} lei</span>
            </div>
            <p className="text-[11px] text-[#757571]">
              Shipping and taxes calculated at checkout
            </p>
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] py-4 hover:bg-[#D9D2C5] hover:text-[#1A1A1A] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Checkout"}
            </button>
            <button
              onClick={onClose}
              className="w-full text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#757571] py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
