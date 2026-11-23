import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

// Panel izquierdo decorativo que comparten Login y Register
export function AuthSide({ titulo, texto }) {
  return (
    <div className="auth-side">
      <img src="/logo.png" alt="Vortex Station" />
      <h2>{titulo}</h2>
      <p>{texto}</p>
      <ul>
        <li><Icon name="calendar" size={16} /> Reserva PCs y salas</li>
        <li><Icon name="cart" size={16} /> Compra en la tienda</li>
        <li><Icon name="chat" size={16} /> Soporte personalizado</li>
      </ul>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try { await login(email, password); nav('/cuenta'); } catch (err) { setError(err.message); setEnviando(false); }
  };

  return (
    <div className="auth">
      <AuthSide titulo={<>BIENVENIDO DE <span className="lime">NUEVO</span></>} texto="Entra en tu cuenta y sigue donde lo dejaste." />
      <form onSubmit={onSubmit} className="auth-form">
        <span className="tag">Welcome to the lounge</span>
        <h1>Iniciar <span className="lime">sesión</span></h1>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="pass">Contraseña</label>
        <input id="pass" type="password" autoComplete="current-password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="err">{error}</p>}
        <button className="btn full" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'} <Icon name="arrow" size={18} /></button>
        <p className="muted center">¿No tienes cuenta? <Link to="/register">Crea una gratis</Link></p>
      </form>
    </div>
  );
}
