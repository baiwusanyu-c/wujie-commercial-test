/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 环境变量 */
  readonly VITE_APP_ENV: 'development' | 'production' | 'staging'
  /** 系统标题 */
  readonly VITE_APP_TITLE: string
  /** 公共基础路径 */
  readonly VITE_PUBLIC_PATH: string
  /** 打包压缩 */
  readonly VITE_BUILD_COMPRESS: 'gzip' | 'brotli'
  /** OSS上传地址 */
  readonly VITE_APP_OSS_API: string
  /** 环境地址 */
  readonly VITE_APP_BASE_API: string
  readonly VITE__APP_VERSION__: string
}
