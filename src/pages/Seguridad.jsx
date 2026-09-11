import React from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Seguridad() {
  const { authUser, logout, privacyMode, setPrivacyMode, sesiones, closeAllSesiones, removeSesion } = useAppData();

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🔐 Seguridad y Privacidad</div>
          <div className="page-sub">Centro de control y auditoría de tu cuenta corporativa</div>
        </div>
        <div>
          <button 
            className={`btn ${privacyMode ? 'btn-p' : 'btn-gh'}`} 
            onClick={() => setPrivacyMode(!privacyMode)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {privacyMode ? '👁️ Desactivar Modo Privacidad' : '🕶️ Activar Modo Privacidad'}
          </button>
        </div>
      </div>

      <div className="g3" style={{ marginBottom: '20px' }}>
        <div className="sc sc-b" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="sc-label">Autenticación Activa</div>
          <div className="sc-val" style={{ color: 'var(--blue)', fontSize: '18px' }}>SSO OAuth 2.0</div>
          <div className="sc-change ch-p">Validado por Google</div>
          <div className="sc-icon">🛡️</div>
        </div>
        <div className="sc sc-g" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="sc-label">Encriptación de Datos</div>
          <div className="sc-val" style={{ color: 'var(--green)', fontSize: '18px' }}>AES-256 (Firestore)</div>
          <div className="sc-change ch-p">Cifrado en reposo</div>
          <div className="sc-icon">🔒</div>
        </div>
        <div className="sc sc-p" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="sc-label">Sesiones Activas</div>
          <div className="sc-val" style={{ color: 'var(--pink)', fontSize: '18px' }}>{sesiones.length} Dispositivo(s)</div>
          <div className="sc-change ch-n" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={closeAllSesiones}>Cerrar otras sesiones</div>
          <div className="sc-icon">💻</div>
        </div>
      </div>

      <div className="alert al-b" style={{ marginBottom: '20px' }}>
        <span className="al-icon">ℹ️</span>
        <div className="al-body">
          <div className="al-title" style={{ color: 'var(--blue)' }}>Identidad Administrada por Google</div>
          La gestión de contraseñas, recuperación de cuentas y Doble Factor de Autenticación (2FA) está delegada a la infraestructura segura de Google. No almacenamos credenciales directas.
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: '1 1 400px' }}>
          <div className="card-hdr">
            <div><div className="card-title">👤 Perfil de Autenticación</div><div className="card-sub">Credenciales y proveedor actual</div></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text)', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--surface2)', padding: '15px', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface3)', overflow: 'hidden' }}>
                {authUser?.photoURL ? <img src={authUser.photoURL} alt="User" style={{ width: '100%', height: '100%' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{authUser?.displayName || 'Usuario Corporativo'}</div>
                <div style={{ color: 'var(--text2)' }}>{authUser?.email || 'No disponible'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text2)' }}>Proveedor</span>
              <span className="badge bg">Google Workspace / Gmail</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text2)' }}>Estado de Cuenta</span>
              <span className="badge bg">Verificada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text2)' }}>Modo Privacidad</span>
              <span className={`badge ${privacyMode ? 'bg' : 'bp'}`}>{privacyMode ? 'Activo (Blur aplicado)' : 'Inactivo'}</span>
            </div>
          </div>
          <button className="btn btn-d" style={{ marginTop: '20px', width: '100%' }} onClick={logout}>🚪 Cerrar Sesión y Revocar Tokens</button>
        </div>

        <div className="card" style={{ flex: '1 1 400px' }}>
          <div className="card-hdr">
            <div><div className="card-title">📱 Dispositivos y Sesiones</div><div className="card-sub">Historial de accesos recientes</div></div>
          </div>
          <div className="tl-group">
            {sesiones.map((s, idx) => (
              <div key={idx} className="tl-item">
                <div className="tl-dot" style={{ background: s.current ? 'rgba(52,211,153,0.15)' : 'rgba(107,127,214,0.15)' }}>
                  {s.current ? '✅' : '📱'}
                </div>
                <div style={{ flex: '1' }}>
                  <div className="tl-title">{s.device} {s.current && <span className="badge bg" style={{marginLeft: '8px'}}>Sesión Actual</span>}</div>
                  <div className="tl-meta">IP: {s.ip} · {s.location}</div>
                </div>
                {!s.current && (
                  <button className="btn btn-d btn-sm" onClick={() => removeSesion(s.id)}>Revocar</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
