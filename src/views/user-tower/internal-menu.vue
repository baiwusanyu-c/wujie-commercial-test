<script lang="ts" setup name="internal-menu">
import { getCurrentInstance, ref } from 'vue'
import { getUserList } from '@/api/user'
import type { User } from '@/api/interface'
import type { IPageParams } from '@/utils/interface'

const proxy = getCurrentInstance()?.proxy
const queryParams = ref({
  userName: '',
  status: ''
})
const loading = ref(false)
const tabelData = ref<User.ResUserListItem[]>([])
const pageParams = ref<IPageParams>({
  pageSize: 10,
  pageNo: 1,
  total: 0,
})
const resetPage = () => {
  pageParams.value = {
    pageSize: 10,
    pageNo: 1,
    total: 0,
  }
}
const getList = () => {
  loading.value = true
  getUserList({
    ...queryParams.value,
    ...pageParams.value,
  }).then((res) => {
    pageParams.value.total = res.data.totalNumber
    tabelData.value = res.data.list
  }).finally(() => { loading.value = false })
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

const handleClickView = (code: string, row?: User.ResUserListItem) => {
  console.log({ code, row })
}
</script>

<template>
  <div class="app-container">
    <el-form ref="queryRef" :model="queryParams" :inline="true">
      <el-form-item prop="userName">
        <el-input v-model="queryParams.userName" placeholder="用户名称" clearable maxlength="50" />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.status" class="select-brand" placeholder="用户状态" clearable @clear="resetPage" style="width: 200px">
          <el-option label="进行中" :value="1" />
          <el-option label="已完成" :value="2" />
          <el-option label="失败" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" :loading="loading" @click="handleQuery()"> 搜索 </el-button>
        <el-button icon="Refresh" :loading="loading" @click="resetQuery"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="plus" @click="handleClickView('add')">
          创建用户
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tabelData">
      <el-table-column label="序号" type="index" width="55" align="center" />
      <el-table-column label="用户名称" prop="userName" />
      <el-table-column label="用户状态" prop="status" width="80">
        <template #default="{ row }">
          <span v-if="row.status === '1'" style="color: #e6a23c; font-weight: bolder">进行中</span>
          <span v-else-if="row.status === '2'" style="color: #67c23a; font-weight: bolder">已完成</span>
          <span v-else-if="row.status === '3'" style="color: #f56c6c; font-weight: bolder">
            失败
            <el-tooltip v-if="row.failReason != null" :content="row.failReason" placement="top" effect="light">
              <el-icon style="transform: translateY(2px); cursor: pointer"><InfoFilled /></el-icon>
            </el-tooltip>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUser" align="center" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="更新时间" prop="updateTime" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" align="center" width="110" fixed="right">
        <template #default="{ row }">
          <el-button
            :type="row.status === 1 || row.status === 3 ? '' : 'primary'"
            :disabled="row.status === 1 || row.status === 3"
            link
            plain
            @click="handleClickView('view', row)"
          >
            查看
          </el-button>
          <el-button
            :type="row.status === 1 ? '' : 'primary'"
            :disabled="row.status === 1"
            link
            plain
            @click="handleClickView('edit', row)"
          >
            修改
          </el-button>
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
  </div>
</template>
