"use client";

import { useState } from "react";
import type { Player, RoomSettings } from "@/types/game";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  code: string;
  players: Record<string, Player>;
  settings: RoomSettings;
  isHost: boolean;
  myId: string;
  onStart: () => void;
  onUpdateSettings: (s: Partial<RoomSettings>) => void;
  onKick: (playerId: string) => void;
  onClose: () => void;
  onLeave: () => void;
}

export function Lobby({
  code,
  players,
  settings,
  isHost,
  myId,
  onStart,
  onUpdateSettings,
  onKick,
  onClose,
  onLeave,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const playerList = Object.values(players ?? {}).sort(
    (a, b) => a.joinedAt - b.joinedAt,
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        {isHost ? (
          confirmClose ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">¿Cerrar sala?</span>
              <button
                onClick={onClose}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold hover:bg-red-700"
              >
                Sí, cerrar
              </button>
              <button
                onClick={() => setConfirmClose(false)}
                className="rounded-lg bg-slate-600 px-3 py-2 text-sm hover:bg-slate-500"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClose(true)}
              className="rounded-lg bg-red-600/80 px-3 py-2 text-sm font-medium hover:bg-red-600"
            >
              Cerrar sala
            </button>
          )
        ) : (
          <button
            onClick={onLeave}
            className="rounded-lg bg-slate-600/80 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          >
            Salir
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl rounded-2xl bg-slate-900/80 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            Código de sala
          </p>
          <div className="mt-1 flex items-center justify-center gap-3">
            <h1 className="font-mono text-5xl font-bold tracking-widest text-brand-light">
              {code}
            </h1>
            <button
              onClick={copy}
              className="rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section>
            <h3 className="mb-2 font-semibold">Jugadores ({playerList.length})</h3>
            <ul className="space-y-2">
              {playerList.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 ring-1 ring-slate-700"
                >
                  <span>{p.name}</span>
                  <div className="flex items-center gap-2">
                    {p.isHost && (
                      <span className="rounded bg-brand/20 px-2 py-0.5 text-xs text-brand-light">
                        Anfitrión
                      </span>
                    )}
                    {isHost && p.id !== myId && (
                      <button
                        onClick={() => onKick(p.id)}
                        className="rounded bg-red-700/60 px-2 py-0.5 text-xs hover:bg-red-700"
                        title="Expulsar jugador"
                      >
                        Expulsar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 font-semibold">Ajustes</h3>
            <div className="space-y-3 rounded-lg bg-slate-800 p-3 ring-1 ring-slate-700">
              <label className="block text-sm">
                <span className="mb-1 block text-slate-400">Rondas</span>
                <select
                  value={settings.rounds}
                  onChange={(e) =>
                    onUpdateSettings({ rounds: Number(e.target.value) })
                  }
                  disabled={!isHost}
                  className="w-full rounded bg-slate-900 px-2 py-1 ring-1 ring-slate-700 disabled:opacity-60"
                >
                  {[3, 5, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-400">
                  Duración por ronda (segundos)
                </span>
                <select
                  value={settings.roundDurationSec}
                  onChange={(e) =>
                    onUpdateSettings({ roundDurationSec: Number(e.target.value) })
                  }
                  disabled={!isHost}
                  className="w-full rounded bg-slate-900 px-2 py-1 ring-1 ring-slate-700 disabled:opacity-60"
                >
                  {[30, 60, 90, 120, 180].map((n) => (
                    <option key={n} value={n}>{n}s</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.allowMove}
                  onChange={(e) => onUpdateSettings({ allowMove: e.target.checked })}
                  disabled={!isHost}
                />
                Permitir moverse
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.allowZoom}
                  onChange={(e) => onUpdateSettings({ allowZoom: e.target.checked })}
                  disabled={!isHost}
                />
                Permitir zoom
              </label>
            </div>
          </section>
        </div>

        {isHost ? (
          <button
            onClick={onStart}
            disabled={playerList.length < 1}
            className="w-full rounded-lg bg-brand py-4 text-lg font-bold transition hover:bg-brand-dark disabled:opacity-50"
          >
            Empezar partida
          </button>
        ) : (
          <p className="text-center text-slate-400">
            Esperando a que el anfitrión empiece la partida...
          </p>
        )}
      </div>
    </div>
  );
}
