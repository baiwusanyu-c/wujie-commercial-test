<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from "./components/hello-world/index.vue";

const list = ref([
  { label: "大杯", value: 1, color: "blue" },
  { label: "中杯", value: 2, color: "pink" },
]);
</script>

<template>
  <HelloWorld msg="Vite@4.3.5 + Vue@3.3" :list="list">
    <template #content="scope">
      <span :style="{ color: scope.item.color }">{{ scope.item.value }}</span>
    </template>
  </HelloWorld>
</template>
