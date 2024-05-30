/// <reference types="element-plus/global" />
declare module 'vue' {
  export interface GlobalComponents {
    LySvgIcon: typeof import('@/components')['LySvgIcon']
    LyPagination: typeof import('@/components')['LyPagination']
    LyPageWrapper: typeof import('@/components')['LyPageWrapper']
    LyUpload: typeof import('@/components')['LyUpload']
  }
  interface ComponentCustomProperties {
    $resetForm: typeof import('@/utils')['resetForm']
  }
}

export {}
