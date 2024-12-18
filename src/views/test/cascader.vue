<script setup lang="ts">
import { ref } from 'vue'
import Cascader, { type CascaderInstance } from '@/components/cascader'
import CustomCascader from '@/components/custom-cascader'
import type { CascaderOption } from 'element-plus'

const cascaderRef = ref<CascaderInstance>()
const operCenter = ref()
const options = ref<CascaderOption[]>([])
const handleOperChange = () => {}
const titles = ['省', '市', '区']
const visibleChange = () => {
  // if (!val) return
  // if (!operCenter.value && options.value.length > 0) {
  //   if (cascaderRef.value?.cascaderPanelRef?.menus) {
  //     cascaderRef.value.cascaderPanelRef.menus = [
  //       options.value,
  //       options.value[0].children || [],
  //       options.value[0].children ? options.value[0].children[0].children || [] : [],
  //     ]
  //   }
  // }
}
const operCenter2 = ref()
const operCenter3 = ref()
const init = () => {
  setTimeout(() => {
    options.value = [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency',
              },
              {
                value: 'feedback',
                label: 'Feedback',
              },
              {
                value: 'efficiency',
                label: 'Efficiency',
              },
              {
                value: 'controllability',
                label: 'Controllability',
              },
            ],
          },
          {
            value: 'navigation',
            label: 'Navigation',
            children: [
              {
                value: 'side nav',
                label: 'Side Navigation',
              },
              {
                value: 'top nav',
                label: 'Top Navigation',
              },
            ],
          },
        ],
      },
      {
        value: 'component',
        label: 'Component',
        children: [
          {
            value: 'basic',
            label: 'Basic',
            children: [
              {
                value: 'layout',
                label: 'Layout',
              },
              {
                value: 'color',
                label: 'Color',
              },
              {
                value: 'typography',
                label: 'Typography',
              },
              {
                value: 'icon',
                label: 'Icon',
              },
              {
                value: 'button',
                label: 'Button',
              },
            ],
          },
          {
            value: 'form',
            label: 'Form',
            children: [
              {
                value: 'radio',
                label: 'Radio',
              },
              {
                value: 'checkbox',
                label: 'Checkbox',
              },
              {
                value: 'input',
                label: 'Input',
              },
              {
                value: 'input-number',
                label: 'InputNumber',
              },
              {
                value: 'select',
                label: 'Select',
              },
              {
                value: 'cascader',
                label: 'Cascader',
              },
              {
                value: 'switch',
                label: 'Switch',
              },
              {
                value: 'slider',
                label: 'Slider',
              },
              {
                value: 'time-picker',
                label: 'TimePicker',
              },
              {
                value: 'date-picker',
                label: 'DatePicker',
              },
              {
                value: 'datetime-picker',
                label: 'DateTimePicker',
              },
              {
                value: 'upload',
                label: 'Upload',
              },
              {
                value: 'rate',
                label: 'Rate',
              },
              {
                value: 'form',
                label: 'Form',
              },
            ],
          },
          {
            value: 'data',
            label: 'Data',
            children: [
              {
                value: 'table',
                label: 'Table',
              },
              {
                value: 'tag',
                label: 'Tag',
              },
              {
                value: 'progress',
                label: 'Progress',
              },
              {
                value: 'tree',
                label: 'Tree',
              },
              {
                value: 'pagination',
                label: 'Pagination',
              },
              {
                value: 'badge',
                label: 'Badge',
              },
            ],
          },
          {
            value: 'notice',
            label: 'Notice',
            children: [
              {
                value: 'alert',
                label: 'Alert',
              },
              {
                value: 'loading',
                label: 'Loading',
              },
              {
                value: 'message',
                label: 'Message',
              },
              {
                value: 'message-box',
                label: 'MessageBox',
              },
              {
                value: 'notification',
                label: 'Notification',
              },
            ],
          },
          {
            value: 'navigation',
            label: 'Navigation',
            children: [
              {
                value: 'menu',
                label: 'Menu',
              },
              {
                value: 'tabs',
                label: 'Tabs',
              },
              {
                value: 'breadcrumb',
                label: 'Breadcrumb',
              },
              {
                value: 'dropdown',
                label: 'Dropdown',
              },
              {
                value: 'steps',
                label: 'Steps',
              },
            ],
          },
          {
            value: 'others',
            label: 'Others',
            children: [
              {
                value: 'dialog',
                label: 'Dialog',
              },
              {
                value: 'tooltip',
                label: 'Tooltip',
              },
              {
                value: 'popover',
                label: 'Popover',
              },
              {
                value: 'card',
                label: 'Card',
              },
              {
                value: 'carousel',
                label: 'Carousel',
              },
              {
                value: 'collapse',
                label: 'Collapse',
              },
            ],
          },
        ],
      },
      {
        value: 'resource',
        label: 'Resource',
        children: [
          {
            value: 'axure',
            label: 'Axure Components',
          },
          {
            value: 'sketch',
            label: 'Sketch Templates',
          },
          {
            value: 'docs',
            label: 'Design Documentation',
          },
        ],
      },
    ]
  }, 100)
}
init()

sessionStorage.setItem('user', 'liyang')
</script>

<template>
  <div class="p20px flex justify-end">
    <div class="w260px">
      内部：
      <Cascader
        ref="cascaderRef"
        v-model="operCenter"
        :titles="titles"
        placeholder="请选择"
        :options="options"
        :props="{ multiple: true }"
        filterable
        clearable
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="1"
        separator="-"
        style="width: 100%"
        @change="handleOperChange"
        @visible-change="visibleChange"
      />
      <CustomCascader
        ref="cascaderRef3"
        v-model="operCenter3"
        :titles="titles"
        placeholder="请选择"
        :options="options"
        :props="{ multiple: true }"
        filterable
        clearable
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="1"
        separator="-"
        style="width: 100%"
        @change="handleOperChange"
      />
      el-cascader：
      <el-cascader
        ref="cascaderRef2"
        v-model="operCenter2"
        :titles="titles"
        placeholder="请选择"
        :options="options"
        :props="{ multiple: true }"
        filterable
        clearable
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="1"
        separator="-"
        style="width: 100%"
        @change="handleOperChange"
        @visible-change="visibleChange"
      />
    </div>
  </div>
</template>

<style scoped></style>
