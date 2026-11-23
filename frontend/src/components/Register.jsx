import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, login } = useAuth();
  const nav = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(nombre, email, password); // el backend siempre crea un CLIENTE
      await login(email, password);            // y ya que está creado, inicio sesión directamente
      nav('/cuenta');
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={onSubmit} className="box card">
      <span className="tag">Únete a Vortex</span>
      <h2>Crear <span className="lime">cuenta</span></h2>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="pass">Contraseña (mínimo 6 caracteres)</label>
      <input id="pass" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="err">{error}</p>}
      <p><button className="btn">Crear cuenta →</button></p>
    </form>
  );
}
