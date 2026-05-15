"use client";

import { useEffect, useRef, useState } from "react";
import { StreetViewPanorama } from "./StreetViewPanorama";
import { GuessMap } from "./GuessMap";
import { Timer } from "./Timer";
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
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const advancedRef = useRef(false);

  const alreadySubmitted = !!round.guesses?.[myId];
  const totalPlayers = Object.keys(players ?? {}).length;
  const submittedCount = Object.keys(round.guesses ?? {}).length;

  // Resetear el guard cuando cambia la ronda
  useEffect(() => {
    advancedRef.current = false;
  }, [round.index]);

  const handleSubmit = async () => {
    if (!guess || alreadySubmitted) return;
    setSubmitting(true);
    try {
      await onSubmitGuess(guess);
    } finally {
      setSubmitting(false);
    }
  };

  // El host vigila la condición de finalización de ronda (una sola vez por ronda).
  useEffect(() => {
    if (!isHost || advancedRef.current) return;
    if (submittedCount >= totalPlayers && totalPlayers > 0) {
      advancedRef.current = true;
      onAllSubmittedOrExpired();
    }
  }, [isHost, submittedCount, totalPlayers, onAllSubmittedOrExpired]);

  const handleTimerExpire = () => {
    if (!isHost || advancedRef.current) return;
    advancedRef.current = true;
    onAllSubmittedOrExpired();
  };

  const mapSizeClasses = expanded
    ? "h-[70vh] w-[70vw]"
    : "h-48 w-72 sm:h-64 sm:w-96";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <StreetViewPanorama
        position={round.location}
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
        <div className="pointer-events-auto">
          <Timer
            endsAt={round.endsAt}
            onExpire={isHost ? handleTimerExpire : undefined}
          />
        </div>
        <div className="pointer-events-auto rounded-lg bg-black/70 px-4 py-2 text-white">
          <div className="text-xs uppercase tracking-wider text-slate-300">
            Enviados
          </div>
          <div className="text-lg font-bold">
            {submittedCount} / {totalPlayers}
          </div>
        </div>
      </div>

      {/* Mapa de adivinar (esquina inferior derecha) */}
      <div
        className={`absolute bottom-4 right-4 z-10 ${mapSizeClasses} transition-all`}
      >
        <GuessMap
          expanded={expanded}
          onExpandToggle={() => setExpanded((v) => !v)}
          onGuessChange={setGuess}
        />
        <div className="absolute -top-12 left-0 right-0 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!guess || alreadySubmitted || submitting}
            className="rounded-lg bg-brand px-6 py-2 font-bold text-white shadow-lg transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {alreadySubmitted
              ? "Esperando..."
              : submitting
              ? "Enviando..."
              : "Adivinar"}
          </button>
        </div>
      </div>
    </div>
  );
}
