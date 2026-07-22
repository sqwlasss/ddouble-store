import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  getStoredCustomerToken,
  storeCustomerToken,
  clearCustomerToken,
  getCustomer,
  getCustomerOrders,
  updateCustomer,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  createCustomerToken,
} from "@/lib/shopify/customer";
import { getWishlist, subscribe as wishlistSubscribe } from "@/lib/shopify/wishlist";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState(getWishlist);

  // Sync wishlist across tabs/events
  useEffect(() => {
    const unsub = wishlistSubscribe(() => {
      setWishlist(getWishlist());
    });
    return unsub;
  }, []);

  // When user logs in/out via Base44, sync Shopify customer token
  useEffect(() => {
    if (isAuthenticated) {
      loadCustomer();
    } else {
      setCustomer(null);
      setOrders([]);
    }
  }, [isAuthenticated]);

  const loadCustomer = useCallback(async () => {
    let token = getStoredCustomerToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await getCustomer(token);
      if (data) {
        setCustomer(data);
        if (data.orders) setOrders(data.orders);
      } else {
        clearCustomerToken();
      }
    } catch {
      clearCustomerToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const signInToShopify = useCallback(async (email, password) => {
    const result = await createCustomerToken(email, password);
    await loadCustomer();
    return result;
  }, [loadCustomer]);

  const signOutOfShopify = useCallback(() => {
    clearCustomerToken();
    setCustomer(null);
    setOrders([]);
  }, []);

  const refreshCustomer = useCallback(async () => {
    const token = getStoredCustomerToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await getCustomer(token);
      if (data) {
        setCustomer(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    const token = getStoredCustomerToken();
    if (!token) return;
    try {
      const data = await getCustomerOrders(token);
      setOrders(data);
    } catch {
      // silent
    }
  }, []);

  const updateProfile = useCallback(async (input) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated with Shopify");
    const updated = await updateCustomer(token, input);
    setCustomer((prev) => ({ ...prev, ...updated }));
    return updated;
  }, []);

  const addAddress = useCallback(async (address) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated with Shopify");
    const newAddress = await createAddress(token, address);
    setCustomer((prev) => ({
      ...prev,
      addresses: [...(prev?.addresses || []), newAddress],
    }));
    return newAddress;
  }, []);

  const editAddress = useCallback(async (id, address) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated with Shopify");
    const updated = await updateAddress(token, id, address);
    setCustomer((prev) => ({
      ...prev,
      addresses: prev?.addresses?.map((a) => (a.id === id ? updated : a)),
    }));
    return updated;
  }, []);

  const removeAddress = useCallback(async (id) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated with Shopify");
    await deleteAddress(token, id);
    setCustomer((prev) => ({
      ...prev,
      addresses: prev?.addresses?.filter((a) => a.id !== id),
    }));
  }, []);

  const setDefault = useCallback(async (addressId) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated with Shopify");
    const result = await setDefaultAddress(token, addressId);
    setCustomer((prev) => ({
      ...prev,
      defaultAddress: prev?.addresses?.find((a) => a.id === addressId),
    }));
    return result;
  }, []);

  return (
    <AccountContext.Provider
      value={{
        customer,
        orders,
        loading,
        wishlist,
        hasShopifyAccount: !!getStoredCustomerToken(),
        signInToShopify,
        signOutOfShopify,
        refreshCustomer,
        refreshOrders,
        updateProfile,
        addAddress,
        editAddress,
        removeAddress,
        setDefaultAddress: setDefault,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
