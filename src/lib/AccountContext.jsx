import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  getStoredCustomerToken,
  clearCustomerToken,
  getCustomer,
  getCustomerOrders,
  updateCustomer,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/shopify/customer";
import { syncShopifyCustomer } from "@/lib/auth/shopifySync";
import { getWishlist, subscribe as wishlistSubscribe } from "@/lib/shopify/wishlist";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState(getWishlist);

  useEffect(() => {
    const unsub = wishlistSubscribe(() => {
      setWishlist(getWishlist());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      autoSync();
    } else {
      setCustomer(null);
      setOrders([]);
      clearCustomerToken();
    }
  }, [isAuthenticated, user?.id]);

  const autoSync = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const synced = await syncShopifyCustomer(user);
      if (synced) {
        setCustomer(synced);
        if (synced.orders) setOrders(synced.orders);
      } else {
        const token = getStoredCustomerToken();
        if (token) {
          const data = await getCustomer(token);
          if (data) {
            setCustomer(data);
            if (data.orders) setOrders(data.orders);
          } else {
            clearCustomerToken();
          }
        }
      }
    } catch {
      setCustomer(null);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
    } catch {}
  }, []);

  const updateProfile = useCallback(async (input) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated");
    const updated = await updateCustomer(token, input);
    setCustomer((prev) => ({ ...prev, ...updated }));
    return updated;
  }, []);

  const addAddress = useCallback(async (address) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated");
    const newAddress = await createAddress(token, address);
    setCustomer((prev) => ({
      ...prev,
      addresses: [...(prev?.addresses || []), newAddress],
    }));
    return newAddress;
  }, []);

  const editAddress = useCallback(async (id, address) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated");
    const updated = await updateAddress(token, id, address);
    setCustomer((prev) => ({
      ...prev,
      addresses: prev?.addresses?.map((a) => (a.id === id ? updated : a)),
    }));
    return updated;
  }, []);

  const removeAddress = useCallback(async (id) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated");
    await deleteAddress(token, id);
    setCustomer((prev) => ({
      ...prev,
      addresses: prev?.addresses?.filter((a) => a.id !== id),
    }));
  }, []);

  const setDefault = useCallback(async (addressId) => {
    const token = getStoredCustomerToken();
    if (!token) throw new Error("Not authenticated");
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
