<template>
  <div class="userTower-warap">
    <div class="left-warap">
      <div style="padding: 20px;">
        <el-button type="primary" @click="back" style="margin-bottom: 20px;">返回首页</el-button>
        <el-menu
          :default-active="activeMenu"
          :collapse="false"
          :router="false"
          :unique-opened="true"
          :collapse-transition="false"
          background-color="#ffffff"
          active-text-color="#1d86f0"
        >
          <el-menu-item index="/internal-menu" @click="go('/internal-menu')">自定义菜单</el-menu-item>
          <template v-for="subItem in menuList" :key="subItem.id">
            <el-sub-menu v-if="subItem.children && subItem.children?.length > 0" :index="subItem.id">
              <template #title>
                <span>{{ subItem.label }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="item in subItem.children" :key="item.id" :index="item.path" @click="go(item.path)">{{ item.label }}</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item v-else :index="subItem.path" @click="go(subItem.path)">{{ subItem.label }}</el-menu-item>
          </template>
        </el-menu>
      </div>
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
    <div class="right-warap">
      <div class="headerr">
        <div class="container"><router-view /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="UserTower">
import { computed } from 'vue'
import WujieVue from 'wujie-vue3'
import { useRoute, useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { MenuListItem } from '@/utils/interface'
import tea from '@/assets/images/tea.png'
import coffee from '@/assets/images/coffee.png'
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
}

const go = (path: string) => {
  router.replace(`${path}`)
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
  --navigation-width: 250px;
  .left-warap {
    width: var(--navigation-width);
    text-align: center;
    line-height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right-warap {
    width: calc(100% - var(--navigation-width));
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
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
}

.el-menu {
  border-right: none;
  .el-sub-menu>.el-sub-menu__title, .el-menu-item {
    &:hover {
      color: var(--el-color-primary);
      background-color: rgba(64, 158, 255, 0.1);
    }
  }
  .el-menu-item.is-active {
    background-color: rgba(64, 158, 255, 0.1);
  }
  .el-menu-item-group__title {
    padding: 0px !important;
  }
  .el-menu-item {
    height: 44px;
    margin-bottom: 8px
  }
  .el-menu-item.is-active {
    color: var(--el-color-primary);
  }
}
.is-active {
  background-color: #0031e00d;
}
.sidebar-bottom {
  background-color: #f9fafc;
  font-size: 14px;
  color: #1d2129;
  padding: 10px;
  border-top: 2px solid #F0F1F5;
  border-bottom: 2px solid #F0F1F5;
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
    transition-duration: .3s;
    transition-timing-function: cubic-bezier(.1,.7,1,.1);
  }
}
</style>
