import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI to prevent blank screen
      return (
        <div style={{
          minHeight: '100vh', 
          backgroundColor: '#0A0D14', 
          color: '#F0F4FF', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#F87171', marginBottom: '10px' }}>Algo salió mal en la aplicación</h2>
          <p style={{ color: '#8B9CC8', maxWidth: '500px', marginBottom: '30px' }}>
            Hemos interceptado un error que normalmente habría dejado la pantalla en blanco. 
            Hemos protegido la aplicación para que puedas recargar sin perder tus datos de sesión.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '80%',
            overflowX: 'auto',
            textAlign: 'left',
            fontFamily: 'monospace',
            color: '#FFB088',
            marginBottom: '30px',
            fontSize: '12px'
          }}>
            {this.state.error && this.state.error.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF8C5A',
              color: '#1a1000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}
