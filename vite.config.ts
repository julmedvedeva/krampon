import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint2';

export default defineConfig({
  plugins: [
    vue(),
    eslint({
      include: ['src/**/*.js', 'src/**/*.vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Разрешаем хост Localtunnel
    allowedHosts: [
      'localhost',
      'thirty-eagles-argue.loca.lt',
      '*.loca.lt', // Для гибкости при смене URL Localtunnel
    ],
    // Настройка прокси для запросов к бэкенду
    proxy: {
      '/api': {
        target: 'https://dev-krampon.ddns.net',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
