import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Transferencias() {
  const { transferencias, setTransferencias, bancos, setBancos } = useAppData();

  const [form, setForm] = useState({
    origen: bancos.length > 0 ? bancos[0].nombre : '',
    destino: 'Tercero',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    desc: ''
  });

  // KPIs
  const totalTodas = transferencias.reduce((sum, t) => sum + Number(t.monto), 0);
  const totalEnviadas = transferencias.filter(t => t.destino === 'Tercero').reduce((sum, t) => sum + Number(t.monto), 0);
  const totalRecibidas = transferencias.filter(t => t.origen === 'Tercero').reduce((sum, t) => sum + Number(t.monto), 0);

  const handleCreate = () => {
    if (!form.origen || !form.destino || !form.monto) return;
    const montoNum = Number(form.monto);
    const newRecord = { ...form, id: Date.now(), monto: montoNum, estado: '✓ Completada' };
    
    setTransferencias([newRecord, ...transferencias]);

    const newBancos = bancos.map(b => {
      let extra = 0;
      if (b.nombre === form.origen) extra -= montoNum;
      if (b.nombre === form.destino) extra += montoNum;
      if (extra !== 0) return { ...b, saldo: Number(b.saldo) + extra };
      return b;
    });
    setBancos(newBancos);
    
    setForm({
      origen: bancos.length > 0 ? bancos[0].nombre : '',
      destino: 'Tercero',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      desc: ''
    });
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🔄 Transferencias</div>
          <div className="page-sub">Movimientos entre cuentas y terceros</div>
        </div>
      </div>
      
      <div className="g3">
        <div className="sc sc-b"><div className="sc-label">Total Transferencias</div><div className="sc-val" style={{color:"var(--blue)"}}>${totalTodas.toLocaleString()}</div><div className="sc-icon">🔄</div></div>
        <div className="sc sc-o"><div className="sc-label">A Terceros</div><div className="sc-val" style={{color:"var(--orange)"}}>${totalEnviadas.toLocaleString()}</div><div className="sc-icon">📤</div></div>
        <div className="sc sc-g"><div className="sc-label">De Terceros</div><div className="sc-val" style={{color:"var(--green)"}}>${totalRecibidas.toLocaleString()}</div><div className="sc-icon">📥</div></div>
      </div>
      
      <div className="g2">
        <div className="card">
          <div className="card-hdr"><div className="card-title">⚡ Transferencia Rápida</div></div>
          <div className="fg">
            <div className="fgrp">
              <label className="flbl">Cuenta Origen</label>
              <select className="fsel" value={form.origen} onChange={e => setForm({...form, origen: e.target.value})}>
                <option value="Tercero">Tercero</option>
                {bancos.map(b => <option key={b.id} value={b.nombre}>💳 {b.nombre} — ${Number(b.saldo).toLocaleString()}</option>)}
              </select>
            </div>
            <div className="fgrp">
              <label className="flbl">Cuenta Destino</label>
              <select className="fsel" value={form.destino} onChange={e => setForm({...form, destino: e.target.value})}>
                <option value="Tercero">Tercero</option>
                {bancos.map(b => <option key={b.id} value={b.nombre}>💳 {b.nombre}</option>)}
              </select>
            </div>
            <div className="fg fg2">
              <div className="fgrp"><label className="flbl">Monto (CLP)</label><input className="finp" type="number" placeholder="$0" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} /></div>
              <div className="fgrp"><label className="flbl">Fecha</label><input className="finp" type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} /></div>
            </div>
            <div className="fgrp"><label className="flbl">Descripción</label><input className="finp" placeholder="Motivo de la transferencia..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} /></div>
          </div>
          <div style={{"marginTop":"14px","display":"flex","gap":"8px"}}>
            <button className="btn btn-o" onClick={handleCreate}>💸 Transferir</button>
            <button className="btn btn-gh" onClick={() => setForm({...form, monto: '', desc: ''})}>Cancelar</button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-hdr"><div className="card-title">📋 Historial Reciente</div></div>
          <div className="tw">
            <table>
              <thead><tr><th>Descripción</th><th>Origen</th><th>Destino</th><th className="r">Monto</th><th>Estado</th></tr></thead>
              <tbody>
                {transferencias.map(t => (
                  <tr key={t.id}>
                    <td className="tdp">{t.desc}</td>
                    <td style={{fontSize:"12px"}}>{t.origen}</td>
                    <td style={{fontSize:"12px"}}>{t.destino}</td>
                    <td className="tdr" style={{color:"var(--text2)",fontFamily:"var(--mono)"}}>${Number(t.monto).toLocaleString()}</td>
                    <td><span className="badge bg">{t.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
