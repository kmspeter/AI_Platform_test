import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://3.34.137.42:8080',
        changeOrigin: true,
        // 필요하면:
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});