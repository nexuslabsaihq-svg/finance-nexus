
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db, provider } from '../firebase/config'; // HasKeys ya no es necesario
import { onAuthStateChanged, signInWithPopup, signOut, getRedirectResult } from "firebase/auth";
import { doc, setDoc, onSnapshot, collectionGroup, query, where, getDocs } from "firebase/firestore";

getRedirectResult(auth).catch(() => {});

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [period, setPeriod] = useState('Marzo');
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeUid, setActiveUid] = useState(null);

  useEffect(() => {
    // Se elimina la comprobación de HasKeys. 
    // Si las credenciales son incorrectas, la aplicación fallará, 
    // lo que es el comportamiento esperado.
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthUser(u);
      if (u && u.email) {
        try {
          const q = query(collectionGroup(db, 'collaborators'), where('email', '==', u.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setActiveUid(snap.docs[0].ref.parent.parent.id);
          } else {
            setActiveUid(u.uid);
          }
        } catch {
          setActiveUid(u.uid);
        }
      } else {
        setActiveUid(null);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, provider);
    } catch (e) {
      setAuthError(e.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch(e) { console.error(e); }
  };

  const useFirestoreState = (key, initialValue) => {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
      if (!activeUid) return;
      const docRef = doc(db, 'users', activeUid, 'appData', key);
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          setState(snap.data().data);
        } else {
          setDoc(docRef, { data: initialValue });
        }
      });
      return () => unsubscribe();
    }, [authUser, key]);

    const setPersistentState = (newValueOrFn) => {
      setState(prev => {
        const newVal = typeof newValueOrFn === 'function' ? newValueOrFn(prev) : newValueOrFn;
        if (activeUid) {
          setDoc(doc(db, 'users', activeUid, 'appData', key), { data: newVal }).catch(console.error);
        }
        return newVal;
      });
    };

    return [state, setPersistentState];
  };

  const [usuario, setUsuario] = useFirestoreState('fn_usuario', {
    nombre: authUser?.displayName?.split(' ')[0] || 'Usuario', apellidos: authUser?.displayName?.split(' ').slice(1).join(' ') || '', email: authUser?.email || '', telefono: '+56 9 1234 5678', plan: 'PRO', foto: authUser?.photoURL || null
  });

  const [ingresos, setIngresos] = useFirestoreState('fn_ingresos', []);
  const [gastos, setGastos] = useFirestoreState('fn_gastos', []);
  const [transferencias, setTransferencias] = useFirestoreState('fn_transferencias', []);
  const [bancos, setBancos] = useFirestoreState('fn_bancos', []);
  const [ahorros, setAhorros] = useFirestoreState('fn_ahorros', []);
  const [inversiones, setInversiones] = useFirestoreState('fn_inversiones', []);
  const [deudas, setDeudas] = useFirestoreState('fn_deudas', []);
  const [presupuestos, setPresupuestos] = useFirestoreState('fn_presupuestos', []);
  const [chatsIA, setChatsIA] = useFirestoreState('fn_chatsIA', []);
  const [notificaciones, setNotificaciones] = useFirestoreState('fn_notifs', []);
  const [configuracion, setConfiguracion] = useFirestoreState('fn_config', {});
  const [sesiones, setSesiones] = useFirestoreState('fn_sesiones', []);

  useEffect(() => {
    if (configuracion?.tema) {
      document.documentElement.setAttribute('data-theme', configuracion.tema);
    }
  }, [configuracion?.tema]);

  const removeSesion = (id) => setSesiones(prev => prev.filter(s => s.id !== id));
  const closeAllSesiones = () => setSesiones(prev => prev.filter(s => s.current));

  const value = {
    authLoading, authUser, activeUid, authError, loginWithGoogle, logout,
    activePage, setActivePage, period, setPeriod, usuario, setUsuario, ingresos, setIngresos,
    gastos, setGastos, transferencias, setTransferencias, bancos, setBancos, ahorros, setAhorros,
    inversiones, setInversiones, deudas, setDeudas, presupuestos, setPresupuestos, chatsIA, setChatsIA,
    notificaciones, setNotificaciones, configuracion, setConfiguracion, sesiones, setSesiones, 
    removeSesion, closeAllSesiones
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
