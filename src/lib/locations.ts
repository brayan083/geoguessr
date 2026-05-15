import type { LatLng } from "@/types/game";

export interface StreetViewLocation {
  position: LatLng;
  panoId: string;
}

function randomLatLng(): LatLng {
  return {
    lat: Math.random() * 140 - 60, // -60° a +80° (evita Antártida y Ártico extremo)
    lng: Math.random() * 360 - 180,
  };
}

function findRandomStreetViewLocation(): Promise<StreetViewLocation> {
  return new Promise((resolve) => {
    const svService = new google.maps.StreetViewService();

    const attempt = () => {
      const candidate = randomLatLng();
      svService.getPanorama(
        {
          location: candidate,
          radius: 10_000,
          source: google.maps.StreetViewSource.OUTDOOR,
        },
        (data, status) => {
          if (
            status === google.maps.StreetViewStatus.OK &&
            data?.location?.latLng &&
            data?.location?.pano &&
            data.links && data.links.length > 0
          ) {
            resolve({
              position: {
                lat: data.location.latLng.lat(),
                lng: data.location.latLng.lng(),
              },
              panoId: data.location.pano,
            });
          } else {
            attempt();
          }
        },
      );
    };

    attempt();
  });
}

export async function pickRoundLocations(count: number): Promise<StreetViewLocation[]> {
  return Promise.all(
    Array.from({ length: count }, () => findRandomStreetViewLocation()),
  );
}
