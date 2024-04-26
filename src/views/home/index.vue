<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { MenuListItem } from '@/utils/interface'
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeData: MenuListItem[] = [
  {
    id: '1',
    label: '人群智库',
    path: '',
    name: '',
    meta: { title: '人群智库' },
    children: [
      {
        id: '1-1',
        label: '用户群体',
        path: '/user-tower',
        name: 'user-tower',
        meta: { title: '用户群体' },
      },
      {
        id: '1-2',
        label: '人群洞察',
        path: '/crowd-insight',
        name: 'crowd-insight',
        meta: { title: '人群洞察' },
      },
    ],
  },
  {
    id: '2',
    label: '标签管理',
    path: '',
    name: '',
    meta: { title: '标签管理' },
    children: [
      {
        id: '2-1',
        label: '用户标签',
        path: '/user-label',
        name: 'user-label',
        meta: { title: '用户标签' },
      },
    ],
  },
]
const checkedKeys = ['1', '2']
const treeRef = ref()
const storeUser = useStoreUser()
const router = useRouter()
storeUser.setUserInfo({ phoneNumber: '18228329236', authInsight: true })
storeUser.setMenuList(treeData)

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({ phoneNumber: storeUser.phoneNumber, menuList: [] })
const validateName = (_rule: any, value: any, callback: any) => {
  const reg = /^1[3-9]\d{9}$/
  if (value === '') callback(new Error('请输入手机号'))
  else if (!reg.test(value)) callback(new Error('请输入正确手机号'))
  else callback()
}
const rules = reactive({
  phoneNumber: [{ required: true, validator: validateName }],
})
watchEffect(() => {
  storeUser.setUserInfo(ruleForm.value)
})
const getData = (values: string[]) => {
  const filterData = treeData.filter((v) => {
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
const go = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const values = treeRef.value.getCheckedKeys()
      storeUser.setMenuList(getData(values))
      router.push(`/label-tank`)
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
            :default-checked-keys="checkedKeys"
          />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="go(ruleFormRef)">跳转至标签智库</el-button>
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
