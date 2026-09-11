import React from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useAppData } from '../context/AppDataContext';
import { BrandLogo } from '../pages/Landing';

const CustomTooltip = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep
}) => {
  return (
    <div {...tooltipProps} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      {/* Header con el Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <div style={{ width: '40px', height: '40px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrandLogo size={32} />
        </div>
        <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text)' }}>
          {step.title}
        </div>
      </div>
      
      {/* Contenido principal */}
      <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.6' }}>
        {step.content}
      </div>
      
      {/* Controles del pie */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <button {...closeProps} className="btn btn-gh btn-sm" style={{ color: 'var(--text3)' }}>Saltar Tour</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {index > 0 && (
            <button {...backProps} className="btn btn-gh btn-sm">Atrás</button>
          )}
          <button {...primaryProps} className="btn btn-p btn-sm" style={{ background: 'linear-gradient(135deg, var(--blue), var(--purple))', border: 'none', boxShadow: '0 4px 15px rgba(107,127,214,0.3)', padding: '6px 16px' }}>
            {isLastStep ? 'Terminar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TourGuide() {
  const { configuracion, setConfiguracion } = useAppData();

  const steps = [
    {
      target: 'body',
      placement: 'center',
      title: '¡Bienvenido a Finance Nexus!',
      content: 'Vamos a darte un recorrido rápido para que aprendas a usar tu nueva bóveda financiera como un experto. ¿Listo?',
      disableBeacon: true,
    },
    {
      target: '.hamburger',
      content: 'Este botón abre el Menú Principal, desde donde podrás navegar a tus ingresos, gastos, IA y configuraciones.',
    },
    {
      target: '[title="Modo Privacidad (Ocultar Saldos)"]',
      content: '¡Botón Anti-Mirones! Si estás en un lugar público, haz clic aquí para difuminar todos tus saldos al instante.',
    },
    {
      target: '.pbtn',
      content: 'Selector de Periodo. Usa esto para cambiar entre los diferentes meses y ver tu evolución financiera.',
    },
    {
      target: '[title="Cambiar tema"]',
      content: 'Alterna entre el Modo Oscuro y el Modo Claro según tu preferencia visual.',
    },
    {
      target: '.btn-p',
      content: 'Busca estos botones primarios para crear nuevos registros financieros en cualquier pantalla.',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setConfiguracion(prev => ({ ...prev, showTour: false }));
    }
  };

  // Por defecto, si showTour no existe, se muestra.
  if (configuracion?.showTour === false) return null;

  return (
    <Joyride
      steps={steps}
      run={true}
      continuous={true}
      showProgress={false}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          arrowColor: 'var(--surface)',
          overlayColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 10000,
        }
      }}
    />
  );
}
