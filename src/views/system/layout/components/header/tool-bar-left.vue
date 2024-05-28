<template>
  <div class="tool-bar-lf">
    <CollapseIcon id="collapseIcon" />
    <Breadcrumb />
  </div>
</template>

<script setup lang="ts">
import CollapseIcon from './components/collapseIcon.vue'
import Breadcrumb from './components/breadcrumb.vue'
</script>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>