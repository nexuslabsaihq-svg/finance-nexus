import React, { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import jsPDF from 'jspdf';

export default function Informes() {
  const { ingresos, gastos } = useAppData();

  const monthlyData = useMemo(() => {
    const data = {};
    const add = (dateStr, type, amount) => {
      if (!dateStr) return;
      const month = dateStr.substring(0, 7); // YYYY-MM
      if (!data[month]) data[month] = { month, ingresos: 0, gastos: 0 };
      data[month][type] += Number(amount);
    };

    ingresos.forEach(i => add(i.fecha, 'ingresos', i.monto));
    gastos.forEach(g => add(g.fecha, 'gastos', g.monto));

    return Object.values(data).sort((a, b) => b.month.localeCompare(a.month)); // Descending by month
  }, [ingresos, gastos]);

  const totalIngresos = ingresos.reduce((s, i) => s + Number(i.monto), 0);
  const totalGastos = gastos.reduce((s, g) => s + Number(g.monto), 0);
  const totalAhorros = totalIngresos - totalGastos;
  const tasaAhorro = totalIngresos > 0 ? ((totalAhorros / totalIngresos) * 100).toFixed(1) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Informe Financiero - FinanceNexus", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Ingresos Totales: $${totalIngresos.toLocaleString()}`, 14, 30);
    doc.text(`Gastos Totales: $${totalGastos.toLocaleString()}`, 14, 40);
    doc.text(`Ahorros Totales: $${totalAhorros.toLocaleString()}`, 14, 50);
    doc.text(`Tasa de Ahorro: ${tasaAhorro}%`, 14, 60);

    let y = 80;
    doc.text("Resumen Mensual:", 14, 70);
    monthlyData.forEach((row, idx) => {
      const ahorrosMes = row.ingresos - row.gastos;
      const tasaMes = row.ingresos > 0 ? ((ahorrosMes / row.ingresos) * 100).toFixed(1) : 0;
      doc.text(`${row.month} | Ing: $${row.ingresos.toLocaleString()} | Gas: $${row.gastos.toLocaleString()} | Aho: $${ahorrosMes.toLocaleString()} | Tasa: ${tasaMes}%`, 14, y + (idx * 10));
    });

    doc.save("informe-financiero.pdf");
  };

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📑 Informes</div>
          <div className="page-sub">Análisis y reportes financieros detallados</div>
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button className="btn btn-gh btn-sm" onClick={handlePrint}>🖨️ Imprimir</button>
          <button className="btn btn-o" onClick={handleDownloadPDF}>⬇️ Descargar PDF</button>
        </div>
      </div>
      
      <div className="g4">
        <div className="sc sc-o">
          <div className="sc-label">Ingresos Totales</div>
          <div className="sc-val" style={{color:"var(--orange)"}}>${totalIngresos.toLocaleString()}</div>
          <div className="sc-change ch-n">Histórico</div>
        </div>
        <div className="sc sc-p">
          <div className="sc-label">Gastos Totales</div>
          <div className="sc-val" style={{color:"var(--pink)"}}>${totalGastos.toLocaleString()}</div>
        </div>
        <div className="sc sc-g">
          <div className="sc-label">Ahorros Totales (Neto)</div>
          <div className="sc-val" style={{color:"var(--green)"}}>${totalAhorros.toLocaleString()}</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">Tasa de Ahorro</div>
          <div className="sc-val" style={{color:"var(--blue)"}}>{tasaAhorro}%</div>
          <div className="sc-change ch-up">▲ Promedio</div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">Tendencia Mensual — Ingresos vs Gastos vs Ahorros</div></div>
        <svg width="100%" viewBox="0 0 520 110" preserveAspectRatio="none" style={{height:"110px"}}>
          <line x1="0" y1="28" x2="520" y2="28" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/><line x1="0" y1="60" x2="520" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/><line x1="0" y1="92" x2="520" y2="92" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d="M0,72 C173,64 346,55 520,42" fill="none" stroke="#FF9A76" strokeWidth="2.5"/>
          <path d="M0,88 C173,83 346,85 520,68" fill="none" stroke="#E85D75" strokeWidth="2.5" strokeDasharray="6,3"/>
          <path d="M0,100 C173,95 346,82 520,60" fill="none" stroke="#7ED321" strokeWidth="2.5"/>
          <circle cx="0" cy="72" r="4" fill="#FF9A76"/><circle cx="260" cy="58" r="4" fill="#FF9A76"/><circle cx="520" cy="42" r="5" fill="#FF9A76" stroke="var(--surface)" strokeWidth="2"/>
          <text x="0" y="108" fontSize="9.5" fill="rgba(139,156,200,0.6)" fontFamily="sans-serif">Mes -2</text>
          <text x="220" y="108" fontSize="9.5" fill="rgba(139,156,200,0.6)" fontFamily="sans-serif">Mes -1</text>
          <text x="445" y="108" fontSize="9.5" fill="rgba(139,156,200,0.6)" fontFamily="sans-serif">Mes Actual</text>
        </svg>
        <div style={{display:"flex",gap:"18px",marginTop:"8px",fontSize:"12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"5px"}}><span style={{width:"18px",height:"2.5px",background:"var(--orange)",display:"inline-block",borderRadius:"3px"}}></span><span style={{color:"var(--text2)"}}>Ingresos</span></div>
          <div style={{display:"flex",alignItems:"center",gap:"5px"}}><span style={{width:"18px",height:"2.5px",background:"var(--pink)",display:"inline-block",borderRadius:"3px"}}></span><span style={{color:"var(--text2)"}}>Gastos</span></div>
          <div style={{display:"flex",alignItems:"center",gap:"5px"}}><span style={{width:"18px",height:"2.5px",background:"var(--green)",display:"inline-block",borderRadius:"3px"}}></span><span style={{color:"var(--text2)"}}>Ahorros</span></div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr"><div className="card-title">Tabla Resumen Mensual</div></div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th className="r">Ingresos</th>
                <th className="r">Gastos</th>
                <th className="r">Ahorros</th>
                <th className="r">Tasa %</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:'center', color:'var(--text2)'}}>No hay datos para mostrar</td></tr>
              ) : monthlyData.map(row => {
                const ahorrosMes = row.ingresos - row.gastos;
                const tasaMes = row.ingresos > 0 ? ((ahorrosMes / row.ingresos) * 100).toFixed(1) : 0;
                const bgClass = Number(tasaMes) >= 20 ? 'bg' : Number(tasaMes) > 0 ? 'bb' : 'bp';
                return (
                  <tr key={row.month}>
                    <td className="tdp">{row.month}</td>
                    <td className="tdr pos">${row.ingresos.toLocaleString()}</td>
                    <td className="tdr neg">${row.gastos.toLocaleString()}</td>
                    <td className="tdr tdm">${ahorrosMes.toLocaleString()}</td>
                    <td className="tdr"><span className={`badge ${bgClass}`}>{tasaMes}%</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
