import React, { useState, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import { GeminaKey } from '../firebase/config';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export default function Documentos() {
  const { ingresos, setIngresos, gastos, setGastos, deudas, setDeudas } = useAppData();
  
  // Local states
  const [activeTab, setActiveTab] = useState('import'); // 'import', 'manual', 'library'
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null); // the parsed JSON from Gemini

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
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

  const processFileWithGemini = async (file) => {
    setProcessing(true);
    setExtractedData(null);
    try {
      if (!GeminaKey) throw new Error("Falta la API Key de Gemini.");

      const genAI = new GoogleGenerativeAI(GeminaKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              modulo: { type: SchemaType.STRING, description: "ingresos, gastos, o deudas" },
              desc: { type: SchemaType.STRING, description: "Descripción corta del documento" },
              monto: { type: SchemaType.NUMBER, description: "Monto total extraído" },
              cat: { type: SchemaType.STRING, description: "Categoría sugerida relacionada" },
              fecha: { type: SchemaType.STRING, description: "Fecha en formato YYYY-MM-DD" }
            },
            required: ["modulo", "desc", "monto", "cat", "fecha"]
          }
        }
      });
      
      const filePart = await fileToGenerativePart(file);
      const prompt = `Analiza este documento (recibo, factura, comprobante). Extrae la información para insertarla en un software contable. Determina estrictamente en qué módulo va: 'ingresos', 'gastos', o 'deudas'. Si el documento representa dinero que entra o que se debe cobrar, es ingresos. Si es una compra pagada de contado, es gastos. Si es un crédito, multa pendiente o deuda al portador, es deudas.`;
      
      const result = await model.generateContent([prompt, filePart]);
      const data = JSON.parse(result.response.text());
      setExtractedData({ ...data, fileName: file.name, fileObj: file });
    } catch (e) {
      alert("Error al procesar el archivo: " + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      await processFileWithGemini(f);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      await processFileWithGemini(f);
    }
  };

  const confirmImport = () => {
    if(!extractedData) return;
    const item = {
      id: Date.now(),
      desc: extractedData.desc,
      cat: extractedData.cat,
      monto: extractedData.monto,
      fecha: extractedData.fecha,
      notas: `Doc: ${extractedData.fileName}`,
      fuente: extractedData.modulo === 'ingresos' ? 'Pendiente' : undefined,
      cuenta: extractedData.modulo === 'gastos' ? 'Pendiente' : undefined,
    };
    if (extractedData.modulo === 'ingresos') setIngresos(prev => [item, ...prev]);
    if (extractedData.modulo === 'gastos') setGastos(prev => [item, ...prev]);
    if (extractedData.modulo === 'deudas') {
      setDeudas(prev => [{
        id: item.id,
        nombre: item.desc,
        institucion: item.cat,
        balance: Number(item.monto) || 0,
        pagoMensual: 0,
        tasa: 0,
        vencimiento: item.fecha,
        progreso: 0,
        notas: item.notas
      }, ...prev]);
    }
    
    alert(`Importado con éxito en ${extractedData.modulo}`);
    setExtractedData(null);
  };

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📂 Documentos Inteligentes</div>
          <div className="page-sub">Análisis y registro de datos extraídos; los archivos no se almacenan.</div>
        </div>
      </div>
      
      <div className="tabs">
        <button className={`tab ${activeTab==='import'?'active':''}`} onClick={()=>setActiveTab('import')}>Carga IA</button>
        <button className={`tab ${activeTab==='manual'?'active':''}`} onClick={()=>setActiveTab('manual')}>Ingreso Manual</button>
        <button className={`tab ${activeTab==='library'?'active':''}`} onClick={()=>setActiveTab('library')}>Registros importados</button>
      </div>

      {activeTab === 'import' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!extractedData && !processing && (
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              style={{
                flex: 1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                border: `2px dashed ${dragActive ? 'var(--blue)' : 'var(--border)'}`,
                background: dragActive ? 'rgba(107, 127, 214, 0.05)' : 'var(--surface2)',
                borderRadius: "16px", cursor: "pointer", transition: "all 0.2s"
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <div style={{fontSize:"48px", marginBottom:"10px"}}>📥</div>
              <div style={{fontSize:"18px", fontWeight:"600", color:"var(--text)"}}>Arrastra un comprobante o factura aquí</div>
              <div style={{fontSize:"13px", color:"var(--text3)", marginTop:"5px"}}>Selecciona un PDF, JPG o PNG para extraer sus datos.</div>
              <input ref={fileInputRef} type="file" style={{display:"none"}} accept="image/*,application/pdf" onChange={handleChange} />
            </div>
          )}

          {processing && (
            <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", background:"var(--surface2)", borderRadius:"16px", border:"1px solid var(--border)"}}>
              <div style={{fontSize:"48px", animation:"pulse 1.5s infinite", marginBottom:"10px"}}>✨</div>
              <div style={{color:"var(--text2)", fontWeight:"600"}}>Gémini está analizando el documento...</div>
            </div>
          )}

          {extractedData && !processing && (
            <div className="card card-glow-b" style={{flex: 1, display:"flex", flexDirection:"column"}}>
              <div className="card-hdr">
                <div className="card-title">✅ Datos Extraídos Exitosamente</div>
              </div>
              <div style={{display:"flex", gap:"20px"}}>
                <div style={{flex:1, background:"var(--surface)", borderRadius:"12px", border:"1px solid var(--border)", padding:"20px", display:"flex", flexDirection:"column", gap:"15px"}}>
                  <div className="fgrp">
                    <label className="flbl" style={{color:"var(--blue)"}}>Módulo Destino Sugerido</label>
                    <div style={{fontSize:"16px", fontWeight:"700", textTransform:"capitalize"}}>{extractedData.modulo}</div>
                  </div>
                  <div className="fgrp">
                    <label className="flbl">Descripción detectada</label>
                    <input className="finp" value={extractedData.desc} onChange={(e)=>setExtractedData({...extractedData, desc: e.target.value})} />
                  </div>
                  <div className="fgrp">
                    <label className="flbl">Monto Financiero ($)</label>
                    <input type="number" className="finp" value={extractedData.monto} onChange={(e)=>setExtractedData({...extractedData, monto: Number(e.target.value)})} />
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                    <div className="fgrp"><label className="flbl">Categoría</label><input className="finp" value={extractedData.cat} onChange={(e)=>setExtractedData({...extractedData, cat: e.target.value})} /></div>
                    <div className="fgrp"><label className="flbl">Fecha</label><input type="date" className="finp" value={extractedData.fecha} onChange={(e)=>setExtractedData({...extractedData, fecha: e.target.value})} /></div>
                  </div>
                </div>
                
                <div style={{width:"250px", background:"var(--surface)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRadius:"12px", border:"1px dashed var(--border)", color:"var(--text3)", padding:"15px", textAlign:"center"}}>
                  <div style={{fontSize:"40px", marginBottom:"10px"}}>📄</div>
                  <div style={{fontSize:"12px", fontWeight:"600", color:"var(--text2)", wordBreak:"break-all"}}>{extractedData.fileName}</div>
                  <div style={{fontSize:"11px", marginTop:"5px"}}>El archivo se usa para la extracción y no queda almacenado en la aplicación.</div>
                </div>
              </div>

              <div style={{display:"flex", gap:"10px", marginTop:"20px"}}>
                <button className="btn btn-p" onClick={confirmImport} style={{flex: 1}}>✅ Confirmar y Guardar en {extractedData.modulo}</button>
                <button className="btn btn-d" onClick={() => setExtractedData(null)}>✖ Descartar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="card" style={{ flex: 1, overflowY:"auto" }}>
          <div className="card-hdr"><div className="card-title">📝 Ingreso Manual de Documento</div></div>
          <div style={{display:"flex", flexDirection:"column", gap:"20px", maxWidth:"500px", margin:"0 auto", padding:"20px 0"}}>
            <div className="fgrp">
              <label className="flbl">Módulo Destino</label>
              <select className="finp" id="man_mod">
                <option value="gastos">Gastos</option>
                <option value="ingresos">Ingresos</option>
                <option value="deudas">Deudas</option>
              </select>
            </div>
            <div className="fgrp"><label className="flbl">Descripción</label><input type="text" className="finp" id="man_desc" placeholder="Factura de insumos..." /></div>
            <div className="fgrp"><label className="flbl">Monto Financiero ($)</label><input type="number" className="finp" id="man_mon" placeholder="150000" /></div>
            <div className="fgrp"><label className="flbl">Categoría</label><input type="text" className="finp" id="man_cat" placeholder="Operativa" /></div>
            <div className="fgrp"><label className="flbl">Fecha</label><input type="date" className="finp" id="man_fec" /></div>
            <button className="btn btn-p" onClick={() => {
               const mod = document.getElementById('man_mod').value;
               const item = {
                 id: Date.now(),
                 desc: document.getElementById('man_desc').value || 'Sin descripción',
                 monto: Number(document.getElementById('man_mon').value) || 0,
                 cat: document.getElementById('man_cat').value || 'General',
                 fecha: document.getElementById('man_fec').value || new Date().toISOString().split('T')[0],
                 notas: 'Doc: Ingresado Manualmente',
                 cuenta: 'Pendiente',
                 fuente: 'Pendiente'
               };
               if(mod === 'ingresos') setIngresos(prev => [item, ...prev]);
               if(mod === 'gastos') setGastos(prev => [item, ...prev]);
               if(mod === 'deudas') setDeudas(prev => [{
                 id: item.id,
                 nombre: item.desc,
                 institucion: item.cat,
                 balance: item.monto,
                 pagoMensual: 0,
                 tasa: 0,
                 vencimiento: item.fecha,
                 progreso: 0,
                 notas: item.notas
               }, ...prev]);
               
               alert('Guardado exitosamente en ' + mod);
               document.getElementById('man_desc').value = '';
               document.getElementById('man_mon').value = '';
               document.getElementById('man_cat').value = '';
            }}>Guardar Documento 💾</button>
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="card" style={{ flex: 1, overflowY:"auto" }}>
          <div className="card-hdr"><div className="card-title">📚 Registros importados</div></div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"15px", marginTop:"15px"}}>
            {[...ingresos, ...gastos, ...deudas]
              .filter(i => i.notas && i.notas.includes('Doc:'))
              .map(i => (
                <div key={i.id} style={{background:"var(--surface3)", border:"1px solid var(--border)", borderRadius:"12px", padding:"15px", display:"flex", flexDirection:"column", gap:"8px"}}>
                  <div style={{fontSize:"30px", textAlign:"center", marginBottom:"5px"}}>📄</div>
                  <div style={{fontSize:"13px", fontWeight:"600", whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden"}} title={i.desc || i.nombre}>{i.desc || i.nombre}</div>
                  <div style={{fontSize:"18px", fontWeight:"700", fontFamily:"var(--mono)", color: 'var(--text)'}}>${Number(i.monto ?? i.balance).toLocaleString()}</div>
                  <div style={{fontSize:"11px", color:"var(--text2)"}}>{i.fecha || i.vencimiento} • {i.cat || i.institucion}</div>
                  <div style={{background:"rgba(0,0,0,0.2)", padding:"4px", borderRadius:"4px", fontSize:"10px", color:"var(--text3)", wordBreak:"break-all"}}>{i.notas}</div>
                </div>
            ))}
            {[...ingresos, ...gastos, ...deudas].filter(i => i.notas && i.notas.includes('Doc:')).length === 0 && (
              <div style={{gridColumn:"1/-1", textAlign:"center", padding:"40px", color:"var(--text3)"}}>No hay registros importados. Carga un archivo para extraer y registrar sus datos.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
