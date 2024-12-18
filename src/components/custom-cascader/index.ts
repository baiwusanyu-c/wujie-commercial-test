import { withInstall } from '@/utils'
import Cascader from './src/cascader.vue'
import type { SFCWithInstall } from '@/utils/interface'

export const CustomCascader: SFCWithInstall<typeof Cascader> = withInstall(Cascader)

export default CustomCascader
export * from './src/instances'
