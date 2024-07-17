<template>
  <WujieVue
    ref="wujieVueRef"
    width="100%"
    height="100%"
    name="regional-daily"
    :url="props.url"
    :props="props"
    :plugins="[InstanceofPlugin()]"
  />
</template>

<script lang="ts" setup name="UserLabel">
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import { ref, onUnmounted } from 'vue'

const wujieVueRef = ref()

const { destroyApp } = WujieVue
const props = {
  // url: 'http://192.168.125.241:3013/data-dashboard-web/regional-daily',
  url: 'https://datadashboard-dev.shuxinyc.com/data-dashboard-web/regional-daily',
  parentName: 'dpw',
  userInfo: {
    accountNm: 'liyang',
    jobNumber: '1000004235',
    name: '李洋',
  },
}

onUnmounted(() => {
  destroyApp('regional-daily')
})
</script>
