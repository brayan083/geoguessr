import distance from "@turf/distance";
import { point } from "@turf/helpers";
import type { LatLng } from "@/types/game";

/**
 * Calcula la distancia en kilómetros entre dos puntos usando la fórmula de Haversine.
 */
export function distanceKm(a: LatLng, b: LatLng): number {
  const from = point([a.lng, a.lat]);
  const to = point([b.lng, b.lat]);
  return distance(from, to, { units: "kilometers" });
}

/**
 * Sistema de puntuación tipo GeoGuessr:
 *   - 0 km → 5000 puntos
 *   - >20000 km → 0 puntos
 *   - Decaimiento exponencial. A 2000 km ≈ 1000 puntos.
 *
 * Fórmula: 5000 * exp(-distanceKm / 2000)
 */
export function scoreFromDistance(km: number): number {
  if (km <= 0.05) return 5000;
  const score = 5000 * Math.exp(-km / 2000);
  return Math.max(0, Math.round(score));
}

/**
 * Devuelve una descripción legible de la distancia.
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}
