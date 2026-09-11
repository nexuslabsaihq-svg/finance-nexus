import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Estrategia() {
  const { deudas } = useAppData();
  const [estrategiaActiva, setEstrategiaActiva] = useState('nieve');

  const getRankBadge = (idx) => {
    if (idx === 0) return { bg: 'bg', text: 'Objetivo #1' };
    if (idx === 1) return { bg: 'bo', text: 'Objetivo #2' };
    return { bg: 'bb', text: `Objetivo #${idx + 1}` };
  };

  const calculatePayoff = (debts, isAvalanche) => {
    let d = debts.map(x => ({ 
      ...x, 
      bal: Number(x.balance), 
      rate: Number(x.tasa)/100/12, 
      min: Number(x.pagoMensual) || (Number(x.balance) * 0.05),
      months: 0,
      interestPaid: 0,
      active: true
    }));
    
    // Sort logic for targeting
    d.sort((a, b) => isAvalanche ? (b.rate - a.rate) : (a.bal - b.bal));
    
    let totalInterest = 0;
    let m = 0;
    let totalBal = d.reduce((s, x) => s + x.bal, 0);
    const balanceHistory = [{ mes: 0, balance: totalBal }];
    const totalExtra = 0; // Se podría añadir pago extra en el futuro
    
    while(totalBal > 0 && m < 360) {
      m++;
      let freedUpCash = totalExtra;
      
      // Calculate interest and minimums
      for (let i = 0; i < d.length; i++) {
        if (!d[i].active) {
          freedUpCash += d[i].min;
          continue;
        }
        const charge = d[i].bal * d[i].rate;
        d[i].interestPaid += charge;
        totalInterest += charge;
        d[i].bal += charge;
        d[i].months = m;
      }
      
      // Pay minimums and target
      for (let i = 0; i < d.length; i++) {
        if (!d[i].active) continue;
        
        let payment = d[i].min;
        if (i === d.findIndex(x => x.active)) {
          payment += freedUpCash;
        }
        
        if (d[i].bal <= payment) {
          freedUpCash += (payment - d[i].bal);
          d[i].bal = 0;
          d[i].active = false;
        } else {
          d[i].bal -= payment;
        }
      }
      
      totalBal = d.reduce((s, x) => s + x.bal, 0);
      if (m % 3 === 0 || totalBal === 0) { // Registrar cada 3 meses para no saturar el gráfico
        balanceHistory.push({ mes: m, balance: Math.max(0, totalBal) });
      }
    }
    
    return { list: d, interest: totalInterest, history: balanceHistory, totalMonths: m };
  };

  const { snowball, avalanche, chartData } = useMemo(() => {
    if (deudas.length === 0) return { snowball: {list:[], interest:0, history:[]}, avalanche: {list:[], interest:0, history:[]}, chartData: [] };
    const sb = calculatePayoff(deudas, false);
    const av = calculatePayoff(deudas, true);
    
    // Unir historiales para el gráfico
    const maxMonths = Math.max(sb.totalMonths, av.totalMonths);
    const data = [];
    for(let i = 0; i <= maxMonths; i+=3) {
      const sPoint = sb.history.find(h => h.mes === i) || sb.history[sb.history.length-1];
      const aPoint = av.history.find(h => h.mes === i) || av.history[av.history.length-1];
      data.push({
        mes: `Mes ${i}`,
        nieve: sPoint ? sPoint.balance : 0,
        avalancha: aPoint ? aPoint.balance : 0
      });
      if (sPoint?.balance === 0 && aPoint?.balance === 0) break;
    }
    
    return { snowball: sb, avalanche: av, chartData: data };
  }, [deudas]);
  
  const activePlan = estrategiaActiva === 'nieve' ? snowball : avalanche;

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🎯 Estrategia de Pago</div>
          <div className="page-sub">Elige el plan matemático para eliminar tus deudas</div>
        </div>
      </div>
      
      <div className="g2">
        <div className={`strat-btn ${estrategiaActiva === 'nieve' ? 'active' : ''}`} onClick={() => setEstrategiaActiva('nieve')}>
          <div className="strat-title" style={{color:"var(--orange)"}}>⛄ Bola de Nieve (Recomendado)</div>
          <div className="strat-desc">Ataca la deuda más pequeña primero. Gana victorias psicológicas rápidas que te mantendrán motivado.</div>
          <div style={{marginTop:'10px', fontSize:'12px'}}>Intereses proyectados: <strong style={{color:'var(--pink)'}}>${Math.round(snowball.interest).toLocaleString()}</strong></div>
        </div>
        <div className={`strat-btn ${estrategiaActiva === 'avalancha' ? 'active' : ''}`} onClick={() => setEstrategiaActiva('avalancha')}>
          <div className="strat-title" style={{color:"var(--blue)"}}>🏔️ Avalancha (Matemático)</div>
          <div className="strat-desc">Ataca la deuda con mayor CAE (%) primero. Ahorras más dinero a largo plazo, pero tardarás más en ver resultados.</div>
          <div style={{marginTop:'10px', fontSize:'12px'}}>Intereses proyectados: <strong style={{color:'var(--pink)'}}>${Math.round(avalanche.interest).toLocaleString()}</strong></div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card" style={{marginTop: '20px'}}>
          <div className="card-hdr">
            <div><div className="card-title">📉 Proyección de Amortización</div><div className="card-sub">Bola de Nieve vs Avalancha</div></div>
          </div>
          <div style={{height:'350px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNieve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--orange)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAvalancha" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `$${(val/1000)}k`} />
                <RechartsTooltip 
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                  formatter={(value, name) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, name === 'nieve' ? 'Bola de Nieve' : 'Avalancha']}
                  labelStyle={{ color: 'var(--text2)', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} iconType="circle" />
                <Area type="monotone" dataKey="nieve" name="Bola de Nieve" stroke="var(--orange)" strokeWidth={3} fillOpacity={1} fill="url(#colorNieve)" activeDot={{r:6}} />
                <Area type="monotone" dataKey="avalancha" name="Avalancha" stroke="var(--blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorAvalancha)" activeDot={{r:6}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div className="card" style={{marginTop: '20px'}}>
        <div className="card-hdr">
          <div className="card-title">🚀 Plan de Ataque: {estrategiaActiva === 'nieve' ? 'Bola de Nieve' : 'Avalancha'}</div>
        </div>
        
        {deudas.length === 0 ? (
          <div style={{padding:'30px', textAlign:'center', color:'var(--text2)'}}>Agrega deudas en el panel principal para calcular tu estrategia.</div>
        ) : (
          <div className="tl-group" style={{marginTop:'10px'}}>
            {activePlan.list.map((d, idx) => {
              const r = getRankBadge(idx);
              const years = Math.floor(d.months / 12);
              const months = d.months % 12;
              const timeStr = d.months >= 360 ? '+30 años (Peligro)' : `${years > 0 ? `${years} años ` : ''}${months} meses`;
              
              return (
                <div key={d.id} className="tl-item" style={{background: idx === 0 ? 'var(--surface2)' : 'transparent', padding: '15px', borderRadius: '10px', border: idx === 0 ? '1px solid var(--border)' : 'none'}}>
                  <div className="tl-dot" style={{ background: idx === 0 ? 'var(--green)' : 'var(--border)' }}>{idx + 1}</div>
                  <div style={{ flex: '1' }}>
                    <div className="tl-title" style={{fontSize: idx===0 ? '16px' : '14px', color: idx===0 ? 'var(--green)' : 'var(--text)'}}>{d.nombre} {idx === 0 && '🔥 (Foco Principal)'}</div>
                    <div className="tl-meta" style={{marginTop:'5px', color:'var(--text2)'}}>
                      Deuda: ${Math.round(d.bal).toLocaleString()} • CAE: {d.tasa}% • Cuota: ${Math.round(d.min).toLocaleString()}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span className={`badge ${r.bg}`}>{r.text}</span>
                    <div style={{fontSize:'12px', color:'var(--orange)', marginTop:'8px'}}>⏳ {timeStr}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">💡 Recomendación IA</div></div>
        <div className="alert al-b">
          <span className="al-icon">🤖</span>
          <div className="al-body">
            <div className="al-title" style={{color:"var(--blue)"}}>Recomendación: {estrategiaActiva === 'nieve' ? 'Bola de Nieve' : 'Avalancha'}</div>
            Basado en tu perfil, la estrategia actual es ideal para tus objetivos. Mantén constancia y revisa este panel cada mes.
          </div>
        </div>
      </div>
    </div>
  );
}
