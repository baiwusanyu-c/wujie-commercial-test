import { withInstall } from '@/utils'
import svgIcon from './src/SvgIcon.vue'

export const LySvgIcon = withInstall(svgIcon)
export default LySvgIcon

export type SvgIconInstance = InstanceType<typeof svgIcon>
