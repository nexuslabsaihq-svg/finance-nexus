import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { formatMiles, parseMiles } from '../utils/chileData';
import * as XLSX from 'xlsx';
import ComprobanteUploader from '../components/ComprobanteUploader';
import { deleteComprobante } from '../firebase/storage';

export default function Ingresos() {
  const { ingresos, setIngresos, bancos, configuracion } = useAppData();

  const [form, setForm] = useState({ 
    desc: '', 
    cat: configuracion?.categorias?.[0] || 'Salario', 
    monto: '', 
    fecha: new Date().toISOString().split('T')[0], 
    cuenta: bancos?.[0]?.nombre || 'Efectivo', 
    notas: '' 
  });
  const [comprobante, setComprobante] = useState(null);
  
  const [filtroTexto, setFiltroTexto] = useState('');

  const ingresosFiltrados = useMemo(() => {
    if(!filtroTexto) return ingresos;
    const lower = filtroTexto.toLowerCase();
    return ingresos.filter(i => 
      i.desc.toLowerCase().includes(lower) || 
      i.cat.toLowerCase().includes(lower) ||
      i.cuenta?.toLowerCase().includes(lower)
    );
  }, [ingresos, filtroTexto]);

  const total = ingresos.reduce((s, i) => s + Number(i.monto), 0);
  const max = Math.max(...ingresos.map(i => Number(i.monto)), 0);
  const promed = ingresos.length > 0 ? (total / ingresos.length) : 0;

  const handleCreate = () => {
    if(!form.desc || !form.monto) return;
    const finalCat = form.cat === 'Otro' && form.catCustom ? form.catCustom : form.cat;
    const newRecord = { ...form, cat: finalCat, id: Date.now().toString(), monto: Number(form.monto), comprobante: comprobante || null };
    delete newRecord.catCustom;
    setIngresos([newRecord, ...ingresos]);
    setForm({ desc: '', cat: configuracion?.categorias?.[0] || 'Salario', catCustom: '', monto: '', fecha: new Date().toISOString().split('T')[0], cuenta: bancos?.[0]?.nombre || 'Efectivo', notas: '' });
    setComprobante(null);
  };

  const handleDelete = (id) => {
    const item = ingresos.find(i => i.id === id);
    if (item?.comprobante?.path) deleteComprobante(item.comprobante.path);
    setIngresos(ingresos.filter(i => i.id !== id));
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(ingresosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos");
    XLSX.writeFile(wb, "Ingresos.csv", { bookType: 'csv' });
  };

  // Dinamic Chart logic
  const last6Months = useMemo(() => Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d;
  }), []);

  const chartData = useMemo(() => {
    return last6Months.map(d => {
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      return ingresos.filter(i => {
         if(!i.fecha) return false;
         const [y,m] = i.fecha.split('-');
         return Number(y) === year && Number(m) === month;
      }).reduce((acc, curr) => acc + Number(curr.monto), 0);
    });
  }, [ingresos, last6Months]);

  const maxChart = Math.max(...chartData, 1);
  const pts = chartData.map((val, i) => {
    const x = i * (520 / 5);
    const y = 80 - (val / maxChart) * 75; // leave bottom margin
    return {x, y, val};
  });
  
  const strokePath = `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const fillPath = `M 0,90 L ${pts.map(p => `${p.x},${p.y}`).join(' L ')} L 520,90 Z`;
  const monthLabels = last6Months.map(d => {
    const str = d.toLocaleString('es', {month: 'short'});
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return (
    <div className="page active" style={{ display: 'flex' }}>

      <div className="page-hdr"><div><div className="page-title">💰 Ingresos</div><div className="page-sub">Registro y análisis de fuentes de ingresos</div></div></div>
      <div className="g4">
        <div className="sc sc-o"><div className="sc-label">Ingresos Totales</div><div className="sc-val" style={{"color":"var(--orange)"}}>${total.toLocaleString()}</div><div className="sc-change ch-n">Histórico</div><div className="sc-icon">💰</div></div>
        <div className="sc sc-g"><div className="sc-label">Promedio Transacción</div><div className="sc-val" style={{"color":"var(--green)"}}>${promed.toLocaleString(undefined, {maximumFractionDigits:0})}</div><div className="sc-change ch-n">General</div><div className="sc-icon">📊</div></div>
        <div className="sc sc-b"><div className="sc-label">Transacciones</div><div className="sc-val" style={{"color":"var(--blue)"}}>{ingresos.length}</div><div className="sc-change ch-up">▲</div><div className="sc-icon">🔢</div></div>
        <div className="sc sc-pu"><div className="sc-label">Mayor Ingreso</div><div className="sc-val" style={{"color":"var(--purple)"}}>${max.toLocaleString()}</div><div className="sc-change ch-n">Máximo</div><div className="sc-icon">🏆</div></div>
      </div>
      
      <div className="card"><div className="card-hdr"><div><div className="card-title">Tendencia de Ingresos</div><div className="card-sub">Últimos 6 meses</div></div><span className="badge bg">Gráfico Dinámico</span></div>
        <svg width="100%" viewBox="0 0 520 90" preserveAspectRatio="none" style={{"height":"90px", overflow: "visible"}}>
          <defs><linearGradient id="gi2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34D399" stopOpacity="0.3"/><stop offset="95%" stopColor="#34D399" stopOpacity="0.01"/></linearGradient></defs>
          <path d={fillPath} fill="url(#gi2)"/>
          <path d={strokePath} fill="none" stroke="#34D399" strokeWidth="2.5"/>
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#34D399" stroke="var(--surface)" strokeWidth="1.5" />
          ))}
          {monthLabels.map((lbl, i) => (
            <text key={i} x={i * (520/5)} y="88" fontSize="9" fill="rgba(139,156,200,0.6)" fontFamily="var(--font)" textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"}>{lbl}</text>
          ))}
        </svg>
      </div>
      
      <div className="g2">
        <div className="card"><div className="card-hdr"><div className="card-title">➕ Registrar Ingreso</div></div>
          <div className="fg fg2">
            <div className="fgrp"><label className="flbl">Descripción</label><input className="finp" placeholder="Ej: Sueldo, Venta..." value={form.desc} onChange={e=>setForm({...form, desc:(e.target.value)})}/></div>
            <div className="fgrp">
              <label className="flbl">Categoría</label>
              <select className="fsel" value={form.cat} onChange={e=>setForm({...form, cat:e.target.value})}>
                {configuracion?.categorias?.map(c => <option key={c}>{c}</option>)}
                <option value="Otro">Otro (Especificar)</option>
              </select>
              {form.cat === 'Otro' && (
                <input className="finp" style={{marginTop: '8px'}} placeholder="Escribe la categoría..." value={form.catCustom || ''} onChange={e => setForm({...form, catCustom: e.target.value})} />
              )}
            </div>
            <div className="fgrp">
              <label className="flbl">Monto (CLP)</label>
              <input className="finp" type="text" placeholder="$0" value={formatMiles(form.monto)} onChange={e=>setForm({...form, monto:parseMiles(e.target.value)})}/>
            </div>
            <div className="fgrp"><label className="flbl">Fecha</label><input className="finp" type="date" value={form.fecha} onChange={e=>setForm({...form, fecha:(e.target.value)})}/></div>
            <div className="fgrp">
              <label className="flbl">Cuenta de Destino</label>
              <select className="fsel" value={form.cuenta} onChange={e=>setForm({...form, cuenta:e.target.value})}>
                {bancos?.map(b => <option key={b.id}>{b.nombre}</option>)}
                <option>Efectivo</option>
              </select>
            </div>
            <div className="fgrp"><label className="flbl">Notas</label><input className="finp" placeholder="Opcional..." value={form.notas} onChange={e=>setForm({...form, notas:(e.target.value)})}/></div>
          </div>
          <ComprobanteUploader modulo="ingresos" value={comprobante} onChange={setComprobante} />
          <div style={{"marginTop":"14px","display":"flex","gap":"8px"}}><button className="btn-p btn" onClick={handleCreate} style={{padding:'8px 16px'}}>💾 Guardar</button><button className="btn btn-gh" onClick={() => { setForm({ desc: '', cat: configuracion?.categorias?.[0]||'Salario', catCustom:'', monto: '', fecha: new Date().toISOString().split('T')[0], cuenta: bancos?.[0]?.nombre||'Efectivo', notas: '' }); setComprobante(null); }}>Cancelar</button></div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="card-title">Historial de Ingresos</div>
          <div style={{display:'flex', gap:'10px'}}>
            <input type="text" className="finp" placeholder="Buscar..." value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} style={{width: '200px', padding: '4px 8px'}} />
            <button className="btn btn-gh btn-sm" onClick={exportCSV}>⬇️ Exportar CSV</button>
          </div>
        </div>
        <div className="tw"><table><thead><tr><th>Descripción</th><th>Categoría</th><th className="r">Monto</th><th>Fecha</th><th>Cuenta</th><th>Acciones</th></tr></thead><tbody>
          {ingresosFiltrados.length === 0 && (
            <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color:'var(--text2)'}}>No hay ingresos registrados</td></tr>
          )}
          {ingresosFiltrados.map(i => (
            <tr key={i.id}><td className="tdp">💰 {i.desc}</td><td><span className="badge bb">{i.cat}</span></td><td className="tdr pos">+${Number(i.monto).toLocaleString()}</td><td className="tdm" style={{"fontSize":"12px","color":"var(--text2)"}}>{i.fecha}</td><td>{i.cuenta}</td><td style={{"display":"flex","gap":"5px","alignItems":"center"}}>{i.comprobante?.url && <a href={i.comprobante.url} target="_blank" rel="noopener noreferrer" title={i.comprobante.name}>📎</a>}<button className="btn btn-d btn-sm" onClick={()=>handleDelete(i.id)}>🗑️</button></td></tr>
          ))}
        </tbody></table></div>
      </div>

    </div>
  );
}
