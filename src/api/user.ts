import request from '@/utils/request'
import type { User } from './interface'

export const getUserInfo = () => {
  return request({
    url: '/user/login',
    method: 'get',
  })
}

export const getUserList = (data: User.ReqUserParams) => {
  return request<User.ResUserList>({
    url: '/user/list',
    method: 'post',
    data,
  })
}

export const addUser = (data: User.ReqUserParams) => {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

export const editUser = (data: User.ReqUserParams) => {
  return request({
    url: '/user/edit',
    method: 'post',
    data,
  })
}
