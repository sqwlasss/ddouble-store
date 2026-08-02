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

// Resolve the variant ids for a product-like item. Accepts either a catalog
// product ({ variants: [{ id }] }) or a favorites entry ({ variantIds: [id] })
// so the same helpers work for both stores.
export function getVariantIds(item) {
  if (!item) return [];
  if (Array.isArray(item.variantIds) && item.variantIds.length) {
    return item.variantIds;
  }
  if (Array.isArray(item.variants)) {
    return item.variants.map((v) => v.id).filter(Boolean);
  }
  return [];
}

// Add every variant of a product to the customer wishlist. Idempotent: variant
// ids already present are left untouched (no duplicates).
export function addProductToWishlist(product) {
  const variantIds = getVariantIds(product);
  if (!variantIds.length) return getWishlistRaw();
  const items = getWishlistRaw();
  let changed = false;
  variantIds.forEach((id) => {
    if (!items.includes(id)) {
      items.push(id);
      changed = true;
    }
  });
  if (changed) {
    saveWishlist(items);
    notify();
  }
  return items;
}

// Remove every variant of a product from the customer wishlist.
export function removeProductFromWishlist(product) {
  const variantIds = new Set(getVariantIds(product));
  if (!variantIds.size) return getWishlistRaw();
  const items = getWishlistRaw().filter((id) => !variantIds.has(id));
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
