"use client";

import { GuessMap } from "./GuessMap";
import { formatDistance } from "@/lib/scoring";
import type { Player, Round } from "@/types/game";

interface Props {
  round: Round;
  players: Record<string, Player>;
  isHost: boolean;
  onNext: () => void;
  isLastRound: boolean;
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

export function RoundResults({
  round,
  players,
  isHost,
  onNext,
  isLastRound,
}: Props) {
  const playerIds = Object.keys(players);
  const guesses = round.guesses ?? {};

  const revealGuesses = playerIds
    .filter((id) => guesses[id])
    .map((id, i) => ({
      position: guesses[id].position,
      color: COLORS[i % COLORS.length],
      label: (players[id].name?.[0] ?? "?").toUpperCase(),
    }));

  const ranking = playerIds
    .map((id) => ({
      id,
      name: players[id].name,
      color: COLORS[playerIds.indexOf(id) % COLORS.length],
      score: guesses[id]?.score ?? 0,
      distance: guesses[id]?.distanceKm ?? null,
      submitted: !!guesses[id],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-900 text-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <GuessMap
            expanded
            reveal={{ actual: round.location, guesses: revealGuesses }}
          />
        </div>
        <aside className="w-80 overflow-y-auto bg-slate-800 p-6">
          <h2 className="mb-1 text-2xl font-bold">Resultados de la ronda</h2>
          <p className="mb-6 text-sm text-slate-400">
            Ronda {round.index + 1}
          </p>
          <ul className="space-y-3">
            {ranking.map((p) => (
              <li
                key={p.id}
                className="rounded-lg bg-slate-900 p-3 ring-1 ring-slate-700"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold">{p.name}</span>
                  </div>
                  <span className="text-lg font-bold text-brand">
                    {p.score}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {p.submitted
                    ? `a ${formatDistance(p.distance ?? 0)} de distancia`
                    : "Sin respuesta"}
                </div>
              </li>
            ))}
          </ul>
          {isHost && (
            <button
              onClick={onNext}
              className="mt-6 w-full rounded-lg bg-brand py-3 font-bold text-white transition hover:bg-brand-dark"
            >
              {isLastRound ? "Ver resultado final" : "Siguiente ronda"}
            </button>
          )}
          {!isHost && (
            <p className="mt-6 text-center text-sm text-slate-400">
              Esperando al anfitrión...
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
