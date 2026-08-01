import { useState } from "react";
import { Mail, MapPin } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/ddouble/Navbar";
import Footer from "@/components/ddouble/Footer";
import FadeIn from "@/components/ddouble/FadeIn";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F9F9F7] min-h-screen">
      <Seo
        title="Contact — DDouble | Get in Touch"
        description="Questions about orders, shipping, or returns? Contact the DDouble studio in Copenhagen — we typically respond within 24 hours."
        canonicalPath="/contact"
      />
      <Navbar />

      <main>
      <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <FadeIn>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#5A5A56]">Get in touch</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">Contact</h1>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mt-16 md:mt-24">
          {/* Form */}
          <FadeIn>
            {submitted ? (
              <div className="py-16">
                <h2 className="text-2xl font-light text-[#1A1A1A]">Thank you</h2>
                <p className="mt-4 text-sm text-[#6B6B67]">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56]">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-[#E5E5E1] py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56]">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-[#E5E5E1] py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56]">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-[#E5E5E1] py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#2A2A2A] transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </FadeIn>

          {/* Info */}
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={14} className="text-[#6B6B67]" />
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56]">Email</h3>
                </div>
                <a href="mailto:hello@ddouble.com" className="text-sm text-[#1A1A1A] hover:text-[#6B6B67] transition-colors">
                  hello@ddouble.com
                </a>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#6B6B67]" />
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56]">Studio</h3>
                </div>
                <p className="text-sm text-[#1A1A1A]">
                  Nørrebrogade 45<br />
                  2200 Copenhagen N<br />
                  Denmark
                </p>
              </div>
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-3">Business Hours</h3>
                <p className="text-sm text-[#1A1A1A]">
                  Monday – Friday: 9:00 – 17:00 CET<br />
                  We typically respond within 24 hours.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
