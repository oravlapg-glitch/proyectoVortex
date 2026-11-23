import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Gaming from './pages/Gaming';
import Comida from './pages/Comida';
import Espacios from './pages/Espacios';
import Torneos from './pages/Torneos';
import Dashboard from './pages/Dashboard';
import Soporte from './pages/Soporte';
import TicketDetalle from './pages/TicketDetalle';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/gaming" element={<Gaming />} />
          <Route path="/comida" element={<Comida />} />
          <Route path="/salas" element={<Espacios tipo="sala" />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cuenta" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/soporte" element={<ProtectedRoute><Soporte /></ProtectedRoute>} />
          <Route path="/soporte/:id" element={<ProtectedRoute><TicketDetalle /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
