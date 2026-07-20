import { useState } from "react";
import { Mail, MapPin } from "lucide-react";
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
      <Navbar />

      <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <FadeIn>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#757571]">Get in touch</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-light text-[#1A1A1A]">Contact</h1>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mt-16 md:mt-24">
          {/* Form */}
          <FadeIn>
            {submitted ? (
              <div className="py-16">
                <h2 className="text-2xl font-light text-[#1A1A1A]">Thank you</h2>
                <p className="mt-4 text-sm text-[#757571]">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] text-[#757571]">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-[#E5E5E1] py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] text-[#757571]">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-[#E5E5E1] py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] text-[#757571]">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-[#E5E5E1] py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#D9D2C5] hover:text-[#1A1A1A] transition-all duration-300"
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
                  <Mail size={14} className="text-[#757571]" />
                  <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#757571]">Email</h3>
                </div>
                <a href="mailto:hello@ddouble.com" className="text-sm text-[#1A1A1A] hover:text-[#757571] transition-colors">
                  hello@ddouble.com
                </a>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#757571]" />
                  <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#757571]">Studio</h3>
                </div>
                <p className="text-sm text-[#1A1A1A]">
                  Nørrebrogade 45<br />
                  2200 Copenhagen N<br />
                  Denmark
                </p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#757571] mb-3">Business Hours</h3>
                <p className="text-sm text-[#1A1A1A]">
                  Monday – Friday: 9:00 – 17:00 CET<br />
                  We typically respond within 24 hours.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <Footer />
    </div>
  );
}
