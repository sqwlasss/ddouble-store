const WISHLIST_KEY = "shopify_wishlist";

function getWishlistRaw() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

const listeners = new Set();
function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getWishlist() {
  return getWishlistRaw();
}

export function isInWishlist(variantId) {
  return getWishlistRaw().includes(variantId);
}

export function isProductInWishlist(productVariantIds) {
  const wishlist = getWishlistRaw();
  return productVariantIds.some((id) => wishlist.includes(id));
}

export function toggleWishlist(variantId) {
  const items = getWishlistRaw();
  const index = items.indexOf(variantId);
  if (index === -1) {
    items.push(variantId);
  } else {
    items.splice(index, 1);
  }
  saveWishlist(items);
  notify();
  return items;
}

export function addToWishlist(variantId) {
  const items = getWishlistRaw();
  if (!items.includes(variantId)) {
    items.push(variantId);
    saveWishlist(items);
    notify();
  }
  return items;
}

export function removeFromWishlist(variantId) {
  const items = getWishlistRaw().filter((id) => id !== variantId);
  saveWishlist(items);
  notify();
  return items;
}

export function clearWishlist() {
  localStorage.removeItem(WISHLIST_KEY);
  notify();
}
