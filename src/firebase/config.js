import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ================================================================
// CONFIGURACIÓN SEGURA — Finance Nexus
// Las credenciales se leen SOLO desde variables de entorno Vite.
// NUNCA desde localStorage ni código hardcodeado.
// Configura el archivo .env en la raíz del proyecto.
// ================================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// HasKeys: true si todas las variables críticas de Firebase + Gemini están presentes
export const HasKeys = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  import.meta.env.VITE_GEMINI_API_KEY
);

// Clave de Gemini AI (solo para uso en llamadas a la API del lado del cliente)
export const GeminaKey = import.meta.env.VITE_GEMINI_API_KEY || null;

let app, auth, db, storage, provider;

if (HasKeys) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    provider = new GoogleAuthProvider();
  } catch (error) {
    console.error("[Finance Nexus] Error al inicializar Firebase:", error.message);
  }
}

export { app, auth, db, storage, provider };
