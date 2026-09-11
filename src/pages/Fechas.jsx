import React, { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { getPeriodPrefix, PERIOD_YEAR } from '../utils/period';

const toAmount = (value) => Number(value) || 0;

export default function Fechas({ period }) {
  const { deudas, setDeudas, gastos, setGastos } = useAppData();
  const prefix = getPeriodPrefix(period);
  const today = new Date().toISOString().slice(0, 10);
  
  const vencimientos = useMemo(() => {
    const d = deudas
      .filter((debt) => debt.vencimiento && prefix && debt.vencimiento.startsWith(prefix) && toAmount(debt.balance ?? debt.monto) > 0)
      .map(debt => ({ ...debt, type: 'deuda', label: debt.nombre || 'Deuda', date: debt.vencimiento, amount: toAmount(debt.pagoMensual), isPagado: (debt.pagados || []).includes(prefix) }));
      
    const g = gastos
      .filter(gasto => gasto.recurrente !== 'No' && gasto.fecha && prefix && gasto.fecha.startsWith(prefix))
      .map(gasto => ({ ...gasto, type: 'gasto', label: gasto.desc || 'Gasto Recurrente', date: gasto.fecha, amount: toAmount(gasto.monto), isPagado: (gasto.pagados || []).includes(prefix) }));
      
    return [...d, ...g].sort((a, b) => a.date.localeCompare(b.date));
  }, [deudas, gastos, prefix]);

  const handleMarcarPagado = (item) => {
    if (item.type === 'deuda') {
      setDeudas(deudas.map(d => d.id === item.id ? { ...d, pagados: [...(d.pagados || []), prefix] } : d));
    } else {
      setGastos(gastos.map(g => g.id === item.id ? { ...g, pagados: [...(g.pagados || []), prefix] } : g));
    }
  };

  const pendingList = vencimientos.filter(v => !v.isPagado);
  const overdue = pendingList.filter((v) => v.date < today);
  const pending = pendingList.filter((v) => v.date >= today);
  const pagados = vencimientos.filter(v => v.isPagado);

  // Generate Calendar Grid for current month
  const calendarDays = useMemo(() => {
    if (!prefix) return [];
    const [year, month] = prefix.split('-');
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0 (Sun) to 6 (Sat)
    
    const days = [];
    // Pad empty slots before 1st day (adjusting so Monday is 0)
    const emptySlots = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < emptySlots; i++) days.push(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${prefix}-${String(i).padStart(2, '0')}`;
      const events = vencimientos.filter(v => v.date === dateStr);
      days.push({ day: i, dateStr, events });
    }
    return days;
  }, [prefix, vencimientos]);

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📅 Fechas de Pago</div>
          <div className="page-sub">Vencimientos de deudas registradas · {period} {PERIOD_YEAR}</div>
        </div>
      </div>

      <div className="g4">
        <div className="sc sc-o"><div className="sc-label">Vencimientos (Mes)</div><div className="sc-val" style={{ color: 'var(--orange)' }}>{vencimientos.length}</div><div className="sc-icon">⏳</div></div>
        <div className="sc sc-p"><div className="sc-label">Vencidos</div><div className="sc-val" style={{ color: 'var(--pink)' }}>{overdue.length}</div><div className="sc-icon">⚠️</div></div>
        <div className="sc sc-g"><div className="sc-label">Pendientes</div><div className="sc-val" style={{ color: 'var(--green)' }}>{pending.length}</div><div className="sc-icon">✅</div></div>
        <div className="sc sc-b"><div className="sc-label">Pagados</div><div className="sc-val" style={{ color: 'var(--blue)' }}>{pagados.length}</div><div className="sc-icon">⭐</div></div>
      </div>

      <div style={{display:'flex', gap:'20px', flexWrap:'wrap', marginTop:'20px'}}>
        <div className="card" style={{flex: '1 1 350px'}}>
          <div className="card-hdr"><div><div className="card-title">📅 Calendario del Mes</div><div className="card-sub">Vista de compromisos ({period})</div></div></div>
          <div style={{padding:'10px'}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'5px', textAlign:'center', fontWeight:'bold', fontSize:'12px', color:'var(--text2)', marginBottom:'10px'}}>
              <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'5px', gridAutoRows:'minmax(40px, auto)'}}>
              {calendarDays.map((slot, idx) => {
                if (!slot) return <div key={`empty-${idx}`} style={{background:'var(--surface2)', borderRadius:'6px', opacity:0.3}}></div>;
                const hasOverdue = slot.events.some(e => e.date < today && !e.isPagado);
                const hasPending = slot.events.some(e => e.date >= today && !e.isPagado);
                const isAllPaid = slot.events.length > 0 && slot.events.every(e => e.isPagado);
                
                let bg = 'var(--surface2)';
                let border = '1px solid var(--border)';
                if (hasOverdue) { bg = 'rgba(232,93,117,0.1)'; border = '1px solid var(--pink)'; }
                else if (hasPending) { bg = 'rgba(255,154,118,0.1)'; border = '1px solid var(--orange)'; }
                else if (isAllPaid) { bg = 'rgba(126,211,33,0.1)'; border = '1px solid var(--green)'; }
                
                const isToday = slot.dateStr === today;
                
                return (
                  <div key={idx} style={{background:bg, border:border, borderRadius:'6px', padding:'4px', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                    <span style={{fontSize:'13px', fontWeight: isToday ? 'bold' : 'normal', color: isToday ? 'var(--blue)' : 'var(--text)'}}>
                      {slot.day}
                    </span>
                    {slot.events.length > 0 && (
                      <div style={{display:'flex', gap:'2px', marginTop:'2px', flexWrap:'wrap', justifyContent:'center'}}>
                        {slot.events.map((e, i) => (
                          <div key={i} style={{width:'6px', height:'6px', borderRadius:'50%', background: e.isPagado ? 'var(--green)' : (e.date < today ? 'var(--pink)' : 'var(--orange)')}} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card" style={{flex: '2 1 450px'}}>
          <div className="card-hdr"><div><div className="card-title">📋 Lista de Vencimientos</div><div className="card-sub">Centralización de pagos de deudas y gastos recurrentes.</div></div></div>
          {vencimientos.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', fontSize: '13px' }}>
              No hay vencimientos de deudas ni gastos recurrentes para este período.
            </div>
          ) : (
            <div className="tl-group" style={{paddingRight:'10px', maxHeight:'400px', overflowY:'auto'}}>
              {vencimientos.map((item, idx) => {
                const isOverdue = item.date < today && !item.isPagado;
                const icon = item.type === 'deuda' ? '💳' : '🔄';
                
                let colorBase = '52,211,153'; // Green for paid
                if (!item.isPagado) {
                  colorBase = isOverdue ? '232,93,117' : (item.type === 'deuda' ? '255,154,118' : '52,211,153');
                }

                return (
                  <div key={`${item.id}-${idx}`} className="tl-item" style={{opacity: item.isPagado ? 0.6 : 1}}>
                    <div className="tl-dot" style={{ background: `rgba(${colorBase},0.15)` }}>{item.isPagado ? '✅' : icon}</div>
                    <div style={{ flex: '1' }}>
                      <div className="tl-title" style={{textDecoration: item.isPagado ? 'line-through' : 'none'}}>{item.label}</div>
                      <div className="tl-meta">
                        <span className={`badge ${item.isPagado ? 'bg' : (isOverdue ? 'bp' : (item.type === 'deuda' ? 'bo' : 'bg'))}`}>
                          {item.isPagado ? 'Pagado' : (isOverdue ? 'Vencido' : 'Pendiente')}
                        </span> 
                        <span style={{marginLeft:'8px'}}>{item.date}</span>
                      </div>
                    </div>
                    <div style={{textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'5px'}}>
                      <span className="tl-amt neg" style={{textDecoration: item.isPagado ? 'line-through' : 'none'}}>{item.amount > 0 ? `$${item.amount.toLocaleString('es-CL')}` : 'Monto variable'}</span>
                      {!item.isPagado && (
                        <button className="btn btn-o btn-sm" onClick={() => handleMarcarPagado(item)}>Marcar Pagado</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
