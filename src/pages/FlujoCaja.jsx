import React, { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { getPeriodPrefix, getPreviousPeriodPrefixes } from '../utils/period';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export default function Flujo({ period }) {
  const { ingresos, gastos } = useAppData();

  const prefix = getPeriodPrefix(period);

  const ingresosMes = ingresos.filter(i => i.fecha && prefix && i.fecha.startsWith(prefix));
  const gastosMes = gastos.filter(g => g.fecha && prefix && g.fecha.startsWith(prefix));

  const totalIngresos = ingresosMes.reduce((sum, i) => sum + Number(i.monto), 0);
  const totalGastos = gastosMes.reduce((sum, g) => sum + Number(g.monto), 0);
  const flujoNeto = totalIngresos - totalGastos;

  const waterfallData = useMemo(() => {
    return [
      { name: 'Ingresos (Entradas)', transparente: 0, valor: totalIngresos, fill: 'var(--green)' },
      { name: 'Gastos (Salidas)', transparente: Math.max(0, totalIngresos - totalGastos), valor: totalGastos, fill: 'var(--pink)' },
      { name: 'Flujo Neto', transparente: 0, valor: Math.abs(flujoNeto), fill: flujoNeto >= 0 ? 'var(--blue)' : 'var(--orange)' }
    ];
  }, [totalIngresos, totalGastos, flujoNeto]);

  const historyData = useMemo(() => {
    return [...getPreviousPeriodPrefixes(period)].reverse().map(({ label, prefix: monthPrefix }) => {
      const inMes = ingresos.filter(i => i.fecha && i.fecha.startsWith(monthPrefix)).reduce((sum, i) => sum + Number(i.monto), 0);
      const outMes = gastos.filter(g => g.fecha && g.fecha.startsWith(monthPrefix)).reduce((sum, g) => sum + Number(g.monto), 0);
      return {
        mes: label,
        ingresos: inMes,
        gastos: outMes,
        neto: inMes - outMes
      };
    });
  }, [period, ingresos, gastos]);

  const exportarCSVProfesional = () => {
    // Agrupar por categoría
    const inCat = {};
    ingresosMes.forEach(i => { inCat[i.cat] = (inCat[i.cat] || 0) + Number(i.monto); });
    
    const outCat = {};
    gastosMes.forEach(g => { outCat[g.cat] = (outCat[g.cat] || 0) + Number(g.monto); });

    const rows = [
      { Concepto: `ESTADO DE FLUJOS DE EFECTIVO - ${period.toUpperCase()} 2026`, Monto: '' },
      { Concepto: '', Monto: '' },
      { Concepto: 'INGRESOS (Entradas Operativas)', Monto: '' }
    ];

    Object.entries(inCat).forEach(([cat, monto]) => {
      rows.push({ Concepto: `   ${cat}`, Monto: monto });
    });
    rows.push({ Concepto: 'TOTAL INGRESOS', Monto: totalIngresos });
    rows.push({ Concepto: '', Monto: '' });
    
    rows.push({ Concepto: 'EGRESOS (Salidas Operativas)', Monto: '' });
    Object.entries(outCat).forEach(([cat, monto]) => {
      rows.push({ Concepto: `   ${cat}`, Monto: -monto });
    });
    rows.push({ Concepto: 'TOTAL EGRESOS', Monto: -totalGastos });
    rows.push({ Concepto: '', Monto: '' });
    
    rows.push({ Concepto: 'FLUJO DE CAJA NETO DEL PERIODO', Monto: flujoNeto });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Flujo de Caja");
    XLSX.writeFile(wb, `Flujo_Caja_${period}.csv`);
  };

  const todasTransacciones = [
    ...ingresosMes.map(i => ({...i, tipo: 'Ingreso'})),
    ...gastosMes.map(g => ({...g, tipo: 'Gasto'}))
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📊 Flujo de Caja</div>
          <div className="page-sub">Análisis de liquidez y movimientos netos — {period} 2026</div>
        </div>
        <div style={{display:'flex', gap:'8px'}}>
          <button className="btn btn-gh btn-sm" onClick={exportarCSVProfesional}>📄 Exportar CSV (Académico)</button>
          <button className="btn btn-gh btn-sm" onClick={() => window.print()}>🖨️ Imprimir / PDF</button>
        </div>
      </div>

      <div className="g3" style={{ marginBottom: '16px' }}>
        <div className="sc sc-o">
          <div className="sc-label">Total Entradas</div>
          <div className="sc-val" style={{ color: 'var(--green)' }}>${totalIngresos.toLocaleString()}</div>
          <div className="sc-icon">📥</div>
        </div>
        <div className="sc sc-p">
          <div className="sc-label">Total Salidas</div>
          <div className="sc-val" style={{ color: 'var(--pink)' }}>${totalGastos.toLocaleString()}</div>
          <div className="sc-icon">📤</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">Flujo Neto</div>
          <div className="sc-val" style={{ color: flujoNeto >= 0 ? 'var(--blue)' : 'var(--pink)' }}>
            ${Math.abs(flujoNeto).toLocaleString()} {flujoNeto < 0 && '(Déficit)'}
          </div>
          <div className="sc-icon">🌊</div>
        </div>
      </div>

      <div style={{display:'flex', gap:'20px', flexWrap:'wrap', marginBottom: '20px'}}>
        <div className="card" style={{flex: '1 1 350px'}}>
          <div className="card-hdr">
            <div><div className="card-title">🌊 Cascada de Liquidez ({period})</div><div className="card-sub">Estructura del flujo neto actual</div></div>
          </div>
          <div style={{height:'350px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${(val/1000)}k`} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--surface2)'}}
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                  formatter={(value) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${value.toLocaleString('es-CL')}</span>, 'Monto']}
                  labelStyle={{ color: 'var(--text2)', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}
                />
                <Bar dataKey="transparente" stackId="a" fill="transparent" />
                <Bar dataKey="valor" stackId="a" radius={[4, 4, 4, 4]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{flex: '2 1 450px'}}>
          <div className="card-hdr">
            <div><div className="card-title">📊 Historial de Flujo</div><div className="card-sub">Entradas vs Salidas de los últimos meses</div></div>
          </div>
          <div style={{height:'350px', width:'100%', padding:'10px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis stroke="var(--text2)" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${(val/1000)}k`} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--surface2)'}}
                  contentStyle={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}}
                  formatter={(value, name) => [<span style={{fontWeight: 700, fontFamily: 'var(--mono)'}}>${Math.round(value).toLocaleString('es-CL')}</span>, name === 'ingresos' ? 'Ingresos' : (name === 'gastos' ? 'Gastos' : 'Flujo Neto')]}
                  labelStyle={{ color: 'var(--text2)', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} iconType="circle" />
                <Bar dataKey="ingresos" name="Ingresos" fill="var(--green)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill="var(--pink)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">
          <div className="card-title">📋 Detalles del Flujo</div>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th className="r">Monto</th>
                <th>Fecha</th>
                <th>Cuenta de Origen/Destino</th>
              </tr>
            </thead>
            <tbody>
              {todasTransacciones.length > 0 ? (
                todasTransacciones.map((t, idx) => (
                  <tr key={idx}>
                    <td className="tdp">{t.tipo === 'Ingreso' ? '💰' : '🛒'} {t.desc}</td>
                    <td>
                      <span className={`badge ${t.tipo === 'Ingreso' ? 'bg' : 'bp'}`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td>{t.cat}</td>
                    <td className={`tdr ${t.tipo === 'Ingreso' ? 'pos' : 'neg'}`}>
                      {t.tipo === 'Ingreso' ? '+' : '-'}${Number(t.monto).toLocaleString()}
                    </td>
                    <td className="tdm" style={{ fontSize: "11.5px", color: "var(--text2)" }}>
                      {t.fecha}
                    </td>
                    <td>{t.fuente || t.cuenta}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "var(--text2)" }}>
                    No hay movimientos para este período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
