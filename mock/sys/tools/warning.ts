/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-06-03 14:55:38
 * @LastEditors: liyang
 * @Description: 业务预警
 */
import { resultSuccess } from '../../_util'
import type { MockMethod } from 'vite-plugin-mock'
import type { IncomingMessage, ServerResponse } from 'http'

export default [
  {
    url: '/warning/list',
    timeout: 1000,
    method: 'post',
    rawResponse: async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.statusCode = 200
      res.end(JSON.stringify(resultSuccess('业务预警')))
    },
  },
] as MockMethod[]
