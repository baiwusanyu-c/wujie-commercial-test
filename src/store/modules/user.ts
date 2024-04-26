import { defineStore } from 'pinia'
const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    brand: '', // 品牌
    phoneNumber: '', // 手机号
    menuList: [],
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      this.token = userInfo.token
    },
    setBrand(value: string) {
      this.brand = value
    },
    setUserInfo({ phoneNumber }: any) {
      this.phoneNumber = phoneNumber
    },
    getUserInfo() {
      return { phoneNumber: this.phoneNumber, authInsight: this.authInsight }
    },
    setMenuList(data: any) {
      this.menuList = data
    },
  },
  persist: true,
})

export default useUserStore
