import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsPDF } from 'jspdf';

export default function IA() {
  const { chatsIA, setChatsIA, ingresos, gastos, ahorros, deudas, bancos, inversiones, authUser } = useAppData();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatsIA, loading]);

  const checkRateLimit = () => {
    try {
      const now = Date.now();
      const oneHourAgo = now - 3600000;
      let calls = JSON.parse(localStorage.getItem('fn_nexus_rates') || '[]');
      calls = calls.filter(t => t > oneHourAgo);
      if (calls.length >= 20) {
        setRateLimitExceeded(true);
        return false;
      }
      calls.push(now);
      localStorage.setItem('fn_nexus_rates', JSON.stringify(calls));
      setRateLimitExceeded(false);
      return true;
    } catch { return true; }
  };

  const fileToGenerativePart = async (fileBlob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        inlineData: { data: reader.result.split(',')[1], mimeType: fileBlob.type }
      });
      reader.readAsDataURL(fileBlob);
    });
  };

  const clearChat = () => {
    if(window.confirm('¿Seguro que deseas reiniciar la conversación? Nexus olvidará este hilo.')){
      setChatsIA([]);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`Reporte de Inteligencia Financiera - Nexus`, 10, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    let y = 20;
    chatsIA.forEach(c => {
      if (y > 280) { doc.addPage(); y = 10; }
      doc.setFont("helvetica", "bold");
      doc.text(c.role === 'user' ? (authUser?.displayName || 'Usuario') : "Nexus AI", 10, y);
      doc.setFont("helvetica", "normal");
      
      const lines = doc.splitTextToSize(c.content, 180);
      doc.text(lines, 10, y + 5);
      y += (lines.length * 5) + 10;
    });
    doc.save(`Nexus_Log_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const sendPrompt = async (textOverride = null) => {
    // Empty function
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-hdr" style={{marginBottom: "15px"}}>
        <div style={{display:"flex", alignItems:"center", gap:"15px"}}>
          <div style={{width:"45px", height:"45px", borderRadius:"12px", background:"linear-gradient(135deg, var(--blue), var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", boxShadow:"0 5px 15px rgba(107,127,214,0.3)"}}>
            ✨
          </div>
          <div>
            <div className="page-title" style={{fontSize:"22px"}}>Nexus AI</div>
            <div className="page-sub">Inteligencia Artificial con Aprendizaje Continuo</div>
          </div>
        </div>
        <div style={{display:"flex", gap:"10px"}}>
          <button className="btn btn-gh btn-sm" onClick={exportPDF}>📄 Exportar PDF</button>
          <button className="btn btn-gh btn-sm" onClick={clearChat} style={{color:"var(--pink)"}}>🗑 Limpiar</button>
        </div>
      </div>
      
      {rateLimitExceeded && (
        <div className="alert al-p" style={{marginBottom:"15px", borderRadius:"12px"}}>
          ⚠️ <b>Límite de Consultas (Rate Limit):</b> Has alcanzado el límite gratuito de 20 mensajes por hora para proteger la API. Intenta nuevamente más tarde.
        </div>
      )}
      
      <div className="card" style={{flex: 1, display: 'flex', flexDirection: 'column', overflow:"hidden", background:"rgba(18, 20, 30, 0.4)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.05)"}}>
        
        <div style={{flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          {chatsIA.length === 0 && (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, opacity:0.8, animation:"fadeIn 1s ease"}}>
               <div style={{fontSize:"50px", marginBottom:"15px", filter:"grayscale(0.5)"}}>🧠</div>
               <div style={{fontSize:"20px", fontWeight:"700", color:"var(--text)"}}>Hola {authUser?.displayName?.split(' ')[0] || 'Usuario'}, soy Nexus</div>
               <div style={{fontSize:"14px", color:"var(--text2)", marginBottom:"25px"}}>Tengo acceso en tiempo real a tus finanzas. ¿Por dónde empezamos?</div>
               
               <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", width:"100%", maxWidth:"500px"}}>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('¿Cómo están mis finanzas este mes en resumen?')}>📊 ¿Cómo están mis finanzas este mes?</button>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('¿En qué categoría gasto más dinero en promedio?')}>💸 ¿En qué categoría gasto más?</button>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('Proyéctame cuándo terminaré de pagar mis deudas actuales.')}>📋 ¿Cuándo pagaré mis deudas?</button>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('Dame una estrategia para optimizar mis metas de ahorro.')}>🎯 ¿Cómo optimizar mis ahorros?</button>
               </div>
            </div>
          )}

          {chatsIA.map(msg => (
            <div key={msg.id} style={{
              display:"flex", flexDirection: msg.role === 'user' ? "row-reverse" : "row", gap:"12px", alignItems:"flex-end", animation:"float 0.3s ease-out"
            }}>
              {msg.role === 'assistant' && (
                <div style={{width:"32px", height:"32px", borderRadius:"8px", flexShrink:0, background:"linear-gradient(135deg, var(--blue), var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", boxShadow:"0 2px 10px rgba(107,127,214,0.3)"}}>✨</div>
              )}
              {msg.role === 'user' && (
                <div style={{width:"32px", height:"32px", borderRadius:"8px", flexShrink:0, background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px"}}>👤</div>
              )}
              
              <div style={{display:"flex", flexDirection:"column", alignItems: msg.role === 'user' ? "flex-end" : "flex-start", maxWidth:"75%"}}>
                 <div style={{
                   background: msg.role === 'user' ? 'linear-gradient(135deg, #2b3040, var(--surface2))' : 'rgba(255,255,255,0.03)',
                   color: 'var(--text)',
                   padding: '14px 18px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.6',
                   border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.05)' : '1px solid var(--border)',
                   borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                   borderBottomLeftRadius: msg.role !== 'user' ? '4px' : '16px'
                 }}>
                   {msg.attachment && <div style={{background:"rgba(107,127,214,0.1)", color:"var(--blue)", border:"1px solid rgba(107,127,214,0.3)", padding:"6px 10px", borderRadius:"6px", fontSize:"12px", marginBottom:"8px", display:"inline-flex", gap:"6px", alignItems:"center"}}>📎 {msg.attachment}</div>}
                   <div style={{whiteSpace: 'pre-wrap'}}>
                     {msg.content.split(/(\*[^*]+\*)/g).map((part, index) => {
                       if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                         return <b key={index}>{part.slice(1, -1)}</b>;
                       }
                       return part;
                     })}
                   </div>
                 </div>
                 <div style={{fontSize:"10px", color:"var(--text3)", marginTop:"5px"}}>{msg.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:"flex", gap:"12px", alignItems:"flex-end"}}>
              <div style={{width:"32px", height:"32px", borderRadius:"8px", flexShrink:0, background:"linear-gradient(135deg, var(--blue), var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", boxShadow:"0 2px 10px rgba(107,127,214,0.3)"}}>✨</div>
              <div style={{background: 'rgba(255,255,255,0.03)', color: 'var(--text2)', padding: '12px 18px', borderRadius: '16px', fontSize: '13px', border: '1px solid var(--border)', borderBottomLeftRadius: '4px'}}>
                <span style={{display:"inline-flex", gap:"4px"}}>
                  <span style={{animation:"bounce 1s infinite", animationDelay:"0s"}}>Nexus</span>
                  <span style={{animation:"bounce 1s infinite", animationDelay:"0.2s"}}>está</span>
                  <span style={{animation:"bounce 1s infinite", animationDelay:"0.4s"}}>escribiendo...</span>
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div style={{padding:"15px", borderTop:"1px solid var(--border)", background:"var(--surface)", display:"flex", flexDirection:"column", gap:"10px"}}>
          {file && (
            <div style={{display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", background:"var(--surface3)", borderRadius:"8px", fontSize:"12px", width:"fit-content"}}>
              <span style={{color:"var(--text2)"}}>Adjunto: {file.name}</span>
              <button className="btn btn-d btn-sm" style={{padding:"2px 6px"}} onClick={() => setFile(null)}>✕</button>
            </div>
          )}

          <div style={{display: 'flex', gap: '8px', alignItems:'center'}}>
            <label style={{cursor:"pointer", background:"var(--surface3)", width:"44px", height:"44px", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s"}} onMouseOver={e=>e.currentTarget.style.background="var(--border)"} onMouseOut={e=>e.currentTarget.style.background="var(--surface3)"}>
              📎
              <input type="file" style={{display:"none"}} accept="image/*,application/pdf" onChange={handleFileChange} />
            </label>
            <button className="btn btn-gh" style={{width:"44px", height:"44px", borderRadius:"12px", padding:0, fontSize:"18px"}} title="Dictado por voz (Próximamente)">🎙️</button>
            
            <input 
              type="text" 
              className="finp" 
              placeholder={rateLimitExceeded ? "Límite de mensajes alcanzado..." : "Envía un mensaje a Nexus..."} 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
              style={{flex: 1, height:"44px", borderRadius:"12px", background:"rgba(0,0,0,0.2)"}}
              disabled={loading || rateLimitExceeded}
            />
            <button className="btn btn-p" onClick={() => sendPrompt()} disabled={loading || rateLimitExceeded || (!input.trim() && !file)} style={{height:"44px", borderRadius:"12px", padding:"0 24px", fontWeight:"700", background:"linear-gradient(135deg, var(--blue), var(--purple))", border:"none", boxShadow:"0 4px 15px rgba(107,127,214,0.3)"}}>
              🚀
            </button>
          </div>
          <div style={{textAlign:"center", fontSize:"10px", color:"var(--text3)", marginTop:"-2px"}}>
            Las respuestas de la IA financiera pueden ser proyecciones inexactas. Verifica la información legal.
          </div>
        </div>
      </div>
    </div>
  );
}
