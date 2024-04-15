<template>
  <div class="userTower-warap">
    <div class="left">
      <div>
        <el-button type="primary" @click="back" style="margin-bottom: 20px;">返回首页</el-button>
        <div class="go" :class="route.path.includes('/user-tower') && 'active'" @click="go('/user-tower')">用户群体</div>
        <div class="go" :class="route.path.includes('/user-label') && 'active'" @click="go('/user-label')">用户标签</div>
        <div class="go" :class="route.path.includes('/crowd-insight') && 'active'" @click="go('/crowd-insight')">人群洞察</div>
      </div>
      <div>
        <div :class="`${brandvalue === 'tea' && 'gao'}`" @click="handleChange('tea')">茶白道</div>
        <div :class="`${brandvalue === 'coffee' && 'gao'}`" @click="handleChange('coffee')">咖灰</div>
      </div>
    </div>
    <div class="right">
      <div style="line-height: 40px;">当前用户手机号：{{ phoneNumber }} <span style="color: red;">( 可在链接上更改手机号 )</span></div>
      <div class="headerr">
        <div class="container"><router-view /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="UserTower">
import { computed, ref } from 'vue'
import WujieVue from 'wujie-vue3'
import { useRoute, useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const phoneNumber = ref(route.query.phoneNumber || '18228329236')
const storeUser = useStoreUser()

const brandvalue = computed(() => {
  return storeUser.brand || 'tea'
})

const handleChange = (brand: 'tea' | 'coffee') => {
  storeUser.setBrand(brand)
  WujieVue.bus.$emit('__USER_TOWER_OSP_BRANDCHANGE', { brand })
}

const go = (path: string) => {
  router.replace(`${path}?phoneNumber=${phoneNumber.value}`)
}
const back = () => {
  router.replace('/home')
}

</script>
<style lang="scss">
.userTower-warap {
  display: flex;
  height: 100vh;
  .active {
    color: var(--el-color-primary);
  }
  .container {
    height: 100%;
    overflow: auto;
  }
  .go {
    cursor: pointer;
  }
  .left {
    width: 300px;
    text-align: center;
    line-height: 40px;
    padding: 50px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right {
    width: calc(100% - 300px);
    background-color: aliceblue;
    padding: 20px;
  }
  .gao {
    color: var(--el-color-primary);
  }
  .el-tabs__content {
    padding: 0 !important;
  }
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.headerr {
  width: 100%;
  height: calc(100% - 40px);
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
}
</style>
