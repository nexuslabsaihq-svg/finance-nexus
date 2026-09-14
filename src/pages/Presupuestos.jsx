import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/useAppData';
import { getPeriodPrefix, PERIOD_YEAR } from '../utils/period';

const toAmount = (val) => Number(val) || 0;
const getTimestamp = () => new Date().toISOString();
const createId = () => Date.now().toString();

export default function Presupuestos() {
  const { presupuestos, setPresupuestos, gastos, configuracion, period, setActivePage } = useAppData();
  const prefix = getPeriodPrefix(period);

  const [form, setForm] = useState({
    id: null,
    cat: configuracion?.categorias?.[0] || 'Alimentación',
    catCustom: '',
    monto: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Gastos del período seleccionado
  const gastosMes = useMemo(() => {
    return gastos.filter(g => g.fecha && prefix && g.fecha.startsWith(prefix));
  }, [gastos, prefix]);

  // Enriquecer presupuestos con ejecución real
  const presupuestosConGasto = useMemo(() => {
    return presupuestos.map(p => {
      const actual = gastosMes
        .filter(g => (g.cat || '').toLowerCase() === (p.cat || '').toLowerCase())
        .reduce((sum, g) => sum + toAmount(g.monto), 0);
      const budget = toAmount(p.monto);
      const pct = budget > 0 ? Math.round((actual / budget) * 100) : 0;
      const disponible = budget - actual;
      const isExceeded = actual > budget;
      const isWarning = !isExceeded && pct >= 80;

      return {
        ...p,
        actual,
        budget,
        pct,
        disponible,
        isExceeded,
        isWarning
      };
    }).sort((a, b) => b.pct - a.pct);
  }, [presupuestos, gastosMes]);

  // Métricas consolidadas
  const totalPresupuestado = presupuestos.reduce((sum, p) => sum + toAmount(p.monto), 0);
  const totalEjecutado = presupuestosConGasto.reduce((sum, p) => sum + p.actual, 0);
  const totalDisponible = totalPresupuestado - totalEjecutado;
  const totalExcedidos = presupuestosConGasto.filter(p => p.isExceeded).length;

  const handleSave = (e) => {
    e.preventDefault();
    const finalCat = form.cat === 'Otro' ? (form.catCustom || '').trim() : form.cat;
    const montoNum = toAmount(form.monto);

    if (!finalCat || montoNum <= 0) return;

    if (isEditing && form.id) {
      setPresupuestos(presupuestos.map(p => p.id === form.id ? {
        ...p,
        cat: finalCat,
        monto: montoNum,
        updatedAt: getTimestamp()
      } : p));
    } else {
      // Verificar si la categoría ya existe
      const existing = presupuestos.find(p => (p.cat || '').toLowerCase() === finalCat.toLowerCase());
      if (existing) {
        setPresupuestos(presupuestos.map(p => p.id === existing.id ? {
          ...p,
          monto: montoNum,
          updatedAt: getTimestamp()
        } : p));
      } else {
        const newRecord = {
          id: createId(),
          cat: finalCat,
          monto: montoNum,
          createdAt: getTimestamp()
        };
        setPresupuestos([newRecord, ...presupuestos]);
      }
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    const isStandard = (configuracion?.categorias || []).includes(item.cat);
    setForm({
      id: item.id,
      cat: isStandard ? item.cat : 'Otro',
      catCustom: isStandard ? '' : item.cat,
      monto: item.monto.toString()
    });
  };

  const handleDelete = (id) => {
    setPresupuestos(presupuestos.filter(p => p.id !== id));
    if (form.id === id) resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      cat: configuracion?.categorias?.[0] || 'Alimentación',
      catCustom: '',
      monto: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="page active" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">🎯 Control de Presupuestos</div>
          <div className="page-sub">Límites mensuales de gasto por categoría · {period} {PERIOD_YEAR}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-gh btn-sm" onClick={() => setActivePage('gastos')}>
            💸 Ver Gastos
          </button>
        </div>
      </div>

      <div className="g4">
        <div className="sc sc-b">
          <div className="sc-label">Presupuesto Asignado</div>
          <div className="sc-val" style={{ color: 'var(--blue)' }}>${totalPresupuestado.toLocaleString('es-CL')}</div>
          <div className="sc-icon">📋</div>
        </div>
        <div className="sc sc-p">
          <div className="sc-label">Gasto Ejecutado</div>
          <div className="sc-val" style={{ color: 'var(--pink)' }}>${totalEjecutado.toLocaleString('es-CL')}</div>
          <div className="sc-change ch-dn">
            {totalPresupuestado > 0 ? `${Math.round((totalEjecutado / totalPresupuestado) * 100)}% consumido` : 'Sin asignación'}
          </div>
          <div className="sc-icon">💸</div>
        </div>
        <div className="sc sc-o">
          <div className="sc-label">Saldo Disponible</div>
          <div className="sc-val" style={{ color: totalDisponible >= 0 ? 'var(--orange)' : 'var(--pink)' }}>
            ${Math.abs(totalDisponible).toLocaleString('es-CL')}
          </div>
          <div className="sc-change ch-n">
            {totalDisponible >= 0 ? 'Remanente operativo' : 'Exceso sobre presupuesto'}
          </div>
          <div className="sc-icon">💡</div>
        </div>
        <div className="sc sc-g">
          <div className="sc-label">Alertas de Sobregiro</div>
          <div className="sc-val" style={{ color: totalExcedidos > 0 ? 'var(--pink)' : 'var(--green)' }}>
            {totalExcedidos}
          </div>
          <div className="sc-change ch-p">
            {totalExcedidos === 0 ? 'Todas en límite' : `${totalExcedidos} superada(s)`}
          </div>
          <div className="sc-icon">⚠️</div>
        </div>
      </div>

      {totalExcedidos > 0 && (
        <div className="alert al-p">
          <span className="al-icon">🚨</span>
          <div className="al-body">
            <div className="al-title" style={{ color: 'var(--pink)' }}>Sobregiro Presupuestario</div>
            Tienes {totalExcedidos} categoría(s) donde el gasto real ha superado el límite fijado para {period}. Revisa los montos asignados o reduce egresos discrecionales.
          </div>
        </div>
      )}

      <div className="g2">
        {/* Formulario de Alta / Edición */}
        <div className="card">
          <div className="card-hdr">
            <div>
              <div className="card-title">{isEditing ? '✏️ Modificar Presupuesto' : '➕ Asignar Presupuesto Mensual'}</div>
              <div className="card-sub">Define el tope máximo de gasto proyectado</div>
            </div>
            {isEditing && (
              <button className="btn btn-gh btn-sm" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
          <form onSubmit={handleSave} className="fg" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="fgrp">
              <label className="flbl">Categoría</label>
              <select
                className="fsel"
                value={form.cat}
                onChange={e => setForm({ ...form, cat: e.target.value })}
              >
                {(configuracion?.categorias || []).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Otro">Otro (Personalizada)</option>
              </select>
            </div>

            {form.cat === 'Otro' && (
              <div className="fgrp">
                <label className="flbl">Nombre de la Categoría Personalizada</label>
                <input
                  className="finp"
                  placeholder="Ej: Marketing Digital, Hosting, Combustible"
                  value={form.catCustom}
                  onChange={e => setForm({ ...form, catCustom: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="fgrp">
              <label className="flbl">Monto Objetivo Mensual ($ CLP)</label>
              <input
                className="finp"
                type="number"
                placeholder="Ej: 250000"
                value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })}
                required
                min="1000"
                step="1000"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-o" style={{ flex: 1 }}>
                {isEditing ? 'Actualizar Presupuesto' : 'Guardar Presupuesto'}
              </button>
            </div>
          </form>
        </div>

        {/* Listado y Progreso */}
        <div className="card">
          <div className="card-hdr">
            <div>
              <div className="card-title">📊 Ejecución por Categoría</div>
              <div className="card-sub">{presupuestosConGasto.length} categoría(s) presupuestada(s)</div>
            </div>
          </div>

          {presupuestosConGasto.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text2)' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎯</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Sin presupuestos definidos
              </div>
              <div style={{ fontSize: '12px', maxWidth: '300px', margin: '0 auto' }}>
                Asigna un presupuesto con el formulario para monitorear en tiempo real tus topes de consumo.
              </div>
            </div>
          ) : (
            <div className="tl-group" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {presupuestosConGasto.map(item => {
                let barColor = 'var(--green)';
                let badgeClass = 'bg';
                let badgeText = 'Normal';

                if (item.isExceeded) {
                  barColor = 'var(--pink)';
                  badgeClass = 'bp';
                  badgeText = 'Excedido';
                } else if (item.isWarning) {
                  barColor = 'var(--orange)';
                  badgeClass = 'bo';
                  badgeText = 'Alerta >80%';
                }

                return (
                  <div key={item.id} style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{item.cat}</span>
                        <span className={`badge ${badgeClass}`}>{badgeText}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-gh btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                          onClick={() => handleEdit(item)}
                          title="Editar monto"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-gh btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--pink)' }}
                          onClick={() => handleDelete(item.id)}
                          title="Eliminar presupuesto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text2)', marginBottom: '6px' }}>
                      <span>Gastado: <strong style={{ color: item.isExceeded ? 'var(--pink)' : 'var(--text)' }}>${item.actual.toLocaleString('es-CL')}</strong></span>
                      <span>Tope: <strong>${item.budget.toLocaleString('es-CL')}</strong></span>
                      <span>
                        {item.disponible >= 0 ? `Quedan: $${item.disponible.toLocaleString('es-CL')}` : `Exceso: $${Math.abs(item.disponible).toLocaleString('es-CL')}`}
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, item.pct)}%`,
                          height: '100%',
                          background: barColor,
                          transition: 'width 0.4s ease'
                        }}
                      />
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
