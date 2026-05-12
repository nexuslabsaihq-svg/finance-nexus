
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase exclusivamente desde variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, db, storage, provider;

// Se intenta inicializar Firebase. Si las claves no están en el entorno, 
// la app fallará y mostrará un error claro en la consola.
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  provider = new GoogleAuthProvider();
} catch (error) {
  console.error("Error de configuración de Firebase. Asegúrate de que tus variables de entorno (.env) estén correctamente configuradas.", error);
}

// Exporta la clave de Gemini
export const GeminaKey = import.meta.env.VITE_GEMINI_API_KEY;

// No se necesita `HasKeys` ya que la configuración es obligatoria.
// Si las claves no están, la inicialización fallará, lo cual es el comportamiento esperado.

export { app, auth, db, storage, provider };
