import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db, provider, HasKeys } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, signOut, getRedirectResult } from "firebase/auth";
import { doc, setDoc, onSnapshot, collectionGroup, query, where, getDocs } from "firebase/firestore";

// Captura silenciosamente el resultado fantasma de un redirect anterior desde la barra de direcciones para evitar el error de 'missing initial state'
getRedirectResult(auth).catch(() => {});


const AppDataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [period, setPeriod] = useState('Marzo');
  
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [activeUid, setActiveUid] = useState(null);

  useEffect(() => {
    if (!HasKeys) {
      setAuthLoading(false);
      return;
    }

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
      // Removed localStorage resets since it's driven by Firestore now
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
          // Automatic Migration Layer
          const legacy = window.localStorage.getItem(key);
          if (legacy) {
            try {
              const parsed = JSON.parse(legacy);
              setState(parsed);
              setDoc(docRef, { data: parsed });
              window.localStorage.removeItem(key);
            } catch {
              setDoc(docRef, { data: initialValue });
            }
          } else {
            setDoc(docRef, { data: initialValue });
          }
        }
      });
      return () => unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // State hooks
  const [usuario, setUsuario] = useFirestoreState('fn_usuario', {
    nombre: authUser?.displayName?.split(' ')[0] || 'Usuario', apellidos: authUser?.displayName?.split(' ').slice(1).join(' ') || '', email: authUser?.email || '', telefono: '+56 9 1234 5678', plan: 'PRO', foto: authUser?.photoURL || null
  });

  const [ingresos, setIngresos] = useFirestoreState('fn_ingresos', [
    { id: 1, desc: 'Salario mensual', cat: 'Salario', monto: 2500000, fecha: '2025-03-01', fuente: 'Santander', notas: '' },
    { id: 2, desc: 'Proyecto freelance', cat: 'Freelance', monto: 450000, fecha: '2025-03-10', fuente: 'Transferencia', notas: '' }
  ]);

  const [gastos, setGastos] = useFirestoreState('fn_gastos', [
    { id: 1, desc: 'Arriendo', cat: 'Vivienda', monto: 800000, fecha: '2025-03-01', cuenta: 'Santander', notas: '' }
  ]);

  const [transferencias, setTransferencias] = useFirestoreState('fn_transferencias', []);
  const [bancos, setBancos] = useFirestoreState('fn_bancos', [
    { id: 1, nombre: 'Banco Santander', tipo: 'Corriente', saldo: 1452230, numero: '**** 5678', moneda: 'CLP' }
  ]);
  const [ahorros, setAhorros] = useFirestoreState('fn_ahorros', [
    { id: 1, nombre: 'Vivienda', objetivo: 50000000, actual: 12500000, color: 'var(--orange)' }
  ]);
  const [inversiones, setInversiones] = useFirestoreState('fn_inversiones', []);
  const [deudas, setDeudas] = useFirestoreState('fn_deudas', []);
  const [presupuestos, setPresupuestos] = useFirestoreState('fn_presupuestos', []);
  const [chatsIA, setChatsIA] = useFirestoreState('fn_chatsIA', [
    { id: 1, role: 'assistant', content: '¡Hola! Soy tu asistente financiero impulsado por IA. ¿En qué te puedo ayudar hoy?', time: new Date().toISOString() }
  ]);
  const [notificaciones, setNotificaciones] = useFirestoreState('fn_notifs', []);
  const [configuracion, setConfiguracion] = useFirestoreState('fn_config', {
    tema: 'dark', moneda: 'CLP', notifEmail: true, notifPush: true,
    categorias: ['Salario', 'Freelance', 'Inversión', 'Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Ocio', 'Salud', 'Educación']
  });
  const [sesiones, setSesiones] = useFirestoreState('fn_sesiones', [
    { id: 1, device: 'MacBook Pro - Chrome', ip: '190.168.1.45', location: 'Santiago, CL', current: true }
  ]);

  useEffect(() => {
    if (configuracion?.tema) {
      document.documentElement.setAttribute('data-theme', configuracion.tema);
    }
  }, [configuracion?.tema]);

  const removeSesion = (id) => setSesiones(prev => prev.filter(s => s.id !== id));
  const closeAllSesiones = () => setSesiones(prev => prev.filter(s => s.current));

  const value = {
    HasKeys, authLoading, authUser, activeUid, authError, loginWithGoogle, logout,
    activePage, setActivePage, period, setPeriod,
    usuario, setUsuario, ingresos, setIngresos,
    gastos, setGastos, transferencias, setTransferencias,
    bancos, setBancos, ahorros, setAhorros,
    inversiones, setInversiones, deudas, setDeudas,
    presupuestos, setPresupuestos, chatsIA, setChatsIA,
    notificaciones, setNotificaciones, configuracion, setConfiguracion,
    sesiones, setSesiones, removeSesion, closeAllSesiones
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
