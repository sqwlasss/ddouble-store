import { useState, useEffect, useCallback } from "react";
import {
  createCart,
  addLines,
  updateLines,
  removeLines,
  getCart,
  updateCartBuyerIdentity,
} from "@/lib/shopify/cart";
import { getStoredCustomerToken } from "@/lib/shopify/customer";

const CART_ID_KEY = "shopify_cart_id";

function customerCartKey() {
  try {
    const token = getStoredCustomerToken();
    return token ? `shopify_cart_${token.slice(0, 12)}` : null;
  } catch {
    return null;
  }
}

function getStoredCartId() {
  try {
    // Prefer the customer-scoped cart id when a token exists, else the generic key.
    const scopedKey = customerCartKey();
    if (scopedKey) {
      const scoped = localStorage.getItem(scopedKey);
      if (scoped) return scoped;
    }
    return localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
}

function storeCartId(cartId) {
  try {
    localStorage.setItem(CART_ID_KEY, cartId);
  } catch {
    /* best effort */
  }
}

function clearStoredCartId() {
  try {
    localStorage.removeItem(CART_ID_KEY);
    const scopedKey = customerCartKey();
    if (scopedKey) {
      localStorage.removeItem(scopedKey);
    }
  } catch {
    /* best effort */
  }
}

const listeners = new Set();
function notify() {
  listeners.forEach((fn) => fn());
}

export function useShopifyCart(country) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const syncCart = useCallback(async () => {
    const cartId = getStoredCartId();
    if (!cartId) {
      setCart(null);
      return;
    }
    try {
      const fetched = await getCart(cartId);
      if (fetched) {
        setCart(fetched);
      } else {
        clearStoredCartId();
        setCart(null);
      }
    } catch {
      clearStoredCartId();
      setCart(null);
    }
  }, []);

  useEffect(() => {
    syncCart();
    const handler = () => syncCart();
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [syncCart]);

  const addItem = useCallback(
    async (variantId, quantity = 1) => {
      setLoading(true);
      try {
        const cartId = getStoredCartId();
        let updated;
        if (cartId) {
          await updateCartBuyerIdentity(cartId, country);
          updated = await addLines(cartId, [{ merchandiseId: variantId, quantity }]);
        } else {
          updated = await createCart(variantId, quantity, country);
        }
        storeCartId(updated.id);
        try {
          // Also persist cart id under a customer-scoped key for cross-device sync.
          const customerToken = getStoredCustomerToken();
          if (customerToken) {
            localStorage.setItem(`shopify_cart_${customerToken.slice(0, 12)}`, updated.id);
          }
        } catch {
          /* best effort */
        }
        setCart(updated);
        notify();
        return updated;
      } finally {
        setLoading(false);
      }
    },
    [country]
  );

  const updateQuantity = useCallback(async (lineId, quantity) => {
    const cartId = getStoredCartId();
    if (!cartId) return;
    setLoading(true);
    try {
      let updated;
      if (quantity <= 0) {
        updated = await removeLines(cartId, [lineId]);
      } else {
        updated = await updateLines(cartId, [{ id: lineId, quantity }]);
      }
      setCart(updated);
      notify();
      return updated;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (lineId) => {
    const cartId = getStoredCartId();
    if (!cartId) return;
    setLoading(true);
    try {
      const updated = await removeLines(cartId, [lineId]);
      setCart(updated);
      notify();
      return updated;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    clearStoredCartId();
    setCart(null);
    notify();
  }, []);

  const checkout = useCallback(async () => {
    // Abandoned-cart email would hook here (server-side service required — not implemented).
    const cartId = getStoredCartId();
    if (cartId) {
      const customerToken = getStoredCustomerToken();
      if (customerToken) {
        try {
          const updated = await updateCartBuyerIdentity(cartId, country, customerToken);
          if (updated?.checkoutUrl) {
            window.location.href = updated.checkoutUrl;
            return;
          }
        } catch {
          /* fall through to fallback */
        }
      }
    }
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart, country]);

  return {
    cart,
    items: cart?.lines || [],
    totalItems: cart?.totalItems || 0,
    totalPrice: cart ? parseFloat(cart.totalAmount) : 0,
    currency: cart?.currency || "USD",
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
  };
}