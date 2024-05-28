import request from '@/utils/request'

export const getUserMenus = () => {
  return request({
    url: '/menus',
    method: 'post',
  })
}
