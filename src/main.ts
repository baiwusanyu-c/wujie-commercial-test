import './assets/app.css'
import 'virtual:uno.css';
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
