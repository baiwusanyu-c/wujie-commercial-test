<template>
  <div ref="echartsRef" style="width: 100%; height: 100%" />
</template>

<script setup lang="ts" name="LyEcharts">
import { onMounted, ref, watch } from 'vue'
import { useECharts } from '@/hooks/use-e-charts'
import type { EChartsOption } from './echarts'

interface EchartsProps {
  option?: EChartsOption
}
const props = defineProps<EchartsProps>()
const echartsRef = ref<HTMLElement>()
const { setOptions } = useECharts(echartsRef, 'default', { renderer: 'svg' })
onMounted(() => {
  setOptions(props.option)
})
watch(
  () => props.option,
  (val) => {
    setOptions(val)
  },
)
</script>
