import { type App } from 'vue'
import { loadElementPlus } from './element-plus'
import { loadUI } from './ui'
import { loadVForm3 } from './vform3-builds'

export default function loadPlugins(app: App) {
  loadElementPlus(app)
  loadVForm3(app)
  loadUI(app)
}