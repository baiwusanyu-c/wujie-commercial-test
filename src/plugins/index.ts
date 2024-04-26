import { type App } from 'vue'
import { loadElementPlus } from './element-plus'
import { loadUI } from './ui'

export default function loadPlugins(app: App) {
  loadElementPlus(app)
  loadUI(app)
}