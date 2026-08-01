import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import ProductCard from "@/components/ddouble/ProductCard";
import FadeIn from "@/components/ddouble/FadeIn";
import Breadcrumb from "@/components/ddouble/Breadcrumb";
import { useCurrency } from "@/lib/CurrencyContext";

import { useAllProductsPage, useCollections, useCollectionProducts } from "@/hooks/useProducts";

const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: Low–High" },
  { id: "price-desc", label: "Price: High–Low" },
  { id: "alpha", label: "A–Z" },
];

// True below the Tailwind `md` breakpoint (768px). Inline per brief — the
// shared use-mobile.jsx hook was deleted in Part 1 and is not recreated.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function ProductGrid({ products, loading, error, refetch, sort, priceRange, searchQuery, clearFilters }) {
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
        // "default": Shopify query order (insertion order). createdAt is not
        // exposed by the storefront queries, so no date-based sort is applied.
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

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-[#6B6B67]">Something went wrong loading products.</p>
        <button
          onClick={refetch}
          className="mt-4 text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#1A1A1A]"
        >
          Try again
        </button>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-[#6B6B67]">No pieces match your filters — try adjusting them.</p>
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

function CollectionProducts({ collectionHandle, priceRange, sort, searchQuery, clearFilters, country, onCountChange, onLoadingChange }) {
  const { data, isLoading, error, refetch } = useCollectionProducts(collectionHandle, country);
  const products = data?.products || [];

  useEffect(() => {
    onCountChange(products.length);
    onLoadingChange(isLoading);
  }, [products.length, isLoading, onCountChange, onLoadingChange]);

  return (
    <ProductGrid
      products={products}
      loading={isLoading}
      error={error}
      refetch={refetch}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { country } = useCurrency();

  const category = searchParams.get("category") || "all";
  const priceRange = searchParams.get("price") || "all";
  const sort = searchParams.get("sort") || "default";
  const searchQuery = searchParams.get("q") || "";
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [collectionCount, setCollectionCount] = useState(0);
  const [collectionLoading, setCollectionLoading] = useState(true);
  // Pagination for the "all" view: pages are accumulated from useAllProductsPage
  // and keyed by country so a storefront switch resets cursor/pages without ever
  // firing a stale-cursor query for the new country.
  const [pagination, setPagination] = useState({ country, cursor: null, pages: [], hasMore: false });

  const updateParam = (key, value, mode = "replace") => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    setSearchParams(params, { replace: mode === "replace" });
  };

  const { data: pageData, isPending, isFetching, error, refetch } = useAllProductsPage(
    country,
    pagination.country === country ? pagination.cursor : null
  );
  const pageInfo = pageData?.pageInfo;
  const { data: collections } = useCollections();

  // Derived state: when the storefront changes, treat pagination as reset so
  // the grid never shows the previous country's accumulated list.
  const current =
    pagination.country === country
      ? pagination
      : { country, cursor: null, pages: [], hasMore: false };
  const pages = current.pages;
  const hasMore = current.hasMore;
  // Skeleton only while the first page is loading; "Load more" fetches keep
  // the already-accumulated grid visible.
  const allLoading = isPending && pages.length === 0;

  // Append each fetched page to the accumulated list, deduping by product id.
  // A country change replaces the list instead of appending to the old one.
  useEffect(() => {
    if (!pageData?.products) return;
    setPagination((prev) => {
      if (prev.country !== country) {
        return { country, cursor: null, pages: pageData.products, hasMore: pageData.pageInfo.hasNextPage };
      }
      const map = new Map(prev.pages.map((p) => [p.id, p]));
      for (const p of pageData.products) map.set(p.id, p);
      return { ...prev, pages: [...map.values()], hasMore: pageData.pageInfo.hasNextPage };
    });
  }, [pageData, country]);

  const loadMore = () => {
    if (pageInfo?.hasNextPage) {
      setPagination((prev) => ({ ...prev, cursor: pageInfo.endCursor }));
    }
  };

  const categoryCollections = useMemo(
    () => collections || [],
    [collections]
  );

  const activeFilters = [category, priceRange].filter((f) => f !== "all").length;

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("price");
    params.delete("q");
    setSearchParams(params, { replace: true });
  };

  const activeCollection = categoryCollections.find((c) => c.handle === category);

  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title={activeCollection ? `${activeCollection.title} — DDouble | Fine-Art Prints & Decor` : "Shop All — DDouble | Fine-Art Prints & Decor"}
        description="Fine-art prints and decor, made in Copenhagen."
        canonicalPath={category !== "all" ? `/shop?category=${category}` : "/shop"}
      />
      <Navbar />

      <main>
      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        {category !== "all" && activeCollection && (
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: activeCollection.title },
          ]} />
        )}

        <FadeIn>
          <div className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A]">
              {searchQuery ? `Results for "${searchQuery}"` : activeCollection ? activeCollection.title : "Shop"}
            </h1>
            <p className="mt-2 text-sm text-[#6B6B67]">
              {category === "all"
                ? allLoading
                  ? "Loading…"
                  : `${pages.length} ${pages.length === 1 ? "piece" : "pieces"}`
                : collectionLoading
                  ? "Loading…"
                  : `${collectionCount} ${collectionCount === 1 ? "piece" : "pieces"}`}
            </p>
          </div>
        </FadeIn>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 pb-8 border-b border-[#E5E5E1] mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="min-h-11 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filter
              {activeFilters > 0 && (
                <span className="w-5 h-5 bg-[#1A1A1A] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="min-h-11 flex items-center gap-1 text-[11px] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="min-h-11 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
            >
              {SORT_OPTIONS.find((s) => s.id === sort)?.label ?? "Default"}
              <ChevronDown size={12} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-[#E5E5E1] rounded-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] py-2 min-w-[160px] z-10">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      updateParam("sort", opt.id);
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

        {/* Filters drawer (desktop, md+ only) */}
        {filtersOpen && (
          <div className="hidden md:grid grid-cols-2 gap-6 md:gap-8 pb-8 mb-8 border-b border-[#E5E5E1]">
            <FilterGroup
              label="Category"
              options={[{ handle: "all", title: "All" }, ...categoryCollections]}
              value={category}
              onChange={(cat) => updateParam("category", cat, "push")}
            />
            <FilterGroup
              label="Price"
              options={PRICE_RANGES.map((r) => ({ handle: r.id, title: r.label }))}
              value={priceRange}
              onChange={(r) => updateParam("price", r, "replace")}
            />
          </div>
        )}

        {/* Mobile filter bottom-sheet (below md). Escape close + focus trap
            come from Radix Dialog defaults (Radix 1.x does not emit aria-modal;
            CartDrawer sets it manually on its Content). */}
        <Dialog.Root open={filtersOpen && isMobile} onOpenChange={setFiltersOpen}>
          <Dialog.Content className="fixed bottom-0 inset-x-0 max-h-[80vh] overflow-y-auto bg-[#F9F9F7] border-t border-[#E5E5E1] p-6 focus:outline-none">
            <Dialog.Title className="sr-only">Filters</Dialog.Title>
            <div className="grid grid-cols-2 gap-6">
              <FilterGroup
                label="Category"
                options={[{ handle: "all", title: "All" }, ...categoryCollections]}
                value={category}
                onChange={(cat) => updateParam("category", cat, "push")}
              />
              <FilterGroup
                label="Price"
                options={PRICE_RANGES.map((r) => ({ handle: r.id, title: r.label }))}
                value={priceRange}
                onChange={(r) => updateParam("price", r, "replace")}
              />
            </div>
          </Dialog.Content>
        </Dialog.Root>

        {/* Product grid */}
        {category === "all" ? (
          <>
            <ProductGrid
              products={pages}
              loading={allLoading}
              // Only surface the error when there is nothing to show: a failed
              // "load more" fetch keeps the accumulated grid visible.
              error={error && pages.length === 0 ? error : null}
              refetch={refetch}
              sort={sort}
              priceRange={priceRange}
              searchQuery={searchQuery}
              clearFilters={clearFilters}
            />
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={isFetching}
                className="mt-16 mx-auto block text-xs uppercase tracking-[0.15em] border border-[#1A1A1A] px-8 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-50"
              >
                {isFetching ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        ) : (
          <CollectionProducts
            collectionHandle={category}
            priceRange={priceRange}
            sort={sort}
            searchQuery={searchQuery}
            clearFilters={clearFilters}
            country={country}
            onCountChange={setCollectionCount}
            onLoadingChange={setCollectionLoading}
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
      <span className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-3 block">{label}</span>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.handle}
            onClick={() => onChange(opt.handle)}
            className={`flex items-center min-h-11 w-full text-sm transition-colors ${
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