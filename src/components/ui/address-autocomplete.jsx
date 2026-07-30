import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import useAddressAutocomplete from "@/hooks/useAddressAutocomplete";

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  id,
  placeholder = "Street address",
  required,
  debounceMs = 300,
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);

  const {
    predictions,
    loading,
    fetchPredictions,
    getPlaceDetails,
    clearPredictions,
    available,
  } = useAddressAutocomplete();

  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      onChange(val);
      if (!available) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (val.length >= 3) {
        debounceRef.current = setTimeout(() => {
          fetchPredictions(val);
          setOpen(true);
          setHighlightedIndex(-1);
        }, debounceMs);
      } else {
        clearPredictions();
        setOpen(false);
      }
    },
    [onChange, fetchPredictions, clearPredictions, debounceMs, available]
  );

  const handleSelect = useCallback(
    async (prediction) => {
      setOpen(false);
      clearPredictions();
      onChange(prediction.description);
      try {
        const details = await getPlaceDetails(prediction.placeId);
        if (onPlaceSelect) onPlaceSelect(details);
      } catch {
        // Details failed - user can still edit manually
      }
    },
    [getPlaceDetails, onChange, onPlaceSelect, clearPredictions]
  );

  useEffect(() => {
    if (!open || !predictions.length) {
      setHighlightedIndex(-1);
    }
  }, [open, predictions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open || !predictions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && predictions[highlightedIndex]) {
          handleSelect(predictions[highlightedIndex]);
          e.target.blur();
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const showSuggestions =
    available && open && (predictions.length > 0 || loading);

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (predictions.length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#6B6B67]" />
      )}
      {showSuggestions && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full rounded-md border border-[#E5E5E1] bg-white shadow-lg max-h-60 overflow-y-auto py-1"
        >
          {predictions.map((p, idx) => (
            <li
              key={p.placeId}
              onClick={() => handleSelect(p)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={cn(
                "flex items-start gap-2 px-3 py-2 text-sm cursor-pointer transition-colors",
                highlightedIndex === idx
                  ? "bg-[#F1F0EC]"
                  : "hover:bg-[#F1F0EC]"
              )}
            >
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#6B6B67]" />
              <div className="min-w-0">
                <div className="text-[#1A1A1A] truncate">{p.mainText}</div>
                {p.secondaryText && (
                  <div className="text-[#6B6B67] text-xs truncate">
                    {p.secondaryText}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
