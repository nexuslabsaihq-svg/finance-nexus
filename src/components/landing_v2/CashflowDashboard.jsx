
import React, { useState, useEffect } from 'react';

// Este es un componente placeholder para la visualización del Dashboard 3D.
// Está diseñado para ser controlado por la posición del scroll de la página principal.
// Un especialista podría reemplazar esto con un modelo real de Three.js.
const CashflowDashboard = ({ scrollProgress }) => {
  const [isHovered, setIsHovered] = useState(false);

  // La visibilidad y transformación del dashboard dependen del progreso del scroll.
  const style = {
    opacity: scrollProgress > 0.5 ? 1 : 0,
    transform: `translate(-50%, -50%) scale(${0.8 + scrollProgress * 0.2}) rotateY(${-90 + scrollProgress * 90}deg)`,
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
  };

  return (
    <div className="cashflow-dashboard-container" style={style}>
      <div className="cashflow-dashboard-title">Flujo de Caja Mensual (+CLP $XXX,XXX,XXX)</div>
      <div className="bar-chart">
        {/* Simulación de la matriz de barras de zafiro */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bar" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="bar-fill" style={{ height: `${20 + i * 15}%` }} />
          </div>
        ))}
      </div>
      <div className="line-chart-legend">Ingresos vs Egresos</div>
      {isHovered && (
        <div className="tooltip-3d">
          Mes: Octubre | Ingresos: $Y CLP | Egresos: $Z CLP
        </div>
      )}
    </div>
  );
};

export default CashflowDashboard;
