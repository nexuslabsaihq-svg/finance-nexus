import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { BANCOS_CHILE, formatMiles, parseMiles } from '../utils/chileData';

export default function Bancos() {
  const { bancos, setBancos, authUser } = useAppData();

  const [form, setForm] = useState({
    nombre: 'Banco Santander',
    tipo: 'Cuenta Corriente',
    numero: '',
    saldo: '',
    moneda: 'CLP',
    titular: authUser?.displayName || 'Usuario'
  });
  
  const [editId, setEditId] = useState(null);

  const total = bancos.reduce((s, b) => s + Number(b.saldo), 0);
  const totalCorriente = bancos.filter(b => b.tipo === 'Cuenta Corriente').reduce((s, b) => s + Number(b.saldo), 0);
  const totalAhorro = bancos.filter(b => b.tipo.includes('Ahorro') || b.tipo.includes('Vista')).reduce((s, b) => s + Number(b.saldo), 0);
  const totalEfectivo = bancos.filter(b => b.tipo === 'Efectivo').reduce((s, b) => s + Number(b.saldo), 0);

  const colors = [
    { bg: 'linear-gradient(135deg,rgba(255,154,118,0.15),rgba(255,154,118,0.04))', border: 'rgba(255,154,118,0.25)', text: 'var(--orange)', badge: 'VISA' },
    { bg: 'linear-gradient(135deg,rgba(107,127,214,0.15),rgba(107,127,214,0.04))', border: 'rgba(107,127,214,0.25)', text: 'var(--blue)', badge: 'MC' },
    { bg: 'linear-gradient(135deg,rgba(126,211,33,0.12),rgba(126,211,33,0.03))', border: 'rgba(126,211,33,0.2)', text: 'var(--green)', badge: '' },
    { bg: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(168,85,247,0.04))', border: 'rgba(168,85,247,0.25)', text: 'var(--purple)', badge: '' },
    { bg: 'linear-gradient(135deg,rgba(52,211,153,0.15),rgba(52,211,153,0.04))', border: 'rgba(52,211,153,0.25)', text: '#34d399', badge: '' }
  ];

  const handleCreateOrUpdate = () => {
    if (!form.nombre || form.saldo === '') return;
    const montoNum = Number(form.saldo);
    
    if (editId) {
      setBancos(bancos.map(b => b.id === editId ? { ...b, ...form, saldo: montoNum } : b));
      setEditId(null);
    } else {
      const newRecord = { ...form, id: Date.now().toString(), saldo: montoNum };
      setBancos([...bancos, newRecord]);
    }
    
    setForm({ nombre: 'Banco Santander', tipo: 'Cuenta Corriente', numero: '', saldo: '', moneda: 'CLP', titular: authUser?.displayName || 'Usuario' });
  };

  const handleEdit = (b) => {
    setForm({
      nombre: b.nombre,
      tipo: b.tipo,
      numero: b.numero || '',
      saldo: b.saldo,
      moneda: b.moneda || 'CLP',
      titular: b.titular || authUser?.displayName || 'Usuario'
    });
    setEditId(b.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setBancos(bancos.filter(b => b.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({ nombre: 'Banco Santander', tipo: 'Cuenta Corriente', numero: '', saldo: '', moneda: 'CLP', titular: authUser?.displayName || 'Usuario' });
    }
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🏦 Bancos y Cuentas</div>
          <div className="page-sub">Gestión de cuentas bancarias y efectivo</div>
        </div>
      </div>
      
      <div className="g4">
        <div className="sc sc-o"><div className="sc-label">Saldo Consolidado</div><div className="sc-val" style={{color:"var(--orange)"}}>${total.toLocaleString()}</div><div className="sc-change ch-n">{bancos.length} cuentas activas</div><div className="sc-icon">🏦</div></div>
        <div className="sc sc-b"><div className="sc-label">Cuentas Corrientes</div><div className="sc-val" style={{color:"var(--blue)"}}>${totalCorriente.toLocaleString()}</div><div className="sc-icon">💳</div></div>
        <div className="sc sc-g"><div className="sc-label">Cuentas Ahorro</div><div className="sc-val" style={{color:"var(--green)"}}>${totalAhorro.toLocaleString()}</div><div className="sc-icon">💎</div></div>
        <div className="sc sc-pu"><div className="sc-label">Efectivo</div><div className="sc-val" style={{color:"var(--purple)"}}>${totalEfectivo.toLocaleString()}</div><div className="sc-icon">💵</div></div>
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">Distribución de Fondos</div></div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          {/* Gráfico Donut */}
          <div style={{ width: '200px', height: '200px', flexShrink: 0 }}>
            {bancos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bancos.map(b => ({ name: b.nombre, value: Number(b.saldo) }))}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {bancos.map((b, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length].text} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{width:'100%', height:'100%', background:'var(--surface2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <span style={{color:'var(--text2)', fontSize:'12px'}}>Sin datos</span>
              </div>
            )}
          </div>

          {/* Leyenda y Barra Horizontal */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{display:'flex', width:'100%', height:'24px', borderRadius:'12px', overflow:'hidden', marginBottom:'15px'}}>
              {bancos.length === 0 && <div style={{width:'100%', background:'var(--surface2)'}}></div>}
              {bancos.map((b, i) => {
                const pct = total > 0 ? (b.saldo / total) * 100 : 0;
                if (pct <= 0) return null;
                return <div key={b.id} style={{width: `${pct}%`, background: colors[i % colors.length].text, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#000', fontWeight:'bold', overflow:'hidden', whiteSpace:'nowrap'}} title={`${b.nombre} - ${pct.toFixed(1)}%`}>
                  {pct > 10 ? `${pct.toFixed(0)}%` : ''}
                </div>
              })}
            </div>
            
            <div style={{display:'flex', flexWrap:'wrap', gap:'15px'}}>
              {bancos.map((b, i) => (
                <div key={b.id} style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px'}}>
                  <div style={{width:'10px', height:'10px', borderRadius:'50%', background: colors[i % colors.length].text}}></div>
                  <span>{b.nombre}</span>
                  <span style={{color: 'var(--text2)'}}>({total > 0 ? ((b.saldo / total) * 100).toFixed(1) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="g3">
        {bancos.map((b, i) => {
          const c = colors[i % colors.length];
          return (
            <div key={b.id} className="bank-card" style={{background: c.bg, border: `1px solid ${c.border}`}}>
              <div style={{fontSize:"12px",color:"var(--text2)",fontWeight:"600",marginBottom:"6px"}}>🏦 {b.nombre}</div>
              <div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"14px"}}>{b.tipo}</div>
              {c.badge && <div style={{fontStyle: i===0?"italic":"normal",fontWeight:"800",color: i===0?"rgba(255,255,255,0.5)": "rgba(107,127,214,0.7)",fontSize:"13px",position:"absolute",top:"18px",right:"18px"}}>{c.badge}</div>}
              <div style={{fontFamily:"var(--mono)",fontSize:"24px",fontWeight:"600",color: c.text,marginBottom:"8px"}}>${Number(b.saldo).toLocaleString()}</div>
              {b.numero && <div style={{fontFamily:"var(--mono)",fontSize:"11px",color:"var(--text3)",letterSpacing:"1.5px",marginBottom:"6px"}}>{b.numero}</div>}
              <div style={{fontSize:"10px",color:"var(--text3)",marginBottom:"16px"}}>Titular: {b.titular}</div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="btn btn-gh btn-sm" onClick={() => handleEdit(b)}>✏️ Editar</button>
                <button className="btn btn-d btn-sm" onClick={() => handleDelete(b.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">{editId ? '✏️ Editar Cuenta' : '➕ Agregar Nueva Cuenta'}</div></div>
        <div className="fg fg2">
          <div className="fgrp"><label className="flbl">Banco / Institución</label>
            <select className="fsel" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}>
              {BANCOS_CHILE.map(b => (
                <option key={b.id} value={b.name}>{b.logo} {b.name}</option>
              ))}
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Tipo de Cuenta</label>
            <select className="fsel" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
              <option>Cuenta Corriente</option>
              <option>Cuenta Ahorro</option>
              <option>Cuenta Vista (RUT, MACH, Tenpo)</option>
              <option>Línea de Crédito</option>
              <option>Efectivo</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Número de Cuenta</label>
            <input className="finp" placeholder="Opcional..." value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Saldo Actual (CLP)</label>
            <input 
              className="finp" 
              type="text" 
              placeholder="$0" 
              value={formatMiles(form.saldo)} 
              onChange={e => setForm({...form, saldo: parseMiles(e.target.value)})} 
            />
          </div>
          <div className="fgrp"><label className="flbl">Moneda</label>
            <select className="fsel" value={form.moneda} onChange={e => setForm({...form, moneda: e.target.value})}>
              <option>CLP</option><option>USD</option><option>EUR</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Titular</label>
            <input className="finp" value={form.titular} onChange={e => setForm({...form, titular: e.target.value})} />
          </div>
        </div>
        <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
          <button className="btn-p btn" style={{padding:'8px 16px'}} onClick={handleCreateOrUpdate}>💾 {editId ? 'Actualizar Cuenta' : 'Agregar Cuenta'}</button>
          <button className="btn btn-gh" onClick={() => {
            setEditId(null);
            setForm({ nombre: 'Banco Santander', tipo: 'Cuenta Corriente', numero: '', saldo: '', moneda: 'CLP', titular: authUser?.displayName || 'Usuario' });
          }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
