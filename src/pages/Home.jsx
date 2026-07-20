import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/ddouble/FadeIn";
import ProductCard from "@/components/ddouble/ProductCard";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import { useCollections, useCollectionProducts } from "@/hooks/useProducts";

const LIFESTYLE_IMAGES = {
  hero: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/f1403e810_generated_ba8eb28a.png",
  bedroom: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/7efe5efef_generated_d41c0030.png",
  dining: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/e26fb1318_generated_cabe50da.png",
  galleryWall: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/8140dfca5_generated_d1feca24.png",
  office: "https://media.base44.com/images/public/6a590df7244fc537b99549d8/05a5cfb7a_generated_75024acd.png",
};

const TESTIMONIALS = [
  { name: "Sofia M.", location: "Stockholm", text: "The quality of the prints is extraordinary. My living room finally feels complete." },
  { name: "Thomas K.", location: "Copenhagen", text: "DDouble understands that art should be felt, not just seen. Every piece has presence." },
  { name: "Emma L.", location: "Berlin", text: "I've ordered from many poster brands — DDouble is in a different league entirely." },
];

const CATEGORY_COLLECTIONS = [
  "abstract", "nature", "architecture", "black-white",
  "minimal", "typograph", "travel", "vintage",
];

function FeaturedProducts() {
  const { data: collections } = useCollections();

  const categoryCollections = (collections || []).filter((c) =>
    CATEGORY_COLLECTIONS.includes(c.handle)
  );

  return (
    <>
      {categoryCollections.slice(0, 2).map((col) => (
        <CollectionSection key={col.handle} collection={col} />
      ))}
    </>
  );
}

function CollectionSection({ collection }) {
  const { data, isLoading } = useCollectionProducts(collection.handle);
  const products = (data?.products || []).slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">Featured</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A]">{collection.title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#F1F0EC] aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
      <FadeIn>
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">Featured</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A]">{collection.title}</h2>
          </div>
          <Link to={`/shop?category=${collection.handle}`} className="text-xs uppercase tracking-[0.1em] text-[#757571] hover:text-[#1A1A1A] transition-colors">
            Shop All
          </Link>
        </div>
      </FadeIn>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map((product, i) => (
          <FadeIn key={product.handle} delay={i * 0.08}>
            <ProductCard product={product} index={i} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function LatestProducts() {
  const { data: collections } = useCollections();

  const categoryCollections = (collections || []).filter((c) =>
    CATEGORY_COLLECTIONS.includes(c.handle)
  );

  const lastTwo = categoryCollections.slice(2, 4);

  return (
    <>
      {lastTwo.map((col) => (
        <CollectionSection key={col.handle} collection={col} />
      ))}
    </>
  );
}

export default function Home() {
  const { data: collections } = useCollections();
  const { data: abstractData } = useCollectionProducts("abstract");
  const allProducts = abstractData?.products || [];

  const categoryCollections = (collections || []).filter((c) =>
    CATEGORY_COLLECTIONS.includes(c.handle)
  );

  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-32 lg:py-0">
          <FadeIn>
            <div className="max-w-md">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-light text-[#1A1A1A] leading-[1.1] tracking-[-0.02em]">
                Art that transforms
                <br />
                your space.
              </h1>
              <p className="mt-6 text-[#757571] text-base leading-relaxed">
                Premium wall art designed to elevate every room.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#D9D2C5] hover:text-[#1A1A1A] transition-all duration-300"
              >
                Shop Collection
                <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
        <div className="flex-1 lg:h-screen">
          <img
            src={LIFESTYLE_IMAGES.hero}
            alt="Scandinavian living room with premium wall art"
            className="w-full h-[60vh] lg:h-full object-cover"
          />
        </div>
      </section>

      {/* Collections */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">Explore</span>
              <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A]">Collections</h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-[0.1em] text-[#757571] hover:text-[#1A1A1A] transition-colors hidden md:block">
              View All
            </Link>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoryCollections.slice(0, 8).map((col, i) => (
            <FadeIn key={col.handle} delay={i * 0.05}>
              <Link to={`/shop?category=${col.handle}`} className="group block">
                <div className="bg-[#F1F0EC] p-6 md:p-8 aspect-square flex flex-col justify-end hover:bg-[#E5E5E1] transition-colors duration-500">
                  <h3 className="text-sm font-medium text-[#1A1A1A] tracking-wide">{col.title}</h3>
                  <p className="text-[11px] text-[#757571] mt-1">{col.description}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Products (first 2 collections) */}
      <FeaturedProducts />

      {/* Lifestyle Banner */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={LIFESTYLE_IMAGES.bedroom}
          alt="Minimalist bedroom with curated wall art"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
              Curated for<br />modern living
            </h2>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 bg-white text-[#1A1A1A] text-xs uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#D9D2C5] transition-all duration-300"
            >
              Explore
              <ArrowRight size={14} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* More Products (next 2 collections) */}
      <LatestProducts />

      {/* Lifestyle Grid */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
        <FadeIn>
          <div className="mb-12 md:mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">Inspiration</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A]">Live with art</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <FadeIn className="md:col-span-2">
            <img src={LIFESTYLE_IMAGES.dining} alt="Dining room with art" className="w-full h-[400px] md:h-[500px] object-cover" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <img src={LIFESTYLE_IMAGES.galleryWall} alt="Gallery wall arrangement" className="w-full h-[400px] md:h-[500px] object-cover" />
          </FadeIn>
          <FadeIn delay={0.15}>
            <img src={LIFESTYLE_IMAGES.office} alt="Home office with art" className="w-full h-[400px] md:h-[500px] object-cover" />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <div className="h-[400px] md:h-[500px] bg-[#F1F0EC] flex items-center justify-center p-12">
              <div className="max-w-md text-center">
                <h3 className="text-2xl md:text-3xl font-light text-[#1A1A1A] leading-tight">
                  Every wall tells a story
                </h3>
                <p className="mt-4 text-sm text-[#757571] leading-relaxed">
                  Discover how our prints transform spaces from the ordinary to the extraordinary.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#1A1A1A] underline underline-offset-4"
                >
                  Shop Now <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
        <FadeIn>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">Voices</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A] mb-12 md:mb-16">What our customers say</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <blockquote className="space-y-4">
                <p className="text-base text-[#1A1A1A] leading-relaxed font-light italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="text-xs text-[#757571]">
                  {t.name} — {t.location}
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-24 md:py-32 border-t border-[#E5E5E1]">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">@ddouble</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A]">Follow our journey</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
          {allProducts.slice(0, 6).map((p, i) => (
            <FadeIn key={p.handle} delay={i * 0.05}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
