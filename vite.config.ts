import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { port: 5174 },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     const arr = id.toString().split('node_modules/')[2].split('/')
        //     if(arr.length < 2) {
        //       console.log('=======1111', arr)
        //     }
        //     if(arr.length < 3) {
        //       console.log('=======2222', arr)
        //       return arr[0]
        //     }
        //     if(arr.length === 3) {
        //       console.log('=======3333', arr)
        //       return arr[1]
        //     }
        //     if(arr.length > 3) {
        //       console.log('=======4444', arr)
        //       return arr[2] 
        //     }
        //   }
        // }
      },
    },
  },
})
