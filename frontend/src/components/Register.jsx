import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthSide } from './Login';
import Icon from './Icon';

export default function Register() {
  const { register, login } = useAuth();
  const nav = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await register(nombre, email, password); // el backend siempre crea un CLIENTE
      await login(email, password);            // y ya que está creado, inicio sesión directamente
      nav('/cuenta');
    } catch (err) { setError(err.message); setEnviando(false); }
  };

  return (
    <div className="auth">
      <AuthSide titulo={<>ÚNETE A <span className="lime">VORTEX</span></>} texto="Crea tu cuenta gratis y empieza a jugar." />
      <form onSubmit={onSubmit} className="auth-form">
        <span className="tag">Únete a Vortex</span>
        <h1>Crear <span className="lime">cuenta</span></h1>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" autoComplete="name" placeholder="Tu nombre o nick" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="pass">Contraseña <small className="muted">(mínimo 6 caracteres)</small></label>
        <input id="pass" type="password" autoComplete="new-password" minLength={6} placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="err">{error}</p>}
        <button className="btn full" disabled={enviando}>{enviando ? 'Creando…' : 'Crear cuenta'} <Icon name="arrow" size={18} /></button>
        <p className="muted center">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
