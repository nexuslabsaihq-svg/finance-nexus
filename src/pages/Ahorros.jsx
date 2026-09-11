import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { formatMiles, parseMiles } from '../utils/chileData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#FF9A76', '#E85D75', '#7ED321', '#6B7FD6', '#A855F7', '#FBBF24', '#38BDF8'];

export default function Ahorros() {
  const { ahorros, setAhorros } = useAppData();

  const [form, setForm] = useState({
    nombre: '',
    emoji: '🏠',
    meta: '',
    aporte: '',
    fecha: '',
    desc: ''
  });

  const totalAhorrado = ahorros.reduce((sum, a) => sum + Number(a.actual || 0), 0);
  const metasActivas = ahorros.length;
  
  const pctPromedio = ahorros.length > 0 
    ? ahorros.reduce((sum, a) => sum + Math.min(100, (Number(a.actual || 0) / Number(a.objetivo || 1)) * 100), 0) / ahorros.length
    : 0;

  const distribucionData = useMemo(() => {
    return ahorros.map(a => ({
      name: a.nombre,
      value: Number(a.actual || 0)
    })).filter(a => a.value > 0).sort((a,b) => b.value - a.value);
  }, [ahorros]);

  const proyeccionData = useMemo(() => {
    const data = [];
    let currentTotal = totalAhorrado;
    const monthlyContribution = ahorros.reduce((sum, a) => sum + Number(a.aporte || 0), 0);
    
    const today = new Date();
    for(let i=0; i<=12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      data.push({
        mes: d.toLocaleDateString('es-CL', {month: 'short', year:'2-digit'}).replace('.', ''),
        total: currentTotal
      });
      currentTotal += monthlyContribution;
    }
    return data;
  }, [ahorros, totalAhorrado]);

  const handleCreate = () => {
    if (!form.nombre || !form.meta) return;
    const newRecord = {
      ...form,
      id: Date.now(),
      objetivo: Number(form.meta),
      aporte: Number(form.aporte),
      actual: 0
    };
    setAhorros([...ahorros, newRecord]);
    setForm({ nombre: '', emoji: '🏠', meta: '', aporte: '', fecha: '', desc: '' });
  };

  const handleContribute = (id) => {
    setAhorros(ahorros.map(a => {
      if (a.id === id) {
        return { ...a, actual: Number(a.actual || 0) + Number(a.aporte || 0) };
      }
      return a;
    }));
  };

  const handleDelete = (id) => {
    setAhorros(ahorros.map(a => {
      if (a.id === id) {
        return { ...a, deleted: true };
      }
      return a;
    }).filter(a => !a.deleted));
  }

  const getGradient = (pct) => {
    if (pct < 30) return 'linear-gradient(90deg,var(--orange),var(--orange2))';
    if (pct < 70) return 'linear-gradient(90deg,var(--blue),var(--cyan))';
    return 'linear-gradient(90deg,var(--green),#4ade80)';
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🎯 Ahorros</div>
          <div className="page-sub">Metas de ahorro y seguimiento</div>
        </div>
      </div>
      
      <div className="g3">
        <div className="sc sc-g">
          <div className="sc-label">Total Ahorrado</div>
          <div className="sc-val">${totalAhorrado.toLocaleString()}</div>
          <div className="sc-change ch-up">▲ {metasActivas} metas activas</div>
          <div className="sc-icon" style={{color:"var(--green)"}}>💎</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">Metas Activas</div>
          <div className="sc-val">{metasActivas}</div>
          <div className="sc-icon" style={{color:"var(--blue)"}}>🎯</div>
        </div>
        <div className="sc sc-o">
          <div className="sc-label">Progreso Promedio</div>
          <div className="sc-val">{pctPromedio.toFixed(1)}%</div>
          <div className="sc-change ch-up">▲ Buen ritmo</div>
          <div className="sc-icon" style={{color:"var(--orange)"}}>📊</div>
        </div>
      </div>
      
      <div className="g2">
        {ahorros.map(a => {
          const pct = Math.min(100, Math.round((Number(a.actual || 0) / Number(a.objetivo || 1)) * 100)) || 0;
          return (
            <div key={a.id} className="goal-card">
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontSize:"24px"}}>{a.emoji || '🎯'}</span>
                <div>
                  <div style={{fontSize:"14px",fontWeight:"700"}}>{a.nombre}</div>
                  <div style={{fontSize:"12px",color:"var(--text2)"}}>Meta: ${(Number(a.objetivo)||0).toLocaleString()}</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"12.5px"}}>
                <span style={{color:"var(--green)",fontFamily:"var(--mono)",fontWeight:"600"}}>${(Number(a.actual)||0).toLocaleString()} ahorrados</span>
                <span style={{color:"var(--text2)"}}>{pct}%</span>
              </div>
              <div className="pt">
                <div className="pf" style={{width:`${pct}%`,background:getGradient(pct)}}></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"var(--text2)"}}>
                <span>${Number(a.aporte).toLocaleString()}/mes</span>
                <span>🗓️ {a.fecha || 'Sin fecha'}</span>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="btn btn-o btn-sm" onClick={() => handleContribute(a.id)}>Contribuir</button>
                <button className="btn btn-gh btn-sm" onClick={() => handleDelete(a.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>

      {ahorros.length > 0 && (
        <div style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
          <div className="card" style={{flex: '2 1 400px'}}>
            <div className="card-hdr">
              <div><div className="card-title">📈 Proyección a 12 Meses</div><div className="card-sub">Crecimiento estimado manteniendo contribuciones</div></div>
            </div>
            <div style={{height:'300px', width:'100%', padding:'10px 0'}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={proyeccionData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAhorro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                    </linearGradient>
                    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.4"/>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mes" stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${(val/1000)}k`} />
                  <RechartsTooltip 
                    contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                    formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, 'Proyectado']}
                    labelStyle={{ color: 'var(--text2)', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--blue)" strokeWidth={4} fillOpacity={1} fill="url(#colorAhorro)" activeDot={{r:7, fill: 'var(--blue)', stroke: 'var(--surface)', strokeWidth: 2}} filter="url(#glowBlue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{flex: '1 1 300px', minWidth:'300px'}}>
            <div className="card-hdr"><div className="card-title">🍩 Distribución del Capital</div></div>
            <div style={{height:'300px', width:'100%'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
                    </filter>
                  </defs>
                  <Pie
                    data={distribucionData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="var(--surface)"
                    strokeWidth={2}
                    filter="url(#pieGlow)"
                  >
                    {distribucionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, 'Ahorrado']}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: 'var(--text)', padding: '12px' }}
                    itemStyle={{ fontWeight: '500', color: 'var(--text2)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize:'12px', fontWeight: 500}} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">➕ Nueva Meta de Ahorro</div></div>
        <div className="fg fg2">
          <div className="fgrp"><label className="flbl">Nombre</label>
            <input className="finp" placeholder="Ej: Fondo de Emergencia" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Emoji</label>
            <select className="fsel" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})}>
              <option>🏠</option><option>✈️</option><option>🚗</option><option>📚</option><option>💊</option><option>🎯</option>
            </select>
          </div>
          <div className="fgrp"><label className="flbl">Monto Objetivo (CLP)</label>
            <input className="finp" type="text" placeholder="$0" value={formatMiles(form.meta)} onChange={e => setForm({...form, meta: parseMiles(e.target.value)})} />
          </div>
          <div className="fgrp"><label className="flbl">Contribución Mensual</label>
            <input className="finp" type="text" placeholder="$0" value={formatMiles(form.aporte)} onChange={e => setForm({...form, aporte: parseMiles(e.target.value)})} />
          </div>
          <div className="fgrp"><label className="flbl">Fecha Objetivo</label>
            <input className="finp" type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
          </div>
          <div className="fgrp"><label className="flbl">Descripción</label>
            <input className="finp" placeholder="Describe tu meta..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
          </div>
        </div>
        <div style={{marginTop:"14px",display:"flex",gap:"8px"}}>
          <button className="btn btn-o" onClick={handleCreate}>💾 Crear Meta</button>
          <button className="btn btn-gh" onClick={() => setForm({nombre:'',emoji:'🏠',meta:'',aporte:'',fecha:'',desc:''})}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
