import { withInstall } from '@/utils'
import pageWrapper from './src/page-wrapper.vue'

export const PageWrapper = withInstall(pageWrapper)
export default PageWrapper

export type PageWrapperInstance = InstanceType<typeof pageWrapper>
