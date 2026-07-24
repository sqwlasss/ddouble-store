import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";

function Flag({ country, className = "" }) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${country.toLowerCase()}.png`}
      alt=""
      className={`inline-block w-4 h-3 object-cover ${className}`}
    />
  );
}

export default function CurrencySelector() {
  const { currencyCode, setCurrency, supportedCurrencies, currencyInfo } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-[#6B6B67] hover:text-[#1A1A1A] transition-colors"
        aria-label="Select currency"
      >
        <Flag country={currencyInfo.country} />
        <span className="hidden md:inline">{currencyCode}</span>
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-[#E5E5E1] rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.03)] py-2 min-w-[160px] z-10">
          {supportedCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 text-xs ${
                currencyCode === c.code ? "text-[#1A1A1A] font-medium" : "text-[#6B6B67]"
              } hover:text-[#1A1A1A] transition-colors`}
            >
              <Flag country={c.country} />
              <span>{c.symbol} {c.label}</span>
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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors ${
              currencyCode === c.code
                ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                : "border-[#E5E5E1] text-[#6B6B67] hover:border-[#1A1A1A]"
            }`}
          >
            <Flag country={c.country} />
            <span>{c.symbol} {c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}