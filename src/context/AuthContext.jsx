import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // 1. AÑADIR ESTADO DE CARGA

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const logOut = () => {
    signOut(auth).catch((error) => {
      console.error("[AuthContext] Error al cerrar sesión:", error);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("[AuthContext] Verificación de Auth terminada. Usuario:", currentUser);
      setUser(currentUser);
      setLoadingAuth(false); // 2. MARCAR LA CARGA COMO COMPLETADA
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // 3. EXPONER EL ESTADO DE CARGA Y EL USUARIO
    <AuthContext.Provider value={{ googleSignIn, logOut, user, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
