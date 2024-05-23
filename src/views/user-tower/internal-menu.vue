<template>
  <div class="app-container">自定义菜单
    <el-button type="primary" @click="go">弹窗</el-button>
    <el-dialog
      v-model="showDialog"
      width="80%"
      @close="showDialog = false"
    >
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

<script lang="ts" setup name="internal-menu">
import { genCrowdParams } from '@cbd-wujie-components/osp-query'
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from "wujie-polyfill"
import { authRouter } from '@/utils'

const router = useRouter()
const storeUser = useStoreUser()
const { destroyApp, bus } = WujieVue
const props = {
  ...genCrowdParams('DEV', storeUser.phoneNumber, storeUser.brand as any, '/crowd'),
  authInsight: !!authRouter(storeUser.menuList, '/crowd-insight'),
  // url: 'http://192.168.124.130:3012/user-tower/auth-redirect',
}
bus.$on('__USER_TOWER_OSP_INSIGHT', () => {
  router.push(`/crowd-insight`)
})
onUnmounted(() => {
  bus.$clear()
  destroyApp('internal-menu')
})

const showDialog = ref(false)
const go = () => {
  showDialog.value = true
}
</script>
