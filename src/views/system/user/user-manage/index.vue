<script lang="ts" setup name="internal-menu">
import { getCurrentInstance, ref } from 'vue'
import { useRoute } from 'vue-router'
import { addUser, editUser, getUserList } from '@/api/user'
import ModelSave from './model-save.vue'
import type { User } from '@/api/interface'
import type { IPageParams } from '@/utils/interface'

const proxy = getCurrentInstance()?.proxy
const route = useRoute()
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

const handleClickView = (code: 'add' | 'edit' | 'view', row?: User.ResUserListItem) => {
  if (code === 'add') {
    dialogVisible.value = true
    modelTitle.value = '新增用户'
    editData.value = { status: '1' } // 清空编辑回显数据
    requestApi.value = addUser
    return
  }
  if (code === 'edit' && row) {
    dialogVisible.value = true
    modelTitle.value = '修改用户'
    requestApi.value = editUser
    editData.value = { ...row }
    return
  }
}
const modalClose = (val: boolean) => {
  dialogVisible.value = false
  if (val) getList()
}
</script>

<template>
  <div>
    <LyPageWrapper title="快速开始一个营销策略" class="mb16px">
      <div class="mask-group f-c-b">
        <div class="w200px h120px rounded-8px text-center line-height-120px">促销敏感人群复购</div>
        <div class="w200px h120px rounded-8px text-center line-height-120px">团购场景营销</div>
        <div class="w200px h120px rounded-8px text-center line-height-120px">节假日精准营销</div>
        <div class="w200px h120px rounded-8px text-center line-height-120px">新用户复购</div>
        <div class="w200px h120px rounded-8px text-center line-height-120px">实时天气精准营销</div>
      </div>
    </LyPageWrapper>
    <LyPageWrapper :title="route.meta.title">
      <template #toolButton>
        <el-button type="primary" icon="plus" @click="handleClickView('add')">
          创建用户
        </el-button>
      </template>
      <el-form ref="queryRef" :model="queryParams" :inline="true">
        <el-form-item prop="userName">
          <el-input v-model="queryParams.userName" placeholder="用户名称" clearable maxlength="50" />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" class="select-brand" placeholder="用户状态" clearable @clear="resetPage" style="width: 200px">
            <el-option label="冻结" :value="1" />
            <el-option label="正常" :value="2" />
            <el-option label="锁定" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" :loading="loading" @click="handleQuery()"> 搜索 </el-button>
          <el-button icon="Refresh" :loading="loading" @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="tabelData">
        <el-table-column label="序号" type="index" width="55" align="center" />
        <el-table-column label="用户名称" prop="userName" />
        <el-table-column label="用户状态" prop="status" width="80">
          <template #default="{ row }">
            <span v-if="row.status === '1'" style="color: #e6a23c; font-weight: bolder">冻结</span>
            <span v-else-if="row.status === '2'" style="color: #67c23a; font-weight: bolder">正常</span>
            <span v-else-if="row.status === '3'" style="color: #f56c6c; font-weight: bolder">
              锁定
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
      <ly-pagination
        v-show="pageParams.total > 0"
        v-model:page="pageParams.pageNo"
        v-model:limit="pageParams.pageSize"
        :total="pageParams.total"
        @pagination="getList"
      />
    </LyPageWrapper>
    
    <ModelSave
      v-if="dialogVisible"
      :modal-title="modelTitle"
      :edit-data="editData"
      :request-api="requestApi"
      @close="modalClose"
    />
  </div>
  
</template>

<style lang="scss" scoped>
.mask-group {
  color: #fff;
  div:nth-child(1) {
    background-image: url('../../../../assets/images/mask-group(1).png');
  }
  div:nth-child(2) {
    background-image: url('../../../../assets/images/mask-group.png');
  }
  div:nth-child(3) {
    background-image: url('../../../../assets/images/mask-group(2).png');
  }
  div:nth-child(4) {
    background-image: url('../../../../assets/images/mask-group(3).png');
  }
  div:nth-child(5) {
    background-image: url('../../../../assets/images/mask-group(4).png');
  }
}
</style>