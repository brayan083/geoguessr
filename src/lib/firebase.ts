import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;

function ensureApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase solo se inicializa en el cliente.");
  }
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Faltan variables de entorno NEXT_PUBLIC_FIREBASE_*. Copia .env.local.example a .env.local y rellénalas.",
    );
  }
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(ensureApp());
  return auth;
}

export function getFirebaseDb(): Database {
  if (!db) db = getDatabase(ensureApp());
  return db;
}

/**
 * Garantiza que hay un usuario anónimo autenticado. Devuelve el uid.
 */
export async function ensureSignedIn(): Promise<string> {
  const a = getFirebaseAuth();
  if (a.currentUser) return a.currentUser.uid;
  const cred = await signInAnonymously(a);
  return cred.user.uid;
}
