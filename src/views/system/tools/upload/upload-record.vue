<script lang="ts" setup name="internal-menu">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { uploadRecord } from '@/api/tools/upload'
import type { Tools } from '@/api/interface'
import type { IPageParams } from '@/utils/interface'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const tabelData = ref<Tools.Upload.ResUploadFileListItem[]>([])
const pageParams = ref<IPageParams>({
  pageSize: 10,
  pageNo: 1,
  total: 0,
})
const handleClickView = (code: string, row: Tools.Upload.ResUploadFileListItem) => {
    console.log(code, row)
}
const selectTab = ref('1')
const tabChange = (type: string) => {
  selectTab.value = type
}
const getList = () => {
  loading.value = true
  uploadRecord({ id: route.query.id as string, type: selectTab.value })
    .then((res) => {
      pageParams.value.total = res.data.totalNumber
      tabelData.value = res.data.list
    })
    .finally(() => {
      loading.value = false
    })
}
watchEffect(() => {
  getList()
})
const back = () => {
    router.replace('/tools/upload')
}
</script>

<template>
  <div>
    <PageWrapper title="上传记录">
      <template #toolButton>
        <el-button type="primary" plain @click="back"> 返回 </el-button>
      </template>
      <div class="mb20px flex">
        <div
          class="py5px px16px bg-#F4F5F7 rounded-100px mr14px cursor-pointer"
          :class="selectTab === '1' ? 'bg-#105CFF! color-#fff' : ''"
          @click="tabChange('1')"
        >
          已上传
        </div>
        <div
          class="py5px px16px bg-#F4F5F7 rounded-100px cursor-pointer"
          :class="selectTab === '2' ? 'bg-#105CFF! color-#fff' : ''"
          @click="tabChange('2')"
        >
          待上传
        </div>
      </div>
      <el-table v-loading="loading" :data="tabelData">
        <el-table-column label="文件名称" prop="fileName" />
        <el-table-column label="文件版本号" prop="fileVersion" />
        <el-table-column label="文件大小" prop="fileSize" />
        <el-table-column label="文件行数" prop="fileRow" />
        <el-table-column label="状态" prop="status">
          <template #default="{ row }">
            <span v-if="row.status === '1'" class="w72px h24px line-height-24px text-center bg-#52C41A rounded-2px inline-block color-#fff">上传成功</span>
            <span v-else-if="row.status === '2'" class="w72px h24px line-height-24px text-center bg-#F0F1F5 rounded-2px inline-block">上传中...</span>
            <span v-else-if="row.status === '3'" class="w72px h24px line-height-24px text-center bg-#F53F3F rounded-2px inline-block color-#fff">上传失败</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operator" />
        <el-table-column label="上传时间" prop="createTime" min-width="100" />
        <el-table-column label="更新时间" prop="updateTime" min-width="100" />
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link plain @click="handleClickView('view', row)"> 查看 </el-button>
            <el-button type="primary" link plain @click="handleClickView('delete', row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="pageParams.total > 0"
        v-model:page="pageParams.pageNo"
        v-model:limit="pageParams.pageSize"
        :total="pageParams.total"
        @pagination="getList"
      />
    </PageWrapper>
  </div>
</template>
