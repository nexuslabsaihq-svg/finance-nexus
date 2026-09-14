import React, { useState } from 'react';

export default function ConfigSetup() {
  const [form, setForm] = useState({
    VITE_FIREBASE_API_KEY: '',
    VITE_FIREBASE_AUTH_DOMAIN: '',
    VITE_FIREBASE_PROJECT_ID: '',
    VITE_FIREBASE_STORAGE_BUCKET: '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '',
    VITE_FIREBASE_APP_ID: '',
    VITE_GEMINI_API_KEY: ''
  });

  const handleSave = () => {
    localStorage.setItem('fn_apikeys', JSON.stringify(form));
    window.location.reload(); // Reload to inject keys
  };

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"}}>
      <div className="card" style={{maxWidth:"500px", width:"100%"}}>
        <div style={{textAlign:"center", marginBottom:"20px"}}>
          <div style={{fontSize:"40px", marginBottom:"10px"}}>⚙️</div>
          <div style={{fontSize:"24px", fontWeight:"800", background:"linear-gradient(90deg, var(--blue), var(--purple))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Configuración Requerida</div>
          <div style={{fontSize:"14px", color:"var(--text2)", marginTop:"10px"}}>
            No se detectó el archivo <code>.env</code>. Para que la aplicación funcione con Firebase y Gemini, ingresa las credenciales a continuación. Se guardarán localmente en tu navegador.
          </div>
        </div>

        <div className="fg" style={{gap:"12px"}}>
          <div className="fgrp"><label className="flbl">API Key (Firebase)</label><input className="finp" value={form.VITE_FIREBASE_API_KEY} onChange={e=>setForm({...form, VITE_FIREBASE_API_KEY: e.target.value})} placeholder="AIzaSyA..." /></div>
          <div className="fgrp"><label className="flbl">Auth Domain</label><input className="finp" value={form.VITE_FIREBASE_AUTH_DOMAIN} onChange={e=>setForm({...form, VITE_FIREBASE_AUTH_DOMAIN: e.target.value})} placeholder="app.firebaseapp.com" /></div>
          <div className="fgrp"><label className="flbl">Project ID</label><input className="finp" value={form.VITE_FIREBASE_PROJECT_ID} onChange={e=>setForm({...form, VITE_FIREBASE_PROJECT_ID: e.target.value})} placeholder="my-project-123" /></div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
             <div className="fgrp"><label className="flbl">Storage Bucket</label><input className="finp" value={form.VITE_FIREBASE_STORAGE_BUCKET} onChange={e=>setForm({...form, VITE_FIREBASE_STORAGE_BUCKET: e.target.value})} placeholder="app.appspot.com" /></div>
             <div className="fgrp"><label className="flbl">Sender ID</label><input className="finp" value={form.VITE_FIREBASE_MESSAGING_SENDER_ID} onChange={e=>setForm({...form, VITE_FIREBASE_MESSAGING_SENDER_ID: e.target.value})} placeholder="123456789" /></div>
          </div>
          <div className="fgrp"><label className="flbl">App ID</label><input className="finp" value={form.VITE_FIREBASE_APP_ID} onChange={e=>setForm({...form, VITE_FIREBASE_APP_ID: e.target.value})} placeholder="1:123456789:web:abc" /></div>
          
          <div style={{height:"1px", background:"var(--border)", margin:"10px 0"}}></div>
          
          <div className="fgrp"><label className="flbl">Gemini API Key (Google AI Studio)</label><input className="finp" value={form.VITE_GEMINI_API_KEY} onChange={e=>setForm({...form, VITE_GEMINI_API_KEY: e.target.value})} placeholder="AIza..." style={{background:"rgba(75, 192, 200, 0.05)", border:"1px solid var(--green)"}}/></div>
        </div>
        
        <button className="btn btn-p" style={{width:"100%", marginTop:"20px", padding:"12px"}} onClick={handleSave}>💾 Guardar Credenciales e Iniciar</button>
      </div>
    </div>
  );
}
