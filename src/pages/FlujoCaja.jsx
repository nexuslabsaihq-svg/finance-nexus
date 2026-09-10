import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { getPeriodPrefix } from '../utils/period';

export default function Flujo({ period }) {
  const { ingresos, gastos } = useAppData();

  const prefix = getPeriodPrefix(period);

  const ingresosMes = ingresos.filter(i => i.fecha && prefix && i.fecha.startsWith(prefix));
  const gastosMes = gastos.filter(g => g.fecha && prefix && g.fecha.startsWith(prefix));

  const totalIngresos = ingresosMes.reduce((sum, i) => sum + Number(i.monto), 0);
  const totalGastos = gastosMes.reduce((sum, g) => sum + Number(g.monto), 0);
  const flujoNeto = totalIngresos - totalGastos;

  const todasTransacciones = [
    ...ingresosMes.map(i => ({...i, tipo: 'Ingreso'})),
    ...gastosMes.map(g => ({...g, tipo: 'Gasto'}))
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🌊 Flujo de Caja</div>
          <div className="page-sub">Análisis de liquidez y movimientos netos · {period} 2025</div>
        </div>
        <button className="btn btn-gh btn-sm" onClick={() => window.print()}>🖨️ Exportar PDF</button>
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
