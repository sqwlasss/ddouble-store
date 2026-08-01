import { useEffect, useState } from "react";

const CONSENT_KEY = "ddouble_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const decide = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("consent-change", { detail: value === "accepted" }));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] bg-[#1A1A1A] text-[#F9F9F7] px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <p className="text-xs leading-relaxed max-w-xl">
          We use cookies to improve your experience and measure site usage. See our{" "}
          <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => decide("rejected")} className="text-xs uppercase tracking-[0.15em] border border-[#F9F9F7] px-5 py-2.5 hover:bg-[#F9F9F7] hover:text-[#1A1A1A] transition-colors">
            Reject
          </button>
          <button onClick={() => decide("accepted")} className="text-xs uppercase tracking-[0.15em] bg-[#F9F9F7] text-[#1A1A1A] px-5 py-2.5 hover:bg-[#E5E5E1] transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
