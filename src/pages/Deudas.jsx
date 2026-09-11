import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { BANCOS_CHILE, TARJETAS_CREDITO_CHILE, formatMiles, parseMiles } from '../utils/chileData';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ZAxis } from 'recharts';

const COLORS = ['#E85D75', '#FF9A76', '#FBBF24', '#7ED321', '#6B7FD6', '#A855F7', '#38BDF8'];

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

  const distribucionDeuda = useMemo(() => {
    return deudas.map(d => ({
      name: d.nombre.substring(0, 15) + (d.nombre.length > 15 ? '...' : ''),
      value: getBalance(d)
    })).filter(d => d.value > 0).sort((a,b) => b.value - a.value);
  }, [deudas]);

  const scatterData = useMemo(() => {
    return deudas.map(d => ({
      name: d.nombre,
      balance: getBalance(d),
      tasa: Number(d.tasa) || 0,
      pago: Number(d.pagoMensual) || 0
    })).filter(d => d.balance > 0);
  }, [deudas]);

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

      {deudas.length > 0 && (
        <div style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
          <div className="card" style={{flex: '1 1 300px', minWidth:'300px'}}>
            <div className="card-hdr"><div className="card-title">🍩 Carga de Deuda</div></div>
            <div style={{height:'300px', width:'100%'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieGlowDeuda" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
                    </filter>
                  </defs>
                  <Pie
                    data={distribucionDeuda}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="var(--surface)"
                    strokeWidth={2}
                    filter="url(#pieGlowDeuda)"
                  >
                    {distribucionDeuda.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, 'Deuda']}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: 'var(--text)', padding: '12px' }}
                    itemStyle={{ fontWeight: '500', color: 'var(--text2)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize:'12px', fontWeight: 500}} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{flex: '2 1 400px'}}>
            <div className="card-hdr">
              <div><div className="card-title">⚠️ Tasa de Interés vs Balance</div><div className="card-sub">Encuentra las deudas más tóxicas (alto balance, alta tasa)</div></div>
            </div>
            <div style={{height:'300px', width:'100%', padding:'10px 0'}}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
                  <XAxis type="number" dataKey="balance" name="Balance" tickFormatter={(val) => `$${(val/1000)}k`} stroke="var(--text2)" tick={{fontSize: 12}} />
                  <YAxis type="number" dataKey="tasa" name="Tasa %" unit="%" stroke="var(--text2)" tick={{fontSize: 12}} />
                  <ZAxis type="number" dataKey="pago" range={[50, 400]} name="Pago Mensual" />
                  <RechartsTooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                    formatter={(value, name) => [
                      <span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>{name === 'Tasa %' ? `${value}%` : `$${value.toLocaleString('es-CL')}`}</span>, 
                      name
                    ]}
                    labelFormatter={() => ''}
                  />
                  <Scatter name="Deudas" data={scatterData} fill="var(--pink)" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
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
