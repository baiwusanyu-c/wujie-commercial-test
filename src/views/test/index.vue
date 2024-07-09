<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRequest } from '@/hooks/use-request'
import { getCupShapeds } from '@/api/test'
import HelloWorld from '@/components/hello-world/index.vue'
import Comp from '@/components/slot-component/comp1.vue'
// import Comp from '@/components/slot-component/comp2.vue'
import { EncryptionFactory } from '@/utils/cipher'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const { loading, data } = useRequest(getCupShapeds(), [])
function getSignToken(token: string) {
  let secretKey = (token ?? '').slice(-32)
  let zero = ''
  const length = secretKey.length
  for (let i = 0; i < 32 - length; i++) {
    zero += '0'
  }
  return zero + secretKey
}
const persistEncryption = EncryptionFactory.createAesEncryption({ key: getSignToken(userStore.token), iv: 'PKCS5Padding' })
const plaintext = '171955200267912' || (Date.now() + 10000).toString()
// 签名
const autograph = ref() as any
// 加密
const encrypt = () => {
  const res = persistEncryption.encrypt(plaintext)
  autograph.value = res
}
// 解密
const decrypt = () => {
  const res = persistEncryption.decrypt('auf4w4mROiM8WwiivxQXsA==')
  autograph.value = res
}
const user = reactive<any>({ name: 'liyang' })
console.log('sss', user['__v_isReactive'], autograph['__v_isReadonly'])
</script>

<template>
  <HelloWorld v-loading="loading" msg="Vite@4.3.5 + Vue@3.3" :list="data">
    <template #content="scope">
      <span :style="{ color: scope.item.color }">{{ scope.item.value }}</span>
    </template>
  </HelloWorld>
  <Comp>
    <p>default slot</p>
    <template #slot1>
      <p>solt1</p>
    </template>
    <template #slot2="{ msg }">
      <p>solt2：{{ msg }}</p>
    </template>
  </Comp>
  <div>
    <h1>加密</h1>
    1. 加密方式：AES对称加密<br>
    2. 加密模式：ECB<br>
    3. 填充：PKCS5Padding<br>
    4. 秘钥：token的后32位（不足32位时，字符串首部补充0(0 ~ 32)）<br>
    5. 加密内容：当前时间戳（毫秒）+10000<br>
    加密内容：{{ plaintext }}
    <el-button class="qqqqqqqqqqqqqqqq" type="primary" @click="encrypt">加密</el-button>
    <el-button type="primary" @click="decrypt">解密</el-button>
    {{ autograph }}
  </div>
</template>

<style scoped>
.gao {
  color: var(--el-color-primary);
}
</style>
