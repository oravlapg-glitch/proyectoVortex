# Vortex Station · Frontend

Frontend en React + Vite (hecho con la estructura de los apuntes: `api/`, `context/`, `components/`, `pages/`)
que se conecta al backend `vortex-gaming-backend` sin modificarlo.

## Arranque (3 pasos, cada uno en su terminal de VS Code)

1. **MongoDB** encendido en el puerto 27017.
2. **Backend** (carpeta `vortex-gaming-backend`). Su `.env` debe tener:
   ```
   PORT=3000
   MONGO_URL=mongodb://127.0.0.1:27017/vortex-gaming
   TOKEN_PASSWORD=una_clave_secreta
   FRONTEND_URL=http://localhost:5173
   ```
   ```
   npm install
   npm run dev
   ```
3. **Frontend** (esta carpeta):
   ```
   npm install
   npm run dev
   ```
   Abre http://localhost:5173

## Primera vez: cargar datos
Con el backend encendido, abre en el navegador `http://localhost:3000/api/usuarios/carga-inicial` (crea los usuarios).
Inicia sesión como admin y, en **Admin → datos**, pulsa los botones para cargar espacios, categorías y productos.

## Usuarios de prueba
| Rol | Email | Contraseña |
|---|---|---|
| ADMIN | admin@vortex.test | Admin123! |
| AGENTE | agente1@vortex.test | Agente123! |
| CLIENTE | ana@vortex.test | Cliente123! |

## Despliegue
La URL del backend está en `.env` (`VITE_API_URL`). Para publicar, cámbiala por la URL pública del backend.
