/// <reference types="element-plus/global" />
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof import('@/components')['SvgIcon']
    PageWrapper: typeof import('@/components')['PageWrapper']
  }
  interface ComponentCustomProperties {
    $appInfo: typeof import('@/plugins')['appInfo']
    $echarts: typeof import('@/plugins')['echarts']
  }
}

export {}
