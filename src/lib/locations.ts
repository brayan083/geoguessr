import type { LatLng } from "@/types/game";

/**
 * Pool curado de coordenadas con Street View garantizado.
 * Como Google Street View no cubre todo el mundo (sobre todo zonas rurales remotas),
 * usamos lugares conocidos donde sabemos que hay cobertura.
 *
 * Para una versión más avanzada, podrías usar la Street View Service
 * (StreetViewService.getPanorama) para verificar dinámicamente si una coordenada
 * aleatoria tiene cobertura y, si no, buscar la panorámica más cercana.
 */

type RegionKey = "world" | "europe" | "americas" | "asia";

const LOCATIONS: Record<RegionKey, LatLng[]> = {
  world: [
    // Europa
    { lat: 48.8584, lng: 2.2945 },     // Torre Eiffel, París
    { lat: 41.8902, lng: 12.4922 },    // Coliseo, Roma
    { lat: 51.5007, lng: -0.1246 },    // Big Ben, Londres
    { lat: 40.4168, lng: -3.7038 },    // Madrid centro
    { lat: 52.5163, lng: 13.3777 },    // Puerta de Brandeburgo, Berlín
    { lat: 59.3293, lng: 18.0686 },    // Estocolmo
    { lat: 55.6761, lng: 12.5683 },    // Copenhague
    { lat: 50.0875, lng: 14.4213 },    // Praga
    { lat: 38.7223, lng: -9.1393 },    // Lisboa
    { lat: 37.9755, lng: 23.7348 },    // Atenas (Acrópolis)
    // Américas
    { lat: 40.7580, lng: -73.9855 },   // Times Square, NYC
    { lat: 34.1341, lng: -118.3215 },  // Hollywood, LA
    { lat: -22.9519, lng: -43.2105 },  // Cristo Redentor, Río
    { lat: 19.4326, lng: -99.1332 },   // Ciudad de México
    { lat: -34.6037, lng: -58.3816 },  // Buenos Aires
    { lat: 43.6426, lng: -79.3871 },   // Toronto CN Tower
    { lat: -33.4489, lng: -70.6693 },  // Santiago de Chile
    // Asia
    { lat: 35.6595, lng: 139.7004 },   // Shibuya, Tokio
    { lat: 22.2793, lng: 114.1628 },   // Hong Kong
    { lat: 1.2841, lng: 103.8511 },    // Singapur Marina Bay
    { lat: 13.7563, lng: 100.5018 },   // Bangkok
    { lat: 28.6139, lng: 77.2090 },    // Nueva Delhi
    { lat: 37.5665, lng: 126.9780 },   // Seúl
    // Oceanía y otros
    { lat: -33.8568, lng: 151.2153 },  // Ópera de Sídney
    { lat: -36.8485, lng: 174.7633 },  // Auckland
    { lat: -33.9249, lng: 18.4241 },   // Ciudad del Cabo
    { lat: 30.0444, lng: 31.2357 },    // El Cairo (Pirámides cerca)
    { lat: 25.2048, lng: 55.2708 },    // Dubái
  ],
  europe: [
    { lat: 48.8584, lng: 2.2945 },
    { lat: 41.8902, lng: 12.4922 },
    { lat: 51.5007, lng: -0.1246 },
    { lat: 40.4168, lng: -3.7038 },
    { lat: 52.5163, lng: 13.3777 },
    { lat: 59.3293, lng: 18.0686 },
    { lat: 55.6761, lng: 12.5683 },
    { lat: 50.0875, lng: 14.4213 },
    { lat: 38.7223, lng: -9.1393 },
    { lat: 37.9755, lng: 23.7348 },
    { lat: 47.4979, lng: 19.0402 },    // Budapest
    { lat: 52.3676, lng: 4.9041 },     // Ámsterdam
    { lat: 53.3498, lng: -6.2603 },    // Dublín
    { lat: 60.1699, lng: 24.9384 },    // Helsinki
    { lat: 45.4642, lng: 9.1900 },     // Milán
  ],
  americas: [
    { lat: 40.7580, lng: -73.9855 },
    { lat: 34.1341, lng: -118.3215 },
    { lat: -22.9519, lng: -43.2105 },
    { lat: 19.4326, lng: -99.1332 },
    { lat: -34.6037, lng: -58.3816 },
    { lat: 43.6426, lng: -79.3871 },
    { lat: -33.4489, lng: -70.6693 },
    { lat: 25.7617, lng: -80.1918 },   // Miami
    { lat: 41.8781, lng: -87.6298 },   // Chicago
    { lat: 49.2827, lng: -123.1207 },  // Vancouver
    { lat: -12.0464, lng: -77.0428 },  // Lima
    { lat: 4.7110, lng: -74.0721 },    // Bogotá
  ],
  asia: [
    { lat: 35.6595, lng: 139.7004 },
    { lat: 22.2793, lng: 114.1628 },
    { lat: 1.2841, lng: 103.8511 },
    { lat: 13.7563, lng: 100.5018 },
    { lat: 28.6139, lng: 77.2090 },
    { lat: 37.5665, lng: 126.9780 },
    { lat: 31.2304, lng: 121.4737 },   // Shanghái
    { lat: 39.9042, lng: 116.4074 },   // Pekín
    { lat: -6.2088, lng: 106.8456 },   // Yakarta
    { lat: 14.5995, lng: 120.9842 },   // Manila
    { lat: 21.0285, lng: 105.8542 },   // Hanói
    { lat: 41.0082, lng: 28.9784 },    // Estambul
  ],
};

/**
 * Genera una secuencia aleatoria de N ubicaciones únicas para una partida.
 * Se hace en el servidor (cuando se crea/empieza la sala) para que todos los
 * jugadores vean las mismas coordenadas.
 */
export function pickRoundLocations(
  region: RegionKey,
  count: number,
): LatLng[] {
  const pool = [...LOCATIONS[region]];
  const result: LatLng[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}
