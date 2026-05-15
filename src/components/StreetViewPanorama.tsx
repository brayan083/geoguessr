"use client";

import { useEffect, useRef } from "react";
import { useGoogleMapsLoader } from "@/lib/useGoogleMapsLoader";
import type { LatLng } from "@/types/game";

interface Props {
  position: LatLng;
  panoId?: string;
  allowMove: boolean;
  allowZoom: boolean;
}

export function StreetViewPanorama({ position, panoId, allowMove, allowZoom }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const { isLoaded } = useGoogleMapsLoader();

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;
    let cancelled = false;

    const initPanorama = (id: string) => {
      if (cancelled || !containerRef.current) return;
      if (panoramaRef.current) {
        panoramaRef.current.setPano(id);
        panoramaRef.current.setPov({ heading: Math.random() * 360, pitch: 0 });
        panoramaRef.current.setZoom(1);
      } else {
        panoramaRef.current = new google.maps.StreetViewPanorama(
          containerRef.current,
          {
            pano: id,
            pov: { heading: Math.random() * 360, pitch: 0 },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
            linksControl: allowMove,
            panControl: true,
            zoomControl: allowZoom,
            clickToGo: allowMove,
            disableDefaultUI: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
          },
        );
      }
    };

    if (panoId) {
      // panoId ya validado — úsalo directamente, sin requests extra
      initPanorama(panoId);
      return () => { cancelled = true; };
    }

    // Fallback: buscar el panorama más cercano (usado en modo solo)
    const svService = new google.maps.StreetViewService();
    const find = (radius: number) =>
      new Promise<google.maps.StreetViewPanoramaData | null>((resolve) => {
        svService.getPanorama(
          { location: position, radius, source: google.maps.StreetViewSource.OUTDOOR },
          (data, status) => {
            if (
              status === google.maps.StreetViewStatus.OK &&
              data?.location?.pano &&
              data.links && data.links.length > 0
            ) {
              resolve(data);
            } else {
              resolve(null);
            }
          },
        );
      });

    (async () => {
      let data = await find(5_000);
      if (!data) data = await find(50_000);
      if (cancelled || !data?.location?.pano) {
        if (!data) console.warn("Sin Street View para", position);
        return;
      }
      initPanorama(data.location.pano);
    })();

    return () => { cancelled = true; };
  }, [isLoaded, panoId, position.lat, position.lng]);

  useEffect(() => {
    if (!panoramaRef.current) return;
    panoramaRef.current.setOptions({
      linksControl: allowMove,
      clickToGo: allowMove,
      zoomControl: allowZoom,
    });
  }, [allowMove, allowZoom]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black">
      {!isLoaded && (
        <div className="flex h-full items-center justify-center text-white">
          Cargando Street View...
        </div>
      )}
    </div>
  );
}
