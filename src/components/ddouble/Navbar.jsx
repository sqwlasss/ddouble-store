import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { useAllProducts, useCollections } from "@/hooks/useProducts";
import { useCurrency } from "@/lib/CurrencyContext";
import CurrencySelector, { MobileCurrencySelector } from "@/components/ddouble/CurrencySelector";
import Price from "@/components/ddouble/Price";
import CartDrawer from "@/components/ddouble/CartDrawer";
import { shopifyImage } from "@/lib/utils";
import useEscapeClose from "@/hooks/useEscapeClose";
import usePanelFocus from "@/hooks/usePanelFocus";

const NAV_LINKS = [
  { label: "Shop", path: "/shop" },
  {
    label: "Collections",
    path: "/shop",
    children: [
      { label: "Posters", path: "/shop?category=posters" },
      { label: "Rugs", path: "/shop?category=rugs" },
      { label: "Room Decor", path: "/shop?category=room-decor" },
      { label: "Bedding & Pillows", path: "/shop?category=bedding-pillows" },
    ],
  },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileMenuRef = useRef(null);
  const searchPanelRef = useRef(null);
  const { country } = useCurrency();
  const { totalItems } = useShopifyCart(country);
  const { favoritesCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: allProducts } = useAllProducts(country);
  const { data: collections } = useCollections();

  // Build the Collections dropdown from live data; fall back to hardcoded links while loading.
  const navLinks = useMemo(() => {
    if (!collections || collections.length === 0) return NAV_LINKS;
    return NAV_LINKS.map((link) =>
      link.label === "Collections"
        ? {
            ...link,
            children: collections.map((c) => ({
              label: c.title,
              path: `/shop?category=${c.handle}`,
            })),
          }
        : link
    );
  }, [collections]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !allProducts) return [];
    const q = searchQuery.toLowerCase();
    return allProducts
      .filter((p) => p.title.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setCollectionsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Panel keyboard behavior: Escape closes; focus moves into the panel on
  // open and back to the trigger on close (CartDrawer/filter sheet get this
  // from Radix Dialog already).
  const saveMobileMenuFocus = usePanelFocus(mobileOpen, mobileMenuRef);
  const saveSearchFocus = usePanelFocus(searchOpen, searchPanelRef);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const toggleMobileMenu = () => {
    saveMobileMenuFocus();
    setMobileOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    saveSearchFocus();
    setSearchOpen((prev) => !prev);
  };

  // Hover/click mega menu: keep open while focus is inside (React's onBlur
  // bubbles, so only close when focus leaves the whole menu subtree).
  const handleMegaBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setMegaOpen(false);
  };

  const closeMegaMenu = () => {
    setMegaOpen(false);
  };

  useEscapeClose(mobileOpen, () => setMobileOpen(false));
  useEscapeClose(searchOpen, closeSearch);
  useEscapeClose(megaOpen, closeMegaMenu);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#F9F9F7]/85 backdrop-blur-xl shadow-[0_1px_0_0_#E5E5E1]"
            : "bg-transparent"
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#1A1A1A] focus:text-white focus:px-4 focus:py-2 text-xs uppercase tracking-[0.15em]">
          Skip to content
        </a>
        <nav className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: mobile menu + desktop nav */}
            <div className="flex items-center gap-8 flex-1">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden min-w-11 min-h-11 flex items-center justify-center"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>

              <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                    onFocus={() => setMegaOpen(true)}
                    onBlur={handleMegaBlur}
                  >
                    <button
                      onClick={() => setMegaOpen(!megaOpen)}
                      className="text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                    >
                      {link.label}
                    </button>
                    {megaOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                        <div className="bg-white/95 backdrop-blur-xl border border-[#E5E5E1] rounded-none p-6 min-w-[200px] shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.path}
                              className="block py-2 text-[12px] tracking-[0.05em] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              </div>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-[33%] md:left-[42%] lg:left-[45%] -translate-x-1/2 text-xl md:text-2xl font-semibold tracking-[0.08em] text-[#1A1A1A]"
            >
              DDOUBLE
            </Link>

            {/* Right: icons */}
            <div className="flex items-center gap-1 md:gap-5 flex-1 justify-end">
              <div className="hidden md:block">
                <CurrencySelector />
              </div>
              <button
                onClick={toggleSearch}
                className="min-w-11 min-h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                <Search size={18} aria-hidden="true" />
              </button>
              <Link
                to="/favorites"
                className="relative min-w-11 min-h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                aria-label="Favorites"
              >
                <Heart size={18} aria-hidden="true" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1A1A1A] text-white text-xs rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="min-w-11 min-h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                  aria-label="Account"
                >
                  <User size={18} aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="min-w-11 min-h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                  aria-label="Log in"
                >
                  <User size={18} aria-hidden="true" />
                </Link>
              )}
              <button
                onClick={() => setCartOpen(true)}
                className="relative min-w-11 min-h-11 flex items-center justify-center text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                {totalItems > 0 && (
                  <span aria-live="polite" className="absolute -top-1 -right-1 w-5 h-5 bg-[#1A1A1A] text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div ref={searchPanelRef} className="border-t border-[#E5E5E1] py-4 relative">
              <div className="flex items-center gap-3">
                <Search size={16} aria-hidden="true" className="text-[#6B6B67] shrink-0" />
                <input
                  type="text"
                  placeholder="Search for posters..."
                  className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#6B6B67]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                      closeSearch();
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="min-w-11 min-h-11 flex items-center justify-center -m-2 text-[#6B6B67] hover:text-[#1A1A1A]" aria-label="Clear search">
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
              {searchOpen && !searchQuery.trim() && (
                <div className="mt-3 pt-3 border-t border-[#E5E5E1]">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-2">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Poster", "Rug", "Bedding"].map((term) => (
                      <button key={term} onClick={() => setSearchQuery(term)}
                        className="text-xs border border-[#E5E5E1] px-3 min-h-11 flex items-center justify-center hover:border-[#1A1A1A] transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="mt-3 border-t border-[#E5E5E1] pt-3 space-y-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      to={`/product/${product.handle}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 py-2 hover:bg-[#F1F0EC] -mx-2 px-2 transition-colors"
                    >
                      <img src={shopifyImage(product.image, 160)} alt={product.title} className="w-10 h-10 object-cover" />
                      <div>
                        <p className="text-sm text-[#1A1A1A]">{product.title}</p>
                        <p className="text-xs text-[#5A5A56]"><Price amount={product.price} /></p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="mt-3 text-xs text-[#6B6B67]">
                  No results for '{searchQuery}' — try <button onClick={() => setSearchQuery("Poster")} className="underline underline-offset-2 text-[#1A1A1A]">Poster</button>
                </p>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            tabIndex={-1}
            className="lg:hidden fixed left-0 right-0 bottom-0 top-16 md:top-20 bg-[#F9F9F7] border-t border-[#E5E5E1] overflow-y-auto overscroll-contain z-40"
          >
            <div className="px-6 py-6 space-y-4 min-h-full">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="space-y-2">
                    <button
                      onClick={() => setCollectionsOpen(!collectionsOpen)}
                      className="flex items-center justify-between w-full min-h-11 text-xs uppercase tracking-[0.12em] text-[#6B6B67]"
                    >
                      {link.label}
                      <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${collectionsOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        collectionsOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-4 space-y-2 pt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            className="flex items-center min-h-11 text-sm text-[#1A1A1A]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="flex items-center min-h-11 text-xs uppercase tracking-[0.12em] text-[#1A1A1A]"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                to="/favorites"
                className="flex items-center min-h-11 text-xs uppercase tracking-[0.12em] text-[#1A1A1A]"
              >
                Favorites
              </Link>
              <MobileCurrencySelector />
              <div className="border-t border-[#E5E5E1] pt-4 mt-4">
                {isAuthenticated ? (
                  <Link to="/account" className="flex items-center min-h-11 text-xs uppercase tracking-[0.12em] text-[#1A1A1A]">
                    My Account
                  </Link>
                ) : (
                  <Link to="/login" className="flex items-center min-h-11 text-xs uppercase tracking-[0.12em] text-[#1A1A1A]">
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}