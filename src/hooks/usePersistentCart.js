import { useState, useEffect, useCallback, useRef } from "react";
import {
  createCart,
  addLines,
  updateLines,
  removeLines,
  getCart,
} from "@/lib/shopify/cart";

const CART_ID_KEY = "shopify_cart_id";
const CART_CUSTOMER_KEY = "shopify_cart_customer";

function getStoredCartId() {
  return localStorage.getItem(CART_ID_KEY);
}

function storeCartId(cartId) {
  localStorage.setItem(CART_ID_KEY, cartId);
}

function clearStoredCartId() {
  localStorage.removeItem(CART_ID_KEY);
  localStorage.removeItem(CART_CUSTOMER_KEY);
}

const listeners = new Set();
function notify() {
  listeners.forEach((fn) => fn());
}

export function usePersistentCart(customerToken) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const prevTokenRef = useRef(customerToken);

  // Track which customer the cart was created under
  const getCartCustomer = () => localStorage.getItem(CART_CUSTOMER_KEY);

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

  // When customer logs in/out, handle cart transfer
  useEffect(() => {
    const prevToken = prevTokenRef.current;
    prevTokenRef.current = customerToken;

    if (customerToken && !prevToken) {
      // User just logged in - cart is already in localStorage, noop
    } else if (!customerToken && prevToken) {
      // User logged out - cart stays in localStorage as anonymous cart
    }
  }, [customerToken]);

  const addItem = useCallback(
    async (variantId, quantity = 1) => {
      setLoading(true);
      try {
        const cartId = getStoredCartId();
        let updated;
        if (cartId) {
          updated = await addLines(cartId, [{ merchandiseId: variantId, quantity }]);
        } else {
          updated = await createCart(variantId, quantity);
          if (customerToken) {
            localStorage.setItem(CART_CUSTOMER_KEY, customerToken);
          }
        }
        storeCartId(updated.id);
        setCart(updated);
        notify();
        return updated;
      } finally {
        setLoading(false);
      }
    },
    [customerToken]
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

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart]);

  return {
    cart,
    items: cart?.lines || [],
    totalItems: cart?.totalItems || 0,
    totalPrice: cart ? parseFloat(cart.totalAmount) : 0,
    currency: cart?.currency || "MDL",
    loading,
    syncing,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
  };
}
