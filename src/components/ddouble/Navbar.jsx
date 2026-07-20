import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useShopifyCart } from "@/hooks/useShopifyCart";
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
      { label: "Vintage", path: "/shop?category=vintage" },
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
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useShopifyCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

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
                  >
                    <button className="text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A] hover:text-[#757571] transition-colors">
                      {link.label}
                    </button>
                    {megaOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                        <div className="bg-white/95 backdrop-blur-xl border border-[#E5E5E1] rounded-sm p-6 min-w-[200px] shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.path}
                              className="block py-2 text-[12px] tracking-[0.05em] text-[#757571] hover:text-[#1A1A1A] transition-colors"
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
                    className="text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A] hover:text-[#757571] transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-semibold tracking-[0.08em] text-[#1A1A1A]"
            >
              DDOUBLE
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-4 md:gap-5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1 text-[#1A1A1A] hover:text-[#757571] transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <Link
                to="/shop"
                className="hidden md:block p-1 text-[#1A1A1A] hover:text-[#757571] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-1 text-[#1A1A1A] hover:text-[#757571] transition-colors"
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
            <div className="border-t border-[#E5E5E1] py-4">
              <input
                type="text"
                placeholder="Search for posters, collections..."
                className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#757571] outline-none"
                autoFocus
              />
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#F9F9F7] border-t border-[#E5E5E1]">
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.12em] text-[#757571]">
                      {link.label}
                    </span>
                    <div className="pl-4 space-y-2">
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
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
