import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';

// Tiempo de inactividad antes de bloquear (en milisegundos)
// 5 minutos = 300000 ms, 10 minutos = 600000 ms
const INACTIVITY_TIMEOUT = 300000; // 5 minutos

export default function LockScreen({ children }) {
  const { logout, authUser } = useAppData();
  const [isLocked, setIsLocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // Función para resetear el temporizador de inactividad
  const resetTimer = useCallback(() => {
    if (!authUser || isLocked) return;

    // Limpiar temporizadores existentes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    // Mostrar advertencia 30 segundos antes del bloqueo
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, INACTIVITY_TIMEOUT - 30000); // 30 segundos antes

    // Bloquear después del tiempo de inactividad
    timeoutRef.current = setTimeout(() => {
      setIsLocked(true);
      setShowWarning(false);
      // Ejecutar Hard Logout después de 5 segundos de bloqueo
      setTimeout(async () => {
        await logout();
      }, 5000);
    }, INACTIVITY_TIMEOUT);
  }, [authUser, isLocked, logout]);

  // Escuchar eventos de actividad del usuario
  useEffect(() => {
    if (!authUser) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Iniciar temporizador al montar
    resetTimer();

    // Limpiar al desmontar
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [authUser, resetTimer]);

  // Pantalla de bloqueo
  if (isLocked) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text)'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔒</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
            Sesión bloqueada por inactividad
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>
            Tu sesión se cerrará automáticamente por seguridad.
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
            Redirigiendo a la página de inicio...
          </div>
        </div>
      </div>
    );
  }

  // Advertencia de bloqueo inminente
  if (showWarning) {
    return (
      <>
        {children}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--orange)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 9998,
          fontSize: '13px',
          fontWeight: '600',
          animation: 'slideIn 0.3s ease'
        }}>
          ⚠️ Sesión a punto de bloquearse por inactividad
        </div>
      </>
    );
  }

  // Normal: renderizar la aplicación
  return <>{children}</>;
}
