import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ramlive-erp/', // substitua pelo nome do seu repositório no GitHub
  server: {
    port: 5173,
    open: true
  }
});
