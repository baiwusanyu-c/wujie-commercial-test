import { defineStore } from 'pinia'
import { MenuListItem } from '@/utils/interface'
const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    brand: '', // 品牌
    phoneNumber: '', // 手机号
    menuList: [] as MenuListItem[],
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      this.token = userInfo.token
    },
    setBrand(value: string) {
      this.brand = value
    },
    setUserInfo({ phoneNumber, menuList }: any) {
      this.phoneNumber = phoneNumber
      this.menuList = menuList
    },
    getUserInfo() {
      return { phoneNumber: this.phoneNumber, authInsight: this.authInsight }
    },
  },
  persist: true,
})

export default useUserStore
