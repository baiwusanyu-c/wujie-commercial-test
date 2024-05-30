<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <ly-svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="toggle" />
    </div>

    <el-dropdown class="right-menu-item" @command="handleCommand">
      <div class="f-c-c">
        <el-avatar :size="32" :src="userStore.avatar" />
        <span class="ml-[10px]">{{ userStore.name }}</span>
        <el-icon><CaretBottom /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">
            <el-icon><SwitchButton /></el-icon><span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { CaretBottom, SwitchButton } from '@element-plus/icons-vue'
import { useFullscreen } from '@vueuse/core'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'

const { isFullscreen, toggle } = useFullscreen()
const userStore = useUserStore()

const router = useRouter()
function handleCommand(command: string) {
  switch (command) {
    case 'logout':
      logout()
      break
    default:
      break
  }
}
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async() => {
      router.replace('/home')
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>

<style scoped lang="scss">
.cur-env--popover {
  p {
    margin: 5px 0;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
.cur-env--val {
  color: var(--el-color-primary);
}
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  .header-icon {
    display: flex;
    align-items: center;
    .svg-icon {
        font-size: 15px;
    }
    > *{
      margin-left: 15px;
    }
    > *:hover {
      cursor: pointer;
    }
  }

  .right-menu-item {
    margin-left: 15px;
    color: var(--el-text-color-primary);
    font-size: 15px;
  }
}
</style>
