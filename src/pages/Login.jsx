import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { googleSignIn } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setAuthError('Error al ingresar. Intenta de nuevo.');
      alert('Error al ingresar. Intenta de nuevo.');
    }
  };

  return (
    <div style={{
      minHeight:"100vh", 
      background:"#0B0D17", 
      display:"flex", 
      flexDirection:"column",
      alignItems:"center", 
      justifyContent:"center", 
      padding:"20px", 
      position:"relative", 
      overflow:"hidden",
      fontFamily:"'Inter', sans-serif"
    }}>
      {/* Background Decorative */}
      <div style={{position:"absolute", width:"600px", height:"600px", background:"var(--orange)", filter:"blur(150px)", opacity:"0.1", top:"-100px", left:"-200px", borderRadius:"50%"}}></div>
      <div style={{position:"absolute", width:"500px", height:"500px", background:"var(--purple)", filter:"blur(150px)", opacity:"0.1", bottom:"0", right:"-100px", borderRadius:"50%"}}></div>
      <div style={{position:"absolute", width:"100vw", height:"100vh", background:"url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"noiseFilter\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\" opacity=\"0.03\"/></svg>')", pointerEvents:"none", zIndex:0}}></div>

      <div className="card" style={{
        maxWidth:"440px", 
        width:"100%", 
        zIndex:1, 
        background:"rgba(18, 20, 30, 0.6)", 
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        border:"1px solid rgba(255,154,118,0.15)",
        boxShadow:"0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        padding:"40px"
      }}>
        
        <div style={{textAlign:"center", marginBottom:"35px", animation:"float 6s ease-in-out infinite"}}>
          <div style={{display:"flex", justifyContent:"center", marginBottom:"15px"}}>
             <div style={{width:"60px", height:"60px", background:"linear-gradient(135deg, var(--orange), var(--pink))", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"30px", boxShadow:"0 10px 25px rgba(255,154,118,0.4), inset 0 2px 0 rgba(255,255,255,0.3)"}}>
                💎
             </div>
          </div>
          <div style={{fontSize:"28px", fontWeight:"900", background:"linear-gradient(135deg, #fff, rgba(255,255,255,0.6))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.5px"}}>
            Finance Nexus ERP
          </div>
          <div style={{fontSize:"14px", color:"var(--text2)", marginTop:"8px", fontWeight:"500"}}>
            Tu gestión financiera empresarial, inteligente y segura
          </div>
        </div>

        {authError && (
          <div className="alert al-p" style={{marginBottom:"25px", padding:"14px", borderRadius:"12px", border:"1px solid rgba(232,93,117,0.3)"}}>
            <span style={{marginRight:"8px"}}>⚠️</span> {authError}
          </div>
        )}

        <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
          <button 
            className="btn" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width:"100%", 
              padding:"14px", 
              display:"flex", 
              alignItems:"center", 
              justifyContent:"center", 
              gap:"12px", 
              fontSize:"16px", 
              fontWeight:"600", 
              background: isHovered ? "#fff" : "rgba(255,255,255,0.9)", 
              color:"#000", 
              border:"none",
              borderRadius:"12px",
              boxShadow: isHovered ? "0 8px 25px rgba(255,255,255,0.2)" : "0 4px 15px rgba(0,0,0,0.2)",
              transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isHovered ? "translateY(-2px)" : "translateY(0)"
            }} 
            onClick={handleGoogleLogin}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
          
          <div style={{textAlign:"center", color:"var(--text3)", fontSize:"12px", lineHeight:"1.6", marginTop:"5px"}}>
            Tus datos son privados y seguros. Cada usuario accede únicamente a su propia información de forma encriptada bajo sandboxing de Firecloud.
          </div>
        </div>
      </div>

      <div style={{position:"absolute", bottom:"30px", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", zIndex:1}}>
        <div style={{display:"flex", gap:"20px", fontSize:"12px", color:"var(--text3)"}}>
          <a href="#" style={{color:"var(--text2)", textDecoration:"none", transition:"color 0.2s"}} onMouseOver={e=>e.target.style.color="var(--orange)"} onMouseOut={e=>e.target.style.color="var(--text2)"}>Términos de Servicio</a>
          <span style={{opacity:0.3}}>|</span>
          <a href="#" style={{color:"var(--text2)", textDecoration:"none", transition:"color 0.2s"}} onMouseOver={e=>e.target.style.color="var(--orange)"} onMouseOut={e=>e.target.style.color="var(--text2)"}>Política de Privacidad</a>
        </div>
        <div style={{fontSize:"11px", color:"var(--border)", marginTop:"4px", fontFamily:"var(--mono)", opacity:0.6}}>
          v2.0.0 — Build 2026.03
        </div>
      </div>

    </div>
  );
}
