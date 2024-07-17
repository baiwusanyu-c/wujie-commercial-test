<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { MenuListItem } from '@/utils/interface'
import { getUserMenus } from '@/api/menus'
import { getUserInfo } from '@/api/user'
const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeRef = ref()
const storeUser = useStoreUser()
const router = useRouter()
const treeData = ref<MenuListItem[]>([])
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({ phoneNumber: storeUser.phoneNumber || '18228329236', menuList: [] })
const validateName = (_rule: any, value: any, callback: any) => {
  const reg = /^1[3-9]\d{9}$/
  if (value === '') callback(new Error('请输入手机号'))
  else if (!reg.test(value)) callback(new Error('请输入正确手机号'))
  else callback()
}
const rules = reactive({
  phoneNumber: [{ required: true, validator: validateName }],
})
const init = () => {
  getUserMenus().then((res) => {
    treeData.value = res.data
  })
  getUserInfo().then((res) => {
    storeUser.login(res.data)
  })
}
init()
const getData = (values: string[]) => {
  const filterData = treeData.value.filter((v) => {
    const a = values.includes(v.id)
    const b = v.children?.some(vv => values.includes(vv.id))
    return !a && !b ? false : true
  })
  return filterData.map((v) => {
    return {
      ...v,
      children: v.children?.filter(vv => values.includes(vv.id)),
    }
  })
}
const getCheckedKeys = () => {
  let res: string[] = []
  const execute = (data: MenuListItem[], is: boolean) => {
    data.forEach((v) => {
      is && res.push(v.id)
      if (v.children) execute(v.children, true)
    })
  }
  execute(storeUser.menuList, false)
  return res.length ? res : ['1', '2', '3']
}
const go = (formEl: FormInstance | undefined, type: '1' | '2') => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const values = treeRef.value.getCheckedKeys()
      storeUser.setUserInfo({ phoneNumber: ruleForm.value.phoneNumber, menuList: getData(values) })
      if (type === '1') {
        router.push(`/label-tank`)
      } else if (type === '2') {
        router.push(`/system`)
      }
    }
  })
}
</script>

<template>
  <div class="home-waraper">
    <div class="form-container">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
        <el-form-item prop="phoneNumber" label="用户手机号:">
          <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号" clearable maxlength="20" style="width: 200px" />
        </el-form-item>
        <el-form-item prop="menuList" label="菜单权限:">
          <el-tree
            ref="treeRef"
            style="width: 200px"
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            default-expand-all
            :default-checked-keys="getCheckedKeys()"
          />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="go(ruleFormRef, '1')">跳转至标签智库</el-button>
          <el-button type="primary" @click="go(ruleFormRef, '2')">跳转至内部系统</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.gao {
  color: var(--el-color-primary);
}
.el-form-item__label {
  font-weight: 700;
}
.home-waraper {
  display: flex;
  height: 100%;
  .form-container {
    margin: auto;
  }
}
</style>
