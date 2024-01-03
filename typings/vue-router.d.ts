declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    /** 设置该路由在侧边栏和面包屑中展示的名字 */
    title: string
    /** 如果设置为true，则不会被 <keep-alive> 缓存(默认 false) */
    noCache?: boolean
    /** 设置该路由的图标，对应路径src/assets/icons/svg */
    icon?: string
    /** 如果设置为false，则不会在breadcrumb面包屑中显示 */
    breadcrumb?: boolean
    /** 当路由设置了该属性，则会高亮相对应的侧边栏。 */
    activeMenu?: string
    /** iframe跳转路由 */
    link?: string
    /** 当前页面是否可滚动 */
    isScroll?: boolean
  }
}

export {}
