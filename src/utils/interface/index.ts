import type { FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils'
/** 接口响应结果 */
export interface ResponseResult<T = any> {
  code: number
  data: T
  msg: string
  traceId: string
}

/** el-form 表单规则校验类型 */
export type FormRules<T extends string> = Record<T, Arrayable<FormItemRule> | undefined>