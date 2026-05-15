export interface LatLng {
  lat: number;
  lng: number;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

export interface Guess {
  playerId: string;
  position: LatLng;
  distanceKm: number;
  score: number;
  submittedAt: number;
}

export interface Round {
  index: number;
  location: LatLng;
  panoId: string;
  startedAt: number;
  endsAt: number;
  guesses: Record<string, Guess>;
}

export type RoomStatus =
  | "lobby"
  | "playing"
  | "round-results"
  | "finished";

export interface RoomSettings {
  rounds: number;
  roundDurationSec: number;
  allowMove: boolean;
  allowZoom: boolean;
}

export interface Room {
  code: string;
  hostId: string;
  status: RoomStatus;
  currentRound: number;
  settings: RoomSettings;
  players: Record<string, Player>;
  rounds: Record<string, Round>;
  totals: Record<string, number>; // playerId -> total score
  createdAt: number;
}

export const DEFAULT_SETTINGS: RoomSettings = {
  rounds: 5,
  roundDurationSec: 60,
  allowMove: true,
  allowZoom: true,
};
