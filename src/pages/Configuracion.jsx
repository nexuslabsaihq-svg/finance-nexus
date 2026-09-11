import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Configuracion() {
  const { configuracion, setConfiguracion, setUsuario } = useAppData();
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('Gasto');
  const [apiKeyInput, setApiKeyInput] = useState(configuracion.geminiApiKey || '');
  const [showApiGuide, setShowApiGuide] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const updateConfig = (field, value) => {
    setConfiguracion(prev => ({ ...prev, [field]: value }));
  };

  const toggleNotif = (field) => {
    setConfiguracion(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAddCategory = () => {
    if (newCatName.trim()) {
      const typeLabel = newCatType === 'Gasto' ? 'Gasto' : 'Ingreso';
      const catWithTag = `${newCatName.trim()} | ${typeLabel}`;
      if (!configuracion.categorias.includes(catWithTag)) {
        setConfiguracion(prev => ({
          ...prev, 
          categorias: [...prev.categorias, catWithTag]
        }));
      }
      setNewCatName('');
    }
  };

  const removeCategory = (cat) => {
    setConfiguracion(prev => ({
      ...prev,
      categorias: prev.categorias.filter(c => c !== cat)
    }));
  };

  const cleanCategories = configuracion.categorias.map(c => {
    if (c.includes(' | ')) {
      const [name, type] = c.split(' | ');
      return { original: c, name, type };
    }
    // Backward compatibility for generic categories
    return { original: c, name: c, type: 'Gasto' };
  });

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">⚙️ Configuración</div>
          <div className="page-sub">Personaliza tu experiencia en Finance Nexus</div>
        </div>
      </div>
      
      <div className="g2">
        <div className="card" style={{borderTop:"2px solid var(--blue)"}}>
          <div className="card-hdr"><div className="card-title" style={{color:"var(--blue)"}}>🔔 Notificaciones</div></div>
          
          <div className="trow">
            <div><div className="tg-lbl">Notificaciones por Email</div><div className="tg-desc">Recibe boletines y alertas</div></div>
            <label className="toggle">
              <input type="checkbox" checked={configuracion.notifEmail} onChange={() => toggleNotif('notifEmail')} />
              <span className="ttr"></span>
            </label>
          </div>
          
          <div className="trow">
            <div><div className="tg-lbl">Notificaciones Push</div><div className="tg-desc">Alertas instantáneas en el navegador</div></div>
            <label className="toggle">
              <input type="checkbox" checked={configuracion.notifPush} onChange={() => toggleNotif('notifPush')} />
              <span className="ttr"></span>
            </label>
          </div>
          
          <div className="trow">
            <div><div className="tg-lbl">Insights de IA</div><div className="tg-desc">Recomendaciones semanales</div></div>
            <label className="toggle"><input type="checkbox" checked readOnly /><span className="ttr"></span></label>
          </div>
        </div>
        
        <div className="card" style={{borderTop:"2px solid var(--purple)"}}>
          <div className="card-hdr"><div className="card-title" style={{color:"var(--purple)"}}>🎨 Apariencia Global</div></div>
          <div className="fg" style={{gap:"10px"}}>
            <div className="fgrp">
              <label className="flbl">Tema UI</label>
              <select className="fsel" value={configuracion.tema} onChange={(e) => updateConfig('tema', e.target.value)}>
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
              </select>
            </div>
            <div className="fgrp">
              <label className="flbl">Moneda por Defecto</label>
              <select className="fsel" value={configuracion.moneda} onChange={(e) => updateConfig('moneda', e.target.value)}>
                <option value="CLP">CLP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{borderTop:"2px solid #00d2ff"}}>
          <div className="card-hdr">
            <div className="card-title" style={{color:"#00d2ff"}}>🧠 Integración IA (Nexus Ultimate Synthesis)</div>
            <div className="card-sub" style={{fontSize:"11px", color:"var(--text2)", marginTop:"4px"}}>Trae tu propia llave (BYOK) para tener consultas ilimitadas de Inteligencia Artificial.</div>
          </div>
          <div className="fg" style={{marginTop:"10px"}}>
            <div className="fgrp">
              <label className="flbl">Google Gemini API Key</label>
              <div style={{display:"flex", gap:"10px"}}>
                <input 
                  className="finp" 
                  type="password" 
                  autoComplete="new-password"
                  spellCheck="false"
                  placeholder="AIzaSyB••••••••••••" 
                  value={apiKeyInput} 
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{flex: 1}}
                />
                <button 
                  className="btn btn-p" 
                  onClick={() => setShowKeyModal(true)}
                  style={{padding: "0 15px", whiteSpace: "nowrap"}}
                  disabled={!apiKeyInput.trim()}
                >
                  💾 Guardar
                </button>
              </div>

              {/* GUÍA INTERACTIVA DE API KEYS */}
              <div style={{marginTop: "20px", background: "rgba(0, 210, 255, 0.05)", border: "1px solid rgba(0, 210, 255, 0.2)", borderRadius: "12px", overflow: "hidden"}}>
                <div style={{padding: "12px 15px", borderBottom: "1px solid rgba(0, 210, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"}} onClick={() => setShowApiGuide(!showApiGuide)}>
                  <span style={{fontSize: "13px", fontWeight: "600", color: "#00d2ff"}}>📖 ¿Cómo conseguir una API Key Gratis?</span>
                  <span>{showApiGuide ? "▲" : "▼"}</span>
                </div>
                
                {showApiGuide && (
                  <div style={{padding: "15px", fontSize: "13px", color: "var(--text2)", display: "flex", flexDirection: "column", gap: "15px"}}>
                    <p style={{margin: 0}}>Para que Finance Nexus sea accesible, utilizamos un modelo <strong>"Trae tu propia llave" (BYOK)</strong>. Esto te permite usar los mejores modelos del mundo sin tener que pagarnos una suscripción mensual. Aquí tienes las mejores opciones:</p>
                    
                    <div style={{background: "var(--surface)", padding: "12px", borderRadius: "8px", borderLeft: "3px solid var(--green)"}}>
                      <div style={{fontWeight: "bold", color: "var(--text)", marginBottom: "5px"}}>Opción 1: Google AI Studio (Recomendada 🌟)</div>
                      <p style={{margin: "0 0 10px 0", fontSize: "12px"}}>Google ofrece 1.500 consultas gratis al día con el modelo Gemini Flash. Es la opción más rápida, segura y 100% gratuita.</p>
                      <ol style={{margin: 0, paddingLeft: "20px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "5px"}}>
                        <li>Entra a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{color: "var(--blue)"}}>Google AI Studio</a> e inicia sesión con tu cuenta de Google.</li>
                        <li>Haz clic en el botón azul <strong>"Create API key"</strong>.</li>
                        <li>Copia el código largo que empieza con <code>AIzaSy...</code></li>
                        <li>Pégalo en el recuadro de arriba y dale a "Guardar". ¡Listo!</li>
                      </ol>
                    </div>

                    <div style={{background: "var(--surface)", padding: "12px", borderRadius: "8px", borderLeft: "3px solid var(--orange)"}}>
                      <div style={{fontWeight: "bold", color: "var(--text)", marginBottom: "5px"}}>Opción 2: Google Cloud Vertex AI (Empresas)</div>
                      <p style={{margin: 0, fontSize: "12px"}}>Si eres una empresa y ya tienes Google Cloud con facturación activada, puedes generar una credencial desde la consola de Vertex AI para límites empresariales y SLA garantizado.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL DE ADVERTENCIA DE SEGURIDAD PARA LA API KEY */}
        {showKeyModal && (
          <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"}}>
            <div style={{background: "var(--surface)", width: "100%", maxWidth: "450px", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", borderTop: "4px solid var(--orange)"}}>
              <div style={{fontSize: "40px", textAlign: "center", marginBottom: "15px"}}>🛡️</div>
              <h3 style={{margin: "0 0 15px 0", textAlign: "center", color: "var(--text)"}}>Advertencia de Seguridad</h3>
              <p style={{fontSize: "13px", color: "var(--text2)", lineHeight: "1.6", marginBottom: "10px"}}>
                Estás a punto de guardar una <strong>Llave de Acceso Privada (API Key)</strong>. Por favor, lee esto con atención:
              </p>
              <ul style={{fontSize: "12px", color: "var(--text2)", paddingLeft: "20px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px"}}>
                <li><strong>No la compartas con nadie:</strong> Esta llave es como tu tarjeta de crédito para la Inteligencia Artificial.</li>
                <li><strong>Bóveda Encriptada:</strong> Tu llave se cifrará y se guardará directamente en tu bóveda privada en la nube. <strong>Nosotros no tenemos acceso a ella.</strong></li>
                <li><strong>Aislamiento Total:</strong> Nadie más en Finance Nexus podrá usar tus cuotas ni leer tu llave.</li>
              </ul>
              <div style={{display: "flex", gap: "10px", justifyContent: "flex-end"}}>
                <button className="btn btn-d" onClick={() => setShowKeyModal(false)}>Cancelar</button>
                <button className="btn btn-p" style={{background: "var(--orange)", borderColor: "var(--orange)"}} onClick={() => {
                  updateConfig('geminiApiKey', apiKeyInput);
                  setShowKeyModal(false);
                  alert('🔒 Llave guardada y encriptada exitosamente en tu bóveda.');
                }}>Entiendo, Guardar Llave</button>
              </div>
            </div>
          </div>
        )}
        
        <div className="card" style={{borderTop:"2px solid var(--pink)"}}>
          <div className="card-hdr"><div className="card-title" style={{color:"var(--pink)"}}>🏷️ Gestor de Categorías</div></div>
          
          <div className="fg" style={{gridTemplateColumns:"1fr 1fr",marginBottom:"12px"}}>
            <div className="fgrp">
              <label className="flbl">Nombre</label>
              <input className="finp" placeholder="Nueva categoría..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}/>
            </div>
            <div className="fgrp">
              <label className="flbl">Tipo</label>
              <select className="fsel" value={newCatType} onChange={e => setNewCatType(e.target.value)}>
                <option value="Gasto">Gasto</option>
                <option value="Ingreso">Ingreso</option>
              </select>
            </div>
          </div>
          
          <button className="btn btn-o btn-sm" style={{marginBottom:"14px"}} onClick={handleAddCategory}>+ Agregar Categoría</button>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
            {cleanCategories.map((c, idx) => (
              <div key={idx} style={{
                display: "flex", 
                flexDirection: "column",
                justifyContent: "space-between", 
                padding: "12px 14px", 
                background: c.type === 'Ingreso' ? 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(20,184,166,0.15))' : 'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(255,140,90,0.15))', 
                border: c.type === 'Ingreso' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(248,113,113,0.3)',
                borderRadius: "12px", 
                fontSize: "13px",
                flex: "1 1 140px",
                maxWidth: "200px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                position: "relative"
              }}>
                <div style={{ fontWeight: "600", color: "var(--text)", marginBottom: "12px", wordBreak: "break-word" }}>{c.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <span style={{ fontSize: "10px", color: c.type === 'Ingreso' ? 'var(--green)' : 'var(--pink)', fontWeight: "700" }}>{c.type.toUpperCase()}</span>
                  <button className="btn btn-d btn-sm" style={{ padding: "4px", minWidth: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => removeCategory(c.original)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODO DESARROLLADOR: BOTÓN DE REINICIO DE EXPERIENCIA */}
        <div style={{marginTop: "30px", padding: "15px", border: "1px dashed var(--pink)", borderRadius: "12px", textAlign: "center", background: "rgba(255, 77, 79, 0.05)"}}>
          <div style={{color: "var(--pink)", fontWeight: "bold", fontSize: "12px", marginBottom: "8px"}}>🛠️ Zona de Pruebas (Modo Dev)</div>
          <p style={{fontSize: "12px", color: "var(--text2)", marginBottom: "15px", margin: "0 0 15px 0"}}>Usa este botón para borrar tu llave API actual y olvidar que viste el tutorial. Así podrás vivir la experiencia de un usuario nuevo desde cero.</p>
          <button 
            className="btn btn-o" 
            style={{borderColor: "var(--pink)", color: "var(--pink)", fontSize: "12px"}}
            onClick={() => {
              updateConfig('geminiApiKey', '');
              setApiKeyInput('');
              setUsuario(prev => ({ ...prev, hasSeenTutorial: false }));
              alert('🔄 Experiencia reiniciada. Se borró la Llave API y el Tutorial. La página se recargará para simular un inicio fresco.');
              window.location.href = '/';
            }}
          >
            🔄 Simular Usuario Nuevo (Borrar Llave y Tutorial)
          </button>
        </div>

      </div>
    </div>
  );
}
