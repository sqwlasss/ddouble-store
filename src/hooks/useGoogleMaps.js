import { useState, useEffect, useRef } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LOADING = {};
const callbacks = {};

export default function useGoogleMaps() {
  const [state, setState] = useState({
    loaded: false,
    error: null,
    available: false,
  });
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (!API_KEY) {
      setState({ loaded: false, error: null, available: false });
      return;
    }

    if (window.google?.maps?.places) {
      setState({ loaded: true, error: null, available: true });
      return;
    }

    if (resolvedRef.current) return;
    resolvedRef.current = true;

    const key = `google-maps-${API_KEY}`;

    if (LOADING[key]) {
      callbacks[key] = callbacks[key] || [];
      callbacks[key].push(setState);
      return;
    }

    LOADING[key] = true;
    callbacks[key] = [setState];

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      LOADING[key] = false;
      (callbacks[key] || []).forEach((cb) =>
        cb({ loaded: true, error: null, available: true })
      );
      delete callbacks[key];
    };
    script.onerror = () => {
      LOADING[key] = false;
      const err = new Error("Failed to load Google Maps API");
      (callbacks[key] || []).forEach((cb) =>
        cb({ loaded: false, error: err, available: false })
      );
      delete callbacks[key];
    };
    document.head.appendChild(script);
  }, []);

  return state;
}
