<script lang="ts" setup>
import { ref } from 'vue'
import { getWarningList } from '@/api/tools/warning'
const loading = ref(false)

const init = () => {
  loading.value = true
  getWarningList({ name: 'l12' }).then((res) => {
    console.log('ress>>>>>>>>', res)
    loading.value = false 
  }).finally(() => { loading.value = false })
}
init()
</script>

<template>
  <div>
    <LyPageWrapper title="业务预警">
      <el-button :loading="loading" type="primary">业务预警</el-button>
    </LyPageWrapper>
  </div>
</template>
