import * as fs from 'fs'
import * as path from 'path'
import type { Plugin } from 'vite'
interface OptionVersion {
  viteEnv: ImportMetaEnv
  version: string
}
interface configObj extends Object {
  publicDir: string
  root: string
  rawBase?: string
}

// const writeVersion = (versionFileName: string, content: string | NodeJS.ArrayBufferView) => {
//   // 写入文件
//   fs.writeFile(versionFileName, content, (err) => {
//     if (err) throw err
//   })
// }

export default function (options: OptionVersion): Plugin {
  const { version } = options
  let config: configObj = { publicDir: '', root: '' }
  return {
    name: 'version-update',
    configResolved(resolvedConfig: configObj) {
      // 存储最终解析的配置
      config = resolvedConfig
    },
    buildStart() {
      // // 生成版本信息文件路径
      // const file = config.publicDir + path.sep + 'version.json'
      // // 这里使用编译时间作为版本信息
      // const content = JSON.stringify({ version: options.version })
      // if (fs.existsSync(config.publicDir)) {
      //   writeVersion(file, content)
      // } else {
      //   fs.mkdir(config.publicDir, (err) => {
      //     if (err) throw err
      //     writeVersion(file, content)
      //   })
      // }

      // const file = config.publicDir + path.sep
      // const content = `getVersion = () => ${version}`
      // fs.writeFile(file + 'no-cache.js', content, (err) => {
      //   if (err) throw err
      // })
      // fs.copyFile(config.root + '/index.html', file + `${version}.html`, () => {
      //   console.log(`index.html复制并且重命名-------${version}.html`)
      // })
    },
    buildEnd() {
      // fs.copyFile(config.root + '/dist/' + 'index.html', config.root + '/dist/' + `${version}.html`, () => {
      //   console.log(`index.html复制并且重命名-------${version}.html`)
      // })
    },
    transformIndexHtml: {
      enforce:'pre',
      async transform(html, ctx) {
        console.log('=====', html)
      },
    },
  }
}
