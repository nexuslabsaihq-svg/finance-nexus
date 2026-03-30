import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Configuracion() {
  const { configuracion, setConfiguracion } = useAppData();
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('Gasto');

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
          
          <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
            {cleanCategories.map((c, idx) => (
              <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",background:"var(--glass)",borderRadius:"6px",fontSize:"12.5px"}}>
                <span>{c.name} <span className={`badge ${c.type==='Ingreso'?'bg':'bp'}`} style={{marginLeft:"4px",fontSize:"10px"}}>{c.type}</span></span>
                <button className="btn btn-d btn-sm" onClick={() => removeCategory(c.original)}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
