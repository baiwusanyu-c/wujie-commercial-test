import Cookies from 'js-cookie'

const sessionCache = {
  set(key: string, value: string) {
    if (!sessionStorage) return

    if (key != null && value != null) sessionStorage.setItem(key, value)
  },
  get(key: string) {
    if (!sessionStorage) return null

    if (key == null) return null

    return sessionStorage.getItem(key)
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) this.set(key, JSON.stringify(jsonValue))
  },
  getJSON(key: string) {
    const value = this.get(key)
    if (value != null) return JSON.parse(value)
  },
  remove(key: string) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  },
}
type LocalCacheName = '__SMART_REPLENISHMENT_TOKEN' | 'SSO_ID_TOKEN'
const localCache = {
  set(key: LocalCacheName, value: string) {
    if (!localStorage) return

    if (key != null && value != null) localStorage.setItem(key, value)
  },
  get(key: LocalCacheName) {
    if (!localStorage) return null

    if (key == null) return null

    return localStorage.getItem(key)
  },
  setJSON(key: LocalCacheName, jsonValue: any) {
    if (jsonValue != null) this.set(key, JSON.stringify(jsonValue))
  },
  getJSON(key: LocalCacheName) {
    const value = this.get(key)
    if (value != null) return JSON.parse(value)
  },
  remove(key: LocalCacheName) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  },
}

const cookieCache = {
  get(name: string) {
    return Cookies.get(name)
  },
  set(name: string, token: string) {
    return Cookies.set(name, token)
  },
  remove(name: string) {
    return Cookies.remove(name)
  },
}

export default {
  /**
   * 会话级缓存
   */
  session: sessionCache,
  /**
   * 本地缓存
   */
  local: localCache,
  cookie: cookieCache,
  /** 清除 sessionStorage 和 localStorage数据 和 cookie数据 */
  clear() {
    sessionCache.clear()
    localCache.clear()
  },
}
