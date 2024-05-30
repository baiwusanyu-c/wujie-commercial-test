import request from '@/utils/request'

export const getCupShapeds = () => {
  return request({
    url: '/test/cupshapeds',
    method: 'get'
  })
}