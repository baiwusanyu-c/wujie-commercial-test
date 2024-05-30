import { withInstall } from '@/utils'
import pageWrapper from './src/page-wrapper.vue'

export const LyPageWrapper = withInstall(pageWrapper)
export default LyPageWrapper

export type PageWrapperInstance = InstanceType<typeof pageWrapper>
