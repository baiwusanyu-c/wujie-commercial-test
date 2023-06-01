/// <reference types="vite/client" />
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    interface Vue {}
    const component: DefineComponent<{}, {}, Vue, any>
    export default component
  }
  