import { defineStore } from 'pinia'
const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    brand: '', // 品牌
    phoneNumber: '', // 手机号
    authInsight: true, // 人群洞察权限
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
    setUserInfo({ phoneNumber, authInsight }: any) {
      this.phoneNumber = phoneNumber
      this.authInsight = authInsight
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
