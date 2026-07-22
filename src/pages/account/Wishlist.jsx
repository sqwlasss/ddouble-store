import { useState } from "react";
import { Heart, ShoppingBag, X, Loader2 } from "lucide-react";
import { useAccount } from "@/lib/AccountContext";
import { removeFromWishlist } from "@/lib/shopify/wishlist";
import { useAllProducts } from "@/hooks/useProducts";
import { usePersistentCart } from "@/hooks/usePersistentCart";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function Wishlist() {
  const { wishlist } = useAccount();
  const { data: allProducts, isLoading } = useAllProducts();
  const { addItem } = usePersistentCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(null);

  const wishlistProducts = (allProducts || []).filter((product) => {
    const variantIds = product.variants.map((v) => v.id);
    return variantIds.some((id) => wishlist.includes(id));
  });

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants.find((v) => v.availableForSale) || product.variants[0];
    if (!variant) return;
    setAdding(variant.id);
    try {
      await addItem(variant.id, 1);
      toast({ title: "Added to cart", description: `${product.title} has been added.` });
    } catch {
      toast({ title: "Error", description: "Could not add to cart.", variant: "destructive" });
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const variantIds = product.variants.map((v) => v.id);
    variantIds.forEach((id) => removeFromWishlist(id));
    toast({ title: "Removed from wishlist" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[#6B6B67]" />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart size={40} className="mx-auto text-[#D9D2C5] mb-4" />
        <h2 className="text-xl font-light text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
        <p className="text-sm text-[#6B6B67] mb-6">Save your favorite prints by tapping the heart icon.</p>
        <button
          onClick={() => navigate("/shop")}
          className="text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#1A1A1A]"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">
        Wishlist ({wishlistProducts.length})
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {wishlistProducts.map((product) => (
          <Link
            key={product.handle}
            to={`/product/${product.handle}`}
            className="group block"
          >
            <div className="relative overflow-hidden bg-[#F1F0EC]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <button
                onClick={(e) => handleRemove(product, e)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from wishlist"
              >
                <X size={14} className="text-[#1A1A1A]" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-sm font-medium text-[#1A1A1A] tracking-wide">{product.title}</h3>
              <p className="text-sm text-[#6B6B67]">From {product.price} lei</p>
              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={adding === product.variants[0]?.id}
                className="mt-2 w-full bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.15em] py-3 hover:bg-[#D9D2C5] hover:text-[#1A1A1A] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {adding === product.variants[0]?.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <ShoppingBag size={12} />
                )}
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
