import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Ingresos() {
  const { ingresos, setIngresos } = useAppData();

  const [form, setForm] = useState({ desc: '', cat: 'Salario', monto: '', fecha: new Date().toISOString().split('T')[0], fuente: 'Banco Santander', notas: '' });

  const total = ingresos.reduce((s, i) => s + Number(i.monto), 0);
  const max = Math.max(...ingresos.map(i => Number(i.monto)), 0);
  const promed = ingresos.length > 0 ? (total / ingresos.length) : 0;

  const handleCreate = () => {
    if(!form.desc || !form.monto) return;
    const newRecord = { ...form, id: Date.now(), monto: Number(form.monto) };
    setIngresos([newRecord, ...ingresos]);
    setForm({ desc: '', cat: 'Salario', monto: '', fecha: new Date().toISOString().split('T')[0], fuente: 'Banco Santander', notas: '' });
  };

  const handleDelete = (id) => {
    setIngresos(ingresos.filter(i => i.id !== id));
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>

      <div className="page-hdr"><div><div className="page-title">💰 Ingresos</div><div className="page-sub">Registro y análisis de fuentes de ingresos</div></div></div>
      <div className="g4">
        <div className="sc sc-o"><div className="sc-label">Ingresos Totales</div><div className="sc-val" style={{"color":"var(--orange)"}}>${total.toLocaleString()}</div><div className="sc-change ch-n">Histórico</div><div className="sc-icon">💰</div></div>
        <div className="sc sc-g"><div className="sc-label">Promedio Transacción</div><div className="sc-val" style={{"color":"var(--green)"}}>${promed.toLocaleString(undefined, {maximumFractionDigits:0})}</div><div className="sc-change ch-n">General</div><div className="sc-icon">📊</div></div>
        <div className="sc sc-b"><div className="sc-label">Transacciones</div><div className="sc-val" style={{"color":"var(--blue)"}}>{ingresos.length}</div><div className="sc-change ch-up">▲</div><div className="sc-icon">🔢</div></div>
        <div className="sc sc-pu"><div className="sc-label">Mayor Ingreso</div><div className="sc-val" style={{"color":"var(--purple)"}}>${max.toLocaleString()}</div><div className="sc-change ch-n">Máximo</div><div className="sc-icon">🏆</div></div>
      </div>
      <div className="card"><div className="card-hdr"><div><div className="card-title">Tendencia de Ingresos</div><div className="card-sub">Últimos 6 meses</div></div><span className="badge bg">↑ Creciendo</span></div>
        <svg width="100%" viewBox="0 0 520 90" preserveAspectRatio="none" style={{"height":"90px"}}>
          <defs><linearGradient id="gi2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7ED321" stopOpacity="0.3"/><stop offset="95%" stopColor="#7ED321" stopOpacity="0.01"/></linearGradient></defs>
          <path d="M0,75 C87,68 87,60 173,50 C260,40 260,45 346,32 C433,20 433,10 520,5 L520,90 L0,90Z" fill="url(#gi2)"/>
          <path d="M0,75 C87,68 87,60 173,50 C260,40 260,45 346,32 C433,20 433,10 520,5" fill="none" stroke="#7ED321" strokeWidth="2.5"/>
          <circle cx="0" cy="75" r="4" fill="#7ED321"/><circle cx="104" cy="64" r="4" fill="#7ED321"/><circle cx="208" cy="48" r="4" fill="#7ED321"/><circle cx="312" cy="38" r="4" fill="#7ED321"/><circle cx="416" cy="22" r="4" fill="#7ED321"/><circle cx="520" cy="5" r="5" fill="#7ED321" stroke="var(--surface)" strokeWidth="2"/>
          <text x="0" y="87" font-size="9" fill="rgba(139,156,200,0.6)" font-family="sans-serif">Oct</text><text x="95" y="87" font-size="9" fill="rgba(139,156,200,0.6)" font-family="sans-serif">Nov</text><text x="198" y="87" font-size="9" fill="rgba(139,156,200,0.6)" font-family="sans-serif">Dic</text><text x="298" y="87" font-size="9" fill="rgba(139,156,200,0.6)" font-family="sans-serif">Ene</text><text x="398" y="87" font-size="9" fill="rgba(139,156,200,0.6)" font-family="sans-serif">Feb</text><text x="495" y="87" font-size="9" fill="rgba(139,156,200,0.6)" font-family="sans-serif">Mar</text>
        </svg>
      </div>
      <div className="card"><div className="card-hdr"><div className="card-title">➕ Registrar Ingreso</div></div>
        <div className="fg fg2">
          <div className="fgrp"><label className="flbl">Descripción</label><input className="finp" placeholder="Ej: Salario mensual" value={form.desc} onChange={e=>setForm({...form, desc:(e.target.value)})}/></div>
          <div className="fgrp"><label className="flbl">Categoría</label><select className="fsel" value={form.cat} onChange={e=>setForm({...form, cat:(e.target.value)})}><option>Salario</option><option>Freelance</option><option>Inversiones</option><option>Arriendo</option><option>Otros</option></select></div>
          <div className="fgrp"><label className="flbl">Monto (CLP)</label><input className="finp" type="number" placeholder="$0" value={form.monto} onChange={e=>setForm({...form, monto:(e.target.value)})}/></div>
          <div className="fgrp"><label className="flbl">Fecha</label><input className="finp" type="date" value={form.fecha} onChange={e=>setForm({...form, fecha:(e.target.value)})}/></div>
          <div className="fgrp"><label className="flbl">Fuente</label><select className="fsel" value={form.fuente} onChange={e=>setForm({...form, fuente:(e.target.value)})}><option>Banco Santander</option><option>BCI</option><option>BancoEstado</option><option>Transferencia</option><option>Efectivo</option></select></div>
          <div className="fgrp"><label className="flbl">Notas</label><input className="finp" placeholder="Opcional..." value={form.notas} onChange={e=>setForm({...form, notas:(e.target.value)})}/></div>
        </div>
        <div style={{"marginTop":"14px","display":"flex","gap":"8px"}}><button className="btn btn-o" onClick={handleCreate}>💾 Guardar</button><button className="btn btn-gh" onClick={() => setForm({ desc: '', cat: 'Salario', monto: '', fecha: new Date().toISOString().split('T')[0], fuente: 'Banco Santander', notas: '' })}>Cancelar</button></div>
      </div>
      <div className="card"><div className="card-hdr"><div className="card-title">Historial de Ingresos</div></div>
        <div className="tw"><table><thead><tr><th>Descripción</th><th>Categoría</th><th className="r">Monto</th><th>Fecha</th><th>Fuente</th><th>Acciones</th></tr></thead><tbody>
          {ingresos.map(i => (
            <tr key={i.id}><td className="tdp">💰 {i.desc}</td><td><span className="badge bb">{i.cat}</span></td><td className="tdr pos">+${Number(i.monto).toLocaleString()}</td><td className="tdm" style={{"fontSize":"12px","color":"var(--text2)"}}>{i.fecha}</td><td>{i.fuente}</td><td style={{"display":"flex","gap":"5px"}}><button className="btn btn-d btn-sm" onClick={()=>handleDelete(i.id)}>🗑️</button></td></tr>
          ))}
        </tbody></table></div>
      </div>

    </div>
  );
}
