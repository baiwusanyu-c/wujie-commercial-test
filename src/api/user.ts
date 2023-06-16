// import request from '@/utils/request'
import type { User } from './interface'
/**
 * @name 用户管理模块
 */
// * 获取用户列表
export const getCupShapeds = () => {
  return new Promise<{
    code: number
    data: User.ResCupShapeds
    message: string
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { label: '超大杯', value: 2, color: 'red' },
          { label: '大杯', value: 1, color: 'blue' },
          { label: '中杯', value: 2, color: 'pink' },
        ],
        message: '成功',
      })
    }, 0)
  })
}
