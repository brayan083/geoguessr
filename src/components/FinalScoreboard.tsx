"use client";

import type { Player } from "@/types/game";

interface Props {
  players: Record<string, Player>;
  totals: Record<string, number>;
  isHost: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

export function FinalScoreboard({
  players,
  totals,
  isHost,
  onPlayAgain,
  onExit,
}: Props) {
  const ranking = Object.values(players)
    .map((p) => ({ ...p, score: totals[p.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900/80 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <h1 className="mb-2 text-center text-3xl font-bold">¡Partida finalizada!</h1>
        <p className="mb-8 text-center text-slate-400">Clasificación final</p>
        <ol className="space-y-3">
          {ranking.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center justify-between rounded-lg p-4 ${
                i === 0
                  ? "bg-gradient-to-r from-yellow-500/30 to-amber-600/20 ring-1 ring-yellow-400/50"
                  : "bg-slate-800 ring-1 ring-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{medals[i] ?? `#${i + 1}`}</span>
                <span className="font-semibold">{p.name}</span>
              </div>
              <span className="text-xl font-bold text-brand-light">
                {p.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex gap-3">
          {isHost && (
            <button
              onClick={onPlayAgain}
              className="flex-1 rounded-lg bg-brand py-3 font-bold hover:bg-brand-dark"
            >
              Jugar otra vez
            </button>
          )}
          <button
            onClick={onExit}
            className="flex-1 rounded-lg bg-slate-700 py-3 font-semibold hover:bg-slate-600"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
