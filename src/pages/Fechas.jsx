import React, { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { getPeriodPrefix, PERIOD_YEAR } from '../utils/period';

const toAmount = (value) => Number(value) || 0;

export default function Fechas({ period }) {
  const { deudas, gastos } = useAppData();
  const prefix = getPeriodPrefix(period);
  const today = new Date().toISOString().slice(0, 10);
  
  const vencimientos = useMemo(() => {
    const d = deudas
      .filter((debt) => debt.vencimiento && prefix && debt.vencimiento.startsWith(prefix) && toAmount(debt.balance ?? debt.monto) > 0)
      .map(debt => ({ ...debt, type: 'deuda', label: debt.nombre || 'Deuda', date: debt.vencimiento, amount: toAmount(debt.pagoMensual) }));
      
    const g = gastos
      .filter(gasto => gasto.recurrente !== 'No' && gasto.fecha && prefix && gasto.fecha.startsWith(prefix))
      .map(gasto => ({ ...gasto, type: 'gasto', label: gasto.desc || 'Gasto Recurrente', date: gasto.fecha, amount: toAmount(gasto.monto) }));
      
    return [...d, ...g].sort((a, b) => a.date.localeCompare(b.date));
  }, [deudas, gastos, prefix]);

  const overdue = vencimientos.filter((v) => v.date < today);
  const pending = vencimientos.filter((v) => v.date >= today);
  const scheduledAmount = vencimientos.reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📅 Fechas de Pago</div>
          <div className="page-sub">Vencimientos de deudas registradas · {period} {PERIOD_YEAR}</div>
        </div>
      </div>

      <div className="g4">
        <div className="sc sc-o"><div className="sc-label">Vencimientos del mes</div><div className="sc-val" style={{ color: 'var(--orange)' }}>{vencimientos.length}</div><div className="sc-change ch-n">Deudas con fecha registrada</div><div className="sc-icon">⏳</div></div>
        <div className="sc sc-p"><div className="sc-label">Vencidos</div><div className="sc-val" style={{ color: 'var(--pink)' }}>{overdue.length}</div><div className="sc-change ch-n">Según la fecha de vencimiento</div><div className="sc-icon">⚠️</div></div>
        <div className="sc sc-g"><div className="sc-label">Pendientes</div><div className="sc-val" style={{ color: 'var(--green)' }}>{pending.length}</div><div className="sc-change ch-n">Aún no han vencido</div><div className="sc-icon">✅</div></div>
        <div className="sc sc-b"><div className="sc-label">Pagos mensuales declarados</div><div className="sc-val" style={{ color: 'var(--blue)' }}>${scheduledAmount.toLocaleString('es-CL')}</div><div className="sc-change ch-n">Solo deudas con pago mensual</div><div className="sc-icon">📅</div></div>
      </div>

      <div className="card">
        <div className="card-hdr"><div><div className="card-title">📅 Fechas de Vencimiento</div><div className="card-sub">Centralización de pagos de deudas y gastos recurrentes.</div></div></div>
        {vencimientos.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', fontSize: '13px' }}>
            No hay vencimientos de deudas ni gastos recurrentes para este período.
          </div>
        ) : (
          <div className="tl-group">
            {vencimientos.map((item, idx) => {
              const isOverdue = item.date < today;
              const icon = item.type === 'deuda' ? '💳' : '🔄';
              const colorBase = isOverdue ? '232,93,117' : (item.type === 'deuda' ? '255,154,118' : '52,211,153');
              return (
                <div key={`${item.id}-${idx}`} className="tl-item">
                  <div className="tl-dot" style={{ background: `rgba(${colorBase},0.15)` }}>{icon}</div>
                  <div style={{ flex: '1' }}>
                    <div className="tl-title">{item.label}</div>
                    <div className="tl-meta"><span className={`badge ${isOverdue ? 'bp' : (item.type === 'deuda' ? 'bo' : 'bg')}`}>{isOverdue ? 'Vencido' : 'Pendiente'}</span> {item.date}</div>
                  </div>
                  <span className="tl-amt neg">{item.amount > 0 ? `$${item.amount.toLocaleString('es-CL')}` : 'Monto variable'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
