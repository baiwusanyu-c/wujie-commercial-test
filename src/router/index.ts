import { createRouter, createWebHashHistory } from 'vue-router'
// import { ElMessage } from 'element-plus'
// import axios from 'axios'

// const comView = import.meta.glob('../views/**/.', {
//   eager: true, // 是否关闭模块动态导入() => import('/src/views/**/page.js')
//   import: 'default', // 将模块导入default值作为导出值
// })
const router = createRouter({
  history: createWebHashHistory('user-tower'),
  routes: [
    {
      path: '',
      redirect: '/test',
      name: 'home',
    },
    {
      path: '/test',
      component: () => import('../views/test/index.vue'),
      name: 'Test',
    },
  ],
})
// // 版本监控
// const versionCheck = async () => {
//   if (import.meta.env.VITE_APP_ENV === 'development') return
//   const response = await axios.get('version.json')
//   if (String(process.env.VITE__APP_VERSION__) !== response.data.version) {
//     ElMessage({
//       message: '发现新内容，自动更新中...',
//       type: 'success',
//       showClose: true,
//       duration: 1500,
//       onClose: () => {
//         window.location.reload()
//       },
//     })
//   }
// }
router.beforeEach(async () => {
  // await versionCheck()
})
export default router
