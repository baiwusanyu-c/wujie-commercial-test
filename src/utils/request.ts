// fetch('./version.json').then((response) => response.json()).then(res => {
//     const version = res.version
//     console.log('xxx', version, )
    
//     let localVersion = localStorage.getItem('version')
//     const url = `${window.location.origin}${window.location.pathname}${version}.html${location.hash}`
//     if(version != localVersion) {
//       localStorage.setItem('version', version)
//     }
//     // window.location.replace(url)
//   }).catch((e) => {
//     console.log('xxxx发发发xx', e)
//   })

import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { AxiosRequestConfig } from 'axios'
import type { ResponseResult } from './interface'

// 是否显示重新登录
export const isRelogin = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 50000,
})

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    return config
  },
  (error: Error) => {
    console.error(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    return Promise.resolve(res.data)
  },
  (error: any) => {
    console.error(`err${error}`)
    let { message } = error
    if (error.code === 'ERR_CANCELED' && (message === 'canceled' || !message))
      return Promise.reject(error)

    if (message === 'Network Error') message = '后端接口连接异常'
    else if (message.includes('timeout')) message = '系统接口请求超时'
    else if (message.includes('Request failed with status code'))
      message = `系统接口${message.substr(message.length - 3)}异常`

    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)
function requestHttp<T = any, R = ResponseResult<T>, D = any>(params: AxiosRequestConfig<D>) {
  return service<T, R, D>(params)
}

const osType = (function () {
  const ua = window.navigator.userAgent
  if (/(Android)/.test(ua)) {
    return 1
  }
  if (/(iPhone|iPad)/.test(ua)) {
    return 2
  }
  return 3
})()
const isProd = process.env.NODE_ENV === 'production'

export const postErrorLogs: (params: {
  errorType: 1 | 2 // 错误类型: 1接口报错 2代码报错
  errorInfo: string
  note?: string
}) => void = (params) => {
  if (!isProd) return
  return requestHttp({
    url: '/api/common/log/error', // 和后端定义接口，错误上报
    method: 'POST',
    data: {
      ...params,
      userInfo: '',
      pageUrl: window.location.href,
      project: 'vite-project',
      terminal: osType,
    },
  })
}

export default requestHttp
