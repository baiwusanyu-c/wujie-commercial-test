import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import errorCode from './error-code'
import cache from './cache'
import { stringifyParams } from './index'
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
  (config) => {
    // 是否需要防止数据重复提交
    const isRepeatSubmit = config.headers?.RepeatSubmit === false

    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = `${config.url}?${stringifyParams(config.params)}`
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      }
      const reqTimestamp = cache.session.getJSON('REQUEST_TIMESTAMP')
      if (reqTimestamp === undefined || reqTimestamp === null || reqTimestamp === '') {
        cache.session.setJSON('REQUEST_TIMESTAMP', requestObj)
      } else {
        const sUrl = reqTimestamp.url // 请求地址
        const sData = reqTimestamp.data // 请求数据
        const sTime = reqTimestamp.time // 请求时间
        const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
        if (
          !(config.params && config.params.complicating)
          && sData === requestObj.data
          && requestObj.time - sTime < interval
          && sUrl === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交'
          console.warn(`[${sUrl}]: ${message}`)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('REQUEST_TIMESTAMP', requestObj)
        }
      }
    }
    return config
  },
  (error) => {
    console.error(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code as keyof typeof errorCode] || res.data.msg || errorCode.default
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer')
      return res.data

    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            isRelogin.show = false
            // 退出登录。。。跳转登录页
            cache.clear()
            location.href = `${import.meta.env.VITE_PUBLIC_PATH}login`
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'))
    } else if (code === 500) {
      ElMessage({
        message: msg,
        type: 'error',
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElMessage({
        message: msg,
        type: 'error',
      })
      return Promise.reject(new Error('error'))
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    let { message } = error
    if (error.code === 'ERR_CANCELED' && (message === 'canceled' || !message))
      return Promise.reject(error)

    if (message === 'Network Error')
      message = '后端接口连接异常'
    else if (message.includes('timeout'))
      message = '系统接口请求超时'
    else if (message.includes('Request failed with status code'))
      message = `系统接口${message.substr(message.length - 3)}异常`

    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

export default function requestHttp<T = any, R = ResponseResult<T>, D = any>(params: AxiosRequestConfig<D>) {
  return service<T, R, D>(params)
}
