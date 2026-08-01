import { Package, ExternalLink, Loader2 } from "lucide-react";
import { useAccount } from "@/lib/AccountContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Price from "@/components/ddouble/Price";
import { shopifyImage } from "@/lib/utils";

const STATUS_COLORS = {
  PAID: "text-green-700 bg-green-50",
  PENDING: "text-yellow-700 bg-yellow-50",
  UNFULFILLED: "text-[#6B6B67] bg-[#F1F0EC]",
  FULFILLED: "text-green-700 bg-green-50",
  CANCELED: "text-red-700 bg-red-50",
  REFUNDED: "text-red-700 bg-red-50",
  PARTIALLY_FULFILLED: "text-blue-700 bg-blue-50",
};

function statusBadge(status) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.UNFULFILLED;
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.05em] ${color}`}>
      {status ? status.replace(/_/g, " ") : "N/A"}
    </span>
  );
}

export default function Orders() {
  const { orders, loading } = useAccount();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[#6B6B67]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={40} className="mx-auto text-[#D9D2C5] mb-4" />
        <h2 className="text-xl font-light text-[#1A1A1A] mb-2">No orders yet</h2>
        <p className="text-sm text-[#6B6B67] mb-6">Start shopping to see your order history.</p>
        <Button onClick={() => navigate("/shop")} variant="outline">
          Browse Shop
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">Order history</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-[#E5E5E1] p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  Order {order.name}
                </p>
                <p className="text-xs text-[#6B6B67] mt-1">
                  {new Date(order.processedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium"><Price amount={order.totalPrice} /></p>
                <div className="mt-1">{statusBadge(order.financialStatus)}</div>
              </div>
            </div>

            {order.lineItems.length > 0 && (
              <div className="border-t border-[#E5E5E1] pt-4 space-y-3">
                {order.lineItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={shopifyImage(item.image, 160)}
                        alt={item.title}
                        className="w-12 h-14 object-cover bg-[#F1F0EC]"
                      />
                    ) : (
                      <div className="w-12 h-14 bg-[#F1F0EC]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1A1A1A] truncate">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-xs text-[#6B6B67]">{item.variantTitle}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#1A1A1A]">x{item.quantity}</p>
                      <p className="text-xs text-[#6B6B67]"><Price amount={item.price} /></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#E5E5E1]">
              <a
                href={order.statusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
              >
                View order status
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
