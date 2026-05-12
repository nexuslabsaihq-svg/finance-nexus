import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('gsap') || id.includes('@gsap/react')) {
              return 'gsap';
            }
            if (id.includes('three')) {
              return 'three';
            }
            if (id.includes('jspdf')) {
              return 'pdf';
            }
            if (id.includes('xlsx')) {
              return 'excel';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
