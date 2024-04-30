import VForm3 from 'vform3-builds'  
import 'vform3-builds/dist/designer.style.css' 
import { type App } from 'vue'

export function loadVForm3(app: App) {
  app.use(VForm3)
}
