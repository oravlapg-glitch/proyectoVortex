// Aquí centralizo todas las peticiones a la API (igual que en los apuntes, pero con token y más métodos)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = 'Bearer ' + token; // si hay sesión, mando el token

  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('No consigo conectar con el servidor. ¿Está arrancado el backend?');
  }
  // El backend devuelve JSON si todo va bien y texto plano cuando hay error
  const text = await res.text();
  let data = text;
  try { data = JSON.parse(text); } catch { /* era texto */ }

  if (res.status === 401 && token) { // token caducado: limpio la sesión y vuelvo al login
    localStorage.removeItem('token'); localStorage.removeItem('user');
    window.location.href = '/login';
  }
  if (!res.ok) throw new Error(typeof data === 'string' && data ? data : 'Error ' + res.status);
  return data;
}

export const apiGet = (path) => request('GET', path);
export const apiPost = (path, body) => request('POST', path, body);
export const apiPut = (path, body) => request('PUT', path, body);
export const apiPatch = (path, body) => request('PATCH', path, body);
export const apiDelete = (path) => request('DELETE', path);
