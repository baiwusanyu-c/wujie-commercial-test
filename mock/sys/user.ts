/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-05-29 10:43:27
 * @LastEditors: liyang
 * @Description: 用户信息
 */
import { resultSuccess } from '../_util'
import type { MockMethod } from 'vite-plugin-mock'
import type { Response } from '../_interface'

const userList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      userName: '@first',
      email: '@email',
      // createUser: '@cname()',
      createUser: '@first',
      role: '@first',
      createTime: '@datetime',
      updateTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['1', '2', '3'],
      failReason: '@cword(5,20)'
    });
  }
  return result;
})();
export default [
  {
    url: '/user/login',
    timeout: 1000,
    method: 'get',
    response: () => {
      const res = {
        userName: 'liyang',
        phoneNumber: '18228329236'
      }
      return resultSuccess(res)
    },
  },
  {
    url: '/user/list',
    timeout: 1000,
    method: 'post',
    response: ({ body }: Response) => {
      const { pageNo = 1, pageSize = 10 } = body
      return resultSuccess({ totalNumber: 100, pageNo, pageSize, list: userList })
    },
  },
  {
    url: '/user/add',
    timeout: 1000,
    method: 'post',
    response: ({ body }: Response) => {
      return resultSuccess(null, { msg: '创建成功' })
    },
  },
  {
    url: '/user/edit',
    timeout: 1000,
    method: 'post',
    response: ({ body }: Response) => {
      return resultSuccess(null, { msg: '修改成功' })
    },
  },
] as MockMethod[]
