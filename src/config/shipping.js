// src/config/shipping.js
// The threshold NUMBER is out of scope to change — centralize the existing displayed value.
// Note: the value is displayed in the active currency WITHOUT conversion; it is the base
// number shown in the current currency (e.g. 100 GBP shown as "£100.00" in GBP).
export const FREE_SHIPPING_THRESHOLD = 100;

export const STORE_CURRENCY = "GBP";

export function shippingProgress(subtotal, threshold = FREE_SHIPPING_THRESHOLD) {
  const remaining = Math.max(0, threshold - subtotal);
  const percent = subtotal >= threshold ? 100 : Math.min(100, (subtotal / threshold) * 100);
  return { remaining, percent };
}
