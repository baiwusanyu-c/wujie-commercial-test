<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'
import { MenuListItem } from '@/utils/interface'
import { getUserInfo } from '@/api/user'
import { ENV_CONFIG } from '@/utils/constant'
const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeRef = ref()
const storeUser = useStoreUser()
const router = useRouter()
const treeData = ref<any[]>([
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
  // {
  //   id: '3',
  //   label: 'PC数据看板',
  //   path: '',
  //   name: '',
  //   meta: { title: 'PC数据看板' },
  //   children: [
  //     {
  //       id: '3-1',
  //       label: '区域日报',
  //       path: '/regional-daily',
  //       name: 'regional-daily',
  //       meta: { title: '区域日报' },
  //     },
  //   ],
  // },
  // {
  //   id: '4',
  //   label: '用户',
  //   path: '',
  //   name: '',
  //   meta: { title: '用户' },
  //   children: [
  //     {
  //       id: '4-1',
  //       label: '用户管理',
  //       path: '/user-manages',
  //       name: 'user-manages',
  //       meta: { title: '用户管理' },
  //     },
  //     {
  //       id: '4-2',
  //       label: '分组管理',
  //       path: '/user-groups',
  //       name: 'user-groups',
  //       meta: { title: '分组管理' },
  //     },
  //   ],
  // },
  {
    id: '5',
    label: '报表中心',
    path: '/report-center',
    name: 'report-center',
    meta: { title: '报表中心', link: '/home/index' },
    children: [
      // {
      //   id: '5-1-1',
      //   label: '首页',
      //   path: '/index',
      //   name: 'index',
      //   meta: { title: '订单明细', link: '/home/index' },
      // },
      // {
      //   id: '5-1',
      //   label: '订单明细',
      //   path: '/order-detail',
      //   name: 'order-detail',
      //   meta: { title: '订单明细', link: '/home/order-detail' },
      // },
      // {
      //   id: '5-2',
      //   label: '收银明细',
      //   path: '/cashier-detail',
      //   name: 'cashier-detail',
      //   meta: { title: '收银明细', link: '/home/cashier-detail' },
      // },
      // {
      //   id: '5-3',
      //   label: '营业汇总分析',
      //   path: '/business-summary',
      //   name: 'business-summary',
      //   meta: { title: '营业汇总分析', link: '/home/business-summary' },
      // },
      // {
      //   id: '5-4',
      //   label: '菜品销售总汇',
      //   path: '/dishes-summary',
      //   name: 'dishes-summary',
      //   meta: { title: '菜品销售总汇', link: '/home/dishes-summary' },
      // },
      // {
      //   id: '5-5',
      //   label: '储值卡明细',
      //   path: '/debit-card-detail',
      //   name: 'debit-card-detail',
      //   meta: { title: '储值卡明细', link: '/home/debit-card-detail' },
      // },
      // {
      //   id: '5-6',
      //   label: '储值卡汇总',
      //   path: '/debit-card-summary',
      //   name: 'debit-card-summary',
      //   meta: { title: '储值卡汇总', link: '/home/debit-card-summary' },
      // },
      // {
      //   id: '5-7',
      //   label: '门店订货明细',
      //   path: '/store-ordering-detail',
      //   name: 'store-ordering-detail',
      //   meta: { title: '门店订货明细', link: '/home/store-ordering-detail' },
      // },
      // {
      //   id: '5-8',
      //   label: '门店订货汇总',
      //   path: '/store-summary',
      //   name: 'store-summary',
      //   meta: { title: '门店订货汇总', link: '/home/store-summary' },
      // },
    ],
  },
  {
    id: '6',
    label: 'ABTest',
    path: '',
    name: '',
    meta: { title: 'ABTest' },
    children: [
      {
        id: '6-1',
        label: '应用管理',
        path: '/app-manage',
        name: '/app-manage',
        meta: { title: '应用管理' },
      },
      {
        id: '6-2',
        label: '实验层',
        path: '/experiment-manage-list',
        name: 'experiment-manage-list',
        meta: { title: '实验层' },
      },
      {
        id: '6-3',
        label: '实验列表',
        path: '/experiment-manage-layer',
        name: 'experiment-manage-layer',
        meta: { title: '实验列表' },
      },
    ],
  },
]);
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
  env: storeUser.env?.label ? storeUser.env : ENV_CONFIG[0],
  phoneNumber: storeUser.phoneNumber || '18228329236',
  token: storeUser.token,
  groupId: '267356',
  menuList: [],
})
const validateName = (_rule: any, value: any, callback: any) => {
  const reg = /^1[3-9]\d{9}$/
  if (value === '') callback(new Error('请输入手机号'))
  else if (!reg.test(value)) callback(new Error('请输入正确手机号'))
  else callback()
}
const rules = reactive({
  env: [{ required: true, message: '请选择' }],
  phoneNumber: [{ required: true, validator: validateName }],
  token: [{ required: true, message: '请输入token' }],
  groupId: [{ required: true, message: '请输入集团id' }],
})
const init = () => {
  // getUserMenus().then((res) => {
  //   treeData.value = res.data
  // })
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
  return res.length ? res : ['1', '2', '3', '4', '5']
}
const go = (formEl: FormInstance | undefined, type: '1' | '2') => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const values = treeRef.value.getCheckedKeys()
      storeUser.setUserInfo({
        ...ruleForm.value,
        menuList: getData(values),
      })
      if (type === '1') {
        router.push(`/label-tank`)
      } else if (type === '2') {
        router.push(`/system`)
      }
    }
  })
}

// const open = () => {
//   sessionStorage.setItem('age', '28')
//   window.open('http://192.168.125.241:5170/#/test/cascader')
// }
</script>

<template>
  <div class="home-waraper">
    <!-- <el-button type="primary" @click="open">开启新窗口</el-button> -->
    <div class="form-container w-35%">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
        <!-- <el-form-item prop="phoneNumber" label="用户手机号:">
          <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号" clearable maxlength="20" style="width: 300px" />
        </el-form-item> -->
        <el-form-item prop="env" label="接入外部系统环境:">
          <el-select v-model="ruleForm.env">
            <el-option v-for="item in ENV_CONFIG" :key="item" :label="item.label" :value="item" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item prop="groupId" label="集团id:">
          <el-input v-model="ruleForm.groupId" placeholder="请输入集团id" clearable maxlength="20" disabled />
        </el-form-item>
        <el-form-item prop="token" label="商业化平台token:">
          <el-input v-model="ruleForm.token" placeholder="请输入商业化平台token" clearable />
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
          <el-button type="primary" @click="go(ruleFormRef, '1')">跳转至商业化平台对接</el-button>
          <!-- <el-button type="primary" @click="go(ruleFormRef, '1')">跳转至标签智库</el-button> -->
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
