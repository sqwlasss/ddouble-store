import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import FadeIn from "@/components/ddouble/FadeIn";
import aboutImg from "../../assets/about-us.jpg";

export default function About() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="About — DDouble | Museum-Grade Wall Art, Made in Copenhagen"
        description="The story behind DDouble: fine-art prints on museum-grade paper, made in Copenhagen and designed to be lived with, not just looked at."
        canonicalPath="/about"
      />
      <Navbar />

      <main id="main">
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <FadeIn>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Our Story</span>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-light text-[#1A1A1A] leading-[1.1] max-w-3xl">
            Art should be lived with,<br />not just looked at.
          </h1>
        </FadeIn>
      </section>

      {/* Full-width image */}
      <section className="h-[50vh] md:h-[70vh]">
        <img
          src={aboutImg}
          alt="DDouble studio"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </section>

      {/* Story */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <FadeIn>
            <div className="max-w-lg">
              <h2 className="text-2xl md:text-3xl font-light text-[#1A1A1A] leading-tight">
                Founded on the belief that every space deserves art.
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-6 text-[#6B6B67] text-base leading-relaxed">
              <p>
                DDouble was born from a simple observation: the walls we live within shape how we feel. 
                Yet for too long, quality art was either inaccessible or impersonal. We set out to change that.
              </p>
              <p>
                Our studio collaborates with artists, photographers, and designers from across Europe to create 
                prints that are timeless rather than trendy. Each piece is curated to complement the quiet 
                sophistication of modern living — where less is always more.
              </p>
              <p>
                We believe in slow design. Every print is produced on museum-grade paper with archival inks, 
                ensuring your art looks as striking in ten years as it does today. Our packaging is fully 
                sustainable, because caring for beauty extends beyond the frame.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
        <FadeIn>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Values</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1A1A1A] mb-16">What we stand for</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {[
            { title: "Timeless Design", text: "We create art that transcends seasons and trends — pieces that grow more meaningful with time." },
            { title: "Uncompromising Quality", text: "Museum-grade paper, archival inks, and meticulous attention to every detail from studio to doorstep." },
            { title: "Conscious Craft", text: "Sustainable packaging, ethical production, and a deep respect for the materials and makers behind each print." },
          ].map((v, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A] tracking-wide">{v.title}</h3>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">{v.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-[#E5E5E1]">
        <FadeIn>
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-[#1A1A1A]">Discover the collection</h2>
            <p className="mt-4 text-sm text-[#6B6B67]">
              Find the perfect piece for your space.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#2A2A2A] transition-all duration-300"
            >
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>
      </section>
      </main>

      <Footer />
    </div>
  );
}
