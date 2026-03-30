import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

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

  const total = bancos.reduce((s, b) => s + Number(b.saldo), 0);
  const totalCorriente = bancos.filter(b => b.tipo === 'Cuenta Corriente').reduce((s, b) => s + Number(b.saldo), 0);
  const totalAhorro = bancos.filter(b => b.tipo.includes('Ahorro') || b.tipo.includes('Vista')).reduce((s, b) => s + Number(b.saldo), 0);
  const totalEfectivo = bancos.filter(b => b.tipo === 'Efectivo').reduce((s, b) => s + Number(b.saldo), 0);

  const colors = [
    { bg: 'linear-gradient(135deg,rgba(255,154,118,0.15),rgba(255,154,118,0.04))', border: 'rgba(255,154,118,0.25)', text: 'var(--orange)', badge: 'VISA' },
    { bg: 'linear-gradient(135deg,rgba(107,127,214,0.15),rgba(107,127,214,0.04))', border: 'rgba(107,127,214,0.25)', text: 'var(--blue)', badge: 'MC' },
    { bg: 'linear-gradient(135deg,rgba(126,211,33,0.12),rgba(126,211,33,0.03))', border: 'rgba(126,211,33,0.2)', text: 'var(--green)', badge: '' },
    { bg: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(168,85,247,0.04))', border: 'rgba(168,85,247,0.25)', text: 'var(--purple)', badge: '' }
  ];

  const handleCreate = () => {
    if (!form.nombre || !form.saldo) return;
    const newRecord = { ...form, id: Date.now(), saldo: Number(form.saldo) };
    setBancos([...bancos, newRecord]);
    setForm({ ...form, numero: '', saldo: '' });
  };

  const handleDelete = (id) => {
    setBancos(bancos.filter(b => b.id !== id));
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
                <button className="btn btn-d btn-sm" onClick={() => handleDelete(b.id)}>🗑️ Eliminar</button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">➕ Agregar Nueva Cuenta</div></div>
        <div className="fg fg2">
          <div className="fgrp"><label className="flbl">Banco</label>
            <select className="fsel" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}>
              <option>Banco Santander</option><option>BCI</option><option>BancoEstado</option><option>Banco de Chile</option><option>Itaú</option><option>Scotiabank</option><option>Falabella</option><option>Efectivo</option><option>Otro</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Tipo de Cuenta</label>
            <select className="fsel" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
              <option>Cuenta Corriente</option><option>Cuenta Ahorros</option><option>Cuenta Vista</option><option>Tarjeta Crédito</option><option>Efectivo</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Número de Cuenta</label>
            <input className="finp" placeholder="Opcional..." value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Saldo Actual (CLP)</label>
            <input className="finp" type="number" placeholder="$0" value={form.saldo} onChange={e => setForm({...form, saldo: e.target.value})} />
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
          <button className="btn btn-o" onClick={handleCreate}>💾 Agregar Cuenta</button>
          <button className="btn btn-gh" onClick={() => setForm({...form, numero: '', saldo: ''})}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
