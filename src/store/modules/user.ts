import { defineStore } from 'pinia'
import { MenuListItem } from '@/utils/interface'
import userSvg from '@/assets/svg/user.svg'
const useUserStore = defineStore('user', {
  state: () => ({
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqc29uIjoie1wiYWNjb3VudE5tXCI6XCJsaXlhbmdcIixcImpvYk51bWJlclwiOlwiMTAwMDAwNDIzNVwiLFwibmFtZVwiOlwi5p2O5rSLXCJ9IiwiZXhwIjoxNzE5NTk3OTc4fQ.2Mv-rAB_mHK4kzFgdPrsWO5tLszF2thv7DWlVpAkyFU',
    brand: '', // 品牌
    phoneNumber: '', // 手机号
    menuList: [] as MenuListItem[],
    name: '',
    avatar: '', // 头像
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      this.token = userInfo.token
      this.name = userInfo.userName
      this.avatar = userSvg
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
