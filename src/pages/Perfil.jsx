import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Perfil() {
  const { usuario, setUsuario, configuracion, setConfiguracion, ahorros, deudas, authUser, activeUid } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...usuario });
  const [collaborators, setCollaborators] = useState([]);
  const [showColabModal, setShowColabModal] = useState(false);
  const [colabForm, setColabForm] = useState({ email: '', rol: 'Colaborador' });

  const tasaAhorro = 34.4; // Mock calculation metric
  const metas = ahorros.length;
  
  const handleSave = () => {
    setUsuario(form);
    setIsEditing(false);
  };

  const updateConfig = (field, value) => {
    setConfiguracion(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!authUser) return;
    const unsub = onSnapshot(collection(db, 'users', authUser.uid, 'collaborators'), (snap) => {
      const data = [];
      snap.forEach(d => data.push({id: d.id, ...d.data()}));
      setCollaborators(data);
    });
    return () => unsub();
  }, [authUser]);

  const addCollaborator = async () => {
    if (!colabForm.email) return;
    try {
      await setDoc(doc(db, 'users', authUser.uid, 'collaborators', colabForm.email), {
        email: colabForm.email,
        rol: colabForm.rol,
        addedAt: new Date().toISOString()
      });
      setShowColabModal(false);
      setColabForm({email: '', rol: 'Colaborador'});
    } catch(e) { console.error(e); }
  };

  const removeCollaborator = async (email) => {
    if(window.confirm('¿Revocar acceso al colaborador?')) {
      await deleteDoc(doc(db, 'users', authUser.uid, 'collaborators', email));
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
          
          {/*  USERS  */}
          <div className="card">
            <div className="card-hdr"><div className="card-title">👥 Usuarios de la Cuenta</div>
            {activeUid === authUser?.uid && <button className="btn btn-o btn-sm" onClick={() => setShowColabModal(true)}>+ Agregar</button>}
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
                {activeUid === authUser?.uid ? <span className="badge bg">Tú</span> : <span className="badge bp">Dueño</span>}
              </div>

              {collaborators.map(c => (
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:"var(--glass)",borderRadius:"var(--r3)"}}>
                  <div style={{width:"30px",height:"30px",background:"var(--surface3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px", flexShrink:0}}>👤</div>
                  <div style={{flex:"1", minWidth: 0}}>
                    <div style={{fontSize:"13px",fontWeight:"600", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{c.email}</div>
                    <div style={{fontSize:"11px",color:"var(--text2)"}}>● {c.rol}</div>
                  </div>
                  {activeUid === authUser?.uid && (
                     <button className="btn btn-d btn-sm" style={{padding:'4px 8px'}} onClick={() => removeCollaborator(c.id)}>✕</button>
                  )}
                  {activeUid !== authUser?.uid && c.email === authUser?.email && (
                     <span className="badge bg">Tú (Colab)</span>
                  )}
                </div>
              ))}
              
              {activeUid === authUser?.uid && collaborators.length === 0 && (
                <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:"var(--glass)",borderRadius:"var(--r3)",opacity:"0.6",cursor:"pointer"}} onClick={() => setShowColabModal(true)}>
                  <div style={{width:"30px",height:"30px",background:"var(--surface3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px", flexShrink:0}}>+</div>
                  <div style={{fontSize:"13px",color:"var(--text2)"}}>Agregar usuario o familiar...</div>
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
            <div className="card-title" style={{fontSize:"18px"}}>Añadir Colaborador</div>
            <div className="fgrp">
               <label className="flbl">Correo Electrónico de Google</label>
               <input className="finp" type="email" placeholder="colaborador@gmail.com" value={colabForm.email} onChange={e=>setColabForm({...colabForm, email: e.target.value})} />
            </div>
            <div className="fgrp">
               <label className="flbl">Rol</label>
               <select className="fsel" value={colabForm.rol} onChange={e=>setColabForm({...colabForm, rol: e.target.value})}>
                 <option value="Administrador">Administrador</option>
                 <option value="Colaborador">Colaborador</option>
                 <option value="Solo Lectura">Solo Lectura</option>
               </select>
            </div>
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end", marginTop:"10px"}}>
              <button className="btn btn-gh" onClick={() => setShowColabModal(false)}>Cancelar</button>
              <button className="btn btn-o" onClick={addCollaborator}>Autorizar Acceso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
