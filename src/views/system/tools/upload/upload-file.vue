  
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
import { uploadFile } from '@/api/tools/upload'
import Upload from '@/components/upload/src/upload.vue';
import { templateDownloadApi } from '@/api/oss'
import { downloadFile } from '@/utils'

const props = defineProps<{
  modalTitle: string
  editData: any
}>()
const emit = defineEmits(['close'])
const proxy = getCurrentInstance()?.proxy
const loading = ref(false)
const fileList = ref<any[]>([])
// 关闭弹窗
const close = (val = false) => {
  emit('close', val)
}
// 表单提交
const submit = () => {
  if (fileList.value.length === 0) return proxy?.$message.warning('请选择上传文件！')
  loading.value = true
  const params = fileList.value.map(v => ({ ...v, id: props.editData.id }))
  uploadFile(params).then(({ msg }) => {
    proxy?.$message.success(msg ?? '操作成功')
    close(true)
  }).finally(() => {
    loading.value = false
  })
}
const download = async() => {
  const res = await templateDownloadApi('crowd_package_template')
  if (res.data) downloadFile(`${import.meta.env.VITE_APP_OSS_API}/${res.data}`)
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
    <Upload drag v-model="fileList">
      <template #trigger>
        <div class="flex flex-col items-center justify-center">
          <svg-icon class="w40px! h40px! mb16px" icon-class="upload" />
          <span class="color-#1D2129">将文件拖拽至此区域 或 <span class="color-main">选择文件</span></span>
        </div>
      </template>
    </Upload>
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
        <el-button :loading="loading" type="primary" @click="submit"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>