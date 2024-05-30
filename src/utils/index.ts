import type { MenuListItem, SFCWithInstall } from './interface'

export function authRouter(treeData: MenuListItem[], path: string) {
  let res
   const data = (value: MenuListItem[]) => {
    value.forEach((v) => {
      if (v.path === path) {
        res = v
      } else {
        data(v.children || [])
      }
    })
   }
   data(treeData)
   return res
}

export function withInstall<T, E extends Record<string, any>>(main: T, extra?: E) {
  (main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})])
      app.component(comp.name, comp)
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra))
      (main as any)[key] = comp
  }
  return main as SFCWithInstall<T> & E
}

// 表单重置
export function resetForm(refName: string) {
  if (this.$refs[refName]) this.$refs[refName].resetFields()
}

/**
 * 处理路径
 * @param {string} p
 * @returns 返回正确路径
 */
export function getNormalPath(p: string) {
  if (p.length === 0 || !p || p === 'undefined') return p

  const res = p.replace('//', '/')
  if (res[res.length - 1] === '/') return res.slice(0, res.length - 1)

  return res
}

/**
 * 根据下载链接下载文件
 * @param {string} url
 */
export function downloadFile(url: string) {
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.click()
}