import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

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

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [items, setItems] = useState(loadFavorites);

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
    const entry = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      image: product.image,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
    };
    setItems((prev) => {
      if (prev.some((item) => item.id === entry.id)) return prev;
      const next = [...prev, entry];
      saveFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((productId) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      saveFavorites(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((product) => {
    if (!product?.id) return;
    setItems((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      let next;
      if (idx === -1) {
        const entry = {
          id: product.id,
          handle: product.handle,
          title: product.title,
          image: product.image,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? null,
        };
        next = [...prev, entry];
      } else {
        next = prev.filter((item) => item.id !== product.id);
      }
      saveFavorites(next);
      return next;
    });
  }, []);

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
