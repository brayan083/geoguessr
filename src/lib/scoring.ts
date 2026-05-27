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
 * Curva de puntuación competitiva:
 *   - 0 km   → 5000 pts
 *   - 1 km   ≈ 4800 pts
 *   - 10 km  ≈ 4100 pts
 *   - 100 km ≈ 2200 pts
 *   - 500 km ≈  400 pts
 *   - 1000km ≈   30 pts
 *
 * Fórmula: 5000 * exp(-distanceKm / 500)  (decaimiento 4× más agresivo)
 */
export function scoreFromDistance(km: number): number {
  if (km <= 0.05) return 5000;
  const score = 5000 * Math.exp(-km / 500);
  return Math.max(0, Math.round(score));
}

/** Bonus de velocidad según posición de envío (1-indexed). */
export function speedBonusForPosition(position: number): number {
  if (position === 1) return 500;
  if (position === 2) return 300;
  if (position === 3) return 150;
  return 0;
}

/**
 * Devuelve una descripción legible de la distancia.
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}
