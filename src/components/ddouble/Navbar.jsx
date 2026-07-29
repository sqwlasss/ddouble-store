import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useShopifyCart } from "@/hooks/useShopifyCart";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { useAllProducts } from "@/hooks/useProducts";
import { useCurrency } from "@/lib/CurrencyContext";
import CurrencySelector, { MobileCurrencySelector } from "@/components/ddouble/CurrencySelector";
import Price from "@/components/ddouble/Price";
import CartDrawer from "@/components/ddouble/CartDrawer";

const NAV_LINKS = [
  { label: "Shop", path: "/shop" },
  {
    label: "Collections",
    path: "/shop",
    children: [
      { label: "Abstract", path: "/shop?category=abstract" },
      { label: "Nature", path: "/shop?category=nature" },
      { label: "Architecture", path: "/shop?category=architecture" },
      { label: "Black & White", path: "/shop?category=black-white" },
      { label: "Minimal", path: "/shop?category=minimal" },
      { label: "Typography", path: "/shop?category=typograph" },
      { label: "Travel", path: "/shop?category=travel" },
      { label: "Posters", path: "/shop?category=posters" },
      { label: "Rugs", path: "/shop?category=rugs" },
      { label: "Pillows", path: "/shop?category=pillows" },
      { label: "Room Decor", path: "/shop?category=room-decor" },
      { label: "Bedding & Pillows", path: "/shop?category=blankets-pillows" },
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
  const { country } = useCurrency();
  const { totalItems } = useShopifyCart(country);
  const { favoritesCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: allProducts } = useAllProducts(country);

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#F9F9F7]/85 backdrop-blur-xl shadow-[0_1px_0_0_#E5E5E1]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                    onFocus={() => setMegaOpen(true)}
                    onBlur={() => setMegaOpen(false)}
                  >
                    <button className="text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">
                      {link.label}
                    </button>
                    {megaOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                        <div className="bg-white/95 backdrop-blur-xl border border-[#E5E5E1] rounded-sm p-6 min-w-[200px] shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
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

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-[36%] md:left-[45%] -translate-x-1/2 text-xl md:text-2xl font-semibold tracking-[0.08em] text-[#1A1A1A]"
            >
              DDOUBLE
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-4 md:gap-5">
              <div className="hidden md:block">
                <CurrencySelector />
              </div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1 text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <Link
                to="/favorites"
                className="relative p-1 text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                aria-label="Favorites"
              >
                <Heart size={18} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="p-1 text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                  aria-label="Account"
                >
                  <User size={18} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="p-1 text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                  aria-label="Log in"
                >
                  <User size={18} />
                </Link>
              )}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-1 text-[#1A1A1A] hover:text-[#6B6B67] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="border-t border-[#E5E5E1] py-4 relative">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-[#6B6B67] shrink-0" />
                <input
                  type="text"
                  placeholder="Search for posters..."
                  className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#6B6B67] outline-none"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-[#6B6B67] hover:text-[#1A1A1A]" aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 border-t border-[#E5E5E1] pt-3 space-y-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      to={`/product/${product.handle}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 py-2 hover:bg-[#F1F0EC] -mx-2 px-2 rounded transition-colors"
                    >
                      <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded-sm" />
                      <div>
                        <p className="text-sm text-[#1A1A1A]">{product.title}</p>
                        <p className="text-xs text-[#6B6B67]"><Price amount={product.price} /></p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="mt-3 text-xs text-[#6B6B67]">No results found.</p>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed left-0 right-0 bottom-0 top-16 md:top-20 bg-[#F9F9F7] border-t border-[#E5E5E1] overflow-y-auto overscroll-contain z-40">
            <div className="px-6 py-6 space-y-4 min-h-full">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="space-y-2">
                    <button
                      onClick={() => setCollectionsOpen(!collectionsOpen)}
                      className="flex items-center justify-between w-full text-xs uppercase tracking-[0.12em] text-[#6B6B67]"
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${collectionsOpen ? "rotate-180" : ""}`} />
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
                            className="block text-sm text-[#1A1A1A]"
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
                    className="block text-xs uppercase tracking-[0.12em] text-[#1A1A1A]"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                to="/favorites"
                className="block text-xs uppercase tracking-[0.12em] text-[#1A1A1A]"
              >
                Favorites
              </Link>
              <MobileCurrencySelector />
              <div className="border-t border-[#E5E5E1] pt-4 mt-4">
                {isAuthenticated ? (
                  <Link to="/account" className="block text-xs uppercase tracking-[0.12em] text-[#1A1A1A]">
                    My Account
                  </Link>
                ) : (
                  <Link to="/login" className="block text-xs uppercase tracking-[0.12em] text-[#1A1A1A]">
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