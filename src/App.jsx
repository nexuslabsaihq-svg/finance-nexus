import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Ingresos from './pages/Ingresos';
import Gastos from './pages/Gastos';
import Transferencias from './pages/Transferencias';
import Bancos from './pages/Bancos';
import Ahorros from './pages/Ahorros';
import Inversiones from './pages/Inversiones';
import Deudas from './pages/Deudas';
import Estrategia from './pages/Estrategia';
import Fechas from './pages/Fechas';
import Informes from './pages/Informes';
import IA from './pages/IA';
import Perfil from './pages/Perfil';
import Configuracion from './pages/Configuracion';
import Seguridad from './pages/Seguridad';

import Landing from './pages/Landing';

import Documentos from './pages/Documentos';
import FlujoCaja from './pages/FlujoCaja';

import { useAppData } from './context/AppDataContext';

const Bubbles = () => (
  <div className="bubbles">
    <div className="bub bub1"></div><div className="bub bub2"></div>
    <div className="bub bub3"></div><div className="bub bub4"></div>
  </div>
);

function App() {
  const { activePage, period, setActivePage, authLoading, authUser, loginWithGoogle, authError } = useAppData();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);


  if (authLoading) {
    return (
      <div style={{minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <div style={{color:"var(--text2)"}}>Cargando Finance Nexus...</div>
      </div>
    );
  }

  const isAppView = hash === '#app';

  if (!isAppView || !authUser) {
    return <Landing onLogin={loginWithGoogle} authUser={authUser} authError={authError} />;
  }

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard period={period} />;
      case 'ingresos': return <Ingresos />;
      case 'gastos': return <Gastos />;
      case 'transferencias': return <Transferencias />;
      case 'documentos': return <Documentos />;
      case 'bancos': return <Bancos />;
      case 'flujo': return <FlujoCaja period={period} />;
      case 'ahorros': return <Ahorros />;
      case 'inversiones': return <Inversiones />;
      case 'deudas': return <Deudas />;
      case 'estrategia': return <Estrategia />;
      case 'fechas': return <Fechas period={period} />;
      case 'informes': return <Informes />;
      case 'ia': return <IA />;
      case 'perfil': return <Perfil />;
      case 'configuracion': return <Configuracion />;
      case 'seguridad': return <Seguridad />;
      default: return <Dashboard period={period} />;
    }
  };

  return (
    <>
      <Bubbles />
      <div className="app">
        <div className="sidebar-overlay" onClick={() => document.body.classList.remove('sidebar-open')}></div>
        <Sidebar />
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
          <Header />
          <main className="main" style={{ flex: 1, overflowY: 'auto' }}>
            {renderPage()}
          </main>
        </div>
      </div>
      <button className="float-chat" onClick={() => setActivePage('ia')}>🤖</button>
    </>
  );
}

export default App;
