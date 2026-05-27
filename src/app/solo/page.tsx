"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StreetViewPanorama } from "@/components/StreetViewPanorama";
import { GuessMap } from "@/components/GuessMap";
import { Timer } from "@/components/Timer";
import { pickRoundLocations, type StreetViewLocation } from "@/lib/locations";
import { useGoogleMapsLoader } from "@/lib/useGoogleMapsLoader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { distanceKm, formatDistance, scoreFromDistance } from "@/lib/scoring";
import { DEFAULT_SETTINGS, type LatLng } from "@/types/game";

const TOTAL_ROUNDS = DEFAULT_SETTINGS.rounds;
const DURATION_SEC = DEFAULT_SETTINGS.roundDurationSec;

interface RoundLog {
  actual: LatLng;
  guess: LatLng | null;
  distance: number;
  score: number;
}

export default function SoloPage() {
  const router = useRouter();
  const { isLoaded } = useGoogleMapsLoader();
  const [locations, setLocations] = useState<StreetViewLocation[]>([]);
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [phase, setPhase] = useState<"loading" | "play" | "result" | "final">("loading");
  const [endsAt, setEndsAt] = useState(0);
  const [log, setLog] = useState<RoundLog[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    pickRoundLocations(TOTAL_ROUNDS).then((locs) => {
      setLocations(locs);
      setEndsAt(Date.now() + DURATION_SEC * 1000);
      setPhase("play");
    });
  }, [isLoaded]);

  const actual = locations[round];

  const submit = () => {
    if (!actual) return;
    const g = guess;
    const d = g ? distanceKm(g, actual.position) : 20000;
    const s = g ? scoreFromDistance(d) : 0;
    setLog((prev) => [...prev, { actual: actual.position, guess: g, distance: d, score: s }]);
    setPhase("result");
  };

  const goNext = () => {
    if (round + 1 >= TOTAL_ROUNDS) {
      setPhase("final");
      return;
    }
    setRound(round + 1);
    setGuess(null);
    setEndsAt(Date.now() + DURATION_SEC * 1000);
    setPhase("play");
  };

  if (phase === "final") {
    const total = log.reduce((s, r) => s + r.score, 0);
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white">
        <div className="w-full max-w-md rounded-2xl bg-slate-900/80 p-8 ring-1 ring-white/10">
          <h1 className="mb-4 text-center text-3xl font-bold">Partida finalizada</h1>
          <p className="mb-2 text-center text-slate-400">Puntuación total</p>
          <p className="mb-6 text-center text-5xl font-bold text-brand-light">
            {total.toLocaleString()}
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            {log.map((r, i) => (
              <li
                key={i}
                className="flex justify-between rounded bg-slate-800 px-3 py-2 ring-1 ring-slate-700"
              >
                <span>Ronda {i + 1}</span>
                <span className="text-slate-400">{formatDistance(r.distance)}</span>
                <span className="font-bold text-brand-light">{r.score}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <button
              onClick={() => location.reload()}
              className="flex-1 rounded-lg bg-brand py-3 font-bold hover:bg-brand-dark"
            >
              Jugar otra vez
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 rounded-lg bg-slate-700 py-3 font-semibold hover:bg-slate-600"
            >
              Inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "result") {
    const last = log[log.length - 1];
    return (
      <div className="flex h-screen w-screen flex-col bg-slate-900 text-white">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1">
            <GuessMap
              expanded
              reveal={{
                actual: last.actual,
                guesses: last.guess
                  ? [{ position: last.guess, color: "#3b82f6", label: "T" }]
                  : [],
              }}
            />
          </div>
          <aside className="w-80 bg-slate-800 p-6">
            <h2 className="mb-2 text-2xl font-bold">Ronda {round + 1}</h2>
            <p className="mb-1 text-sm text-slate-400">Distancia</p>
            <p className="mb-4 text-2xl font-bold">
              {last.guess ? formatDistance(last.distance) : "Sin respuesta"}
            </p>
            <p className="mb-1 text-sm text-slate-400">Puntuación</p>
            <p className="mb-6 text-3xl font-bold text-brand-light">{last.score}</p>
            <button
              onClick={goNext}
              className="w-full rounded-lg bg-brand py-3 font-bold hover:bg-brand-dark"
            >
              {round + 1 >= TOTAL_ROUNDS ? "Ver resultado final" : "Siguiente ronda"}
            </button>
          </aside>
        </div>
      </div>
    );
  }

  if (phase === "loading" || !actual) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <p className="text-slate-400">Buscando ubicaciones...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <StreetViewPanorama
        position={actual.position}
        panoId={actual.panoId}
        allowMove={DEFAULT_SETTINGS.allowMove}
        allowZoom={DEFAULT_SETTINGS.allowZoom}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
        <div className="pointer-events-auto self-start rounded-lg bg-black/70 px-4 py-2 text-white">
          Ronda <strong>{round + 1}/{TOTAL_ROUNDS}</strong>
        </div>
        <div className="pointer-events-auto flex flex-col items-center gap-1 self-start">
          <Timer endsAt={endsAt} onExpire={submit} />
          <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs text-slate-300 backdrop-blur-sm">
            Haz clic en el mapa para elegir
          </span>
        </div>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
      <div className={`absolute bottom-4 right-4 z-10 transition-all ${expanded ? "h-[70vh] w-[70vw]" : "h-48 w-72 sm:h-64 sm:w-96"}`}>
        <GuessMap expanded={expanded} onGuessChange={(position) => {
          if (position) setGuess(position);
        }} />
        <div className="absolute -top-12 left-0 right-0 flex justify-between gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg bg-black/70 px-4 py-2 font-bold text-white shadow-lg hover:bg-black/90"
          >
            {expanded ? "Colapsar" : "Expandir"}
          </button>
          {guess && (
            <button
              onClick={submit}
              className="rounded-lg bg-brand px-4 py-2 font-bold text-white shadow-lg hover:bg-brand-dark"
            >
              ¡Confirmar!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
