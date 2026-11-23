import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Icon from './Icon';

// Enlaces principales (los uso en la barra de arriba y en el menú lateral)
export const SECCIONES = [
  { to: '/', txt: 'Inicio', icon: 'home', sub: 'Bienvenido' },
  { to: '/tienda', txt: 'Tienda', icon: 'cart', sub: 'Periféricos y setups' },
  { to: '/gaming', txt: 'Gaming', icon: 'gamepad', sub: 'Tarifas y bonos' },
  { to: '/comida', txt: 'Comida & Bebida', icon: 'food', sub: 'Comida y bebidas' },
  { to: '/salas', txt: 'Salas privadas', icon: 'monitor', sub: 'Tu espacio, tu juego' },
  { to: '/torneos', txt: 'Torneos', icon: 'trophy', sub: 'Compite y gana' },
];

const cls = ({ isActive }) => (isActive ? 'active' : '');

function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { lineas } = useCart();
  const unidades = lineas.reduce((s, l) => s + l.cantidad, 0);

  return (
    <header className="topbar">
      <button className="icon-btn only-mobile" aria-label="Abrir menú" onClick={onMenu}><Icon name="menu" /></button>
      <Link to="/" className="brand" aria-label="Vortex Station, inicio">
        <img src="/logo.png" alt="" />
        <span><b>VORTEX</b><small>STATION</small></span>
      </Link>
      <nav className="topnav" aria-label="Principal">
        {SECCIONES.map((s) => <NavLink key={s.to} to={s.to} end={s.to === '/'} className={cls}>{s.txt}</NavLink>)}
      </nav>
      <div className="top-actions">
        <Link to="/tienda" className="icon-btn" aria-label={`Carrito (${unidades})`}>
          <Icon name="cart" />
          {unidades > 0 && <span className="badge">{unidades}</span>}
        </Link>
        {user ? (
          <>
            <Link to="/cuenta" className="user-chip">
              <span className="avatar">{user.nombre?.[0]?.toUpperCase()}</span>
              <span className="hide-sm"><b>{user.nombre}</b><small>{user.rol}</small></span>
            </Link>
            <button className="icon-btn" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={logout}><Icon name="logout" /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn o sm hide-sm">Entrar</Link>
            <Link to="/register" className="btn sm">Crear cuenta</Link>
          </>
        )}
      </div>
    </header>
  );
}

function Sidebar({ abierto, onClose }) {
  const { user } = useAuth();
  return (
    <>
      <div className={'backdrop' + (abierto ? ' show' : '')} onClick={onClose} />
      <aside className={'sidebar' + (abierto ? ' open' : '')}>
        <nav aria-label="Secciones">
          {SECCIONES.map((s) => (
            <NavLink key={s.to} to={s.to} end={s.to === '/'} className={cls}><Icon name={s.icon} />{s.txt}</NavLink>
          ))}
          {user && (
            <>
              <p className="side-title">Mi zona</p>
              <NavLink to="/cuenta" className={cls}><Icon name="user" />Mi cuenta</NavLink>
              <NavLink to="/soporte" className={cls}><Icon name="chat" />Soporte</NavLink>
              {user.rol === 'ADMIN' && <NavLink to="/admin" className={cls}><Icon name="database" />Base de datos</NavLink>}
            </>
          )}
        </nav>
        <div className="side-promo">
          <p>CONECTA<br /><span className="lime">JUEGA</span><br />DISFRUTA</p>
          <img src="/logo.png" alt="" />
        </div>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="brand"><img src="/logo.png" alt="" /><span><b>VORTEX</b><small>STATION</small></span></Link>
      <p className="slogan"><span className="lime">CONECTA.</span> JUEGA. <span className="cyan">DISFRUTA.</span></p>
      <p className="muted small">© {new Date().getFullYear()} Vortex Station · Abierto todos los días de 10:00 a 23:00</p>
    </footer>
  );
}

// Esqueleto de la web: barra superior + menú lateral + contenido + pie
export default function Layout({ children }) {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setAbierto(false); window.scrollTo(0, 0); }, [pathname]); // al cambiar de página cierro el menú y subo

  return (
    <div className="shell">
      <Topbar onMenu={() => setAbierto(true)} />
      <Sidebar abierto={abierto} onClose={() => setAbierto(false)} />
      <div className="content">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
