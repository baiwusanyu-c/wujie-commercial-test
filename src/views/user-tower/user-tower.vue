<template>
  <WujieVue
    ref="wujieVueRef"
    width="100%"
    height="100%"
    name="user-tower"
    :url="props.url"
    :props="props"
    :plugins="[InstanceofPlugin()]"
  />
</template>

<script lang="ts" setup name="UserTower">
import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { authRouter } from '@/utils'

const router = useRouter()
const wujieVueRef = ref()
const storeUser = useStoreUser()
const { destroyApp, bus } = WujieVue
const props = {
  ...genCrowdParams('DEV', storeUser.phoneNumber, storeUser.brand as any, '/crowd'),
  authInsight: !!authRouter(storeUser.menuList, '/crowd-insight'),
  // url: 'http://192.168.125.52:3012/user-tower/auth-redirect',
}
console.log('props：', props)

bus.$on('__USER_TOWER_OSP_INSIGHT', () => {
  router.push(`/crowd-insight`)
})
onUnmounted(() => {
  bus.$clear()
  destroyApp('user-tower')
})
</script>
