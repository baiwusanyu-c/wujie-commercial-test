import { withInstall } from '@/utils'
import pagination from './src/pagination.vue'

export const Pagination = withInstall(pagination)
export default Pagination

export type PaginationInstance = InstanceType<typeof pagination>
