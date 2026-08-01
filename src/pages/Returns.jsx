import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import FadeIn from "@/components/ddouble/FadeIn";

/* TODO: fill in real legal entity name/address/VAT before launch */

export default function Returns() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="Returns & Refunds — DDouble"
        description="DDouble's 30-day return policy: how to return a print, conditions, refund timing, and exchanges."
        canonicalPath="/returns"
      />
      <Navbar />

      <main id="main">
        <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Legal</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">Returns & Refunds</h1>
            <p className="mt-4 text-sm text-[#6B6B67]">
              Our 30-day return policy, in plain language.
            </p>
          </FadeIn>

          <div className="mt-16 md:mt-24 space-y-12">
            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">30-day returns</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  If you're not completely satisfied with your purchase, you can return it within 30
                  days of receiving it for a full refund. The print must be in its original,
                  undamaged condition and in its original packaging.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">How to start a return</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Email us at{" "}
                  <a href="mailto:hello@ddouble.com" className="text-[#1A1A1A] underline underline-offset-4">
                    hello@ddouble.com
                  </a>{" "}
                  with your order number and the reason for the return, and we'll send you the
                  return instructions.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Refunds</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Once we receive the returned print and confirm it's in its original condition, we
                  process your refund to the original payment method.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Exchanges</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Want a different size or design instead? Contact us within 30 days of receiving
                  your order and we'll arrange an exchange. The original print must be in its
                  original, undamaged condition.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Damaged or faulty items</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  If your order arrives damaged or faulty, contact us and we'll replace it or refund
                  you — including any return shipping costs. Photos of
                  the damage help us resolve things faster.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Contact</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Questions about a return? Write to [Company legal name], [Registered address], or
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
