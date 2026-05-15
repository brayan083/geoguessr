import type { LatLng } from "@/types/game";

// Coordenadas aleatorias dentro de la superficie terrestre (excluye océanos polares)
function randomLatLng(): LatLng {
  return {
    lat: Math.random() * 140 - 60, // -60° a +80° (evita Antártida y Ártico extremo)
    lng: Math.random() * 360 - 180,
  };
}

/**
 * Busca una coordenada aleatoria que tenga Street View outdoor navegable.
 * Reintenta indefinidamente hasta encontrar una válida.
 * Debe llamarse desde el cliente (usa google.maps.StreetViewService).
 */
export function findRandomStreetViewLocation(): Promise<LatLng> {
  return new Promise((resolve) => {
    const svService = new google.maps.StreetViewService();

    const attempt = () => {
      const candidate = randomLatLng();
      svService.getPanorama(
        {
          location: candidate,
          radius: 10_000, // 10km — suficiente para encontrar calles cercanas
          source: google.maps.StreetViewSource.OUTDOOR,
        },
        (data, status) => {
          if (
            status === google.maps.StreetViewStatus.OK &&
            data?.location?.latLng &&
            data.links && data.links.length > 0
          ) {
            // Usamos la posición exacta del panorama encontrado, no el candidato
            resolve({
              lat: data.location.latLng.lat(),
              lng: data.location.latLng.lng(),
            });
          } else {
            // Sin cobertura aquí, intentar otra coordenada
            attempt();
          }
        },
      );
    };

    attempt();
  });
}

/**
 * Genera N ubicaciones aleatorias con Street View válido en paralelo.
 */
export async function pickRoundLocations(count: number): Promise<LatLng[]> {
  return Promise.all(
    Array.from({ length: count }, () => findRandomStreetViewLocation()),
  );
}
