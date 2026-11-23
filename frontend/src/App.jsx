import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Espacios from './pages/Espacios';
import Dashboard from './pages/Dashboard';
import Soporte from './pages/Soporte';
import TicketDetalle from './pages/TicketDetalle';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const L = ({ to, children }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>{children}</NavLink>
);

function Nav() {
  const { user, logout } = useAuth();
  const { lineas } = useCart();
  return (
    <nav className="top">
      <Link to="/"><img src="/logo.png" alt="Vortex Station" /></Link>
      <L to="/">Inicio</L>
      <L to="/tienda">Tienda ({lineas.length})</L>
      <L to="/gaming">Gaming</L>
      <L to="/salas">Salas privadas</L>
      {user && <L to="/soporte">Soporte</L>}
      {user?.rol === 'ADMIN' && <L to="/admin">Admin</L>}
      <span className="sp" />
      {user ? (
        <>
          <L to="/cuenta">{user.nombre} · {user.rol}</L>
          <button className="btn o" onClick={logout}>Salir</button>
        </>
      ) : (
        <>
          <L to="/login">Entrar</L>
          <Link className="btn" to="/register">Crear cuenta</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/gaming" element={<Espacios tipo="pc" />} />
          <Route path="/salas" element={<Espacios tipo="sala" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cuenta" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/soporte" element={<ProtectedRoute><Soporte /></ProtectedRoute>} />
          <Route path="/soporte/:id" element={<ProtectedRoute><TicketDetalle /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
