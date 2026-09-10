import React, { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { GeminaKey } from '../firebase/config';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getPeriodPrefix, getPreviousPeriodPrefixes, PERIOD_YEAR } from '../utils/period';

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrency = (value) => `$${toAmount(value).toLocaleString('es-CL')}`;

const filterByPeriod = (items, prefix) =>
  items.filter((item) => item.fecha && prefix && item.fecha.startsWith(prefix));

export default function Dashboard({ period }) {
  const { setActivePage, ingresos, gastos, ahorros, inversiones, deudas, bancos } = useAppData();
  const [aiInsights, setAiInsights] = useState([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const prefix = getPeriodPrefix(period);
  const ingresosMes = filterByPeriod(ingresos, prefix);
  const gastosMes = filterByPeriod(gastos, prefix);

  useEffect(() => {
    if (!GeminaKey || (!ingresosMes.length && !gastosMes.length)) {
      setAiInsights([]);
      setLoadingAi(false);
      return;
    }

    const fetchInsights = async () => {
      setLoadingAi(true);
      try {
        const genAI = new GoogleGenerativeAI(GeminaKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  type: { type: SchemaType.STRING, description: 'Solo elige uno: POSITIVO, ALERTA, OPORTUNIDAD, o URGENTE' },
                  title: { type: SchemaType.STRING, description: 'Título muy corto' },
                  body: { type: SchemaType.STRING, description: 'Explicación breve de 1 o 2 líneas con montos' },
                  actionPath: { type: SchemaType.STRING, description: 'modulo sugerido: ingresos, gastos, inversiones, o deudas' },
                },
                required: ['type', 'title', 'body', 'actionPath'],
              },
            },
          },
        });
        const prompt = `Analiza estos datos financieros del período ${period} ${PERIOD_YEAR}: Ingresos: ${JSON.stringify(ingresosMes)}, Gastos: ${JSON.stringify(gastosMes)}, Ahorros: ${JSON.stringify(ahorros)}, Inversiones: ${JSON.stringify(inversiones)}, Deudas: ${JSON.stringify(deudas)}, Bancos: ${JSON.stringify(bancos)}. Genera exactamente 4 insights financieros (1 positivo, 1 alerta, 1 oportunidad, 1 urgente) basados en patrones de esta data particular. Evalúa salud financiera. Da montos precisos. No inventes.`;
        const result = await model.generateContent(prompt);
        setAiInsights(JSON.parse(result.response.text()));
      } catch (error) {
        console.error('AI Insight Error', error);
        setAiInsights([]);
      } finally {
        setLoadingAi(false);
      }
    };

    fetchInsights();
  }, [period, ingresosMes, gastosMes, ahorros, inversiones, deudas, bancos]);

  const totalIngresos = ingresosMes.reduce((sum, item) => sum + toAmount(item.monto), 0);
  const totalGastos = gastosMes.reduce((sum, item) => sum + toAmount(item.monto), 0);
  const flujoNeto = totalIngresos - totalGastos;
  const tasaAhorro = totalIngresos > 0 ? (flujoNeto / totalIngresos) * 100 : null;

  const totalBancos = bancos.reduce((sum, bank) => sum + toAmount(bank.saldo), 0);
  const totalAhorros = ahorros.reduce((sum, saving) => sum + toAmount(saving.actual), 0);
  const totalInv = inversiones.reduce(
    (sum, investment) => sum + toAmount(investment.actual ?? investment.invertido ?? investment.monto),
    0,
  );
  const totalDeuda = deudas.reduce((sum, debt) => sum + toAmount(debt.balance ?? debt.monto), 0);
  const patrimonioNeto = totalBancos + totalAhorros + totalInv - totalDeuda;

  const monthlyHistory = useMemo(
    () => getPreviousPeriodPrefixes(period).map(({ label, prefix: monthPrefix }) => ({
      prefix: monthPrefix,
      label,
      ingresos: filterByPeriod(ingresos, monthPrefix).reduce((sum, item) => sum + toAmount(item.monto), 0),
      gastos: filterByPeriod(gastos, monthPrefix).reduce((sum, item) => sum + toAmount(item.monto), 0),
    })),
    [period, ingresos, gastos],
  );

  const gastosPorCategoria = useMemo(() => {
    const totals = gastosMes.reduce((categories, gasto) => {
      const category = gasto.cat || 'Sin categoría';
      categories[category] = (categories[category] || 0) + toAmount(gasto.monto);
      return categories;
    }, {});
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [gastosMes]);

  const vencimientos = useMemo(
    () => deudas
      .filter((debt) => debt.vencimiento && debt.vencimiento.startsWith(prefix) && toAmount(debt.balance ?? debt.monto) > 0)
      .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento))
      .slice(0, 4),
    [deudas, prefix],
  );
  const today = new Date().toISOString().slice(0, 10);
  const recentTransactions = [...ingresosMes.map((item) => ({ ...item, type: 'Ingreso' })), ...gastosMes.map((item) => ({ ...item, type: 'Gasto' }))]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 6);
  const distribution = [
    { label: 'Inversiones', amount: totalInv, color: 'var(--green)' },
    { label: 'Bancos', amount: totalBancos, color: 'var(--orange)' },
    { label: 'Ahorros', amount: totalAhorros, color: 'var(--blue)' },
  ];
  const totalAssets = totalInv + totalBancos + totalAhorros;

  return (
    <div className="page active" style={{ display: 'flex' }}>
      <div className="page-hdr">
        <div>
          <div className="page-title">📊 Panel de Control</div>
          <div className="page-sub">Resumen ejecutivo · {period} {PERIOD_YEAR}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-gh btn-sm" onClick={() => window.print()}>🖨️ Imprimir</button>
          <button className="btn btn-o" onClick={() => setActivePage('ingresos')}>+ Nueva Transacción</button>
        </div>
      </div>

      <div className="gms">
        <div className="g4">
          <Metric label="Ingresos del mes" value={formatCurrency(totalIngresos)} icon="💰" color="var(--orange)" detail={`${ingresosMes.length} movimiento(s) registrado(s)`} />
          <Metric label="Gastos del mes" value={formatCurrency(totalGastos)} icon="💸" color="var(--pink)" detail={`${gastosMes.length} movimiento(s) registrado(s)`} />
          <Metric label="Flujo neto del mes" value={formatCurrency(Math.abs(flujoNeto))} icon="🎯" color={flujoNeto >= 0 ? 'var(--green)' : 'var(--pink)'} detail={flujoNeto >= 0 ? 'Superávit registrado' : 'Déficit registrado'} />
          <Metric label="Patrimonio neto" value={formatCurrency(patrimonioNeto)} icon="💎" color="var(--blue)" detail="Activos menos deuda registrada" />
          <Metric label="Tasa de ahorro" value={tasaAhorro === null ? 'Sin ingresos' : `${tasaAhorro.toFixed(1)}%`} icon="📊" color="var(--blue)" detail="Flujo neto sobre ingresos del mes" />
          <Metric label="Valor de inversiones" value={formatCurrency(totalInv)} icon="📈" color="var(--purple)" detail={`${inversiones.length} inversión(es) registrada(s)`} />
          <Metric label="Deuda total" value={formatCurrency(totalDeuda)} icon="📋" color="var(--pink)" detail={`${deudas.length} deuda(s) registrada(s)`} />
          <Metric label="Saldo en bancos" value={formatCurrency(totalBancos)} icon="🏦" color="var(--orange)" detail={`${bancos.length} cuenta(s) registrada(s)`} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card card-glow-b" style={{ textAlign: 'center' }}>
            <div className="card-hdr" style={{ justifyContent: 'center', marginBottom: '10px' }}><div className="card-title">🎯 Score Financiero</div></div>
            <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.5' }}>
              Aún no se calcula un score financiero. Los datos actuales no definen una metodología ni referencias comparables.
            </div>
          </div>

          <div className="card">
            <div className="card-hdr"><div className="card-title">💼 Distribución de activos</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {totalAssets === 0 ? <EmptyState message="Registra cuentas, ahorros o inversiones para ver la distribución." /> : distribution.map((item) => {
                const percentage = (item.amount / totalAssets) * 100;
                return <DistributionRow key={item.label} {...item} percentage={percentage} />;
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">⚡ Acciones Rápidas</div><div className="card-sub">Accede a cualquier módulo directamente</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '10px' }}>
          <QuickAction icon="💰" label="Ingresos" onClick={() => setActivePage('ingresos')} color="rgba(255,154,118,0.15)" />
          <QuickAction icon="💸" label="Gastos" onClick={() => setActivePage('gastos')} color="rgba(232,93,117,0.15)" />
          <QuickAction icon="🔄" label="Transferir" onClick={() => setActivePage('transferencias')} color="rgba(107,127,214,0.15)" />
          <QuickAction icon="🏦" label="Bancos" onClick={() => setActivePage('bancos')} color="rgba(126,211,33,0.15)" />
          <QuickAction icon="🎯" label="Ahorros" onClick={() => setActivePage('ahorros')} color="rgba(126,211,33,0.15)" />
          <QuickAction icon="📋" label="Deudas" onClick={() => setActivePage('deudas')} color="rgba(232,93,117,0.15)" />
          <QuickAction icon="🤖" label="IA" onClick={() => setActivePage('ia')} color="rgba(168,85,247,0.15)" />
        </div>
      </div>

      <div className="gms">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card card-glow-o">
            <div className="card-hdr"><div><div className="card-title">📈 Movimientos mensuales</div><div className="card-sub">Los seis meses hasta {period} {PERIOD_YEAR}</div></div></div>
            {monthlyHistory.every((month) => month.ingresos === 0 && month.gastos === 0) ? <EmptyState message="No hay movimientos registrados en estos seis meses." /> : (
              <div className="tw"><table>
                <thead><tr><th>Mes</th><th className="r">Ingresos</th><th className="r">Gastos</th><th className="r">Flujo neto</th></tr></thead>
                <tbody>{monthlyHistory.map((month) => <tr key={month.prefix}><td className="tdp">{month.label}</td><td className="tdr pos">{formatCurrency(month.ingresos)}</td><td className="tdr neg">{formatCurrency(month.gastos)}</td><td className={`tdr ${month.ingresos - month.gastos >= 0 ? 'pos' : 'neg'}`}>{formatCurrency(month.ingresos - month.gastos)}</td></tr>)}</tbody>
              </table></div>
            )}
          </div>

          <div className="card">
            <div className="card-hdr"><div className="card-title">🍩 Gastos por categoría</div><div className="card-sub">{period} {PERIOD_YEAR}</div></div>
            {gastosPorCategoria.length === 0 ? <EmptyState message="No hay gastos categorizados para este período." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {gastosPorCategoria.map((item, index) => <CategoryRow key={item.category} {...item} total={totalGastos} color={['var(--orange)', 'var(--pink)', 'var(--green)', 'var(--blue)'][index]} />)}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card">
            <div className="card-hdr"><div className="card-title">💳 Cuentas activas</div><button className="card-action" onClick={() => setActivePage('bancos')}>Ver todas →</button></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bancos.length === 0 ? <EmptyState message="No hay cuentas bancarias registradas." /> : bancos.slice(0, 3).map((bank, index) => <BankCard key={bank.id} bank={bank} index={index} />)}
            </div>
          </div>

          <div className="card card-glow-b">
            <div className="card-hdr"><div><div className="card-title">🏆 Evaluación financiera</div><div className="card-sub">Estado de la funcionalidad</div></div></div>
            <EmptyState message="Las calificaciones y recomendaciones automáticas aún no están disponibles. El panel muestra los saldos y movimientos registrados arriba." />
          </div>
        </div>
      </div>

      <div className="g2">
        <div className="card" onClick={() => setActivePage('ahorros')} style={{ cursor: 'pointer' }}>
          <div className="card-hdr"><div className="card-title">🎯 Metas de ahorro</div><span className="card-action">Ver todas →</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ahorros.length === 0 ? <EmptyState message="No hay metas de ahorro registradas." /> : ahorros.slice(0, 4).map((saving) => <SavingGoal key={saving.id} saving={saving} />)}
          </div>
        </div>

        <div className="card">
          <div className="card-hdr"><div className="card-title">⏰ Próximos vencimientos de deudas</div><button className="card-action" onClick={() => setActivePage('fechas')}>Ver fechas →</button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {vencimientos.length === 0 ? <EmptyState message="No hay vencimientos de deudas registrados. Los recordatorios generales aún no están disponibles." /> : vencimientos.map((debt) => <DebtDueItem key={debt.id} debt={debt} today={today} onOpen={() => setActivePage('deudas')} />)}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">🤖 Insights de IA Financiera</div><button className="card-action" onClick={() => setActivePage('ia')}>Hablar con la IA →</button></div>
        {loadingAi ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text2)', fontSize: '14px', animation: 'pulse 1.5s infinite' }}>✨ Gemini está analizando tus finanzas...</div> : aiInsights.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>{aiInsights.map((insight, index) => <InsightCard key={`${insight.title}-${index}`} insight={insight} onOpen={() => setActivePage(insight.actionPath)} />)}</div>
        ) : <EmptyState message="No hay suficientes datos para generar insights inteligentes." />}
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">💳 Transacciones recientes</div></div>
        <div className="tw"><table>
          <thead><tr><th>Descripción</th><th>Tipo</th><th>Categoría</th><th className="r">Monto</th><th>Fecha</th><th>Cuenta</th></tr></thead>
          <tbody>{recentTransactions.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>No hay transacciones registradas todavía.</td></tr> : recentTransactions.map((transaction) => (
            <tr key={`${transaction.type}-${transaction.id}`}><td className="tdp">{transaction.type === 'Ingreso' ? '💰' : '🛒'} {transaction.desc}</td><td><span className={`badge ${transaction.type === 'Ingreso' ? 'bg' : 'bp'}`}>{transaction.type}</span></td><td>{transaction.cat}</td><td className={`tdr ${transaction.type === 'Ingreso' ? 'pos' : 'neg'}`}>{transaction.type === 'Ingreso' ? '+' : '-'}{formatCurrency(transaction.monto)}</td><td className="tdm" style={{ fontSize: '11.5px', color: 'var(--text2)' }}>{transaction.fecha}</td><td>{transaction.fuente || transaction.cuenta || 'Sin cuenta'}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon, color, detail }) {
  return <div className="sc sc-b"><div className="sc-label">{label}</div><div className="sc-val" style={{ color }}>{value}</div><div className="sc-change ch-n">{detail}</div><div className="sc-icon">{icon}</div></div>;
}

function EmptyState({ message }) {
  return <div style={{ padding: '14px', color: 'var(--text2)', fontSize: '13px', textAlign: 'center' }}>{message}</div>;
}

function DistributionRow({ label, amount, color, percentage }) {
  return <div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: color, borderRadius: '3px', display: 'inline-block' }}></span><span style={{ color: 'var(--text2)' }}>{label}</span></div><span style={{ fontFamily: 'var(--mono)', fontWeight: '600', color }}>{formatCurrency(amount)}</span></div><div className="pt"><div className="pf" style={{ width: `${percentage}%`, background: color }}></div></div></div>;
}

function QuickAction({ icon, label, color, onClick }) {
  return <button type="button" className="quick-action" onClick={onClick}><div className="qa-icon" style={{ background: color }}>{icon}</div><div className="qa-label">{label}</div></button>;
}

function CategoryRow({ category, amount, total, color }) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  return <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}><span style={{ color: 'var(--text2)' }}>{category}</span><span style={{ fontFamily: 'var(--mono)' }}>{formatCurrency(amount)} · {percentage.toFixed(1)}%</span></div><div className="pt"><div className="pf" style={{ width: `${percentage}%`, background: color }}></div></div></div>;
}

function BankCard({ bank, index }) {
  const colors = ['var(--orange)', 'var(--blue)', 'var(--green)'];
  const color = colors[index % colors.length];
  return <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '14px' }}><div style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: '600', marginBottom: '8px' }}>🏦 {bank.nombre || 'Cuenta sin nombre'}</div><div style={{ fontFamily: 'var(--mono)', fontSize: '19px', fontWeight: '600', color, marginBottom: '5px' }}>{formatCurrency(bank.saldo)}</div><div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px' }}>{bank.numero || bank.tipo || 'Sin detalle'}</div></div>;
}

function SavingGoal({ saving }) {
  const current = toAmount(saving.actual);
  const goal = toAmount(saving.objetivo);
  const percentage = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  return <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ fontWeight: '600' }}>{saving.nombre}</span><span style={{ fontFamily: 'var(--mono)', color: 'var(--text2)', fontSize: '12px' }}>{percentage}% — {formatCurrency(current)} / {formatCurrency(goal)}</span></div><div className="pt"><div className="pf" style={{ width: `${percentage}%`, background: saving.color || 'var(--green)' }}></div></div></div>;
}

function DebtDueItem({ debt, today, onOpen }) {
  const overdue = debt.vencimiento < today;
  const label = overdue ? 'Vencido' : 'Pendiente';
  return <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'var(--glass)', borderRadius: 'var(--r3)' }}><span style={{ fontSize: '16px' }}>{overdue ? '🔴' : '⏳'}</span><div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: '600' }}>{debt.nombre || debt.desc || 'Deuda sin nombre'}</div><div style={{ fontSize: '11px', color: overdue ? 'var(--pink)' : 'var(--orange)' }}>{debt.vencimiento} — {label}</div></div><span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }} className="neg">{formatCurrency(debt.pagoMensual || debt.balance || debt.monto)}</span><button className="btn btn-o btn-sm" onClick={onOpen}>Ver deuda</button></div>;
}

function InsightCard({ insight, onOpen }) {
  let color = 'var(--blue)';
  let background = 'rgba(107,127,214,0.2)';
  if (insight.type === 'POSITIVO') { color = 'var(--green)'; background = 'rgba(126,211,33,0.2)'; }
  if (insight.type === 'ALERTA') { color = 'var(--pink)'; background = 'rgba(232,93,117,0.2)'; }
  if (insight.type === 'URGENTE') { color = 'var(--orange)'; background = 'rgba(255,154,118,0.2)'; }
  return <div className="ins-card" style={{ borderColor: background }}><div className="ins-type" style={{ color }}>{insight.type === 'POSITIVO' ? '📈 ' : insight.type === 'ALERTA' ? '⚠️ ' : insight.type === 'URGENTE' ? '🔥 ' : '💡 '}{insight.type}</div><div style={{ fontSize: '13.5px', fontWeight: '700', marginBottom: '4px' }}>{insight.title}</div><div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5', flex: 1 }}>{insight.body}</div><button className="btn btn-gh btn-sm" style={{ marginTop: '10px' }} onClick={onOpen}>Ver módulo →</button></div>;
}
