  
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
import { FormInstance } from 'element-plus'
import { uploadFile } from '@/api/tools/upload'

defineProps<{
  modalTitle: string
  editData: any
}>()
const emit = defineEmits(['close'])
const proxy = getCurrentInstance()?.proxy
const loading = ref(false)
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
      const prames = {}
      uploadFile(prames).then(({ msg }) => {
        proxy?.$message.success(msg ?? '操作成功')
        close(true)
      }).finally(() => {
        loading.value = false
      })
    }
  })
}
const download = () => {}
</script>

<template>
  <el-dialog
    :title="modalTitle"
    :model-value="true"
    width="50%"
    :close-on-click-modal="false"
    :before-close="() => close()"
  >
    <div class="h150px mb20px rounded-4px border border-dashed border-#105CFF80 flex flex-col items-center justify-center">
      <svg-icon class="w40px! h40px! mb16px" icon-class="upload" />
      <span>将文件拖拽至此区域 或 <span class="color-main cursor-pointer">选择文件</span></span>
    </div>
    <div class="line-height-22px mb8px">导入文件须知：</div>
    <div class="color-#86909C text-14px line-height-24px">1.文件类型:Excel格式</div>
    <div class="color-#86909C text-14px line-height-24px">2.文件大小限制:不得超过100w行</div>
    <div class="color-#86909C text-14px line-height-24px">3.文件不支持表格合并</div>
    <div class="color-#86909C text-14px line-height-24px">4.确认上传文件表头是否与模版一致</div>
    <div class="color-#86909C text-14px line-height-24px">5.表格应为纯数值，不能带有“元”，“万”等单位</div>
    <template #footer>
      <span class="flex items-center">
        <el-button type="primary" plain @click="download">下载模板</el-button>
        <el-button class="mlauto!" :loading="loading" @click="close()">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit(ruleFormRef)"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>