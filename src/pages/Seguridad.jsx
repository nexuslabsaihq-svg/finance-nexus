import React from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Seguridad() {
  const { authUser, logout } = useAppData();

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🔐 Seguridad</div>
          <div className="page-sub">Información sobre el acceso de tu cuenta</div>
        </div>
      </div>

      <div className="alert al-b">
        <span className="al-icon">ℹ️</span>
        <div className="al-body">
          <div className="al-title" style={{ color: 'var(--blue)' }}>Administrado por Google</div>
          Esta aplicación usa el proveedor de acceso con el que iniciaste sesión. No administra contraseñas, 2FA ni sesiones de dispositivos.
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">👤 Sesión actual</div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text2)', fontSize: '13px' }}>
          <div><strong style={{ color: 'var(--text)' }}>Cuenta:</strong> {authUser?.email || 'No disponible'}</div>
          <div>Gestiona contraseña, métodos de acceso y actividad de dispositivos desde tu cuenta de Google.</div>
        </div>
        <button className="btn btn-d" style={{ marginTop: '16px' }} onClick={logout}>🚪 Cerrar sesión</button>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">🚧 Funcionalidades no disponibles</div></div>
        <div style={{ color: 'var(--text2)', fontSize: '13px', lineHeight: '1.6' }}>
          La gestión de 2FA, contraseñas, sesiones, exportación de datos y eliminación de cuenta aún no está implementada en Finance Nexus.
        </div>
      </div>
    </div>
  );
}
