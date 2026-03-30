import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Inversiones() {
  const { inversiones, setInversiones } = useAppData();

  const [form, setForm] = useState({
    nombre: '',
    institucion: '',
    invertido: '',
    actual: '',
    aporte: ''
  });

  const totalInvertido = inversiones.reduce((sum, i) => sum + Number(i.invertido), 0);
  const valorActual = inversiones.reduce((sum, i) => sum + Number(i.actual), 0);
  const ganancia = valorActual - totalInvertido;
  const retornoPromedio = totalInvertido > 0 ? ((ganancia / totalInvertido) * 100).toFixed(1) : 0;

  const handleCreate = () => {
    if (!form.nombre || !form.invertido || !form.actual) return;
    const inv = Number(form.invertido);
    const act = Number(form.actual);
    const rend = inv > 0 ? `+${((act - inv) / inv * 100).toFixed(1)}%` : '0%';
    const newRecord = {
      ...form,
      id: Date.now(),
      invertido: inv,
      actual: act,
      aporte: Number(form.aporte) || 0,
      rendimiento: rend
    };
    setInversiones([...inversiones, newRecord]);
    setForm({ nombre: '', institucion: '', invertido: '', actual: '', aporte: '' });
  };

  const handleDelete = (id) => {
    setInversiones(inversiones.filter(i => i.id !== id));
  };

  const colors = ['card-glow-g', 'card-glow-b', ''];

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📈 Inversiones</div>
          <div className="page-sub">Portafolio y rendimiento</div>
        </div>
      </div>
      
      <div className="g4">
        <div className="sc sc-b">
          <div className="sc-label">Total Invertido</div>
          <div className="sc-val" style={{color:"var(--blue)"}}>${totalInvertido.toLocaleString()}</div>
          <div className="sc-icon">💼</div>
        </div>
        <div className="sc sc-o">
          <div className="sc-label">Valor Actual</div>
          <div className="sc-val" style={{color:"var(--orange)"}}>${valorActual.toLocaleString()}</div>
          <div className="sc-icon">📈</div>
        </div>
        <div className="sc sc-g">
          <div className="sc-label">Ganancia</div>
          <div className="sc-val" style={{color:"var(--green)"}}>{ganancia >= 0 ? '+' : ''}${ganancia.toLocaleString()}</div>
          <div className="sc-change ch-up">▲ +{retornoPromedio}%</div>
          <div className="sc-icon">✨</div>
        </div>
        <div className="sc sc-g">
          <div className="sc-label">Retorno Promedio</div>
          <div className="sc-val" style={{color:"var(--green)"}}>{retornoPromedio}%</div>
          <div className="sc-change ch-up">▲ Superando meta</div>
          <div className="sc-icon">🎯</div>
        </div>
      </div>
      
      <div className="g2">
        {inversiones.map((inv, idx) => {
          const gncia = Number(inv.actual) - Number(inv.invertido);
          const bgClass = colors[idx % colors.length];
          return (
            <div key={inv.id} className={`card ${bgClass}`}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
                <div>
                  <div style={{fontSize:"14px",fontWeight:"700"}}>{inv.nombre}</div>
                  <div style={{fontSize:"12px",color:"var(--text2)"}}>{inv.institucion}</div>
                </div>
                <span className={`badge ${gncia >= 0 ? 'bg' : 'bo'}`}>📈 {inv.rendimiento}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",fontSize:"13px"}}>
                <div>
                  <div style={{color:"var(--text3)",fontSize:"11px",marginBottom:"3px"}}>INVERTIDO</div>
                  <div style={{fontFamily:"var(--mono)"}}>${Number(inv.invertido).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{color:"var(--text3)",fontSize:"11px",marginBottom:"3px"}}>VALOR ACTUAL</div>
                  <div style={{fontFamily:"var(--mono)",color:"var(--green)"}}>${Number(inv.actual).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{color:"var(--text3)",fontSize:"11px",marginBottom:"3px"}}>GANANCIA</div>
                  <div style={{fontFamily:"var(--mono)",color:"var(--green)"}}>{gncia >= 0 ? '+' : ''}${gncia.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{color:"var(--text3)",fontSize:"11px",marginBottom:"3px"}}>APORTE/MES</div>
                  <div style={{fontFamily:"var(--mono)"}}>${Number(inv.aporte).toLocaleString()}</div>
                </div>
              </div>
              <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
                <button className="btn btn-d btn-sm" onClick={() => handleDelete(inv.id)}>🗑️ Eliminar</button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">➕ Nueva Inversión</div></div>
        <div className="fg fg2">
          <div className="fgrp"><label className="flbl">Nombre del Instrumento</label>
            <input className="finp" placeholder="Ej: Fondo Mutuo A" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Institución</label>
            <input className="finp" placeholder="Ej: Banco Santander" value={form.institucion} onChange={e => setForm({...form, institucion: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Monto Invertido (CLP)</label>
            <input className="finp" type="number" placeholder="$0" value={form.invertido} onChange={e => setForm({...form, invertido: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Valor Actual (CLP)</label>
            <input className="finp" type="number" placeholder="$0" value={form.actual} onChange={e => setForm({...form, actual: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Aporte Mensual (CLP)</label>
            <input className="finp" type="number" placeholder="$0" value={form.aporte} onChange={e => setForm({...form, aporte: e.target.value})} />
          </div>
        </div>
        <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
          <button className="btn btn-o" onClick={handleCreate}>💾 Crear Inversión</button>
          <button className="btn btn-gh" onClick={() => setForm({nombre:'',institucion:'',invertido:'',actual:'',aporte:''})}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
