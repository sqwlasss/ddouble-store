import { Link } from "react-router-dom";
import { Instagram, Facebook, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#F1F0EC] border-t border-[#E5E5E1]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Newsletter */}
        <div className="py-16 md:py-24 border-b border-[#E5E5E1]">
          <div className="max-w-lg">
            <h3 className="text-2xl md:text-3xl font-light text-[#1A1A1A] leading-tight">
              Stay inspired
            </h3>
            <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
              Join our community for early access to new collections, styling tips, and exclusive offers.
            </p>
            {subscribed ? (
              <p className="mt-6 text-sm text-[#1A1A1A]">Thank you for subscribing.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex items-center border-b border-[#1A1A1A]">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent py-3 text-sm text-[#1A1A1A] placeholder:text-[#D9D2C5] outline-none"
                  required
                />
                <button type="submit" aria-label="Subscribe" className="p-2 text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-4">Shop</h3>
            <div className="space-y-3">
              <Link to="/shop" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">All Products</Link>
              <Link to="/shop?category=posters" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Posters</Link>
              <Link to="/shop?category=rugs" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Rugs</Link>
              <Link to="/shop?category=room-decor" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Room Decor</Link>
              <Link to="/shop?category=bedding-pillows" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Bedding & Pillows</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-4">Info</h3>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">About Us</Link>
              <Link to="/contact" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Contact</Link>
              <Link to="/faq" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-4">Help</h3>
            <div className="space-y-3">
              <Link to="/faq" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Shipping</Link>
              <Link to="/faq" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Returns</Link>
              <Link to="/faq" className="block text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">Size Guide</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-4">Follow</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/theddouble/" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-[#E5E5E1] flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-[#6B6B67]">© 2026 DDouble. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/about" className="text-[11px] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors">Privacy Policy</Link>
            <Link to="/about" className="text-[11px] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}