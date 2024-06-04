<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu v-if="(subItem.children && subItem.children?.length > 1) || subItem.alwaysShow" :index="getIndex(subItem)">
      <template #title>
        <el-icon v-if="subItem?.meta?.icon">
          <ly-svg-icon :icon-class="subItem.meta.icon" />
        </el-icon>
        <span class="truncate" :title="hasTitle(subItem.meta?.title || '')">{{ subItem.meta?.title }}</span>
      </template>
      <SubMenu :menu-list="filterMenuList(subItem.children || [])" :base-path="subItem.path" />
    </el-sub-menu>
    <el-menu-item v-else :index="getIndex(getSubItem(subItem))" @click="handleClickMenu(getSubItem(subItem))">
      <el-icon v-if="getSubItem(subItem).meta?.icon">
        <ly-svg-icon :icon-class="getSubItem(subItem).meta?.icon || ''" />
      </el-icon>
      <template #title>
        <span class="truncate" :title="hasTitle(getSubItem(subItem).meta?.title || '')">{{ getSubItem(subItem).meta?.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils'
import type { RouteItem, RoutesType } from '@/router/interface'

interface SubMenuProps {
  menuList: RoutesType
  basePath?: string
}
const props = withDefaults(defineProps<SubMenuProps>(), {
  basePath: '',
})
const router = useRouter()

/** 获取菜单children.length < 1 或者 children为null */
const getSubItem = (subItem: RouteItem) => {
  return subItem.children?.length === 1 ? subItem.children[0] : subItem
}
/** 菜单名称过长截取 */
const hasTitle = (title: string) => {
  return title.length > 6 ? title : ''
}
/** 获取菜单对应访问路径 */
const resolvePath = (subItem: RouteItem): RouteLocationRaw => {
  const routePath = subItem.path
  const routeQuery = subItem.query as any
  if (isExternal(routePath)) return routePath
  if (isExternal(props.basePath)) return props.basePath
  if (routeQuery) {
    const query = JSON.parse(routeQuery)
    return { path: getNormalPath(`${props.basePath}/${routePath}`), query }
  }
  return getNormalPath(`${props.basePath}/${routePath}`)
}
/** 获取菜单的唯一key */
const getIndex = (subItem: RouteItem) => {
  const routeLocationRaw = resolvePath(subItem) as any
  return typeof routeLocationRaw === 'object' ? routeLocationRaw.path : routeLocationRaw
}
/** 路由跳转事件 */
const handleClickMenu = (subItem: RouteItem) => {
  if (subItem?.meta?.link) return window.open(subItem.meta.link, '_blank')
  router.push(resolvePath(subItem))
}

const filterMenuList = (data: RouteItem[]) => {
  return data.filter(v => !v.hidden)
}
</script>
