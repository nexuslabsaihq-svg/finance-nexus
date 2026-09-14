import React, { useMemo } from 'react';
import { useAppData } from '../context/useAppData';
import { getPeriodPrefix, PERIOD_YEAR } from '../utils/period';

const toAmount = (value) => Number(value) || 0;

export default function Fechas({ period }) {
  const { deudas, setDeudas, gastos, setGastos, setActivePage } = useAppData();
  const prefix = getPeriodPrefix(period);
  const today = new Date().toISOString().slice(0, 10);

  // Helper para resolver la fecha al período actual (acepta DD o YYYY-MM-DD)
  const resolvePeriodDate = (rawDate, targetPrefix) => {
    if (!rawDate || !targetPrefix) return null;
    const str = String(rawDate).trim();
    if (str.length <= 2) {
      const day = str.padStart(2, '0');
      return `${targetPrefix}-${day}`;
    }
    if (str.startsWith(targetPrefix)) {
      return str;
    }
    // Si la fecha es YYYY-MM-DD pero de otro mes, proyectar el día de pago al mes actual
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const day = str.slice(8, 10);
      return `${targetPrefix}-${day}`;
    }
    return null;
  };

  const vencimientos = useMemo(() => {
    if (!prefix) return [];

    // 1. Deudas con saldo pendiente o pago mensual programado
    const d = deudas
      .map(debt => {
        const date = resolvePeriodDate(debt.vencimiento, prefix);
        if (!date) return null;
        const balance = toAmount(debt.balance ?? debt.monto);
        const amount = toAmount(debt.pagoMensual) || balance;
        if (amount <= 0 && balance <= 0) return null;
        const isPagado = (debt.pagados || []).includes(prefix);
        const isOverdue = !isPagado && date < today;
        return {
          ...debt,
          type: 'deuda',
          label: debt.nombre || 'Deuda / Crédito',
          institution: debt.institucion || 'Institución Financiera',
          date,
          amount,
          isPagado,
          isOverdue,
          estado: isPagado ? 'pagado' : (isOverdue ? 'vencido' : 'pendiente')
        };
      })
      .filter(Boolean);

    // 2. Gastos recurrentes (recurrente !== 'No' o esRecurrente == true)
    const g = gastos
      .filter(gasto => gasto.esRecurrente || (gasto.recurrente && gasto.recurrente !== 'No'))
      .map(gasto => {
        const date = resolvePeriodDate(gasto.fecha, prefix);
        if (!date) return null;
        const amount = toAmount(gasto.monto);
        const isPagado = (gasto.pagados || []).includes(prefix);
        const isOverdue = !isPagado && date < today;
        return {
          ...gasto,
          type: 'gasto',
          label: gasto.desc || 'Gasto Recurrente',
          institution: gasto.cuenta || 'Gasto Operativo',
          date,
          amount,
          isPagado,
          isOverdue,
          estado: isPagado ? 'pagado' : (isOverdue ? 'vencido' : 'pendiente')
        };
      })
      .filter(Boolean);

    // Ordenamiento: 1° vencidos (antiguo a reciente), 2° pendientes (próximo a lejano), 3° pagados
    return [...d, ...g].sort((a, b) => {
      if (a.isPagado !== b.isPagado) return a.isPagado ? 1 : -1;
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
      return a.date.localeCompare(b.date);
    });
  }, [deudas, gastos, prefix, today]);

  const handleMarcarPagado = (item) => {
    if (item.type === 'deuda') {
      setDeudas(deudas.map(d => d.id === item.id ? { ...d, pagados: [...(d.pagados || []), prefix] } : d));
    } else {
      setGastos(gastos.map(g => g.id === item.id ? { ...g, pagados: [...(g.pagados || []), prefix] } : g));
    }
  };

  const pendingList = vencimientos.filter(v => !v.isPagado);
  const overdue = pendingList.filter((v) => v.isOverdue);
  const pending = pendingList.filter((v) => !v.isOverdue);
  const pagados = vencimientos.filter(v => v.isPagado);

  // Cuadrícula de calendario dinámico para el mes seleccionado
  const calendarDays = useMemo(() => {
    if (!prefix) return [];
    const [year, month] = prefix.split('-');
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0 (Dom) a 6 (Sáb)

    const days = [];
    const emptySlots = firstDay === 0 ? 6 : firstDay - 1; // Ajuste para iniciar en Lunes
    for (let i = 0; i < emptySlots; i++) days.push(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${prefix}-${String(i).padStart(2, '0')}`;
      const events = vencimientos.filter(v => v.date === dateStr);
      days.push({ day: i, dateStr, events });
    }
    return days;
  }, [prefix, vencimientos]);

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📅 Fechas de Pago</div>
          <div className="page-sub">Control de vencimientos de deudas y gastos operativos recurrentes · {period} {PERIOD_YEAR}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-gh btn-sm" onClick={() => setActivePage('gastos')}>
            + Gasto Recurrente
          </button>
          <button className="btn btn-o btn-sm" onClick={() => setActivePage('deudas')}>
            + Nueva Deuda
          </button>
        </div>
      </div>

      <div className="g4">
        <div className="sc sc-o">
          <div className="sc-label">Compromisos del Mes</div>
          <div className="sc-val" style={{ color: 'var(--orange)' }}>{vencimientos.length}</div>
          <div className="sc-icon">⏳</div>
        </div>
        <div className="sc sc-p">
          <div className="sc-label">Pagos Vencidos</div>
          <div className="sc-val" style={{ color: 'var(--pink)' }}>{overdue.length}</div>
          <div className="sc-icon">⚠️</div>
        </div>
        <div className="sc sc-g">
          <div className="sc-label">Pendientes a Tiempo</div>
          <div className="sc-val" style={{ color: 'var(--green)' }}>{pending.length}</div>
          <div className="sc-icon">✅</div>
        </div>
        <div className="sc sc-b">
          <div className="sc-label">Pagados</div>
          <div className="sc-val" style={{ color: 'var(--blue)' }}>{pagados.length}</div>
          <div className="sc-icon">⭐</div>
        </div>
      </div>

      {vencimientos.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
            No tienes pagos programados
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            No se registran vencimientos de deudas ni gastos recurrentes para {period} {PERIOD_YEAR}. Agrega tus compromisos financieros para visualizarlos en el calendario y recibir alertas oportunas.
          </div>
          <button className="btn btn-o" onClick={() => setActivePage('deudas')}>
            + Registrar Deuda o Compromiso
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Calendario Dinámico */}
          <div className="card" style={{ flex: '1 1 360px' }}>
            <div className="card-hdr">
              <div>
                <div className="card-title">📅 Calendario del Mes</div>
                <div className="card-sub">Vista mensual de vencimientos ({period} {PERIOD_YEAR})</div>
              </div>
            </div>
            <div style={{ padding: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>
                <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', gridAutoRows: 'minmax(42px, auto)' }}>
                {calendarDays.map((slot, idx) => {
                  if (!slot) return <div key={`empty-${idx}`} style={{ background: 'var(--surface2)', borderRadius: '8px', opacity: 0.2 }}></div>;
                  const hasOverdue = slot.events.some(e => e.isOverdue);
                  const hasPending = slot.events.some(e => !e.isPagado && !e.isOverdue);
                  const isAllPaid = slot.events.length > 0 && slot.events.every(e => e.isPagado);

                  let bg = 'var(--surface2)';
                  let border = '1px solid var(--border)';
                  if (hasOverdue) { bg = 'rgba(232,93,117,0.12)'; border = '1px solid var(--pink)'; }
                  else if (hasPending) { bg = 'rgba(255,154,118,0.12)'; border = '1px solid var(--orange)'; }
                  else if (isAllPaid) { bg = 'rgba(52,211,153,0.12)'; border = '1px solid var(--green)'; }

                  const isToday = slot.dateStr === today;

                  return (
                    <div key={idx} style={{ background: bg, border: border, borderRadius: '8px', padding: '6px 2px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: isToday ? 'bold' : '500', color: isToday ? 'var(--blue)' : 'var(--text)' }}>
                        {slot.day}
                      </span>
                      {slot.events.length > 0 && (
                        <div style={{ display: 'flex', gap: '3px', marginTop: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {slot.events.map((e, i) => (
                            <div
                              key={i}
                              title={`${e.label}: $${e.amount.toLocaleString('es-CL')} (${e.estado})`}
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: e.isPagado ? 'var(--green)' : (e.isOverdue ? 'var(--pink)' : 'var(--orange)')
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lista de Vencimientos Ordenada */}
          <div className="card" style={{ flex: '2 1 480px' }}>
            <div className="card-hdr">
              <div>
                <div className="card-title">📋 Lista de Pagos Programados</div>
                <div className="card-sub">Vencidos primero, luego próximos a vencer y pagados</div>
              </div>
            </div>
            <div className="tl-group" style={{ paddingRight: '6px', maxHeight: '440px', overflowY: 'auto' }}>
              {vencimientos.map((item, idx) => {
                const icon = item.type === 'deuda' ? '💳' : '🔄';
                const badgeClass = item.isPagado ? 'bg' : (item.isOverdue ? 'bp' : 'bo');
                const badgeText = item.isPagado ? 'Pagado' : (item.isOverdue ? 'Vencido' : 'Pendiente');

                return (
                  <div key={`${item.id}-${idx}`} className="tl-item" style={{ opacity: item.isPagado ? 0.6 : 1, padding: '12px 8px', borderBottom: '1px solid var(--border)' }}>
                    <div className="tl-dot" style={{ background: item.isPagado ? 'rgba(52,211,153,0.15)' : (item.isOverdue ? 'rgba(232,93,117,0.15)' : 'rgba(255,154,118,0.15)') }}>
                      {item.isPagado ? '✅' : icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="tl-title" style={{ textDecoration: item.isPagado ? 'line-through' : 'none', fontWeight: 600 }}>
                        {item.label}
                      </div>
                      <div className="tl-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span className={`badge ${badgeClass}`}>{badgeText}</span>
                        <span style={{ color: 'var(--text2)', fontSize: '11px' }}>Vencimiento: {item.date}</span>
                        <span style={{ color: 'var(--text3)', fontSize: '11px' }}>· {item.institution}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span className={`tl-amt ${item.isPagado ? 'pos' : 'neg'}`} style={{ textDecoration: item.isPagado ? 'line-through' : 'none', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                        ${item.amount.toLocaleString('es-CL')}
                      </span>
                      {!item.isPagado && (
                        <button className="btn btn-o btn-sm" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => handleMarcarPagado(item)}>
                          ✓ Marcar Pagado
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
