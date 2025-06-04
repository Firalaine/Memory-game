// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Для Tailwind CSS
  },
  build: {
    outDir: 'dist', // Папка для продакшен-файлів
  },
  base: '/', // Для коректного розгортання на Vercel
});