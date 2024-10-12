<template>
  <swiper :pagination="pagination" :modules="modules" class="mySwiper">
    <swiper-slide>
      <el-table :data="tabelData">
        <el-table-column label="排名" type="index" width="55" align="center" />
        <el-table-column label="商品名称" prop="userName" align="center" />
        <el-table-column label="商品销量(杯)" prop="createUser" align="center" />
        <el-table-column label="销量日环比" prop="createTime" align="center" />
        <el-table-column label="销量占比" prop="updateTime" align="center" />
      </el-table>
    </swiper-slide>
    <swiper-slide>
      <el-table :data="tabelData2">
        <el-table-column label="排名" type="index" width="55" align="center" />
        <el-table-column label="商品名称" prop="userName" align="center" />
        <el-table-column label="商品销量(杯)" prop="createUser" align="center" />
        <el-table-column label="销量日环比" prop="createTime" align="center" />
        <el-table-column label="销量占比" prop="updateTime" align="center" />
      </el-table>
    </swiper-slide>
    <swiper-slide>
      <el-table :data="tabelData3">
        <el-table-column label="排名" type="index" width="55" align="center" />
        <el-table-column label="商品名称" prop="userName" align="center" />
        <el-table-column label="商品销量(杯)" prop="createUser" align="center" />
        <el-table-column label="销量日环比" prop="createTime" align="center" />
        <el-table-column label="销量占比" prop="updateTime" align="center" />
      </el-table>
    </swiper-slide>
  </swiper>
  <swiper :modules="[Virtual]" :slides-per-view="3" :space-between="50" virtual>
    <swiper-slide v-for="(slideContent, index) in slides" :key="index" :virtualIndex="index">{{ slideContent }}</swiper-slide>
  </swiper>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item label="洞察名称:" prop="analysisDimension">
      <el-select-v2
        v-model="ruleForm.analysisDimension"
        multiple
        filterable
        clearable
        value-key="value"
        :options="labelSelect"
        style="width: 240px"
        :remote="false"
        :remote-method="getLabelSelectData"
        :loading="loading"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save(ruleFormRef)"> 提交 </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { reactive, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Virtual } from 'swiper/modules'

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const ruleFormRef = ref()
    const ruleForm = ref({ analysisDimension: ['1', '2'] })
    const rules = reactive({
      analysisDimension: [{ required: true, message: '请选择分析维度', trigger: 'blur' }],
    })
    const loading = ref(false)
    const labelSelect = ref([
      { label: '111', value: '1' },
      { label: '222', value: '2' },
      { label: '333', value: '3' },
      { label: '444', value: '4' },
    ])
    const save = (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
        }
      })
    }
    const getLabelSelectData = (query) => {
      if (query !== '') {
        loading.value = true
        setTimeout(() => {
          loading.value = false
          labelSelect.value = []
        }, 200)
      } else {
        labelSelect.value = []
      }
    }
    const slides = Array.from({ length: 1000 }).map((el, index) => `Slide ${index + 1}`)
    return {
      slides,
      Virtual,
      pagination: {
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + '</span>'
        },
      },
      modules: [Pagination],
      tabelData: [
        { index: 1, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 2, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 3, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 4, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 5, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 6, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 7, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 8, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        { index: 9, userName: '紫气葡萄冻冻', createUser: '1653779', createTime: '32.3%', updateTime: '100%', remark: '3322', remark1: '' },
        {
          index: 10,
          userName: '紫气葡萄冻冻',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 11,
          userName: '紫气葡萄冻冻',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 12,
          userName: '紫气葡萄冻冻',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 13,
          userName: '紫气葡萄冻冻',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
      ],
      tabelData2: [
        {
          index: 1,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 2,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 3,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 4,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 5,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 6,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 7,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 8,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 9,
          userName: '紫气葡萄冻冻2',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
      ],
      tabelData3: [
        {
          index: 1,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 2,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 3,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 4,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 5,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 6,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 7,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 8,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
        {
          index: 9,
          userName: '紫气葡萄冻冻3',
          createUser: '1653779',
          createTime: '32.3%',
          updateTime: '100%',
          remark: '3322',
          remark1: '',
        },
      ],
      ruleFormRef,
      ruleForm,
      rules,
      labelSelect,
      save,
      loading,
      getLabelSelectData,
    }
  },
}
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination-bullet {
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  color: #303133;
  opacity: 1;
  background: #fff;
  font-weight: 500;
  border-radius: 2px;
}

.swiper-pagination-bullet-active {
  color: #0a4cde !important;
  background-color: #ceddff !important;
}
</style>
