import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import * as XLSX from 'xlsx';

export default function Transferencias() {
  const { transferencias, setTransferencias, bancos, setBancos } = useAppData();

  const [form, setForm] = useState({
    origen: bancos.length > 0 ? bancos[0].id.toString() : '',
    destino: 'Tercero',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    desc: ''
  });

  // KPIs
  const totalTodas = transferencias.reduce((sum, t) => sum + Number(t.monto), 0);
  const totalEnviadas = transferencias.filter(t => t.destino === 'Tercero').reduce((sum, t) => sum + Number(t.monto), 0);
  const totalRecibidas = transferencias.filter(t => t.origen === 'Tercero').reduce((sum, t) => sum + Number(t.monto), 0);

  const getBankName = (id) => {
    if (id === 'Tercero') return 'Tercero';
    const b = bancos.find(b => b.id.toString() === id.toString());
    return b ? b.nombre : 'Desconocido';
  };

  const handleCreate = () => {
    if (!form.origen || !form.destino || !form.monto || form.origen === form.destino) return;
    const montoNum = Number(form.monto);
    if (montoNum <= 0) return;

    // Validación de fondos
    if (form.origen !== 'Tercero') {
      const bOrigen = bancos.find(b => b.id.toString() === form.origen);
      if (bOrigen && bOrigen.saldo < montoNum) {
        alert(`Fondos insuficientes en ${bOrigen.nombre}`);
        return;
      }
    }

    const newRecord = { ...form, id: Date.now().toString(), monto: montoNum, estado: 'Completada', origenName: getBankName(form.origen), destinoName: getBankName(form.destino) };
    
    setTransferencias([newRecord, ...transferencias]);

    const newBancos = bancos.map(b => {
      let extra = 0;
      if (b.id.toString() === form.origen) extra -= montoNum;
      if (b.id.toString() === form.destino) extra += montoNum;
      if (extra !== 0) return { ...b, saldo: Number(b.saldo) + extra };
      return b;
    });
    setBancos(newBancos);
    
    setForm({
      origen: bancos.length > 0 ? bancos[0].id.toString() : '',
      destino: 'Tercero',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      desc: ''
    });
  };

  const handleDelete = (id) => {
    const t = transferencias.find(x => x.id === id);
    if(!t) return;
    
    // Revertir fondos
    const newBancos = bancos.map(b => {
      let extra = 0;
      if (b.id.toString() === t.origen) extra += t.monto;
      if (b.id.toString() === t.destino) extra -= t.monto;
      if (extra !== 0) return { ...b, saldo: Number(b.saldo) + extra };
      return b;
    });
    setBancos(newBancos);
    setTransferencias(transferencias.filter(x => x.id !== id));
  };

  const exportCSV = () => {
    const exportData = transferencias.map(t => ({
      ID: t.id,
      Fecha: t.fecha,
      Descripción: t.desc,
      Origen: t.origenName,
      Destino: t.destinoName,
      Monto: t.monto,
      Estado: t.estado
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transferencias");
    XLSX.writeFile(wb, "Transferencias.csv", { bookType: 'csv' });
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
                {bancos.map(b => <option key={b.id} value={b.id.toString()}>💳 {b.nombre} — ${Number(b.saldo).toLocaleString()}</option>)}
              </select>
            </div>
            <div className="fgrp">
              <label className="flbl">Cuenta Destino</label>
              <select className="fsel" value={form.destino} onChange={e => setForm({...form, destino: e.target.value})}>
                <option value="Tercero">Tercero</option>
                {bancos.map(b => <option key={b.id} value={b.id.toString()}>💳 {b.nombre}</option>)}
              </select>
            </div>
            <div className="fg fg2">
              <div className="fgrp"><label className="flbl">Monto (CLP)</label><input className="finp" type="number" placeholder="$0" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} /></div>
              <div className="fgrp"><label className="flbl">Fecha</label><input className="finp" type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} /></div>
            </div>
            <div className="fgrp"><label className="flbl">Descripción</label><input className="finp" placeholder="Motivo de la transferencia..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} /></div>
          </div>
          <div style={{"marginTop":"14px","display":"flex","gap":"8px"}}>
            <button className="btn-p btn" style={{padding:'8px 16px'}} onClick={handleCreate}>💸 Transferir</button>
            <button className="btn btn-gh" onClick={() => setForm({...form, monto: '', desc: ''})}>Cancelar</button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">📋 Historial Reciente</div>
            <button className="btn btn-gh btn-sm" onClick={exportCSV}>⬇️ Exportar CSV</button>
          </div>
          <div className="tw">
            <table>
              <thead><tr><th>Descripción</th><th>Origen</th><th>Destino</th><th className="r">Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {transferencias.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', color:'var(--text2)', padding:'20px'}}>No hay transferencias registradas</td></tr>}
                {transferencias.map(t => (
                  <tr key={t.id}>
                    <td className="tdp">{t.desc}</td>
                    <td style={{fontSize:"12px"}}>{t.origenName || t.origen}</td>
                    <td style={{fontSize:"12px"}}>{t.destinoName || t.destino}</td>
                    <td className="tdr" style={{color:"var(--text2)",fontFamily:"var(--mono)"}}>${Number(t.monto).toLocaleString()}</td>
                    <td><span className="badge bg">✓ {t.estado}</span></td>
                    <td><button className="btn btn-d btn-sm" onClick={() => handleDelete(t.id)}>Deshacer</button></td>
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
