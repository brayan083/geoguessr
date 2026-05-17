"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, joinRoom, cleanupStaleRooms } from "@/lib/room";
import { ThemeToggle } from "@/components/ThemeToggle";

type Mode = null | "create" | "join" | "solo";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { cleanupStaleRooms(); }, []);

  const requireName = () => {
    if (!name.trim()) { setError("Escribe tu nombre primero"); return false; }
    setError(null);
    return true;
  };

  const handleCreate = async () => {
    if (!requireName()) return;
    setLoading(true);
    try {
      sessionStorage.setItem("playerName", name);
      const newCode = await createRoom(name);
      router.push(`/room/${newCode}`);
    } catch (e: any) {
      setError(e.message ?? "Error al crear la sala");
    } finally { setLoading(false); }
  };

  const handleJoin = async () => {
    if (!requireName()) return;
    if (code.trim().length < 4) { setError("Introduce un código de sala válido"); return; }
    setLoading(true);
    try {
      sessionStorage.setItem("playerName", name);
      const normalized = code.trim().toUpperCase();
      await joinRoom(normalized, name);
      router.push(`/room/${normalized}`);
    } catch (e: any) {
      setError(e.message ?? "Error al unirse a la sala");
    } finally { setLoading(false); }
  };

  const handleSolo = () => {
    if (!requireName()) return;
    sessionStorage.setItem("playerName", name);
    router.push("/solo");
  };

  const nameField = (
    <label className="mb-5 block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">Tu nombre</span>
      <input
        value={name}
        onChange={(e) => { setName(e.target.value); setError(null); }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (mode === "create") handleCreate();
            else if (mode === "join") handleJoin();
            else if (mode === "solo") handleSolo();
          }
        }}
        placeholder="Marco Polo"
        maxLength={20}
        autoFocus
        className="w-full rounded-xl bg-slate-800 px-4 py-3 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </label>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold">
            <span className="text-brand-light">Geo</span>
            <span className="text-white">Guessr</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Adivina dónde estás a partir de Street View
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="rounded-2xl bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur">

          {mode === null && (
            <div className="space-y-3">
              <button
                onClick={() => setMode("create")}
                className="flex w-full items-center gap-4 rounded-xl bg-brand px-5 py-4 text-left font-bold text-white transition hover:bg-brand-dark"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xl">🎮</span>
                <div>
                  <div className="text-base font-bold">Crear partida</div>
                  <div className="text-xs font-normal text-white/70">Empieza una nueva sala y comparte el código</div>
                </div>
              </button>

              <button
                onClick={() => setMode("join")}
                className="flex w-full items-center gap-4 rounded-xl bg-slate-700 px-5 py-4 text-left transition hover:bg-slate-600"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xl">🔗</span>
                <div>
                  <div className="text-base font-bold text-white">Unirse con código</div>
                  <div className="text-xs font-normal text-slate-400">Introduce el código que te compartieron</div>
                </div>
              </button>

              <button
                onClick={() => setMode("solo")}
                className="flex w-full items-center gap-4 rounded-xl bg-slate-800 px-5 py-4 text-left ring-1 ring-slate-700 transition hover:bg-slate-700"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xl">👤</span>
                <div>
                  <div className="text-base font-bold text-slate-200">Jugar en solitario</div>
                  <div className="text-xs font-normal text-slate-400">Practica solo, sin sala</div>
                </div>
              </button>
            </div>
          )}

          {mode === "create" && (
            <div>
              <button onClick={() => { setMode(null); setError(null); }} className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white">
                ← Volver
              </button>
              <h2 className="mb-4 text-lg font-bold text-white">Crear partida</h2>
              {nameField}
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full rounded-xl bg-brand py-3 font-bold text-white transition hover:bg-brand-dark disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear y entrar →"}
              </button>
            </div>
          )}

          {mode === "join" && (
            <div>
              <button onClick={() => { setMode(null); setError(null); }} className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white">
                ← Volver
              </button>
              <h2 className="mb-4 text-lg font-bold text-white">Unirse a partida</h2>
              {nameField}
              <label className="mb-5 block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">Código de sala</span>
                <input
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="ABC123"
                  maxLength={8}
                  className="w-full rounded-xl bg-slate-800 px-4 py-3 font-mono text-lg uppercase tracking-widest ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </label>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full rounded-xl bg-slate-700 py-3 font-bold text-white transition hover:bg-slate-600 disabled:opacity-50"
              >
                {loading ? "Uniéndome..." : "Unirse →"}
              </button>
            </div>
          )}

          {mode === "solo" && (
            <div>
              <button onClick={() => { setMode(null); setError(null); }} className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white">
                ← Volver
              </button>
              <h2 className="mb-4 text-lg font-bold text-white">Jugar en solitario</h2>
              {nameField}
              <button
                onClick={handleSolo}
                disabled={loading}
                className="w-full rounded-xl bg-slate-800 py-3 font-bold text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700 disabled:opacity-50"
              >
                Empezar →
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
