import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import useEscapeClose from "@/hooks/useEscapeClose";
import usePanelFocus from "@/hooks/usePanelFocus";

export default function CurrencySelector() {
  const { currencyCode, setCurrency, supportedCurrencies, currencyInfo } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);

  // Escape closes the menu; focus moves into it on open and back to the
  // trigger on close.
  const saveCurrencyFocus = usePanelFocus(open, menuRef);
  const toggle = () => {
    saveCurrencyFocus();
    setOpen((prev) => !prev);
  };
  useEscapeClose(open, () => setOpen(false));

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="min-h-11 flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
        aria-label="Select currency"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>{currencyInfo.symbol}</span>
        <span className="hidden md:inline">{currencyCode}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div ref={menuRef} tabIndex={-1} className="absolute right-0 top-full mt-2 bg-white border border-[#E5E5E1] rounded-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] py-2 min-w-[140px] z-10">
          {supportedCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-xs ${
                currencyCode === c.code ? "text-[#1A1A1A] font-medium" : "text-[#6B6B67]"
              } hover:text-[#1A1A1A] transition-colors`}
            >
              {c.symbol} {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileCurrencySelector() {
  const { currencyCode, setCurrency, supportedCurrencies } = useCurrency();

  return (
    <div className="border-t border-[#E5E5E1] pt-4 mt-4">
      <span className="text-xs uppercase tracking-[0.12em] text-[#6B6B67] block mb-2">
        Currency
      </span>
      <div className="flex flex-wrap gap-2">
        {supportedCurrencies.map((c) => (
          <button
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={`px-3 min-h-11 flex items-center justify-center text-xs border transition-colors ${
              currencyCode === c.code
                ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                : "border-[#E5E5E1] text-[#6B6B67] hover:border-[#1A1A1A]"
            }`}
          >
            {c.symbol} {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}