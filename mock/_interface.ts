/** 路由 */
export interface Route {
  component: string
  hidden: boolean
  meta: {
    title: string
    icon: string
    noCache: boolean
    link: string | null
  }
  name: string
  path: string
  alwaysShow?: true
  redirect?: string
  children?: Route[]
}
declare type Recordable<T = any> = Record<string, T>;
export interface Response{
  url: Recordable;
  body: Recordable;
  query: Recordable;
  headers: Recordable;
}

/** 接口响应结果 */
export interface ResponseResult<T = any> {
  code: number
  data: T
  msg: string
  traceId: string
}