<template>
  <el-upload
    ref="uploadRef"
    class="pb-3"
    action="#"
    v-bind="$attrs"
    :file-list="files"
    :http-request="handleHttpUpload"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    :disabled="loading"
  >
    <template #trigger>
      <slot name="trigger">
        <el-button :loading="loading" type="primary" :icon="Upload"> 文件上传 </el-button>
      </slot>
    </template>
    <template #tip>
      <div>
        <div v-if="$slots.tip" class="el-upload__tip">
          <slot name="tip" />
        </div>
      </div>
    </template>
    <span v-if="downloadApi || $slots.download" class="m-l-6" @click="handleDownload">
      <slot name="download">
        <el-link type="primary"> 下载模板 </el-link>
      </slot>
    </span>
  </el-upload>
</template>

<script setup lang="ts" name="LyUpload">
import { ref, useAttrs } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  type UploadInstance,
  type UploadProps,
  type UploadRequestOptions,
  genFileId,
} from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import axios from 'axios'
import { ossUploadApi, ossUploadSignApi, templateDownloadApi } from '@/api/oss'
import { downloadFile } from '@/utils'
import type { RequestApi } from '@/utils/interface'
import type { UploadFile } from './upload'

interface ProUploadProps {
  /** 接收值 */
  modelValue?: UploadFile[]
  /** 支持多文件 */
  multifile?: boolean
  /** 上传接口 */
  requestApi?: RequestApi<any>
  /** 模板下载接口 */
  downloadApi?: RequestApi
}
const props = withDefaults(defineProps<ProUploadProps>(), {
  modelValue: () => {
    return []
  },
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: UploadFile[]): void
  (e: 'change', value: UploadFile[]): void
}>()
const attrs = useAttrs()
const CancelToken = axios.CancelToken
const cancel = ref()
const loading = ref(false)
const uploadRef = ref<UploadInstance>()
const files = ref<UploadFile[]>(props.modelValue)

/** 下载 */
const handleDownload = async () => {
  const res = await (props.downloadApi ? props.downloadApi() : templateDownloadApi('crowd_package_template'))
  if (res.data) downloadFile(`${import.meta.env.VITE_APP_OSS_API}/${res.data}`)
}
/** 上传之前 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const accept = attrs.accept as string
  if (!accept) return
  const suffix = rawFile.name.substring(rawFile.name.lastIndexOf('.')).toLowerCase()
  const isUpload = accept.toLowerCase().includes(suffix)
  if (!isUpload) rawFile.msg = `请上传${accept}格式文件`
  return isUpload
}
/** 删除 */
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  files.value = files.value.filter(v => v.uid !== uploadFile.uid)
  emit('update:modelValue', files.value)
  emit('change', files.value)
}
/** 删除前 */
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  if (uploadFile?.raw?.msg) {
    ElMessage.error(uploadFile.raw.msg)
    return true
  }
  return ElMessageBox.confirm(`确定删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false,
  )
}
/** 上传 */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  loading.value = true
  if (!props.multifile) {
    // 单个文件
    files.value = [
      {
        name: options.file.name,
        percentage: 0,
        ossPath: '',
        status: 'ready',
        uid: genFileId(),
      },
    ]
  } else {
    // 多个文件
    files.value = [
      ...files.value,
      {
        name: options.file.name,
        percentage: 0,
        ossPath: '',
        status: 'ready',
        uid: genFileId(),
      },
    ]
  }
  // 模拟上传进度
  const length = files.value.length
  const currIndex = length ? length - 1 : 0
  const interval = setInterval(() => {
    if ((files.value[currIndex].percentage || 0) >= 90) {
      clearInterval(interval)
      return
    }
    files.value[currIndex].percentage = (files.value[currIndex].percentage || 0) + 1
    files.value[currIndex].status = 'uploading'
  }, 20)
  try {
    // 1. oss签名
    const { data } = await ossUploadSignApi()
    // 2. oss上传
    await ossUploadApi(
      {
        OSSAccessKeyId: data.accessKeyId,
        policy: data.policy,
        signature: data.signature,
        key: data.dir + options.file.name,
        file: options.file,
      },
      new CancelToken((c) => {
        cancel.value = c
      }),
    )
    files.value[currIndex].ossPath = data?.dir
    files.value[currIndex].status = 'success'
    files.value[currIndex].percentage = 100
    emit('update:modelValue', files.value)
    emit('change', files.value)
    // 3. 调用上传接口
    if (props.requestApi) {
      const params = files.value.map(v => ({ fileName: v.name, ossPath: v.ossPath }))
      const { msg } = await props.requestApi(params)
      ElMessage.success(msg ?? '上传成功')
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    files.value.pop() // 上传失败删除最后一个
    emit('update:modelValue', files.value)
    emit('change', files.value)
  }
}

defineExpose({
  cancel,
})
</script>

<style lang="scss">
.el-upload-dragger {
  border-color: rgba(16, 92, 255, 0.50);
}
</style>