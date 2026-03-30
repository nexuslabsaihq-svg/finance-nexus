import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Seguridad() {
  const { sesiones, removeSesion, closeAllSesiones, logout } = useAppData();
  
  const [passForm, setPassForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [msg, setMsg] = useState(null);

  const handleChangePassword = () => {
    if (!passForm.actual || !passForm.nueva || !passForm.confirmar) {
      setMsg({ type: 'pink', text: 'Por favor completa todos los campos' });
      return;
    }
    if (passForm.nueva !== passForm.confirmar) {
      setMsg({ type: 'pink', text: 'Las nuevas contraseñas no coinciden' });
      return;
    }
    // Mock save
    setMsg({ type: 'green', text: 'Contraseña actualizada correctamente' });
    setPassForm({ actual: '', nueva: '', confirmar: '' });
    setTimeout(() => setMsg(null), 3000);
  };

  const activeCount = sesiones.length;
  const currentSession = sesiones.find(s => s.current);

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🔐 Seguridad</div>
          <div className="page-sub">Protección y privacidad de tu cuenta</div>
        </div>
      </div>
      
      <div className="alert al-g">
        <span className="al-icon">🛡️</span>
        <div className="al-body">
          <div className="al-title" style={{color:"var(--green)"}}>Tu cuenta está segura</div>
          2FA habilitado · Datos encriptados con AES-256 · {currentSession ? `IP: ${currentSession.ip}` : ''}
        </div>
      </div>
      
      <div className="g2">
        <div className="card">
          <div className="card-hdr"><div className="card-title">🔑 Cambiar Contraseña</div></div>
          {msg && <div className={`alert al-${msg.type === 'pink' ? 'p' : 'g'}`} style={{marginBottom:"10px", padding:"10px"}}>{msg.text}</div>}
          <div className="fg">
            <div className="fgrp"><label className="flbl">Contraseña Actual</label><input className="finp" type="password" placeholder="••••••••" value={passForm.actual} onChange={e => setPassForm({...passForm, actual: e.target.value})} /></div>
            <div className="fgrp"><label className="flbl">Nueva Contraseña</label><input className="finp" type="password" placeholder="••••••••" value={passForm.nueva} onChange={e => setPassForm({...passForm, nueva: e.target.value})} /></div>
            <div className="fgrp"><label className="flbl">Confirmar Nueva</label><input className="finp" type="password" placeholder="••••••••" value={passForm.confirmar} onChange={e => setPassForm({...passForm, confirmar: e.target.value})} /></div>
          </div>
          <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
            <button className="btn btn-o" onClick={handleChangePassword}>🔒 Actualizar</button>
            <button className="btn btn-gh" onClick={() => {setPassForm({actual:'',nueva:'',confirmar:''}); setMsg(null)}}>Cancelar</button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-hdr"><div className="card-title">📱 Autenticación 2FA</div></div>
          <div className="alert al-g" style={{marginBottom:"14px"}}><span className="al-icon">✅</span><div className="al-body">Habilitado · Google Authenticator</div></div>
          <button className="btn btn-gh" style={{marginBottom:"20px"}}>🔄 Cambiar Método</button>
          
          <div className="card-hdr" style={{marginBottom:"10px"}}>
            <div className="card-title">💻 Sesiones Activas ({activeCount})</div>
            {activeCount > 1 && <button className="btn btn-d btn-sm" onClick={closeAllSesiones}>Cerrar Todas</button>}
          </div>
          
          {sesiones.map(s => {
            const icon = s.device.toLowerCase().includes('iphone') || s.device.toLowerCase().includes('android') ? '📱' : '💻';
            return (
              <div key={s.id} className="ses-row" style={{display:'flex', gap:'12px', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:"20px"}}>{icon}</span>
                <div style={{flex:"1"}}>
                  <div className="ses-device" style={{fontSize:"13.5px", fontWeight:"600"}}>{s.device} {s.current && <span className="badge bg" style={{marginLeft:"6px"}}>AQUÍ</span>}</div>
                  <div className="ses-meta" style={{fontSize:"12px", color:"var(--text2)"}}>{s.location} · {s.ip}</div>
                </div>
                {!s.current && <button className="btn btn-d btn-sm" onClick={() => removeSesion(s.id)}>Cerrar</button>}
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">🔒 Privacidad y Políticas</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          <a style={{fontSize:"13px",color:"var(--blue)",cursor:"pointer"}}>→ Política de Privacidad</a>
          <a style={{fontSize:"13px",color:"var(--blue)",cursor:"pointer"}}>→ Términos de Servicio</a>
          <a style={{fontSize:"13px",color:"var(--blue)",cursor:"pointer"}}>→ Política de Seguridad de Datos</a>
          <a style={{fontSize:"13px",color:"var(--blue)",cursor:"pointer"}}>→ Centro de Ayuda</a>
        </div>
      </div>
      
      <div className="dzone" style={{border:"1px solid var(--pink)", background:"rgba(232, 93, 117, 0.05)", padding:"16px", borderRadius:"12px"}}>
        <div className="dz-title" style={{color:"var(--pink)", fontWeight:"700", marginBottom:"6px"}}>⚠️ Zona de Peligro</div>
        <div className="dz-desc" style={{fontSize:"13px", color:"var(--text2)", marginBottom:"14px"}}>Estas acciones son irreversibles. Procede con extrema precaución.</div>
        <div style={{display:"flex",gap:"10px"}}>
          <button className="btn btn-d">⬇️ Descargar Mis Datos</button>
          <button className="btn btn-d" onClick={() => {
            if(window.confirm('¿Seguro que quieres borrar todos tus datos de forma irreversible?')) {
              logout();
            }
          }}>🗑️ Eliminar Cuenta</button>
        </div>
      </div>
    </div>
  );
}
