import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Truck, RotateCcw, ArrowLeft, Heart } from "lucide-react";
import { useFavorites } from "@/lib/FavoritesContext";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import ProductCard from "@/components/ddouble/ProductCard";
import FadeIn from "@/components/ddouble/FadeIn";
import { useProduct, useAllProducts } from "@/hooks/useProducts";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import { useToast } from "@/components/ui/use-toast";

const LIFESTYLE_IMAGES = {
  galleryWall: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/8140dfca5_generated_d1feca24.png",
};

export default function ProductDetail() {
  const { handle } = useParams();
  const { data: product, isLoading } = useProduct(handle);
  const { data: allProducts } = useAllProducts();
  const { addItem, loading: cartLoading } = useShopifyCart();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showRoom, setShowRoom] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const isFav = isFavorite(product?.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(product);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 350);
  };

  const sizes = product ? (product.sizes.length > 0 ? product.sizes : [{ label: "Default", value: "Default" }]) : [];
  const papers = product ? (product.papers.length > 0 ? product.papers : [{ label: "Default", value: "Default" }]) : [];

  useEffect(() => {
    if (product && !selectedSize && sizes.length > 0) {
      setSelectedSize(sizes[0].value);
    }
    if (product && !selectedPaper && papers.length > 0) {
      setSelectedPaper(papers[0].value);
    }
  }, [product, selectedSize, selectedPaper]);

  const related = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter((p) => p.handle !== product.handle)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allProducts, product]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedPaper) return null;
    return product.variants.find((v) =>
      v.selectedOptions.some((o) => o.name === "Size" && o.value === selectedSize) &&
      v.selectedOptions.some((o) => o.name === "Paper" && o.value === selectedPaper)
    );
  }, [product, selectedSize, selectedPaper]);

  if (isLoading) {
    return (
      <div className="bg-[#F9F9F7] min-h-screen">
        <Navbar />
        <div className="pt-40 text-center px-6">
          <div className="w-8 h-8 border-4 border-[#E5E5E1] border-t-[#1A1A1A] rounded-full animate-spin mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F9F9F7] min-h-screen">
        <Navbar />
        <div className="pt-40 text-center px-6">
          <h1 className="text-2xl font-light text-[#1A1A1A]">Product not found</h1>
          <Link
            to="/shop"
            className="mt-4 inline-block text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#6B6B67]"
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPrice = selectedVariant
    ? selectedVariant.price
    : product.price;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        title: "Select options",
        description: "Please select a size and paper type",
        variant: "destructive",
      });
      return;
    }
    try {
      await addItem(selectedVariant.id, quantity);
      toast({
        title: "Added to cart",
        description: `${product.title} — ${selectedSize}, ${selectedPaper}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Navbar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              description: product.description || product.title,
              image: product.image,
              url: `https://ddouble-store.vercel.app/product/${product.handle}`,
              brand: { "@type": "Brand", name: "DDouble" },
              offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "MDL",
                availability: "https://schema.org/InStock",
                url: `https://ddouble-store.vercel.app/product/${product.handle}`,
              },
            }),
          }}
        />

      <main>
      <div className="pt-24 md:pt-28 max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <div className="px-6 md:px-10 lg:px-16 py-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft size={12} /> Back to Shop
          </Link>
        </div>

        {/* Main */}
        <div className="flex flex-col lg:flex-row">
          {/* Gallery */}
          <div className="lg:w-[58%] px-6 md:px-10 lg:pl-16 lg:pr-0">
            <FadeIn>
              <div
                className={`relative overflow-hidden bg-[#F1F0EC] cursor-zoom-in ${zoomed ? "cursor-zoom-out" : ""}`}
                onClick={() => setZoomed(!zoomed)}
              >
                <img
                  src={showRoom ? LIFESTYLE_IMAGES.galleryWall : (product.images[selectedImage]?.url || product.image)}
                  alt={product.title}
                  className={`w-full transition-transform duration-700 ${zoomed ? "scale-150" : "scale-100"}`}
                />
              </div>
            </FadeIn>
            {/* Toggle view */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setShowRoom(false); }}
                    className={`w-20 h-20 border transition-colors overflow-hidden ${
                      selectedImage === i && !showRoom ? "border-[#1A1A1A]" : "border-[#E5E5E1]"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRoom(false)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] border transition-colors ${
                  !showRoom ? "border-[#1A1A1A] text-[#1A1A1A]" : "border-[#E5E5E1] text-[#6B6B67]"
                }`}
              >
                Product
              </button>
              <button
                onClick={() => setShowRoom(true)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] border transition-colors ${
                  showRoom ? "border-[#1A1A1A] text-[#1A1A1A]" : "border-[#E5E5E1] text-[#6B6B67]"
                }`}
              >
                View in Room
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-[42%] px-6 md:px-10 lg:px-16 py-8 lg:py-0 lg:sticky lg:top-28 lg:self-start">
            <FadeIn delay={0.1}>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">{product.title}</h1>
                <button
                  onClick={handleFavorite}
                  className="mt-1 shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-[#E5E5E1] hover:border-[#1A1A1A] transition-colors"
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    size={18}
                    className={`${heartAnimating ? "animate-heart-pop" : ""} ${
                      isFav ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#1A1A1A]"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-4 text-xl text-[#1A1A1A]">{displayPrice} lei</p>

              {/* Size */}
              {sizes.length > 1 && (
                <div className="mt-8">
                  <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size.value)}
                        className={`px-4 py-2.5 text-xs border transition-all duration-200 ${
                          selectedSize === size.value
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                            : "border-[#E5E5E1] text-[#6B6B67] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Paper */}
              {papers.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-3">Paper</h3>
                  <div className="flex flex-wrap gap-2">
                    {papers.map((paper) => (
                      <button
                        key={paper.value}
                        onClick={() => setSelectedPaper(paper.value)}
                        className={`px-4 py-2.5 text-xs border transition-all duration-200 ${
                          selectedPaper === paper.value
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                            : "border-[#E5E5E1] text-[#6B6B67] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                        }`}
                      >
                        {paper.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-3">Quantity</h3>
                <div className="inline-flex items-center border border-[#E5E5E1]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant}
                className="mt-8 w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] py-4 hover:bg-[#D9D2C5] hover:text-[#1A1A1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cartLoading ? "Adding..." : `Add to Cart — ${displayPrice} lei`}
              </button>

              {/* Shipping info */}
              <div className="mt-8 pt-8 border-t border-[#E5E5E1] space-y-4">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-[#6B6B67]" />
                  <span className="text-sm text-[#6B6B67]">Free shipping on orders over 100 lei</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={16} className="text-[#6B6B67]" />
                  <span className="text-sm text-[#6B6B67]">30-day hassle-free returns</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Description */}
        {product.descriptionHtml && (
          <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-light text-[#1A1A1A] mb-8">About this print</h2>
              <div
                className="prose prose-sm max-w-3xl text-[#1A1A1A] leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </FadeIn>
          </section>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[#E5E5E1] mt-16">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-light text-[#1A1A1A] mb-12">You may also like</h2>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {related.map((p, i) => (
                <FadeIn key={p.handle} delay={i * 0.08}>
                  <ProductCard product={p} index={i} />
                </FadeIn>
              ))}
            </div>
          </section>
        )}
      </div>
      </main>

      <Footer />
    </div>
  );
}
