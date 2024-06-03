import request from '@/utils/request'
import type { Tools } from '../interface'

export const getWarningList = (data: any) => {
  return request({
    url: '/warning/list',
    method: 'post',
    data,
  })
}
