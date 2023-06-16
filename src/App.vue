<script setup lang="ts">
// import { watchEffect } from 'vue'
import { useRequest } from '@/hooks/use-request'
import { getCupShapeds } from '@/api/user'
import HelloWorld from '@/components/hello-world/index.vue'
import type { User } from '@/api/interface'
console.log('111', Date.now())
const { loading, data } = useRequest<User.ResCupShapeds>(getCupShapeds(), [])
</script>

<template>
  <HelloWorld v-loading="loading" msg="Vite@4.3.5 + Vue@3.3" :list="data">
    <template #content="scope">
      <span :style="{ color: scope.item.color }">{{ scope.item.value }}</span>
    </template>
  </HelloWorld>
  <div class="header">撒比，大撒比！</div>
</template>
