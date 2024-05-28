import request from '@/utils/request'
import type { User } from './interface'

export const getUserInfo = () => {
  return request({
    url: '/user/login',
    method: 'get'
  })
}

export const getUserList = (data: User.ReqUserParams) => {
  return request<User.ResUserList>({
    url: '/user/list',
    method: 'post',
    data,
  })
}