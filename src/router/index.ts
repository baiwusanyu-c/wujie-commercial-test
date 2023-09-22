import { createRouter, createWebHashHistory } from 'vue-router'

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
    {
      path: '/demo',
      component: () => import('../views/demo/index.vue'),
      name: 'Demo',
    },
    {
      path: '/pre-stringing',
      component: () => import('../views/pre-stringing/index.vue'),
      name: 'pre-stringing',
    },
    {
      path: '/error',
      component: () => import('../views/error/index.vue'),
      name: 'error',
      meta: { capture: true },
    },
  ],
})

export default router
