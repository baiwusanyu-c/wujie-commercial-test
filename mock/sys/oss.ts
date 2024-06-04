/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-05-30 11:46:03
 * @LastEditors: liyang
 * @Description: OSS上传
 */
import { resultSuccess } from '../_util'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/oss/template/download/url/:id',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess('user-portrait-service-qa/user-group/template/crowd_package_template.xlsx')
    },
  },
  {
    url: '/oss/aliyun/policy',
    timeout: 100,
    method: 'get',
    response: () => {
      const res = {
        accessKeyId: 'LTAI5tNyTE2xiYncW4SxUztX',
        dir: 'user-portrait-service-qa/user-group/upload/20240528/',
        host: 'https://cbd-bigdata.oss-cn-hangzhou.aliyuncs.com',
        policy:
          'eyJleHBpcmF0aW9uIjoiMjAyNC0wNS0zMFQwMjowMTo1Mi40OTdaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsNTI0Mjg4MDBdLFsic3RhcnRzLXdpdGgiLCIka2V5IiwidXNlci1wb3J0cmFpdC1zZXJ2aWNlLXFhL3VzZXItZ3JvdXAvdXBsb2FkLzIwMjQwNTI4LyJdXX0=',
        signature: 'B73oZuMXE+NNTxHynCMhFtxSVAk=',
      }
      return resultSuccess(res, { msg: '签名成功' })
    },
  },
  {
    url: '/oss/upload',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess(null, { msg: '上传成功' })
    },
  },
] as MockMethod[]
