import { defineStore } from 'pinia'
const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      this.token = userInfo.token
    },
  },
  persist: true,
},)

export default useUserStore
