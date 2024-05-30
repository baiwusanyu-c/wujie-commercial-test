/// <reference types="element-plus/global" />
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof import('@/components')['SvgIcon']
    Pagination: typeof import('@/components')['Pagination']
    PageWrapper: typeof import('@/components')['PageWrapper']
    Upload: typeof import('@/components')['Upload']
  }
  interface ComponentCustomProperties {
    $resetForm: typeof import('@/utils')['resetForm']
  }
}

export {}
