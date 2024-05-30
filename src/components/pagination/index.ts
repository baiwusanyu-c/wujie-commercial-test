import { withInstall } from '@/utils'
import pagination from './src/pagination.vue'

export const LyPagination = withInstall(pagination)
export default LyPagination

export type PaginationInstance = InstanceType<typeof pagination>
