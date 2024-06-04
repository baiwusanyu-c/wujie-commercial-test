<script lang="ts" setup name="LyPagination">
import { computed } from 'vue'
import { scrollTo } from '@/utils/scroll-to'

interface PaginationProps {
  total: number
  page?: number
  limit?: number
  pageSizes?: number[]
  pagerCount?: number
  layout?: string
  background?: boolean
  autoScroll?: boolean
  disabled?: boolean
  hidden?: boolean
}
const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  limit: 20,
  pageSizes: () => [10, 20, 30, 50],
  pagerCount: document.body.clientWidth < 992 ? 5 : 7,
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  autoScroll: true,
  disabled: false,
  hidden: false,
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  },
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  },
})
function handleSizeChange(val: number) {
  if (currentPage.value * val > props.total) currentPage.value = 1

  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) scrollTo(0, 800)
}
function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) scrollTo(0, 800)
}
</script>

<template>
  <div :class="{ hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :disabled="disabled"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.pagination-container {
  padding: 16px 0;
  display: flex;
  justify-content: end;
}
.pagination-container.hidden {
  display: none;
}
</style>
