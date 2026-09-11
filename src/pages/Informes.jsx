import React, { useMemo, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from 'recharts';

const COLORS = ['#FF9A76', '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#FBBF24', '#38BDF8'];

export default function Informes() {
  const { ingresos, gastos, bancos, ahorros, inversiones } = useAppData();
  const printRef = useRef();

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

    // For charts, usually ascending is better (left to right)
    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month)); 
  }, [ingresos, gastos]);

  // For pie chart
  const gastosPorCat = useMemo(() => {
    const cat = {};
    gastos.forEach(g => {
      cat[g.cat] = (cat[g.cat] || 0) + Number(g.monto);
    });
    return Object.entries(cat).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [gastos]);

  // For radar chart (Gasto Actual vs Promedio)
  const radarData = useMemo(() => {
    const today = new Date();
    const currentPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const pastMonthsCount = Object.keys(monthlyData).length || 1;
    
    const catTotal = {};
    const catCurrent = {};
    
    gastos.forEach(g => {
      const isCurrent = g.fecha && g.fecha.startsWith(currentPrefix);
      catTotal[g.cat] = (catTotal[g.cat] || 0) + Number(g.monto);
      if (isCurrent) {
        catCurrent[g.cat] = (catCurrent[g.cat] || 0) + Number(g.monto);
      }
    });

    return Object.entries(catTotal).map(([subject, totalValue]) => ({
      subject,
      promedio: totalValue / pastMonthsCount,
      actual: catCurrent[subject] || 0
    })).sort((a, b) => b.promedio - a.promedio).slice(0, 6); // Max 6 categories for radar
  }, [gastos, monthlyData]);

  // For Liquidity funnel/bar
  const liquidezData = useMemo(() => {
    const totalBancos = bancos.reduce((s, b) => s + Number(b.balance), 0);
    const totalAhorrosCapital = ahorros.reduce((s, a) => s + Number(a.actual), 0);
    const totalInversiones = inversiones.reduce((s, i) => s + Number(i.actual), 0);
    return [
      { name: 'Efectivo/Bancos', valor: totalBancos, fill: 'var(--green)' },
      { name: 'Ahorros', valor: totalAhorrosCapital, fill: 'var(--blue)' },
      { name: 'Inversiones', valor: totalInversiones, fill: 'var(--purple)' }
    ];
  }, [bancos, ahorros, inversiones]);

  const totalIngresos = ingresos.reduce((s, i) => s + Number(i.monto), 0);
  const totalGastos = gastos.reduce((s, g) => s + Number(g.monto), 0);
  const totalAhorros = totalIngresos - totalGastos;
  const tasaAhorro = totalIngresos > 0 ? ((totalAhorros / totalIngresos) * 100).toFixed(1) : 0;

  const handleDownloadPDF = async () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(18);
    doc.text("Informe Financiero Corporativo", 40, 40);
    
    doc.setFontSize(11);
    doc.text(`Ingresos Totales: $${totalIngresos.toLocaleString()}`, 40, 65);
    doc.text(`Gastos Totales: $${totalGastos.toLocaleString()}`, 40, 80);
    doc.text(`Ahorros Netos: $${totalAhorros.toLocaleString()}`, 40, 95);
    doc.text(`Tasa de Ahorro: ${tasaAhorro}%`, 40, 110);

    let currentY = 130;

    // Try to capture charts
    try {
      const chartsEl = document.getElementById('informes-charts');
      if (chartsEl) {
        const canvas = await html2canvas(chartsEl, { scale: 1.5 });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = 515;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 40, currentY, pdfWidth, pdfHeight);
        currentY += pdfHeight + 20;
      }
    } catch (e) {
      console.warn("Error capturando gráficos", e);
    }

    const tableData = [...monthlyData].map(row => {
      const ahorrosMes = row.ingresos - row.gastos;
      const tasaMes = row.ingresos > 0 ? ((ahorrosMes / row.ingresos) * 100).toFixed(1) : 0;
      return [
        row.month,
        `$${row.ingresos.toLocaleString()}`,
        `$${row.gastos.toLocaleString()}`,
        `$${ahorrosMes.toLocaleString()}`,
        `${tasaMes}%`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Período', 'Ingresos', 'Gastos', 'Ahorro Neto', 'Tasa Ahorro']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 45, 50], textColor: 255 },
      styles: { fontSize: 10 }
    });

    doc.save("Informe_Financiero.pdf");
  };

  const handleDownloadExcel = () => {
    const tableData = [...monthlyData].map(row => {
      const ahorrosMes = row.ingresos - row.gastos;
      const tasaMes = row.ingresos > 0 ? ((ahorrosMes / row.ingresos) * 100).toFixed(1) : 0;
      return {
        Período: row.month,
        Ingresos: row.ingresos,
        Gastos: row.gastos,
        'Ahorro Neto': ahorrosMes,
        'Tasa Ahorro (%)': Number(tasaMes)
      };
    });
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen Mensual");
    XLSX.writeFile(wb, "Informe_Resumen_Mensual.xlsx");
  };

  return (
    <div className="page active" style={{ display: 'flex' }} ref={printRef}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📈 Informes y Métricas</div>
          <div className="page-sub">Reportes corporativos y métricas de rendimiento</div>
        </div>
        <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
          <button className="btn btn-gh btn-sm" onClick={handleDownloadExcel}>📄 Exportar Excel</button>
          <button className="btn btn-gh btn-sm" onClick={handleDownloadPDF}>🖨️ Descargar PDF (Estructurado)</button>
        </div>
      </div>

      <div className="g4">
        <div className="sc sc-g"><div className="sc-label">Ingresos Totales</div><div className="sc-val">${totalIngresos.toLocaleString()}</div><div className="sc-icon" style={{color: 'var(--green)'}}>💰</div></div>
        <div className="sc sc-p"><div className="sc-label">Gastos Totales</div><div className="sc-val">${totalGastos.toLocaleString()}</div><div className="sc-icon" style={{color: 'var(--pink)'}}>💸</div></div>
        <div className="sc sc-b"><div className="sc-label">Ahorros Netos</div><div className="sc-val">${totalAhorros.toLocaleString()}</div><div className="sc-icon" style={{color: 'var(--blue)'}}>🏦</div></div>
        <div className="sc sc-pu"><div className="sc-label">Tasa de Ahorro Histórica</div><div className="sc-val">{tasaAhorro}%</div><div className="sc-icon" style={{color: 'var(--purple)'}}>📈</div></div>
      </div>

      <div id="informes-charts" style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
        {/* Gráfico de Líneas (Evolución) */}
        <div className="card" style={{flex: '2 1 400px', minWidth:'400px'}}>
          <div className="card-hdr"><div className="card-title">📈 Evolución de Patrimonio</div></div>
          <div style={{height:'300px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <defs>
                  <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#34D399" floodOpacity="0.4"/>
                  </filter>
                  <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F87171" floodOpacity="0.4"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${(val/1000)}k`} />
                <RechartsTooltip 
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                  formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, '']}
                  labelStyle={{ color: 'var(--text2)', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} iconType="circle" />
                <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="var(--green)" strokeWidth={4} dot={{r:5, fill: 'var(--surface)', stroke: 'var(--green)', strokeWidth: 2}} activeDot={{r:7, fill: 'var(--green)', stroke: 'var(--surface)', strokeWidth: 2}} filter="url(#glowGreen)" />
                <Line type="monotone" dataKey="gastos" name="Gastos" stroke="var(--pink)" strokeWidth={4} dot={{r:5, fill: 'var(--surface)', stroke: 'var(--pink)', strokeWidth: 2}} activeDot={{r:7, fill: 'var(--pink)', stroke: 'var(--surface)', strokeWidth: 2}} filter="url(#glowPink)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Donut (Distribución) */}
        <div className="card" style={{flex: '1 1 300px', minWidth:'300px'}}>
          <div className="card-hdr"><div className="card-title">🍩 Gastos por Categoría</div></div>
          <div style={{height:'300px', width:'100%'}}>
            {gastosPorCat.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
                    </filter>
                  </defs>
                  <Pie
                    data={gastosPorCat}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="var(--surface)"
                    strokeWidth={2}
                    filter="url(#pieGlow)"
                  >
                    {gastosPorCat.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, 'Total']}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: 'var(--text)', padding: '12px' }}
                    itemStyle={{ fontWeight: '500', color: 'var(--text2)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize:'12px', fontWeight: 500}} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text2)'}}>Sin gastos registrados</div>
            )}
          </div>
        </div>

        {/* Gráfico de Radar (Gasto vs Presupuesto Promedio) */}
        <div className="card" style={{flex: '1 1 350px'}}>
          <div className="card-hdr"><div className="card-title">🎯 Perfil de Gastos</div><div className="card-sub">Mes Actual vs Promedio Mensual</div></div>
          <div style={{height:'300px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--text2)', fontSize: 11, fontWeight: 500}} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Promedio" dataKey="promedio" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Mes Actual" dataKey="actual" stroke="var(--pink)" fill="var(--pink)" fillOpacity={0.5} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} iconType="circle" />
                <RechartsTooltip 
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                  formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, '']}
                  labelStyle={{ color: 'var(--text2)', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras Horizontales (Composición de Liquidez) */}
        <div className="card" style={{flex: '1 1 350px'}}>
          <div className="card-hdr"><div className="card-title">💧 Composición de Liquidez</div><div className="card-sub">Efectivo vs Ahorros vs Inversiones</div></div>
          <div style={{height:'300px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liquidezData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--text2)" axisLine={false} tickLine={false} tickFormatter={(val) => `$${(val/1000)}k`} tick={{fontSize: 12}} />
                <YAxis dataKey="name" type="category" stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} width={100} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--surface2)'}}
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                  formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, 'Total']}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={30}>
                  {liquidezData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">📑 Resumen Mensual (Tabla)</div></div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Período</th>
                <th className="r">Ingresos</th>
                <th className="r">Gastos</th>
                <th className="r">Ahorro Neto</th>
                <th className="r">Tasa Ahorro</th>
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
