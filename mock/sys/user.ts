/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-06-03 15:43:36
 * @LastEditors: liyang
 * @Description: 用户信息
 */
import { responseResult } from '../_util'
import type { MockMethod } from 'vite-plugin-mock'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Response } from '../_interface'

const userList = (() => {
  const result: any[] = []
  for (let index = 0; index < 10; index++) {
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
      failReason: '@cword(5,20)',
    })
  }
  return result
})()
export default [
  {
    url: '/user/login',
    timeout: 1000,
    method: 'get',
    response: () => {
      const res = {
        userName: 'liyang',
        phoneNumber: '18228329236',
      }
      return responseResult({ data: res })
    },
  },
  {
    url: '/user/list',
    timeout: 1000,
    method: 'post',
    statusCode: 200,
    response: ({ body }: Response) => {
      const { pageNo = 1, pageSize = 10 } = body
      return responseResult({ data: { totalNumber: 100, pageNo, pageSize, list: userList } })
    },
  },
  {
    url: '/user/add',
    timeout: 1000,
    method: 'post',
    async rawResponse (req: IncomingMessage, res: ServerResponse) {
      try {
        await new Promise((resolve, reject) => {
          req.on('data', (chunk) => {
            const reqData = JSON.parse(chunk.toString()) as { userName: string }
            if (reqData.userName.length > 10) {
              reject(responseResult({ code: 500, msg: '用户名称不能大于20个字符' }))
              return
            }
          })
          req.on('end', () => resolve(undefined))
        })
        res.setHeader('Content-Type', 'application/json;charset=utf-8')
        res.end(JSON.stringify(responseResult({ msg: '创建成功' })))
      } catch (e) {
        console.log('error>>>', e)
        res.end(JSON.stringify(e))
      }
    },
  },
  {
    url: '/user/edit',
    timeout: 1000,
    method: 'post',
    async rawResponse (req: IncomingMessage, res: ServerResponse) {
      try {
        await new Promise((resolve, reject) => {
          req.on('data', (chunk) => {
            const reqData = JSON.parse(chunk.toString()) as { userName: string }
            if (reqData.userName.length > 10) {
              reject(responseResult({ code: 500, msg: '用户名称不能大于20个字符' }))
              return
            }
          })
          req.on('end', () => resolve(undefined))
        })
        res.setHeader('Content-Type', 'application/json;charset=utf-8')
        res.end(JSON.stringify(responseResult({ msg: '修改成功' })))
      } catch (e) {
        console.log('error>>>', e)
        res.end(JSON.stringify(e))
      }
    },
  },
] as MockMethod[]
