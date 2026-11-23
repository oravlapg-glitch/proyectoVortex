import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Igual que en los apuntes, pero además puedo pedir un rol concreto: <ProtectedRoute roles={['ADMIN']}>
// (esto solo oculta pantallas; los permisos de verdad los valida el backend)
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" replace />;
  return children;
}
