import { ref } from "vue"

interface Resp<T = any> {
    code: number
    data: T
    message: string
}
export const useRequest = <T = any>(api: Promise<Resp>, defaultValue?: any) => {
    const loading = ref(true)
    const data = ref<T>(defaultValue)
    api.then(resp => {
        loading.value = false
        data.value = resp.data
    }).catch(() => loading.value = false)
    return {
        loading,
        data,
    }
}
