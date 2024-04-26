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
import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import {  ref, onUnmounted } from 'vue'
import useStoreUser from '@/store/modules/user'

const wujieVueRef = ref()

const { destroyApp } = WujieVue
const storeUser = useStoreUser()
const props = {
  ...genCrowdParams('DEV', storeUser.phoneNumber, storeUser.brand as any, '/label-manage/user-label' as any),
  // url: 'http://192.168.124.130:3012/user-tower/auth-redirect',
  scrollElement() {
    return document.querySelector('.container')
  },
}

console.log('用户标签props：', props)
onUnmounted(() => {
  destroyApp('user-label')
})
</script>
