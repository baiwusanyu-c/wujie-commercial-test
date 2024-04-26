import Cookies from 'js-cookie'
import ElementPlus from 'element-plus'
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import { type App } from 'vue'

// 使用element-plus 并且设置全局的大小
const size = Cookies.get('size') as 'large' | 'default' | 'small'
export function loadElementPlus(app: App) {
  /** Element Plus 组件完整引入 */
  app.use(ElementPlus, {
    locale,
    // 支持 large、default、small
    size: size || 'default',
  })
}
