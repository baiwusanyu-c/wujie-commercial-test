
/** 接口响应结果 */
export interface ResponseResult<T = any> {
  code: number
  data: T
  msg: string
  traceId: string
}
