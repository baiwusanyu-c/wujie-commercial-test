import type { ResponseResult } from './_interface'

export function resultSuccess<T = any>(data: T, { msg = '请求成功' } = {}): ResponseResult {
  return {
    code: 200,
    data,
    msg,
    traceId: Date.now().toString(),
  }
}

export function responseResult<T = unknown>({ code = 200, data, msg = '请求成功' }: { code?: number; data?: T; msg?: string }): ResponseResult {
  return {
    code,
    data,
    msg,
    traceId: Date.now().toString(),
  }
}

export function resultUserSuccess<T = any, K = any, E = any>(permissions: T, roles: K, user: E, { msg = '请求成功' } = {}) {
  return {
    code: 200,
    permissions,
    roles,
    user,
    msg,
  }
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min) // 确保min是整数
  max = Math.floor(max) // 确保max是整数
  return Math.floor(Math.random() * (max - min + 1)) + min // 返回介于min和max之间的整数
}
