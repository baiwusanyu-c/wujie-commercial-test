import type { FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils'
import type { Plugin } from 'vue'
/** 接口响应结果 */
export interface ResponseResult<T = any> {
  code: number
  data: T
  msg: string
  traceId: string
}

/** el-form 表单规则校验类型 */
export type FormRules<T, K extends string> = Record<keyof Omit<T, K>, Arrayable<FormItemRule> | undefined>

/** 自定义请求 */
export type RequestApi<T = null, D = any> = T extends null ? () => Promise<ResponseResult<D>> : (params: T) => Promise<ResponseResult<D>>
export interface MenuListItem {
  id: string
  label: string
  path: string
  name: string
  meta: { title: string }
  children?: MenuListItem[]
}

export type SFCWithInstall<T> = T & Plugin

export interface IPageParams {
  pageNo: number
  pageSize: number
  total: number
}
