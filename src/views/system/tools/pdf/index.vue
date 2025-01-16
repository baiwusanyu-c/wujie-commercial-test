<script lang="ts" setup>
import { ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

// either URL, Base64, binary, or document proxy
const source = 'https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf'
const pdfRef = ref<any>()
const pageCount = ref(1)
const loading = ref(true)
const currentPage = ref<number | undefined>(1)
const currentRotation = ref(0)
const showAllPages = ref(false)
const rotations = [0, 90, 180, 270]

const handleDocumentRender = () => {
  loading.value = false
  pageCount.value = pdfRef.value.doc.numPages
}
const showAllPagesChange = () => {
  currentPage.value = showAllPages.value ? undefined : 1
}
const onPrint = () => {
  // 如果在打印时，打印页面是本身的两倍，在打印配置 页面 设置 仅限页码为奇数的页面 即可
  pdfRef.value.print()
}
</script>

<template>
  <div class="h-full w-full">
    <a
      href="https://www.bamuwu.com/sqrcode?type=5&channel=slink_file&keyword=pdfzhuanlianjieshengchengqi&node=pdf%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%94%9F%E6%88%90%E5%99%A8&e_adposition=cl2&bd_vid=10646533323121967715"
      target="_blank"
    >pdf在线生成链接</a
    >
    <div><a :href="source" target="_blank">pdf链接</a></div>
    <div class="h-[calc(100vh-40px)]" v-loading="loading">
      <div class="flex justify-between items-center h-9">
        <div v-if="showAllPages" class="font-medium ml-1.25 text-xl">共{{ pageCount }}页</div>
        <div v-else>
          <el-pagination v-model:current-page="currentPage" background layout="prev, slot, next" :page-size="1" :total="pageCount">
            {{ currentPage }} / {{ pageCount }}
          </el-pagination>
        </div>
        <div class="flex-bc">
          <el-checkbox v-model="showAllPages" @change="showAllPagesChange"> 显示所有页面 </el-checkbox>
          <el-button type="primary" @click="currentRotation === 3 ? (currentRotation = 0) : (currentRotation += 1)">{{
            `翻转（当前角度${rotations[currentRotation]}度）`
          }}</el-button>
          <el-button type="primary" @click="onPrint">打印</el-button>
        </div>
      </div>
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          class="h-full container overflow-auto"
          annotation-layer
          text-layer
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="source"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
  </div>
</template>
