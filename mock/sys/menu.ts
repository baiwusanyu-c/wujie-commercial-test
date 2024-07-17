/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-07-17 16:34:23
 * @LastEditors: liyang
 * @Description: 菜单路由配置
 */
import { resultSuccess } from '../_util'
import type { MockMethod } from 'vite-plugin-mock'

/** 菜单 */
const menus = [
  {
    id: '1',
    label: '人群智库',
    path: '',
    name: '',
    meta: { title: '人群智库' },
    children: [
      {
        id: '1-1',
        label: '用户群体',
        path: '/user-tower',
        name: 'user-tower',
        meta: { title: '用户群体' },
      },
      {
        id: '1-2',
        label: '人群洞察',
        path: '/crowd-insight',
        name: 'crowd-insight',
        meta: { title: '人群洞察' },
      },
    ],
  },
  {
    id: '2',
    label: '标签管理',
    path: '',
    name: '',
    meta: { title: '标签管理' },
    children: [
      {
        id: '2-1',
        label: '用户标签',
        path: '/user-label',
        name: 'user-label',
        meta: { title: '用户标签' },
      },
    ],
  },
  {
    id: '3',
    label: 'PC数据看板',
    path: '',
    name: '',
    meta: { title: 'PC数据看板' },
    children: [
      {
        id: '3-1',
        label: '区域日报',
        path: '/regional-daily',
        name: 'regional-daily',
        meta: { title: '区域日报' },
      },
    ],
  },
]
export default [
  {
    url: '/menus',
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(menus)
    },
  },
] as MockMethod[]
