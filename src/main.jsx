import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppDataProvider } from './context/AppDataContext'
import { AuthContextProvider } from './context/AuthContext'; // CORRECCIÓN: Nombre del provider corregido

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider> {/* CORRECIÓN: Nombre del provider corregido */}
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </AuthContextProvider>
  </StrictMode>,
)
