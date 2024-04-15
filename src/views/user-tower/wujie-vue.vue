<template>
  <WujieVue ref="wujieVueRef" width="100%" height="100%" name="user-tower" :url="props.url" :props="props" :plugins="[InstanceofPlugin()]" />
</template>

<script lang="ts" setup name="UserTower">
import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from "wujie-polyfill"
import { ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const wujieVueRef = ref()
const storeUser = useStoreUser()
const phoneNumber = route.query.phoneNumber || '18228329236'
const { destroyApp, bus } = WujieVue
// const brand = inject<Ref<'tea' | 'coffee'>>('brand', ref('tea'))

const props = {
  ...genCrowdParams('DEV', route.query.phoneNumber as any, storeUser.brand as any, '/crowd'),
  // url: 'http://192.168.124.130:3012/user-tower/auth-redirect',
  // variableParams() {
  //   return { brand: storeUser.brand }
  // },
}
console.log('props：', props)

bus.$on('__USER_TOWER_OSP_INSIGHT', () => {
  router.push(`/crowd-insight?phoneNumber=${phoneNumber}`)
})
onUnmounted(() => {
  bus.$clear()
  destroyApp('user-tower')
})
</script>
