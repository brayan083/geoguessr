import {
  ref,
  set,
  get,
  update,
  onValue,
  off,
  type Unsubscribe,
} from "firebase/database";
import { getFirebaseDb, ensureSignedIn } from "./firebase";
import { generateRoomCode } from "./roomCode";
import { pickRoundLocations } from "./locations";
import { distanceKm, scoreFromDistance } from "./scoring";
import {
  DEFAULT_SETTINGS,
  type LatLng,
  type Room,
  type RoomSettings,
} from "@/types/game";

const ROOM_TTL_MS = 1000 * 60 * 60 * 6; // 6 horas

/**
 * Crea una nueva sala en Firebase con el usuario actual como host.
 */
export async function createRoom(
  hostName: string,
  settings: Partial<RoomSettings> = {},
): Promise<string> {
  const uid = await ensureSignedIn();
  const db = getFirebaseDb();

  // Intenta hasta 5 veces si hay colisión de código (muy improbable)
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRoomCode();
    const roomRef = ref(db, `rooms/${code}`);
    const existing = await get(roomRef);
    if (existing.exists()) continue;

    const merged: RoomSettings = { ...DEFAULT_SETTINGS, ...settings };
    const room: Room = {
      code,
      hostId: uid,
      status: "lobby",
      currentRound: 0,
      settings: merged,
      players: {
        [uid]: {
          id: uid,
          name: hostName || "Anfitrión",
          isHost: true,
          joinedAt: Date.now(),
        },
      },
      rounds: {},
      totals: { [uid]: 0 },
      createdAt: Date.now(),
    };
    await set(roomRef, room);
    return code;
  }
  throw new Error("No se pudo generar un código de sala único.");
}

/**
 * Une al usuario a una sala existente.
 */
export async function joinRoom(code: string, playerName: string): Promise<void> {
  const uid = await ensureSignedIn();
  const db = getFirebaseDb();
  const normalized = code.trim().toUpperCase();
  const roomRef = ref(db, `rooms/${normalized}`);
  const snap = await get(roomRef);
  if (!snap.exists()) throw new Error("La sala no existe.");

  const room = snap.val() as Room;
  if (room.status !== "lobby") {
    // Si ya empezó, permitir reincorporarse si era jugador previo
    if (!room.players?.[uid]) {
      throw new Error("La partida ya ha comenzado.");
    }
  }
  if (Date.now() - room.createdAt > ROOM_TTL_MS) {
    throw new Error("Esta sala ha expirado.");
  }

  await update(ref(db, `rooms/${normalized}/players/${uid}`), {
    id: uid,
    name: playerName || "Jugador",
    isHost: room.hostId === uid,
    joinedAt: Date.now(),
  });
  await update(ref(db, `rooms/${normalized}/totals`), {
    [uid]: room.totals?.[uid] ?? 0,
  });
}

/**
 * Suscripción reactiva a los cambios de la sala.
 */
export function subscribeRoom(
  code: string,
  cb: (room: Room | null) => void,
): Unsubscribe {
  const db = getFirebaseDb();
  const roomRef = ref(db, `rooms/${code}`);
  const listener = onValue(roomRef, (snap) => {
    cb(snap.exists() ? (snap.val() as Room) : null);
  });
  return () => off(roomRef, "value", listener);
}

/**
 * Empieza la partida: genera las ubicaciones y lanza la primera ronda.
 * Solo el host debería llamar a esto.
 */
export async function startGame(code: string): Promise<void> {
  const db = getFirebaseDb();
  const roomRef = ref(db, `rooms/${code}`);
  const snap = await get(roomRef);
  if (!snap.exists()) throw new Error("La sala no existe.");
  const room = snap.val() as Room;

  const locations = pickRoundLocations(
    room.settings.region,
    room.settings.rounds,
  );
  const now = Date.now();
  const endsAt = now + room.settings.roundDurationSec * 1000;

  const rounds: Record<string, any> = {};
  locations.forEach((loc, i) => {
    rounds[`r${i}`] = {
      index: i,
      location: loc,
      startedAt: i === 0 ? now : 0,
      endsAt: i === 0 ? endsAt : 0,
      guesses: {},
    };
  });

  await update(roomRef, {
    status: "playing",
    currentRound: 0,
    rounds,
  });
}

/**
 * Envía la conjetura de un jugador para la ronda actual.
 */
export async function submitGuess(
  code: string,
  roundIndex: number,
  guess: LatLng,
): Promise<void> {
  const uid = await ensureSignedIn();
  const db = getFirebaseDb();
  const roomRef = ref(db, `rooms/${code}`);
  const snap = await get(roomRef);
  if (!snap.exists()) throw new Error("La sala no existe.");
  const room = snap.val() as Room;

  const round = room.rounds?.[`r${roundIndex}`];
  if (!round) throw new Error("La ronda no existe.");
  if (round.guesses?.[uid]) return; // ya envió, ignorar

  const km = distanceKm(guess, round.location);
  const score = scoreFromDistance(km);

  const updates: Record<string, any> = {};
  updates[`rounds/r${roundIndex}/guesses/${uid}`] = {
    playerId: uid,
    position: guess,
    distanceKm: km,
    score,
    submittedAt: Date.now(),
  };
  updates[`totals/${uid}`] = (room.totals?.[uid] ?? 0) + score;
  await update(roomRef, updates);
}

/**
 * Avanza a la fase de resultados de la ronda actual.
 * Lo llama el host cuando todos han enviado o se acabó el tiempo.
 */
export async function showRoundResults(code: string): Promise<void> {
  const db = getFirebaseDb();
  await update(ref(db, `rooms/${code}`), { status: "round-results" });
}

/**
 * Avanza a la siguiente ronda, o termina la partida si era la última.
 */
export async function nextRound(code: string): Promise<void> {
  const db = getFirebaseDb();
  const snap = await get(ref(db, `rooms/${code}`));
  if (!snap.exists()) return;
  const room = snap.val() as Room;
  const next = room.currentRound + 1;
  if (next >= room.settings.rounds) {
    await update(ref(db, `rooms/${code}`), { status: "finished" });
    return;
  }
  const now = Date.now();
  const endsAt = now + room.settings.roundDurationSec * 1000;
  await update(ref(db, `rooms/${code}`), {
    status: "playing",
    currentRound: next,
    [`rounds/r${next}/startedAt`]: now,
    [`rounds/r${next}/endsAt`]: endsAt,
  });
}

/**
 * Resetea la sala para una nueva partida con los mismos jugadores.
 */
export async function playAgain(code: string): Promise<void> {
  const db = getFirebaseDb();
  const snap = await get(ref(db, `rooms/${code}`));
  if (!snap.exists()) return;
  const room = snap.val() as Room;
  const totals: Record<string, number> = {};
  Object.keys(room.players ?? {}).forEach((id) => (totals[id] = 0));
  await update(ref(db, `rooms/${code}`), {
    status: "lobby",
    currentRound: 0,
    rounds: {},
    totals,
  });
}
