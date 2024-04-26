/// <reference types="element-plus/global" />
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof import('@/components')['SvgIcon']
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ComponentCustomProperties {}
}

export {}
