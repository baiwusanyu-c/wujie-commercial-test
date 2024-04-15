import { createRouter, createWebHashHistory } from 'vue-router'

// const comView = import.meta.glob('../views/**/.', {
//   eager: true, // 是否关闭模块动态导入() => import('/src/views/**/page.js')
//   import: 'default', // 将模块导入default值作为导出值
// })
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: [
    {
      path: '',
      redirect: '/home',
      name: 'index',
    },
    {
      path: '/home',
      component: () => import('../views/test/index.vue'),
      name: 'home',
    },
    {
      path: '/board',
      component: () => import('../views/board/index.vue'),
      name: 'Board',
    },
    {
      path: '/user-tower',
      component: () => import('../views/user-tower/index.vue'),
      name: 'UserTower',
      redirect: '/user-tower',
      children: [
        {
          path: '/user-tower',
          component: () => import('../views/user-tower/wujie-vue.vue'),
          name: 'user-tower',
        },
        {
          path: '/config',
          component: () => import('../views/user-tower/config.vue'),
          name: 'config',
        },
        {
          path: '/user-label',
          component: () => import('../views/user-tower/user-label.vue'),
          name: 'user-label',
        },
        {
          path: '/crowd-insight',
          component: () => import('../views/user-tower/crowd-insight.vue'),
          name: 'crowd-insight',
        },
      ],
    },
  ],
})
// 版本监控
// const versionCheck = async () => {
//   if (import.meta.env.VITE_APP_ENV === 'development') return
//   let localVersion = localStorage.getItem('version')
//   if (localVersion != process.env.VITE__APP_VERSION__) {
//     localStorage.setItem('version', process.env.VITE__APP_VERSION__ as string)
//     window && window.location.reload()
//   }
// }

router.beforeEach(async () => {
  // await versionCheck()
  localStorage.setItem('username', 'jiangxuelian')
})
export default router
