import type { LatLng } from "@/types/game";

export interface StreetViewLocation {
  position: LatLng;
  panoId: string;
}

// ---------------------------------------------------------------------------
// Bounding boxes de zonas urbanas con alta densidad de Street View.
// Distribuidas globalmente para dar variedad.
// ---------------------------------------------------------------------------
const URBAN_BBOXES = [
  // Europa occidental
  { minLat: 48.81, maxLat: 48.91, minLng: 2.29,   maxLng: 2.42   }, // París
  { minLat: 51.47, maxLat: 51.55, minLng: -0.18,  maxLng: 0.02   }, // Londres
  { minLat: 40.39, maxLat: 40.47, minLng: -3.75,  maxLng: -3.65  }, // Madrid
  { minLat: 41.86, maxLat: 41.92, minLng: 12.45,  maxLng: 12.52  }, // Roma
  { minLat: 52.49, maxLat: 52.54, minLng: 13.35,  maxLng: 13.44  }, // Berlín
  { minLat: 48.19, maxLat: 48.24, minLng: 16.35,  maxLng: 16.40  }, // Viena
  { minLat: 47.36, maxLat: 47.40, minLng: 8.52,   maxLng: 8.57   }, // Zúrich
  { minLat: 50.83, maxLat: 50.87, minLng: 4.33,   maxLng: 4.40   }, // Bruselas
  { minLat: 52.35, maxLat: 52.39, minLng: 4.87,   maxLng: 4.93   }, // Ámsterdam
  { minLat: 59.91, maxLat: 59.94, minLng: 10.72,  maxLng: 10.78  }, // Oslo
  { minLat: 59.32, maxLat: 59.35, minLng: 18.04,  maxLng: 18.10  }, // Estocolmo
  { minLat: 55.66, maxLat: 55.70, minLng: 12.54,  maxLng: 12.60  }, // Copenhague
  { minLat: 60.16, maxLat: 60.19, minLng: 24.92,  maxLng: 24.97  }, // Helsinki
  { minLat: 53.33, maxLat: 53.36, minLng: -6.29,  maxLng: -6.23  }, // Dublín
  { minLat: 38.70, maxLat: 38.73, minLng: -9.16,  maxLng: -9.12  }, // Lisboa
  { minLat: 50.06, maxLat: 50.10, minLng: 14.40,  maxLng: 14.46  }, // Praga
  { minLat: 47.48, maxLat: 47.52, minLng: 19.03,  maxLng: 19.08  }, // Budapest
  { minLat: 52.22, maxLat: 52.26, minLng: 21.00,  maxLng: 21.06  }, // Varsovia
  { minLat: 45.44, maxLat: 45.48, minLng: 9.17,   maxLng: 9.22   }, // Milán
  { minLat: 43.29, maxLat: 43.32, minLng: 5.36,   maxLng: 5.40   }, // Marsella
  { minLat: 53.54, maxLat: 53.58, minLng: 9.98,   maxLng: 10.03  }, // Hamburgo
  { minLat: 48.13, maxLat: 48.17, minLng: 11.55,  maxLng: 11.61  }, // Múnich
  // Europa del este
  { minLat: 55.74, maxLat: 55.77, minLng: 37.59,  maxLng: 37.66  }, // Moscú
  { minLat: 59.92, maxLat: 59.95, minLng: 30.30,  maxLng: 30.36  }, // San Petersburgo
  { minLat: 50.43, maxLat: 50.47, minLng: 30.51,  maxLng: 30.57  }, // Kiev
  { minLat: 44.80, maxLat: 44.84, minLng: 20.44,  maxLng: 20.49  }, // Belgrado
  { minLat: 44.42, maxLat: 44.45, minLng: 26.08,  maxLng: 26.12  }, // Bucarest
  { minLat: 42.68, maxLat: 42.71, minLng: 23.30,  maxLng: 23.34  }, // Sofía
  { minLat: 37.97, maxLat: 38.00, minLng: 23.72,  maxLng: 23.75  }, // Atenas
  { minLat: 41.00, maxLat: 41.04, minLng: 28.96,  maxLng: 29.02  }, // Estambul
  // Norteamérica
  { minLat: 40.72, maxLat: 40.78, minLng: -74.01, maxLng: -73.96 }, // Manhattan
  { minLat: 40.65, maxLat: 40.70, minLng: -73.98, maxLng: -73.93 }, // Brooklyn
  { minLat: 34.02, maxLat: 34.07, minLng: -118.32,maxLng: -118.24}, // Los Ángeles
  { minLat: 37.76, maxLat: 37.80, minLng: -122.44,maxLng: -122.38}, // San Francisco
  { minLat: 41.87, maxLat: 41.91, minLng: -87.66, maxLng: -87.61 }, // Chicago
  { minLat: 29.74, maxLat: 29.78, minLng: -95.39, maxLng: -95.34 }, // Houston
  { minLat: 33.44, maxLat: 33.48, minLng: -112.09,maxLng: -112.04}, // Phoenix
  { minLat: 32.77, maxLat: 32.80, minLng: -96.82, maxLng: -96.77 }, // Dallas
  { minLat: 25.76, maxLat: 25.79, minLng: -80.21, maxLng: -80.17 }, // Miami
  { minLat: 47.60, maxLat: 47.63, minLng: -122.34,maxLng: -122.29}, // Seattle
  { minLat: 45.51, maxLat: 45.54, minLng: -122.69,maxLng: -122.64}, // Portland
  { minLat: 39.73, maxLat: 39.76, minLng: -104.99,maxLng: -104.94}, // Denver
  { minLat: 42.34, maxLat: 42.37, minLng: -71.09, maxLng: -71.04 }, // Boston
  { minLat: 43.64, maxLat: 43.67, minLng: -79.41, maxLng: -79.36 }, // Toronto
  { minLat: 45.49, maxLat: 45.53, minLng: -73.59, maxLng: -73.54 }, // Montreal
  { minLat: 49.27, maxLat: 49.30, minLng: -123.14,maxLng: -123.09}, // Vancouver
  { minLat: 19.40, maxLat: 19.45, minLng: -99.17, maxLng: -99.10 }, // Ciudad de México
  { minLat: 20.96, maxLat: 21.00, minLng: -89.64, maxLng: -89.59 }, // Mérida (México)
  { minLat: 25.66, maxLat: 25.70, minLng: -100.33,maxLng: -100.28}, // Monterrey
  // Sudamérica
  { minLat: -34.62, maxLat: -34.58, minLng: -58.42,maxLng: -58.36}, // Buenos Aires
  { minLat: -23.57, maxLat: -23.53, minLng: -46.66,maxLng: -46.61}, // São Paulo
  { minLat: -22.92, maxLat: -22.88, minLng: -43.20,maxLng: -43.15}, // Río de Janeiro
  { minLat: -33.46, maxLat: -33.43, minLng: -70.69,maxLng: -70.63}, // Santiago
  { minLat: -12.07, maxLat: -12.04, minLng: -77.06,maxLng: -77.02}, // Lima
  { minLat: 4.68,   maxLat: 4.72,   minLng: -74.09,maxLng: -74.05}, // Bogotá
  { minLat: 10.47,  maxLat: 10.51,  minLng: -66.93,maxLng: -66.88}, // Caracas
  { minLat: -0.24,  maxLat: -0.20,  minLng: -78.53,maxLng: -78.48}, // Quito
  { minLat: -16.42, maxLat: -16.38, minLng: -71.55,maxLng: -71.50}, // Arequipa
  { minLat: -30.05, maxLat: -30.01, minLng: -51.22,maxLng: -51.17}, // Porto Alegre
  // Asia oriental
  { minLat: 35.65,  maxLat: 35.70,  minLng: 139.69, maxLng: 139.74}, // Tokio (Shibuya)
  { minLat: 34.67,  maxLat: 34.71,  minLng: 135.49, maxLng: 135.54}, // Osaka
  { minLat: 35.16,  maxLat: 35.20,  minLng: 136.89, maxLng: 136.94}, // Nagoya
  { minLat: 43.06,  maxLat: 43.09,  minLng: 141.33, maxLng: 141.38}, // Sapporo
  { minLat: 37.54,  maxLat: 37.58,  minLng: 126.97, maxLng: 127.02}, // Seúl
  { minLat: 35.14,  maxLat: 35.17,  minLng: 129.04, maxLng: 129.09}, // Busan
  { minLat: 31.21,  maxLat: 31.25,  minLng: 121.46, maxLng: 121.51}, // Shanghái
  { minLat: 39.90,  maxLat: 39.94,  minLng: 116.38, maxLng: 116.43}, // Pekín
  { minLat: 22.27,  maxLat: 22.32,  minLng: 114.15, maxLng: 114.20}, // Hong Kong
  { minLat: 22.52,  maxLat: 22.56,  minLng: 114.04, maxLng: 114.09}, // Shenzhen
  { minLat: 23.11,  maxLat: 23.15,  minLng: 113.27, maxLng: 113.32}, // Guangzhou
  { minLat: 25.03,  maxLat: 25.07,  minLng: 121.52, maxLng: 121.57}, // Taipéi
  // Asia meridional y sudeste asiático
  { minLat: 1.27,   maxLat: 1.32,   minLng: 103.82, maxLng: 103.87}, // Singapur
  { minLat: 13.73,  maxLat: 13.77,  minLng: 100.49, maxLng: 100.54}, // Bangkok
  { minLat: 3.13,   maxLat: 3.17,   minLng: 101.67, maxLng: 101.72}, // Kuala Lumpur
  { minLat: 14.58,  maxLat: 14.62,  minLng: 120.97, maxLng: 121.02}, // Manila
  { minLat: 10.76,  maxLat: 10.80,  minLng: 106.68, maxLng: 106.73}, // Ho Chi Minh
  { minLat: 21.01,  maxLat: 21.05,  minLng: 105.83, maxLng: 105.88}, // Hanói
  { minLat: 28.60,  maxLat: 28.64,  minLng: 77.19,  maxLng: 77.24 }, // Nueva Delhi
  { minLat: 19.06,  maxLat: 19.10,  minLng: 72.84,  maxLng: 72.89 }, // Bombay
  { minLat: 12.96,  maxLat: 13.00,  minLng: 77.59,  maxLng: 77.64 }, // Bangalore
  { minLat: 22.54,  maxLat: 22.58,  minLng: 88.34,  maxLng: 88.39 }, // Calcuta
  { minLat: 6.89,   maxLat: 6.93,   minLng: 79.85,  maxLng: 79.90 }, // Colombo
  // Oriente Medio
  { minLat: 25.19,  maxLat: 25.23,  minLng: 55.27,  maxLng: 55.32 }, // Dubái
  { minLat: 24.68,  maxLat: 24.72,  minLng: 46.68,  maxLng: 46.73 }, // Riad
  { minLat: 33.32,  maxLat: 33.36,  minLng: 44.38,  maxLng: 44.43 }, // Bagdad
  { minLat: 35.68,  maxLat: 35.72,  minLng: 51.39,  maxLng: 51.44 }, // Teherán
  { minLat: 31.76,  maxLat: 31.80,  minLng: 35.20,  maxLng: 35.25 }, // Jerusalén
  // Oceanía
  { minLat: -33.88, maxLat: -33.84, minLng: 151.19, maxLng: 151.24}, // Sídney
  { minLat: -37.82, maxLat: -37.78, minLng: 144.95, maxLng: 145.00}, // Melbourne
  { minLat: -27.48, maxLat: -27.44, minLng: 153.01, maxLng: 153.06}, // Brisbane
  { minLat: -31.96, maxLat: -31.92, minLng: 115.84, maxLng: 115.89}, // Perth
  { minLat: -36.86, maxLat: -36.82, minLng: 174.75, maxLng: 174.80}, // Auckland
  { minLat: -43.54, maxLat: -43.50, minLng: 172.61, maxLng: 172.66}, // Christchurch
  // África
  { minLat: 30.04,  maxLat: 30.07,  minLng: 31.22,  maxLng: 31.27 }, // El Cairo
  { minLat: 36.77,  maxLat: 36.81,  minLng: 3.03,   maxLng: 3.08  }, // Argel
  { minLat: -33.93, maxLat: -33.89, minLng: 18.41,  maxLng: 18.46 }, // Ciudad del Cabo
  { minLat: -26.22, maxLat: -26.18, minLng: 28.01,  maxLng: 28.06 }, // Johannesburgo
  { minLat: -1.30,  maxLat: -1.26,  minLng: 36.80,  maxLng: 36.85 }, // Nairobi
  { minLat: 9.00,   maxLat: 9.04,   minLng: 38.73,  maxLng: 38.78 }, // Addis Abeba
  { minLat: 6.35,   maxLat: 6.39,   minLng: 2.38,   maxLng: 2.43  }, // Cotonou (Benín)
  { minLat: -4.33,  maxLat: -4.29,  minLng: 15.29,  maxLng: 15.34 }, // Kinshasa
  { minLat: 14.68,  maxLat: 14.72,  minLng: -17.47, maxLng: -17.42}, // Dakar
  { minLat: 33.57,  maxLat: 33.61,  minLng: -7.63,  maxLng: -7.58 }, // Casablanca
  { minLat: -18.93, maxLat: -18.89, minLng: 47.50,  maxLng: 47.55 }, // Antananarivo
];

function randomInBBox(bbox: typeof URBAN_BBOXES[0]): LatLng {
  return {
    lat: bbox.minLat + Math.random() * (bbox.maxLat - bbox.minLat),
    lng: bbox.minLng + Math.random() * (bbox.maxLng - bbox.minLng),
  };
}

function randomGlobal(): LatLng {
  return {
    lat: Math.random() * 140 - 60,
    lng: Math.random() * 360 - 180,
  };
}

function isOutdoorPano(data: google.maps.StreetViewPanoramaData): boolean {
  // Rechazar panoramas sin links de navegación
  if (!data.links || data.links.length === 0) return false;
  // Rechazar si el copyright indica que es de un negocio/interior (contiene ©)
  // Los panoramas de Google Street View official tienen copyright "Google"
  const copy = (data.copyright ?? "").toLowerCase();
  if (copy && !copy.includes("google")) return false;
  return true;
}

function findStreetView(candidate: LatLng, radius: number): Promise<StreetViewLocation | null> {
  return new Promise((resolve) => {
    const svService = new google.maps.StreetViewService();
    svService.getPanorama(
      { location: candidate, radius, source: google.maps.StreetViewSource.OUTDOOR },
      (data, status) => {
        if (
          status === google.maps.StreetViewStatus.OK &&
          data?.location?.latLng &&
          data?.location?.pano &&
          isOutdoorPano(data)
        ) {
          resolve({
            position: { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() },
            panoId: data.location.pano,
          });
        } else {
          resolve(null);
        }
      },
    );
  });
}

async function findUrbanLocation(): Promise<StreetViewLocation> {
  while (true) {
    const bbox = URBAN_BBOXES[Math.floor(Math.random() * URBAN_BBOXES.length)];
    const candidate = randomInBBox(bbox);
    const result = await findStreetView(candidate, 2_000);
    if (result) return result;
  }
}

async function findRandomLocation(): Promise<StreetViewLocation> {
  while (true) {
    const candidate = randomGlobal();
    const result = await findStreetView(candidate, 10_000);
    if (result) return result;
  }
}

// 70% urbano, 30% aleatorio global
function pickOneLocation(): Promise<StreetViewLocation> {
  return Math.random() < 0.7 ? findUrbanLocation() : findRandomLocation();
}

export async function pickRoundLocations(count: number): Promise<StreetViewLocation[]> {
  return Promise.all(Array.from({ length: count }, () => pickOneLocation()));
}
