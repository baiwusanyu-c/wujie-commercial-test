<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" style="width: 200px;">
        <div class="f-c-c p20px">
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
                  <el-menu-item v-for="item in subItem.children" :key="item.id" :index="item.path" @click="go(item.path)">{{
                    item.label
                  }}</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.path" @click="go(subItem.path)">{{ subItem.label }}</el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
        <div class="sidebar-bottom">
          <div
            v-for="item in brandList"
            :key="item.value"
            class="sidebar-bottom__item"
            :class="brandvalue === item.value ? 'is-action' : ''"
            @click="handleChange(item.value)"
          >
            <div class="left">
              <img :src="item.icon">
              <span>{{ item.lable }}</span>
            </div>
            <div v-if="brandvalue === item.value" class="right">
              <SvgIcon icon-class="check" />
            </div>
          </div>
        </div>
      </div>
    </el-aside>
    <el-container>
      <section class="app-main">
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
import tea from '@/assets/images/tea.png'
import coffee from '@/assets/images/coffee.png'
import { scrollTo } from '@/utils/scroll-to'
interface BrandItem {
  lable: string
  value: string
  icon: string
}
// 品牌列表
const brandList: BrandItem[] = [
  { lable: '茶百道', value: 'tea', icon: tea },
  { lable: '咖灰', value: 'coffee', icon: coffee },
]
const route = useRoute()
const router = useRouter()
const storeUser = useStoreUser()
const menuList = storeUser.menuList as MenuListItem[]
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
const brandvalue = computed(() => {
  return storeUser.brand || 'tea'
})
const handleChange = (brand: string) => {
  storeUser.setBrand(brand)
  WujieVue.bus.$emit('__USER_TOWER_OSP_BRANDCHANGE', { brand })
  scrollTo(0, 800, window.parent[0].document.querySelector('.user-tower-iframe'))
}

const go = (path: string) => {
  router.replace(`${path}`)
}
const back = () => {
  router.replace('/home')
}
</script>
<style lang="scss" scoped>
@import "../system/layout/index.scss";

.app-main {
  height: 100vh;
  width: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  background-color: #F0F1F5;
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
      width: 35px;
      height: 35px;
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
