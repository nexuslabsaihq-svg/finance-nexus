import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { BrandLogo } from '../pages/Landing';

const NavItem = ({ id, icon, label, badge, sec, activePage, setActivePage }) => {
  if (sec) return <div className="nav-sec">{sec}</div>;
  return (
    <div 
      className={`nav-item ${activePage === id ? 'active' : ''}`} 
      onClick={() => {
        setActivePage(id);
        document.body.classList.remove('sidebar-open');
      }}
    >
      <span className="nav-icon">{icon}</span>
      {label}
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  );
};

export default function Sidebar() {
  const { activePage, setActivePage, logout, authUser, deudas, pendingInvitations } = useAppData();
  const upcomingDebtCount = deudas.filter(d => Number(d.balance ?? d.monto) > 0 && d.vencimiento).length;


  return (
    <nav className="sidebar">
      <div className="logo-wrap">
        <BrandLogo size={50} />
        <div>
          <div className="logo-name">FinanceNexus</div>
          <div className="logo-tag">ERP Financiero Personal · CL</div>
        </div>
        <div className="logo-badge">PRO</div>
      </div>

      <div className="sidebar-scrollable">
        <NavItem sec="Principal" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="dashboard" icon="📊" label="Dashboard" activePage={activePage} setActivePage={setActivePage} />

        <NavItem sec="Movimientos" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="ingresos" icon="💰" label="Ingresos" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="gastos" icon="💸" label="Gastos" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="transferencias" icon="🔄" label="Transferencias" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="bancos" icon="🏦" label="Bancos y Cuentas" activePage={activePage} setActivePage={setActivePage} />

        <NavItem sec="Finanzas" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="ahorros" icon="🐷" label="Ahorros" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="inversiones" icon="📈" label="Inversiones" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="deudas" icon="💳" label="Deudas" badge={deudas.length || null} activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="estrategia" icon="🎯" label="Estrategia Deudas" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="fechas" icon="📅" label="Fechas de Pago" badge={upcomingDebtCount || null} activePage={activePage} setActivePage={setActivePage} />

        <NavItem sec="Análisis" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="flujo" icon="📉" label="Flujo de Caja" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="informes" icon="📄" label="Informes" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="documentos" icon="📁" label="Documentos IA" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="ia" icon="🤖" label="IA Financiera" activePage={activePage} setActivePage={setActivePage} />

        <NavItem sec="Cuenta" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="perfil" icon="👤" label="Perfil" badge={pendingInvitations.length || null} activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="configuracion" icon="⚙️" label="Configuración" activePage={activePage} setActivePage={setActivePage} />
        <NavItem id="seguridad" icon="🛡️" label="Seguridad" activePage={activePage} setActivePage={setActivePage} />
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user-mini" onClick={() => setActivePage('perfil')} title="Ver Mi Perfil">
          <div className="sum-avatar">{authUser?.photoURL ? <img src={authUser.photoURL} referrerPolicy="no-referrer" style={{width:'100%', height:'100%', borderRadius:'50%'}}/> : (authUser?.displayName?.[0] || 'U')}</div>
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <div className="sum-name" style={{whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>{authUser?.displayName || 'Usuario'}</div>
            <div style={{fontSize:'10px', color:'var(--text2)', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden', marginBottom:'2px'}}>{authUser?.email || ''}</div>
            <div className="sum-status">
              <span className="sum-dot" style={{animation: 'pulse 2s infinite'}}></span>En línea
            </div>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>→</span>
        </div>
        <div className="nav-item" style={{ color: 'var(--pink)' }} onClick={logout}>
          <span className="nav-icon">🚪</span>Cerrar Sesión
        </div>
      </div>
    </nav>
  );
}
