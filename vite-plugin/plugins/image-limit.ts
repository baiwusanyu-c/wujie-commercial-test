import * as fs from 'fs'
import type { Plugin } from 'vite'

export default function imageLimit(viteEnv: ImportMetaEnv, limit = 4096): Plugin {
  return {
    name: 'image-limit',
    async transform(code: string, id: string) {
      if (viteEnv.VITE_APP_ENV !== 'development') return
      if (!id.endsWith('.png')) return
      const stat = await fs.promises.stat(id)
      if (stat.size > limit) return
      const buffer = await fs.promises.readFile(id)
      const base64 = buffer.toString('base64')
      const baseUrl = `data:image/png;base64,${base64}`
      return {
        code: `export default "${baseUrl}"`
      }
    },
  }
}
