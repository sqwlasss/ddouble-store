import { useEffect } from "react";

// Close a panel when Escape is pressed while it is open.
// Used by the non-Radix panels (mobile menu, search overlay, sort menu,
// currency menu, mega menu) that need Escape-to-close without a focus trap.
export default function useEscapeClose(open, onClose) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
}
