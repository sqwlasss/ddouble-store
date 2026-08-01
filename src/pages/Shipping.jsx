import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import FadeIn from "@/components/ddouble/FadeIn";

/* TODO: fill in real legal entity name/address/VAT before launch */

export default function Shipping() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="Shipping & Delivery — DDouble"
        description="Delivery times, costs, and tracking for DDouble fine-art prints: standard and express shipping within Europe, plus international orders."
        canonicalPath="/shipping"
      />
      <Navbar />

      <main id="main">
        <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Legal</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">Shipping & Delivery</h1>
            <p className="mt-4 text-sm text-[#6B6B67]">
              Everything about delivery times, costs, and tracking for your order.
            </p>
          </FadeIn>

          <div className="mt-16 md:mt-24 space-y-12">
            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Processing time</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Prints are produced in our partner studio in Copenhagen. Orders are processed as
                  quickly as possible after purchase, and you'll receive a tracking number by email
                  once your order ships.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Delivery times and costs</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Standard shipping within Europe takes 3–7 business days. Express delivery (1–3
                  business days) is available at checkout. European orders over €50 ship free;
                  otherwise shipping costs are calculated at checkout based on your location.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">International shipping</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  We ship worldwide. International shipping costs are calculated at checkout. Orders
                  shipped outside the EU may be subject to customs duties and import taxes charged
                  by the destination country, which are the recipient's responsibility.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Tracking</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Once your order ships, we email you a tracking number so you can follow your
                  package from our studio to your door.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Packaging</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  All prints are carefully packaged in reinforced tubes using sustainable materials,
                  so your art arrives in perfect condition.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Contact</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Questions about delivery? Write to [Company legal name], [Registered address], or
                  email{" "}
                  <a href="mailto:hello@ddouble.com" className="text-[#1A1A1A] underline underline-offset-4">
                    hello@ddouble.com
                  </a>
                  .
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
