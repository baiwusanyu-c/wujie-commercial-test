<template>
  <el-dialog :model-value="true" width="35%" :close-on-click-modal="false" :before-close="() => close()">
    <template #header>
      <span class="el-dialog__title">{{ modalTitle }}</span
      ><span v-if="isEdit" class="color-danger m-l-5 text-3.5">提示：修改后可能导致物料设置的失效</span>
    </template>
    <el-form ref="ruleFormRef" v-loading="loading" :model="ruleForm" :rules="rules" label-width="auto" label-position="right">
      <el-form-item prop="userName" label="用户名称">
        <el-input v-model.trim="ruleForm.userName" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item prop="email" label="用户邮箱">
        <el-input v-model.trim="ruleForm.email" placeholder="请输入用户邮箱" :disabled="isEdit" />
      </el-form-item>
      <el-form-item prop="status" label="用户状态">
        <el-radio-group v-model="ruleForm.status">
          <el-radio value="1">冻结</el-radio>
          <el-radio value="2">正常</el-radio>
          <el-radio value="3">锁定</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="loading" @click="close()">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit(ruleFormRef)"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'
import type { FormRules, RequestApi } from '@/utils/interface'
import type { User } from '@/api/interface'

const props = defineProps<{
  modalTitle: string
  editData: User.ResUserListItem
  requestApi: RequestApi<User.ReqSaveParams>
}>()
const emit = defineEmits(['close'])
const proxy = getCurrentInstance()?.proxy
const loading = ref(false)
const isEdit = props.modalTitle === '修改模型'
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<any>(props.editData)
const rules: FormRules<User.ReqSaveParams, 'id'> = {
  userName: [{ required: true, message: '请输入模型名称' }],
  email: [{ required: true, message: '请输入模型编码' }],
  status: [{ required: true, message: '请输入模型所在数据库表' }],
}
// 关闭弹窗
const close = (val = false) => {
  emit('close', val)
}
// 表单提交
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      props
        .requestApi(ruleForm)
        .then(({ msg }) => {
          proxy?.$message.success(msg ?? '操作成功')
          close(true)
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>
