/*
 * @Author: liyang1
 * @Date: 2023-09-04 17:09:18
 * @LastEditTime: 2024-05-28 14:10:22
 * @LastEditors: liyang
 * @Description: 自定义全局组件
 */
import { type App } from 'vue'
import { SvgIcon, Pagination } from '@/components'
import 'virtual:svg-icons-register'

export function loadUI(app: App) {
  app.use(SvgIcon)
  app.use(Pagination)
}
