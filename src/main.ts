import { createApp } from 'vue'
import store from '@/store'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import 'element-plus/dist/index.css'
import './assets/styles/index.scss'
import App from './App.vue'
import './utils/auto-update'
const app = createApp(App)
app.use(ElementPlus, {
  locale,
  size: 'default', // 支持 large、default、small
})
app.use(store)
app.mount('#app')
