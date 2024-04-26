<template>
  <WujieVue
    ref="wujieVueRef"
    width="100%"
    height="100%"
    name="crowd-insight"
    :url="props.url"
    :props="props"
    :plugins="[InstanceofPlugin()]"
  />
</template>

<script lang="ts" setup name="UserLabel">
import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import { ref, onUnmounted } from 'vue'
import useStoreUser from '@/store/modules/user'

const wujieVueRef = ref()

const { destroyApp } = WujieVue
const storeUser = useStoreUser()
const props = {
  ...genCrowdParams('DEV', storeUser.phoneNumber, storeUser.brand as any, `/crowd-insight` as any),
  url: 'http://192.168.124.130:3012/user-tower/auth-redirect',
}
console.log('人群洞察props：', props)
onUnmounted(() => {
  destroyApp('crowd-insight')
})
</script>
