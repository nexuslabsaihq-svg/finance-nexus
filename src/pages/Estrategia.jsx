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
    if (idx === 0) return { bg: 'bg', text: 'Primero' };
    if (idx === 1) return { bg: 'bo', text: 'Segundo' };
    if (idx === total - 1 && total > 2) return { bg: 'bgy', text: 'Último' };
    return { bg: 'bb', text: 'Siguiente' };
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🎲 Estrategia de Deudas</div>
          <div className="page-sub">Elige el mejor plan para liberarte de deudas</div>
        </div>
      </div>
      
      <div style={{display:"flex",gap:"12px"}}>
        <div className={`strat-btn ${estrategiaActiva === 'nieve' ? 'active' : ''}`} onClick={() => setEstrategiaActiva('nieve')}>
          <div className="strat-title" style={{color:"var(--orange)"}}>❄️ Bola de Nieve</div>
          <div className="strat-desc">Paga primero las deudas más pequeñas. Victorias rápidas y motivación continua.</div>
        </div>
        <div className={`strat-btn ${estrategiaActiva === 'avalancha' ? 'active' : ''}`} onClick={() => setEstrategiaActiva('avalancha')}>
          <div className="strat-title" style={{color:"var(--blue)"}}>🏔️ Avalancha</div>
          <div className="strat-desc">Paga primero las deudas con mayor tasa de interés. Más eficiente matemáticamente.</div>
        </div>
      </div>
      
      <div className="g3">
        <div className="sc sc-p">
          <div className="sc-label">Deuda Total</div>
          <div className="sc-val" style={{color:"var(--pink)"}}>${deudaTotal.toLocaleString()}</div>
        </div>
        <div className="sc sc-o">
          <div className="sc-label">Interés Anual Est.</div>
          <div className="sc-val" style={{color:"var(--orange)"}}>${interesAnual.toLocaleString()}</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">Estrategia Activa</div>
          <div className="sc-val" style={{color: estrategiaActiva === 'nieve' ? "var(--orange)" : "var(--blue)", fontSize:"15px"}}>
            {estrategiaActiva === 'nieve' ? '❄️ Bola de Nieve' : '🏔️ Avalancha'}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">📋 Orden de Pago Recomendado</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {sortedDeudas.length === 0 ? (
             <div style={{color:'var(--text2)', fontSize:'13px', padding:'10px'}}>No hay deudas registradas.</div>
          ) : sortedDeudas.map((d, idx) => {
            const r = getRankBadge(idx, sortedDeudas.length);
            return (
              <div key={d.id} className="order-card">
                <div className="order-num">{idx + 1}</div>
                <div style={{flex:"1"}}>
                  <div style={{fontSize:"13.5px",fontWeight:"700"}}>{d.nombre}</div>
                  <div style={{fontSize:"12px",color:"var(--text2)"}}>
                    ${Number(d.balance).toLocaleString()} — {d.tasa}% anual {d.vencimiento ? `— Exp: ${d.vencimiento}` : ''}
                  </div>
                </div>
                <span className={`badge ${r.bg}`}>{r.text}</span>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="g2">
        <div className="card">
          <div className="card-hdr"><div className="card-title">❄️ Ventajas Bola de Nieve</div></div>
          <div className="adv-list">
            <div className="adv-item"><span className="adv-check">✓</span>Victorias rápidas mantienen la motivación</div>
            <div className="adv-item"><span className="adv-check">✓</span>Reduce el número de deudas activas rápido</div>
            <div className="adv-item"><span className="adv-check">✓</span>Psicológicamente más satisfactorio</div>
            <div className="adv-item"><span className="adv-check">✓</span>Ideal si necesitas motivación inmediata</div>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><div className="card-title">🏔️ Ventajas Avalancha</div></div>
          <div className="adv-list">
            <div className="adv-item"><span className="adv-check">✓</span>Ahorra más dinero en intereses totales</div>
            <div className="adv-item"><span className="adv-check">✓</span>Matemáticamente más eficiente</div>
            <div className="adv-item"><span className="adv-check">✓</span>Reduce el tiempo total de pago</div>
            <div className="adv-item"><span className="adv-check">✓</span>Mejor si tu prioridad es ahorrar dinero</div>
          </div>
        </div>
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
