"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, update } from "firebase/database";
import {
  ensureSignedIn,
  getFirebaseDb,
} from "@/lib/firebase";
import {
  joinRoom,
  kickPlayer,
  closeRoom,
  leaveRoom,
  nextRound,
  playAgain,
  registerDisconnect,
  showRoundResults,
  startGame,
  submitGuess,
  subscribeRoom,
} from "@/lib/room";
import { Lobby } from "@/components/Lobby";
import { GameView } from "@/components/GameView";
import { RoundResults } from "@/components/RoundResults";
import { FinalScoreboard } from "@/components/FinalScoreboard";
import { pickRoundLocations } from "@/lib/locations";
import { useGoogleMapsLoader } from "@/lib/useGoogleMapsLoader";
import type { LatLng, Room, RoomSettings } from "@/types/game";

export default function RoomPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = (params.code ?? "").toString().toUpperCase();

  const { isLoaded: mapsLoaded } = useGoogleMapsLoader();
  const [room, setRoom] = useState<Room | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelDisconnect, setCancelDisconnect] = useState<(() => void) | null>(null);

  // Asegura autenticación + autojoin + onDisconnect
  useEffect(() => {
    let cancelDisconnect: (() => void) | null = null;
    (async () => {
      try {
        const uid = await ensureSignedIn();
        setMyId(uid);
        const name =
          (typeof window !== "undefined" &&
            sessionStorage.getItem("playerName")) ||
          "Jugador";
        try {
          await joinRoom(code, name);
        } catch {
          // si la sala ya empezó y no estamos en ella, joinRoom lanza error
        }
        cancelDisconnect = await registerDisconnect(code);
        setCancelDisconnect(() => cancelDisconnect);
      } catch (e: any) {
        setError(e.message ?? "No se pudo entrar a la sala");
      }
    })();
    return () => {
      cancelDisconnect?.();
    };
  }, [code]);

  // Suscripción reactiva
  useEffect(() => {
    if (!code) return;
    const unsub = subscribeRoom(code, (r) => {
      if (!r) {
        router.push("/");
        return;
      }
      setRoom(r);
    });
    return unsub;
  }, [code]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="rounded-lg bg-slate-800 p-6 ring-1 ring-slate-700">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded bg-brand px-4 py-2 font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!room || !myId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Conectando...
      </div>
    );
  }

  const isHost = room.hostId === myId;

  const updateSettings = async (patch: Partial<RoomSettings>) => {
    if (!isHost) return;
    const db = getFirebaseDb();
    await update(ref(db, `rooms/${code}/settings`), patch);
  };

  if (room.status === "lobby") {
    return (
      <Lobby
        code={code}
        players={room.players ?? {}}
        settings={room.settings}
        isHost={isHost}
        myId={myId}
        onStart={async () => {
          const locs = await pickRoundLocations(room.settings.rounds);
          await startGame(code, locs);
        }}
        onUpdateSettings={updateSettings}
        onKick={(playerId) => kickPlayer(code, playerId)}
        onClose={async () => { cancelDisconnect?.(); await closeRoom(code); router.push("/"); }}
        onLeave={async () => { cancelDisconnect?.(); await leaveRoom(code); router.push("/"); }}
      />
    );
  }

  const currentRound = room.rounds?.[`r${room.currentRound}`];

  if (room.status === "playing" && currentRound) {
    return (
      <GameView
        round={currentRound}
        players={room.players ?? {}}
        settings={room.settings}
        myId={myId}
        isHost={isHost}
        onSubmitGuess={(g: LatLng) => submitGuess(code, room.currentRound, g)}
        onAllSubmittedOrExpired={() => showRoundResults(code)}
        onLeave={async () => { cancelDisconnect?.(); await leaveRoom(code); router.push("/"); }}
      />
    );
  }

  if (room.status === "round-results" && currentRound) {
    return (
      <RoundResults
        round={currentRound}
        players={room.players ?? {}}
        isHost={isHost}
        isLastRound={room.currentRound + 1 >= room.settings.rounds}
        onNext={() => nextRound(code)}
      />
    );
  }

  if (room.status === "finished") {
    return (
      <FinalScoreboard
        players={room.players ?? {}}
        totals={room.totals ?? {}}
        isHost={isHost}
        onPlayAgain={() => playAgain(code)}
        onExit={() => router.push("/")}
      />
    );
  }

  return null;
}
