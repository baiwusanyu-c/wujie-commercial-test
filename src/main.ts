import { createApp } from 'vue'
import store from '@/store'
import ElementPlus from 'element-plus'
import router from './router'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import 'element-plus/dist/index.css'
import './assets/styles/index.scss'
import App from './App.vue'
import './utils/auto-update'

const app = createApp(App)
console.log(app, App)
app.use(ElementPlus, {
  locale,
  size: 'default', // 支持 large、default、small
})
app.use(store)
app.use(router)
app.mount('#app')