import React, { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function AuthGuard({ children }) {
  const { authUser, authLoading } = useAppData();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setIsAuthorized(!!authUser);
    }
  }, [authUser, authLoading]);

  // Mientras Firebase verifica la autenticación
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--surface)',
        color: 'var(--text)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔐</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>Verificando sesión...</div>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '8px' }}>Finance Nexus</div>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar pantalla de acceso denegado
  if (!isAuthorized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--surface)',
        color: 'var(--text)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🚫</div>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Acceso no autorizado</div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>
            Debes iniciar sesión para acceder a Finance Nexus.
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
            Si ves esta pantalla, la sesión expiró o no está autenticada.
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado: renderizar la aplicación
  return <>{children}</>;
}
