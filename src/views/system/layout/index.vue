<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" :style="{ width: isCollapse ? '65px' : '240px' }">
        <div class="logo f-c-c" @click="logoClick">
          <img src="@/assets/images/logo2.png">
          <h1 v-if="!isCollapse" class="sidebar-title">
            {{ title }}
          </h1>
        </div>
        <el-scrollbar>
          <el-menu
            ref="menuRef"
            :default-active="activeMenu"
            :collapse="isCollapse"
            :router="false"
            :unique-opened="true"
            :collapse-transition="false"
            background-color="#ffffff"
            active-text-color="#1d86f0"
          >
            <SubMenu :menu-list="menuList" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <AppMain />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSystemRoutes } from '@/router'
import useAppStore from '@/store/modules/app'
import SubMenu from './components/menu/sub-menu.vue'
import ToolBarLeft from './components/header/tool-bar-left.vue'
import ToolBarRight from './components/header/tool-bar-right.vue'
import AppMain from './components/main/index.vue'

const router = useRouter()
const menuList = getSystemRoutes()?.children || []
const title = getSystemRoutes()?.meta?.title
const route = useRoute()
const appStore = useAppStore()
const isCollapse = computed(() => appStore.sidebar.opened)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
const menuRef = ref()
const logoClick = () => {
  router.push('/system')
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
