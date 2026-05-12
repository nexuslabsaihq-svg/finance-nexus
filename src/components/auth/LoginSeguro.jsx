// src/components/auth/LoginSeguro.jsx
import React, { useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  setPersistence,
  browserSessionPersistence 
} from "firebase/auth";
import DOMPurify from 'dompurify'; // Anti-XSS

const LoginSeguro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resolver, setResolver] = useState(null); // Para el flujo de MFA
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  // Configuración para Computador Prestado: La sesión muere al cerrar el navegador
  setPersistence(auth, browserSessionPersistence);

  const handleFirstStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sanitización básica
    const safeEmail = DOMPurify.sanitize(email);

    try {
      await signInWithEmailAndPassword(auth, safeEmail, password);
      // Si llega aquí, entró sin MFA (o el MFA no está configurado aún)
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.code === 'auth/multi-factor-auth-required') {
        // EL USUARIO TIENE MFA ACTIVO - Inicia Paso 2
        const mfaResolver = getMultiFactorResolver(auth, err);
        setResolver(mfaResolver);
        
        // Enviar código SMS al primer factor registrado
        const phoneInfoOptions = mfaResolver.hints[0];
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(
          phoneInfoOptions, 
          window.recaptchaVerifier
        );
        sessionStorage.setItem('mfaVerificationId', verificationId);
      } else {
        setError('Credenciales incorrectas o error de conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMFAStep = async (e) => {
    e.preventDefault();
    try {
      const vId = sessionStorage.getItem('mfaVerificationId');
      const cred = PhoneAuthProvider.credential(vId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await resolver.resolveSignIn(multiFactorAssertion);
      window.location.href = "/dashboard";
    } catch (err) {
      setError('Código de verificación inválido.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-6">
      {/* CAPA GLASSMORPHISM FINANCE NEXUS */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] border border-white shadow-2xl">
        <h2 className="text-3xl font-bold text-[#112D60] mb-2">Finance Nexus</h2>
        <p className="text-gray-500 mb-8">Acceso de Alta Seguridad</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        {!resolver ? (
          /* PASO 1: EMAIL Y PASSWORD */
          <form onSubmit={handleFirstStep} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Corporativo"
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF9A76] outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Contraseña"
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF9A76] outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              className="w-full bg-[#112D60] text-white p-4 rounded-xl font-bold hover:bg-[#0a1b3a] transition-colors"
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          /* PASO 2: CÓDIGO MFA */
          <form onSubmit={handleMFAStep} className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
              Se ha enviado un código de seguridad a tu teléfono vinculado.
            </div>
            <input 
              type="text" 
              placeholder="Código de 6 dígitos"
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF9A76] text-center text-2xl tracking-[1rem] outline-none"
              maxLength="6"
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button className="w-full bg-[#FF9A76] text-white p-4 rounded-xl font-bold hover:bg-[#e8896a] transition-colors">
              Verificar Identidad
            </button>
          </form>
        )}
        
        <p className="mt-8 text-center text-xs text-gray-400 font-mono">
          TRL 5: SECURE_AUTH_ENABLED
        </p>
      </div>
    </div>
  );
};

export default LoginSeguro;