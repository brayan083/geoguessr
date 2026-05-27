"use client";

import type { Player } from "@/types/game";

interface Props {
  players: Record<string, Player>;
  totals: Record<string, number>;
  isHost: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

const COLORS = ["#f59e0b", "#94a3b8", "#b45309", "#3b82f6", "#8b5cf6", "#ec4899"];

export function FinalScoreboard({ players, totals, isHost, onPlayAgain, onExit }: Props) {
  const ranking = Object.values(players)
    .map((p) => ({ ...p, score: totals[p.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const podiumLabels = ["1°", "2°", "3°"];
  const podiumBg = [
    "from-yellow-500/20 to-amber-600/10 ring-yellow-500/30",
    "from-slate-400/10 to-slate-500/5 ring-slate-500/20",
    "from-orange-700/20 to-orange-800/10 ring-orange-700/30",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
      {/* Trofeo */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 ring-2 ring-yellow-500/40 text-4xl">
          🏆
        </div>
        <h1 className="text-3xl font-bold">¡Partida finalizada!</h1>
        <p className="text-sm text-slate-400">Clasificación final</p>
      </div>

      {/* Tarjeta */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
        <ol className="divide-y divide-slate-800">
          {ranking.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center gap-4 bg-gradient-to-r px-5 py-4 ${
                podiumBg[i] ? `bg-gradient-to-r ${podiumBg[i]} ring-inset ring-1` : "bg-slate-800/50"
              }`}
            >
              {/* Posición */}
              <span className="w-8 text-center text-lg font-bold text-slate-400">
                {podiumLabels[i] ?? `#${i + 1}`}
              </span>

              {/* Avatar */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow"
                style={{ backgroundColor: COLORS[i] ?? "#64748b" }}
              >
                {p.name?.[0]?.toUpperCase() ?? "?"}
              </div>

              {/* Nombre */}
              <span className="flex-1 font-semibold">{p.name}</span>

              {/* Puntos */}
              <span
                className="text-xl font-bold tabular-nums"
                style={{ color: COLORS[i] ?? "#94a3b8" }}
              >
                {p.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>

        {/* Botones */}
        <div className="flex gap-3 border-t border-slate-800 px-5 py-4">
          {isHost && (
            <button
              onClick={onPlayAgain}
              className="flex-1 rounded-xl bg-brand py-3 font-bold text-white transition hover:bg-brand-dark active:scale-95"
            >
              Jugar otra vez
            </button>
          )}
          <button
            onClick={onExit}
            className="flex-1 rounded-xl bg-slate-800 py-3 font-semibold text-slate-300 transition hover:bg-slate-700 active:scale-95"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
