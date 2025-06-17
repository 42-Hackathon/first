import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'build/client',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'sticky-note': path.resolve(__dirname, 'sticky-note.html')
      }
    }
  }
});