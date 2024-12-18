/*
 * @Author: liyang1
 * @Date: 2023-04-07 10:45:51
 * @LastEditTime: 2024-12-18 17:23:38
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
  // {
  //   id: '3',
  //   label: 'PC数据看板',
  //   path: '',
  //   name: '',
  //   meta: { title: 'PC数据看板' },
  //   children: [
  //     {
  //       id: '3-1',
  //       label: '区域日报',
  //       path: '/regional-daily',
  //       name: 'regional-daily',
  //       meta: { title: '区域日报' },
  //     },
  //   ],
  // },
  // {
  //   id: '4',
  //   label: '用户',
  //   path: '',
  //   name: '',
  //   meta: { title: '用户' },
  //   children: [
  //     {
  //       id: '4-1',
  //       label: '用户管理',
  //       path: '/user-manages',
  //       name: 'user-manages',
  //       meta: { title: '用户管理' },
  //     },
  //     {
  //       id: '4-2',
  //       label: '分组管理',
  //       path: '/user-groups',
  //       name: 'user-groups',
  //       meta: { title: '分组管理' },
  //     },
  //   ],
  // },
  {
    id: '5',
    label: '报表中心',
    path: '',
    name: '',
    meta: { title: '报表中心' },
    children: [
      {
        id: '5-1',
        label: '订单明细',
        path: '/order-detail',
        name: 'order-detail',
        meta: { title: '订单明细', link: '/home/order-detail' },
      },
      {
        id: '5-2',
        label: '收银明细',
        path: '/cashier-detail',
        name: 'cashier-detail',
        meta: { title: '收银明细', link: '/home/cashier-detail' },
      },
      {
        id: '5-3',
        label: '营业汇总分析',
        path: '/business-summary',
        name: 'business-summary',
        meta: { title: '营业汇总分析', link: '/home/business-summary' },
      },
      {
        id: '5-4',
        label: '菜品销售总汇',
        path: '/dishes-summary',
        name: 'dishes-summary',
        meta: { title: '菜品销售总汇', link: '/home/dishes-summary' },
      },
      {
        id: '5-5',
        label: '储值卡明细',
        path: '/debit-card-detail',
        name: 'debit-card-detail',
        meta: { title: '储值卡明细', link: '/home/debit-card-detail' },
      },
      {
        id: '5-6',
        label: '储值卡汇总',
        path: '/debit-card-summary',
        name: 'debit-card-summary',
        meta: { title: '储值卡汇总', link: '/home/debit-card-summary' },
      },
      {
        id: '5-7',
        label: '门店订货明细',
        path: '/store-ordering-detail',
        name: 'store-ordering-detail',
        meta: { title: '门店订货明细', link: '/home/store-ordering-detail' },
      },
      {
        id: '5-8',
        label: '门店订货汇总',
        path: '/store-summary',
        name: 'store-summary',
        meta: { title: '门店订货汇总', link: '/home/store-summary' },
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
