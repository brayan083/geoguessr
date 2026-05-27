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
  { minLat: -29.87, maxLat: -29.83, minLng: 31.00,  maxLng: 31.05 }, // Durban
  { minLat: 5.34,   maxLat: 5.38,   minLng: -4.02,  maxLng: -3.97 }, // Abiyán
  { minLat: 6.36,   maxLat: 6.40,   minLng: 3.37,   maxLng: 3.42  }, // Lagos
  { minLat: 12.35,  maxLat: 12.39,  minLng: -1.54,  maxLng: -1.50 }, // Uagadugú
  { minLat: 15.55,  maxLat: 15.59,  minLng: 32.52,  maxLng: 32.57 }, // Jartum
  { minLat: -25.97, maxLat: -25.93, minLng: 32.56,  maxLng: 32.61 }, // Maputo
  { minLat: -15.44, maxLat: -15.40, minLng: 28.27,  maxLng: 28.32 }, // Lusaka
  { minLat: -17.84, maxLat: -17.80, minLng: 31.03,  maxLng: 31.08 }, // Harare
  { minLat: 36.81,  maxLat: 36.85,  minLng: 10.17,  maxLng: 10.22 }, // Túnez
  { minLat: 34.01,  maxLat: 34.05,  minLng: -6.87,  maxLng: -6.82 }, // Rabat
  // Europa adicional
  { minLat: 41.38,  maxLat: 41.42,  minLng: 2.15,   maxLng: 2.20  }, // Barcelona
  { minLat: 43.70,  maxLat: 43.74,  minLng: 7.25,   maxLng: 7.30  }, // Niza
  { minLat: 48.57,  maxLat: 48.61,  minLng: 7.73,   maxLng: 7.78  }, // Estrasburgo
  { minLat: 45.74,  maxLat: 45.78,  minLng: 4.82,   maxLng: 4.87  }, // Lyon
  { minLat: 43.60,  maxLat: 43.64,  minLng: 1.43,   maxLng: 1.48  }, // Toulouse
  { minLat: 51.50,  maxLat: 51.54,  minLng: -2.62,  maxLng: -2.57 }, // Bristol
  { minLat: 53.79,  maxLat: 53.83,  minLng: -1.57,  maxLng: -1.52 }, // Leeds
  { minLat: 55.85,  maxLat: 55.89,  minLng: -4.28,  maxLng: -4.23 }, // Glasgow
  { minLat: 53.47,  maxLat: 53.51,  minLng: -2.26,  maxLng: -2.21 }, // Mánchester
  { minLat: 52.47,  maxLat: 52.51,  minLng: 13.41,  maxLng: 13.46 }, // Berlín sur
  { minLat: 51.22,  maxLat: 51.26,  minLng: 6.76,   maxLng: 6.81  }, // Düsseldorf
  { minLat: 50.93,  maxLat: 50.97,  minLng: 6.93,   maxLng: 6.98  }, // Colonia
  { minLat: 53.07,  maxLat: 53.11,  minLng: 8.80,   maxLng: 8.85  }, // Bremen
  { minLat: 48.36,  maxLat: 48.40,  minLng: 10.87,  maxLng: 10.92 }, // Augsburgo
  { minLat: 47.99,  maxLat: 48.03,  minLng: 7.83,   maxLng: 7.88  }, // Friburgo
  { minLat: 46.94,  maxLat: 46.98,  minLng: 7.43,   maxLng: 7.48  }, // Berna
  { minLat: 46.20,  maxLat: 46.24,  minLng: 6.13,   maxLng: 6.18  }, // Ginebra
  { minLat: 45.46,  maxLat: 45.50,  minLng: 9.19,   maxLng: 9.24  }, // Milán centro
  { minLat: 40.84,  maxLat: 40.88,  minLng: 14.24,  maxLng: 14.29 }, // Nápoles
  { minLat: 43.77,  maxLat: 43.81,  minLng: 11.23,  maxLng: 11.28 }, // Florencia
  { minLat: 45.43,  maxLat: 45.47,  minLng: 12.31,  maxLng: 12.36 }, // Venecia
  { minLat: 37.50,  maxLat: 37.54,  minLng: 15.07,  maxLng: 15.12 }, // Catania
  { minLat: 38.11,  maxLat: 38.15,  minLng: 13.34,  maxLng: 13.39 }, // Palermo
  { minLat: 39.22,  maxLat: 39.26,  minLng: -6.41,  maxLng: -6.37 }, // Cáceres
  { minLat: 37.37,  maxLat: 37.41,  minLng: -5.99,  maxLng: -5.94 }, // Sevilla
  { minLat: 37.18,  maxLat: 37.22,  minLng: -3.62,  maxLng: -3.57 }, // Granada
  { minLat: 39.46,  maxLat: 39.50,  minLng: -0.40,  maxLng: -0.35 }, // Valencia
  { minLat: 53.90,  maxLat: 53.94,  minLng: 27.53,  maxLng: 27.58 }, // Minsk
  { minLat: 54.68,  maxLat: 54.72,  minLng: 25.25,  maxLng: 25.30 }, // Vilna
  { minLat: 56.94,  maxLat: 56.98,  minLng: 24.10,  maxLng: 24.15 }, // Riga
  { minLat: 59.43,  maxLat: 59.47,  minLng: 24.72,  maxLng: 24.77 }, // Tallin
  { minLat: 50.44,  maxLat: 50.48,  minLng: 30.50,  maxLng: 30.55 }, // Kiev centro
  { minLat: 49.83,  maxLat: 49.87,  minLng: 24.00,  maxLng: 24.05 }, // Leópolis
  { minLat: 46.47,  maxLat: 46.51,  minLng: 30.71,  maxLng: 30.76 }, // Odesa
  { minLat: 54.34,  maxLat: 54.38,  minLng: 18.63,  maxLng: 18.68 }, // Gdansk
  { minLat: 51.10,  maxLat: 51.14,  minLng: 17.01,  maxLng: 17.06 }, // Breslavia
  { minLat: 50.26,  maxLat: 50.30,  minLng: 19.01,  maxLng: 19.06 }, // Katowice
  { minLat: 50.06,  maxLat: 50.10,  minLng: 19.91,  maxLng: 19.96 }, // Cracovia
  { minLat: 47.08,  maxLat: 47.12,  minLng: 15.41,  maxLng: 15.46 }, // Graz
  { minLat: 47.80,  maxLat: 47.84,  minLng: 13.03,  maxLng: 13.08 }, // Salzburgo
  { minLat: 46.05,  maxLat: 46.09,  minLng: 14.49,  maxLng: 14.54 }, // Liubliana
  { minLat: 45.80,  maxLat: 45.84,  minLng: 15.96,  maxLng: 16.01 }, // Zagreb
  { minLat: 43.51,  maxLat: 43.55,  minLng: 16.43,  maxLng: 16.48 }, // Split
  { minLat: 42.43,  maxLat: 42.47,  minLng: 19.25,  maxLng: 19.30 }, // Podgorica
  { minLat: 41.99,  maxLat: 42.03,  minLng: 21.42,  maxLng: 21.47 }, // Skopie
  { minLat: 41.32,  maxLat: 41.36,  minLng: 19.80,  maxLng: 19.85 }, // Tirana
  // Norteamérica adicional
  { minLat: 36.14,  maxLat: 36.18,  minLng: -86.81, maxLng: -86.76}, // Nashville
  { minLat: 35.14,  maxLat: 35.18,  minLng: -90.07, maxLng: -90.02}, // Memphis
  { minLat: 33.74,  maxLat: 33.78,  minLng: -84.41, maxLng: -84.36}, // Atlanta
  { minLat: 30.30,  maxLat: 30.34,  minLng: -81.67, maxLng: -81.62}, // Jacksonville
  { minLat: 27.94,  maxLat: 27.98,  minLng: -82.50, maxLng: -82.45}, // Tampa
  { minLat: 28.52,  maxLat: 28.56,  minLng: -81.40, maxLng: -81.35}, // Orlando
  { minLat: 35.22,  maxLat: 35.26,  minLng: -80.86, maxLng: -80.81}, // Charlotte
  { minLat: 36.84,  maxLat: 36.88,  minLng: -76.31, maxLng: -76.26}, // Norfolk
  { minLat: 38.88,  maxLat: 38.92,  minLng: -77.04, maxLng: -76.99}, // Washington DC
  { minLat: 39.94,  maxLat: 39.98,  minLng: -75.18, maxLng: -75.13}, // Filadelfia
  { minLat: 43.04,  maxLat: 43.08,  minLng: -76.17, maxLng: -76.12}, // Siracusa NY
  { minLat: 42.88,  maxLat: 42.92,  minLng: -78.88, maxLng: -78.83}, // Búfalo
  { minLat: 44.97,  maxLat: 45.01,  minLng: -93.28, maxLng: -93.23}, // Minneapolis
  { minLat: 41.49,  maxLat: 41.53,  minLng: -81.70, maxLng: -81.65}, // Cleveland
  { minLat: 39.96,  maxLat: 40.00,  minLng: -82.02, maxLng: -81.97}, // Columbus
  { minLat: 38.24,  maxLat: 38.28,  minLng: -85.77, maxLng: -85.72}, // Louisville
  { minLat: 39.10,  maxLat: 39.14,  minLng: -94.60, maxLng: -94.55}, // Kansas City
  { minLat: 38.61,  maxLat: 38.65,  minLng: -90.25, maxLng: -90.20}, // St. Louis
  { minLat: 41.25,  maxLat: 41.29,  minLng: -95.96, maxLng: -95.91}, // Omaha
  { minLat: 35.46,  maxLat: 35.50,  minLng: -97.53, maxLng: -97.48}, // Oklahoma City
  { minLat: 29.42,  maxLat: 29.46,  minLng: -98.51, maxLng: -98.46}, // San Antonio
  { minLat: 30.26,  maxLat: 30.30,  minLng: -97.78, maxLng: -97.73}, // Austin
  { minLat: 32.71,  maxLat: 32.75,  minLng: -117.18,maxLng: -117.13}, // San Diego
  { minLat: 37.33,  maxLat: 37.37,  minLng: -121.90,maxLng: -121.85}, // San José CA
  { minLat: 36.17,  maxLat: 36.21,  minLng: -115.17,maxLng: -115.12}, // Las Vegas
  { minLat: 35.68,  maxLat: 35.72,  minLng: -105.96,maxLng: -105.91}, // Santa Fe
  { minLat: 43.60,  maxLat: 43.64,  minLng: -116.22,maxLng: -116.17}, // Boise
  { minLat: 46.85,  maxLat: 46.89,  minLng: -113.01,maxLng: -112.96}, // Missoula
  { minLat: 61.21,  maxLat: 61.25,  minLng: -149.93,maxLng: -149.88}, // Anchorage
  { minLat: 21.30,  maxLat: 21.34,  minLng: -157.87,maxLng: -157.82}, // Honolulu
  { minLat: 51.03,  maxLat: 51.07,  minLng: -114.09,maxLng: -114.04}, // Calgary
  { minLat: 53.53,  maxLat: 53.57,  minLng: -113.52,maxLng: -113.47}, // Edmonton
  { minLat: 44.64,  maxLat: 44.68,  minLng: -63.61, maxLng: -63.56}, // Halifax
  { minLat: 46.80,  maxLat: 46.84,  minLng: -71.24, maxLng: -71.19}, // Quebec
  { minLat: 19.42,  maxLat: 19.46,  minLng: -99.14, maxLng: -99.09}, // CDMX centro
  { minLat: 20.66,  maxLat: 20.70,  minLng: -103.38,maxLng: -103.33}, // Guadalajara
  { minLat: 17.06,  maxLat: 17.10,  minLng: -96.73, maxLng: -96.68}, // Oaxaca
  { minLat: 15.49,  maxLat: 15.53,  minLng: -88.02, maxLng: -87.97}, // San Pedro Sula
  { minLat: 13.68,  maxLat: 13.72,  minLng: -89.21, maxLng: -89.16}, // San Salvador
  { minLat: 14.09,  maxLat: 14.13,  minLng: -87.22, maxLng: -87.17}, // Tegucigalpa
  { minLat: 12.11,  maxLat: 12.15,  minLng: -86.30, maxLng: -86.25}, // Managua
  { minLat: 9.92,   maxLat: 9.96,   minLng: -84.11, maxLng: -84.06}, // San José CR
  { minLat: 8.99,   maxLat: 9.03,   minLng: -79.54, maxLng: -79.49}, // Ciudad de Panamá
  { minLat: 23.12,  maxLat: 23.16,  minLng: -82.40, maxLng: -82.35}, // La Habana
  { minLat: 18.47,  maxLat: 18.51,  minLng: -69.95, maxLng: -69.90}, // Santo Domingo
  { minLat: 18.54,  maxLat: 18.58,  minLng: -72.36, maxLng: -72.31}, // Puerto Príncipe
  { minLat: 10.48,  maxLat: 10.52,  minLng: -61.42, maxLng: -61.37}, // Puerto España
  // Sudamérica adicional
  { minLat: -34.89, maxLat: -34.85, minLng: -56.21, maxLng: -56.16}, // Montevideo
  { minLat: -25.30, maxLat: -25.26, minLng: -57.67, maxLng: -57.62}, // Asunción
  { minLat: -16.51, maxLat: -16.47, minLng: -68.17, maxLng: -68.12}, // La Paz
  { minLat: -17.79, maxLat: -17.75, minLng: -63.20, maxLng: -63.15}, // Santa Cruz Bo
  { minLat: -0.24,  maxLat: -0.20,  minLng: -78.52, maxLng: -78.47}, // Quito centro
  { minLat: -2.19,  maxLat: -2.15,  minLng: -79.92, maxLng: -79.87}, // Guayaquil
  { minLat: -8.06,  maxLat: -8.02,  minLng: -34.92, maxLng: -34.87}, // Recife
  { minLat: -3.73,  maxLat: -3.69,  minLng: -38.54, maxLng: -38.49}, // Fortaleza
  { minLat: -12.98, maxLat: -12.94, minLng: -38.50, maxLng: -38.45}, // Salvador
  { minLat: -19.92, maxLat: -19.88, minLng: -43.96, maxLng: -43.91}, // Belo Horizonte
  { minLat: -15.79, maxLat: -15.75, minLng: -47.92, maxLng: -47.87}, // Brasilia
  { minLat: -1.46,  maxLat: -1.42,  minLng: -48.51, maxLng: -48.46}, // Belém
  { minLat: -3.11,  maxLat: -3.07,  minLng: -60.03, maxLng: -59.98}, // Manaos
  { minLat: -31.33, maxLat: -31.29, minLng: -64.19, maxLng: -64.14}, // Córdoba AR
  { minLat: -32.89, maxLat: -32.85, minLng: -68.86, maxLng: -68.81}, // Mendoza
  { minLat: -38.70, maxLat: -38.66, minLng: -62.28, maxLng: -62.23}, // Bahía Blanca
  { minLat: -53.15, maxLat: -53.11, minLng: -70.93, maxLng: -70.88}, // Punta Arenas
  { minLat: -36.82, maxLat: -36.78, minLng: -73.07, maxLng: -73.02}, // Concepción CL
  // Asia adicional
  { minLat: 24.85,  maxLat: 24.89,  minLng: 67.00,  maxLng: 67.05 }, // Karachi
  { minLat: 31.54,  maxLat: 31.58,  minLng: 74.30,  maxLng: 74.35 }, // Lahore
  { minLat: 33.68,  maxLat: 33.72,  minLng: 73.04,  maxLng: 73.09 }, // Islamabad
  { minLat: 23.71,  maxLat: 23.75,  minLng: 90.38,  maxLng: 90.43 }, // Daca
  { minLat: 27.69,  maxLat: 27.73,  minLng: 85.30,  maxLng: 85.35 }, // Katmandú
  { minLat: 6.88,   maxLat: 6.92,   minLng: 79.85,  maxLng: 79.90 }, // Colombo
  { minLat: 16.86,  maxLat: 16.90,  minLng: 96.15,  maxLng: 96.20 }, // Rangún
  { minLat: 11.55,  maxLat: 11.59,  minLng: 104.90, maxLng: 104.95}, // Phnom Penh
  { minLat: 17.96,  maxLat: 18.00,  minLng: 102.60, maxLng: 102.65}, // Vientián
  { minLat: 4.33,   maxLat: 4.37,   minLng: 113.98, maxLng: 114.03}, // Bandar Seri Begawan
  { minLat: -8.56,  maxLat: -8.52,  minLng: 115.21, maxLng: 115.26}, // Denpasar (Bali)
  { minLat: -6.21,  maxLat: -6.17,  minLng: 106.82, maxLng: 106.87}, // Yakarta
  { minLat: -7.80,  maxLat: -7.76,  minLng: 110.36, maxLng: 110.41}, // Yogyakarta
  { minLat: -7.25,  maxLat: -7.21,  minLng: 112.73, maxLng: 112.78}, // Surabaya
  { minLat: -0.91,  maxLat: -0.87,  minLng: 100.35, maxLng: 100.40}, // Padang
  { minLat: 3.58,   maxLat: 3.62,   minLng: 98.65,  maxLng: 98.70 }, // Medan
  { minLat: 35.17,  maxLat: 35.21,  minLng: 33.35,  maxLng: 33.40 }, // Nicosia
  { minLat: 33.88,  maxLat: 33.92,  minLng: 35.49,  maxLng: 35.54 }, // Beirut
  { minLat: 33.50,  maxLat: 33.54,  minLng: 36.27,  maxLng: 36.32 }, // Damasco
  { minLat: 32.05,  maxLat: 32.09,  minLng: 34.77,  maxLng: 34.82 }, // Tel Aviv
  { minLat: 29.37,  maxLat: 29.41,  minLng: 47.97,  maxLng: 48.02 }, // Kuwait
  { minLat: 26.21,  maxLat: 26.25,  minLng: 50.58,  maxLng: 50.63 }, // Manama
  { minLat: 23.58,  maxLat: 23.62,  minLng: 58.38,  maxLng: 58.43 }, // Mascate
  { minLat: 15.34,  maxLat: 15.38,  minLng: 44.19,  maxLng: 44.24 }, // Saná
  { minLat: 12.36,  maxLat: 12.40,  minLng: 43.14,  maxLng: 43.19 }, // Yibuti
  { minLat: 36.26,  maxLat: 36.30,  minLng: 59.58,  maxLng: 59.63 }, // Mashhad
  { minLat: 32.65,  maxLat: 32.69,  minLng: 51.66,  maxLng: 51.71 }, // Isfahán
  { minLat: 29.59,  maxLat: 29.63,  minLng: 52.52,  maxLng: 52.57 }, // Shiraz
  { minLat: 36.55,  maxLat: 36.59,  minLng: 36.17,  maxLng: 36.22 }, // Gaziantep
  { minLat: 39.91,  maxLat: 39.95,  minLng: 32.84,  maxLng: 32.89 }, // Ankara
  { minLat: 38.41,  maxLat: 38.45,  minLng: 27.12,  maxLng: 27.17 }, // Esmirna
  { minLat: 40.18,  maxLat: 40.22,  minLng: 44.49,  maxLng: 44.54 }, // Ereván
  { minLat: 40.40,  maxLat: 40.44,  minLng: 49.83,  maxLng: 49.88 }, // Bakú
  { minLat: 41.68,  maxLat: 41.72,  minLng: 44.79,  maxLng: 44.84 }, // Tiflis
  { minLat: 41.29,  maxLat: 41.33,  minLng: 69.24,  maxLng: 69.29 }, // Taskent
  { minLat: 43.24,  maxLat: 43.28,  minLng: 76.89,  maxLng: 76.94 }, // Almaty
  { minLat: 47.89,  maxLat: 47.93,  minLng: 106.89, maxLng: 106.94}, // Ulán Bator
  { minLat: 30.65,  maxLat: 30.69,  minLng: 104.06, maxLng: 104.11}, // Chengdu
  { minLat: 36.06,  maxLat: 36.10,  minLng: 103.79, maxLng: 103.84}, // Lanzhou
  { minLat: 34.25,  maxLat: 34.29,  minLng: 108.94, maxLng: 108.99}, // Xi'an
  { minLat: 32.04,  maxLat: 32.08,  minLng: 118.76, maxLng: 118.81}, // Nanjing
  { minLat: 30.56,  maxLat: 30.60,  minLng: 114.28, maxLng: 114.33}, // Wuhan
  { minLat: 26.07,  maxLat: 26.11,  minLng: 119.29, maxLng: 119.34}, // Fuzhou
  { minLat: 24.47,  maxLat: 24.51,  minLng: 118.07, maxLng: 118.12}, // Xiamen
  { minLat: 36.67,  maxLat: 36.71,  minLng: 117.01, maxLng: 117.06}, // Jinan
  { minLat: 36.07,  maxLat: 36.11,  minLng: 120.35, maxLng: 120.40}, // Qingdao
  { minLat: 45.75,  maxLat: 45.79,  minLng: 126.63, maxLng: 126.68}, // Harbin
  { minLat: 41.80,  maxLat: 41.84,  minLng: 123.42, maxLng: 123.47}, // Shenyang
  { minLat: 29.55,  maxLat: 29.59,  minLng: 106.52, maxLng: 106.57}, // Chongqing
  { minLat: 28.19,  maxLat: 28.23,  minLng: 112.97, maxLng: 113.02}, // Changsha
  // Oceanía adicional
  { minLat: -34.92, maxLat: -34.88, minLng: 138.58, maxLng: 138.63}, // Adelaida
  { minLat: -42.88, maxLat: -42.84, minLng: 147.30, maxLng: 147.35}, // Hobart
  { minLat: -12.46, maxLat: -12.42, minLng: 130.83, maxLng: 130.88}, // Darwin
  { minLat: -35.31, maxLat: -35.27, minLng: 149.12, maxLng: 149.17}, // Canberra
  { minLat: -41.29, maxLat: -41.25, minLng: 174.77, maxLng: 174.82}, // Wellington
  { minLat: -17.73, maxLat: -17.69, minLng: 168.30, maxLng: 168.35}, // Port Vila
  { minLat: -9.43,  maxLat: -9.39,  minLng: 160.03, maxLng: 160.08}, // Honiara
  { minLat: -18.14, maxLat: -18.10, minLng: 178.41, maxLng: 178.46}, // Suva
  // Europa extra
  { minLat: 55.75,  maxLat: 55.79,  minLng: 37.57,  maxLng: 37.62  }, // Moscú centro
  { minLat: 56.82,  maxLat: 56.86,  minLng: 60.58,  maxLng: 60.63  }, // Ekaterimburgo
  { minLat: 55.00,  maxLat: 55.04,  minLng: 82.91,  maxLng: 82.96  }, // Novosibirsk
  { minLat: 56.48,  maxLat: 56.52,  minLng: 84.95,  maxLng: 85.00  }, // Tomsk
  { minLat: 53.19,  maxLat: 53.23,  minLng: 50.14,  maxLng: 50.19  }, // Samara
  { minLat: 51.53,  maxLat: 51.57,  minLng: 46.00,  maxLng: 46.05  }, // Saratov
  { minLat: 56.30,  maxLat: 56.34,  minLng: 43.98,  maxLng: 44.03  }, // Nizhny Nóvgorod
  { minLat: 54.18,  maxLat: 54.22,  minLng: 37.59,  maxLng: 37.64  }, // Tula
  { minLat: 57.61,  maxLat: 57.65,  minLng: 39.85,  maxLng: 39.90  }, // Yaroslavl
  { minLat: 54.72,  maxLat: 54.76,  minLng: 55.92,  maxLng: 55.97  }, // Ufá
  { minLat: 55.78,  maxLat: 55.82,  minLng: 49.09,  maxLng: 49.14  }, // Kazán
  { minLat: 43.84,  maxLat: 43.88,  minLng: 18.36,  maxLng: 18.41  }, // Sarajevo
  { minLat: 47.79,  maxLat: 47.83,  minLng: 13.03,  maxLng: 13.08  }, // Salzburgo
  { minLat: 48.29,  maxLat: 48.33,  minLng: 14.27,  maxLng: 14.32  }, // Linz
  { minLat: 51.34,  maxLat: 51.38,  minLng: 12.36,  maxLng: 12.41  }, // Leipzig
  { minLat: 51.04,  maxLat: 51.08,  minLng: 13.70,  maxLng: 13.75  }, // Dresde
  { minLat: 49.44,  maxLat: 49.48,  minLng: 11.07,  maxLng: 11.12  }, // Núremberg
  { minLat: 49.00,  maxLat: 49.04,  minLng: 8.38,   maxLng: 8.43   }, // Karlsruhe
  { minLat: 48.77,  maxLat: 48.81,  minLng: 9.17,   maxLng: 9.22   }, // Stuttgart
  { minLat: 47.55,  maxLat: 47.59,  minLng: 7.58,   maxLng: 7.63   }, // Basilea
  { minLat: 46.51,  maxLat: 46.55,  minLng: 6.61,   maxLng: 6.66   }, // Lausana
  { minLat: 45.18,  maxLat: 45.22,  minLng: 5.71,   maxLng: 5.76   }, // Grenoble
  { minLat: 47.21,  maxLat: 47.25,  minLng: -1.58,  maxLng: -1.53  }, // Nantes
  { minLat: 44.83,  maxLat: 44.87,  minLng: -0.60,  maxLng: -0.55  }, // Burdeos
  { minLat: 48.10,  maxLat: 48.14,  minLng: -1.71,  maxLng: -1.66  }, // Rennes
  { minLat: 50.61,  maxLat: 50.65,  minLng: 3.04,   maxLng: 3.09   }, // Lille
  { minLat: 43.12,  maxLat: 43.16,  minLng: 5.91,   maxLng: 5.96   }, // Toulon
  { minLat: 43.94,  maxLat: 43.98,  minLng: 4.80,   maxLng: 4.85   }, // Aviñón
  { minLat: 38.24,  maxLat: 38.28,  minLng: 21.72,  maxLng: 21.77  }, // Patras
  { minLat: 40.62,  maxLat: 40.66,  minLng: 22.93,  maxLng: 22.98  }, // Tesalónica
  { minLat: 35.51,  maxLat: 35.55,  minLng: 24.01,  maxLng: 24.06  }, // Heraclión
  { minLat: 37.97,  maxLat: 38.01,  minLng: 23.71,  maxLng: 23.76  }, // Atenas centro
  { minLat: 39.36,  maxLat: 39.40,  minLng: -8.98,  maxLng: -8.93  }, // Santarém PT
  { minLat: 41.14,  maxLat: 41.18,  minLng: -8.64,  maxLng: -8.59  }, // Oporto
  { minLat: 37.00,  maxLat: 37.04,  minLng: -7.94,  maxLng: -7.89  }, // Faro
  { minLat: 36.71,  maxLat: 36.75,  minLng: -4.44,  maxLng: -4.39  }, // Málaga
  { minLat: 38.34,  maxLat: 38.38,  minLng: -0.51,  maxLng: -0.46  }, // Alicante
  { minLat: 41.64,  maxLat: 41.68,  minLng: -0.90,  maxLng: -0.85  }, // Zaragoza
  { minLat: 43.26,  maxLat: 43.30,  minLng: -2.96,  maxLng: -2.91  }, // Bilbao
  { minLat: 43.31,  maxLat: 43.35,  minLng: -1.98,  maxLng: -1.93  }, // San Sebastián
  { minLat: 43.36,  maxLat: 43.40,  minLng: -5.87,  maxLng: -5.82  }, // Oviedo
  { minLat: 42.87,  maxLat: 42.91,  minLng: -8.55,  maxLng: -8.50  }, // Santiago de Compostela
  { minLat: 53.95,  maxLat: 53.99,  minLng: -1.10,  maxLng: -1.05  }, // York
  { minLat: 52.19,  maxLat: 52.23,  minLng: 0.11,   maxLng: 0.16   }, // Cambridge
  { minLat: 51.74,  maxLat: 51.78,  minLng: -1.27,  maxLng: -1.22  }, // Oxford
  { minLat: 50.81,  maxLat: 50.85,  minLng: -0.16,  maxLng: -0.11  }, // Brighton
  { minLat: 57.14,  maxLat: 57.18,  minLng: -2.13,  maxLng: -2.08  }, // Aberdeen
  { minLat: 56.46,  maxLat: 56.50,  minLng: -3.00,  maxLng: -2.95  }, // Dundee
  { minLat: 54.59,  maxLat: 54.63,  minLng: -5.95,  maxLng: -5.90  }, // Belfast
  { minLat: 53.33,  maxLat: 53.37,  minLng: -6.28,  maxLng: -6.23  }, // Dublín norte
  { minLat: 54.97,  maxLat: 55.01,  minLng: -7.32,  maxLng: -7.27  }, // Derry
  { minLat: 60.39,  maxLat: 60.43,  minLng: 5.31,   maxLng: 5.36   }, // Bergen
  { minLat: 63.42,  maxLat: 63.46,  minLng: 10.38,  maxLng: 10.43  }, // Trondheim
  { minLat: 58.96,  maxLat: 59.00,  minLng: 5.71,   maxLng: 5.76   }, // Stavanger
  { minLat: 57.70,  maxLat: 57.74,  minLng: 11.95,  maxLng: 12.00  }, // Gotemburgo
  { minLat: 55.59,  maxLat: 55.63,  minLng: 13.00,  maxLng: 13.05  }, // Malmö
  { minLat: 63.82,  maxLat: 63.86,  minLng: 20.25,  maxLng: 20.30  }, // Umeå
  { minLat: 65.01,  maxLat: 65.05,  minLng: 25.46,  maxLng: 25.51  }, // Oulu
  { minLat: 61.49,  maxLat: 61.53,  minLng: 23.74,  maxLng: 23.79  }, // Tampere
  { minLat: 60.44,  maxLat: 60.48,  minLng: 22.25,  maxLng: 22.30  }, // Turku
  { minLat: 64.13,  maxLat: 64.17,  minLng: -21.95, maxLng: -21.90 }, // Reikiavik
  // Norteamérica extra
  { minLat: 35.77,  maxLat: 35.81,  minLng: -78.68, maxLng: -78.63 }, // Raleigh
  { minLat: 32.77,  maxLat: 32.81,  minLng: -79.97, maxLng: -79.92 }, // Charleston SC
  { minLat: 31.30,  maxLat: 31.34,  minLng: -89.33, maxLng: -89.28 }, // Hattiesburg
  { minLat: 30.68,  maxLat: 30.72,  minLng: -88.08, maxLng: -88.03 }, // Mobile AL
  { minLat: 33.52,  maxLat: 33.56,  minLng: -86.83, maxLng: -86.78 }, // Birmingham AL
  { minLat: 35.99,  maxLat: 36.03,  minLng: -86.55, maxLng: -86.50 }, // Murfreesboro
  { minLat: 37.68,  maxLat: 37.72,  minLng: -97.36, maxLng: -97.31 }, // Wichita
  { minLat: 41.66,  maxLat: 41.70,  minLng: -83.57, maxLng: -83.52 }, // Toledo OH
  { minLat: 42.72,  maxLat: 42.76,  minLng: -84.56, maxLng: -84.51 }, // Lansing
  { minLat: 42.32,  maxLat: 42.36,  minLng: -83.07, maxLng: -83.02 }, // Detroit
  { minLat: 43.04,  maxLat: 43.08,  minLng: -87.94, maxLng: -87.89 }, // Milwaukee
  { minLat: 44.51,  maxLat: 44.55,  minLng: -88.04, maxLng: -87.99 }, // Green Bay
  { minLat: 46.78,  maxLat: 46.82,  minLng: -92.11, maxLng: -92.06 }, // Duluth
  { minLat: 40.76,  maxLat: 40.80,  minLng: -111.90,maxLng: -111.85}, // Salt Lake City
  { minLat: 43.61,  maxLat: 43.65,  minLng: -116.22,maxLng: -116.17}, // Boise
  { minLat: 47.04,  maxLat: 47.08,  minLng: -122.90,maxLng: -122.85}, // Tacoma
  { minLat: 48.75,  maxLat: 48.79,  minLng: -122.49,maxLng: -122.44}, // Bellingham
  { minLat: 44.05,  maxLat: 44.09,  minLng: -123.10,maxLng: -123.05}, // Eugene
  { minLat: 45.52,  maxLat: 45.56,  minLng: -122.68,maxLng: -122.63}, // Portland OR
  { minLat: 37.87,  maxLat: 37.91,  minLng: -122.27,maxLng: -122.22}, // Oakland
  { minLat: 37.54,  maxLat: 37.58,  minLng: -122.06,maxLng: -122.01}, // Fremont
  { minLat: 34.41,  maxLat: 34.45,  minLng: -119.70,maxLng: -119.65}, // Santa Bárbara
  { minLat: 35.28,  maxLat: 35.32,  minLng: -120.67,maxLng: -120.62}, // San Luis Obispo
  { minLat: 36.74,  maxLat: 36.78,  minLng: -119.80,maxLng: -119.75}, // Fresno
  { minLat: 38.57,  maxLat: 38.61,  minLng: -121.50,maxLng: -121.45}, // Sacramento
  { minLat: 33.99,  maxLat: 34.03,  minLng: -117.92,maxLng: -117.87}, // Pomona
  { minLat: 33.66,  maxLat: 33.70,  minLng: -117.84,maxLng: -117.79}, // Santa Ana
  { minLat: 32.52,  maxLat: 32.56,  minLng: -117.03,maxLng: -116.98}, // Tijuana MX
  { minLat: 23.22,  maxLat: 23.26,  minLng: -106.44,maxLng: -106.39}, // Mazatlán
  { minLat: 16.85,  maxLat: 16.89,  minLng: -99.89, maxLng: -99.84 }, // Acapulco
  { minLat: 21.13,  maxLat: 21.17,  minLng: -86.85, maxLng: -86.80 }, // Cancún
  { minLat: 19.81,  maxLat: 19.85,  minLng: -90.53, maxLng: -90.48 }, // Campeche
  { minLat: 14.06,  maxLat: 14.10,  minLng: -90.56, maxLng: -90.51 }, // Ciudad de Guatemala
  { minLat: 9.93,   maxLat: 9.97,   minLng: -84.09, maxLng: -84.04 }, // Heredia CR
  { minLat: -0.23,  maxLat: -0.19,  minLng: -78.51, maxLng: -78.46 }, // Quito sur
  { minLat: 10.06,  maxLat: 10.10,  minLng: -69.34, maxLng: -69.29 }, // Barquisimeto
  { minLat: 8.59,   maxLat: 8.63,   minLng: -71.14, maxLng: -71.09 }, // Mérida VE
  { minLat: 5.76,   maxLat: 5.80,   minLng: -76.66, maxLng: -76.61 }, // Quibdó
  { minLat: 3.85,   maxLat: 3.89,   minLng: -77.08, maxLng: -77.03 }, // Buenaventura
  { minLat: 6.22,   maxLat: 6.26,   minLng: -75.58, maxLng: -75.53 }, // Medellín
  { minLat: 3.43,   maxLat: 3.47,   minLng: -76.54, maxLng: -76.49 }, // Cali
  { minLat: 11.00,  maxLat: 11.04,  minLng: -74.80, maxLng: -74.75 }, // Barranquilla
  { minLat: -0.98,  maxLat: -0.94,  minLng: -80.72, maxLng: -80.67 }, // Manta EC
  { minLat: -8.11,  maxLat: -8.07,  minLng: -79.03, maxLng: -78.98 }, // Trujillo PE
  { minLat: -6.77,  maxLat: -6.73,  minLng: -79.85, maxLng: -79.80 }, // Chiclayo
  { minLat: -13.53, maxLat: -13.49, minLng: -71.98, maxLng: -71.93 }, // Cusco
  { minLat: -18.01, maxLat: -17.97, minLng: -70.26, maxLng: -70.21 }, // Tacna
  { minLat: -17.39, maxLat: -17.35, minLng: -66.16, maxLng: -66.11 }, // Cochabamba
  { minLat: -27.45, maxLat: -27.41, minLng: -58.99, maxLng: -58.94 }, // Resistencia AR
  { minLat: -24.18, maxLat: -24.14, minLng: -65.29, maxLng: -65.24 }, // Jujuy AR
  { minLat: -26.83, maxLat: -26.79, minLng: -65.22, maxLng: -65.17 }, // Tucumán AR
  { minLat: -33.00, maxLat: -32.96, minLng: -71.55, maxLng: -71.50 }, // Valparaíso CL
  { minLat: -29.90, maxLat: -29.86, minLng: -71.25, maxLng: -71.20 }, // La Serena CL
  { minLat: -23.44, maxLat: -23.40, minLng: -70.63, maxLng: -70.58 }, // Antofagasta CL
  { minLat: -18.48, maxLat: -18.44, minLng: -70.31, maxLng: -70.26 }, // Arica CL
  { minLat: -2.63,  maxLat: -2.59,  minLng: -44.30, maxLng: -44.25 }, // São Luís BR
  { minLat: -10.91, maxLat: -10.87, minLng: -37.06, maxLng: -37.01 }, // Aracaju BR
  { minLat: -20.32, maxLat: -20.28, minLng: -40.34, maxLng: -40.29 }, // Vitória BR
  { minLat: -22.90, maxLat: -22.86, minLng: -43.19, maxLng: -43.14 }, // Río centro
  { minLat: -21.75, maxLat: -21.71, minLng: -43.36, maxLng: -43.31 }, // Juiz de Fora BR
  { minLat: -25.43, maxLat: -25.39, minLng: -49.29, maxLng: -49.24 }, // Curitiba BR
  { minLat: -27.60, maxLat: -27.56, minLng: -48.56, maxLng: -48.51 }, // Florianópolis BR
  { minLat: -23.55, maxLat: -23.51, minLng: -46.64, maxLng: -46.59 }, // São Paulo centro
  { minLat: -22.26, maxLat: -22.22, minLng: -42.52, maxLng: -42.47 }, // Petrópolis BR
  // Asia extra
  { minLat: 24.46,  maxLat: 24.50,  minLng: 54.35,  maxLng: 54.40  }, // Abu Dabi
  { minLat: 26.27,  maxLat: 26.31,  minLng: 50.19,  maxLng: 50.24  }, // Muharraq BH
  { minLat: 24.09,  maxLat: 24.13,  minLng: 32.90,  maxLng: 32.95  }, // Asuán EG
  { minLat: 31.20,  maxLat: 31.24,  minLng: 29.90,  maxLng: 29.95  }, // Alejandría EG
  { minLat: 30.06,  maxLat: 30.10,  minLng: 31.23,  maxLng: 31.28  }, // El Cairo sur
  { minLat: 21.38,  maxLat: 21.42,  minLng: 39.82,  maxLng: 39.87  }, // Yeda
  { minLat: 17.33,  maxLat: 17.37,  minLng: 43.12,  maxLng: 43.17  }, // Abha SA
  { minLat: 24.47,  maxLat: 24.51,  minLng: 39.60,  maxLng: 39.65  }, // Medina
  { minLat: 21.42,  maxLat: 21.46,  minLng: 55.82,  maxLng: 55.87  }, // Salalah OM
  { minLat: 25.28,  maxLat: 25.32,  minLng: 51.51,  maxLng: 51.56  }, // Doha
  { minLat: 36.19,  maxLat: 36.23,  minLng: 37.15,  maxLng: 37.20  }, // Alepo SY
  { minLat: 36.72,  maxLat: 36.76,  minLng: 3.04,   maxLng: 3.09   }, // Argel centro
  { minLat: 36.36,  maxLat: 36.40,  minLng: 6.61,   maxLng: 6.66   }, // Constantina DZ
  { minLat: 35.66,  maxLat: 35.70,  minLng: 10.82,  maxLng: 10.87  }, // Susa TN
  { minLat: 32.08,  maxLat: 32.12,  minLng: 20.06,  maxLng: 20.11  }, // Bengasi LY
  { minLat: 32.89,  maxLat: 32.93,  minLng: 13.17,  maxLng: 13.22  }, // Trípoli LY
  { minLat: 30.05,  maxLat: 30.09,  minLng: 31.24,  maxLng: 31.29  }, // Cairo norte
  { minLat: 31.63,  maxLat: 31.67,  minLng: 74.87,  maxLng: 74.92  }, // Amritsar IN
  { minLat: 26.91,  maxLat: 26.95,  minLng: 75.78,  maxLng: 75.83  }, // Jaipur IN
  { minLat: 23.01,  maxLat: 23.05,  minLng: 72.57,  maxLng: 72.62  }, // Ahmedabad IN
  { minLat: 21.18,  maxLat: 21.22,  minLng: 72.83,  maxLng: 72.88  }, // Surat IN
  { minLat: 18.51,  maxLat: 18.55,  minLng: 73.85,  maxLng: 73.90  }, // Pune IN
  { minLat: 17.37,  maxLat: 17.41,  minLng: 78.46,  maxLng: 78.51  }, // Hyderabad IN
  { minLat: 13.07,  maxLat: 13.11,  minLng: 80.25,  maxLng: 80.30  }, // Chennai IN
  { minLat: 10.83,  maxLat: 10.87,  minLng: 76.95,  maxLng: 77.00  }, // Coimbatore IN
  { minLat: 8.49,   maxLat: 8.53,   minLng: 76.95,  maxLng: 77.00  }, // Thiruvanantapuram IN
  { minLat: 25.59,  maxLat: 25.63,  minLng: 85.13,  maxLng: 85.18  }, // Patna IN
  { minLat: 25.44,  maxLat: 25.48,  minLng: 81.83,  maxLng: 81.88  }, // Allahabad IN
  { minLat: 26.84,  maxLat: 26.88,  minLng: 80.90,  maxLng: 80.95  }, // Lucknow IN
  { minLat: 27.17,  maxLat: 27.21,  minLng: 78.00,  maxLng: 78.05  }, // Agra IN
  { minLat: 22.81,  maxLat: 22.85,  minLng: 86.18,  maxLng: 86.23  }, // Jamshedpur IN
  { minLat: 20.28,  maxLat: 20.32,  minLng: 85.82,  maxLng: 85.87  }, // Bhubaneswar IN
  { minLat: 26.10,  maxLat: 26.14,  minLng: 91.72,  maxLng: 91.77  }, // Guwahati IN
  { minLat: 11.01,  maxLat: 11.05,  minLng: 76.96,  maxLng: 77.01  }, // Tiruchirappalli IN
  { minLat: 31.87,  maxLat: 31.91,  minLng: 117.23, maxLng: 117.28 }, // Hefei CN
  { minLat: 28.68,  maxLat: 28.72,  minLng: 115.87, maxLng: 115.92 }, // Nanchang CN
  { minLat: 43.79,  maxLat: 43.83,  minLng: 87.58,  maxLng: 87.63  }, // Ürümqi CN
  { minLat: 25.05,  maxLat: 25.09,  minLng: 102.70, maxLng: 102.75 }, // Kunming CN
  { minLat: 22.82,  maxLat: 22.86,  minLng: 108.32, maxLng: 108.37 }, // Nanning CN
  { minLat: 34.73,  maxLat: 34.77,  minLng: 113.64, maxLng: 113.69 }, // Zhengzhou CN
  { minLat: 38.04,  maxLat: 38.08,  minLng: 114.49, maxLng: 114.54 }, // Shijiazhuang CN
  { minLat: 39.12,  maxLat: 39.16,  minLng: 117.17, maxLng: 117.22 }, // Tianjin CN
  { minLat: 37.86,  maxLat: 37.90,  minLng: 112.54, maxLng: 112.59 }, // Taiyuan CN
  { minLat: 35.48,  maxLat: 35.52,  minLng: 139.42, maxLng: 139.47 }, // Yokohama JP
  { minLat: 34.68,  maxLat: 34.72,  minLng: 135.81, maxLng: 135.86 }, // Kobe JP
  { minLat: 35.01,  maxLat: 35.05,  minLng: 135.75, maxLng: 135.80 }, // Kioto JP
  { minLat: 33.58,  maxLat: 33.62,  minLng: 130.39, maxLng: 130.44 }, // Fukuoka JP
  { minLat: 34.39,  maxLat: 34.43,  minLng: 132.45, maxLng: 132.50 }, // Hiroshima JP
  { minLat: 36.57,  maxLat: 36.61,  minLng: 136.63, maxLng: 136.68 }, // Kanazawa JP
  { minLat: 38.26,  maxLat: 38.30,  minLng: 140.86, maxLng: 140.91 }, // Sendai JP
  { minLat: 26.21,  maxLat: 26.25,  minLng: 127.67, maxLng: 127.72 }, // Naha JP (Okinawa)
  { minLat: 37.44,  maxLat: 37.48,  minLng: 126.89, maxLng: 126.94 }, // Incheon KR
  { minLat: 35.86,  maxLat: 35.90,  minLng: 128.59, maxLng: 128.64 }, // Daegu KR
  { minLat: 35.94,  maxLat: 35.98,  minLng: 126.71, maxLng: 126.76 }, // Jeonju KR
  { minLat: 36.35,  maxLat: 36.39,  minLng: 127.38, maxLng: 127.43 }, // Daejeon KR
  { minLat: 37.26,  maxLat: 37.30,  minLng: 127.02, maxLng: 127.07 }, // Suwon KR
  { minLat: 24.99,  maxLat: 25.03,  minLng: 121.30, maxLng: 121.35 }, // Taoyuan TW
  { minLat: 22.62,  maxLat: 22.66,  minLng: 120.29, maxLng: 120.34 }, // Kaohsiung TW
  { minLat: 10.81,  maxLat: 10.85,  minLng: 106.62, maxLng: 106.67 }, // Bien Hoa VN
  { minLat: 16.06,  maxLat: 16.10,  minLng: 108.20, maxLng: 108.25 }, // Da Nang VN
  { minLat: 20.84,  maxLat: 20.88,  minLng: 106.68, maxLng: 106.73 }, // Hai Phong VN
  { minLat: 18.35,  maxLat: 18.39,  minLng: 103.98, maxLng: 104.03 }, // Thakhek LA
  { minLat: 15.12,  maxLat: 15.16,  minLng: 104.84, maxLng: 104.89 }, // Ubon Ratchathani TH
  { minLat: 18.78,  maxLat: 18.82,  minLng: 98.99,  maxLng: 99.04  }, // Chiang Mai TH
  { minLat: 7.88,   maxLat: 7.92,   minLng: 98.37,  maxLng: 98.42  }, // Phuket TH
  { minLat: 5.41,   maxLat: 5.45,   minLng: 100.31, maxLng: 100.36 }, // George Town MY
  { minLat: 1.49,   maxLat: 1.53,   minLng: 110.33, maxLng: 110.38 }, // Kuching MY
  { minLat: 5.98,   maxLat: 6.02,   minLng: 116.07, maxLng: 116.12 }, // Kota Kinabalu MY
  { minLat: 14.10,  maxLat: 14.14,  minLng: 121.21, maxLng: 121.26 }, // Santa Rosa PH
  { minLat: 7.07,   maxLat: 7.11,   minLng: 125.61, maxLng: 125.66 }, // Davao PH
  { minLat: 10.30,  maxLat: 10.34,  minLng: 123.89, maxLng: 123.94 }, // Cebú PH
  { minLat: -6.91,  maxLat: -6.87,  minLng: 107.61, maxLng: 107.66 }, // Bandung ID
  { minLat: -3.32,  maxLat: -3.28,  minLng: 114.57, maxLng: 114.62 }, // Banjarmasin ID
  { minLat: -5.14,  maxLat: -5.10,  minLng: 119.42, maxLng: 119.47 }, // Makassar ID
  { minLat: -8.55,  maxLat: -8.51,  minLng: 122.21, maxLng: 122.26 }, // Maumere ID
  { minLat: 0.92,   maxLat: 0.96,   minLng: 127.37, maxLng: 127.42 }, // Ternate ID
  { minLat: 37.55,  maxLat: 37.59,  minLng: 55.79,  maxLng: 55.84  }, // Ashgabat TM
  { minLat: 38.55,  maxLat: 38.59,  minLng: 68.76,  maxLng: 68.81  }, // Dushanbe TJ
  { minLat: 42.87,  maxLat: 42.91,  minLng: 74.57,  maxLng: 74.62  }, // Biskek KG
  { minLat: 39.65,  maxLat: 39.69,  minLng: 66.94,  maxLng: 66.99  }, // Samarcanda UZ
  { minLat: 40.11,  maxLat: 40.15,  minLng: 44.51,  maxLng: 44.56  }, // Vanadzor AM
  // África extra
  { minLat: 12.37,  maxLat: 12.41,  minLng: -1.54,  maxLng: -1.49  }, // Uagadugú sur
  { minLat: 5.54,   maxLat: 5.58,   minLng: -0.23,  maxLng: -0.18  }, // Acra GH
  { minLat: 6.91,   maxLat: 6.95,   minLng: -1.63,  maxLng: -1.58  }, // Kumasi GH
  { minLat: 9.54,   maxLat: 9.58,   minLng: -13.67, maxLng: -13.62 }, // Conakri GN
  { minLat: 11.86,  maxLat: 11.90,  minLng: -15.60, maxLng: -15.55 }, // Bissau GW
  { minLat: 13.45,  maxLat: 13.49,  minLng: -16.59, maxLng: -16.54 }, // Banjul GM
  { minLat: 8.48,   maxLat: 8.52,   minLng: -13.24, maxLng: -13.19 }, // Freetown SL
  { minLat: 6.29,   maxLat: 6.33,   minLng: -10.80, maxLng: -10.75 }, // Monrovia LR
  { minLat: 5.34,   maxLat: 5.38,   minLng: -4.03,  maxLng: -3.98  }, // Abiyán norte
  { minLat: 12.36,  maxLat: 12.40,  minLng: -1.51,  maxLng: -1.46  }, // Uagadugú norte
  { minLat: 13.50,  maxLat: 13.54,  minLng: 2.10,   maxLng: 2.15   }, // Niamey NE
  { minLat: 12.36,  maxLat: 12.40,  minLng: 1.52,   maxLng: 1.57   }, // Dosso NE
  { minLat: 10.43,  maxLat: 10.47,  minLng: 7.48,   maxLng: 7.53   }, // Kaduna NG
  { minLat: 9.05,   maxLat: 9.09,   minLng: 7.47,   maxLng: 7.52   }, // Abuja NG
  { minLat: 7.38,   maxLat: 7.42,   minLng: 3.89,   maxLng: 3.94   }, // Ibadán NG
  { minLat: 4.04,   maxLat: 4.08,   minLng: 9.69,   maxLng: 9.74   }, // Duala CM
  { minLat: 3.86,   maxLat: 3.90,   minLng: 11.50,  maxLng: 11.55  }, // Yaundé CM
  { minLat: 4.36,   maxLat: 4.40,   minLng: 18.55,  maxLng: 18.60  }, // Bangui CF
  { minLat: 4.85,   maxLat: 4.89,   minLng: 31.60,  maxLng: 31.65  }, // Yuba SS
  { minLat: 0.31,   maxLat: 0.35,   minLng: 32.57,  maxLng: 32.62  }, // Kampala UG
  { minLat: -3.38,  maxLat: -3.34,  minLng: 29.35,  maxLng: 29.40  }, // Bujumbura BI
  { minLat: -1.94,  maxLat: -1.90,  minLng: 30.06,  maxLng: 30.11  }, // Kigali RW
  { minLat: -6.17,  maxLat: -6.13,  minLng: 35.73,  maxLng: 35.78  }, // Dodoma TZ
  { minLat: -6.80,  maxLat: -6.76,  minLng: 39.27,  maxLng: 39.32  }, // Dar es Salám TZ
  { minLat: -13.97, maxLat: -13.93, minLng: 33.77,  maxLng: 33.82  }, // Lilongüe MW
  { minLat: -11.70, maxLat: -11.66, minLng: 43.24,  maxLng: 43.29  }, // Moroni KM
  { minLat: -20.16, maxLat: -20.12, minLng: 57.49,  maxLng: 57.54  }, // Port Louis MU
  { minLat: -4.27,  maxLat: -4.23,  minLng: 15.27,  maxLng: 15.32  }, // Brazzaville CG
  { minLat: -8.84,  maxLat: -8.80,  minLng: 13.22,  maxLng: 13.27  }, // Luanda AO
  { minLat: -11.20, maxLat: -11.16, minLng: 17.87,  maxLng: 17.92  }, // Huambo AO
  { minLat: -22.56, maxLat: -22.52, minLng: 17.08,  maxLng: 17.13  }, // Windhoek NA
  { minLat: -24.65, maxLat: -24.61, minLng: 25.90,  maxLng: 25.95  }, // Gaborone BW
  { minLat: -26.32, maxLat: -26.28, minLng: 31.13,  maxLng: 31.18  }, // Mbabane SZ
  { minLat: -29.31, maxLat: -29.27, minLng: 27.47,  maxLng: 27.52  }, // Maseru LS
  { minLat: -25.96, maxLat: -25.92, minLng: 32.57,  maxLng: 32.62  }, // Maputo norte
  { minLat: 2.04,   maxLat: 2.08,   minLng: 45.33,  maxLng: 45.38  }, // Mogadiscio SO
  { minLat: 11.59,  maxLat: 11.63,  minLng: 43.14,  maxLng: 43.19  }, // Yibuti norte
  { minLat: 15.55,  maxLat: 15.59,  minLng: 32.53,  maxLng: 32.58  }, // Jartum norte
  { minLat: 19.62,  maxLat: 19.66,  minLng: -17.03, maxLng: -16.98 }, // Nuadibú MR
  { minLat: 18.07,  maxLat: 18.11,  minLng: -15.97, maxLng: -15.92 }, // Nuakchot MR
  { minLat: 12.65,  maxLat: 12.69,  minLng: -8.00,  maxLng: -7.95  }, // Bamako ML
  { minLat: 5.84,   maxLat: 5.88,   minLng: -0.21,  maxLng: -0.16  }, // Acra sur
  // Oceanía extra
  { minLat: -16.50, maxLat: -16.46, minLng: -151.74,maxLng: -151.69}, // Papeete PF
  { minLat: -13.83, maxLat: -13.79, minLng: -171.78,maxLng: -171.73}, // Apia WS
  { minLat: -21.13, maxLat: -21.09, minLng: -175.21,maxLng: -175.16}, // Nukualofa TO
  { minLat: -0.54,  maxLat: -0.50,  minLng: 166.91, maxLng: 166.96 }, // Yaren NR
  { minLat: 7.34,   maxLat: 7.38,   minLng: 134.47, maxLng: 134.52 }, // Koror PW
  { minLat: -8.50,  maxLat: -8.46,  minLng: 179.18, maxLng: 179.23 }, // Funafuti TV
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

// Palabras clave que delatan interiores, propiedades privadas o ubicaciones no-vía-pública
const INDOOR_KEYWORDS = [
  // interiores genéricos
  "hotel", "mall", "shopping", "airport", "aeropuerto", "museum", "museo",
  "hospital", "store", "tienda", "restaurant", "café", "cafe", "bar ",
  "stadium", "estadio", "arena", "gym", "gimnasio", "office", "oficina",
  "university", "universidad", "school", "escuela", "church", "iglesia",
  "temple", "templo", "mosque", "mezquita", "palace", "palacio",
  // barcos y agua
  "cruise", "ship", "ferry", "boat", "vessel", "pier", "dock", "port",
  // sky/altitude / edificios
  "rooftop", "roof ", "terrace", "terraza", "observation deck", "tower",
  "ski ", "ski resort", "gondola", "cable car",
  // parques temáticos / privados
  "theme park", "amusement", "resort", "zoo",
];

function isPublicRoadPano(data: google.maps.StreetViewPanoramaData): boolean {
  // 1. Debe tener links de navegación — los interiores y puntos aislados no los tienen
  if (!data.links || data.links.length < 2) return false;

  // 2. El copyright debe ser de Google (Street View oficial).
  //    Los panoramas de negocios, museos, etc. tienen otro autor.
  const copy = (data.copyright ?? "").toLowerCase();
  if (copy && !copy.includes("google")) return false;

  // 3. La descripción de la ubicación no debe contener palabras de interior/privado
  const description = [
    data.location?.description ?? "",
  ].join(" ").toLowerCase();
  if (INDOOR_KEYWORDS.some((kw) => description.includes(kw))) return false;

  // 4. El panoId no debe corresponder a un panorama de Google Business Photos
  //    (los IDs de Business Photos son cadenas largas con formato diferente a los
  //    IDs de carretera que suelen ser alfanuméricos de ~22 chars)
  const pano = data.location?.pano ?? "";
  // Business Photos y User Photos suelen tener IDs con "AF1Qip" o muy largos (>30 chars)
  if (pano.startsWith("AF1Qip") || pano.length > 30) return false;

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
          isPublicRoadPano(data)
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
