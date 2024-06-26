import { defineStore } from 'pinia'
import { MenuListItem } from '@/utils/interface'
import userSvg from '@/assets/svg/user.svg'
const useUserStore = defineStore('user', {
  state: () => ({
    token: '9d0bffe84d0b4f03a654169495fcc2f2',
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
