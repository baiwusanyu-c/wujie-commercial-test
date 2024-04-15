import { defineStore } from 'pinia'
const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    brand: '',
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      this.token = userInfo.token
    },
    setBrand(value: string) {
      this.brand = value
    },
  },
  persist: true,
},)

export default useUserStore
