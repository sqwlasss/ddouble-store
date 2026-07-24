import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/FavoritesContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useAllProducts } from "@/hooks/useProducts";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import ProductCard from "@/components/ddouble/ProductCard";

export default function Favorites() {
  const { favorites, favoritesCount } = useFavorites();
  const { country } = useCurrency();
  const { data: allProducts } = useAllProducts(country);

  const liveProducts = useMemo(() => {
    if (!allProducts) return favorites;
    const productMap = new Map(allProducts.map((p) => [p.id, p]));
    return favorites.map((fav) => productMap.get(fav.id) || fav);
  }, [allProducts, favorites]);

  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Navbar />
      <main>
        <div className="pt-28 md:pt-36 pb-24 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          {favorites.length === 0 ? (
            <div className="py-24 text-center">
              <Heart
                size={48}
                className="mx-auto text-[#D9D2C5] mb-6"
              />
              <h1 className="text-2xl font-light text-[#1A1A1A] mb-3">
                Your favorites list is empty.
              </h1>
              <p className="text-sm text-[#6B6B67] mb-8">
                Save your favorite prints by tapping the heart icon.
              </p>
              <Link
                to="/shop"
                className="inline-block text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#1A1A1A]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-12 md:mb-16">
                <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">
                  Favorites
                </h1>
                <p className="mt-2 text-sm text-[#6B6B67]">
                  {favoritesCount} {favoritesCount === 1 ? "print" : "prints"}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {liveProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showHeart />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}