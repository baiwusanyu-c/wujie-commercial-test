<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" style="width: 240px">
        <div class="f-c-c p20px">
          <span class="mr10px text-14px">当前环境：{{ userStore.env.label }}</span>
          <el-button type="primary" @click="back">返回首页</el-button>
        </div>
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            :collapse="false"
            :router="false"
            :unique-opened="true"
            :collapse-transition="false"
            background-color="#ffffff"
            active-text-color="#1d86f0"
          >
            <el-menu-item index="/internal-menu" @click="go('/internal-menu')">欢迎页</el-menu-item>
            <template v-for="subItem in menuList" :key="subItem.id">
              <el-sub-menu v-if="subItem.children && subItem.children?.length > 0" :index="subItem.id">
                <template #title>
                  <span>{{ subItem.label }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="item in subItem.children" :key="item.id" :index="item.path" @click="go(item.path, item)">{{
                    item.label
                  }}</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.path" @click="go(subItem.path, subItem)">{{ subItem.label }}</el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
        <div class="sidebar-bottom">
          <div
            v-for="item in brandList"
            :key="item.value"
            class="sidebar-bottom__item"
            :class="brandvalue === item.value ? 'is-action' : ''"
            @click="handleChange(item)"
          >
            <div class="left">
              <img :src="item.icon" class="w40px h40px rounded-50%">
              <span :class="`${brandvalue === item.value ? 'color-main' : ''}`">{{ item.lable }}</span>
            </div>
            <div v-if="brandvalue === item.value" class="right">
              <LySvgIcon icon-class="check" />
            </div>
          </div>
        </div>
      </div>
    </el-aside>
    <el-container>
      <section class="app-main">
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <div class="rounded-8px h100% of-hidden"><component :is="Component" :key="route.path" /></div>
          </transition>
        </router-view>
      </section>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup name="UserTower">
import { computed } from 'vue'
import WujieVue from 'wujie-vue3'
import { useRoute, useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { MenuListItem } from '@/utils/interface'
// import tea from '@/assets/images/tea.png'
// import coffee from '@/assets/images/coffee.png'
import liyubai from '@/assets/images/liyubai.jpg'
import { scrollTo } from '@/utils/scroll-to'
// import { ENV_CONFIG } from '@/utils/constant'
interface BrandItem {
  lable: string
  value: string
  icon: string
}
// 品牌列表
// const brandList: BrandItem[] = [
//   // { lable: '茶百道', value: 'tea', icon: tea },
//   // { lable: '咖灰', value: 'coffee', icon: coffee },
// ]
const brandList: BrandItem[] = [{ lable: '李与白', value: '351503', icon: liyubai }]
const route = useRoute()
const router = useRouter()
const userStore = useStoreUser()
const menuList = userStore.menuList as MenuListItem[]
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
userStore.setBrand(brandList[0].value, brandList[0].lable)
const brandvalue = computed(() => {
  return userStore.brandId || brandList[0].value
})
const handleChange = (data: BrandItem) => {
  userStore.setBrand(data.value, data.lable)
  WujieVue.bus.$emit('__USER_TOWER_OSP_BRANDCHANGE', { brand: data.value })
  WujieVue.bus.$emit('__USER_TOWER_CHANGE_BRAND', { brandId: data.value, brandName: data.lable })
  scrollTo(0, 800)
}

const go = (path: string, item?: any) => {
  if (item?.meta?.link) {
    // 环境地址
    const envUrl = `${userStore.env.dataPortalUrl}`
    // 路由
    const redirectUrl = item.meta.link
    // 商业化平台token
    const token = userStore.token
    // 扩展参数
    const state = {
      groupId: userStore.groupId,
      brandId: userStore.groupId,
      brandName: userStore.groupId,
      commRedirectUrl: userStore.env.commRedirectUrl,
    }
    // 访问链接
    const url = `${envUrl}${redirectUrl}?code=${token}&state=${encodeURIComponent(JSON.stringify(state))}`

    window.open(url, '_blank')
    return
  }
  router.replace(`${path}`)
}
const back = () => {
  router.replace('/home')
}
</script>
<style lang="scss" scoped>
@import '../system/layout/index.scss';

.app-main {
  height: 100vh;
  width: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f1f5;
  overflow: auto;
}

.sidebar-bottom {
  background-color: #f9fafc;
  font-size: 14px;
  color: #1d2129;
  padding: 10px;
  border-top: 2px solid #f0f1f5;
  border-bottom: 2px solid #f0f1f5;
  .sidebar-bottom__item {
    height: 75px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    .left img {
      vertical-align: middle;
      margin-right: 8px;
    }
    .right {
      margin-left: auto;
    }
    .svg-icon {
      width: 20px;
      height: 20px;
      color: var(--el-color-primary);
    }
  }
  .is-action {
    background-color: #fff;
    transition-property: background-color, color;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.1, 0.7, 1, 0.1);
  }
}
</style>
