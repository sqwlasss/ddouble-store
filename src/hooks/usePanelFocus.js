import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Moves focus into a panel when it opens (first focusable element, or the
// panel container itself) and restores focus to the element that was focused
// before the panel opened when it closes. Returns saveFocus(), to be called
// from the open/toggle handler so the pre-open active element is remembered.
export default function usePanelFocus(open, panelRef) {
  const returnFocusRef = useRef(null);

  const saveFocus = () => {
    if (!open) returnFocusRef.current = document.activeElement;
  };

  useEffect(() => {
    if (open) {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector(FOCUSABLE);
      (first || panel).focus?.();
      return;
    }
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (!target) return;
    const active = document.activeElement;
    // Only restore when focus is on the body or still inside the closing
    // panel — an outside click that already focused another control should
    // not have focus yanked back to the trigger.
    if (active === document.body || (panelRef.current && panelRef.current.contains(active))) {
      target.focus?.();
    }
  }, [open, panelRef]);

  return saveFocus;
}
