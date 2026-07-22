import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  toggleWishlist,
} from "@/lib/shopify/wishlist";
import { useAccount } from "@/lib/AccountContext";

export default function ProductCard({ product, index = 0 }) {
  const { wishlist } = useAccount();
  const hasVariantIds = product.variants?.map((v) => v.id) || [];
  const isWished = hasVariantIds.length > 0 && hasVariantIds.some((id) => wishlist.includes(id));

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariantIds.length > 0) {
      toggleWishlist(hasVariantIds[0]);
    }
  };

  return (
    <Link to={`/product/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-[#F1F0EC]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full aspect-[3/4] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading={index < 4 ? "eager" : "lazy"}
        />
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={isWished ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#1A1A1A]"}
          />
        </button>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-[#1A1A1A] tracking-wide">{product.title}</h3>
        <p className="text-sm text-[#6B6B67]">From {product.price} lei</p>
      </div>
    </Link>
  );
}
