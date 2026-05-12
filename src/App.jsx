import React, { useState, useEffect, Suspense, lazy } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useAppData } from './context/AppDataContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Ingresos = lazy(() => import('./pages/Ingresos'));
const Gastos = lazy(() => import('./pages/Gastos'));
const Bancos = lazy(() => import('./pages/Bancos'));
const Ahorros = lazy(() => import('./pages/Ahorros'));
const Inversiones = lazy(() => import('./pages/Inversiones'));
const Deudas = lazy(() => import('./pages/Deudas'));
const Estrategia = lazy(() => import('./pages/Estrategia'));
const Fechas = lazy(() => import('./pages/Fechas'));
const Informes = lazy(() => import('./pages/Informes'));
const IA = lazy(() => import('./pages/IA'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Configuracion = lazy(() => import('./pages/Configuracion'));
const Seguridad = lazy(() => import('./pages/Seguridad'));
const Landing = lazy(() => import('./pages/Landing'));
const Documentos = lazy(() => import('./pages/Documentos'));
const FlujoCaja = lazy(() => import('./pages/FlujoCaja'));

const Bubbles = () => (
  <div className="bubbles">
    <div className="bub bub1"></div><div className="bub bub2"></div>
    <div className="bub bub3"></div><div className="bub bub4"></div>
  </div>
);

const LoadingScreen = ({ message }) => (
  <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ color: "var(--text2)" }}>{message}</div>
  </div>
);

function App() {
  const {
    activePage, period, setActivePage, 
    authLoading, authUser, loginWithGoogle
  } = useAppData();

  const [, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (authLoading) {
    return <LoadingScreen message="Cargando Finance Nexus..." />;
  }

  const isAppView = window.location.hash === '#app';

  if (authUser) {
    if (isAppView) {
      const renderPage = () => {
        switch(activePage) {
          case 'dashboard': return <Dashboard period={period} />;
          case 'ingresos': return <Ingresos />;
          case 'gastos': return <Gastos />;
          case 'documentos': return <Documentos />;
          case 'bancos': return <Bancos />;
          case 'flujo': return <FlujoCaja period={period} />;
          case 'ahorros': return <Ahorros />;
          case 'inversiones': return <Inversiones />;
          case 'deudas': return <Deudas />;
          case 'estrategia': return <Estrategia />;
          case 'fechas': return <Fechas />;
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
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
              <Header />
              <main className="main" style={{ flex: 1, overflowY: 'auto' }}>
                <Suspense fallback={<LoadingScreen message="Cargando..."/>}>
                  {renderPage()}
                </Suspense>
              </main>
            </div>
          </div>
          <button className="float-chat" onClick={() => setActivePage('ia')}>🤖</button>
        </>
      );
    } else {
      window.location.hash = '#app';
      return <LoadingScreen message="Redirigiendo a la aplicación..." />;
    }
  } else {
    if (!isAppView) {
      return (
        <Suspense fallback={<LoadingScreen message="Cargando..."/>}>
          <Landing onLogin={loginWithGoogle} authUser={authUser} />
        </Suspense>
      );
    } else {
      window.location.hash = '';
      return <LoadingScreen message="Cerrando sesión..." />;
    }
  }
}

export default App;
