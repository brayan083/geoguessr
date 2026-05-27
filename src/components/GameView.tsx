"use client";

import { useEffect, useRef, useState } from "react";
import { StreetViewPanorama } from "./StreetViewPanorama";
import { GuessMap } from "./GuessMap";
import { Timer } from "./Timer";
import { ThemeToggle } from "./ThemeToggle";
import type { LatLng, Player, Round, RoomSettings } from "@/types/game";

interface Props {
  round: Round;
  players: Record<string, Player>;
  settings: RoomSettings;
  myId: string;
  isHost: boolean;
  onSubmitGuess: (g: LatLng) => Promise<void> | void;
  onAllSubmittedOrExpired: () => void;
}

export function GameView({
  round,
  players,
  settings,
  myId,
  isHost,
  onSubmitGuess,
  onAllSubmittedOrExpired,
}: Props) {
  const [selectedGuess, setSelectedGuess] = useState<LatLng | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const advancedRef = useRef(false);

  const alreadySubmitted = !!round.guesses?.[myId];
  const totalPlayers = Object.keys(players ?? {}).length;
  const submittedCount = Object.keys(round.guesses ?? {}).length;

  // Resetear el guard cuando cambia la ronda
  useEffect(() => {
    advancedRef.current = false;
    setSelectedGuess(null);
  }, [round.index]);

  const handleSubmit = async (guess: LatLng | null = selectedGuess) => {
    if (!guess || alreadySubmitted) return;
    setSubmitting(true);
    try {
      await onSubmitGuess(guess);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuessSelected = (position: LatLng | null) => {
    if (alreadySubmitted || !position) return;
    setSelectedGuess(position);
  };

  // El host vigila la condición de finalización de ronda (una sola vez por ronda).
  useEffect(() => {
    if (!isHost || advancedRef.current) return;
    if (submittedCount >= totalPlayers && totalPlayers > 0) {
      advancedRef.current = true;
      onAllSubmittedOrExpired();
    }
  }, [isHost, submittedCount, totalPlayers, onAllSubmittedOrExpired]);

  const handleTimerExpire = async () => {
    if (advancedRef.current) return;
    advancedRef.current = true;

    if (selectedGuess && !alreadySubmitted) {
      try {
        await onSubmitGuess(selectedGuess);
      } catch {
        // No cortar el avance si el envío falla en el cliente.
      }
    }

    if (isHost) {
      onAllSubmittedOrExpired();
    }
  };

  const mapSizeClasses = expanded
    ? "h-[70vh] w-[70vw]"
    : "h-48 w-72 sm:h-64 sm:w-96";

  if (alreadySubmitted) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 ring-2 ring-brand">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-brand">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">¡Ubicación enviada!</h2>
          <p className="text-slate-400">Esperando a los demás jugadores…</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-slate-500">Jugadores listos</p>
          <p className="text-3xl font-bold tabular-nums">
            {submittedCount} <span className="text-slate-500">/ {totalPlayers}</span>
          </p>
          <div className="mt-2 flex gap-2">
            {Object.values(players).map((p) => {
              const done = !!round.guesses?.[p.id];
              return (
                <div
                  key={p.id}
                  title={p.name}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ring-2 transition-all ${
                    done ? "bg-brand ring-brand" : "bg-slate-700 ring-slate-600"
                  }`}
                >
                  {p.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Timer endsAt={round.endsAt} onExpire={handleTimerExpire} />
          <p className="text-xs text-slate-500">Tiempo restante</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <StreetViewPanorama
        position={round.location}
        panoId={round.panoId}
        allowMove={settings.allowMove}
        allowZoom={settings.allowZoom}
      />

      {/* HUD superior */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between p-4">
        <div className="pointer-events-auto rounded-lg bg-black/70 px-4 py-2 text-white">
          <div className="text-xs uppercase tracking-wider text-slate-300">
            Ronda
          </div>
          <div className="text-lg font-bold">
            {round.index + 1}
          </div>
        </div>
        <div className="pointer-events-auto flex flex-col items-center gap-1">
          <Timer
            endsAt={round.endsAt}
            onExpire={handleTimerExpire}
          />
          {!alreadySubmitted && (
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs text-slate-300 backdrop-blur-sm">
              Haz clic en el mapa para elegir
            </span>
          )}
        </div>
        <div className="flex items-start gap-2">
          <div className="pointer-events-auto rounded-lg bg-black/70 px-4 py-2 text-white">
            <div className="text-xs uppercase tracking-wider text-slate-300">
              Enviados
            </div>
            <div className="text-lg font-bold">
              {submittedCount} / {totalPlayers}
            </div>
          </div>
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mapa de adivinar (esquina inferior derecha) */}
      <div
        className={`absolute bottom-4 right-4 z-10 ${mapSizeClasses} transition-all`}
      >
        <GuessMap
          expanded={expanded}
          onGuessChange={handleGuessSelected}
          disabled={alreadySubmitted}
        />
        <div className="absolute -top-12 left-0 right-0 flex justify-between gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg bg-black/70 px-4 py-2 font-bold text-white shadow-lg transition hover:bg-black/90"
          >
            {expanded ? "Colapsar" : "Expandir"}
          </button>
          {selectedGuess && !alreadySubmitted && (
            <button
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="rounded-lg bg-brand px-4 py-2 font-bold text-white shadow-lg transition hover:bg-brand-dark disabled:opacity-60"
            >
              ¡Confirmar!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
