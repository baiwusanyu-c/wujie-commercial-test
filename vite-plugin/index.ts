import vue from '@vitejs/plugin-vue'
// import { createHtmlPlugin } from 'vite-plugin-html'
import imageLimit from './plugins/image-limit'
// import versionUpdatePlugin from './plugins/version-update'
import requireToUrlPlugin from './plugins/requireToUrlPlugin'
export default function createVitePlugins(viteEnv: ImportMetaEnv, isBuild = false, version) {
  const vitePlugins = [vue(), imageLimit(viteEnv), requireToUrlPlugin()]
  if (isBuild) {
    // vitePlugins.push(versionUpdatePlugin({ viteEnv, version}))
    // vitePlugins.push(
    //   createHtmlPlugin({
    //     minify: true,
    //     pages: [
    //       {
    //         filename: 'index.html',
    //         // entry: '/src/main.ts',
    //         template: 'index.html',
    //       },
    //       {
    //         filename: `${version}.html`,
    //         // entry: '/src/main.ts',
    //         template: 'index.html',
    //       },
    //     ],
    //   }),
    // )
  }
  // if (viteEnv.VITE_APP_ENV !== 'development') vitePlugins.push(versionUpdatePlugin({ viteEnv, version}))
  return vitePlugins
}
