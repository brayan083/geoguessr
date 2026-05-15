"use client";

import { useJsApiLoader, type Libraries } from "@react-google-maps/api";

const LIBRARIES: Libraries = ["places"];

/**
 * Hook compartido para cargar la API de Google Maps una sola vez.
 */
export function useGoogleMapsLoader() {
  return useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });
}
