import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { auth, db, provider, HasKeys } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, signOut, getRedirectResult } from "firebase/auth";
import { doc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, collectionGroup, query, where } from "firebase/firestore";

// Captura silenciosamente el resultado fantasma de un redirect anterior desde la barra de direcciones para evitar el error de 'missing initial state'
getRedirectResult(auth).catch(() => {});

const AppDataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => useContext(AppDataContext);

// ============================================================
// CUENTAS COLABORATIVAS — roles y utilidades
// ============================================================
const ROLES = { EDITOR: 'editor', VIEWER: 'viewer' };
const WORKSPACE_STORAGE_PREFIX = 'fn_active_workspace_';
const normalizeEmail = (email) => (email || '').trim().toLowerCase();

export const AppDataProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [period, setPeriod] = useState('Marzo');

  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // CAPA DE SEGURIDAD 1: Modo Privacidad Anti-Shoulder Surfing
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    if (privacyMode) {
      document.body.classList.add('privacy-mode');
    } else {
      document.body.classList.remove('privacy-mode');
    }
  }, [privacyMode]);

  // Todas las invitaciones/colaboraciones (de cualquier dueño) dirigidas a mi correo
  const [myMemberships, setMyMemberships] = useState([]);
  const [membershipsLoaded, setMembershipsLoaded] = useState(false);

  // Colaboradores que YO (como dueño) he invitado a mi propia cuenta
  const [ownedCollaborators, setOwnedCollaborators] = useState([]);

  const [activeWorkspaceUid, setActiveWorkspaceUidState] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Escucha en tiempo real cualquier colaboración (users/*/collaborators) cuyo email me pertenezca
  useEffect(() => {
    if (!authUser?.email || !db) {
      setMyMemberships([]);
      setMembershipsLoaded(true);
      return;
    }
    setMembershipsLoaded(false);
    const myEmail = normalizeEmail(authUser.email);
    const q = query(collectionGroup(db, 'collaborators'), where('email', '==', myEmail));
    const unsub = onSnapshot(q, (snap) => {
      const rows = [];
      snap.forEach((d) => {
        const ownerUid = d.ref.parent.parent?.id;
        if (ownerUid) rows.push({ id: d.id, ownerUid, ...d.data() });
      });
      setMyMemberships(rows);
      setMembershipsLoaded(true);
    }, () => {
      setMyMemberships([]);
      setMembershipsLoaded(true);
    });
    return () => unsub();
  }, [authUser?.email]);

  // Escucha en tiempo real la lista de colaboradores que yo mismo he invitado
  useEffect(() => {
    if (!authUser?.uid || !db) {
      setOwnedCollaborators([]);
      return;
    }
    const unsub = onSnapshot(collection(db, 'users', authUser.uid, 'collaborators'), (snap) => {
      const rows = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
      setOwnedCollaborators(rows);
    }, () => setOwnedCollaborators([]));
    return () => unsub();
  }, [authUser?.uid]);

  // Membresías activas (invitación aceptada) y pendientes (esperando mi respuesta)
  const activeMemberships = useMemo(
    () => myMemberships.filter((m) => m.status === 'active'),
    [myMemberships]
  );
  const pendingInvitations = useMemo(
    () => myMemberships.filter((m) => m.status === 'pending'),
    [myMemberships]
  );

  // Espacios de trabajo disponibles para el usuario: el propio + cuentas compartidas activas
  const workspaces = useMemo(() => {
    if (!authUser) return [];
    const own = { uid: authUser.uid, role: 'owner', isOwner: true, label: 'Mi cuenta', email: authUser.email };
    const shared = activeMemberships.map((m) => ({
      uid: m.ownerUid,
      role: m.role === ROLES.EDITOR ? ROLES.EDITOR : ROLES.VIEWER,
      isOwner: false,
      label: m.ownerName || m.ownerEmail || 'Cuenta compartida',
      email: m.ownerEmail,
    }));
    return [own, ...shared];
  }, [authUser, activeMemberships]);

  // Restaura la preferencia de espacio de trabajo activo (por usuario) y valida que siga siendo válida
  useEffect(() => {
    if (!authUser) {
      setActiveWorkspaceUidState(null);
      return;
    }
    if (!membershipsLoaded) return;
    let stored = null;
    try {
      stored = window.localStorage.getItem(`${WORKSPACE_STORAGE_PREFIX}${authUser.uid}`);
    } catch {
      stored = null;
    }
    const isValid = stored && workspaces.some((w) => w.uid === stored);
    setActiveWorkspaceUidState(isValid ? stored : authUser.uid);
  }, [authUser, membershipsLoaded, workspaces]);

  const activeUid = activeWorkspaceUid;

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.uid === activeUid) || null,
    [workspaces, activeUid]
  );

  const myRole = activeWorkspace?.role || 'owner';
  const isOwnerWorkspace = !activeWorkspace || activeWorkspace.isOwner;
  const isViewer = !isOwnerWorkspace && myRole === ROLES.VIEWER;
  const isEditor = isOwnerWorkspace || myRole === ROLES.EDITOR;

  const switchWorkspace = useCallback((uid) => {
    if (!authUser || !uid) return;
    setActiveWorkspaceUidState(uid);
    try {
      window.localStorage.setItem(`${WORKSPACE_STORAGE_PREFIX}${authUser.uid}`, uid);
    } catch { /* almacenamiento no disponible, ignorar */ }
  }, [authUser]);

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      if (!auth || !provider) {
        throw new Error("Firebase no está inicializado. Verifica que las variables de entorno de Firebase estén configuradas.");
      }
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (e) {
      setAuthError(e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      // 1. Cerrar sesión en Firebase Auth
      await signOut(auth);
      
      // 2. Limpiar localStorage completamente
      window.localStorage.clear();
      
      // 3. Limpiar sessionStorage
      window.sessionStorage.clear();
      
      // 4. Forzar recarga limpia (esto resetea todos los estados de React)
      window.location.href = '/';
    } catch(e) {
      console.error('[Finance Nexus] Error en logout:', e);
      // Si falla, igual recargar para limpiar estados
      window.location.href = '/';
    }
  };

  // ============================================================
  // GESTIÓN DE COLABORADORES (como dueño de la cuenta)
  // ============================================================
  const inviteCollaborator = useCallback(async (email, role = ROLES.VIEWER) => {
    if (!authUser) throw new Error('Debes iniciar sesión.');
    const normalized = normalizeEmail(email);
    if (!normalized || !normalized.includes('@')) throw new Error('Ingresa un correo electrónico válido.');
    if (normalized === normalizeEmail(authUser.email)) throw new Error('No puedes invitarte a ti mismo.');
    const safeRole = role === ROLES.EDITOR ? ROLES.EDITOR : ROLES.VIEWER;
    await setDoc(doc(db, 'users', authUser.uid, 'collaborators', normalized), {
      email: normalized,
      role: safeRole,
      status: 'pending',
      ownerUid: authUser.uid,
      ownerName: authUser.displayName || '',
      ownerEmail: normalizeEmail(authUser.email),
      invitedAt: new Date().toISOString(),
      respondedAt: null,
      uid: null,
    });
  }, [authUser]);

  const updateCollaboratorRole = useCallback(async (collabId, role) => {
    if (!authUser) return;
    const safeRole = role === ROLES.EDITOR ? ROLES.EDITOR : ROLES.VIEWER;
    await updateDoc(doc(db, 'users', authUser.uid, 'collaborators', collabId), { role: safeRole });
  }, [authUser]);

  const removeCollaborator = useCallback(async (collabId) => {
    if (!authUser) return;
    await deleteDoc(doc(db, 'users', authUser.uid, 'collaborators', collabId));
  }, [authUser]);

  // ============================================================
  // RESPUESTA A INVITACIONES (como colaborador invitado)
  // ============================================================
  const acceptInvitation = useCallback(async (ownerUid) => {
    if (!authUser?.email) return;
    const collabId = normalizeEmail(authUser.email);
    await updateDoc(doc(db, 'users', ownerUid, 'collaborators', collabId), {
      status: 'active',
      uid: authUser.uid,
      respondedAt: new Date().toISOString(),
    });
    switchWorkspace(ownerUid);
  }, [authUser, switchWorkspace]);

  const rejectInvitation = useCallback(async (ownerUid) => {
    if (!authUser?.email) return;
    const collabId = normalizeEmail(authUser.email);
    await deleteDoc(doc(db, 'users', ownerUid, 'collaborators', collabId));
  }, [authUser]);

  const leaveWorkspace = useCallback(async (ownerUid) => {
    if (!authUser?.email) return;
    const collabId = normalizeEmail(authUser.email);
    await deleteDoc(doc(db, 'users', ownerUid, 'collaborators', collabId));
    if (activeUid === ownerUid) switchWorkspace(authUser.uid);
  }, [authUser, activeUid, switchWorkspace]);

  const useFirestoreState = (key, initialValue) => {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
      if (!activeUid) {
        // [AUDITORÍA DE SEGURIDAD]: Aniquilación de datos al cerrar sesión.
        // Si no hay usuario activo, el estado local vuelve a su valor inicial. Nada queda en caché.
        setState(initialValue);
        return;
      }
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
              if (!isViewer) setDoc(docRef, { data: parsed }).catch(console.error);
              window.localStorage.removeItem(key); // Sanitize local storage
            } catch {
              if (!isViewer) setDoc(docRef, { data: initialValue }).catch(console.error);
            }
          } else {
            if (!isViewer) setDoc(docRef, { data: initialValue }).catch(console.error);
          }
        }
      });
      return () => unsubscribe();
    }, [activeUid, key, isViewer]);

    const setPersistentState = (newValueOrFn) => {
      setState(prev => {
        const newVal = typeof newValueOrFn === 'function' ? newValueOrFn(prev) : newValueOrFn;
        if (activeUid && !isViewer) {
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

  const [ingresos, setIngresos] = useFirestoreState('fn_ingresos', []);

  const [gastos, setGastos] = useFirestoreState('fn_gastos', []);

  const [transferencias, setTransferencias] = useFirestoreState('fn_transferencias', []);
  const [bancos, setBancos] = useFirestoreState('fn_bancos', []);
  const [ahorros, setAhorros] = useFirestoreState('fn_ahorros', []);
  const [inversiones, setInversiones] = useFirestoreState('fn_inversiones', []);
  const [deudas, setDeudas] = useFirestoreState('fn_deudas', []);
  const [presupuestos, setPresupuestos] = useFirestoreState('fn_presupuestos', []);
  const [chatsIA, setChatsIA] = useFirestoreState('fn_chatsIA', [
    { id: 1, role: 'assistant', content: '¡Hola! Soy tu asistente financiero impulsado por IA. ¿En qué te puedo ayudar hoy?', time: new Date().toISOString() }
  ]);
  const [notificaciones, setNotificaciones] = useFirestoreState('fn_notifs', []);
  const [configuracion, setConfiguracion] = useFirestoreState('fn_config', {
    tema: 'dark', moneda: 'CLP', notifEmail: true, notifPush: true,
    geminiApiKey: '', // Clave BYOK para la IA
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
    privacyMode, setPrivacyMode,
    usuario, setUsuario, ingresos, setIngresos,
    gastos, setGastos, transferencias, setTransferencias,
    bancos, setBancos, ahorros, setAhorros,
    inversiones, setInversiones, deudas, setDeudas,
    presupuestos, setPresupuestos, chatsIA, setChatsIA,
    notificaciones, setNotificaciones, configuracion, setConfiguracion,
    sesiones, setSesiones, removeSesion, closeAllSesiones,
    // Cuentas colaborativas / espacios de trabajo compartidos
    workspaces, activeWorkspace, myRole, isOwnerWorkspace, isViewer, isEditor,
    switchWorkspace, pendingInvitations, ownedCollaborators,
    inviteCollaborator, updateCollaboratorRole, removeCollaborator,
    acceptInvitation, rejectInvitation, leaveWorkspace,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
