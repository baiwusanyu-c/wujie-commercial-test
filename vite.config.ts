import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Unocss from 'unocss/vite';
// https://vite.dev/config/
export default defineConfig({
  base: '/wujie-commercial-test/website',
  plugins: [ svelte(), Unocss()],
})
