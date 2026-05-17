"use client";

import { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    const mountPano = (id: string) => {
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

      const listener = panoramaRef.current.addListener("tiles_loaded", () => {
        google.maps.event.removeListener(listener);
        if (!cancelled) setLoading(false);
      });
    };

    if (panoId) {
      mountPano(panoId);
    } else {
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
              ) resolve(data);
              else resolve(null);
            },
          );
        });

      (async () => {
        let data = await find(5_000);
        if (!data) data = await find(50_000);
        if (cancelled) return;
        if (data?.location?.pano) mountPano(data.location.pano);
        else { setLoading(false); setFailed(true); }
      })();
    }

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm text-slate-400">Cargando Street View...</p>
        </div>
      )}
      {!loading && failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <p className="text-slate-400">No se pudo cargar Street View</p>
          <p className="text-xs text-slate-500">La ronda continuará con el tiempo</p>
        </div>
      )}
    </div>
  );
}
