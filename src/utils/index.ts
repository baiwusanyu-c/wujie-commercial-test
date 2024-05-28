import type { MenuListItem, SFCWithInstall } from './interface'

export function doHandleMonth(month: number) {
  let m = month as any
  if (month.toString().length === 1) m = `0${month}`
  return m
}

export function getYearMonthDate(day = 0, twoPeople = true) {
  const today = new Date()
  const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  const year = today.getFullYear()
  let month = today.getMonth() + 1
  let date = today.getDate()
  let hour = today.getHours()
  let minute = today.getMinutes()
  let second = today.getSeconds()
  if (twoPeople) {
    month = doHandleMonth(month)
    date = doHandleMonth(date)
    hour = doHandleMonth(hour)
    minute = doHandleMonth(minute)
    second = doHandleMonth(second)
  }
  return { year, month, date, hour, minute, second }
}

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