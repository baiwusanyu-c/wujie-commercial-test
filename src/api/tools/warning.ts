import request from '@/utils/request'

export const getWarningList = (data: any) => {
  return request({
    url: '/warning/list',
    method: 'post',
    data,
  })
}
