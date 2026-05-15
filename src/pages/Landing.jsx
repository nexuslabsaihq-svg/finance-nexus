import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../landing.css';

import Hero3D from '../components/Hero3D';
import DashboardPreview from '../components/DashboardPreview';

// --- Helper para Scroll (Usa el scroll nativo del navegador) --- //
const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - 72; // Ajuste para el navbar fijo
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

// --- Componentes de la Página --- //

const Navbar = ({ onLogin, user }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fn-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="fn-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <img src="/assets/brand/logo-nexus.png" alt="Finance Nexus Logo" style={{ height: '32px', cursor: 'pointer' }} onClick={() => scrollTo('hero')} />
        
        <div className="fn-nav-links">
          <a onClick={() => scrollTo('solucion')} className="fn-nav-link">Solución</a>
          <a onClick={() => scrollTo('modulos')} className="fn-nav-link">Módulos</a>
          <a onClick={() => scrollTo('precios')} className="fn-nav-link">Precios</a>
          <a onClick={() => scrollTo('contacto')} className="fn-nav-link">Contacto</a>
        </div>
        
        <div>
          {user ? (
            <a href="/dashboard" className="fn-liquid-button">Mi Panel</a>
          ) : (
            <button onClick={onLogin} className="fn-liquid-button">Comenzar gratis</button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onLogin }) => (
  <section id="hero" className="fn-hero">
    <div className="fn-hero-visual" aria-hidden="true">
      <Hero3D />
    </div>
    <div className="fn-hero-content">
      <h1 className="fn-display-1">Tu sistema operativo financiero para tomar mejores decisiones</h1>
      <p className="fn-text-lg">
        Finance | Nexus centraliza ingresos, gastos, compromisos y reportes para que las PYMEs chilenas entiendan su caja en tiempo real.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={onLogin} className="fn-liquid-button">Comenzar gratis</button>
        <a onClick={() => scrollTo('dashboard-preview')} className="fn-liquid-button secondary">Ver dashboard</a>
      </div>
    </div>
  </section>
);

const Solucion = () => (
  <section id="solucion" className="fn-section">
    <div className="fn-container">
      <div className="fn-section-header">
          <span className="fn-tag">La Solución</span>
          <h2 className="fn-display-2">De planillas desordenadas a un centro de mando claro</h2>
      </div>
      <div className="fn-card-grid">
        <div className="fn-glass-card"><h3>Caja real disponible</h3><p>Entiende tu liquidez al día.</p></div>
        <div className="fn-glass-card"><h3>Compromisos próximos</h3><p>Anticipa pagos y cobros.</p></div>
        <div className="fn-glass-card"><h3>Decisiones con datos</h3><p>Deja de intuir y empieza a decidir.</p></div>
      </div>
    </div>
  </section>
);

const Modulos = () => (
    <section id="modulos" className="fn-section">
      <div className="fn-container">
        <div className="fn-section-header">
          <span className="fn-tag">Plataforma Completa</span>
          <h2 className="fn-display-2">Todo lo que necesitas para gestionar tu negocio</h2>
        </div>
        <div className="fn-card-grid">
          {[
            'Ingresos y gastos', 'Conciliación bancaria', 'Cuentas y transferencias', 'Ahorros e inversiones',
            'Gestión de deudas', 'Reportes PDF y Excel', 'KPIs financieros', 'Nexus IA'
          ].map(modulo => (
            <div key={modulo} className="fn-glass-card">
              <h3>{modulo}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

const Precios = ({ onLogin }) => (
    <section id="precios" className="fn-section">
      <div className="fn-container">
        <div className="fn-section-header">
          <span className="fn-tag">Precios</span>
          <h2 className="fn-display-2">Planes simples y transparentes</h2>
        </div>
        <div className="fn-card-grid" style={{ alignItems: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}>
          <div className="fn-glass-card"> 
            <h3>Inicial</h3>
            <p className="fn-text-lg">$0 CLP</p>
            <ul><li>✓ Para quienes empiezan</li><li>✓ Funciones básicas</li></ul>
            <button onClick={onLogin} className="fn-liquid-button secondary" style={{ marginTop: 'auto' }}>Empezar Gratis</button>
          </div>
          <div className="fn-glass-card professional">
            <h3>Profesional</h3>
            <p className="fn-text-lg">$29.990 CLP/mes</p>
            <ul><li>✓ Para PYMEs en crecimiento</li><li>✓ Módulo de IA</li><li>✓ Soporte prioritario</li></ul>
            <button onClick={onLogin} className="fn-liquid-button" style={{ marginTop: 'auto' }}>Elegir Profesional</button>
          </div>
          <div className="fn-glass-card">
            <h3>Empresa</h3>
            <p className="fn-text-lg">$99.990 CLP/mes</p>
            <ul><li>✓ Para empresas consolidadas</li><li>✓ Integraciones y SLA</li></ul>
            <button onClick={() => scrollTo('contacto')} className="fn-liquid-button secondary" style={{ marginTop: 'auto' }}>Contactar</button>
          </div>
        </div>
      </div>
    </section>
  );

const Contacto = () => {
    const [status, setStatus] = useState('');
    const handleSubmit = (e) => {
      e.preventDefault(); setStatus('Enviando...');
      setTimeout(() => { setStatus('¡Mensaje enviado!'); e.target.reset(); }, 1500);
    };
    return (
      <section id="contacto" className="fn-section">
        <div className="fn-container" style={{ maxWidth: '640px' }}>
          <div className="fn-section-header">
            <h2 className="fn-display-2">Hablemos</h2>
            <p className="fn-text-lg">¿Preguntas, ideas, o quieres una demo? Escríbenos.</p>
          </div>
          <form onSubmit={handleSubmit} className="fn-glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" name="name" placeholder="Nombre" required />
              <input type="email" name="email" placeholder="Correo" required />
              <textarea name="message" placeholder="Mensaje" required rows="4"></textarea>
              <button type="submit" className="fn-liquid-button">{status || 'Enviar Mensaje'}</button>
          </form>
        </div>
      </section>
    );
  };

const Footer = () => (
    <footer className="fn-footer">
      <div className="fn-container">
        <div className="fn-footer-grid">
          <div>
            <img src="/assets/brand/logo-nexus.png" alt="Finance Nexus Logo" style={{ height: '32px', marginBottom: '16px' }} />
            <p>Tu sistema operativo financiero.</p>
          </div>
          <div>
            <h4>Navegación</h4>
            <a onClick={() => scrollTo('solucion')}>Solución</a>
            <a onClick={() => scrollTo('modulos')}>Módulos</a>
            <a onClick={() => scrollTo('precios')}>Precios</a>
          </div>
          <div>
            <h4>Empresa</h4>
            <a onClick={() => scrollTo('contacto')}>Contacto</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a>Términos de Servicio</a>
            <a>Política de Privacidad</a>
          </div>
        </div>
        <div className="fn-footer-bottom">
          <p>© {new Date().getFullYear()} Finance Nexus. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );

export default function Landing() {
  const { googleSignIn, user } = useAuth();
  
  const handleLogin = async () => {
    try { await googleSignIn(); } catch (error) { console.error("Error al iniciar sesión:", error); }
  };

  return (
    <div className="finance-landing">
      <Navbar onLogin={handleLogin} user={user} />
      <main>
        <Hero onLogin={handleLogin} />
        <Solucion />

        {/* --- DASHBOARD PREVIEW SHOWCASE --- */}
        <section id="dashboard-preview" className="fn-section fn-dashboard-showcase">
          <div className="fn-container">
            <div className="fn-section-header">
              <span className="fn-tag">Centro de mando</span>
              <h2 className="fn-display-2">Visualiza tu negocio en tiempo real</h2>
              <p className="fn-text-lg">
                Un panel diseñado para entender ingresos, gastos, flujo de caja y alertas sin perder horas en reportes manuales.
              </p>
            </div>
            <div className="fn-dashboard-preview-shell">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <Modulos />
        <Precios onLogin={handleLogin} />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
