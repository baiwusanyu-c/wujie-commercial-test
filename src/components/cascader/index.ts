import { withInstall } from '@/utils'
import Cascader from './src/cascader.vue'
import type { SFCWithInstall } from '@/utils/interface'

export const ElCascader: SFCWithInstall<typeof Cascader> = withInstall(Cascader)

export default ElCascader
export * from './src/instances'
