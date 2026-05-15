
import React, { useState, useEffect, useRef } from 'react';
import './LandingV2.css';
import InteractiveGrid from './InteractiveGrid';
import CashflowDashboard from './CashflowDashboard';

const LandingV2 = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const progress = scrollTop / (scrollHeight - clientHeight);
        setScrollProgress(Math.min(progress, 1));
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica para la animación de scrollytelling
  const heroOpacity = 1 - scrollProgress * 3; // Desaparece más rápido
  const heroTransform = `translateY(${scrollProgress * -100}px)`;
  const dashboardOpacity = scrollProgress > 0.3 ? (scrollProgress - 0.3) * 2 : 0;
  const dashboardScale = 0.8 + scrollProgress * 0.2;

  return (
    <div className="landing-v2-container" ref={containerRef}>
      <div className="scroll-content-container">
        <InteractiveGrid />

        <header className="landing-header" style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }}>
          <div className="logo-text">F | FINANCE NEXUS</div>
          <nav className="main-nav">
            <a href="#">Inicio</a>
            <a href="#">Productos</a>
            <a href="#">Aplicación</a>
            <a href="#">Contabilidad</a>
            <a href="#">Comunidad</a>
          </nav>
        </header>

        <div className="hero-text-content" style={{ opacity: Math.max(0, heroOpacity), transform: heroTransform }}>
          <h1 className="hero-title">
            La <span className="gradient-text">plataforma</span> que<br />
            <span className="gradient-text">impulsa el futuro</span> de tu empresa
          </h1>
          <p className="hero-body">
            Finance Nexus integra gestión financiera inteligente, herramientas contables avanzadas y una comunidad de networking para PYMEs chilenas — todo en un solo ecosistema.
          </p>
          <button className="cta-button">
            Explorar productos <span className="arrow">↓</span>
          </button>
        </div>

        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${dashboardScale})`,
          opacity: dashboardOpacity,
          zIndex: 20,
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
        }}>
          <CashflowDashboard scrollProgress={scrollProgress} />
        </div>

      </div>
    </div>
  );
};

export default LandingV2;
