import { ref } from 'vue'

interface ResponseResult<T = any> {
  code: number
  data: T
  msg: string
  traceId: string
}
export const useRequest = <T = any>(api: Promise<ResponseResult>, defaultValue?: any) => {
  const loading = ref(true)
  const data = ref<T>(defaultValue)
  api
    .then((resp) => {
      loading.value = false
      data.value = resp.data
    })
    .catch(() => (loading.value = false))
  return {
    loading,
    data,
  }
}
