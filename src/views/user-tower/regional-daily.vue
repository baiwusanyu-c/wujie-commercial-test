<template>
  <WujieVue ref="wujieVueRef" width="100%" height="100%" name="regional-daily" :url="props.url" :props="props" :plugins="plugins" />
</template>

<script lang="ts" setup name="UserLabel">
import WujieVue from 'wujie-vue3'
import { InstanceofPlugin } from 'wujie-polyfill'
import { ref, onUnmounted } from 'vue'

const wujieVueRef = ref()

const { destroyApp } = WujieVue
const props = {
  // url: 'http://192.168.125.241:3013/data-dashboard-web/regional-daily',
  url: 'http://192.168.125.241:3013/data-dashboard-web/commodity',
  // url: 'https://datadashboard-uat.shuxinyc.com/data-dashboard-web/commodity',
  // url: 'https://datadashboard-dev.shuxinyc.com/data-dashboard-web/regional-daily',
  parentName: 'dpw',
  userInfo: {
    accountNm: 'liyang',
    jobNumber: '1000004235',
    name: '李洋',
  },
}
const plugins = [
  InstanceofPlugin(),
  {
    patchElementHook(element: Element, iframeWindow: Window) {
      if (element.nodeName === 'STYLE') {
        element.insertAdjacentElement = function (_position, ele) {
          iframeWindow.document.head.appendChild(ele)
        }
      }
    },
    // cssBeforeLoaders: [
    //   {
    //     content: 'body{position: relative !important} .el-popper{position: absolute !important;}',
    //   },
    // ],
    // jsBeforeLoaders: [{
    //   callback: (appWindow: Window) => {
    //     console.log('=appWindow==', appWindow)
    //     return window
    //   }
    // }],
    jsLoader(code: string, url: string, base: string) {
      console.log('==========1111111', { code, url, base })
      if (code.includes('popper')) {
      }
      return code
    },
  },
]

// function appendOrInsertElementHook(element: Element, iframeWindow: Window) {
//   if (element.offsetParent && element.offsetParent.tagName !== 'BODY') {
//     return
//   }
//   const offsetParentDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
//   Object.defineProperties(element, {
//     offsetParent: {
//       configurable: true,
//       get: function () {
//         const offsetParent = offsetParentDesc.get.call(this)
//         if ((offsetParent && offsetParent.tagName !== 'BODY') || element.style.position !== 'fixed') {
//           return offsetParent
//         }
//         return new Proxy(window.document.documentElement, {
//           get: (target, propKey) => {
//             if (propKey === 'parentNode') {
//               return iframeWindow.document.documentElement.parentNode
//             }
//             const value = target[propKey]
//             const naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined'
//             // 只有这些场景下才需要 bind
//             if (
//               (naughtySafari ? typeof value === 'function' && typeof value !== 'undefined' : typeof value === 'function') &&
//               !(value.name.indexOf('bound ') === 0 && !value.hasOwnProperty('prototype'))
//             ) {
//               const boundValue = Function.prototype.bind.call(value, target)
//               for (const key in value) {
//                 boundValue[key] = value[key]
//               }
//               if (value.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) {
//                 Object.defineProperty(boundValue, 'prototype', {
//                   value: value.prototype,
//                   enumerable: false,
//                   writable: true,
//                 })
//               }
//               return boundValue
//             }
//             return value
//           },
//         })
//       },
//     },
//   })
// }
onUnmounted(() => {
  destroyApp('regional-daily')
})
</script>
