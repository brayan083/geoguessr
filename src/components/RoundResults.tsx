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
      speedBonus: guesses[id]?.speedBonus ?? 0,
      submitted: !!guesses[id],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Mapa */}
      <div className="flex-1">
        <GuessMap expanded reveal={{ actual: round.location, guesses: revealGuesses }} />
      </div>

      {/* Panel lateral */}
      <aside className="flex w-80 flex-col bg-slate-900 shadow-2xl">
        {/* Cabecera */}
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Ronda {round.index + 1}
            </p>
            {round.isDouble && (
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">⚡ x2</span>
            )}
          </div>
          <h2 className="mt-0.5 text-2xl font-bold">Resultados</h2>
        </div>

        {/* Ranking */}
        <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {ranking.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 ring-1 ring-slate-700"
            >
              {/* Posición */}
              <span className="w-5 text-center text-sm font-bold text-slate-500">
                {i + 1}
              </span>

              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.name?.[0]?.toUpperCase() ?? "?"}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <div className="flex flex-wrap items-center gap-1 mt-0.5">
                  <p className="text-xs text-slate-400">
                    {p.submitted
                      ? `${formatDistance(p.distance ?? 0)}`
                      : "Sin respuesta"}
                  </p>
{round.isDouble && p.submitted && (
                    <span className="rounded-full bg-yellow-400/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">
                      x2
                    </span>
                  )}
                </div>
              </div>

              {/* Puntos */}
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: p.color }}
              >
                {p.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="border-t border-slate-800 px-4 py-4">
          {isHost ? (
            <button
              onClick={onNext}
              className="w-full rounded-xl bg-brand py-3 font-bold text-white transition hover:bg-brand-dark active:scale-95"
            >
              {isLastRound ? "Ver resultado final" : "Siguiente ronda"}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm text-slate-400">
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Esperando al anfitrión…
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
