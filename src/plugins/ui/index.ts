/*
 * @Author: liyang1
 * @Date: 2023-09-04 17:09:18
 * @LastEditTime: 2024-07-09 14:52:22
 * @LastEditors: liyang
 * @Description: 自定义全局组件
 */
import { type App } from 'vue'
import { LySvgIcon, LyPagination, LyPageWrapper, LyUpload, LyEcharts } from '@/components'
import 'virtual:svg-icons-register'

export function loadUI(app: App) {
  app.use(LySvgIcon)
  app.use(LyPagination)
  app.use(LyPageWrapper)
  app.use(LyUpload)
  app.use(LyEcharts)
}
