# Vortex Gaming · Backend

API REST del PC bang Vortex Gaming: alquiler de PCs y salas, tienda de merch
para recoger en el local y soporte mediante tickets.

Node.js + Express · MongoDB + Mongoose · JWT · Swagger

## URLs públicas
- API: https://<pendiente>.onrender.com/api
- Documentación: https://<pendiente>.onrender.com/api-docs
- Frontend: https://<pendiente>

## Instalación local
1. npm install
2. Crea un archivo .env dentro de backend/ con estas variables:
   PORT=3000
   MONGO_URL=mongodb://127.0.0.1:27017/vortex-gaming
   TOKEN_PASSWORD=<una clave secreta>
   FRONTEND_URL=http://localhost:5173
3. npm run dev
4. Carga inicial de datos:
   - GET /api/usuarios/carga-inicial (sin token)
   - Login como admin y, con su token:
     GET /api/espacios/carga-inicial, /api/categorias/carga-inicial y /api/productos/carga-inicial

## Usuarios de prueba
| Rol     | Email               | Contraseña  |
|---------|---------------------|-------------|
| ADMIN   | admin@vortex.test   | Admin123!   |
| AGENTE  | agente1@vortex.test | Agente123!  |
| AGENTE  | agente2@vortex.test | Agente123!  |
| CLIENTE | ana@vortex.test     | Cliente123! |
| CLIENTE | luis@vortex.test    | Cliente123! |
