import { Canceler, AxiosResponse } from 'axios'
import { ComputedRef, WatchSource, Ref } from 'vue'

export interface Response<T> {
  code: number
  data: T
  msg: string
}
export type AppAxiosResponse<T = any> = AxiosResponse<Response<T>>
export interface RequestResponse<T> {
  instance: Promise<AppAxiosResponse<T>>
  cancel: Ref<Canceler | undefined>
}
export type Service<T, P extends any[]> = (...args: P) => RequestResponse<T>
export interface Options<T, P extends any[]> {
  // 是否手动发起请求
  manual?: boolean
  // 当 manual 为false时，自动执行的默认参数
  defaultParams?: P
  // 依赖项更新
  refreshDeps?: WatchSource<any>[]
  refreshDepsParams?: ComputedRef<P>
  // 是否关闭重复请求，当queryKey存在时，该字段无效
  repeatCancel?: boolean
  // 重试次数
  retryCount?: number
  // 重试间隔时间
  retryInterval?: number
  // 并发请求
  queryKey?: (...args: P) => string
  // 成功回调
  onSuccess?: (response: AxiosResponse<Response<T>>, params: P) => void

  // 失败回调
  onError?: (err: ErrorData, params: P) => void
}
export interface IRequestResult<T> {
  data: T | null
  loading: boolean
  cancel: Canceler
  err?: ErrorData
}
export interface ErrorData<T = any> {
  code: number | string
  data: T
  msg: string
}
