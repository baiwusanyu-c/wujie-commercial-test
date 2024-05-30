  
<script lang="ts" setup>
  import { getCurrentInstance, reactive, ref } from 'vue'
  import { FormInstance } from 'element-plus'
  import type { FormRules, RequestApi } from '@/utils/interface'
  import type { Tools } from '@/api/interface'
  
  const props = defineProps<{
    modalTitle: string
    editData: any
    requestApi: RequestApi<Tools.Upload.ReqSaveParams>
  }>()
  const emit = defineEmits(['close'])
  const proxy = getCurrentInstance()?.proxy
  const loading = ref(false)
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<any>(props.editData)
  const rules: FormRules<Tools.Upload.ReqSaveParams, 'id'> = {
    tableName: [{ required: true, message: '请输入表名称' }],
    classification: [{ required: true, message: '请输入分类' }],
    tableNa: [{ required: true, message: '请输入表名' }],
    dataSource: [{ required: true, message: '请选择数据源' }],
    tableType: [{ required: true, message: '请选择表类型' }],
    tableCode: [{ required: true, message: '请输入业务建表语句' }],
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
        props.requestApi(ruleForm).then(({ msg }) => {
          proxy?.$message.success(msg ?? '操作成功')
          close(true)
        }).finally(() => {
          loading.value = false
        })
      }
    })
  }
</script>

<template>
  <el-dialog
    :title="modalTitle"
    :model-value="true"
    width="50%"
    :close-on-click-modal="false"
    :before-close="() => close()"
  >
    <el-form
      ref="ruleFormRef"
      v-loading="loading"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      label-position="right"
    >
      <el-form-item prop="tableName" label="表名称">
        <el-input v-model.trim="ruleForm.tableName" placeholder="请输入表名称" />
      </el-form-item>
      <el-form-item prop="classification" label="分类">
        <el-input v-model.trim="ruleForm.classification" placeholder="请输入分类" />
      </el-form-item>
      <el-form-item prop="tableNa" label="表名">
        <el-input v-model.trim="ruleForm.tableNa" placeholder="请输入表名" />
      </el-form-item>
      <el-form-item prop="dataSource" label="数据源">
        <el-select v-model="ruleForm.dataSource" placeholder="请选择数据源" clearable>
          <el-option label="文件上传数据源【统一源】" value="1" />
          <el-option label="文件上传数据源【1】" value="2" />
          <el-option label="文件上传数据源【2】" value="3" />
          <el-option label="文件上传数据源【3】" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item prop="tableType" label="表类型">
        <el-select v-model="ruleForm.tableType" placeholder="请选择表类型" clearable>
          <el-option label="全量表" value="1" />
          <el-option label="增量表" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item prop="tableCode" label="业务建表语句">
        <el-input v-model.trim="ruleForm.tableCode" type="textarea" :rows="6" placeholder="请输入业务建表语句" />
        <span class="color-#F53F3F text-12px">注息:"业务建表语句“中包建的表名称需与表名”中所站写表名称保持一致</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="loading" @click="close()">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit(ruleFormRef)"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>