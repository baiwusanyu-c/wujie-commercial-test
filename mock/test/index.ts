import { resultSuccess } from '../_util'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/test/cupshapeds',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess([
        { label: 'cpu1', value: 'cpu1', color: '#52C41A' },
        { label: 'cpu2', value: 'cpu2', color: '#F53F3F' },
        { label: 'cpu3', value: 'cpu3', color: 'pink' },
      ])
    },
  },
] as MockMethod[]
