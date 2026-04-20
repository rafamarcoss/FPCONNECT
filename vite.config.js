import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Necesario para que Electron encuentre los archivos locales en producción
  server: {
    host: true,
    port: 5173,
    open: false, // Cambiado a false para que no abra el navegador cuando abrimos Electron
  },
  build: {
    outDir: 'dist',
  },
})
