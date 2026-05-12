import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Ingresos from './pages/Ingresos';
import Gastos from './pages/Gastos';
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

  // This state is used to force re-renders when the URL hash changes.
  const [, setHash] = useState(() => window.location.hash);

  // Subscribe to hash changes to ensure the component re-renders.
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- Main Render Logic --- //

  // 1. While Firebase is resolving the auth state, show a global loading screen.
  if (authLoading) {
    return <LoadingScreen message="Cargando Finance Nexus..." />;
  }

  // At this point, authLoading is false, and authUser is either an object or null.
  // We can now safely determine what to render.
  const isAppView = window.location.hash === '#app';

  if (authUser) {
    // --- USER IS LOGGED IN ---
    if (isAppView) {
      // STABLE STATE: Logged in and on the correct URL. Render the main application.
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
                {renderPage()}
              </main>
            </div>
          </div>
          <button className="float-chat" onClick={() => setActivePage('ia')}>🤖</button>
        </>
      );
    } else {
      // TRANSITIONAL STATE: Logged in, but not on #app (e.g., just logged in).
      // Redirect them. The hash change will trigger a re-render.
      window.location.hash = '#app';
      return <LoadingScreen message="Redirigiendo a la aplicación..." />;
    }
  } else {
    // --- USER IS NOT LOGGED IN ---
    if (!isAppView) {
      // STABLE STATE: Logged out and not on #app. Render the landing page.
      return <Landing onLogin={loginWithGoogle} authUser={authUser} />;
    } else {
      // TRANSITIONAL STATE: Logged out, but URL is still #app (e.g., just logged out).
      // Redirect them by clearing the hash.
      window.location.hash = '';
      return <LoadingScreen message="Cerrando sesión..." />;
    }
  }
}

export default App;
