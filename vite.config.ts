import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Unocss from 'unocss/vite';
// https://vite.dev/config/
export default defineConfig({
  base: '/wujie-commercial-test',
  plugins: [ svelte(), Unocss()],
  build: {
    minify: false,
  },
  server: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',  // 禁用缓存
    },
  },
})
