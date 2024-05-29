<template>
  <div ref="pageWrapperRef" :class="getClass">
    <div class="page-wrapper__header">
      <div class="page-wrapper__title">
        <span />
        <span>{{ title }}</span>
      </div>
      <div class="page-wrapper__tool">
        <slot name="toolButton" />
      </div>
    </div>
    <div class="page-wrapper__body"><slot /></div>
  </div>
</template>

<script setup lang="ts" name="PageWrapper">
import { computed, ref } from 'vue'
defineProps<{ title: string }>()
const prefixCls = 'page-wrapper'
const pageWrapperRef = ref()
const getClass = computed(() => {
  return [prefixCls]
})
</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
}
.page-wrapper__header {
  padding: 16px;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  align-items: center;
}
.page-wrapper__title {
  font-size: 18px;
  font-weight: 600;
  font-style: normal;
  line-height: 20px;
  color: #1d2129;
  display: flex;
  align-items: center;
  span:first-child {
    width: 5px;
    height: 16px;
    border-radius: 2px;
    background-color: var(--el-color-primary);
    margin-right: 8px;
  }
}
.page-wrapper__tool {
  margin-left: auto;
}
.page-wrapper__body {
  padding: 16px;
}
</style>
