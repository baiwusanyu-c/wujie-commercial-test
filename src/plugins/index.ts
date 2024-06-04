import { type App } from 'vue'
import { loadElementPlus } from './element-plus'
import { loadUI } from './ui'
import { loadVForm3 } from './vform3-builds'
import { loadElementPlusIcon } from './element-plus-icon'
import { resetForm } from '@/utils/index'

export default function loadPlugins(app: App) {
  loadElementPlus(app)
  loadElementPlusIcon(app)
  loadVForm3(app)
  loadUI(app)
  app.config.globalProperties.$resetForm = resetForm
}
