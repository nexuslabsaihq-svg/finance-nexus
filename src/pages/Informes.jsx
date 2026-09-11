import React, { useMemo, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#FF9A76', '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#FBBF24', '#38BDF8'];

export default function Informes() {
  const { ingresos, gastos } = useAppData();
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
        <div className="sc sc-o"><div className="sc-label">Ingresos Totales</div><div className="sc-val" style={{color:'var(--green)'}}>${totalIngresos.toLocaleString()}</div></div>
        <div className="sc sc-p"><div className="sc-label">Gastos Totales</div><div className="sc-val" style={{color:'var(--pink)'}}>${totalGastos.toLocaleString()}</div></div>
        <div className="sc sc-g"><div className="sc-label">Ahorros Netos</div><div className="sc-val" style={{color:'var(--blue)'}}>${totalAhorros.toLocaleString()}</div></div>
        <div className="sc sc-b"><div className="sc-label">Tasa de Ahorro Histórica</div><div className="sc-val">{tasaAhorro}%</div></div>
      </div>

      <div id="informes-charts" style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
        {/* Gráfico de Líneas (Evolución) */}
        <div className="card" style={{flex: '2 1 400px', minWidth:'400px'}}>
          <div className="card-hdr"><div className="card-title">📈 Evolución de Patrimonio</div></div>
          <div style={{height:'300px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="var(--text2)" tick={{fontSize: 12}} />
                <YAxis stroke="var(--text2)" tick={{fontSize: 12}} tickFormatter={(val) => `$${(val/1000)}k`} />
                <RechartsTooltip 
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px'}}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="var(--green)" strokeWidth={3} dot={{r:4}} />
                <Line type="monotone" dataKey="gastos" name="Gastos" stroke="var(--pink)" strokeWidth={3} dot={{r:4}} />
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
                  <Pie
                    data={gastosPorCat}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {gastosPorCat.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize:'11px'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text2)'}}>Sin gastos registrados</div>
            )}
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
