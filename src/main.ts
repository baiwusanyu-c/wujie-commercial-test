import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
const app = createApp(App)
app.use(ElementPlus, {
    locale,
    size: 'default', // 支持 large、default、small
})
app.mount('#app')
