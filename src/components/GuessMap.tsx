"use client";

import { Fragment, useCallback, useState } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/lib/useGoogleMapsLoader";
import type { LatLng } from "@/types/game";

interface Props {
  /** Si está definido, el mapa muestra los marcadores del resultado y no permite clickar. */
  reveal?: {
    actual: LatLng;
    guesses: { position: LatLng; color: string; label: string }[];
  };
  onGuessChange?: (position: LatLng | null) => void;
  expanded: boolean;
  onExpandToggle?: () => void;
}

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 20, lng: 0 };

export function GuessMap({
  reveal,
  onGuessChange,
  expanded,
  onExpandToggle,
}: Props) {
  const { isLoaded } = useGoogleMapsLoader();
  const [guess, setGuess] = useState<LatLng | null>(null);

  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (reveal || !e.latLng) return;
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setGuess(pos);
      onGuessChange?.(pos);
    },
    [reveal, onGuessChange],
  );

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-800 text-white">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20 ${
        expanded ? "" : "hover:ring-2 hover:ring-brand"
      }`}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={reveal?.actual ?? defaultCenter}
        zoom={reveal ? 4 : 2}
        onClick={handleClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          minZoom: 1,
        }}
      >
        {reveal ? (
          <>
            <Marker
              position={reveal.actual}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#10b981",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
              label={{ text: "★", color: "white", fontWeight: "bold" }}
            />
            {reveal.guesses.map((g, i) => (
              <Fragment key={i}>
                <Marker
                  position={g.position}
                  label={{
                    text: g.label,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    fillColor: g.color,
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }}
                />
                <Polyline
                  path={[g.position, reveal.actual]}
                  options={{
                    strokeColor: g.color,
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                    geodesic: true,
                    icons: [
                      {
                        icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
                        offset: "0",
                        repeat: "12px",
                      },
                    ],
                  }}
                />
              </Fragment>
            ))}
          </>
        ) : (
          guess && (
            <Marker
              position={guess}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#10b981",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          )
        )}
      </GoogleMap>
      {onExpandToggle && !reveal && (
        <button
          onClick={onExpandToggle}
          className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
          aria-label="Expandir mapa"
        >
          {expanded ? "Colapsar" : "Expandir"}
        </button>
      )}
    </div>
  );
}

