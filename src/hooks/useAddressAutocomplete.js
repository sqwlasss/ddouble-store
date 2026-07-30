import { useState, useEffect, useRef, useCallback } from "react";
import useGoogleMaps from "./useGoogleMaps";

function extractAddressComponents(components) {
  const result = {
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "",
    countryCode: "",
  };

  if (!components) return result;

  const getType = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const getTypeShort = (type) =>
    components.find((c) => c.types.includes(type))?.short_name || "";

  const streetNumber = getType("street_number");
  const route = getType("route");
  const subpremise = getType("subpremise");

  result.address1 = [streetNumber, route].filter(Boolean).join(" ");
  result.address2 = subpremise;
  result.city = getType("locality") || getType("sublocality") || getType("postal_town");
  result.province = getType("administrative_area_level_1");
  result.zip = getType("postal_code");
  result.country = getType("country");
  result.countryCode = getTypeShort("country");

  return result;
}

export default function useAddressAutocomplete() {
  const { loaded, available } = useGoogleMaps();
  const autocompleteRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loaded && window.google?.maps?.places && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, [loaded]);

  const fetchPredictions = useCallback(
    (input) => {
      if (!autocompleteRef.current || !input || input.length < 3) {
        setPredictions([]);
        return;
      }
      setLoading(true);
      autocompleteRef.current.getPlacePredictions(
        { input, types: ["address"] },
        (results, status) => {
          if (status === "OK" && results) {
            setPredictions(
              results.map((r) => ({
                placeId: r.place_id,
                description: r.description,
                mainText: r.structured_formatting?.main_text || r.description,
                secondaryText:
                  r.structured_formatting?.secondary_text || "",
              }))
            );
          } else {
            setPredictions([]);
          }
          setLoading(false);
        }
      );
    },
    []
  );

  const getPlaceDetails = useCallback((placeId) => {
    return new Promise((resolve, reject) => {
      if (!window.google?.maps?.places) {
        reject(new Error("Google Maps not loaded"));
        return;
      }
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      service.getDetails(
        { placeId, fields: ["address_components"] },
        (place, status) => {
          if (status === "OK" && place) {
            resolve(extractAddressComponents(place.address_components));
          } else {
            reject(new Error("Could not retrieve address details"));
          }
        }
      );
    });
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  return { predictions, loading, fetchPredictions, getPlaceDetails, clearPredictions, available };
}
