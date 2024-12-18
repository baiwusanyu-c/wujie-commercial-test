<template>
  <WujieVue
    ref="wujieVueRef"
    width="100%"
    height="100%"
    name="user-label"
    :url="props.url"
    :props="props"
    :plugins="[InstanceofPlugin()]"
  />
</template>

<script lang="ts" setup name="UserLabel">
// import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import { ref, onUnmounted } from 'vue'
import useStoreUser from '@/store/modules/user'

const wujieVueRef = ref()

const { destroyApp } = WujieVue
const userStore = useStoreUser()
// const props = {
//   ...genCrowdParams('DEV', userStore.phoneNumber, userStore.brand as any, '/label-manage/user-label' as any),
//   url: 'http://192.168.125.52:3012/user-tower/auth-redirect',
// }

const props = {
  groupId: userStore.groupId,
  brandId: userStore.brandId,
  brandName: userStore.brandName,
  token: userStore.token,
  parentName: 'comm',
  url: userStore.env.value,
  redirectUrl: '/label-manage/user-label',
}

onUnmounted(() => {
  destroyApp('user-label')
})
</script>
