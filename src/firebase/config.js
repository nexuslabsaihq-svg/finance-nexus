import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Usamos import.meta.env en Vite, pero si fallback es necesario (Configuración Vía UI) los leemos del localStorage
const getLocalConfig = () => {
  try {
    const l = localStorage.getItem('fn_apikeys');
    return l ? JSON.parse(l) : {};
  } catch { return {}; }
};

const lkeys = getLocalConfig();

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || lkeys.VITE_FIREBASE_API_KEY)?.trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || lkeys.VITE_FIREBASE_AUTH_DOMAIN)?.trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || lkeys.VITE_FIREBASE_PROJECT_ID)?.trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || lkeys.VITE_FIREBASE_STORAGE_BUCKET)?.trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || lkeys.VITE_FIREBASE_MESSAGING_SENDER_ID)?.trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || lkeys.VITE_FIREBASE_APP_ID)?.trim()
};

export const HasKeys = !!(firebaseConfig.apiKey && firebaseConfig.projectId && (import.meta.env.VITE_GEMINI_API_KEY || lkeys.VITE_GEMINI_API_KEY)?.trim());

let app, auth, db, storage, provider;

if (HasKeys) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    provider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase config error:", error);
  }
}

export const GeminaKey = import.meta.env.VITE_GEMINI_API_KEY || lkeys.VITE_GEMINI_API_KEY;

export { app, auth, db, storage, provider };
