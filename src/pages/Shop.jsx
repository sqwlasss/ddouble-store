import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import ProductCard from "@/components/ddouble/ProductCard";
import FadeIn from "@/components/ddouble/FadeIn";
import Price from "@/components/ddouble/Price";
import { useCurrency } from "@/lib/CurrencyContext";
import { useAllProducts, useCollections, useCollectionProducts } from "@/hooks/useProducts";

const CATEGORY_COLLECTIONS = [
  "abstract", "nature", "architecture", "black-white",
  "minimal", "typograph", "travel", "vintage",
  "posters", "rugs", "pillows", "room-decor", "blankets-pillows",
];

const SORT_OPTIONS = [
  { id: "best", label: "Featured" },
  { id: "price-asc", label: "Price: Low–High" },
  { id: "price-desc", label: "Price: High–Low" },
  { id: "alpha", label: "A–Z" },
];

function ProductGrid({ products, loading, sort, priceRange, searchQuery, clearFilters }) {
  const filtered = useMemo(() => {
    let result = [...(products || [])];

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q));
    }

    if (priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.id === priceRange);
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "alpha":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, priceRange, sort, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="bg-[#F1F0EC] aspect-[3/4] animate-pulse" />
            <div className="h-4 bg-[#F1F0EC] animate-pulse w-3/4" />
            <div className="h-3 bg-[#F1F0EC] animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-[#6B6B67]">No prints match your filters.</p>
        <button
          onClick={clearFilters}
          className="mt-4 text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#1A1A1A]"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {filtered.map((product, i) => (
        <FadeIn key={product.handle} delay={i * 0.04}>
          <ProductCard product={product} index={i} />
        </FadeIn>
      ))}
    </div>
  );
}

function CollectionProducts({ collectionHandle, priceRange, sort, searchQuery, clearFilters, country }) {
  const { data, isLoading } = useCollectionProducts(collectionHandle, country);
  const products = data?.products || [];

  return (
    <ProductGrid
      products={products}
      loading={isLoading}
      sort={sort}
      priceRange={priceRange}
      searchQuery={searchQuery}
      clearFilters={clearFilters}
    />
  );
}

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-30", label: "Under 30", min: 0, max: 30 },
  { id: "30-50", label: "30 – 50", min: 30, max: 50 },
  { id: "over-50", label: "Over 50", min: 50, max: Infinity },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { country } = useCurrency();

  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("best");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
    else setCategory("all");
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const { data: allProducts, isLoading: allLoading } = useAllProducts(country);
  const { data: collections } = useCollections();

  const categoryCollections = useMemo(
    () => (collections || []).filter((c) => CATEGORY_COLLECTIONS.includes(c.handle)),
    [collections]
  );

  const activeFilters = [category, priceRange].filter((f) => f !== "all").length;

  const clearFilters = () => {
    setCategory("all");
    setPriceRange("all");
    setSearchQuery("");
  };

  const activeCollection = categoryCollections.find((c) => c.handle === category);
  const productCount = category === "all"
    ? (allProducts || []).length
    : undefined;

  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Navbar />

      <main>
      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <FadeIn>
          <div className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">
              {searchQuery ? `Results for "${searchQuery}"` : activeCollection ? activeCollection.title : "Shop"}
            </h1>
            <p className="mt-2 text-sm text-[#6B6B67]">
              {category === "all"
                ? allLoading
                  ? "Loading..."
                  : `${productCount} prints`
                : ""}
            </p>
          </div>
        </FadeIn>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 pb-8 border-b border-[#E5E5E1] mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filter
              {activeFilters > 0 && (
                <span className="w-5 h-5 bg-[#1A1A1A] text-white text-[9px] rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors flex items-center gap-1"
              >
                <X size={10} /> Clear all
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
            >
              {SORT_OPTIONS.find((s) => s.id === sort)?.label}
              <ChevronDown size={12} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-[#E5E5E1] rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.03)] py-2 min-w-[160px] z-10">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSort(opt.id);
                      setSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-xs ${
                      sort === opt.id ? "text-[#1A1A1A] font-medium" : "text-[#6B6B67]"
                    } hover:text-[#1A1A1A] transition-colors`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters drawer */}
        {filtersOpen && (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8 pb-8 mb-8 border-b border-[#E5E5E1]">
            <FilterGroup
              label="Category"
              options={[{ handle: "all", title: "All" }, ...categoryCollections]}
              value={category}
              onChange={setCategory}
            />
            <FilterGroup
              label="Price"
              options={PRICE_RANGES.map((r) => ({ handle: r.id, title: r.label }))}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>
        )}

        {/* Product grid */}
        {category === "all" ? (
          <ProductGrid
            products={allProducts}
            loading={allLoading}
            sort={sort}
            priceRange={priceRange}
            searchQuery={searchQuery}
            clearFilters={clearFilters}
          />
        ) : (
          <CollectionProducts
            collectionHandle={category}
            priceRange={priceRange}
            sort={sort}
            searchQuery={searchQuery}
            clearFilters={clearFilters}
            country={country}
          />
        )}
      </div>
      </main>

      <Footer />
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-3 block">{label}</span>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.handle}
            onClick={() => onChange(opt.handle)}
            className={`block text-sm transition-colors ${
              value === opt.handle
                ? "text-[#1A1A1A] font-medium"
                : "text-[#6B6B67] hover:text-[#1A1A1A]"
            }`}
          >
            {opt.title}
          </button>
        ))}
      </div>
    </div>
  );
}