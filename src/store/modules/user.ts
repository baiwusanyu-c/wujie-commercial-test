import { defineStore } from 'pinia'
import { MenuListItem } from '@/utils/interface'
import userSvg from '@/assets/svg/user.svg'
const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    phoneNumber: '', // 手机号
    menuList: [] as MenuListItem[],
    name: '',
    avatar: '', // 头像
    groupId: '', // 集团id
    brandId: '', // 品牌id
    brandName: '', // 品牌名称
    env: {} as { label: string; value: string; dataPortalUrl: string; commRedirectUrl: string },
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      this.name = userInfo.userName
      this.avatar = userSvg
    },
    setBrand(brandId: string, brandName: string) {
      this.brandId = brandId
      this.brandName = brandName
    },
    setUserInfo({ env, phoneNumber, menuList, token, groupId }: any) {
      this.env = env
      this.phoneNumber = phoneNumber
      this.menuList = menuList
      this.token = token
      this.groupId = groupId
    },
    getUserInfo() {
      return { phoneNumber: this.phoneNumber, authInsight: this.authInsight }
    },
  },
  persist: true,
})

export default useUserStore
