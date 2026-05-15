"use client";

import { useEffect, useRef } from "react";
import { useGoogleMapsLoader } from "@/lib/useGoogleMapsLoader";
import type { LatLng } from "@/types/game";

interface Props {
  position: LatLng;
  allowMove: boolean;
  allowZoom: boolean;
}

/**
 * Panorámica de Google Street View.
 *
 * Estrategia robusta:
 *  - Hace primero la búsqueda del panorama con StreetViewService.
 *  - Crea la panorámica SOLO cuando tenemos un panoId válido (evita pantalla negra).
 *  - Reutiliza la misma panorámica entre rondas vía setPano.
 *  - Cascada de fallback: outdoor 5km → outdoor 50km → cualquier fuente 50km.
 */
export function StreetViewPanorama({ position, allowMove, allowZoom }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const { isLoaded } = useGoogleMapsLoader();

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;
    let cancelled = false;
    const svService = new google.maps.StreetViewService();

    const find = (radius: number) =>
      new Promise<google.maps.StreetViewPanoramaData | null>((resolve) => {
        svService.getPanorama(
          {
            location: position,
            radius,
            source: google.maps.StreetViewSource.OUTDOOR,
          },
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
      // 1) Outdoor cercano con navegación
      let data = await find(5_000);
      // 2) Outdoor lejano con navegación
      if (!data) data = await find(50_000);

      if (cancelled || !data?.location?.pano) {
        if (!data) console.warn("Sin Street View para", position);
        return;
      }

      const panoId = data.location.pano;

      if (panoramaRef.current) {
        // Reutilizar panorámica existente
        panoramaRef.current.setPano(panoId);
        panoramaRef.current.setPov({
          heading: Math.random() * 360,
          pitch: 0,
        });
        panoramaRef.current.setZoom(1);
      } else if (containerRef.current) {
        // Crear nueva panorámica con el panoId encontrado
        panoramaRef.current = new google.maps.StreetViewPanorama(
          containerRef.current,
          {
            pano: panoId,
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
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, position.lat, position.lng]);

  // Actualizar opciones (movimiento/zoom) sin recrear la panorámica
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
