<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'

interface Props {
  prefix?: string
  iconClass: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
})
const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
