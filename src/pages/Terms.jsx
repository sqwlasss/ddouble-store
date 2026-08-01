import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import FadeIn from "@/components/ddouble/FadeIn";

/* TODO: fill in real legal entity name/address/VAT before launch */

export default function Terms() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="Terms of Service — DDouble"
        description="The terms that apply when you use the DDouble store and place an order: orders, pricing, shipping, returns, and our responsibilities."
        canonicalPath="/terms"
      />
      <Navbar />

      <main id="main">
        <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Legal</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">Terms of Service</h1>
            <p className="mt-4 text-sm text-[#6B6B67]">
              Last updated: July 2025. These terms are written in plain language. They govern your
              use of the DDouble store and the orders you place with us.
            </p>
          </FadeIn>

          <div className="mt-16 md:mt-24 space-y-12">
            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Who operates the store</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  The DDouble store is operated by [Company legal name], [Registered address]. By
                  using this store and placing an order, you agree to these terms.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Placing an order</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  When you place an order you are making an offer to buy the products in your cart.
                  We confirm your order by email once payment is processed; at that point a contract
                  between you and us is formed. We may decline an order — for example if a product
                  is unavailable or we suspect fraud — and in that case we'll refund any payment
                  you've made.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Prices and payment</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Prices are shown in the currency you select and include any applicable taxes at
                  checkout. Shipping costs are shown before you pay. We accept the payment methods
                  offered at checkout, which are processed securely by Shopify Payments.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Shipping and returns</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  We aim to dispatch every order quickly and carefully packaged. Delivery times,
                  costs, and customs details are described on our{" "}
                  <Link to="/shipping" className="text-[#1A1A1A] underline underline-offset-4">
                    shipping page
                  </Link>
                  . If you change your mind, you can return items within 30 days — full details on
                  our{" "}
                  <Link to="/returns" className="text-[#1A1A1A] underline underline-offset-4">
                    returns page
                  </Link>
                  .
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Artwork and intellectual property</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  The artwork you buy from us remains the intellectual property of its artists. Your
                  purchase gives you the physical print for personal use; you may not reproduce,
                  resell, or redistribute the artwork commercially without permission.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Our responsibility</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  We take care that products match their descriptions and arrive in good condition.
                  If something arrives damaged or faulty, contact us and we'll make it right — see
                  our returns page. Nothing in these terms limits your statutory rights as a
                  consumer.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Governing law</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  These terms are governed by the laws of the country where [Company legal name] is
                  registered, without prejudice to any mandatory consumer-protection rights you have
                  under the law of your country of residence.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Contact</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Questions about these terms? Write to [Company legal name], [Registered address],
                  or email{" "}
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
