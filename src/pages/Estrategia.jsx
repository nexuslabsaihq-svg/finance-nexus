import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Estrategia() {
  const { deudas } = useAppData();
  const [estrategiaActiva, setEstrategiaActiva] = useState('nieve');

  const deudaTotal = deudas.reduce((sum, d) => sum + Number(d.balance), 0);
  const interesAnual = deudas.reduce((sum, d) => sum + (Number(d.balance) * Number(d.tasa) / 100), 0);

  const sortedDeudas = [...deudas].sort((a, b) => {
    if (estrategiaActiva === 'nieve') {
      return Number(a.balance) - Number(b.balance);
    } else {
      return Number(b.tasa) - Number(a.tasa);
    }
  });

  const getRankBadge = (idx, total) => {
    if (idx === 0) return { bg: 'bg', text: 'Objetivo #1' };
    if (idx === 1) return { bg: 'bo', text: 'Objetivo #2' };
    return { bg: 'bb', text: `Objetivo #${idx + 1}` };
  };

  const calculatePayoff = (debts, isAvalanche) => {
    // Clone debts to avoid mutating state
    let d = debts.map(x => ({ 
      ...x, 
      bal: Number(x.balance), 
      rate: Number(x.tasa)/100/12, 
      min: Number(x.pagoMensual) 
    }));
    
    // Sort logic
    d.sort((a, b) => isAvalanche ? (b.rate - a.rate) : (a.bal - b.bal));
    
    let totalInterest = 0;
    d = d.map(debt => {
      let m = 0;
      let bal = debt.bal;
      let interest = 0;
      let monthly = debt.min || (bal * 0.05); // Fallback to 5% if 0
      
      // Safety break at 360 months (30 years)
      while(bal > 0 && m < 360) {
        let charge = bal * debt.rate;
        interest += charge;
        bal = bal + charge - monthly;
        m++;
      }
      totalInterest += interest;
      return { ...debt, months: m, interestPaid: interest };
    });
    
    return { list: d, interest: totalInterest };
  };

  const snowball = calculatePayoff(deudas, false);
  const avalanche = calculatePayoff(deudas, true);
  
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
      
      <div className="card" style={{marginTop: '20px'}}>
        <div className="card-hdr">
          <div className="card-title">🚀 Plan de Ataque: {estrategiaActiva === 'nieve' ? 'Bola de Nieve' : 'Avalancha'}</div>
        </div>
        
        {deudas.length === 0 ? (
          <div style={{padding:'30px', textAlign:'center', color:'var(--text2)'}}>Agrega deudas en el panel principal para calcular tu estrategia.</div>
        ) : (
          <div className="tl-group" style={{marginTop:'10px'}}>
            {activePlan.list.map((d, idx) => {
              const r = getRankBadge(idx, activePlan.list.length);
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
