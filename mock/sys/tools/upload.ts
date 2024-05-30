/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-05-30 14:38:58
 * @LastEditors: liyang
 * @Description: 上传文件
 */
import { resultSuccess } from '../../_util'
import type { MockMethod } from 'vite-plugin-mock'
import type { Response } from '../../_interface'

const uploadList = (() => {
  const result: any[] = []
  for (let index = 0; index < 10; index++) {
    result.push({
      id: `${index}`,
      classification: '@first',
      tableName: '@first',
      tableNa: '@first',
      'tableType|1': ['1', '2', '3'],
      createTime: '@datetime',
      updateTime: '@datetime',
      'dataSource|1': ['1', '2', '3', '4'],
      tableCode: `CREATE TABLE data_example (
      data_example_name varchar(32) DEFAULT NULL COMMENT '样例字段名称',
      data_example_type varchar(32) DEFAULT NULL COMMENT '样例类型',
      create_person varchar(32) DEFAULT NULL COMMENT '创建人',
      update_person varchar(32) DEFAULT NULL COMMENT '更新人'
    ) ENGINE=InnoDB COMMENT='样例表';`,
    })
  }
  return result
})()
const recordList = (() => {
  const result: any[] = []
  for (let index = 0; index < 10; index++) {
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
    timeout: 100,
    method: 'post',
    response: ({ body }: Response) => {
      const { pageNo = 1, pageSize = 10 } = body
      return resultSuccess({ totalNumber: 30, pageNo, pageSize, list: recordList })
    },
  },
  {
    url: '/upload/datasource',
    timeout: 100,
    method: 'post',
    response: () => {
      return resultSuccess([
        { label: '文件上传数据源【统一源】', value: '1' },
        { label: '文件上传数据源【1】', value: '2' },
        { label: '文件上传数据源【2】', value: '3' },
        { label: '文件上传数据源【3】', value: '4' },
      ])
    },
  },
] as MockMethod[]
