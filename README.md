# Vortex Station

Dos carpetas separadas: `backend/` (API, sin modificar) y `frontend/` (React + Vite).

## Arrancar (3 terminales en VS Code)
1. MongoDB encendido (puerto 27017).
2. Backend: crea `backend/.env` con
   ```
   PORT=3000
   MONGO_URL=mongodb://127.0.0.1:27017/vortex-gaming
   TOKEN_PASSWORD=una_clave_secreta
   FRONTEND_URL=http://localhost:5173
   ```
   y ejecuta `cd backend`, `npm install`, `npm run dev`.
3. Frontend: `cd frontend`, `npm install`, `npm run dev` y abre http://localhost:5173

## Primera vez
Abre http://localhost:3000/api/usuarios/carga-inicial (crea los usuarios), entra como
`admin@vortex.test` / `Admin123!` y en **Admin → datos** carga espacios, categorías y productos.

## Lanzamiento
ejecutar los siguientes comandos para lanzar los servidores de Front y de Back

``` bash
cd ./frontend
npm run dev
```

*abrir un aterminal nueva*

``` bash
cd ./backend
npx nodemon
```

## clonar el repo

``` bash
git clone https://github.com/oravlapg-glitch/proyectoVortex
```
 Comandos de funcionamiento de Git

 ``` bash
# guardar los cambios
git add .

# hacer una imagen (commit)
git commit -m "descripcion"

# subir cambios
git push origin main
```

 ``` bash
# descargar cambios de GH
git pull
```