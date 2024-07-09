/// <reference types="element-plus/global" />
declare module 'vue' {
  export interface GlobalComponents {
    LySvgIcon: typeof import('@/components')['LySvgIcon']
    LyPagination: typeof import('@/components')['LyPagination']
    LyPageWrapper: typeof import('@/components')['LyPageWrapper']
    LyUpload: typeof import('@/components')['LyUpload']
    LyEcharts: typeof import('@/components')['LyEcharts']
  }
  interface ComponentCustomProperties {
    $resetForm: typeof import('@/utils')['resetForm']
    $echarts: typeof import('@/plugins')['echarts']
  }
}

export {}
