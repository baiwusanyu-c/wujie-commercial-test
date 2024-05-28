/// <reference types="element-plus/global" />
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof import('@/components')['SvgIcon']
    Pagination: typeof import('@/components')['Pagination']
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ComponentCustomProperties {
    $resetForm: typeof import('@/utils')['resetForm']
  }
}

export {}
