
import type { RouterOptions } from 'vue-router'
import type { constantRoutes } from '..'
export interface routerArray extends RouterOptions {
  children: Array<any>
  component?: any
  redirect: string
  path: string
  permissions: Array<string>
  roles?: Array<string>
  hidden?: boolean
}
export declare type routerArrayType = typeof constantRoutes

export interface ITagView {
  name: string
  path: string
  fullPath: string
  meta: {
    title?: string
    affix?: boolean
    noCache?: boolean
  }
}

/** 路由配置项类型 */
export interface RouteItem {
  /** 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题 */
  name: string
  /** 路由地址 */
  path: string
  meta?: {
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
  /** 组件路径从view文件向下查找 例如：test/index，默认支持 'Layout' | 'ParentView' | 'InnerLink' */
  component: string
  children?: RouteItem[]
  /** 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1 */
  hidden?: boolean
  /**
   * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
   * 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
   * 若你想不管路由下面的 children 声明的个数都显示你的根路由
   * 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
  */
  alwaysShow?: boolean
  /** 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击 */
  redirect?: string
  /** 访问路由的默认传递参数 */
  query?: Object
  /** 访问路由的角色权限 */
  roles?: string[]
  /** 访问路由的菜单权限 */
  permissions?: string[]
}

export declare type RoutesType = Readonly<RouteItem[]>
