import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try { await login(email, password); nav('/cuenta'); } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={onSubmit} className="box card">
      <span className="tag">Welcome to the lounge</span>
      <h2>Iniciar <span className="lime">sesión</span></h2>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="pass">Contraseña</label>
      <input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="err">{error}</p>}
      <p><button className="btn">Entrar →</button></p>
    </form>
  );
}
