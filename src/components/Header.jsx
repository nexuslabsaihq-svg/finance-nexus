import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function Header() {
  const { period, setPeriod, usuario, logout, setActivePage, notificaciones, setNotificaciones, ingresos, gastos, authUser } = useAppData();
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(event.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const term = searchTerm.toLowerCase();
    const res = [];
    ingresos.forEach(i => {
      if (i.desc.toLowerCase().includes(term) || i.cat.toLowerCase().includes(term)) res.push({...i, type: 'ingreso'});
    });
    gastos.forEach(g => {
      if (g.desc.toLowerCase().includes(term) || g.cat.toLowerCase().includes(term)) res.push({...g, type: 'gasto'});
    });
    return res.slice(0, 5);
  }, [searchTerm, ingresos, gastos]);

  const unreadNotifs = notificaciones.filter(n => !n.read);

  const markAsRead = (id) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="header" style={{position: 'relative', width: '100%', flexShrink: 0}}>
      <div className="greeting">Hola, <span>{authUser?.displayName?.split(' ')[0] || 'Usuario'}</span> 👋</div>
      
      <div className="search-wrap" style={{ position: 'relative' }}>
        <span style={{position:'absolute', left: '12px', top:'50%', transform:'translateY(-50%)'}}>🔍</span>
        <input 
          type="text" 
          placeholder="Buscar transacciones, módulos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', height: '100%', paddingLeft: '34px', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font)' }}
        />
        {searchResults.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', marginTop: '8px', zIndex: 100, padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            {searchResults.map((r, i) => (
              <div key={i} style={{ padding: '8px', borderBottom: i === searchResults.length - 1 ? 'none' : '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div><span style={{ marginRight: '6px' }}>{r.type === 'ingreso' ? '💰' : '💸'}</span>{r.desc}</div>
                <div style={{ color: r.type === 'ingreso' ? 'var(--green)' : 'var(--pink)', fontFamily: 'var(--mono)' }}>{r.type === 'ingreso' ? '+' : '-'}${r.monto.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="hdr-right">
        <div className="period-group">
          {['Enero', 'Febrero', 'Marzo'].map(p => (
            <button key={p} className={`pbtn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
              {p.substring(0, 3)}
            </button>
          ))}
        </div>
        
        <button className="hbtn" style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font)' }}>CLP</button>
        
        {/* NOTIFICATIONS */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="hbtn" onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}>
            🔔{unreadNotifs.length > 0 && <span className="notif-dot"></span>}
          </button>
          <div className={`notif-panel ${notifOpen ? 'open' : ''}`}>
            <div className="np-header">
              <div className="np-title">🔔 Notificaciones</div>
              <span className="badge bp">{unreadNotifs.length} nuevas</span>
            </div>
            {notificaciones.length === 0 ? (
              <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text2)', fontSize: '13px' }}>No hay notificaciones</div>
            ) : (
              notificaciones.map(n => (
                <div key={n.id} className="np-item" style={{ opacity: n.read ? 0.6 : 1 }}>
                  <div className="np-dot" style={{ background: `var(--${n.type})` }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="np-text">{n.text}</div>
                    <div className="np-time">{new Date(n.time).toLocaleDateString()}</div>
                  </div>
                  {!n.read && <button onClick={() => markAsRead(n.id)} className="btn btn-gh btn-sm" style={{ padding: '2px 6px', fontSize: '10px' }}>✓</button>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* USER MENU */}
        <div ref={userRef} style={{ position: 'relative' }}>
          <div className="user-menu-btn" onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }} title={`${authUser?.displayName || 'Usuario'}\n${authUser?.email || ''}`}>
            <div className="uma">{authUser?.photoURL ? <img src={authUser.photoURL} style={{width:'100%', height:'100%', borderRadius:'50%'}}/> : (authUser?.displayName?.[0] || 'U')}<span className="uma-online"></span></div>
            <span className="uma-name">{authUser?.displayName?.split(' ')[0] || 'Usuario'}</span>
            <span className="uma-arrow">▾</span>
          </div>
          <div className={`user-dropdown ${userMenuOpen ? 'open' : ''}`}>
            <div className="ud-header">
              <div className="ud-avatar-wrap" onClick={() => { setUserMenuOpen(false); setActivePage('perfil'); }}>
                <div className="ud-avatar">{authUser?.photoURL ? <img src={authUser.photoURL} style={{width:'100%', height:'100%', borderRadius:'50%'}}/> : (authUser?.displayName?.[0] || 'U')}</div>
              </div>
              <div>
                <div className="ud-name">{authUser?.displayName || 'Usuario'}</div>
                <div className="ud-email">{authUser?.email || 'usuario@email.com'}</div>
                <div className="ud-plan">⭐ Plan {usuario.plan}</div>
              </div>
            </div>
            <div className="ud-section">
              <div className="ud-item" onClick={() => { setUserMenuOpen(false); setActivePage('perfil'); }}><span className="ud-item-icon">👤</span><span className="ud-item-label">Mi Perfil</span><span className="ud-item-arrow">›</span></div>
              <div className="ud-item" onClick={() => { setUserMenuOpen(false); setActivePage('configuracion'); }}><span className="ud-item-icon">⚙️</span><span className="ud-item-label">Configuración</span><span className="ud-item-arrow">›</span></div>
              <div className="ud-item" onClick={() => { setUserMenuOpen(false); setActivePage('seguridad'); }}><span className="ud-item-icon">🔐</span><span className="ud-item-label">Seguridad y Privacidad</span><span className="ud-item-arrow">›</span></div>
            </div>
            <div className="ud-footer">
              <div className="ud-logout" onClick={logout}><span>🚪</span>Cerrar Sesión</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
