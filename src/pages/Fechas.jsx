import React, { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { getLocalDateString, getPeriodPrefix, PERIOD_YEAR } from '../utils/period';

const toAmount = (value) => Number(value) || 0;

export default function Fechas({ period }) {
  const { deudas } = useAppData();
  const prefix = getPeriodPrefix(period);
  const today = getLocalDateString();
  const vencimientos = useMemo(
    () => deudas
      .filter((debt) => debt.vencimiento && prefix && debt.vencimiento.startsWith(prefix) && toAmount(debt.balance ?? debt.monto) > 0)
      .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento)),
    [deudas, prefix],
  );
  const overdue = vencimientos.filter((debt) => debt.vencimiento < today);
  const pending = vencimientos.filter((debt) => debt.vencimiento >= today);
  const scheduledAmount = vencimientos.reduce((sum, debt) => sum + toAmount(debt.pagoMensual), 0);

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
        <div className="card-hdr"><div><div className="card-title">📋 Vencimientos de deudas</div><div className="card-sub">No incluye recordatorios generales ni pagos completados.</div></div></div>
        {vencimientos.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', fontSize: '13px' }}>
            No hay vencimientos de deudas registrados para este período. Los recordatorios generales aún no están disponibles.
          </div>
        ) : (
          <div className="tl-group">
            {vencimientos.map((debt) => {
              const isOverdue = debt.vencimiento < today;
              return (
                <div key={debt.id} className="tl-item">
                  <div className="tl-dot" style={{ background: isOverdue ? 'rgba(232,93,117,0.15)' : 'rgba(255,154,118,0.15)' }}>{isOverdue ? '⏰' : '⏳'}</div>
                  <div style={{ flex: '1' }}>
                    <div className="tl-title">{debt.nombre || debt.desc || 'Deuda sin nombre'}</div>
                    <div className="tl-meta"><span className={`badge ${isOverdue ? 'bp' : 'bo'}`}>{isOverdue ? 'Vencido' : 'Pendiente'}</span> {debt.vencimiento}</div>
                  </div>
                  <span className="tl-amt neg">{toAmount(debt.pagoMensual) > 0 ? `$${toAmount(debt.pagoMensual).toLocaleString('es-CL')}` : 'Sin pago mensual'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
