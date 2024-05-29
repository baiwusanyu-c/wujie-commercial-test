/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-05-29 18:03:56
 * @LastEditors: liyang
 * @Description: 上传文件
 */
import { resultSuccess } from '../../_util'
import type { MockMethod } from 'vite-plugin-mock'
import type { Response } from '../../_interface'

const uploadList = (() => {
  const result: any[] = []
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      classification: '@first',
      tableName: '@first',
      tableNa: '@first',
      'tableType|1': ['1', '2', '3'],
      createTime: '@datetime',
      updateTime: '@datetime',
      'dataSource|1': ['1', '2', '3', '4'],
      tableCode: '@cword(10,20)',
    })
  }
  return result
})()
const recordList = (() => {
  const result: any[] = []
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      fileName: '@first',
      fileVersion: 'v1.0.0',
      fileSize: '128KB',
      fileRow: '305',
      'status|1': ['1', '2', '3'],
      operator: '@cname()',
      createTime: '@datetime',
      updateTime: '@datetime',
    })
  }
  return result
})()
export default [
  {
    url: '/upload/list',
    timeout: 1000,
    method: 'post',
    response: ({ body }: Response) => {
      const { pageNo = 1, pageSize = 10 } = body
      return resultSuccess({ totalNumber: 70, pageNo, pageSize, list: uploadList })
    },
  },
  {
    url: '/upload/add',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess(null, { msg: '创建成功' })
    },
  },
  {
    url: '/upload/edit',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess(null, { msg: '修改成功' })
    },
  },
  {
    url: '/upload/delete',
    timeout: 100,
    method: 'post',
    response: () => {
      return resultSuccess(null, { msg: '删除成功' })
    },
  },
  {
    url: '/upload/file',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess(null, { msg: '上传成功' })
    },
  },
  {
    url: '/upload/record',
    timeout: 1000,
    method: 'post',
    response: ({ body }: Response) => {
      const { pageNo = 1, pageSize = 10 } = body
      return resultSuccess({ totalNumber: 30, pageNo, pageSize, list: recordList })
    },
  },
] as MockMethod[]
