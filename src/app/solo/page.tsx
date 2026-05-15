"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StreetViewPanorama } from "@/components/StreetViewPanorama";
import { GuessMap } from "@/components/GuessMap";
import { Timer } from "@/components/Timer";
import { pickRoundLocations } from "@/lib/locations";
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
  const locations = useMemo(
    () => pickRoundLocations("world", TOTAL_ROUNDS),
    [],
  );
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [phase, setPhase] = useState<"play" | "result" | "final">("play");
  const [endsAt, setEndsAt] = useState(Date.now() + DURATION_SEC * 1000);
  const [log, setLog] = useState<RoundLog[]>([]);

  const actual = locations[round];

  const submit = () => {
    if (!actual) return;
    const g = guess;
    const d = g ? distanceKm(g, actual) : 20000;
    const s = g ? scoreFromDistance(d) : 0;
    setLog((prev) => [
      ...prev,
      { actual, guess: g, distance: d, score: s },
    ]);
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
                <span className="text-slate-400">
                  {formatDistance(r.distance)}
                </span>
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
                  ? [
                      {
                        position: last.guess,
                        color: "#3b82f6",
                        label: "T",
                      },
                    ]
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
            <p className="mb-6 text-3xl font-bold text-brand-light">
              {last.score}
            </p>
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

  if (!actual) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Cargando ubicación...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <StreetViewPanorama
        position={actual}
        allowMove={DEFAULT_SETTINGS.allowMove}
        allowZoom={DEFAULT_SETTINGS.allowZoom}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
        <div className="pointer-events-auto rounded-lg bg-black/70 px-4 py-2">
          Ronda <strong>{round + 1}/{TOTAL_ROUNDS}</strong>
        </div>
        <Timer endsAt={endsAt} onExpire={submit} />
      </div>
      <div className="absolute bottom-4 right-4 z-10 h-48 w-72 sm:h-64 sm:w-96">
        <GuessMap expanded={false} onGuessChange={setGuess} />
        <div className="absolute -top-12 left-0 right-0 flex justify-end">
          <button
            onClick={submit}
            disabled={!guess}
            className="rounded-lg bg-brand px-6 py-2 font-bold text-white shadow-lg hover:bg-brand-dark disabled:opacity-50"
          >
            Adivinar
          </button>
        </div>
      </div>
    </div>
  );
}
