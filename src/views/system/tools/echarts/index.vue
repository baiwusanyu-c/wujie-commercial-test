<script lang="ts" setup>
import * as echarts from 'echarts'
const comName = [
  '5月20日\n（星期一）',
  '5月21日\n（星期二）',
  '5月23日\n（星期三）',
  '5月24日\n（星期四）',
  '5月25日\n（星期五）',
  '5月26日\n（星期六）',
  '5月27日\n（星期日）',
]
const giveInterestPrice = [55555.5, 66666.6, 44444.4, 33333.3, 8767.1, 15432.1, 22333]
const avgPriceRate1 = [-1.7, -2.8, -3.9, -6.5, -0.8, 6.6, 9]
const avgPriceRate2 = [-3.7, -6.8, -2.9, -10.5, -0.8, 9.6, 8]

const citys = [
  '盘水市1',
  '盘水市2',
  '哈尔滨市',
  '盘水市4',
  '盘水市5',
  '盘水市6',
  '盘水市7',
  '盘水市8',
  '盘水市9',
  '盘水市a',
  '盘水市b',
  '盘水市c',
  '盘水市d',
  '盘水市e',
  '盘水市f',
  '盘水市g',
  '盘水市h',
  '盘水市l',
  '盘水市m',
  '盘水市20',
]
const operCenters = [
  '延边朝鲜族自治州',
  '延边朝鲜族自治州2',
  '延边朝鲜族自治州3',
  '延边朝鲜族自治州4',
  '延边朝鲜族自治州5',
  '延边朝鲜族自治州6',
  '延边朝鲜族自治州7',
  '延边朝鲜族自治州8',
  '延边朝鲜族自治州9',
  '延边朝鲜族自治州a',
  '延边朝鲜族自治州b',
  '延边朝鲜族自治州c',
  '延边朝鲜族自治州d',
  '延边朝鲜族自治州e',
  '延边朝鲜族自治州f',
  '延边朝鲜族自治州g',
  '延边朝鲜族自治州h',
  '延边朝鲜族自治州l',
  '延边朝鲜族自治州m',
  '延边朝鲜族自治20',
]
const y1 = [
  55555.5, 66666.6, 44444.4, 33333.3, 8767.1, 15432.1, 22333, 55555.5, 66666.6, 44444.4, 33333.3, 8767.1, 15432.1, 22333, 55555.5, 66666.6,
  44444.4, 33333.3, 8767.1, 15432.1,
]
const y2 = [-1.7, -2.8, -3.9, -6.5, -0.8, 6.6, 9, -1.7, -2.8, -3.9, -6.5, -0.8, 6.6, 9, -1.7, -2.8, -3.9, -6.5, -0.8, 6.6]
const y3 = [-3.7, -6.8, -2.9, -10.5, -0.8, 9.6, 8, -3.7, -6.8, -2.9, -10.5, -0.8, 9.6, 8, -3.7, -6.8, -2.9, -10.5, -0.8, 9.6]
function getTableLine(num: any) {
  const width = 1279
  const list = [] as any[]
  const bottom = 70
  const height = 24
  for (let i = 0; i < num; i++) {
    list.push({
      type: 'line',
      bottom: bottom - i * height,
      right: 0,
      style: {
        // fill: '#E4E6F0',
        stroke: '#E4E6F0',
      },
      shape: {
        x1: 0,
        y1: 0,
        x2: width,
        y2: 0,
      },
    })
  }
  return list
}
const lineList = getTableLine(4)
function getOption1(xData: any, yData1: any, yData2: any, yData3: any, padding: any[], labelValueCallBack?: (...arg: any[]) => any) {
  return {
    grid: {
      bottom: 40,
      left: 16,
      right: 2,
      top: 70,
    },
    legend: {
      show: false,
      left: -12,
      bottom: 0,
      padding: 0,
      itemWidth: 0,
      itemGap: 0,
      orient: 'vertical',
      formatter(name: any) {
        return name === 'h' ? '%' : name
      },
      itemStyle: {
        opacity: 0,
      },
      lineStyle: {
        opacity: 0,
      },
      selectedMode: false,
      textStyle: {
        height: 24,
        width: 14,
        fontWeight: 'bold',
        padding: [0, 0, 0, 2],
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xData,
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        rotate: 0,
        formatter(value: any) {
          const str = labelValueCallBack ? labelValueCallBack(value) : value
          return `{table1|${str}}`
        },
        rich: {
          table1: {
            verticalAlign: 'middle',
            align: 'center',
            color: '#888F9E',
          },
        },
      },
    },
    yAxis: [
      {
        show: false,
        type: 'value',
      },
      {
        show: false,
        type: 'value',
      },
      {
        show: false,
        type: 'value',
      },
    ],
    series: [
      {
        name: '万',
        yAxisIndex: 0,
        type: 'bar',
        data: yData1,
        barWidth: 30,
        markLine: {
          lineStyle: {
            width: 1,
            color: '#D8DEEB',
          },
          //   label: {
          //     show: true,
          //     position: 'end',
          //     formatter(val: any) {
          //       console.log('xxxx', val)
          //       return `<div>xxx</div>`
          //     },
          //     color: '#1D2026',
          //     height: 10,
          //     padding: [12, 12, 7, 12],
          //     lineHeight: 10,
          //     borderWidth: 2,
          //     // borderColor: '#D8DEEB',
          //     backgroundColor: '#F5F8FC',
          //     borderRadius: 2,
          //     fontWeight: 550,
          //     fontFamily: 'HYQiHeiX1-GEW',
          //   },
          silent: true, // 鼠标悬停事件, true悬停不会出现实线
          symbol: 'none', // 去掉箭头
          data: [
            [{ coord: [0, 0] }, { coord: [0, 66666.6] }],
            [{ coord: [1, 0] }, { coord: [1, 66666.6] }],
            [{ coord: [2, 0] }, { coord: [2, 66666.6] }],
          ],
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#467CFA ',
            },
            {
              offset: 1,
              color: '#E0EBFF',
            },
          ]),
        },
      },
      {
        name: '%',
        yAxisIndex: 1,
        type: 'line',
        symbolSize: '6',
        data: yData2,
        itemStyle: {
          color: '#0FB83C',
        },
      },
      {
        name: 'h',
        yAxisIndex: 2,
        type: 'line',
        symbolSize: '6',
        data: yData3,
        itemStyle: {
          color: '#F0A800',
        },
      },
    ],
  }
}
function getOption2(xData: any, yData1: any, yData2: any, yData3: any, padding: any[], labelValueCallBack?: (...arg: any[]) => any) {
  return {
    grid: {
      bottom: 115,
      left: 16,
      right: 2,
      top: 10,
    },
    legend: {
      left: -12,
      bottom: 0,
      padding: 0,
      itemWidth: 0,
      itemGap: 0,
      orient: 'vertical',
      formatter(name: any) {
        return name === 'h' ? '%' : name
      },
      itemStyle: {
        opacity: 0,
      },
      lineStyle: {
        opacity: 0,
      },
      selectedMode: false,
      textStyle: {
        height: 24,
        width: 14,
        fontWeight: 'bold',
        padding: [0, 0, 0, 2],
      },
      data: [
        { name: '万', textStyle: { backgroundColor: '#467CFA', color: '#fff' } },
        { name: '%', textStyle: { backgroundColor: '#33D65F', color: '#1D2026' } },
        { name: 'h', textStyle: { backgroundColor: '#FABF00', color: '#1D2026' } },
      ],
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xData,
      axisLine: {
        lineStyle: { color: '#E4E6F0' },
      },
      axisTick: {
        length: 115, // 竖线长度
        lineStyle: { color: '#E4E6F0' },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: xData.map((_v: any, i: number) => (i % 2 === 0 ? '#F5F8FC' : '')),
        },
      },
      axisLabel: {
        interval: 0,
        rotate: 0,
        formatter(value: any, index: number) {
          const str = labelValueCallBack ? labelValueCallBack(value) : value
          return `{table1|${str}}\n{table2|${yData1[index]}}\n{table3|${yData2[index]}}\n{table4|${yData3[index]}}`
        },
        rich: {
          table1: {
            height: 52,
            lineHeight: 12,
            verticalAlign: 'middle',
            align: 'center',
            color: '#888F9E',
            padding: padding[0],
          },
          table2: {
            height: 24,
            lineHeight: 24,
            align: 'right',
            color: '#22242E',
            padding: padding[1],
          },
          table3: {
            height: 24,
            lineHeight: 24,
            align: 'right',
            color: '#0FB83C',
            padding: padding[1],
          },
          table4: {
            height: 24,
            lineHeight: 24,
            align: 'right',
            color: '#F0A800',
            padding: padding[1],
          },
        },
      },
    },
    yAxis: [
      {
        show: false,
        type: 'value',
        max: (value: any) => value.max * 2,
      },
      {
        show: false,
        type: 'value',
        min: (value: any) => value.max - (value.max - value.min) * 2,
        max: (value: any) => value.max,
      },
      {
        show: false,
        type: 'value',
        min: (value: any) => value.max - (value.max - value.min) * 2,
        max: (value: any) => value.max,
      },
    ],
    series: [
      {
        name: '万',
        yAxisIndex: 0,
        type: 'bar',
        data: yData1,
        barWidth: 30,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#467CFA ',
            },
            {
              offset: 1,
              color: '#E0EBFF',
            },
          ]),
        },
      },
      {
        name: '%',
        yAxisIndex: 1,
        type: 'line',
        symbolSize: '6',
        data: yData2,
        itemStyle: {
          color: '#0FB83C',
        },
      },
      {
        name: 'h',
        yAxisIndex: 2,
        type: 'line',
        symbolSize: '6',
        data: yData3,
        itemStyle: {
          color: '#F0A800',
        },
      },
    ],
    graphic: lineList,
  }
}
function insertEveryThreeChars(str: string, value: string) {
  const arr = str.split('') as any[]
  return {
    value: arr
      .reduce((acc, char, index) => {
        acc.push(char)
        if (index % 3 === 2 && index !== str.length - 1) {
          acc.push(value) // 插入值
        }
        return acc
      }, [])
      .join(''),
    count: Math.ceil(str.length / 3),
  }
}
const option1: any = getOption1(comName, giveInterestPrice, avgPriceRate1, avgPriceRate2, [
  [5, 0, 0, 0],
  [20, 0, 0, 0],
])
const option2: any = getOption2(comName, giveInterestPrice, avgPriceRate1, avgPriceRate2, [
  [5, 0, 0, 0],
  [20, 0, 0, 0],
])
const option3: any = getOption2(citys, y1, y2, y3, [
  [20, 0, 0, 0],
  [45, 0, 0, 0],
])
const option4: any = getOption2(
  operCenters,
  y1,
  y2,
  y3,
  [
    [-10, 0, 0, 0],
    [-2, 0, 0, 0],
  ],
  (val) => {
    return insertEveryThreeChars(val, '\n').value
  },
)
</script>

<template>
  <div style="background-color: #fff; padding: 10px">
    <div style="display: inline-block; width: 50%; height: 236px; padding: 10px; position: relative">
      <div v-for="(item, index) in comName" :key="index" class="label-item" style="left: 25px">
        <p>{{ giveInterestPrice[index] }}万</p>
        <div>
          <span class="ciel" />
          {{ avgPriceRate1[index] }}%
        </div>
        <div>
          <span class="ciel" />
          {{ avgPriceRate2[index] }}%
        </div>
      </div>
      <LyEcharts :option="option1" />
    </div>
    <div style="display: inline-block; width: 50%; height: 290px; padding: 10px">
      <LyEcharts :option="option2" />
    </div>
    <div style="display: inline-block; width: 100%; height: 290px; padding: 10px">
      <LyEcharts :option="option3" />
    </div>
    <div style="display: inline-block; width: 100%; height: 290px; padding: 10px">
      <LyEcharts :option="option4" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.label-item {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  padding: 6px 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
  background-color: #f5f8fc;
  border-radius: 4px;
  p {
    margin: 0;
  }
  div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ciel {
      width: 8px;
      height: 8px;
      background-color: #fff;
      border: 2px solid #33d65f;
      border-radius: 50%;
    }
  }
  div:nth-child(2) {
    .ciel {
      border: 2px solid #fabf00;
    }
  }
}
</style>
