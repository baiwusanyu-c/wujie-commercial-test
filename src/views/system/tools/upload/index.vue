<script lang="ts" setup name="internal-menu">
import { getCurrentInstance, ref } from 'vue'
import { type Action } from 'element-plus'
import { addUpload, editUpload, uploadDelete, getUploadList } from '@/api/tools/upload'
import ModelSave from './upload-save.vue'
import UploadFile from './upload-file.vue'
import type { Tools } from '@/api/interface'
import type { IPageParams } from '@/utils/interface'

const proxy = getCurrentInstance()?.proxy
const queryParams = ref({
  classification: '',
  tableName: '',
  tableNa: '',
  tableType: '',
})
const loading = ref(false)
const tabelData = ref<Tools.Upload.ResUploadListItem[]>([])
const pageParams = ref<IPageParams>({
  pageSize: 10,
  pageNo: 1,
  total: 0,
})
const editData = ref({})
const dialogVisible = ref(false) // 弹窗可见性
const modelTitle = ref() // 弹窗标题
const requestApi = ref() // 新增或者修改接口
const resetPage = () => {
  pageParams.value = {
    pageSize: 10,
    pageNo: 1,
    total: 0,
  }
}
const getList = () => {
  loading.value = true
  getUploadList({
    ...queryParams.value,
    ...pageParams.value,
  })
    .then((res) => {
      pageParams.value.total = res.data.totalNumber
      tabelData.value = res.data.list
    })
    .finally(() => {
      loading.value = false
    })
}
getList()
// 搜索
function handleQuery() {
  resetPage()
  tabelData.value = []
  getList()
}
// 重置搜索
function resetQuery() {
  proxy?.$resetForm('queryRef')
  resetPage()
  getList()
}
const fileVisibe = ref(false)
const handleClickView = (code: string, row?: Tools.Upload.ResUploadListItem) => {
  if (code === 'add') {
    dialogVisible.value = true
    modelTitle.value = '新建表'
    editData.value = { } // 清空编辑回显数据
    requestApi.value = addUpload
    return
  }
  if (code === 'edit' && row) {
    dialogVisible.value = true
    modelTitle.value = '编辑表'
    requestApi.value = editUpload
    editData.value = { ...row }
    return
  }
  if (code === 'upload' && row) {
    fileVisibe.value = true
    modelTitle.value = '上传文件'
    editData.value = { ...row }
    return
  }
  if (code === 'delete' && row) {
    proxy?.$messageBox.confirm('是否确定删除', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      callback(action: Action) {
        if (action === 'confirm') {
          uploadDelete(row).then(({ msg }) => {
            getList()
            proxy?.$message.success(msg ?? '删除成功')
          })
        }
      },
    })
  }
}
const modalClose = (val: boolean) => {
  dialogVisible.value = false
  fileVisibe.value = false
  if (val) getList()
}
</script>

<template>
  <div>
    <PageWrapper title="查询条件" class="mb16px">
      <el-form ref="queryRef" :model="queryParams" :inline="true">
        <el-form-item prop="classification" label="分类:">
          <el-input v-model="queryParams.classification" placeholder="请输入分类" clearable maxlength="50" />
        </el-form-item>
        <el-form-item prop="tableName" label="表名称:">
          <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable maxlength="50" />
        </el-form-item>
        <el-form-item prop="tableNa" label="表名:">
          <el-input v-model="queryParams.tableNa" placeholder="请输入表名" clearable maxlength="50" />
        </el-form-item>
        <el-form-item prop="tableType" label="表类型:">
          <el-select
            v-model="queryParams.tableType"
            class="select-brand"
            placeholder="请选择表类型"
            clearable
            style="width: 200px"
            @clear="resetPage"
          >
            <el-option label="全量表" value="1" />
            <el-option label="半量表" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" :loading="loading" @click="handleQuery()"> 搜索 </el-button>
          <el-button icon="Refresh" :loading="loading" @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </PageWrapper>
    <PageWrapper title="手工表">
      <template #toolButton>
        <el-button type="primary" icon="plus" @click="handleClickView('add')"> 新建表 </el-button>
      </template>
      <el-table v-loading="loading" :data="tabelData">
        <el-table-column label="分类" prop="classification" />
        <el-table-column label="表名" prop="tableNa" />
        <el-table-column label="表类型" prop="tableType">
          <template #default="{ row }">
            <span v-if="row.tableType === '1'">全量表</span>
            <span v-else-if="row.tableType === '2'">半量表</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="更新时间" prop="updateTime" />
        <el-table-column label="操作" align="center" width="300" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link plain @click="handleClickView('view', row)"> 查看 </el-button>
            <el-button type="primary" link plain @click="handleClickView('edit', row)"> 编辑 </el-button>
            <el-button type="primary" link plain @click="handleClickView('delete', row)"> 删除 </el-button>
            <el-button type="primary" link plain @click="handleClickView('upload', row)"> 上传文件 </el-button>
            <el-button type="primary" link plain @click="handleClickView('record', row)"> 上传记录 </el-button>
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

    <ModelSave
      v-if="dialogVisible"
      :modal-title="modelTitle"
      :edit-data="editData"
      :request-api="requestApi"
      @close="modalClose"
    />
    <UploadFile v-if="fileVisibe" :modal-title="modelTitle" :edit-data="editData" @close="modalClose" />
  </div>
</template>
