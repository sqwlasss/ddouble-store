import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Truck, RotateCcw, Heart, ChevronDown } from "lucide-react";
import { useFavorites } from "@/lib/FavoritesContext";
import { useCurrency } from "@/lib/CurrencyContext";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import ProductCard from "@/components/ddouble/ProductCard";
import FadeIn from "@/components/ddouble/FadeIn";
import Price from "@/components/ddouble/Price";
import StockIndicator from "@/components/ddouble/StockIndicator";
import StickyAddToCart from "@/components/ddouble/StickyAddToCart";
import Breadcrumb from "@/components/ddouble/Breadcrumb";
import { useProduct, useAllProducts } from "@/hooks/useProducts";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import Seo from "@/components/Seo";
import { useToast } from "@/components/ui/use-toast";
import { shopifyImage } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, STORE_CURRENCY } from "@/config/shipping";
import DOMPurify from "dompurify";

const SITE_URL = "https://ddouble-store.vercel.app";

export default function ProductDetail() {
  const { handle } = useParams();
  const { country, formatPrice } = useCurrency();
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

  const productSchema = useMemo(() => {
    if (!product) return null;
    const variant = selectedVariant || product.variants[0];
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description || product.title,
      image: product.image,
      url: `https://ddouble-store.vercel.app/product/${product.handle}`,
      brand: { "@type": "Brand", name: "DDouble" },
      offers: {
        "@type": "Offer",
        price: variant?.price ?? product.price,
        priceCurrency: STORE_CURRENCY,
        availability: variant?.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: `https://ddouble-store.vercel.app/product/${product.handle}`,
      },
    };
  }, [product, selectedVariant]);

  const breadcrumbJsonLd = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
        { "@type": "ListItem", position: 3, name: product.title, item: `${SITE_URL}/product/${product.handle}` },
      ],
    };
  }, [product]);

  useEffect(() => {
    setSelectedImage(null);
    setZoomed(false);
  }, [selectedOptions]);

  useEffect(() => {
    setZoomed(false);
  }, [selectedImage]);

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
    const others = allProducts.filter((p) => p.handle !== product.handle);
    // Products have a tags array but no collectionHandle in the current data,
    // so tag overlap is the cheap same-collection signal (per Task 5.8 brief).
    const sameCollection = others.filter((p) =>
      p.tags?.some((t) => product.tags?.includes(t))
    );
    const rest = others.filter((p) => !sameCollection.includes(p));
    return [
      ...sameCollection.slice(0, 4),
      ...rest.slice(0, 4 - Math.min(sameCollection.length, 4)),
    ];
  }, [allProducts, product]);

  const sanitizedHtml = useMemo(() => {
    if (!product?.descriptionHtml) return "";
    return DOMPurify.sanitize(product.descriptionHtml, {
      ALLOWED_TAGS: ["p", "ul", "ol", "li", "strong", "em", "br", "a"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    }).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  }, [product?.descriptionHtml]);

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

  const roomImage = product.images.length > 1 ? product.images[1]?.url : null;

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
      <Seo
        title={`${product.title} — DDouble | Fine-Art Poster`}
        description={(product.description || product.title).slice(0, 155)}
        canonicalPath={`/product/${product.handle}`}
        image={product.image}
        jsonLd={[productSchema, breadcrumbJsonLd]}
      />
      <Navbar />

      <main>
      <div className="pt-24 md:pt-28 max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.title },
        ]} />

        {/* Main */}
        <div className="flex flex-col lg:flex-row">
          {/* Gallery */}
          <div className="lg:w-[58%] px-6 md:px-10 lg:pl-16 lg:pr-0">
            <FadeIn>
              <button
                type="button"
                onClick={() => setZoomed(!zoomed)}
                aria-label="Zoom image"
                aria-pressed={zoomed}
                className={`relative overflow-hidden bg-[#F1F0EC] cursor-zoom-in w-full ${zoomed ? "cursor-zoom-out" : ""}`}
              >
                <img
                  src={showRoom ? shopifyImage(roomImage, 1200) : shopifyImage(displayImage, 1200)}
                  alt={selectedVariant?.image?.altText || product.title}
                  width={1200}
                  height={1600}
                  fetchpriority="high"
                  className="w-full transition-transform duration-700"
                  style={{ transform: zoomed ? "scale(1.5)" : "scale(1)" }}
                />
              </button>
            </FadeIn>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setShowRoom(false); }}
                    aria-label={`View image ${i + 1}`}
                    aria-current={matchedThumb === i ? "true" : undefined}
                    className={`w-20 h-20 border transition-colors overflow-hidden ${
                      matchedThumb === i && !showRoom ? "border-[#1A1A1A]" : "border-[#E5E5E1]"
                    }`}
                  >
                    <img
                      src={shopifyImage(img.url, 200)}
                      alt={img.altText}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            {roomImage && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowRoom(false)}
                  className={`px-4 py-2 min-h-11 flex items-center justify-center text-[11px] uppercase tracking-[0.1em] border transition-colors ${
                    !showRoom ? "border-[#1A1A1A] text-[#1A1A1A]" : "border-[#E5E5E1] text-[#6B6B67]"
                  }`}
                >
                  Product
                </button>
                <button
                  onClick={() => setShowRoom(true)}
                  className={`px-4 py-2 min-h-11 flex items-center justify-center text-[11px] uppercase tracking-[0.1em] border transition-colors ${
                    showRoom ? "border-[#1A1A1A] text-[#1A1A1A]" : "border-[#E5E5E1] text-[#6B6B67]"
                  }`}
                >
                  View in Room
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:w-[42%] px-6 md:px-10 lg:px-16 py-8 lg:py-0 lg:sticky lg:top-28 lg:self-start">
            <FadeIn delay={0.1}>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">{product.title}</h1>
                <button
                  onClick={handleFavorite}
                  className="mt-1 shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-[#E5E5E1] hover:border-[#1A1A1A] transition-colors"
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
                    <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-3">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                          className={`px-4 py-2.5 min-h-11 flex items-center justify-center text-xs border transition-all duration-200 ${
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
                <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-3">Quantity</h3>
                <div className="inline-flex items-center border border-[#E5E5E1]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 min-h-11 flex items-center justify-center text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 min-h-11 flex items-center justify-center text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant}
                className="mt-8 w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] py-4 hover:bg-[#2A2A2A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cartLoading ? "Adding…" : selectedVariant ? `Add to Cart · ${formatPrice(displayPrice)}` : "Select options"}
              </button>
              {product.options.some((o) => o.values.length > 1) && !selectedVariant && (
                <p className="mt-2 text-xs text-[#6B6B67]">Select your options above to add to cart.</p>
              )}
              <div ref={sentinelRef} className="h-px md:hidden" />

              {/* Trust strip */}
              <div className="mt-8 pt-8 border-t border-[#E5E5E1] grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="flex items-center gap-3">
                  <Truck size={14} className="text-[#6B6B67] shrink-0" />
                  <span className="text-sm text-[#6B6B67]">Free shipping over <Price amount={FREE_SHIPPING_THRESHOLD} /></span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={14} className="text-[#6B6B67] shrink-0" />
                  <span className="text-sm text-[#6B6B67]">30-day returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={14} className="text-[#6B6B67] shrink-0" />
                  <span className="text-sm text-[#6B6B67]">Ships in 1-2 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={14} className="text-[#6B6B67] shrink-0" />
                  <span className="text-sm text-[#6B6B67]">Tracked delivery</span>
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
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
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
      <h2 className="text-2xl md:text-3xl font-light">
        <button
          onClick={handleToggle}
          aria-expanded={isOpen}
          className="flex items-center justify-between w-full text-left cursor-pointer group"
        >
          <span>{title}</span>
          <ChevronDown
            size={20}
            className={`text-[#6B6B67] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
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
      Free shipping on orders over <Price amount={FREE_SHIPPING_THRESHOLD} />
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
      <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-3">Estimated Delivery</h3>
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