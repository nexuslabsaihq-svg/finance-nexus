import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Ahorros() {
  const { ahorros, setAhorros } = useAppData();

  const [form, setForm] = useState({
    nombre: '',
    emoji: '🏠',
    meta: '',
    aporte: '',
    fecha: '',
    desc: ''
  });

  const totalAhorrado = ahorros.reduce((sum, a) => sum + Number(a.actual || 0), 0);
  const metasActivas = ahorros.length;
  
  const pctPromedio = ahorros.length > 0 
    ? ahorros.reduce((sum, a) => sum + Math.min(100, (Number(a.actual || 0) / Number(a.objetivo || 1)) * 100), 0) / ahorros.length
    : 0;

  const handleCreate = () => {
    if (!form.nombre || !form.meta) return;
    const newRecord = {
      ...form,
      id: Date.now(),
      objetivo: Number(form.meta),
      aporte: Number(form.aporte),
      actual: 0
    };
    setAhorros([...ahorros, newRecord]);
    setForm({ nombre: '', emoji: '🏠', meta: '', aporte: '', fecha: '', desc: '' });
  };

  const handleContribute = (id) => {
    setAhorros(ahorros.map(a => {
      if (a.id === id) {
        return { ...a, actual: Number(a.actual || 0) + Number(a.aporte || 0) };
      }
      return a;
    }));
  };

  const handleDelete = (id) => {
    setAhorros(ahorros.map(a => {
      if (a.id === id) {
        return { ...a, deleted: true };
      }
      return a;
    }).filter(a => !a.deleted));
  }

  const getGradient = (pct) => {
    if (pct < 30) return 'linear-gradient(90deg,var(--orange),var(--orange2))';
    if (pct < 70) return 'linear-gradient(90deg,var(--blue),var(--cyan))';
    return 'linear-gradient(90deg,var(--green),#4ade80)';
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🎯 Ahorros</div>
          <div className="page-sub">Metas de ahorro y seguimiento</div>
        </div>
      </div>
      
      <div className="g3">
        <div className="sc sc-g">
          <div className="sc-label">Total Ahorrado</div>
          <div className="sc-val" style={{color:"var(--green)"}}>${totalAhorrado.toLocaleString()}</div>
          <div className="sc-change ch-up">▲ {metasActivas} metas activas</div>
          <div className="sc-icon">💎</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">Metas Activas</div>
          <div className="sc-val" style={{color:"var(--blue)"}}>{metasActivas}</div>
          <div className="sc-icon">🎯</div>
        </div>
        <div className="sc sc-o">
          <div className="sc-label">Progreso Promedio</div>
          <div className="sc-val" style={{color:"var(--orange)"}}>{pctPromedio.toFixed(1)}%</div>
          <div className="sc-change ch-up">▲ Buen ritmo</div>
          <div className="sc-icon">📊</div>
        </div>
      </div>
      
      <div className="g2">
        {ahorros.map(a => {
          const pct = Math.min(100, Math.round((Number(a.actual || 0) / Number(a.objetivo || 1)) * 100)) || 0;
          return (
            <div key={a.id} className="goal-card">
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontSize:"24px"}}>{a.emoji || '🎯'}</span>
                <div>
                  <div style={{fontSize:"14px",fontWeight:"700"}}>{a.nombre}</div>
                  <div style={{fontSize:"12px",color:"var(--text2)"}}>Meta: ${(Number(a.objetivo)||0).toLocaleString()}</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"12.5px"}}>
                <span style={{color:"var(--green)",fontFamily:"var(--mono)",fontWeight:"600"}}>${(Number(a.actual)||0).toLocaleString()} ahorrados</span>
                <span style={{color:"var(--text2)"}}>{pct}%</span>
              </div>
              <div className="pt">
                <div className="pf" style={{width:`${pct}%`,background:getGradient(pct)}}></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"var(--text2)"}}>
                <span>${Number(a.aporte).toLocaleString()}/mes</span>
                <span>🗓️ {a.fecha || 'Sin fecha'}</span>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="btn btn-o btn-sm" onClick={() => handleContribute(a.id)}>Contribuir</button>
                <button className="btn btn-gh btn-sm" onClick={() => handleDelete(a.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">➕ Nueva Meta de Ahorro</div></div>
        <div className="fg fg2">
          <div className="fgrp"><label className="flbl">Nombre</label>
            <input className="finp" placeholder="Ej: Fondo de Emergencia" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Emoji</label>
            <select className="fsel" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})}>
              <option>🏠</option><option>✈️</option><option>🚗</option><option>📚</option><option>💊</option><option>🎯</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Monto Objetivo (CLP)</label>
            <input className="finp" type="number" placeholder="$0" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Contribución Mensual</label>
            <input className="finp" type="number" placeholder="$0" value={form.aporte} onChange={e => setForm({...form, aporte: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Fecha Objetivo</label>
            <input className="finp" type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Descripción</label>
            <input className="finp" placeholder="Describe tu meta..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
          </div>
        </div>
        <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
          <button className="btn btn-o" onClick={handleCreate}>💾 Crear Meta</button>
          <button className="btn btn-gh" onClick={() => setForm({nombre:'',emoji:'🏠',meta:'',aporte:'',fecha:'',desc:''})}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
