import { ThemeEnum } from '@/enums/theme'
import type { EChartsOption } from 'echarts'
const defaultOptions: EChartsOption = {
  title: {
    left: 'center',
  },
  // animation: false,
}

export default {
  [ThemeEnum.DEFAULT]: {
    ...defaultOptions,
  },
}
