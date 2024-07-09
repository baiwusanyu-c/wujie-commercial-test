import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { DataZoomComponent, GridComponent, LegendComponent, MarkLineComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import { ThemeEnum } from '@/enums/theme'
import echartsTheme from './theme'

echarts.use([
  SVGRenderer,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  DataZoomComponent,
  MarkLineComponent,
])
echarts.registerTheme(ThemeEnum.DEFAULT, echartsTheme.default)
export type EChartsOption = import('echarts').EChartsOption
export default echarts
