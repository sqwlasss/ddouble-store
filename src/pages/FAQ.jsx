import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import Seo from "@/components/Seo";
import FadeIn from "@/components/ddouble/FadeIn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ_SECTIONS = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping within Europe takes 3–7 business days. Express delivery (1–3 days) is available at checkout. All orders are carefully packaged in reinforced tubes to protect your prints.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide. European orders benefit from free shipping over €50. International shipping costs are calculated at checkout based on your location.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll receive a tracking number via email so you can follow your package every step of the way.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, return it in its original packaging for a full refund.",
      },
      {
        q: "Can I exchange a print for a different size?",
        a: "Yes. Contact us within 30 days of receiving your order and we'll arrange an exchange. The print must be in its original, undamaged condition.",
      },
    ],
  },
  {
    title: "Products & Quality",
    items: [
      {
        q: "What paper do you use?",
        a: "All prints are produced on 200gsm museum-grade fine art paper with a subtle matte finish. We use archival pigment inks that resist fading for over 100 years.",
      },
      {
        q: "What sizes are available?",
        a: "Our prints are available in five sizes: 21×30 cm, 30×40 cm, 40×50 cm, 50×70 cm, and 70×100 cm. Size availability may vary by design.",
      },
      {
        q: "Do prints come framed?",
        a: "Prints are sold unframed by default. We offer premium frames in Black Oak, Natural Oak, White Oak, and Dark Walnut that can be added during checkout.",
      },
    ],
  },
  {
    title: "About DDouble",
    items: [
      {
        q: "Where are your prints made?",
        a: "All prints are produced in our partner studio in Copenhagen, Denmark, using sustainable processes and eco-friendly packaging materials.",
      },
      {
        q: "Do you collaborate with artists?",
        a: "Yes. We work with emerging and established artists, photographers, and designers from across Europe. If you're an artist interested in collaborating, reach out via our contact page.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="FAQ — DDouble | Orders, Shipping & Returns"
        description="Answers on ordering, shipping, returns, sizes, and print quality — everything you need to know about DDouble fine-art prints."
        canonicalPath="/faq"
      />
      <Navbar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_SECTIONS.flatMap((section) =>
                section.items.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a,
                  },
                }))
              ),
            }),
          }}
        />

      <main>
      <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-3xl mx-auto">
        <FadeIn>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B67]">Help</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm text-[#6B6B67]">
            Everything you need to know about ordering, shipping, and our prints.
          </p>
        </FadeIn>

        <div className="mt-16 md:mt-24 space-y-12">
          {FAQ_SECTIONS.map((section, si) => (
            <FadeIn key={si} delay={si * 0.08}>
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B67] mb-4">{section.title}</h2>
                <Accordion type="single" collapsible>
                  {section.items.map((item, i) => (
                    <AccordionItem key={i} value={`${si}-${i}`} className="border-b border-[#E5E5E1]">
                      <AccordionTrigger className="text-sm text-[#1A1A1A] font-normal hover:no-underline py-5 text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-[#6B6B67] leading-relaxed pb-5">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
