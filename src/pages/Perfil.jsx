import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

const ROLE_LABEL = { editor: 'Editor', viewer: 'Solo Lectura' };

export default function Perfil() {
  const {
    usuario, setUsuario, configuracion, setConfiguracion, ahorros, deudas, authUser, activeUid,
    workspaces, switchWorkspace, isOwnerWorkspace,
    pendingInvitations, acceptInvitation, rejectInvitation, leaveWorkspace,
    ownedCollaborators, inviteCollaborator, updateCollaboratorRole, removeCollaborator,
  } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...usuario });
  const [showColabModal, setShowColabModal] = useState(false);
  const [colabForm, setColabForm] = useState({ email: '', role: 'viewer' });
  const [colabError, setColabError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const tasaAhorro = 34.4; // Mock calculation metric
  const metas = ahorros.length;
  
  const handleSave = () => {
    setUsuario(form);
    setIsEditing(false);
  };

  const updateConfig = (field, value) => {
    setConfiguracion(prev => ({ ...prev, [field]: value }));
  };

  const addCollaborator = async () => {
    setColabError('');
    try {
      await inviteCollaborator(colabForm.email, colabForm.role);
      setShowColabModal(false);
      setColabForm({ email: '', role: 'viewer' });
    } catch (e) {
      setColabError(e.message || 'No se pudo enviar la invitación.');
    }
  };

  const handleRemoveCollaborator = async (id) => {
    if (window.confirm('¿Revocar el acceso de este colaborador?')) {
      setBusyId(id);
      try { await removeCollaborator(id); } finally { setBusyId(null); }
    }
  };

  const handleAccept = async (ownerUid) => {
    setBusyId(ownerUid);
    try { await acceptInvitation(ownerUid); } finally { setBusyId(null); }
  };

  const handleReject = async (ownerUid) => {
    setBusyId(ownerUid);
    try { await rejectInvitation(ownerUid); } finally { setBusyId(null); }
  };

  const handleLeave = async (ownerUid) => {
    if (window.confirm('¿Abandonar esta cuenta colaborativa?')) {
      setBusyId(ownerUid);
      try { await leaveWorkspace(ownerUid); } finally { setBusyId(null); }
    }
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">👤 Perfil</div>
          <div className="page-sub">Información personal y preferencias</div>
        </div>
        {!isEditing ? (
          <button className="btn btn-o" onClick={() => setIsEditing(true)}>✏️ Editar Perfil</button>
        ) : (
          <div style={{display:'flex', gap:'8px'}}>
            <button className="btn btn-gh btn-sm" onClick={() => setIsEditing(false)}>Cancelar</button>
            <button className="btn btn-o" onClick={handleSave}>💾 Guardar</button>
          </div>
        )}
      </div>

      <div className="g2">
        <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"16px"}}>
          <div style={{position:"relative"}}>
            <div style={{width:"80px",height:"80px",background:"linear-gradient(135deg,var(--blue),var(--purple))",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"30px",fontWeight:"800",color:"white",boxShadow:"0 8px 24px rgba(107,127,214,0.4)",border:"3px solid var(--border2)",overflow:"hidden"}}>
              {authUser?.photoURL ? <img src={authUser.photoURL} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (authUser?.displayName?.[0] || 'U')}
            </div>
            {isEditing && (
              <div style={{position:"absolute",bottom:"0",right:"0",width:"26px",height:"26px",background:"var(--orange)",borderRadius:"50%",border:"2px solid var(--surface)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",cursor:"pointer"}}>📷</div>
            )}
          </div>
          
          <div>
            <div style={{fontSize:"22px",fontWeight:"800"}}>{authUser?.displayName || 'Usuario'}</div>
            <div style={{fontSize:"13px",color:"var(--text2)"}}>Ingeniero de Software · Tech Company Inc.</div>
            <div style={{marginTop:"6px"}}><span className="badge bb">⭐ Plan {usuario.plan}</span></div>
          </div>
          
          <div style={{width:"100%",textAlign:"left",fontSize:"13px"}}>
            {isEditing ? (
              <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <div className="fgrp">
                  <label className="flbl">Nombre</label>
                  <input className="finp" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                </div>
                <div className="fgrp">
                  <label className="flbl">Apellidos</label>
                  <input className="finp" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} />
                </div>
                <div className="fgrp">
                  <label className="flbl">Email</label>
                  <input className="finp" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="fgrp">
                  <label className="flbl">Teléfono</label>
                  <input className="finp" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                </div>
              </div>
            ) : (
              <>
                <div style={{display:"flex",gap:"8px",padding:"10px 0",borderBottom:"1px solid var(--border)"}}><span style={{color:"var(--text3)",width:"120px",flexShrink:"0"}}>📧 Email</span><span>{authUser?.email || usuario.email}</span></div>
                <div style={{display:"flex",gap:"8px",padding:"10px 0",borderBottom:"1px solid var(--border)"}}><span style={{color:"var(--text3)",width:"120px",flexShrink:"0"}}>📱 Teléfono</span><span>{usuario.telefono}</span></div>
                <div style={{display:"flex",gap:"8px",padding:"10px 0",borderBottom:"1px solid var(--border)"}}><span style={{color:"var(--text3)",width:"120px",flexShrink:"0"}}>📍 Ubicación</span><span>🇨🇱 Santiago, Chile</span></div>
                <div style={{display:"flex",gap:"8px",padding:"10px 0",borderBottom:"1px solid var(--border)"}}><span style={{color:"var(--text3)",width:"120px",flexShrink:"0"}}>🎂 Nacimiento</span><span>15/05/1990</span></div>
                <div style={{display:"flex",gap:"8px",padding:"10px 0"}}><span style={{color:"var(--text3)",width:"120px",flexShrink:"0"}}>🏢 Empresa</span><span>Tech Company Inc.</span></div>
              </>
            )}
          </div>
          
          {!isEditing && <button className="btn btn-o" style={{width:"100%"}} onClick={() => setIsEditing(true)}>✏️ Editar Perfil</button>}
        </div>
        
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          <div className="card">
            <div className="card-hdr"><div className="card-title">🌍 Preferencias Rápidas</div></div>
            <div className="fg" style={{gap:"10px"}}>
              <div className="fgrp">
                <label className="flbl">Moneda Principal</label>
                <select className="fsel" value={configuracion.moneda} onChange={e => updateConfig('moneda', e.target.value)}>
                  <option value="CLP">CLP — Peso Chileno</option>
                  <option value="USD">USD — Dólar</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
              <div className="fgrp">
                <label className="flbl">Tema</label>
                <select className="fsel" value={configuracion.tema} onChange={e => updateConfig('tema', e.target.value)}>
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-hdr"><div className="card-title">📊 Mi Resumen Financiero</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
              <div style={{background:"var(--surface3)",borderRadius:"var(--r3)",padding:"12px",textAlign:"center"}}><div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"4px"}}>SCORE IA</div><div style={{fontFamily:"var(--mono)",fontSize:"18px",fontWeight:"600",color:"var(--green)"}}>850</div></div>
              <div style={{background:"var(--surface3)",borderRadius:"var(--r3)",padding:"12px",textAlign:"center"}}><div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"4px"}}>TASA AHORRO</div><div style={{fontFamily:"var(--mono)",fontSize:"18px",fontWeight:"600",color:"var(--blue)"}}>{tasaAhorro}%</div></div>
              <div style={{background:"var(--surface3)",borderRadius:"var(--r3)",padding:"12px",textAlign:"center"}}><div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"4px"}}>METAS</div><div style={{fontFamily:"var(--mono)",fontSize:"18px",fontWeight:"600",color:"var(--orange)"}}>{metas}</div></div>
              <div style={{background:"var(--surface3)",borderRadius:"var(--r3)",padding:"12px",textAlign:"center"}}><div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"4px"}}>DEUDAS ACTIVAS</div><div style={{fontFamily:"var(--mono)",fontSize:"18px",fontWeight:"600",color:"var(--purple)"}}>{deudas.length}</div></div>
            </div>
          </div>
          
          {/* ESPACIOS DE TRABAJO */}
          {workspaces.length > 1 && (
            <div className="card">
              <div className="card-hdr"><div className="card-title">🧭 Espacios de Trabajo</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {workspaces.map(w => (
                  <div key={w.uid} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background: w.uid === activeUid ? "var(--surface3)" : "var(--glass)",border: w.uid === activeUid ? "1px solid var(--blue)" : "1px solid transparent",borderRadius:"var(--r3)"}}>
                    <div style={{width:"30px",height:"30px",background: w.isOwner ? "linear-gradient(135deg,var(--blue),var(--purple))" : "var(--surface3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px", flexShrink:0}}>
                      {w.isOwner ? '🏠' : '🤝'}
                    </div>
                    <div style={{flex:"1", minWidth: 0}}>
                      <div style={{fontSize:"13px",fontWeight:"600", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{w.isOwner ? 'Mi cuenta' : w.label}</div>
                      <div style={{fontSize:"11px",color:"var(--text2)"}}>● {w.isOwner ? 'Propietario' : ROLE_LABEL[w.role] || w.role}</div>
                    </div>
                    {w.uid === activeUid ? (
                      <span className="badge bg">Activo</span>
                    ) : (
                      <button className="btn btn-o btn-sm" onClick={() => switchWorkspace(w.uid)}>Cambiar</button>
                    )}
                    {!w.isOwner && (
                      <button className="btn btn-d btn-sm" style={{padding:'4px 8px'}} disabled={busyId === w.uid} onClick={() => handleLeave(w.uid)}>✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVITACIONES PENDIENTES (recibidas) */}
          {pendingInvitations.length > 0 && (
            <div className="card">
              <div className="card-hdr"><div className="card-title">✉️ Invitaciones Pendientes</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {pendingInvitations.map(inv => (
                  <div key={inv.ownerUid} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:"var(--glass)",borderRadius:"var(--r3)"}}>
                    <div style={{flex:"1", minWidth: 0}}>
                      <div style={{fontSize:"13px",fontWeight:"600", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{inv.ownerName || inv.ownerEmail}</div>
                      <div style={{fontSize:"11px",color:"var(--text2)"}}>Te invitó como {ROLE_LABEL[inv.role] || inv.role}</div>
                    </div>
                    <button className="btn btn-o btn-sm" disabled={busyId === inv.ownerUid} onClick={() => handleAccept(inv.ownerUid)}>✓ Aceptar</button>
                    <button className="btn btn-d btn-sm" disabled={busyId === inv.ownerUid} onClick={() => handleReject(inv.ownerUid)}>✕ Rechazar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*  USERS  */}
          <div className="card">
            <div className="card-hdr"><div className="card-title">👥 Usuarios de Mi Cuenta</div>
            <button className="btn btn-o btn-sm" onClick={() => setShowColabModal(true)}>+ Invitar</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:"var(--glass)",borderRadius:"var(--r3)"}}>
                <div style={{width:"30px",height:"30px",background:"linear-gradient(135deg,var(--blue),var(--purple))",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",overflow:"hidden", flexShrink:0}}>
                  {authUser?.photoURL ? <img src={authUser.photoURL} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (authUser?.displayName?.[0] || 'U')}
                </div>
                <div style={{flex:"1", minWidth: 0}}>
                  <div style={{fontSize:"13px",fontWeight:"600", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{authUser?.displayName || 'Usuario'}</div>
                  <div style={{fontSize:"11px",color:"var(--green)"}}>● Propietario</div>
                </div>
                {isOwnerWorkspace ? <span className="badge bg">Tú</span> : <span className="badge bp">Dueño</span>}
              </div>

              {ownedCollaborators.map(c => (
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:"var(--glass)",borderRadius:"var(--r3)"}}>
                  <div style={{width:"30px",height:"30px",background:"var(--surface3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px", flexShrink:0}}>👤</div>
                  <div style={{flex:"1", minWidth: 0}}>
                    <div style={{fontSize:"13px",fontWeight:"600", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{c.email}</div>
                    <div style={{fontSize:"11px",color:"var(--text2)"}}>● {c.status === 'pending' ? 'Invitación pendiente' : 'Activo'}</div>
                  </div>
                  <select className="fsel" style={{width:"auto", fontSize:"12px", padding:"4px 6px"}} value={c.role || 'viewer'} onChange={e => updateCollaboratorRole(c.id, e.target.value)}>
                    <option value="editor">Editor</option>
                    <option value="viewer">Solo Lectura</option>
                  </select>
                  <button className="btn btn-d btn-sm" style={{padding:'4px 8px'}} disabled={busyId === c.id} onClick={() => handleRemoveCollaborator(c.id)}>✕</button>
                </div>
              ))}
              
              {ownedCollaborators.length === 0 && (
                <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:"var(--glass)",borderRadius:"var(--r3)",opacity:"0.6",cursor:"pointer"}} onClick={() => setShowColabModal(true)}>
                  <div style={{width:"30px",height:"30px",background:"var(--surface3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px", flexShrink:0}}>+</div>
                  <div style={{fontSize:"13px",color:"var(--text2)"}}>Invitar usuario o familiar...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL COLABORADOR */}
      {showColabModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
          <div className="card" style={{width:"90%",maxWidth:"400px",animation:"fadeUp 0.3s ease", display:"flex", flexDirection:"column", gap:"15px"}}>
            <div className="card-title" style={{fontSize:"18px"}}>Invitar Colaborador</div>
            <div className="fgrp">
               <label className="flbl">Correo Electrónico de Google</label>
               <input className="finp" type="email" placeholder="colaborador@gmail.com" value={colabForm.email} onChange={e=>setColabForm({...colabForm, email: e.target.value})} />
            </div>
            <div className="fgrp">
               <label className="flbl">Rol</label>
               <select className="fsel" value={colabForm.role} onChange={e=>setColabForm({...colabForm, role: e.target.value})}>
                 <option value="editor">Editor — puede ver y modificar datos</option>
                 <option value="viewer">Solo Lectura — solo puede ver datos</option>
               </select>
            </div>
            {colabError && <div style={{fontSize:"12px", color:"var(--pink)"}}>{colabError}</div>}
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end", marginTop:"10px"}}>
              <button className="btn btn-gh" onClick={() => setShowColabModal(false)}>Cancelar</button>
              <button className="btn btn-o" onClick={addCollaborator}>Enviar Invitación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
