import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { formatMiles, parseMiles } from '../utils/chileData';
import * as XLSX from 'xlsx';
import ComprobanteUploader from '../components/ComprobanteUploader';
import { deleteComprobante } from '../firebase/storage';

export default function Gastos() {
  const { gastos, setGastos, presupuestos, configuracion, bancos } = useAppData();
  
  const [form, setForm] = useState({ 
    desc: '', 
    cat: configuracion?.categorias?.[0] || 'Alimentación', 
    monto: '', 
    fecha: new Date().toISOString().split('T')[0], 
    cuenta: bancos?.[0]?.nombre || 'Efectivo', 
    recurrente: 'No' 
  });
  const [comprobante, setComprobante] = useState(null);

  const [filtroTexto, setFiltroTexto] = useState('');

  const gastosFiltrados = useMemo(() => {
    if(!filtroTexto) return gastos;
    const lower = filtroTexto.toLowerCase();
    return gastos.filter(g => 
      g.desc.toLowerCase().includes(lower) || 
      g.cat.toLowerCase().includes(lower) ||
      g.cuenta?.toLowerCase().includes(lower)
    );
  }, [gastos, filtroTexto]);

  // KPIs
  const totalPresupuesto = presupuestos.reduce((s, p) => s + p.monto, 0);
  const totalGasto = gastos.reduce((s, g) => s + Number(g.monto), 0);
  const disponible = totalPresupuesto - totalGasto;
  const pctUso = totalPresupuesto ? Math.round((totalGasto / totalPresupuesto) * 100) : 0;

  const desglose = presupuestos.map(p => {
    const actual = gastos.filter(g => g.cat === p.cat).reduce((s, g) => s + Number(g.monto), 0);
    const pct = Math.min(100, Math.round((actual / p.monto) * 100)) || 0;
    return { ...p, actual, pct };
  });

  const handleCreate = () => {
    if(!form.desc || !form.monto) return;
    const finalCat = form.cat === 'Otro' && form.catCustom ? form.catCustom : form.cat;
    const newRecord = { ...form, cat: finalCat, id: Date.now().toString(), monto: Number(form.monto), comprobante: comprobante || null };
    delete newRecord.catCustom; // Clean up
    setGastos([newRecord, ...gastos]);
    setForm({ desc: '', cat: configuracion?.categorias?.[0] || 'Alimentación', catCustom: '', monto: '', fecha: new Date().toISOString().split('T')[0], cuenta: bancos?.[0]?.nombre || 'Efectivo', recurrente: 'No' });
    setComprobante(null);
  };

  const handleDelete = (id) => {
    const item = gastos.find(i => i.id === id);
    if (item?.comprobante?.path) deleteComprobante(item.comprobante.path);
    setGastos(gastos.filter(i => i.id !== id));
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(gastosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    XLSX.writeFile(wb, "Gastos.csv", { bookType: 'csv' });
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>

      <div className="page-hdr"><div><div className="page-title">💸 Gastos</div><div className="page-sub">Presupuesto y análisis por categoría</div></div></div>
      <div className="g4">
        <div className="sc sc-b"><div className="sc-label">Presupuesto Total</div><div className="sc-val">${totalPresupuesto.toLocaleString()}</div><div className="sc-icon" style={{color: "var(--blue)"}}>📋</div></div>
        <div className="sc sc-p"><div className="sc-label">Gasto Actual</div><div className="sc-val">${totalGasto.toLocaleString()}</div><div className="sc-change ch-dn">▼ {pctUso}% utilizado</div><div className="sc-icon" style={{color: "var(--pink)"}}>💸</div></div>
        <div className="sc sc-o"><div className="sc-label">Disponible</div><div className="sc-val">${disponible.toLocaleString()}</div><div className="sc-change ch-n">{100 - pctUso}% restante</div><div className="sc-icon" style={{color: "var(--orange)"}}>💡</div></div>
        <div className="sc sc-g"><div className="sc-label">Transacciones</div><div className="sc-val">{gastos.length}</div><div className="sc-icon" style={{color: "var(--green)"}}>🔢</div></div>
      </div>
      {pctUso > 80 && (
        <div className="alert al-o"><span className="al-icon">⚠️</span><div className="al-body"><div className="al-title" style={{"color":"var(--orange)"}}>Atención</div>Has usado el {pctUso}% de tu presupuesto mensual. Quedan ${disponible.toLocaleString()} disponibles.</div></div>
      )}
      <div className="g2">
        <div className="card"><div className="card-hdr"><div className="card-title">Desglose por Categoría</div></div>
          <div className="tw"><table><thead><tr><th>Categoría</th><th className="r">Presupuesto</th><th className="r">Actual</th><th>Uso</th></tr></thead><tbody>
            {desglose.length === 0 && (
              <tr><td colSpan="4" style={{textAlign:'center', padding:'20px', color:'var(--text2)'}}>No hay presupuestos definidos. Configúralos en Análisis.</td></tr>
            )}
            {desglose.map((d, i) => (
              <tr key={i}><td className="tdp">{d.cat}</td><td className="tdr tdm">${d.monto.toLocaleString()}</td><td className="tdr neg">${d.actual.toLocaleString()}</td><td><div style={{"display":"flex","alignItems":"center","gap":"8px"}}><div style={{"width":"80px"}}><div className="pt"><div className="pf" style={{"width":`${d.pct}%`,"background":"var(--orange)"}}></div></div></div><span style={{"fontSize":"11.5px","color":"var(--orange)","fontWeight":"700"}}>{d.pct}%</span></div></td></tr>
            ))}
          </tbody></table></div>
        </div>
        <div className="card"><div className="card-hdr"><div className="card-title">➕ Registrar Gasto</div></div>
          <div className="fg fg2">
            <div className="fgrp"><label className="flbl">Descripción</label><input className="finp" placeholder="Ej: Supermercado" value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})}/></div>
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
            <div className="fgrp"><label className="flbl">Fecha</label><input className="finp" type="date" value={form.fecha} onChange={e=>setForm({...form, fecha:e.target.value})}/></div>
            <div className="fgrp">
              <label className="flbl">Cuenta / Banco</label>
              <select className="fsel" value={form.cuenta} onChange={e=>setForm({...form, cuenta:e.target.value})}>
                {bancos?.map(b => <option key={b.id}>{b.nombre}</option>)}
                <option>Efectivo</option>
              </select>
            </div>
            <div className="fgrp"><label className="flbl">¿Es recurrente?</label><select className="fsel" value={form.recurrente} onChange={e=>setForm({...form, recurrente:e.target.value})}><option>No</option><option>Sí, mensual</option><option>Sí, anual</option></select></div>
          </div>
          <ComprobanteUploader modulo="gastos" value={comprobante} onChange={setComprobante} />
          <div style={{"marginTop":"14px","display":"flex","gap":"8px"}}><button className="btn-p btn" style={{padding:'8px 16px'}} onClick={handleCreate}>💾 Registrar</button><button className="btn btn-gh" onClick={() => { setForm({ desc: '', cat: configuracion?.categorias?.[0] || 'Alimentación', monto: '', fecha: new Date().toISOString().split('T')[0], cuenta: bancos?.[0]?.nombre || 'Efectivo', recurrente: 'No' }); setComprobante(null); }}>Cancelar</button></div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="card-title">Historial de Gastos</div>
          <div style={{display:'flex', gap:'10px'}}>
            <input type="text" className="finp" placeholder="Buscar..." value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} style={{width: '200px', padding: '4px 8px'}} />
            <button className="btn btn-gh btn-sm" onClick={exportCSV}>⬇️ Exportar CSV</button>
          </div>
        </div>
        <div className="tw"><table><thead><tr><th>Descripción</th><th>Categoría</th><th className="r">Monto</th><th>Fecha</th><th>Cuenta</th><th>Acciones</th></tr></thead><tbody>
          {gastosFiltrados.length === 0 && (
            <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color:'var(--text2)'}}>No hay gastos registrados</td></tr>
          )}
          {gastosFiltrados.map((g) => (
            <tr key={g.id}><td className="tdp">🛒 {g.desc}{g.recurrente !== 'No' ? ' 🔄' : ''}</td><td><span className="badge bp">{g.cat}</span></td><td className="tdr neg">-${Number(g.monto).toLocaleString()}</td><td className="tdm" style={{"fontSize":"12px","color":"var(--text2)"}}>{g.fecha}</td><td>{g.cuenta || g.metodo}</td><td style={{"display":"flex","gap":"5px","alignItems":"center"}}>{g.comprobante?.url && <a href={g.comprobante.url} target="_blank" rel="noopener noreferrer" title={g.comprobante.name}>📎</a>}<button className="btn btn-d btn-sm" onClick={() => handleDelete(g.id)}>🗑️</button></td></tr>
          ))}
        </tbody></table></div>
      </div>

    </div>
  );
}
