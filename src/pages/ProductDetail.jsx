import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Truck, RotateCcw, ArrowLeft, Heart, ChevronDown } from "lucide-react";
import { useFavorites } from "@/lib/FavoritesContext";
import { useCurrency } from "@/lib/CurrencyContext";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import ProductCard from "@/components/ddouble/ProductCard";
import FadeIn from "@/components/ddouble/FadeIn";
import Price from "@/components/ddouble/Price";
import StockIndicator from "@/components/ddouble/StockIndicator";
import StickyAddToCart from "@/components/ddouble/StickyAddToCart";
import { useProduct, useAllProducts } from "@/hooks/useProducts";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import { useToast } from "@/components/ui/use-toast";

const LIFESTYLE_IMAGES = {
  galleryWall: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/8140dfca5_generated_d1feca24.png",
};

export default function ProductDetail() {
  const { handle } = useParams();
  const { country } = useCurrency();
  const { data: product, isLoading } = useProduct(handle, country);
  const { data: allProducts } = useAllProducts(country);
  const { addItem, loading: cartLoading } = useShopifyCart(country);
  const { toast } = useToast();

  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showRoom, setShowRoom] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const isFav = isFavorite(product?.id);
  const sentinelRef = useRef(null);

  const handleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(product);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 350);
  };

  useEffect(() => {
    if (!product) return;
    setSelectedOptions((prev) => {
      const next = { ...prev };
      let changed = false;
      product.options.forEach((opt) => {
        if (!(opt.name in next) && opt.values.length > 0) {
          next[opt.name] = opt.values[0];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const optionNames = Object.keys(selectedOptions);
    if (optionNames.length === 0) return product.variants[0] || null;
    return product.variants.find((v) =>
      optionNames.every((name) =>
        v.selectedOptions.some((o) => o.name === name && o.value === selectedOptions[name])
      )
    );
  }, [product, selectedOptions]);

  useEffect(() => {
    setSelectedImage(null);
  }, [selectedOptions]);

  const displayImage = useMemo(() => {
    if (selectedImage !== null && product?.images[selectedImage]) {
      return product.images[selectedImage].url;
    }
    if (selectedVariant?.image?.url) {
      return selectedVariant.image.url;
    }
    return product?.images[0]?.url || product?.image;
  }, [selectedImage, selectedVariant, product]);

  const matchedThumb = useMemo(() => {
    if (selectedImage !== null) return selectedImage;
    if (!selectedVariant?.image?.url || !product?.images) return null;
    const idx = product.images.findIndex((img) => img.url === selectedVariant.image.url);
    return idx !== -1 ? idx : null;
  }, [selectedImage, selectedVariant, product]);

  const related = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter((p) => p.handle !== product.handle)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allProducts, product]);

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
        description: "Please select all product options",
        variant: "destructive",
      });
      return;
    }
    try {
      const optionSummary = Object.values(selectedOptions).join(", ");
      await addItem(selectedVariant.id, quantity);
      toast({
        title: "Added to cart",
        description: optionSummary ? `${product.title} — ${optionSummary}` : product.title,
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
                priceCurrency: product.currency || "USD",
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
                  src={showRoom ? LIFESTYLE_IMAGES.galleryWall : displayImage}
                  alt={selectedVariant?.image?.altText || product.title}
                  className="w-full transition-transform duration-700"
                  style={{ transform: showRoom ? `scaleX(-1) ${zoomed ? 'scale(1.5)' : 'scale(1)'}` : zoomed ? 'scale(1.5)' : 'scale(1)' }}
                />
              </div>
            </FadeIn>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setShowRoom(false); }}
                    className={`w-20 h-20 border transition-colors overflow-hidden ${
                      matchedThumb === i && !showRoom ? "border-[#1A1A1A]" : "border-[#E5E5E1]"
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
              <p className="mt-4 text-xl text-[#1A1A1A]"><Price amount={displayPrice} /></p>

              <StockIndicator variant={selectedVariant} />

              {/* Product Options */}
              {product.options.map((option, idx) => (
                option.values.length > 1 && (
                  <div key={option.name} className={idx === 0 ? "mt-8" : "mt-6"}>
                    <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-3">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                          className={`px-4 py-2.5 text-xs border transition-all duration-200 ${
                            selectedOptions[option.name] === value
                              ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                              : "border-[#E5E5E1] text-[#6B6B67] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}

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
                {cartLoading ? "Adding..." : `Add to Cart — `}
                {!cartLoading && <Price amount={displayPrice} />}
              </button>
              <div ref={sentinelRef} className="h-px md:hidden" />

              {/* Shipping info */}
              <div className="mt-8 pt-8 border-t border-[#E5E5E1] space-y-4">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-[#6B6B67]" />
                  <span className="text-sm text-[#6B6B67]">Free shipping on orders over <Price amount={100} /></span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={16} className="text-[#6B6B67]" />
                  <span className="text-sm text-[#6B6B67]">30-day hassle-free returns</span>
                </div>
              </div>

              {/* Estimated Delivery */}
              <EstimatedDelivery />
            </FadeIn>
          </div>
        </div>

        {/* Accordions */}
        <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
          <FadeIn>
            <div className="space-y-16">
            {product.descriptionHtml && (
              <AccordionSection
                title="About this print"
                isOpen={activeAccordion === "description"}
                onToggle={() => setActiveAccordion(activeAccordion === "description" ? null : "description")}
              >
                <div
                  className="prose prose-sm max-w-3xl text-[#1A1A1A] leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </AccordionSection>
            )}
            <AccordionSection
              title="Materials"
              isOpen={activeAccordion === "materials"}
              onToggle={() => setActiveAccordion(activeAccordion === "materials" ? null : "materials")}
            >
              <MaterialsContent />
            </AccordionSection>
            <AccordionSection
              title="Shipping & Returns"
              isOpen={activeAccordion === "shipping"}
              onToggle={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
            >
              <ShippingReturnsContent />
            </AccordionSection>
            <AccordionSection
              title="Care Instructions"
              isOpen={activeAccordion === "care"}
              onToggle={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
            >
              <CareContent />
            </AccordionSection>
            </div>
          </FadeIn>
        </section>
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

      <StickyAddToCart
        product={product}
        selectedVariant={selectedVariant}
        selectedOptions={selectedOptions}
        options={product.options}
        displayPrice={displayPrice}
        handleAddToCart={handleAddToCart}
        cartLoading={cartLoading}
        sentinelRef={sentinelRef}
      />

      <Footer />
    </div>
  );
}

function AccordionSection({ title, isOpen, onToggle, children }) {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  const handleToggle = () => onToggle();

  return (
    <div>
      <button
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); } }}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full text-left cursor-pointer group"
      >
        <h2 className="text-2xl md:text-3xl font-light text-[#1A1A1A]">{title}</h2>
        <ChevronDown
          size={20}
          className={`text-[#6B6B67] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function MaterialsContent() {
  const items = ["Premium cotton blend", "Soft-touch fabric", "Durable construction"];

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-[#1A1A1A] leading-relaxed flex items-start gap-3">
          <span className="w-1 h-1 rounded-full bg-[#1A1A1A] mt-2 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ShippingReturnsContent() {
  const items = [
    <>
      Free shipping on orders over <Price amount={100} />
    </>,
    "Orders dispatched within 1–2 business days",
    "Returns accepted within 30 days",
    "Secure tracked shipping",
  ];

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-[#1A1A1A] leading-relaxed flex items-start gap-3">
          <span className="w-1 h-1 rounded-full bg-[#1A1A1A] mt-2 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function CareContent() {
  const items = [
    "Machine wash cold",
    "Wash inside out",
    "Do not bleach",
    "Hang dry recommended",
    "Iron on low heat",
  ];

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-[#1A1A1A] leading-relaxed flex items-start gap-3">
          <span className="w-1 h-1 rounded-full bg-[#1A1A1A] mt-2 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function getDeliveryRange(minDays, maxDays) {
  const today = new Date();
  const locales = "en-GB";
  const opts = { day: "numeric", month: "short" };
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  return `${minDate.toLocaleDateString(locales, opts)} – ${maxDate.toLocaleDateString(locales, opts)}`;
}

function EstimatedDelivery() {
  const regions = [
    { name: "United Kingdom", range: getDeliveryRange(2, 5) },
    { name: "Europe", range: getDeliveryRange(4, 7) },
  ];

  return (
    <div className="mt-8 pt-8 border-t border-[#E5E5E1]">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-3">Estimated Delivery</h3>
      <div className="space-y-2">
        {regions.map((region) => (
          <div key={region.name} className="flex items-center gap-3">
            <Truck size={16} className="text-[#6B6B67] shrink-0" />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm text-[#1A1A1A]">{region.name}</span>
              <span className="text-xs text-[#6B6B67]">{region.range}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}