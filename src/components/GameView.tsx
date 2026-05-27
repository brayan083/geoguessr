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
  onLeave: () => void;
}

export function GameView({
  round,
  players,
  settings,
  myId,
  isHost,
  onSubmitGuess,
  onAllSubmittedOrExpired,
  onLeave,
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
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="flex w-full max-w-sm flex-col items-center gap-8">

          {/* Check animado */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand/20 ring-2 ring-brand">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-brand">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-3xl font-bold">¡Ubicación enviada!</h2>
            <p className="text-slate-400">Esperando a los demás jugadores…</p>
          </div>

          {/* Tarjeta de jugadores */}
          <div className="w-full rounded-2xl bg-slate-800/60 p-5 ring-1 ring-white/10 backdrop-blur-sm">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
              Jugadores listos — {submittedCount} / {totalPlayers}
            </p>
            <div className="flex flex-col gap-2">
              {Object.values(players).map((p) => {
                const done = !!round.guesses?.[p.id];
                return (
                  <div key={p.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${done ? "bg-brand/15 ring-1 ring-brand/30" : "bg-slate-700/50"}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-brand text-white" : "bg-slate-600 text-slate-300"}`}>
                      {p.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className={`flex-1 font-medium ${done ? "text-white" : "text-slate-400"}`}>{p.name}</span>
                    {done ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-brand">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center gap-1">
            <Timer endsAt={round.endsAt} onExpire={handleTimerExpire} />
            <p className="text-xs text-slate-500">Tiempo restante</p>
          </div>

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
        <div className="flex items-start gap-2">
          <div className="pointer-events-auto rounded-xl bg-black/70 px-4 py-2.5 text-white backdrop-blur-sm">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Ronda
            </div>
            <div className="text-xl font-bold tabular-nums">
              {round.index + 1}
              <span className="text-sm font-normal text-slate-400"> / {settings.rounds}</span>
            </div>
          </div>
          <button
            onClick={onLeave}
            className="pointer-events-auto rounded-xl bg-black/70 px-3 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition hover:bg-red-600 hover:text-white"
          >
            Salir
          </button>
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
        <div className="pointer-events-auto flex flex-col gap-1.5">
          {/* Tabla de jugadores */}
          <div className="rounded-xl bg-black/70 px-3 py-2 backdrop-blur-sm">
            <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Jugadores
            </p>
            <div className="flex flex-col gap-1">
              {Object.values(players).map((p) => {
                const done = !!round.guesses?.[p.id];
                return (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? "bg-brand text-white" : "bg-slate-600 text-slate-300"}`}>
                      {p.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className={`text-sm font-medium ${done ? "text-white" : "text-slate-400"}`}>
                      {p.name}
                    </span>
                    <div className="ml-auto pl-2">
                      {done ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-brand">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Acciones */}
          <div className="flex justify-end">
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
