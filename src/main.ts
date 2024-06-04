import { createApp } from 'vue'
import store from '@/store'
import router from './router'
import App from './App.vue'
// import './utils/auto-update'
import WujieVue from 'wujie-vue3'
// load
import loadPlugins from '@/plugins'
// css
import 'uno.css'
import 'element-plus/dist/index.css'
import './assets/styles/index.scss'

const app = createApp(App)
/** 加载插件 */
loadPlugins(app)
app.use(WujieVue)
app.use(store).use(router)
router.isReady().then(() => {
  app.mount('#app')
})
