import React from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useAppData } from '../context/AppDataContext';

export default function TourGuide() {
  const { usuario, setUsuario } = useAppData();

  const steps = [
    {
      target: 'body',
      placement: 'center',
      title: '¡Bienvenido a Finance Nexus! 🚀',
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
      setUsuario(prev => ({ ...prev, hasSeenTutorial: true }));
    }
  };

  if (usuario?.hasSeenTutorial) return null;

  return (
    <Joyride
      steps={steps}
      run={true}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#00d2ff',
          backgroundColor: 'var(--surface)',
          textColor: 'var(--text)',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
        },
        tooltipContainer: {
          textAlign: 'left',
          borderRadius: '12px',
          border: '1px solid rgba(0,210,255,0.2)',
        },
        buttonNext: {
          borderRadius: '8px',
          fontWeight: 'bold',
        },
        buttonBack: {
          color: 'var(--text2)',
        }
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar Tutorial'
      }}
    />
  );
}
