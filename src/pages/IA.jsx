import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import { GeminaKey } from '../firebase/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsPDF } from 'jspdf';
import DOMPurify from 'dompurify';
import { generateNexusUltimatePrompt } from '../utils/nexusUltimatePrompt';
import * as XLSX from 'xlsx';

export default function IA() {
  const { chatsIA, setChatsIA, ingresos, gastos, ahorros, deudas, bancos, inversiones, authUser, configuracion, setActivePage } = useAppData();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [pendingRetry, setPendingRetry] = useState(null); // Guarda la orden para reintentar con 1 clic
  const chatEndRef = useRef(null);

  // Microphone State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatsIA, loading]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-CL';
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        alert("El dictado por voz no está soportado en este navegador.");
      }
    }
  };

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

  const processFileForGemini = async (fileObj) => {
    const name = fileObj.name.toLowerCase();
    // Si es Excel o CSV, lo procesamos como texto usando XLSX
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const csvText = XLSX.utils.sheet_to_csv(worksheet);
            resolve({ text: `\n\n--- DATOS EXTRAÍDOS DEL DOCUMENTO ADJUNTO (${fileObj.name}) ---\n${csvText}\n--- FIN DE DATOS ADJUNTOS ---\n\n` });
          } catch (err) {
            console.error("Error leyendo Excel/CSV:", err);
            reject(err);
          }
        };
        reader.readAsArrayBuffer(fileObj);
      });
    } else {
      // Imágenes y PDFs se envían como inlineData nativa
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({
          inlineData: { data: reader.result.split(',')[1], mimeType: fileObj.type }
        });
        reader.readAsDataURL(fileObj);
      });
    }
  };

  const clearChat = () => {
    if(window.confirm('¿Seguro que deseas reiniciar la conversación? Nexus Ai Ultimate Synthesis olvidará este hilo.')){
      setChatsIA([]);
      setPendingRetry(null);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`Reporte de Inteligencia Financiera - Nexus Ai Ultimate Synthesis`, 10, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    let y = 20;
    chatsIA.forEach(c => {
      if (y > 280) { doc.addPage(); y = 10; }
      doc.setFont("helvetica", "bold");
      doc.text(c.role === 'user' ? (authUser?.displayName || 'Usuario') : "Nexus Ai Ultimate Synthesis", 10, y);
      doc.setFont("helvetica", "normal");
      
      const lines = doc.splitTextToSize(c.content, 180);
      doc.text(lines, 10, y + 5);
      y += (lines.length * 5) + 10;
    });
    doc.save(`Nexus_Log_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const sendPrompt = async (textOverride = null, fileOverride = null, isAutoRetry = false, retryCount = 0) => {
    const txt = textOverride !== null ? textOverride : input;
    const currentFile = fileOverride !== undefined ? fileOverride : file;

    if (!txt.trim() && !currentFile) return;
    if (!checkRateLimit()) return;

    if (!isAutoRetry) {
      const newMsg = { id: Date.now(), role: 'user', content: txt, attachment: currentFile ? currentFile.name : null, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setChatsIA(prev => [...prev, newMsg]);
      setInput('');
      setFile(null);
      setPendingRetry({ text: txt, file: currentFile });
    }
    
    setLoading(true);

    try {
      const activeApiKey = configuracion?.geminiApiKey || GeminaKey;
      if (!activeApiKey) {
        throw new Error("FALTA_KEY: No se encontró la API Key de Gemini. Ve a Configuración y añade tu llave gratuita de Google AI Studio.");
      }

      const systemPrompt = generateNexusUltimatePrompt({ authUser, ingresos, gastos, deudas, ahorros, bancos, inversiones });
      const genAI = new GoogleGenerativeAI(activeApiKey);
      
      const recentChats = chatsIA.slice(-9).filter(c => !c.isError); 
      const formattedHistory = recentChats.map(c => ({
        role: c.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: c.content }]
      }));

      const userParts = [];
      if (txt) userParts.push(txt);
      else if (currentFile) userParts.push("Analiza minuciosamente este documento adjunto.");

      if (currentFile) {
        userParts.push(await processFileForGemini(currentFile));
      }

      // 1. Descubrimiento dinámico de modelos autorizados para esta clave en Google
      let dynamicModels = [];
      try {
        const checkRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${activeApiKey}`);
        const checkData = await checkRes.json();
        if (checkData.error) {
          throw new Error(`Google API: ${checkData.error.message}`);
        }
        if (checkData.models && Array.isArray(checkData.models)) {
          dynamicModels = checkData.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));
          console.log("[Finance Nexus] Modelos autorizados para tu clave:", dynamicModels);
        }
      } catch (checkErr) {
        if (checkErr.message.includes("Google API:")) {
          throw checkErr;
        }
        console.warn("[Finance Nexus] No se pudo autodescubrir modelos:", checkErr.message);
      }

      // Priorizar flash dentro de los modelos autorizados
      const fallbackChain = dynamicModels.length > 0 
        ? [
            ...dynamicModels.filter(m => m.includes("2.5-flash")),
            ...dynamicModels.filter(m => m.includes("2.0-flash")),
            ...dynamicModels.filter(m => m.includes("1.5-flash")),
            ...dynamicModels
          ].filter((v, i, a) => a.indexOf(v) === i)
        : [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash"
          ];

      let finalResponseText = null;
      let lastError = null;

      for (const modelName of fallbackChain) {
        try {
          console.log(`[Finance Nexus] Conectando con: ${modelName}...`);
          const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemPrompt });
          const chat = model.startChat({ history: formattedHistory });
          
          const result = await chat.sendMessage(userParts);
          finalResponseText = result.response.text();
          console.log(`[Finance Nexus] ✔️ Éxito con ${modelName}`);
          break;
        } catch (apiError) {
          console.warn(`[Finance Nexus] ❌ Fallo en ${modelName}:`, apiError.message);
          lastError = apiError;
          if (apiError.message.includes("API key not valid") || apiError.message.includes("API_KEY_INVALID")) {
            throw new Error("API_KEY_INVALID: La API Key ingresada no es válida. Por favor, renuévala en Google AI Studio y guárdala en Configuración.");
          }
        }
      }

      if (!finalResponseText) {
        // Auto-Retry Logic silencioso para 503 / overloaded
        if (lastError && (lastError.message.includes("503") || lastError.message.includes("overloaded"))) {
          if (retryCount < 2) {
            console.log(`[Finance Nexus] Auto-reintentando silenciosamente (Intento ${retryCount + 1}/2)...`);
            setTimeout(() => sendPrompt(txt, currentFile, true, retryCount + 1), 3000);
            return;
          }
        }
        throw new Error(lastError?.message ? `Error del servidor de IA: ${lastError.message}` : "Alta demanda en la red de IA. Presiona 'Reintentar' para reanudar.");
      }
      
      setChatsIA(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: finalResponseText, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
      setPendingRetry(null); // Éxito: limpiar reintento pendiente
    } catch (e) {
      console.error("[Finance Nexus Error]:", e);
      setChatsIA(prev => [...prev, {
        id: Date.now() + 1, 
        role: 'assistant', 
        isError: true, 
        isMissingKey: e.message.includes("FALTA_KEY") || e.message.includes("API_KEY_INVALID"),
        content: `⚠️ **Sistema Interrumpido:** ${e.message}`, 
        time: new Date().toLocaleTimeString()
      }]);
    } finally {
      if (!isAutoRetry) {
         setLoading(false);
      }
    }
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
            <div className="page-title" style={{fontSize:"22px"}}>Nexus Ai Ultimate Synthesis</div>
            <div className="page-sub">Sistema Unificado de Inteligencia Estratégica Financiera</div>
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
               <div style={{fontSize:"20px", fontWeight:"700", color:"var(--text)"}}>Nexus Ai Ultimate Synthesis</div>
               <div style={{fontSize:"14px", color:"var(--text2)", marginBottom:"25px"}}>Precisión clínica. Cero alucinaciones. Listo para auditar tus finanzas.</div>
               
               <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", width:"100%", maxWidth:"500px"}}>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('Diagnostica mi flujo de caja actual y calcula mi DTI.')}>📊 Diagnóstico y DTI</button>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('Quiero que evalúes si estoy en riesgo de quiebra inminente.')}>⚠️ Evaluación de Quiebra</button>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('Proyéctame el exterminio de mis deudas usando el método Avalancha.')}>🏔️ Plan Avalancha Deudas</button>
                 <button className="btn btn-gh" style={{textAlign:"left", padding:"12px"}} onClick={()=>sendPrompt('Diseña un plan táctico para constituir mi Fondo de Emergencia Pleno.')}>🛡️ Plan Fondo Emergencia</button>
               </div>
            </div>
          )}

          {chatsIA.map(msg => (
            <div key={msg.id} style={{
              display:"flex", flexDirection: msg.role === 'user' ? "row-reverse" : "row", gap:"12px", alignItems:"flex-end", animation:"float 0.3s ease-out"
            }}>
              {msg.role === 'assistant' && (
                <div style={{width:"32px", height:"32px", borderRadius:"8px", flexShrink:0, background:"linear-gradient(135deg, var(--blue), var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", boxShadow:"0 2px 10px rgba(107,127,214,0.3)"}}>🧠</div>
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
                   <div style={{whiteSpace: 'pre-wrap'}} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(msg.content.replace(/\*([^*]+)\*/g, '<b>$1</b>'), { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'], ALLOWED_ATTR: [] })}} />
                   {msg.isMissingKey && (
                     <div style={{marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap"}}>
                       <button className="btn btn-p btn-sm" style={{background: "var(--orange)", borderColor: "var(--orange)", fontSize: "12px"}} onClick={() => setActivePage('configuracion')}>
                         ⚙️ Ir a Configuración para ingresar tu API Key
                       </button>
                     </div>
                   )}
                   {msg.isError && pendingRetry && (
                     <div style={{marginTop: "10px"}}>
                       <button className="btn btn-o btn-sm" style={{borderColor: "var(--blue)", color: "var(--blue)", fontSize: "12px"}} onClick={() => sendPrompt(pendingRetry.text, pendingRetry.file)}>
                         🔄 Reintentar esta consulta con 1 clic
                       </button>
                     </div>
                   )}
                 </div>
                 <div style={{fontSize:"10px", color:"var(--text3)", marginTop:"5px"}}>{msg.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:"flex", gap:"12px", alignItems:"flex-end"}}>
              <div style={{width:"32px", height:"32px", borderRadius:"8px", flexShrink:0, background:"linear-gradient(135deg, var(--blue), var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", boxShadow:"0 2px 10px rgba(107,127,214,0.3)"}}>🧠</div>
              <div style={{background: 'rgba(255,255,255,0.03)', color: 'var(--text2)', padding: '12px 18px', borderRadius: '16px', fontSize: '13px', border: '1px solid var(--border)', borderBottomLeftRadius: '4px'}}>
                <span style={{display:"inline-flex", gap:"4px"}}>
                  <span style={{animation:"bounce 1s infinite", animationDelay:"0s"}}>Nexus</span>
                  <span style={{animation:"bounce 1s infinite", animationDelay:"0.2s"}}>está</span>
                  <span style={{animation:"bounce 1s infinite", animationDelay:"0.4s"}}>analizando...</span>
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        {/* BARRA INTELIGENTE DE ACCIÓN RÁPIDA (REINTENTO Y CONTINUAR) */}
        {chatsIA.length > 0 && !loading && (
          <div style={{padding: "8px 15px", background: "rgba(255,255,255,0.03)", borderTop: "1px solid var(--border)", display: "flex", gap: "8px", overflowX: "auto", alignItems: "center"}}>
            {chatsIA[chatsIA.length - 1]?.isError && pendingRetry ? (
              <button 
                className="btn btn-p btn-sm" 
                style={{background: "linear-gradient(135deg, var(--orange), #f5222d)", border: "none", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px"}}
                onClick={() => sendPrompt(pendingRetry.text, pendingRetry.file)}
              >
                🔄 Reintentar última consulta
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-gh btn-sm" 
                  style={{fontSize: "12px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(107,127,214,0.1)", color: "var(--blue)", border: "1px solid rgba(107,127,214,0.3)", padding: "6px 12px"}}
                  onClick={() => sendPrompt("Continúa exactamente donde te quedaste con el análisis numérico en profundidad.")}
                >
                  ▶️ Continuar análisis
                </button>
                <button 
                  className="btn btn-gh btn-sm" 
                  style={{fontSize: "12px", padding: "6px 12px"}}
                  onClick={() => sendPrompt("Diagnostica mi flujo de caja actual y calcula mi DTI con mis datos actuales.")}
                >
                  📊 Flujo de Caja & DTI
                </button>
                <button 
                  className="btn btn-gh btn-sm" 
                  style={{fontSize: "12px", padding: "6px 12px"}}
                  onClick={() => sendPrompt("Proyéctame el exterminio de mis deudas usando el método Avalancha.")}
                >
                  🏔️ Plan Avalancha Deudas
                </button>
              </>
            )}
          </div>
        )}

        <div style={{padding:"15px", borderTop:"1px solid var(--border)", background:"var(--surface)", display:"flex", flexDirection:"column", gap:"10px"}}>
          {file && (
            <div style={{display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", background:"var(--surface3)", borderRadius:"8px", fontSize:"12px", width:"fit-content"}}>
              <span style={{color:"var(--text2)"}}>Adjunto: {file.name}</span>
              <button className="btn btn-d btn-sm" style={{padding:"2px 6px"}} onClick={() => setFile(null)}>✖</button>
            </div>
          )}

          <div style={{display: 'flex', gap: '8px', alignItems:'center'}}>
            <label style={{cursor:"pointer", background:"var(--surface3)", width:"44px", height:"44px", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s"}} onMouseOver={e=>e.currentTarget.style.background="var(--border)"} onMouseOut={e=>e.currentTarget.style.background="var(--surface3)"}>
              📎
              <input type="file" style={{display:"none"}} accept="image/*,application/pdf,.xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <button 
              className="btn btn-gh" 
              style={{width:"44px", height:"44px", borderRadius:"12px", padding:0, fontSize:"18px", background: isListening ? "rgba(255,77,79,0.2)" : "transparent", color: isListening ? "#ff4d4f" : "var(--text)"}} 
              title="Dictado por voz"
              onClick={toggleListen}
            >
              🎤
            </button>
            
            <input 
              type="text" 
              className="finp" 
              placeholder={rateLimitExceeded ? "Límite de mensajes alcanzado..." : isListening ? "Te estoy escuchando..." : "Consulta a Nexus Ai Ultimate Synthesis..."} 
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
            Las directivas de Nexus Ai Ultimate Synthesis deben ser verificadas. Este sistema aplica rigor matemático bajo la normativa chilena.
          </div>
        </div>
      </div>
    </div>
  );
}
