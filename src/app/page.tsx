"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, joinRoom } from "@/lib/room";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Pon tu nombre primero");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      sessionStorage.setItem("playerName", name);
      const newCode = await createRoom(name);
      router.push(`/room/${newCode}`);
    } catch (e: any) {
      setError(e.message ?? "Error al crear la sala");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      setError("Pon tu nombre primero");
      return;
    }
    if (code.trim().length < 4) {
      setError("Introduce un código de sala válido");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      sessionStorage.setItem("playerName", name);
      const normalized = code.trim().toUpperCase();
      await joinRoom(normalized, name);
      router.push(`/room/${normalized}`);
    } catch (e: any) {
      setError(e.message ?? "Error al unirse a la sala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <h1 className="mb-2 text-center text-4xl font-bold">
          <span className="text-brand-light">Geo</span>Guessr
        </h1>
        <p className="mb-8 text-center text-sm text-slate-400">
          Adivina dónde estás a partir de una imagen de Street View
        </p>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-slate-300">Tu nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marco Polo"
            maxLength={20}
            className="w-full rounded-lg bg-slate-800 px-4 py-3 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mb-3 w-full rounded-lg bg-brand py-3 font-bold transition hover:bg-brand-dark disabled:opacity-50"
        >
          Crear partida
        </button>

        <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500">
          <span className="h-px flex-1 bg-slate-700" />
          o
          <span className="h-px flex-1 bg-slate-700" />
        </div>

        <label className="mb-2 block">
          <span className="mb-1 block text-sm text-slate-300">
            Código de sala
          </span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={8}
            className="w-full rounded-lg bg-slate-800 px-4 py-3 font-mono uppercase tracking-widest ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full rounded-lg bg-slate-700 py-3 font-semibold transition hover:bg-slate-600 disabled:opacity-50"
        >
          Unirse a partida
        </button>

        <div className="mt-6 border-t border-slate-700 pt-6">
          <button
            onClick={() => router.push("/solo")}
            className="w-full rounded-lg bg-slate-800 py-3 font-semibold text-slate-300 ring-1 ring-slate-700 transition hover:bg-slate-700"
          >
            Jugar en solitario
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded bg-red-900/40 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
