<script setup lang="ts" generic="T extends ListItem ">
import { ref, useAttrs } from "vue";
import { useCssVar, useClipboard } from "@vueuse/core";
import Form from './form.vue'
import Snabbdom from './snabbdom/index.vue'
import type { ListItem, HelloWorldProps } from "./types";

// defineOptions({
//   inheritAttrs: true
// })
defineSlots<{
  content?: (props: { item: T }) => any;
}>();

defineProps<HelloWorldProps<T>>();

const attrs = useAttrs();
console.log("attrs", attrs);
const count = ref(0);

const { copied, copy, text, isSupported } = useClipboard({ legacy: true }); // legacy 表示降级https://juejin.cn/post/7236656669752590391?utm_source=gold_browser_extension#heading-6
// css
const el = ref()
const color = useCssVar('--color', el)

const click = async () => {
  console.log('xxx', color.value)
  if (color.value === '#244035') {
    color.value = '#7fa998'
  } else {
    color.value = '#244035'
  }
  return await copy("文章看完了，别忘了评论、点赞、关注哦，你真棒~~");
};

</script>

<template>
  <div>
    <h1><img src="@/assets/images/cbd.png">{{ msg }}</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <ul>
        <li v-for="item in list" :key="item.value">
          {{ item.label }}
          <slot name="content" :item="item" />
        </li>
      </ul>
      <div>
        text: {{ text }}<br>copied: {{ copied }}<br>isSupported:
        {{ isSupported }}
      </div>
      <el-button ref="el" style="--color: #7fa998;" :style="{ color: color }" @click="click" :loading="copied">Copy {{ color }}</el-button>
      <Form />
      <Snabbdom />
    </div>
  </div>
</template>
