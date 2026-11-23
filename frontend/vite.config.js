import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fijo el puerto 5173 porque el backend solo permite CORS desde FRONTEND_URL=http://localhost:5173
export default defineConfig({ plugins: [react()], server: { port: 5173, strictPort: true } })
