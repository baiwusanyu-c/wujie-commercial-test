<script lang="ts" setup name="internal-menu">
import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { authRouter } from '@/utils'
const showDialog = ref(false)
const cilck = () => {
  showDialog.value = true
}
const router = useRouter()
const wujieVueRef = ref()
const storeUser = useStoreUser()
const { destroyApp, bus } = WujieVue
const props = {
  ...genCrowdParams('DEV', storeUser.phoneNumber, storeUser.brand as any, '/crowd'),
  authInsight: !!authRouter(storeUser.menuList, '/crowd-insight'),
  url: 'http://192.168.125.241:3012/user-tower/auth-redirect',
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

<template>
  <div class="h100% f-c-c bg-#fff">
    不欢迎您，哈哈哈哈哈！
    <div>
      <el-button type="primary" @click="cilck">创建</el-button>
    </div>
    <el-dialog title="新增条件" v-model="showDialog" width="850px" append-to-body @close="showDialog = false">
      <WujieVue
        ref="wujieVueRef"
        width="100%"
        height="100%"
        name="user-tower"
        :url="props.url"
        :props="props"
        :plugins="[InstanceofPlugin()]"
      />
    </el-dialog>
  </div>
</template>
