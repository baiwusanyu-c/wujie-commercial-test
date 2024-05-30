export function resultSuccess<T = any>(data: T, { msg = '请求成功' } = {}) {
  return {
    code: 200,
    data,
    msg,
  }
}

export function resultUserSuccess<T = any, K = any, E = any>(
  permissions: T,
  roles: K,
  user: E,
  { msg = '请求成功' } = {},
) {
  return {
    code: 200,
    permissions,
    roles,
    user,
    msg,
  }
}
