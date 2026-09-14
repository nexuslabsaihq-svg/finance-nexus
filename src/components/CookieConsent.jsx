import React, { useState, useEffect } from 'react';

const COOKIE_KEY = 'fn_cookie_consent';

export default function CookieConsent() {
  const [hasConsent, setHasConsent] = useState(() => {
    try {
      return !!localStorage.getItem(COOKIE_KEY);
    } catch {
      return true;
    }
  });
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const handleReopen = () => {
      setForceVisible(true);
    };

    window.addEventListener('fn_open_cookie_consent', handleReopen);
    return () => window.removeEventListener('fn_open_cookie_consent', handleReopen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({
      level: 'all',
      date: new Date().toISOString(),
      version: '1.0'
    }));
    setHasConsent(true);
    setForceVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({
      level: 'essential',
      date: new Date().toISOString(),
      version: '1.0'
    }));
    setHasConsent(true);
    setForceVisible(false);
  };

  const isVisible = forceVisible || !hasConsent;
  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimiento de cookies"
      role="region"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '94%',
        maxWidth: '680px',
        background: 'rgba(23, 24, 34, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 140, 66, 0.35)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 140, 66, 0.1)',
        borderRadius: '16px',
        padding: '22px 26px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: '#f0f0f5',
        animation: 'fadeIn 0.35s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🍪</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Privacidad y Cookies — Cumplimiento Ley 21.719
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--orange, #FF8C42)', fontWeight: 600 }}>
              Finance Nexus SpA · Chile
            </span>
          </div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: '#b5b7c7' }}>
        Utilizamos cookies técnicas y de almacenamiento local para garantizar la autenticación segura mediante Google, la persistencia de tus preferencias financieras y el análisis operativo agregado, en estricto apego a la <strong>Ley N° 21.719</strong> de Protección de Datos Personales y a los lineamientos del <strong>SERNAC</strong>. Puedes aceptar todas o limitar su uso a las esenciales.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <a
          href="/legal/politica-privacidad.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '12px', color: 'var(--orange, #FF8C42)', textDecoration: 'none', fontWeight: 500 }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >
          📄 Ver Política de Privacidad y Derechos ARCO →
        </a>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-gh btn-sm"
            style={{ padding: '8px 14px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={handleRejectNonEssential}
            title="Solo permitir cookies estrictamente necesarias para el inicio de sesión"
          >
            Solo esenciales
          </button>
          <button
            type="button"
            className="btn btn-o btn-sm"
            style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}
            onClick={handleAcceptAll}
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </aside>
  );
}
