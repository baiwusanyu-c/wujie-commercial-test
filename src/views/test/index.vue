<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
// import { useRequest } from '@/hooks/use-request'
// import { getCupShapeds } from '@/api/user'
// import HelloWorld from '@/components/hello-world/index.vue'
// import Comp from '@/components/slot-component/comp1.vue'
// import Comp from '@/components/slot-component/comp2.vue'
// import type { User } from '@/api/interface'
import { useRouter } from 'vue-router'
import useStoreUser from '@/store/modules/user'

const storeUser = useStoreUser()
const router = useRouter()
// const { loading, data } = useRequest<User.ResCupShapeds>(getCupShapeds(), [])
storeUser.setUserInfo({ phoneNumber: '18228329236', authInsight: true })
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({ phoneNumber: storeUser.phoneNumber, authInsight: storeUser.authInsight })
const validateName = (_rule: any, value: any, callback: any) => {
  const reg = /^1[3-9]\d{9}$/
  if (value === '') callback(new Error('请输入手机号'))
  else if (!reg.test(value))
    callback(new Error('请输入正确手机号'))
  else callback()
}
const rules = reactive<FormRules<typeof ruleForm>>({
  phoneNumber: [{ required: true, validator: validateName }],
  authInsight: [{ required: true, message: '请选择' }],
})
watchEffect(() => {
  storeUser.setUserInfo(ruleForm.value)
})
const go = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      router.push(`/user-tower`)
    }
  })
}

const brandvalue = ref<'tea' | 'coffee'>('tea')
const handleChange = (brand: 'tea' | 'coffee') => {
  brandvalue.value = brand
  storeUser.setBrand(brand)
}
const showDialog = ref(false)
</script>

<template>
  <!-- <HelloWorld v-loading="loading" msg="Vite@4.3.5 + Vue@3.3" :list="data">
    <template #content="scope">
      <span :style="{ color: scope.item.color }">{{ scope.item.value }}</span>
    </template>
  </HelloWorld>
  <Comp>
    <p>default slot</p>
    <template #slot1>
      <p>solt1</p>
    </template>
    <template #slot2="{ msg }">
      <p>solt2：{{ msg }}</p>
    </template>
  </Comp> -->
  <!-- <div class="header"><RouterLink to="board">跳转至看板</RouterLink></div> -->
  <div style="padding: 100px">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
      <el-form-item prop="phoneNumber" label="用户手机号">
        <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号" clearable maxlength="20" style="width: 200px" />
      </el-form-item>
      <el-form-item prop="authInsight" label="人群洞察权限">
        <el-select v-model="ruleForm.authInsight" style="width: 200px">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="go(ruleFormRef)">跳转至标签智库</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- <div>
    <div :class="`${brandvalue === 'tea' && 'gao'}`" @click="handleChange('tea')">茶白道</div>
    <div :class="`${brandvalue === 'coffee' && 'gao'}`" @click="handleChange('coffee')">咖灰</div>
  </div> -->
  <!-- <el-button type="primary" @click="showDialog = true">弹窗</el-button>
  <el-dialog
    v-model="showDialog"
    title="标题"
    width="465"
    @close="showDialog = false"
  >
    弹窗内容</el-dialog> -->
</template>

<style scoped>
.gao {
  color: var(--el-color-primary);
}
</style>
