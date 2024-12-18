<template>
  <div>
    <el-input
      class="p12px"
      style="border-bottom: 1px solid #d8dfeb"
      v-model="searchInputValue"
      placeholder="输入查找的内容"
      @input="handleInput"
    >
      <template #suffix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    <div class="flex items-center">
      <div class="cascader-menu">
        <div class="bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px">{{ titles[0] }}</div>
        <div class="p4px w180px">
          <div v-for="node in nodes" class="flex items-center justify-between" :key="node.value">
            <el-checkbox class="ml8px mr6px!" v-model="node.checked" :disabled="isDisabled" />
            <span class="flex-1">{{ node.label }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      <div class="cascader-menu">
        <div class="bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px">{{ titles[1] }}</div>
        <div class="p4px w180px">
          <div v-for="node in nodesTwo" class="flex items-center justify-between" :key="node.value">
            <el-checkbox class="ml8px mr6px!" v-model="node.checked" :disabled="isDisabled" />
            <span class="flex-1">{{ node.label }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      <div class="cascader-menu">
        <div class="bg-#E9EDF7 color-#8D97A8 text-12px px8px leading-24px">{{ titles[2] }}</div>
        <div class="p4px w180px">
          <div v-for="node in nodesThree" class="flex items-center justify-between" :key="node.value">
            <el-checkbox class="ml8px mr6px!" v-model="node.checked" :disabled="isDisabled" />
            <span class="flex-1">{{ node.label }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { debounce as debounces } from 'lodash-unified'

interface CascaderPanelProps {
  titles: string[]
  debounce?: number
}
const props = withDefaults(defineProps<CascaderPanelProps>(), {
  debounce: 1000,
})

const searchInputValue = ref('')
const treeData = ref([
  {
    label: '111',
    value: '1',
    checked: false,
    children: [
      {
        label: '111-1',
        value: '1-1',
        checked: false,
        children: [
          { label: '111-1-1', value: '1-1-1', checked: false },
          { label: '111-1-2', value: '1-1-2', checked: false },
        ],
      },
      { label: '111-2', value: '1-2', checked: false, children: [] },
    ],
  },
  {
    label: '222',
    value: '2',
    checked: false,
    children: [
      { label: '222-1', value: '2-1', checked: false, children: [] },
      {
        label: '222-2',
        value: '2-2',
        checked: false,
        children: [
          { label: '222-2-1', value: '2-2-1', checked: false },
          { label: '222-2-2', value: '2-2-2', checked: false },
        ],
      },
    ],
  },
])

const nodes = computed(() => {
  return treeData.value
})
const nodesTwo = computed(() => {
  return treeData.value[0].children
})
const nodesThree = computed(() => {
  return treeData.value[0]?.children[0]?.children || []
})
const isDisabled = computed(() => false)

const handleFilter = debounces(() => {
  const { value } = searchInputValue
  if (!value) return
}, props.debounce)
const handleInput = (val: string, e?: KeyboardEvent) => {
  console.log(e)
  val && handleFilter()
}

watch(
  () => treeData.value,
  () => {
    console.log('data>>>>', treeData.value)
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.cascader-menu {
  border-right: 1px solid #d8dfeb;
}
.cascader-menu:last-child {
  border-right: none;
}
</style>
