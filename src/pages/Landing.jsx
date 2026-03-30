import { useState, useEffect } from "react";

/* ─── GOOGLE FONTS ────────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    :root {
      --coral:   #E8503A;
      --coral2:  #FF6B4A;
      --orange:  #FF8C42;
      --dark:    #0f0f14;
      --dark2:   #181820;
      --dark3:   #1f1f2e;
      --gold:    #C9A84C;
      --light:   #f9f6f2;
      --text:    #2a2a38;
      --muted:   #7a7a90;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--light); color: var(--text); overflow-x: hidden; }

    .display { letter-spacing: -0.5px; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--dark); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

    /* animations */
    @keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes float    { 0% { transform: translateY(0px) } 50% { transform: translateY(-15px) } 100% { transform: translateY(0px) } }
    @keyframes float-slow { 0% { transform: translateY(0px) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0px) } }
    @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes slideIn  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
    @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }

    .fade-up   { animation: fadeUp 0.65s ease both; }
    .fade-in   { animation: fadeIn 0.5s ease both; }
    .floating  { animation: float 4s ease-in-out infinite; }

    /* hover states */
    .btn-coral {
      background: linear-gradient(135deg, var(--coral), var(--orange));
      color: #fff; border: none; cursor: pointer;
      font-weight: 600; letter-spacing: .5px; transition: all 0.25s;
      position: relative; overflow: hidden;
    }
    .btn-coral::after {
      content:''; position:absolute; inset:0;
      background:rgba(255,255,255,0.12); opacity:0; transition:.25s;
    }
    .btn-coral:hover::after { opacity:1; }
    .btn-coral:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(232,80,58,0.4); }

    .btn-ghost {
      background: transparent; border: 1.5px solid rgba(255,255,255,0.35);
      color:#fff; cursor:pointer; font-weight:500;
      transition: all 0.25s;
    }
    .btn-ghost:hover { border-color:#fff; background:rgba(255,255,255,0.08); transform:translateY(-2px); }

    .btn-dark {
      background: var(--dark); color:#fff; border:none; cursor:pointer;
      font-weight:600; transition:all .25s;
    }
    .btn-dark:hover { background:var(--dark3); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.25); }

    .card-hover { transition: transform .3s, box-shadow .3s; }
    .card-hover:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.12); }

    .nav-link { color:rgba(255,255,255,0.75); text-decoration:none; font-size:14px; font-weight:500; transition:.2s; cursor:pointer; }
    .nav-link:hover { color:#fff; }

    .tag {
      display:inline-flex; align-items:center; gap:6px;
      background:rgba(232,80,58,0.12); color:var(--coral);
      border:1px solid rgba(232,80,58,0.25);
      padding:5px 14px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:1.5px;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--coral), var(--orange), var(--gold));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip:text;
    }

    .section-divider {
      height:1px; background:linear-gradient(90deg,transparent,rgba(232,80,58,0.3),transparent);
      margin:0 auto; max-width:800px;
    }

    /* product cards */
    .product-card {
      background:#fff; border-radius:20px; overflow:hidden;
      border:1px solid rgba(0,0,0,0.06);
      transition: transform .3s, box-shadow .3s;
    }
    .product-card:hover { transform:translateY(-8px); box-shadow:0 32px 64px rgba(0,0,0,0.14); }

    /* networking card */
    .net-card {
      background: var(--dark2); border:1px solid rgba(255,255,255,0.07);
      border-radius:16px; padding:28px; transition:all .3s;
    }
    .net-card:hover { border-color:var(--coral); transform:translateY(-4px); }

    /* mobile menu */
    .mobile-menu {
      position:fixed; top:0; left:0; width:280px; height:100vh;
      background:var(--dark); z-index:9999; padding:32px 24px;
      animation:slideIn .3s ease;
    }

    /* marquee */
    .marquee-track { display:flex; animation:marquee 22s linear infinite; width:max-content; }
  `}</style>
);

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */
const scrollTo = (id) => {
  const container = document.getElementById("landing-scroll-container");
  const el = document.getElementById(id);
  if (container && el) {
    const y = el.offsetTop - 68;
    container.scrollTo({ top: y, behavior: "smooth" });
  }
};

/* ─── BRAND LOGO COMPONENT ────────────────────────────────────────────────── */
export const BrandLogo = ({ size = 36, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" fill="none" style={{ filter: "drop-shadow(0 8px 24px rgba(232,80,58,0.25))", flexShrink: 0, borderRadius: "5%", ...style }}>
    <rect width="400" height="400" fill="url(#bgGradient)" rx="32" ry="32" />
    <g transform="translate(90, 55) scale(2)">
      <path d="M15,65 C45,65 65,45 75,15 C75,45 55,75 15,75 Z" fill="url(#silver1)"/>
      <path d="M25,55 C55,55 75,35 85,5 C85,35 65,65 25,65 Z" fill="url(#silver2)"/>
      <path d="M35,45 C65,45 85,25 95,-5 C95,25 75,55 35,55 Z" fill="url(#silver3)"/>
    </g>
    <text x="200" y="270" fontFamily="'DM Sans', sans-serif" fontSize="44" fill="#ffffff" textAnchor="middle" letterSpacing="-1">
      <tspan fontWeight="300" opacity="0.9">Finance </tspan>
      <tspan fontWeight="300" opacity="0.6">| </tspan>
      <tspan fontWeight="600">Nexus</tspan>
    </text>
    <rect x="100" y="295" width="200" height="2" fill="url(#lineGradient)" />
    <text x="200" y="325" fontFamily="'DM Sans', sans-serif" fontSize="12" fontWeight="500" fill="#ffffff" opacity="0.8" textAnchor="middle" letterSpacing="1.5">
      CONECTA · CRECE · PROSPERA
    </text>
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA4C46"/><stop offset="100%" stopColor="#F99F5E"/>
      </linearGradient>
      <linearGradient id="silver1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7a7f85"/><stop offset="100%" stopColor="#aeb3b8"/>
      </linearGradient>
      <linearGradient id="silver2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9b9fa3"/><stop offset="100%" stopColor="#cfd3d6"/>
      </linearGradient>
      <linearGradient id="silver3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bac0c5"/><stop offset="100%" stopColor="#e8ebed"/>
      </linearGradient>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
        <stop offset="50%" stopColor="rgba(255,255,255,1)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
  </svg>
);

/* ─── NAV ─────────────────────────────────────────────────────────────────── */
function Navbar({ onOpenLogin }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const container = document.getElementById("landing-scroll-container");
    const fn = (e) => setScrolled(e.target.scrollTop > 40);
    container?.addEventListener("scroll", fn);
    return () => container?.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding:"0 40px", height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(15,15,20,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition:"all .35s"
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => scrollTo("hero")}>
          <BrandLogo size={54} />
        </div>

        {/* Desktop nav */}
        <div style={{ display:"flex", gap:32, alignItems:"center" }}>
          {[["Inicio","hero"],["Productos","productos"],["Aplicación","app"],["Contabilidad","contabilidad"],["Networking","networking"],["Agencia","agencia"],["Contacto","contacto"]].map(([l,id]) => (
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}>{l}</span>
          ))}
        </div>

        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button className="btn-ghost" style={{ padding:"9px 20px", borderRadius:10, fontSize:13 }} onClick={onOpenLogin}>
            Ingresar
          </button>
          <button className="btn-coral" style={{ padding:"9px 22px", borderRadius:10, fontSize:13 }} onClick={onOpenLogin}>
            Comenzar gratis
          </button>
        </div>
      </nav>
    </>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */
function Hero({ onOpenLogin }) {
  return (
    <section id="hero" style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      background:"linear-gradient(160deg, #0f0f14 0%, #1a1020 40%, #1f0f0a 100%)",
      display:"flex", alignItems:"center",
    }}>
      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:"-10%", left:"-5%", width:600, height:600,
        background:"radial-gradient(circle, rgba(232,80,58,0.18) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"5%", right:"-8%", width:500, height:500,
        background:"radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
      {/* Grid overlay */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"120px 40px 80px", width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

          {/* LEFT */}
          <div className="fade-up">
            <span className="tag" style={{ marginBottom:24, display:"inline-flex" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--coral)", animation:"pulse 2s infinite" }} />
              AGENCIA FINANCIERA · CHILE
            </span>

            <h1 className="display" style={{ fontSize:"clamp(52px,6vw,76px)", fontWeight:800, color:"#fff", lineHeight:1.05, marginBottom:24 }}>
              La plataforma que<br/>
              <span className="gradient-text">impulsa el futuro</span><br/>
              de tu empresa
            </h1>

            <p style={{ fontSize:17, color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:40, maxWidth:480 }}>
              Finance Nexus integra gestión financiera inteligente, herramientas contables avanzadas y una comunidad de networking para PYMEs chilenas — todo en un solo ecosistema.
            </p>

            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn-coral" style={{ padding:"15px 32px", borderRadius:12, fontSize:15 }} onClick={() => scrollTo("productos")}>
                Explorar productos ↓
              </button>
              <button className="btn-ghost" style={{ padding:"15px 28px", borderRadius:12, fontSize:15 }} onClick={onOpenLogin}>
                Ingresar a la app
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display:"flex", gap:40, marginTop:56, paddingTop:40, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
              {[["800K+","PYMEs en Chile"],["15","Módulos integrados"],["3","Años de proyección"]].map(([n,l]) => (
                <div key={l}>
                  <div className="display" style={{ fontSize:34, fontWeight:700, color:"#fff" }}>{n}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", letterSpacing:1, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard mockup */}
          <div className="floating" style={{ position:"relative" }}>
            <div style={{
              background:"linear-gradient(160deg,#1f1f2e,#2a1a14)",
              borderRadius:24, padding:24, border:"1px solid rgba(232,80,58,0.2)",
              boxShadow:"0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
            }}>
              {/* Mock toolbar */}
              <div style={{ display:"flex", gap:6, marginBottom:20 }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c=>(
                  <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />
                ))}
                <div style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:6, height:10, marginLeft:8 }} />
              </div>
              {/* Mock KPI row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
                {[["Ingresos","$7.4M","↑ 12%","#22c55e"],["Gastos","$3.2M","↓ 5%","#ef4444"],["EBITDA","$4.1M","↑ 8%","#C9A84C"]].map(([l,v,d,c])=>(
                  <div key={l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${c}` }}>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:1 }}>{l.toUpperCase()}</div>
                    <div style={{ fontSize:18, fontWeight:700, color:"#fff", margin:"4px 0" }}>{v}</div>
                    <div style={{ fontSize:11, color:c, fontWeight:600 }}>{d}</div>
                  </div>
                ))}
              </div>
              {/* Mock chart bars */}
              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:16, marginBottom:12 }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:12, letterSpacing:1 }}>TENDENCIA · 2024</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:70 }}>
                  {[40,55,45,70,60,85,75,90,80,95,88,100].map((h,i)=>(
                    <div key={i} style={{ flex:1, height:`${h}%`, background:`linear-gradient(to top, #E8503A, #FF8C42)`, borderRadius:"3px 3px 0 0", opacity:0.7+(i*0.025) }} />
                  ))}
                </div>
              </div>
              {/* Mock rows */}
              {["Ventas Enero · $4.5M","Nómina Febrero · -$1.2M","Gastos Op. Marzo · -$520K"].map((t,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, color:"rgba(255,255,255,0.55)" }}>
                  <span>{t.split("·")[0]}</span>
                  <span style={{ color: t.includes("-") ? "#ef4444":"#22c55e", fontWeight:600 }}>{t.split("·")[1]}</span>
                </div>
              ))}
            </div>

            {/* Floating badges */}
            <div style={{ position:"absolute", top:-16, right:-16, background:"linear-gradient(135deg,#E8503A,#FF8C42)", borderRadius:12, padding:"10px 16px", boxShadow:"0 8px 24px rgba(232,80,58,0.4)" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.8)", letterSpacing:1 }}>IA FINANCIERA</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Activa ✓</div>
            </div>
            <div style={{ position:"absolute", bottom:-16, left:-16, background:"#1f1f2e", border:"1px solid rgba(201,168,76,0.3)", borderRadius:12, padding:"10px 16px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:1 }}>CONTABILIDAD</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#C9A84C" }}>Pro · Activo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom diagonal */}
      <div style={{ position:"absolute", bottom:-2, left:0, right:0, height:80, background:"var(--light)", clipPath:"polygon(0 100%,100% 0,100% 100%)" }} />
    </section>
  );
}

/* ─── MARQUEE STRIP ──────────────────────────────────────────────────────── */
function Strip() {
  const items = ["Gestión Financiera","Contabilidad Automatizada","IA Financiera","Networking PYMEs","Plan de Cuentas","Reportes PDF","Dashboard Ejecutivo","Ahorros & Inversiones","Control de Deudas","Estrategia Financiera"];
  const all = [...items,...items];
  return (
    <div style={{ background:"var(--dark)", padding:"18px 0", overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <div className="marquee-track">
        {all.map((t,i)=>(
          <span key={i} style={{ whiteSpace:"nowrap", padding:"0 32px", fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.45)", letterSpacing:2 }}>
            <span style={{ color:"var(--coral)", marginRight:14 }}>◆</span>{t.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── PRODUCTOS ──────────────────────────────────────────────────────────── */
function Productos() {
  const products = [
    {
      badge:"DISPONIBLE", label:"Finance Nexus App",
      desc:"La plataforma web de gestión financiera integral. 15 módulos completos para controlar ingresos, gastos, inversiones, deudas, ahorros y más. Con IA Financiera integrada.",
      features:["15 módulos integrados","IA Financiera (Nexus AI)","Reportes PDF ejecutivos","Gestión de múltiples cuentas","Calendario de pagos"],
      color:"#E8503A", tag:"App Web", cta:"Conocer la app →", ctaId:"app"
    },
    {
      badge:"NUEVO · BETA", label:"Módulo Contabilidad",
      desc:"Sistema contable automatizado para PYMEs. Plan de cuentas, libro diario, estados financieros y gráficos de tendencia en tiempo real.",
      features:["Plan de Cuentas IFRS","Libro Diario automatizado","Estado de Resultados","Gráficos comparativos","Exportación de datos"],
      color:"#C9A84C", tag:"Add-on", cta:"Ver contabilidad →", ctaId:"contabilidad"
    },
    {
      badge:"PRÓXIMAMENTE", label:"Networking Hub",
      desc:"Comunidad exclusiva para PYMEs chilenas. Material educativo, charlas en vivo, recursos creativos y asesoría financiera directa del equipo Finance Nexus.",
      features:["Biblioteca de recursos","Charlas en vivo","Mentorías 1:1","Comunidad privada","Templates y herramientas"],
      color:"#5B8FFF", tag:"Comunidad", cta:"Explorar →", ctaId:"networking"
    },
    {
      badge:"EN DESARROLLO", label:"Finance Nexus Enterprise",
      desc:"Solución personalizada para empresas medianas. Múltiples usuarios, integraciones bancarias directas, SLA garantizado y consultoría incluida.",
      features:["Multi-usuario","API bancaria","SLA 99.9%","Consultoría dedicada","Integraciones custom"],
      color:"#8B5CF6", tag:"Enterprise", cta:"Contactar →", ctaId:"contacto"
    },
  ];

  return (
    <section id="productos" style={{ padding:"100px 40px", background:"var(--light)", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <span className="tag" style={{ marginBottom:16, display:"inline-flex" }}>NUESTROS PRODUCTOS</span>
          <h2 className="display" style={{ fontSize:"clamp(38px,5vw,58px)", fontWeight:800, color:"var(--dark)", lineHeight:1.1 }}>
            Un ecosistema completo<br/>para tu empresa
          </h2>
          <p style={{ fontSize:17, color:"var(--muted)", marginTop:16, maxWidth:520, margin:"16px auto 0" }}>
            Desde la gestión diaria hasta la estrategia de largo plazo — todo integrado, todo en español, todo hecho para Chile.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}>
          {products.map((p,i) => (
            <div key={i} className="product-card">
              {/* Top bar */}
              <div style={{ height:5, background:`linear-gradient(90deg,${p.color},${p.color}88)` }} />
              <div style={{ padding:32 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:p.color, marginBottom:6 }}>{p.badge}</div>
                    <h3 className="display" style={{ fontSize:26, fontWeight:700, color:"var(--dark)" }}>{p.label}</h3>
                  </div>
                  <span style={{ background:`${p.color}15`, color:p.color, fontSize:11, fontWeight:700, letterSpacing:1, padding:"4px 12px", borderRadius:999, border:`1px solid ${p.color}30`, whiteSpace:"nowrap" }}>{p.tag}</span>
                </div>

                <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, marginBottom:20 }}>{p.desc}</p>

                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:28 }}>
                  {p.features.map((f,j) => (
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"var(--text)" }}>
                      <span style={{ color:p.color, fontSize:16 }}>✓</span>{f}
                    </div>
                  ))}
                </div>

                <button className="btn-coral" onClick={() => scrollTo(p.ctaId)}
                  style={{ padding:"11px 24px", borderRadius:10, fontSize:13, background:`linear-gradient(135deg,${p.color},${p.color}cc)` }}>
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── APP SECTION ─────────────────────────────────────────────────────────── */
function AppSection({ onOpenLogin }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label:"Dashboard", icon:"◈",
      desc:"Panel ejecutivo con KPIs en tiempo real, gráficos de área comparativos y resumen completo de tu situación financiera del mes.",
      color:"#E8503A" },
    { label:"Ingresos & Gastos", icon:"⇅",
      desc:"Registra y categoriza cada movimiento. Filtra por período, cuenta o categoría. Visualiza tu flujo de caja con gráficos interactivos.",
      color:"#22c55e" },
    { label:"Deudas & Ahorros", icon:"◎",
      desc:"Controla tus obligaciones financieras y metas de ahorro. Estrategias Avalancha y Bola de Nieve calculadas automáticamente.",
      color:"#C9A84C" },
    { label:"IA Financiera", icon:"✦",
      desc:"Nexus AI analiza tus finanzas y genera recomendaciones personalizadas. Pregúntale cualquier cosa sobre tu situación financiera.",
      color:"#5B8FFF" },
    { label:"Informes PDF", icon:"⊟",
      desc:"Genera reportes ejecutivos profesionales en PDF. Estado de Resultados, Balance Patrimonial y análisis de gastos con un clic.",
      color:"#8B5CF6" },
  ];

  return (
    <section id="app" style={{ padding:"100px 40px", background:"var(--dark)", position:"relative", overflow:"hidden", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ position:"absolute", top:"10%", right:"-5%", width:500, height:500,
        background:"radial-gradient(circle,rgba(232,80,58,0.1) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1, width:"100%" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

          {/* LEFT */}
          <div>
            <span className="tag" style={{ marginBottom:20, display:"inline-flex" }}>LA APLICACIÓN</span>
            <h2 className="display" style={{ fontSize:"clamp(36px,4.5vw,52px)", fontWeight:800, color:"#fff", lineHeight:1.1, marginBottom:20 }}>
              Finance Nexus<br/><span className="gradient-text">Web App</span>
            </h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:36 }}>
              Gestiona todas las finanzas de tu empresa desde un único lugar. Sin instalaciones, sin complicaciones — solo abre el navegador y empieza a trabajar.
            </p>

            {/* Tabs */}
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:36 }}>
              {tabs.map((t,i) => (
                <div key={i} onClick={() => setActiveTab(i)} style={{
                  display:"flex", alignItems:"flex-start", gap:14, padding:"14px 18px",
                  borderRadius:12, cursor:"pointer", transition:"all .25s",
                  background: activeTab===i ? "rgba(232,80,58,0.12)" : "transparent",
                  border: activeTab===i ? "1px solid rgba(232,80,58,0.25)" : "1px solid transparent",
                }}>
                  <span style={{ fontSize:20, color:activeTab===i ? t.color : "rgba(255,255,255,0.3)", marginTop:1 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color: activeTab===i ? "#fff" : "rgba(255,255,255,0.5)", marginBottom:2 }}>{t.label}</div>
                    {activeTab===i && <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{t.desc}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <button className="btn-coral" style={{ padding:"13px 28px", borderRadius:12, fontSize:14 }} onClick={onOpenLogin}>
                Ingresar a la app →
              </button>
              <button className="btn-ghost" style={{ padding:"13px 22px", borderRadius:12, fontSize:14 }}
                onClick={() => scrollTo("contacto")}>
                Solicitar demo
              </button>
            </div>
          </div>

          {/* RIGHT — Feature highlights */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { icon:"📊", title:"15 Módulos", sub:"Completos e integrados", color:"#E8503A" },
              { icon:"🤖", title:"Nexus AI", sub:"Asistente inteligente", color:"#5B8FFF" },
              { icon:"📄", title:"Reportes PDF", sub:"Profesionales al instante", color:"#C9A84C" },
              { icon:"🔒", title:"Seguro", sub:"Datos encriptados", color:"#22c55e" },
              { icon:"📱", title:"Responsive", sub:"Móvil y escritorio", color:"#8B5CF6" },
              { icon:"☁️", title:"En la nube", sub:"Sin instalación", color:"#F59E0B" },
            ].map((f,i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:14, padding:"20px 18px", transition:"all .25s",
              }} className="card-hover">
                <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:3 }}>{f.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{f.sub}</div>
                <div style={{ width:32, height:3, background:f.color, borderRadius:2, marginTop:12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTABILIDAD ───────────────────────────────────────────────────────── */
function Contabilidad() {
  return (
    <section id="contabilidad" style={{ padding:"100px 40px", background:"var(--light)", position:"relative", overflow:"hidden", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      {/* Decorative element */}
      <div style={{ position:"absolute", top:0, right:0, width:400, height:400,
        background:"linear-gradient(135deg,rgba(201,168,76,0.08),transparent)", borderRadius:"0 0 0 100%", pointerEvents:"none" }} />

      <div style={{ maxWidth:1200, margin:"0 auto", width:"100%" }}>
        {/* TOP BADGE */}
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6,
            background:"linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))",
            color:"#B8922A", border:"1px solid rgba(201,168,76,0.3)",
            padding:"5px 18px", borderRadius:999, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:16 }}>
            <span style={{ animation:"pulse 2s infinite", display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#C9A84C" }} />
            NUEVO · MÓDULO CONTABILIDAD
          </span>
          <h2 className="display" style={{ fontSize:"clamp(38px,5vw,58px)", fontWeight:800, color:"var(--dark)", lineHeight:1.1 }}>
            Contabilidad automatizada<br/>para tu PYME
          </h2>
          <p style={{ fontSize:17, color:"var(--muted)", marginTop:16, maxWidth:560, margin:"16px auto 0", lineHeight:1.7 }}>
            Olvídate de las planillas de Excel y los procesos manuales. El nuevo módulo de contabilidad de Finance Nexus automatiza tu registro contable con estándares IFRS.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1fr", gap:24, marginBottom:24 }}>
          {/* Left column */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { icon:"📋", title:"Plan de Cuentas", desc:"Estructura jerárquica completa con códigos IFRS. Activos, pasivos, patrimonio, ingresos y egresos." },
              { icon:"📒", title:"Libro Diario", desc:"Registro de asientos contables con doble entrada. Crea, edita y elimina con validación automática." },
              { icon:"⚖️", title:"Balance Automático", desc:"Verificación instantánea que Debe = Haber en cada asiento registrado." },
            ].map((f,i) => (
              <div key={i} className="card-hover" style={{ background:"#fff", borderRadius:16, padding:"22px 20px", border:"1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:26, marginBottom:10 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"var(--dark)", marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Center — big highlight card */}
          <div style={{ background:"linear-gradient(160deg,#1a100a,#2a1810)", borderRadius:24, padding:36,
            border:"1px solid rgba(201,168,76,0.2)", boxShadow:"0 24px 64px rgba(0,0,0,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", minHeight:"380px" }}>
            <div style={{ width:72, height:72, background:"linear-gradient(135deg, #C9A84C, #E8503A)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, marginBottom:24, boxShadow:"0 16px 32px rgba(201,168,76,0.25)" }}>⚖️</div>
            <div style={{ fontSize:10, color:"#C9A84C", letterSpacing:2, fontWeight:700, marginBottom:12 }}>APLICACIÓN INDEPENDIENTE</div>
            <h3 className="display" style={{ fontSize:28, fontWeight:700, color:"#fff", marginBottom:12, lineHeight:1.2 }}>Finance Nexus<br/>Contabilidad</h3>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.6, maxWidth:280 }}>
              Tu entorno contable profesional, funcionando como un producto autónomo e integrado a tu ecosistema.
            </p>
          </div>

          {/* Right column */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { icon:"📈", title:"Gráficos en Tiempo Real", desc:"Visualiza tendencias de ingresos, egresos y utilidad con gráficos interactivos actualizados al instante." },
              { icon:"📄", title:"Exportación PDF", desc:"Genera estados financieros profesionales en PDF listos para presentar a socios o instituciones." },
              { icon:"🔗", title:"Integrado con App", desc:"El módulo de contabilidad está 100% integrado con los demás módulos de Finance Nexus." },
            ].map((f,i) => (
              <div key={i} className="card-hover" style={{ background:"#fff", borderRadius:16, padding:"22px 20px", border:"1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:26, marginBottom:10 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"var(--dark)", marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div style={{ background:"linear-gradient(135deg,#E8503A,#C9A84C)", borderRadius:20, padding:"36px 48px",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:"#fff" }}>¿Listo para modernizar tu contabilidad?</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:6 }}>Accede al módulo de contabilidad incluido en el Plan Profesional</div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="btn-dark" style={{ padding:"13px 28px", borderRadius:12, fontSize:14 }}
              onClick={() => scrollTo("contacto")}>
              Comenzar gratis →
            </button>
            <button style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", padding:"13px 24px", borderRadius:12, fontSize:14, cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:500, transition:".25s" }}
              onClick={() => scrollTo("app")}>
              Ver demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── NETWORKING ─────────────────────────────────────────────────────────── */
function Networking() {
  const categories = [
    { icon:"🎓", title:"Educación Financiera", desc:"Biblioteca de contenido educativo especializado en finanzas para PYMEs. Desde fundamentos contables hasta estrategias de inversión empresarial.", items:["Cursos en video","Guías descargables","Glosario financiero","Casos de estudio"] },
    { icon:"🎙️", title:"Charlas y Webinars", desc:"Sesiones en vivo con expertos financieros, contadores y empresarios exitosos. Aprende directamente de quienes ya recorrieron el camino.", items:["Webinars mensuales","Paneles de discusión","Q&A en vivo","Grabaciones disponibles"] },
    { icon:"🎨", title:"Recursos Creativos", desc:"Templates, modelos financieros, planillas y herramientas listas para usar en tu empresa. Diseñadas por expertos para el contexto chileno.", items:["Plantillas Excel","Modelos financieros","Presentaciones","Infografías"] },
    { icon:"🤝", title:"Asesoría Finance Nexus", desc:"El equipo de Finance Nexus te guía directamente. Consultas personalizadas, revisión de estados financieros y orientación estratégica para tu PYME.", items:["Consultas 1:1","Revisión de finanzas","Plan de acción","Seguimiento mensual"] },
    { icon:"🌐", title:"Comunidad de PYMEs", desc:"Conecta con otros empresarios chilenos. Comparte experiencias, busca colaboraciones y construye tu red de contactos profesionales.", items:["Foro privado","Directorio de empresas","Grupos por industria","Eventos presenciales"] },
    { icon:"📊", title:"Benchmarking Industrial", desc:"Compara el rendimiento de tu empresa con el promedio de tu industria. Identificaa oportunidades de mejora con datos reales del mercado chileno.", items:["Reportes de industria","Métricas comparativas","Análisis de mercado","Tendencias del sector"] },
  ];

  return (
    <section id="networking" style={{ padding:"100px 40px", background:"var(--dark2)", position:"relative", overflow:"hidden", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ position:"absolute", top:"20%", left:"-10%", width:600, height:600,
        background:"radial-gradient(circle,rgba(91,143,255,0.08) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(91,143,255,0.12)", color:"#5B8FFF", border:"1px solid rgba(91,143,255,0.25)",
            padding:"5px 18px", borderRadius:999, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:16 }}>
            <span>🌐</span> NETWORKING HUB
          </span>
          <h2 className="display" style={{ fontSize:"clamp(38px,5vw,58px)", fontWeight:800, color:"#fff", lineHeight:1.1 }}>
            Aprende, conecta y<br/><span style={{ background:"linear-gradient(135deg,#5B8FFF,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>crece junto a tu comunidad</span>
          </h2>
          <p style={{ fontSize:17, color:"rgba(255,255,255,0.5)", marginTop:16, maxWidth:560, margin:"16px auto 0", lineHeight:1.7 }}>
            Finance Nexus no es solo software — es un ecosistema de apoyo para que tu PYME acceda al conocimiento, las herramientas y las conexiones que necesita para prosperar.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {categories.map((c,i) => (
            <div key={i} className="net-card">
              <div style={{ fontSize:36, marginBottom:14 }}>{c.icon}</div>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:10 }}>{c.title}</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:16 }}>{c.desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {c.items.map((item,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"rgba(255,255,255,0.45)" }}>
                    <span style={{ color:"#5B8FFF", fontSize:14 }}>→</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop:48, textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:12,
            background:"rgba(91,143,255,0.1)", border:"1px solid rgba(91,143,255,0.2)",
            borderRadius:16, padding:"20px 36px" }}>
            <span style={{ fontSize:24 }}>🚀</span>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:16, fontWeight:600, color:"#fff" }}>El Networking Hub abre pronto</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:3 }}>Únete a la lista de espera y obtén acceso prioritario + 3 meses gratis</div>
            </div>
            <button className="btn-coral" style={{ padding:"11px 24px", borderRadius:10, fontSize:13, marginLeft:16, whiteSpace:"nowrap" }}
              onClick={() => scrollTo("contacto")}>
              Quiero acceso →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRECIOS ────────────────────────────────────────────────────────────── */
function Precios() {
  const plans = [
    {
      name:"Gratuito", price:"$0", period:"/mes", badge:"", highlight:false,
      desc:"Para conocer Finance Nexus",
      features:["Dashboard básico","Hasta 3 categorías","1 cuenta bancaria","Reportes mensuales","Soporte por email"],
      cta:"Comenzar gratis"
    },
    {
      name:"Profesional", price:"$29.990", period:"/mes", badge:"MÁS POPULAR", highlight:true,
      desc:"Para PYMEs en crecimiento",
      features:["Dashboard completo","Categorías ilimitadas","5 cuentas bancarias","Módulo Contabilidad ✓","IA Financiera básica","Reportes semanales PDF","Soporte prioritario"],
      cta:"Comenzar Pro →"
    },
    {
      name:"Empresarial", price:"$99.990", period:"/mes", badge:"", highlight:false,
      desc:"Para empresas medianas",
      features:["Todo de Profesional","20 cuentas bancarias","IA Financiera avanzada","Reportes diarios","Networking Hub ✓","API access","Consultoría mensual"],
      cta:"Contactar ventas"
    },
  ];

  return (
    <section id="precios" style={{ padding:"100px 40px", background:"var(--light)", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <span className="tag" style={{ marginBottom:16, display:"inline-flex" }}>PLANES Y PRECIOS</span>
          <h2 className="display" style={{ fontSize:"clamp(38px,5vw,54px)", fontWeight:800, color:"var(--dark)", lineHeight:1.1 }}>
            Elige el plan para tu empresa
          </h2>
          <p style={{ fontSize:16, color:"var(--muted)", marginTop:12 }}>Sin compromisos. Cancela cuando quieras.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {plans.map((p,i) => (
            <div key={i} style={{
              background: p.highlight ? "linear-gradient(160deg,#1a100a,#2a1810)" : "#fff",
              borderRadius:20, padding:32, position:"relative",
              border: p.highlight ? "1px solid rgba(232,80,58,0.35)" : "1px solid rgba(0,0,0,0.07)",
              boxShadow: p.highlight ? "0 32px 64px rgba(232,80,58,0.15)" : "0 4px 24px rgba(0,0,0,0.05)",
              transform: p.highlight ? "scale(1.04)" : "scale(1)",
            }}>
              {p.badge && (
                <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)",
                  background:"linear-gradient(135deg,#E8503A,#FF8C42)", color:"#fff",
                  fontSize:10, fontWeight:700, letterSpacing:2, padding:"4px 16px", borderRadius:999 }}>
                  {p.badge}
                </div>
              )}
              <div style={{ fontSize:13, fontWeight:600, color: p.highlight ? "rgba(255,255,255,0.5)" : "var(--muted)", marginBottom:6 }}>{p.name}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:6 }}>
                <span className="display" style={{ fontSize:38, fontWeight:800, color: p.highlight ? "#fff" : "var(--dark)" }}>{p.price}</span>
                <span style={{ fontSize:14, color: p.highlight ? "rgba(255,255,255,0.4)" : "var(--muted)" }}>{p.period}</span>
              </div>
              <div style={{ fontSize:13, color: p.highlight ? "rgba(255,255,255,0.5)" : "var(--muted)", marginBottom:24 }}>{p.desc}</div>
              <div style={{ height:1, background: p.highlight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)", marginBottom:24 }} />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {p.features.map((f,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color: p.highlight ? "rgba(255,255,255,0.7)" : "var(--text)" }}>
                    <span style={{ color:"#E8503A", fontWeight:700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollTo("contacto")}
                style={{
                  width:"100%", padding:"13px", borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer",
                  background: p.highlight ? "linear-gradient(135deg,#E8503A,#FF8C42)" : "transparent",
                  color: p.highlight ? "#fff" : "var(--coral)",
                  border: p.highlight ? "none" : "1.5px solid var(--coral)",
                  transition:"all .25s"
                }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIOS ────────────────────────────────────────────────────────── */
function Testimonios() {
  const tests = [
    { name:"Valentina Morales", role:"Dueña · Boutique VM, Santiago", text:"Finance Nexus transformó cómo llevo las finanzas de mi tienda. Antes perdía horas en Excel, ahora tengo todo en un panel en minutos.", stars:5 },
    { name:"Roberto Castillo", role:"Gerente · Constructora RC, Concepción", text:"El módulo de contabilidad es increíble. Mis estados financieros están siempre al día y puedo presentarlos a los bancos en PDF al instante.", stars:5 },
    { name:"María Fernanda Lagos", role:"Directora · Estudio MLF, Valparaíso", text:"La IA Financiera me ayuda a entender mis números sin necesitar contratar un contador externo. Es como tener un asesor disponible 24/7.", stars:5 },
  ];

  return (
    <section style={{ padding:"80px 40px", background:"#f0ede8" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <span className="tag" style={{ marginBottom:16, display:"inline-flex" }}>TESTIMONIOS</span>
          <h2 className="display" style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:"var(--dark)" }}>
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {tests.map((t,i) => (
            <div key={i} className="card-hover" style={{ background:"#fff", borderRadius:20, padding:28, border:"1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", gap:2, marginBottom:16 }}>
                {Array(t.stars).fill(0).map((_,j) => <span key={j} style={{ color:"#E8503A" }}>★</span>)}
              </div>
              <p style={{ fontSize:14, color:"var(--text)", lineHeight:1.8, marginBottom:20, fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#E8503A,#FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--dark)" }}>{t.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AGENCIA / EQUIPO ────────────────────────────────────────────────────── */
function Agencia() {
  const equipo = [
    { nombre: "Visión Nexus", rol: "Liderazgo y Estrategia", emoji: "👨🏽‍💼", imgSrc: "/memoji-admin.png" },
    { nombre: "Creative Agency", rol: "Diseño & Experiencia UX/UI", emoji: "👩🏻‍🎨", imgSrc: "/memoji-design.png" },
    { nombre: "Nexus Dev Team", rol: "Desarrollo de Software", emoji: "👨🏽‍💻", imgSrc: "/memoji-dev.png" }
  ];

  return (
    <section id="agencia" style={{ padding:"100px 40px", background:"#fff", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%", textAlign:"center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <BrandLogo size={100} style={{ animation: "float 4s ease-in-out infinite" }} />
        </div>
        <span className="tag" style={{ marginBottom:16, display:"inline-flex", background:"rgba(255,140,66,0.1)", color:"var(--orange)", border:"1px solid rgba(255,140,66,0.2)" }}>NUESTRA AGENCIA</span>
        <h2 className="display" style={{ fontSize:"clamp(34px,4vw,48px)", fontWeight:800, color:"var(--dark)", marginBottom:64, lineHeight:1.1 }}>
          El equipo detrás de Finance Nexus
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {equipo.map((m, i) => (
            <div key={i} style={{ background: "var(--light)", borderRadius: 24, padding: "48px 20px", boxShadow: "0 12px 32px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "pointer", animation: `float-slow ${4 + i*0.5}s ease-in-out infinite` }} onMouseOver={e=>{e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 24px 48px rgba(0,0,0,0.08)"; e.currentTarget.style.animationPlayState="paused"}} onMouseOut={e=>{e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.04)"; e.currentTarget.style.animationPlayState="running"}}>
              {/* Avatar Container */}
              <div style={{ width: 140, height: 140, margin: "0 auto 32px", borderRadius: "50%", background: "linear-gradient(135deg,rgba(232,80,58,0.15),rgba(255,140,66,0.25))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", border: "4px solid #fff", boxShadow: "0 16px 32px rgba(255,140,66,0.15)" }}>
                <img 
                  src={m.imgSrc} 
                  alt={m.nombre} 
                  style={{ width: "130%", height: "130%", objectFit: "contain", position: "absolute", bottom: "-10%", zIndex:2 }} 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: "none", fontSize: 64, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))", transform: "translateY(5px)", zIndex:1 }}>
                  {m.emoji}
                </div>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{m.nombre}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>{m.rol}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACTO ───────────────────────────────────────────────────────────── */
function Contacto() {
  const [form, setForm] = useState({ nombre:"", empresa:"", email:"", mensaje:"", producto:"Finance Nexus App" });
  const [sent, setSent] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const send = () => {
    if(!form.nombre || !form.email) return;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ nombre:"", empresa:"", email:"", mensaje:"", producto:"Finance Nexus App" });
  };

  const inputStyle = { width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:14, outline:"none" };

  return (
    <section id="contacto" style={{ padding:"100px 40px", background:"var(--dark)", position:"relative", overflow:"hidden", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ position:"absolute", bottom:"-5%", right:"-5%", width:500, height:500,
        background:"radial-gradient(circle,rgba(232,80,58,0.12) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1, width:"100%" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:80, alignItems:"start" }}>

          {/* LEFT */}
          <div>
            <span className="tag" style={{ marginBottom:20, display:"inline-flex" }}>CONTACTO</span>
            <h2 className="display" style={{ fontSize:"clamp(36px,4.5vw,52px)", fontWeight:800, color:"#fff", lineHeight:1.1, marginBottom:20 }}>
              Hablemos de tu<br/><span className="gradient-text">próximo paso</span>
            </h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:36 }}>
              ¿Tienes preguntas? ¿Quieres una demo personalizada? ¿O simplemente quieres saber más? Nuestro equipo en Chile está aquí para ayudarte.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[
                { icon:"📧", label:"Email", value:"nexuslabsai.hq@gmail.com" },
                { icon:"📍", label:"Ubicación", value:"Santiago, Chile" },
                { icon:"💬", label:"Respuesta", value:"Menos de 24 horas" },
              ].map((c,i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:"rgba(232,80,58,0.12)", border:"1px solid rgba(232,80,58,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:2 }}>{c.label.toUpperCase()}</div>
                    <div style={{ fontSize:14, color:"#fff", fontWeight:500 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:36 }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <div className="display" style={{ fontSize:24, color:"#fff", fontWeight:700, marginBottom:8 }}>¡Mensaje enviado!</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)" }}>Nos pondremos en contacto en menos de 24 horas.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, display:"block", marginBottom:6 }}>NOMBRE *</label>
                    <input style={inputStyle} placeholder="Tu nombre" value={form.nombre} onChange={e=>set("nombre",e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, display:"block", marginBottom:6 }}>EMPRESA</label>
                    <input style={inputStyle} placeholder="Nombre de empresa" value={form.empresa} onChange={e=>set("empresa",e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, display:"block", marginBottom:6 }}>EMAIL *</label>
                  <input type="email" style={inputStyle} placeholder="tu@empresa.cl" value={form.email} onChange={e=>set("email",e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, display:"block", marginBottom:6 }}>ME INTERESA</label>
                  <select style={inputStyle} value={form.producto} onChange={e=>set("producto",e.target.value)}>
                    <option>Finance Nexus App</option>
                    <option>Módulo Contabilidad</option>
                    <option>Networking Hub</option>
                    <option>Plan Empresarial</option>
                    <option>Demo personalizada</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, display:"block", marginBottom:6 }}>MENSAJE</label>
                  <textarea style={{ ...inputStyle, height:100, resize:"vertical" }} placeholder="Cuéntanos sobre tu empresa y lo que necesitas..." value={form.mensaje} onChange={e=>set("mensaje",e.target.value)} />
                </div>
                <button className="btn-coral" onClick={send} style={{ padding:"14px", borderRadius:12, fontSize:15, width:"100%", marginTop:4 }}>
                  Enviar mensaje →
                </button>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
                  Al enviar, aceptas nuestra política de privacidad. Sin spam, prometido.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background:"#070710", padding:"60px 40px 32px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:56 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <BrandLogo size={80} />
            </div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", lineHeight:1.8, maxWidth:260, marginBottom:20 }}>
              La plataforma financiera integral para PYMEs chilenas. Gestiona, analiza y crece con inteligencia.
            </p>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)", letterSpacing:3 }}>CONECTA · CRECE · PROSPERA</div>
          </div>

          {[
            { title:"Productos", links:["Finance Nexus App","Módulo Contabilidad","Networking Hub","Enterprise"] },
            { title:"Empresa", links:["Sobre nosotros","Blog","Casos de éxito","Prensa"] },
            { title:"Legal", links:["Términos de uso","Privacidad","Cookies","GDPR Chile"] },
          ].map((col,i) => (
            <div key={i}>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:2, marginBottom:20 }}>{col.title.toUpperCase()}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {col.links.map((l,j) => (
                  <span key={j} style={{ fontSize:13, color:"rgba(255,255,255,0.35)", cursor:"pointer", transition:".2s", display:"inline-block" }}
                    onMouseEnter={e=>e.target.style.color="#E8503A"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height:1, background:"rgba(255,255,255,0.05)", marginBottom:28 }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>
            © {year} Finance Nexus SpA · Santiago, Chile · Todos los derechos reservados
          </div>
          <div style={{ display:"flex", gap:16 }}>
            {["LinkedIn","Instagram","Twitter","YouTube"].map(s => (
              <span key={s} style={{ fontSize:12, color:"rgba(255,255,255,0.25)", cursor:"pointer", transition:".2s" }}
                onMouseEnter={e=>e.target.style.color="#E8503A"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.25)"}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────────────── */
export default function Landing({ onLogin, authUser }) {
  const [showLogin, setShowLogin] = useState(false);

  const handleAccess = async () => {
    if (authUser) {
      window.location.hash = '#app';
      setShowLogin(false);
    } else {
      try {
        await onLogin();
        window.location.hash = '#app';
        setShowLogin(false);
      } catch(e) {
        console.error("Login fallido:", e);
      }
    }
  };

  return (
    <>
      <FontLink />
      <div id="landing-scroll-container" style={{ height:"100vh", overflowY:"auto", overflowX:"hidden", scrollBehavior:"smooth", position:"relative" }}>
        <Navbar onOpenLogin={() => setShowLogin(true)} />
        <Hero onOpenLogin={() => setShowLogin(true)} />
        <Strip />
        <Productos />
        <AppSection onOpenLogin={() => setShowLogin(true)} />
        <Contabilidad />
        <Networking />
        <Precios />
        <Testimonios />
        <Agencia />
        <Contacto />
        <Footer />
      </div>

      {showLogin && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(10,13,20,0.85)", backdropFilter:"blur(16px)", animation:"fadeIn .3s ease" }}>
          <div style={{ background:"linear-gradient(160deg, #181820, #0f0f14)", border:"1px solid rgba(255,140,66,0.3)", borderRadius:24, padding:"48px 40px", width:"90%", maxWidth:420, textAlign:"center", position:"relative", boxShadow:"0 32px 64px rgba(0,0,0,0.5)" }}>
            <button onClick={() => setShowLogin(false)} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.05)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>✕</button>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
              <BrandLogo size={80} />
            </div>
            <h3 className="display" style={{ fontSize:32, fontWeight:800, color:"#fff", marginBottom:8, lineHeight:1.1 }}>Acceso a la<br/>App Web</h3>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.5)", marginBottom:32, lineHeight:1.6 }}>Ingresa de forma segura para acceder al entorno administrativo de Finance Nexus.</p>
            <button onClick={handleAccess} style={{ width:"100%", padding:"16px", borderRadius:14, background:"#fff", color:"#0f0f14", fontSize:16, fontWeight:700, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"all .2s", boxShadow:"0 8px 16px rgba(255,255,255,0.1)" }} onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 24px rgba(255,255,255,0.2)"}} onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 16px rgba(255,255,255,0.1)"}}>
              {!authUser ? <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg> : "🚀"}
              {authUser ? "Abrir Aplicación" : "Ingresar con Google"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
