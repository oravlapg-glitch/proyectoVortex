import { createContext, useContext, useState } from 'react';
import { apiPost } from '../api/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Leo el usuario guardado al crear el estado (y no en un useEffect) para que al recargar no me mande al login
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const login = async (email, password) => {
    const d = await apiPost('/usuarios/login', { email, password });
    localStorage.setItem('token', d.token);
    localStorage.setItem('user', JSON.stringify(d.usuario));
    setUser(d.usuario);
    return d.usuario;
  };
  const register = (nombre, email, password) => apiPost('/usuarios/signup', { nombre, email, password });
  const logout = () => { setUser(null); localStorage.removeItem('user'); localStorage.removeItem('token'); };

  return <AuthContext.Provider value={{ user, setUser, login, register, logout }}>{children}</AuthContext.Provider>;
}
