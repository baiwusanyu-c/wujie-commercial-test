import { createRouter, createWebHashHistory } from 'vue-router'
// const comView = import.meta.glob('../views/**/.', {
//   eager: true, // 是否关闭模块动态导入() => import('/src/views/**/page.js')
//   import: 'default', // 将模块导入default值作为导出值
// })
import SystemLayout from '@/views/system/layout/index.vue'
export const constantRoutes = [
  {
    path: '',
    redirect: '/home',
    name: 'index',
  },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    name: 'home',
  },
  {
    path: '/board',
    component: () => import('../views/board/index.vue'),
    name: 'Board',
  },
  {
    path: '/label-tank',
    component: () => import('../views/user-tower/index.vue'),
    name: 'LabelTank',
    redirect: '/internal-menu',
    children: [
      {
        path: '/internal-menu',
        component: () => import('../views/user-tower/internal-menu.vue'),
        name: 'internal-menu',
      },
      {
        path: '/user-tower',
        component: () => import('../views/user-tower/user-tower.vue'),
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
      {
        path: '/regional-daily',
        component: () => import('../views/user-tower/regional-daily.vue'),
        name: 'regional-daily',
      },
    ],
  },
  {
    path: '/system',
    component: SystemLayout,
    name: 'system',
    redirect: '/welcome',
    meta: { title: '内部管理系统' },
    children: [
      {
        path: '/welcome',
        component: () => import('../views/system/home/index.vue'),
        name: 'welcome',
        meta: { title: '欢迎页', icon: 'home' },
      },
      {
        path: '/user-manage',
        component: () => import('../views/system/user/user-manage/index.vue'),
        name: 'user-manage',
        meta: { title: '用户管理', icon: 'user' },
      },
      {
        path: '/',
        name: 'tools',
        meta: { title: '工具', icon: 'tool' },
        children: [
          {
            path: 'tools/upload',
            component: () => import('../views/system/tools/upload/index.vue'),
            name: 'upload',
            meta: { title: '文件上传', icon: 'upload' },
          },
          {
            path: 'tools/upload-record',
            component: () => import('../views/system/tools/upload/upload-record.vue'),
            name: 'upload-record',
            hidden: true,
            meta: { title: '上传记录' },
          },
          {
            path: 'tools/warning',
            component: () => import('../views/system/tools/warning/index.vue'),
            name: 'warning',
            meta: { title: '业务预警', icon: 'warning' },
          },
          {
            path: 'tools/echarts',
            component: () => import('../views/system/tools/echarts/index.vue'),
            name: 'echarts',
            meta: { title: '图表', icon: 'warning' },
          },
        ],
      },
    ],
  },
  {
    path: '/vform3',
    component: () => import('../views/vform3/index.vue'),
    name: 'vform3',
  },
  {
    path: '/test',
    component: () => import('../views/test/index.vue'),
    name: 'test',
  },
  {
    path: '/test/swiper',
    component: () => import('../views/test/swiper.vue'),
    name: 'swiper',
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes,
})

export const getSystemRoutes = () => {
  return constantRoutes.find(v => v.name === 'system')
}
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
})
export default router
