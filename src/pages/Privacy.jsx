import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import FadeIn from "@/components/ddouble/FadeIn";

/* TODO: fill in real legal entity name/address/VAT before launch */

export default function Privacy() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="Privacy Policy — DDouble"
        description="How DDouble collects, uses, and protects your data: accounts, orders, address autocomplete, cookies, and your rights."
        canonicalPath="/privacy"
      />
      <Navbar />

      <main id="main">
        <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Legal</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">Privacy Policy</h1>
            <p className="mt-4 text-sm text-[#6B6B67]">
              Last updated: July 2025. This policy explains in plain language what data DDouble
              collects, why we collect it, and the choices you have.
            </p>
          </FadeIn>

          <div className="mt-16 md:mt-24 space-y-12">
            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Who we are</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  DDouble is an online art print store operated by [Company legal name], with its
                  registered address at [Registered address]. You can reach us at any time at{" "}
                  <a href="mailto:hello@ddouble.com" className="text-[#1A1A1A] underline underline-offset-4">
                    hello@ddouble.com
                  </a>
                  .
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Data we collect</h2>
                <div className="mt-3 space-y-4 text-sm text-[#6B6B67] leading-relaxed">
                  <p>
                    <strong className="text-[#1A1A1A] font-medium">Account data.</strong> When you
                    create an account, we store your name, email address, and login credentials.
                    Accounts are handled by Firebase, Google's authentication service, which stores
                    your password in an encrypted form — we never see or store your password in
                    plain text.
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A] font-medium">Address autocomplete.</strong> To
                    make checkout faster, the address fields use Google Maps address autocomplete.
                    The addresses you search for are sent to Google to suggest matches; Google's
                    use of this data is governed by Google's own privacy policy.
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A] font-medium">Cart and order data.</strong> We
                    store the items in your cart and, when you place an order, your order details —
                    items, quantities, prices, shipping and billing address, and contact email.
                    Orders are processed through Shopify's infrastructure.
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A] font-medium">Local storage.</strong> Your
                    browser's local storage keeps a small amount of data so the store works
                    correctly: your cart ID, currency preference, favourites and wishlist lists, and
                    a token that keeps you logged in.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">How we use your data</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  We use your data only to run the store: to process and deliver your orders, to
                  keep you logged in and manage your account, to remember your preferences (like
                  currency and favourites), and to respond to your questions. Analytics data is
                  used in aggregate to understand how the store is used and to improve it — never
                  to sell your personal information.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Retention</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  We keep account data for as long as your account is active. Order records are kept
                  as long as required by applicable accounting and tax law. Local storage data stays
                  on your device until you clear it or delete your account. You can ask us at any
                  time to delete your personal data — see "Your rights" below.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Third parties</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  To operate the store we share data with a small number of trusted providers:
                  Firebase and Google (authentication, analytics, and address autocomplete), and
                  Shopify (cart, checkout, and payment processing). Each provider processes your
                  data under its own terms and only for the purpose of providing that service.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Cookies</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  We use a small number of cookies and similar technologies. Necessary cookies keep
                  your cart and login working, and analytics cookies (via Firebase Analytics) help
                  us understand how the store is used so we can improve it.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Your rights</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Depending on where you live, you may have the right to access the data we hold
                  about you, to correct it, to ask us to delete it, and to object to or restrict
                  certain processing. To exercise any of these rights, or if you have a question
                  about your data, just email us at{" "}
                  <a href="mailto:hello@ddouble.com" className="text-[#1A1A1A] underline underline-offset-4">
                    hello@ddouble.com
                  </a>{" "}
                  and we'll help.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] tracking-wide">Contact</h2>
                <p className="mt-3 text-sm text-[#6B6B67] leading-relaxed">
                  Questions about this policy? Write to [Company legal name], [Registered address],
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
