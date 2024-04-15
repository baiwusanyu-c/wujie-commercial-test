<script setup lang="ts">
import { ref } from 'vue'
// import { useRequest } from '@/hooks/use-request'
// import { getCupShapeds } from '@/api/user'
// import HelloWorld from '@/components/hello-world/index.vue'
// import Comp from '@/components/slot-component/comp1.vue'
// import Comp from '@/components/slot-component/comp2.vue'
// import type { User } from '@/api/interface'
import { useRoute, useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'

const storeUser = useStoreUser()
const route = useRoute()
const router = useRouter()
const phoneNumber = route.query.phoneNumber || '18228329236'
// const { loading, data } = useRequest<User.ResCupShapeds>(getCupShapeds(), [])
const go = () => {
  router.push(`/user-tower?phoneNumber=${phoneNumber}`)
}
const brandvalue = ref<'tea' | 'coffee'>('tea')
const handleChange = (brand: 'tea' | 'coffee') => {
  brandvalue.value = brand
  storeUser.setBrand(brand)
}
</script>

<template>
  <!-- <HelloWorld v-loading="loading" msg="Vite@4.3.5 + Vue@3.3" :list="data">
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
  </Comp> -->
  <!-- <div class="header"><RouterLink to="board">跳转至看板</RouterLink></div> -->
  <div style="padding: 100px"><el-button type="primary" @click="go">策略实验室</el-button></div>
  <!-- <div>
    <div :class="`${brandvalue === 'tea' && 'gao'}`" @click="handleChange('tea')">茶白道</div>
    <div :class="`${brandvalue === 'coffee' && 'gao'}`" @click="handleChange('coffee')">咖灰</div>
  </div> -->
</template>

<style scoped>
.gao {
  color: var(--el-color-primary);
}
</style>
