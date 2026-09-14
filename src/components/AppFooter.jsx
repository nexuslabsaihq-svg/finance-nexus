import React from 'react';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  const handleOpenCookieSettings = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('fn_open_cookie_consent'));
  };

  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '24px 20px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(15, 15, 20, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontSize: '12px',
        color: 'var(--text2)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>Finance Nexus SpA — RUT pendiente de confirmación</span>
          <span>·</span>
          <span>Santiago, Chile</span>
          <span>·</span>
          <a
            href="mailto:nexuslabsai.hq@gmail.com"
            style={{ color: 'var(--orange)', textDecoration: 'none' }}
          >
            ✉️ Canal de soporte y reclamos: nexuslabsai.hq@gmail.com
          </a>
        </div>

        <nav
          aria-label="Enlaces legales y SERNAC"
          style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          <a
            href="/legal/terminos-y-condiciones.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text2)', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            📜 Términos (Borrador)
          </a>
          <a
            href="/legal/politica-privacidad.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text2)', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            🔒 Privacidad (Borrador Ley 21.719)
          </a>
          <a
            href="https://www.sernac.cl/portal/618/w3-propertyvalue-59368.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Institución pública externa de protección al consumidor"
            style={{ color: 'var(--text2)', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            🏛️ SERNAC Financiero (Ext.)
          </a>
          <a
            href="https://www.sernac.cl/portal/617/w3-propertyvalue-58474.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Portal de orientación y reclamos del consumidor SERNAC"
            style={{ color: 'var(--text2)', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            📋 Portal Consumidor SERNAC
          </a>
          <button
            type="button"
            onClick={handleOpenCookieSettings}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              color: 'var(--text2)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            🍪 Configurar Cookies
          </button>
        </nav>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--text3)'
        }}
      >
        <span>© {currentYear} Finance Nexus SpA — RUT pendiente de confirmación · Santiago, Chile. Documentación operativa en revisión legal.</span>
        <span>Herramienta de control financiero para PYMEs · No constituye entidad crediticia ni bancaria CMF</span>
      </div>
    </footer>
  );
}
