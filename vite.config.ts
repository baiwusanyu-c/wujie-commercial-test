import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import createVitePlugins from './vite-plugin'
import { getYearMonthDate } from './src/utils/vite'

const { month, date, hour, minute } = getYearMonthDate(0, false)
const assetsDir = `${month}.${date}.${hour}_${minute}`

const ENV_FILE_NAME = 'env'
// 打包时获取版本信息
const CurrentTimeVersion = Date.now()
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, `${process.cwd()}/${ENV_FILE_NAME}`) as unknown as ImportMetaEnv
  return {
    base: env.VITE_PUBLIC_PATH,
    define: {
      // 定义全局变量
      'process.env.VITE__APP_VERSION__': CurrentTimeVersion,
    },
    plugins: createVitePlugins(env, command === 'build', CurrentTimeVersion),
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: { port: 5170 },
    envDir: `./${ENV_FILE_NAME}/`,
    css: {
      devSourcemap: true,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') atRule.remove()
              },
            },
          },
        ],
      },
    },
    build: {
      sourcemap: !(env.VITE_APP_ENV === 'production'),
      minify: true,
      assetsDir,
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: `js/[name]-[hash]-20240105.js`, // 引入文件名的名称
      //     entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
      //     assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
      //     manualChunks(id) {
            
      //       if (id.includes('.html')) {
      //         console.log('9999', id)
      //         return `${CurrentTimeVersion}`
      //       }
      //     }
      //     // manualChunks(id) {
      //     //   if (id.includes('node_modules')) {
      //     //     const arr = id.toString().split('node_modules/')[2].split('/')
      //     //     if(arr.length < 2) {
      //     //       console.log('=======1111', arr)
      //     //     }
      //     //     if(arr.length < 3) {
      //     //       console.log('=======2222', arr)
      //     //       return arr[0]
      //     //     }
      //     //     if(arr.length === 3) {
      //     //       console.log('=======3333', arr)
      //     //       return arr[1]
      //     //     }
      //     //     if(arr.length > 3) {
      //     //       console.log('=======4444', arr)
      //     //       return arr[2]
      //     //     }
      //     //   }
      //     // }
      //   },
      // },
    },
  }
})