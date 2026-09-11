import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { BANCOS_CHILE, TARJETAS_CREDITO_CHILE, formatMiles, parseMiles } from '../utils/chileData';

const getBalance = (debt) => Number(debt.balance ?? debt.monto) || 0;

export default function Deudas() {
  const { deudas, setDeudas } = useAppData();

  const [form, setForm] = useState({
    nombre: '',
    institucion: '',
    balance: '',
    pagoMensual: '',
    tasa: '',
    vencimiento: ''
  });

  const deudaTotal = deudas.reduce((sum, d) => sum + getBalance(d), 0);
  const pagoMensualTotal = deudas.reduce((sum, d) => sum + Number(d.pagoMensual), 0);
  const tasaPromedio = deudas.length > 0 ? (deudas.reduce((sum, d) => sum + Number(d.tasa), 0) / deudas.length).toFixed(1) : 0;
  
  const hasHighInterest = deudas.some(d => Number(d.tasa) > 15);

  const handleCreate = () => {
    if (!form.nombre || !form.balance) return;
    const newRecord = {
      ...form,
      id: Date.now(),
      balance: Number(form.balance),
      pagoMensual: Number(form.pagoMensual) || 0,
      tasa: Number(form.tasa) || 0,
      progreso: 0
    };
    setDeudas([...deudas, newRecord]);
    setForm({ nombre: '', institucion: '', balance: '', pagoMensual: '', tasa: '', vencimiento: '' });
  };

  const handlePay = (id) => {
    setDeudas(deudas.map(d => {
      if (d.id === id) {
        const balance = getBalance(d);
        const newBalance = Math.max(0, balance - Number(d.pagoMensual));
        const addedProgress = (Number(d.pagoMensual) / (balance || 1)) * 100;
        return { ...d, balance: newBalance, progreso: Math.min(100, (Number(d.progreso) || 0) + addedProgress) };
      }
      return d;
    }));
  };

  const handleDelete = (id) => {
    setDeudas(deudas.filter(d => d.id !== id));
  };

  const getStyle = (tasa) => {
    const t = Number(tasa);
    if (t === 0) return { bg: 'bgy', color: 'var(--text2)', icon: '👤' };
    if (t < 5) return { bg: 'bb', color: 'var(--blue)', icon: '🏡' };
    if (t < 15) return { bg: 'bo', color: 'var(--orange)', icon: '🏦' };
    return { bg: 'bp', color: 'var(--pink)', icon: '💳' };
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📋 Deudas</div>
          <div className="page-sub">Registro y seguimiento de obligaciones financieras</div>
        </div>
      </div>
      
      <div className="g4">
        <div className="sc sc-p">
          <div className="sc-label">Deuda Total</div>
          <div className="sc-val" style={{color:"var(--pink)"}}>${deudaTotal.toLocaleString()}</div>
          <div className="sc-icon">📋</div>
        </div>
        <div className="sc sc-o">
          <div className="sc-label">Pago Mensual</div>
          <div className="sc-val" style={{color:"var(--orange)"}}>${pagoMensualTotal.toLocaleString()}</div>
          <div className="sc-icon">💸</div>
        </div>
        <div className="sc sc-p">
          <div className="sc-label">Tasa Promedio</div>
          <div className="sc-val" style={{color:"var(--pink)"}}>{tasaPromedio}%</div>
          {Number(tasaPromedio) > 10 && <div className="sc-change ch-dn">▼ Alto</div>}
          <div className="sc-icon">%</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">N° Deudas</div>
          <div className="sc-val" style={{color:"var(--blue)"}}>{deudas.length}</div>
          <div className="sc-icon">🔢</div>
        </div>
      </div>
      
      {hasHighInterest && (
        <div className="alert al-p">
          <span className="al-icon">🔥</span>
          <div className="al-body">
            <div className="al-title" style={{color:"var(--pink)"}}>Deuda de alto interés detectada</div>
            Tienes deudas que superan el 15% anual. Se recomienda priorizar su pago urgente.
          </div>
        </div>
      )}
      
      <div className="g2">
        {deudas.map(d => {
          const s = getStyle(d.tasa);
          return (
            <div key={d.id} className="debt-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
                <div>
                  <div style={{fontSize:"14px",fontWeight:"700"}}>{s.icon} {d.nombre || d.desc || 'Deuda sin nombre'}</div>
                  <div style={{fontSize:"12px",color:"var(--text2)"}}>{d.institucion || d.cat || 'Sin institución'}</div>
                </div>
                <span className={`badge ${s.bg}`}>{d.tasa}% anual</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",fontSize:"12.5px",marginBottom:"12px"}}>
                <div>
                  <div style={{color:"var(--text3)",fontSize:"11px"}}>BALANCE</div>
                  <div style={{fontFamily:"var(--mono)",color:s.color}}>${getBalance(d).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{color:"var(--text3)",fontSize:"11px"}}>PAGO/MES</div>
                  <div style={{fontFamily:"var(--mono)"}}>${Number(d.pagoMensual).toLocaleString()}</div>
                </div>
              </div>
              <div className="pt" style={{marginBottom:"12px"}}>
                <div className="pf" style={{width:`${Math.min(100, d.progreso || 0)}%`,background:s.color}}></div>
              </div>
              <div style={{fontSize:"11px",color:"var(--text2)",marginBottom:"12px"}}>
                {d.vencimiento ? `Vencimiento: ${d.vencimiento} · ` : ''}Interés anual aprox: ${(getBalance(d)*Number(d.tasa)/100).toLocaleString()}
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="btn btn-o btn-sm" onClick={() => handlePay(d.id)}>Pagar Ahora</button>
                <button className="btn btn-d btn-sm" onClick={() => handleDelete(d.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">➕ Registrar Nueva Deuda</div></div>
        <div className="fg fg2">
          <div className="fgrp">
            <label className="flbl">Nombre (Ej: Avance, CAE, Automotriz)</label>
            <input className="finp" placeholder="Ej: Tarjeta de Crédito" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="fgrp">
            <label className="flbl">Institución (Banco o Casa Comercial)</label>
            <select className="fsel" value={form.institucion} onChange={e => setForm({...form, institucion: e.target.value})}>
              <option value="">Selecciona...</option>
              <optgroup label="Bancos">
                {BANCOS_CHILE.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </optgroup>
              <optgroup label="Tarjetas">
                {TARJETAS_CREDITO_CHILE.map(t => <option key={t} value={t}>{t}</option>)}
              </optgroup>
            </select>
          </div>
          <div className="fgrp">
            <label className="flbl" title="La cantidad total que aún debes pagar">Balance Pendiente (CLP) <span style={{cursor:'help', color:'var(--orange)'}}>(?)</span></label>
            <input className="finp" type="text" placeholder="$0" value={formatMiles(form.balance)} onChange={e => setForm({...form, balance: parseMiles(e.target.value)})} />
          </div>
          <div className="fgrp">
            <label className="flbl" title="La cuota o pago mínimo que haces al mes">Pago Mensual (CLP) <span style={{cursor:'help', color:'var(--orange)'}}>(?)</span></label>
            <input className="finp" type="text" placeholder="$0" value={formatMiles(form.pagoMensual)} onChange={e => setForm({...form, pagoMensual: parseMiles(e.target.value)})} />
          </div>
          <div className="fgrp">
            <label className="flbl" title="El Costo Anual Equivalente o la Tasa de Interés Anual">Tasa Anual (CAE) <span style={{cursor:'help', color:'var(--orange)'}}>(?)</span></label>
            <div style={{position:'relative'}}>
              <input className="finp" type="number" step="0.1" placeholder="Ej: 18.5" value={form.tasa} onChange={e => setForm({...form, tasa: e.target.value})} style={{paddingRight: '25px'}} />
              <span style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', color:'var(--text2)', pointerEvents:'none'}}>%</span>
            </div>
          </div>
          <div className="fgrp">
            <label className="flbl">Próximo Vencimiento</label>
            <input className="finp" type="date" value={form.vencimiento} onChange={e => setForm({...form, vencimiento: e.target.value})} />
          </div>
        </div>
        <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
          <button className="btn btn-o" onClick={handleCreate}>💾 Registrar Deuda</button>
          <button className="btn btn-gh" onClick={() => setForm({nombre:'',institucion:'',balance:'',pagoMensual:'',tasa:'',vencimiento:''})}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
