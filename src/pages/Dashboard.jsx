import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export default function Dashboard({ period }) {
  const { setActivePage, ingresos, gastos, ahorros, inversiones, deudas, bancos } = useAppData();

  const getMonthPrefix = (p) => {
    if(p === 'Enero') return '2025-01';
    if(p === 'Febrero') return '2025-02';
    if(p === 'Marzo') return '2025-03';
    return '';
  };
  const prefix = getMonthPrefix(period);

  const filterByPeriod = (arr) => arr.filter(item => item.fecha && item.fecha.startsWith(prefix));

  const ingresosMes = filterByPeriod(ingresos).reduce((sum, i) => sum + Number(i.monto), 0);
  const gastosMes = filterByPeriod(gastos).reduce((sum, g) => sum + Number(g.monto), 0);
  const ahorrosMes = filterByPeriod(ahorros).reduce((sum, a) => sum + Number(a.actual || 0), 0);
  
  const totalBancos = bancos.reduce((sum, b) => sum + Number(b.saldo), 0);
  const totalInv = inversiones.reduce((sum, i) => sum + Number(i.monto), 0);
  const patrimonio = totalBancos + totalInv; // simplificado
  const totalDeuda = deudas.reduce((sum, d) => sum + Number(d.monto), 0);
  const tasaAhorro = ingresosMes > 0 ? (ahorrosMes / ingresosMes) * 100 : 0;

  return (
    <div className="page active" style={{ display: 'flex' }}>

  <div className="page-hdr">
    <div>
      <div className="page-title">📊 Panel de Control</div>
      <div className="page-sub" id="period-sub">Resumen ejecutivo · {period} 2025 — Haz click en cualquier módulo para acceder</div>
    </div>
    <div style={{"display":"flex","gap":"8px"}}>
      <button className="btn btn-gh btn-sm" onClick={() => window.print()}>🖨️ Imprimir</button>
      <button className="btn btn-o" onClick={() => setActivePage('ingresos')}>+ Nueva Transacción</button>
    </div>
  </div>

  {/*  SCORE FINANCIERO + KPIs  */}
  <div className="gms">
    <div className="g4">
      <div className="sc sc-o"><div className="sc-label">Ingresos del Mes</div><div className="sc-val" id="kpi-ing" style={{"color":"var(--orange)"}}>${ingresosMes.toLocaleString()}</div><div className="sc-change ch-up">▲ +14.3% vs Feb</div><div className="sc-icon">💰</div></div>
      <div className="sc sc-p"><div className="sc-label">Gastos del Mes</div><div className="sc-val" id="kpi-gas" style={{"color":"var(--pink)"}}>${gastosMes.toLocaleString()}</div><div className="sc-change ch-dn">▼ +10.5% vs Feb</div><div className="sc-icon">💸</div></div>
      <div className="sc sc-g"><div className="sc-label">Ahorros del Mes</div><div className="sc-val" id="kpi-aho" style={{"color":"var(--green)"}}>${ahorrosMes.toLocaleString()}</div><div className="sc-change ch-up">▲ +22.2% vs Feb</div><div className="sc-icon">🎯</div></div>
      <div className="sc sc-b"><div className="sc-label">Patrimonio Neto</div><div className="sc-val" id="kpi-pat" style={{"color":"var(--blue)"}}>${patrimonio.toLocaleString()}</div><div className="sc-change ch-up">▲ Creciendo</div><div className="sc-icon">💎</div></div>
      <div className="sc sc-b"><div className="sc-label">Tasa de Ahorro</div><div className="sc-val" id="kpi-tasa" style={{"color":"var(--blue)"}}>{tasaAhorro.toFixed(1)}%</div><div className="sc-change ch-up">▲ Meta 30% superada</div><div className="sc-icon">📊</div></div>
      <div className="sc sc-pu"><div className="sc-label">Total Inversiones</div><div className="sc-val" id="kpi-inv" style={{"color":"var(--purple)"}}>${totalInv.toLocaleString()}</div><div className="sc-change ch-up">▲ +10.2% retorno</div><div className="sc-icon">📈</div></div>
      <div className="sc sc-p"><div className="sc-label">Deuda Total</div><div className="sc-val" style={{"color":"var(--pink)"}}>${totalDeuda.toLocaleString()}</div><div className="sc-change ch-n">{deudas.length} deudas activas</div><div className="sc-icon">📋</div></div>
      <div className="sc sc-o"><div className="sc-label">Saldo en Bancos</div><div className="sc-val" style={{"color":"var(--orange)"}}>${totalBancos.toLocaleString()}</div><div className="sc-change ch-n">{bancos.length} cuentas activas</div><div className="sc-icon">🏦</div></div>
    </div>

    {/*  SCORE FINANCIERO  */}
    <div style={{"display":"flex","flexDirection":"column","gap":"14px"}}>
      <div className="card card-glow-b" style={{"textAlign":"center"}}>
        <div className="card-hdr" style={{"justifyContent":"center","marginBottom":"10px"}}><div className="card-title">🎯 Score Financiero</div></div>
        <svg viewBox="0 0 140 80" width="140" height="80" style={{"overflow":"visible","margin":"0 auto","display":"block"}}>
          <path d="M10,70 A60,60 0 0,1 130,70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round"/>
          <path d="M10,70 A60,60 0 0,1 130,70" fill="none" stroke="url(#scoreGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray="188" strokeDashoffset="47"/>
          <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#E85D75"/><stop offset="40%" stopColor="#FF9A76"/><stop offset="70%" stopColor="#7ED321"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient></defs>
          <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text)" fontFamily="'IBM Plex Mono',monospace">778</text>
          <text x="70" y="78" textAnchor="middle" fontSize="8" fill="var(--text2)" fontFamily="sans-serif">de 1000 puntos</text>
        </svg>
        <div style={{"fontSize":"15px","fontWeight":"700","color":"var(--green)","marginTop":"6px"}}>Muy Bueno ✓</div>
        <div style={{"fontSize":"11px","color":"var(--text2)","marginTop":"3px"}}>Mejor que el 82% de usuarios</div>
        <button className="btn btn-gh btn-sm" style={{"marginTop":"10px","width":"100%"}} >Ver Evaluación Completa →</button>
      </div>

      {/*  DISTRIBUCIÓN PATRIMONIO  */}
      <div className="card">
        <div className="card-hdr"><div className="card-title">💼 Distribución</div></div>
        <div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","background":"var(--green)","borderRadius":"3px","display":"inline-block"}}></span><span style={{"color":"var(--text2)"}}>Inversiones</span></div><span style={{"fontFamily":"var(--mono)","fontWeight":"600","color":"var(--green)"}}>$6.06M</span></div>
          <div className="pt"><div className="pf" style={{"width":"62%","background":"var(--green)"}}></div></div>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","background":"var(--orange)","borderRadius":"3px","display":"inline-block"}}></span><span style={{"color":"var(--text2)"}}>Bancos</span></div><span style={{"fontFamily":"var(--mono)","fontWeight":"600","color":"var(--orange)"}}>$4.05M</span></div>
          <div className="pt"><div className="pf" style={{"width":"41%","background":"var(--orange)"}}></div></div>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={{"width":"10px","height":"10px","background":"var(--blue)","borderRadius":"3px","display":"inline-block"}}></span><span style={{"color":"var(--text2)"}}>Ahorros</span></div><span style={{"fontFamily":"var(--mono)","fontWeight":"600","color":"var(--blue)"}}>$27.3M</span></div>
          <div className="pt"><div className="pf" style={{"width":"85%","background":"var(--blue)"}}></div></div>
        </div>
      </div>
    </div>
  </div>

  {/*  QUICK ACTIONS  */}
  <div className="card">
    <div className="card-hdr"><div className="card-title">⚡ Acciones Rápidas</div><div className="card-sub">Accede a cualquier módulo directamente</div></div>
    <div style={{"display":"grid","gridTemplateColumns":"repeat(7,1fr)","gap":"10px"}}>
      <div className="quick-action" onClick={() => setActivePage('ingresos')}><div className="qa-icon" style={{"background":"rgba(255,154,118,0.15)"}}>💰</div><div className="qa-label">Ingresos</div></div>
      <div className="quick-action" onClick={() => setActivePage('gastos')}><div className="qa-icon" style={{"background":"rgba(232,93,117,0.15)"}}>💸</div><div className="qa-label">Gastos</div></div>
      <div className="quick-action" onClick={() => setActivePage('transferencias')}><div className="qa-icon" style={{"background":"rgba(107,127,214,0.15)"}}>🔄</div><div className="qa-label">Transferir</div></div>
      <div className="quick-action" onClick={() => setActivePage('bancos')}><div className="qa-icon" style={{"background":"rgba(126,211,33,0.15)"}}>🏦</div><div className="qa-label">Bancos</div></div>
      <div className="quick-action" onClick={() => setActivePage('ahorros')}><div className="qa-icon" style={{"background":"rgba(126,211,33,0.15)"}}>🎯</div><div className="qa-label">Ahorros</div></div>
      <div className="quick-action" onClick={() => setActivePage('deudas')}><div className="qa-icon" style={{"background":"rgba(232,93,117,0.15)"}}>📋</div><div className="qa-label">Deudas</div></div>
      <div className="quick-action" onClick={() => setActivePage('ia')}><div className="qa-icon" style={{"background":"rgba(168,85,247,0.15)"}}>🤖</div><div className="qa-label">IA</div></div>
    </div>
  </div>

  {/*  CHARTS ROW  */}
  <div className="gms">
    <div style={{"display":"flex","flexDirection":"column","gap":"14px"}}>

      {/*  AREA CHART  */}
      <div className="card card-glow-o">
        <div className="card-shine"></div>
        <div className="card-hdr">
          <div><div className="card-title">📈 Ingresos vs Gastos vs Ahorros</div><div className="card-sub">Últimos 6 meses — Tendencia general</div></div>
          <span className="badge bg">↑ Tendencia positiva</span>
        </div>
        <svg width="100%" viewBox="0 0 560 150" preserveAspectRatio="none" style={{"height":"150px"}}>
          <defs>
            <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF9A76" stopOpacity="0.35"/><stop offset="95%" stopColor="#FF9A76" stopOpacity="0.02"/></linearGradient>
            <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E85D75" stopOpacity="0.25"/><stop offset="95%" stopColor="#E85D75" stopOpacity="0.01"/></linearGradient>
            <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7ED321" stopOpacity="0.25"/><stop offset="95%" stopColor="#7ED321" stopOpacity="0.01"/></linearGradient>
          </defs>
          <line x1="0" y1="30" x2="560" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <line x1="0" y1="70" x2="560" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <line x1="0" y1="110" x2="560" y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          {/*  Ingresos  */}
          <path d="M0,105 C112,90 112,75 224,58 C336,42 336,52 448,35 C504,26 504,16 560,8 L560,150 L0,150Z" fill="url(#gI)"/>
          <path d="M0,105 C112,90 112,75 224,58 C336,42 336,52 448,35 C504,26 504,16 560,8" fill="none" stroke="#FF9A76" strokeWidth="2.5" strokeLinejoin="round"/>
          {/*  Gastos  */}
          <path d="M0,120 C112,115 112,110 224,98 C336,86 336,94 448,78 C504,70 504,62 560,55 L560,150 L0,150Z" fill="url(#gG)"/>
          <path d="M0,120 C112,115 112,110 224,98 C336,86 336,94 448,78 C504,70 504,62 560,55" fill="none" stroke="#E85D75" strokeWidth="2" strokeDasharray="6,3"/>
          {/*  Ahorros  */}
          <path d="M0,135 C112,130 112,128 224,120 C336,112 336,108 448,95 C504,88 504,80 560,70 L560,150 L0,150Z" fill="url(#gA)"/>
          <path d="M0,135 C112,130 112,128 224,120 C336,112 336,108 448,95 C504,88 504,80 560,70" fill="none" stroke="#7ED321" strokeWidth="2" strokeDasharray="3,3"/>
          {/*  Dots  */}
          <circle cx="0" cy="105" r="4" fill="#FF9A76"/>
          <circle cx="112" cy="88" r="4" fill="#FF9A76"/>
          <circle cx="224" cy="58" r="4" fill="#FF9A76"/>
          <circle cx="336" cy="50" r="4" fill="#FF9A76"/>
          <circle cx="448" cy="35" r="4" fill="#FF9A76"/>
          <circle cx="560" cy="8" r="5" fill="#FF9A76" stroke="var(--surface)" strokeWidth="2"/>
          {/*  Labels  */}
          <text x="0" y="147" fontSize="9.5" fill="rgba(139,156,200,0.7)" fontFamily="sans-serif">Oct</text>
          <text x="105" y="147" fontSize="9.5" fill="rgba(139,156,200,0.7)" fontFamily="sans-serif">Nov</text>
          <text x="215" y="147" fontSize="9.5" fill="rgba(139,156,200,0.7)" fontFamily="sans-serif">Dic</text>
          <text x="326" y="147" fontSize="9.5" fill="rgba(139,156,200,0.7)" fontFamily="sans-serif">Ene</text>
          <text x="434" y="147" fontSize="9.5" fill="rgba(139,156,200,0.7)" fontFamily="sans-serif">Feb</text>
          <text x="540" y="147" fontSize="9.5" fill="rgba(139,156,200,0.7)" fontFamily="sans-serif">Mar</text>
        </svg>
        <div style={{"display":"flex","gap":"20px","marginTop":"8px","fontSize":"12px"}}>
          <div style={{"display":"flex","alignItems":"center","gap":"5px"}}><span style={{"width":"18px","height":"2.5px","background":"var(--orange)","display":"inline-block","borderRadius":"3px"}}></span><span style={{"color":"var(--text2)"}}>Ingresos</span></div>
          <div style={{"display":"flex","alignItems":"center","gap":"5px"}}><span style={{"width":"18px","height":"2.5px","background":"var(--pink)","display":"inline-block","borderRadius":"3px"}}></span><span style={{"color":"var(--text2)"}}>Gastos</span></div>
          <div style={{"display":"flex","alignItems":"center","gap":"5px"}}><span style={{"width":"18px","height":"2.5px","background":"var(--green)","display":"inline-block","borderRadius":"3px"}}></span><span style={{"color":"var(--text2)"}}>Ahorros</span></div>
        </div>
      </div>

      {/*  PARAMETERS  */}
      <div className="card">
        <div className="card-hdr"><div className="card-title">🎯 Parámetros de Gasto</div><div className="card-sub">% del presupuesto utilizado</div></div>
        <div style={{"display":"flex","justifyContent":"space-around","flexWrap":"wrap","gap":"10px"}}>
          <div className="ring-item"><svg viewBox="0 0 60 60" width="64" height="64"><circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/><circle cx="30" cy="30" r="24" fill="none" stroke="#FF9A76" strokeWidth="8" strokeDasharray="86 151" strokeDashoffset="-37.7" transform="rotate(-90 30 30)" strokeLinecap="round"/><text x="30" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FF9A76" fontFamily="'IBM Plex Mono',monospace">57%</text></svg><div className="ring-label">Alimentación</div></div>
          <div className="ring-item"><svg viewBox="0 0 60 60" width="64" height="64"><circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/><circle cx="30" cy="30" r="24" fill="none" stroke="#7ED321" strokeWidth="8" strokeDasharray="114 151" strokeDashoffset="-37.7" transform="rotate(-90 30 30)" strokeLinecap="round"/><text x="30" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7ED321" fontFamily="'IBM Plex Mono',monospace">76%</text></svg><div className="ring-label">Vivienda</div></div>
          <div className="ring-item"><svg viewBox="0 0 60 60" width="64" height="64"><circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/><circle cx="30" cy="30" r="24" fill="none" stroke="#6B7FD6" strokeWidth="8" strokeDasharray="32 151" strokeDashoffset="-37.7" transform="rotate(-90 30 30)" strokeLinecap="round"/><text x="30" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6B7FD6" fontFamily="'IBM Plex Mono',monospace">21%</text></svg><div className="ring-label">Transporte</div></div>
          <div className="ring-item"><svg viewBox="0 0 60 60" width="64" height="64"><circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/><circle cx="30" cy="30" r="24" fill="none" stroke="#A855F7" strokeWidth="8" strokeDasharray="51 151" strokeDashoffset="-37.7" transform="rotate(-90 30 30)" strokeLinecap="round"/><text x="30" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#A855F7" fontFamily="'IBM Plex Mono',monospace">34%</text></svg><div className="ring-label">Ocio</div></div>
          <div className="ring-item"><svg viewBox="0 0 60 60" width="64" height="64"><circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/><circle cx="30" cy="30" r="24" fill="none" stroke="#22D3EE" strokeWidth="8" strokeDasharray="15 151" strokeDashoffset="-37.7" transform="rotate(-90 30 30)" strokeLinecap="round"/><text x="30" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#22D3EE" fontFamily="'IBM Plex Mono',monospace">10%</text></svg><div className="ring-label">Vacaciones</div></div>
        </div>
      </div>
    </div>

    {/*  RIGHT COLUMN  */}
    <div style={{"display":"flex","flexDirection":"column","gap":"14px"}}>

      {/*  BANK CARDS  */}
      <div className="card">
        <div className="card-hdr"><div className="card-title">💳 Cuentas Activas</div><span className="card-action" onClick={() => setActivePage('bancos')}>Ver todas →</span></div>
        <div style={{"display":"flex","flexDirection":"column","gap":"10px"}}>
          {bancos.slice(0, 3).map((b, i) => {
            const bgColors = [
              'linear-gradient(135deg,rgba(255,154,118,0.15),rgba(255,154,118,0.04))',
              'linear-gradient(135deg,rgba(107,127,214,0.15),rgba(107,127,214,0.04))',
              'linear-gradient(135deg,rgba(126,211,33,0.12),rgba(126,211,33,0.03))'
            ];
            const textColors = ['var(--orange)', 'var(--blue)', 'var(--green)'];
            return (
              <div key={b.id} style={{"background": bgColors[i % 3], "border": `1px solid ${textColors[i % 3].replace('var', 'rgba').replace(')', ',0.2)')}`, "borderRadius": "var(--r2)", "padding": "14px", "cursor": "pointer", "position": "relative", "overflow": "hidden"}}>
                <div style={{"fontSize": "11px", "color": "var(--text2)", "fontWeight": "600", "marginBottom": "8px"}}>🏦 {b.nombre}</div>
                <div style={{"position": "absolute", "top": "12px", "right": "12px", "fontWeight": "800", "color": textColors[i % 3], "opacity": "0.6", "fontSize": "13px"}}>{b.tipo}</div>
                <div style={{"fontFamily": "var(--mono)", "fontSize": "19px", "fontWeight": "600", "color": textColors[i % 3], "marginBottom": "5px"}}>${Number(b.saldo).toLocaleString()}</div>
                <div style={{"fontFamily": "var(--mono)", "fontSize": "10px", "color": "var(--text3)", "letterSpacing": "1px"}}>{b.numero}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/*  DONUT  */}
      <div className="card">
        <div className="card-hdr"><div className="card-title">🍩 Gastos por Categoría</div></div>
        <div style={{"display":"flex","alignItems":"center","gap":"14px"}}>
          <svg viewBox="0 0 100 100" width="90" height="90" style={{"flexShrink":"0"}}>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#FF9A76" strokeWidth="16" strokeDasharray="88 132" strokeDashoffset="0" transform="rotate(-90 50 50)"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#E85D75" strokeWidth="16" strokeDasharray="40 180" strokeDashoffset="-88" transform="rotate(-90 50 50)"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#7ED321" strokeWidth="16" strokeDasharray="28 192" strokeDashoffset="-128" transform="rotate(-90 50 50)"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#6B7FD6" strokeWidth="16" strokeDasharray="22 198" strokeDashoffset="-156" transform="rotate(-90 50 50)"/>
            <text x="50" y="47" textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="'IBM Plex Mono',monospace">$2.1M</text>
            <text x="50" y="57" textAnchor="middle" fontSize="6" fill="rgba(139,156,200,0.8)" fontFamily="sans-serif">total gastos</text>
          </svg>
          <div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"7px"}}>
            <div style={{"display":"flex","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"5px","color":"var(--text2)"}}><span style={{"width":"8px","height":"8px","background":"#FF9A76","borderRadius":"2px","display":"inline-block"}}></span>Aliment.</div><span style={{"fontFamily":"var(--mono)"}}>$450K</span></div>
            <div style={{"display":"flex","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"5px","color":"var(--text2)"}}><span style={{"width":"8px","height":"8px","background":"#E85D75","borderRadius":"2px","display":"inline-block"}}></span>Transp.</div><span style={{"fontFamily":"var(--mono)"}}>$280K</span></div>
            <div style={{"display":"flex","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"5px","color":"var(--text2)"}}><span style={{"width":"8px","height":"8px","background":"#7ED321","borderRadius":"2px","display":"inline-block"}}></span>Servicios</div><span style={{"fontFamily":"var(--mono)"}}>$320K</span></div>
            <div style={{"display":"flex","justifyContent":"space-between","fontSize":"12px"}}><div style={{"display":"flex","alignItems":"center","gap":"5px","color":"var(--text2)"}}><span style={{"width":"8px","height":"8px","background":"#6B7FD6","borderRadius":"2px","display":"inline-block"}}></span>Vivienda</div><span style={{"fontFamily":"var(--mono)"}}>$800K</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/*  EVALUACIÓN FINANCIERA  */}
  <div className="card card-glow-b">
    <div className="card-hdr"><div><div className="card-title">🏆 Evaluación Financiera Integral</div><div className="card-sub">Análisis de tu salud financiera en tiempo real</div></div><button className="btn btn-gh btn-sm" >Ver Análisis Completo →</button></div>
    <div style={{"display":"grid","gridTemplateColumns":"repeat(5,1fr)","gap":"12px"}}>
      <div className="eval-card">
        <div style={{"fontSize":"20px","marginBottom":"4px"}}>💪</div>
        <div className="eval-score" style={{"color":"var(--green)"}}>A+</div>
        <div className="eval-label" style={{"color":"var(--green)"}}>Liquidez</div>
        <div className="eval-sub">Excelente</div>
      </div>
      <div className="eval-card">
        <div style={{"fontSize":"20px","marginBottom":"4px"}}>⚡</div>
        <div className="eval-score" style={{"color":"var(--orange)"}}>B+</div>
        <div className="eval-label" style={{"color":"var(--orange)"}}>Deudas</div>
        <div className="eval-sub">Manejable</div>
      </div>
      <div className="eval-card">
        <div style={{"fontSize":"20px","marginBottom":"4px"}}>📈</div>
        <div className="eval-score" style={{"color":"var(--blue)"}}>A</div>
        <div className="eval-label" style={{"color":"var(--blue)"}}>Ahorro</div>
        <div className="eval-sub">34.4% tasa</div>
      </div>
      <div className="eval-card">
        <div style={{"fontSize":"20px","marginBottom":"4px"}}>🎯</div>
        <div className="eval-score" style={{"color":"var(--purple)"}}>B</div>
        <div className="eval-label" style={{"color":"var(--purple)"}}>Inversión</div>
        <div className="eval-sub">Diversificar</div>
      </div>
      <div className="eval-card">
        <div style={{"fontSize":"20px","marginBottom":"4px"}}>🛡️</div>
        <div className="eval-score" style={{"color":"var(--cyan)"}}>A-</div>
        <div className="eval-label" style={{"color":"var(--cyan)"}}>Protección</div>
        <div className="eval-sub">Seguros OK</div>
      </div>
    </div>
  </div>

  {/*  METAS + PAGOS PRÓXIMOS  */}
  <div className="g2">
    {/*  METAS  */}
    <div className="card" onClick={() => setActivePage('ahorros')} style={{"cursor":"pointer"}}>
      <div className="card-hdr"><div className="card-title">🎯 Metas de Ahorro</div><span className="card-action">Ver todas →</span></div>
      <div style={{"display":"flex","flexDirection":"column","gap":"12px"}}>
        {ahorros.slice(0, 4).map(a => {
          const pct = Math.min(100, Math.round((a.actual / a.objetivo) * 100)) || 0;
          return (
            <div key={a.id}>
              <div style={{"display":"flex","justifyContent":"space-between","fontSize":"13px","marginBottom":"6px"}}>
                <span style={{"fontWeight":"600"}}>{a.nombre}</span>
                <span style={{"fontFamily":"var(--mono)","color":"var(--text2)","fontSize":"12px"}}>{pct}% — ${(a.actual/1000000).toFixed(1)}M / ${(a.objetivo/1000000).toFixed(1)}M</span>
              </div>
              <div className="pt"><div className="pf" style={{"width": `${pct}%`, "background": `linear-gradient(90deg, ${a.color}, ${a.color})`}}></div></div>
            </div>
          )
        })}
      </div>
    </div>

    {/*  PAGOS  */}
    <div className="card">
      <div className="card-hdr"><div className="card-title">⏰ Próximos Pagos</div><span className="card-action" >Ver calendario →</span></div>
      <div className="alert al-p" style={{"marginBottom":"12px"}}><span className="al-icon">🔴</span><div className="al-body"><div className="al-title" style={{"color":"var(--pink)","fontSize":"12px"}}>Pago vencido — Internet VTR</div><div style={{"fontSize":"12px"}}>$45.000 venció el 12 de Marzo</div></div><button className="btn btn-o btn-sm">Pagar</button></div>
      <div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>
        <div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"9px 12px","background":"var(--glass)","borderRadius":"var(--r3)"}}><span style={{"fontSize":"16px"}}>⏳</span><div style={{"flex":"1"}}><div style={{"fontSize":"13px","fontWeight":"600"}}>Arriendo</div><div style={{"fontSize":"11px","color":"var(--orange)"}}>15 Mar — Pendiente</div></div><span style={{"fontFamily":"var(--mono)","fontSize":"13px"}} className="neg">$800.000</span><button className="btn btn-o btn-sm">Pagar</button></div>
        <div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"9px 12px","background":"var(--glass)","borderRadius":"var(--r3)"}}><span style={{"fontSize":"16px"}}>⏳</span><div style={{"flex":"1"}}><div style={{"fontSize":"13px","fontWeight":"600"}}>Tarjeta Crédito</div><div style={{"fontSize":"11px","color":"var(--orange)"}}>20 Mar — Pendiente</div></div><span style={{"fontFamily":"var(--mono)","fontSize":"13px"}} className="neg">$450.000</span><button className="btn btn-o btn-sm">Pagar</button></div>
        <div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"9px 12px","background":"var(--glass)","borderRadius":"var(--r3)"}}><span style={{"fontSize":"16px"}}>⏳</span><div style={{"flex":"1"}}><div style={{"fontSize":"13px","fontWeight":"600"}}>Cuota BCI</div><div style={{"fontSize":"11px","color":"var(--orange)"}}>15 Mar — Pendiente</div></div><span style={{"fontFamily":"var(--mono)","fontSize":"13px"}} className="neg">$250.000</span><button className="btn btn-o btn-sm">Pagar</button></div>
        <div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"9px 12px","background":"var(--glass)","borderRadius":"var(--r3)"}}><span style={{"fontSize":"16px"}}>✅</span><div style={{"flex":"1"}}><div style={{"fontSize":"13px","fontWeight":"600","color":"var(--text2)"}}>Agua y Luz</div><div style={{"fontSize":"11px","color":"var(--green)"}}>10 Mar — Completado</div></div><span style={{"fontFamily":"var(--mono)","fontSize":"13px","color":"var(--text2)"}}>$85.000</span></div>
      </div>
    </div>
  </div>

  {/*  TRANSACCIONES RECIENTES  */}
  <div className="card">
    <div className="card-hdr"><div className="card-title">💳 Transacciones Recientes</div></div>
    <div className="tw"><table>
      <thead><tr><th>Descripción</th><th>Tipo</th><th>Categoría</th><th className="r">Monto</th><th>Fecha</th><th>Cuenta</th></tr></thead>
      <tbody>
        {[...ingresos.map(i => ({...i, type: 'Ingreso'})), ...gastos.map(g => ({...g, type: 'Gasto'}))]
          .sort((a,b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 6)
          .map((t, idx) => (
            <tr key={idx}>
              <td className="tdp">{t.type === 'Ingreso' ? '💰' : '🛒'} {t.desc}</td>
              <td><span className={`badge ${t.type === 'Ingreso' ? 'bg' : 'bp'}`}>{t.type}</span></td>
              <td>{t.cat}</td>
              <td className={`tdr ${t.type === 'Ingreso' ? 'pos' : 'neg'}`}>{t.type === 'Ingreso' ? '+' : '-'}${Number(t.monto).toLocaleString()}</td>
              <td className="tdm" style={{"fontSize":"11.5px","color":"var(--text2)"}}>{t.fecha}</td>
              <td>{t.fuente || t.cuenta}</td>
            </tr>
          ))}
      </tbody>
    </table></div>
  </div>

    </div>
  );
}
