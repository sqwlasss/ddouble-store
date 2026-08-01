import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useCurrency } from '@/lib/CurrencyContext';
import { useAllProducts } from '@/hooks/useProducts';
import {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
} from '@/lib/shopify/wishlist';

const FAVORITES_KEY = 'shopify_favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(items) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

// Build the persisted entry for a product. variantIds lets the one-way sync
// (favorites -> customer wishlist) run without re-fetching the catalog.
function makeEntry(product) {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    image: product.image,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    variantIds: Array.isArray(product.variants)
      ? product.variants.map((v) => v.id).filter(Boolean)
      : [],
  };
}

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { country } = useCurrency();
  const { data: allProducts } = useAllProducts(country);
  const [items, setItems] = useState(loadFavorites);

  // Fresh copy of items for stable callbacks (mirror + toggle read the
  // pre-change list without depending on `items` directly).
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // One-way sync runs once per authenticated session (best-effort, idempotent):
  //   1. push local favorites into the customer wishlist (addProductToWishlist
  //      no-ops for variant ids already present — no duplicates);
  //   2. load the customer wishlist into the same items list the Favorites page
  //      shows (addFavorite no-ops for product ids already present).
  // Logged out -> localStorage only, no sync runs.
  const reconciledRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated) {
      reconciledRef.current = false;
      return;
    }
    if (reconciledRef.current) return;
    if (!Array.isArray(allProducts)) return; // wait for catalog to resolve variant ids -> products
    reconciledRef.current = true;
    try {
      const productById = new Map(allProducts.map((p) => [p.id, p]));
      // 1) favorites -> customer wishlist (catalog-first so legacy entries
      //    without variantIds still sync).
      loadFavorites().forEach((entry) => {
        addProductToWishlist(productById.get(entry.id) || entry);
      });
      // 2) customer wishlist -> favorites (merge, deduped by product id).
      const productByVariant = new Map();
      allProducts.forEach((product) => {
        product.variants.forEach((v) => productByVariant.set(v.id, product));
      });
      getWishlist().forEach((variantId) => {
        const product = productByVariant.get(variantId);
        if (product) addFavorite(product);
      });
    } catch {
      // Best-effort sync — a failure must never break auth or favorites.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, allProducts]);

  // Mirror a favorites change into the customer wishlist (one-way direction:
  // favorites is the source of truth). LocalStorage on both sides, so this also
  // runs logged out; the auth-time reconcile above catches any drift.
  const mirrorToWishlist = useCallback((product, remove = false) => {
    try {
      if (remove) removeProductFromWishlist(product);
      else addProductToWishlist(product);
    } catch {
      // Best-effort — never break favorites for a wishlist write failure.
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === FAVORITES_KEY) {
        setItems(loadFavorites());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const favoritesMap = useMemo(() => {
    const map = new Map();
    items.forEach((item) => map.set(item.id, item));
    return map;
  }, [items]);

  const favoritesCount = items.length;

  const isFavorite = useCallback(
    (productId) => favoritesMap.has(productId),
    [favoritesMap]
  );

  const addFavorite = useCallback((product) => {
    if (!product?.id) return;
    const entry = makeEntry(product);
    setItems((prev) => {
      if (prev.some((item) => item.id === entry.id)) return prev;
      const next = [...prev, entry];
      saveFavorites(next);
      return next;
    });
    mirrorToWishlist(product);
  }, [mirrorToWishlist]);

  const removeFavorite = useCallback((productId) => {
    const target = itemsRef.current.find((item) => item.id === productId);
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      saveFavorites(next);
      return next;
    });
    if (target) mirrorToWishlist(target, true);
  }, [mirrorToWishlist]);

  const toggleFavorite = useCallback((product) => {
    if (!product?.id) return;
    const entry = makeEntry(product);
    const wasFavorite = itemsRef.current.some((item) => item.id === product.id);
    setItems((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      let next;
      if (idx === -1) {
        next = [...prev, entry];
      } else {
        next = prev.filter((item) => item.id !== product.id);
      }
      saveFavorites(next);
      return next;
    });
    mirrorToWishlist(product, wasFavorite);
  }, [mirrorToWishlist]);

  const value = useMemo(
    () => ({
      favorites: items,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      favoritesCount,
    }),
    [items, addFavorite, removeFavorite, toggleFavorite, isFavorite, favoritesCount]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
