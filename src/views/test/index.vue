<script setup lang="ts">
import { useRequest } from '@/hooks/use-request'
import { getCupShapeds } from '@/api/test'
import HelloWorld from '@/components/hello-world/index.vue'
import Comp from '@/components/slot-component/comp1.vue'
// import Comp from '@/components/slot-component/comp2.vue'

const { loading, data } = useRequest(getCupShapeds(), [])

</script>

<template>
 <HelloWorld v-loading="loading" msg="Vite@4.3.5 + Vue@3.3" :list="data">
    <template #content="scope">
      <span :style="{ color: scope.item.color }">{{ scope.item.value }}</span>
    </template>
  </HelloWorld>
  <Comp>
    <p>default slot</p>
    <template #slot1>
      <p>solt1</p>
    </template>
    <template #slot2="{ msg }">
      <p>solt2：{{ msg }}</p>
    </template>
  </Comp>
</template>

<style scoped>
.gao {
  color: var(--el-color-primary);
}
</style>
