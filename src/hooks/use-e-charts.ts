import { type Ref, computed, nextTick, ref, unref } from 'vue'
import { tryOnUnmounted, useDebounceFn, useTimeoutFn } from '@vueuse/core'
import echarts, { type EChartsOption } from '@/plugins/echarts'
import { isEmpty } from '@/utils'

interface LocaleOption {
  time: {
    month: string[]
    monthAbbr: string[]
    dayOfWeek: string[]
    dayOfWeekAbbr: string[]
  }
  legend: {
    selector: {
      all: string
      inverse: string
    }
  }
  toolbox: {
    brush: {
      title: {
        rect: string
        polygon: string
        lineX: string
        lineY: string
        keep: string
        clear: string
      }
    }
    dataView: {
      title: string
      lang: string[]
    }
    dataZoom: {
      title: {
        zoom: string
        back: string
      }
    }
    magicType: {
      title: {
        line: string
        bar: string
        stack: string
        tiled: string
      }
    }
    restore: {
      title: string
    }
    saveAsImage: {
      title: string
      lang: string[]
    }
  }
  series: {
    typeNames: {
      pie: string
      bar: string
      line: string
      scatter: string
      effectScatter: string
      radar: string
      tree: string
      treemap: string
      boxplot: string
      candlestick: string
      k: string
      heatmap: string
      map: string
      parallel: string
      lines: string
      graph: string
      sankey: string
      funnel: string
      gauge: string
      pictorialBar: string
      themeRiver: string
      sunburst: string
    }
  }
  aria: {
    general: {
      withTitle: string
      withoutTitle: string
    }
    series: {
      single: {
        prefix: string
        withName: string
        withoutName: string
      }
      multiple: {
        prefix: string
        withName: string
        withoutName: string
        separator: {
          middle: string
          end: string
        }
      }
    }
    data: {
      allData: string
      partialData: string
      withName: string
      withoutName: string
      separator: {
        middle: string
        end: string
      }
    }
  }
}
type RendererType = 'canvas' | 'svg'
interface EChartsInitOpts {
  locale?: string | LocaleOption
  renderer?: RendererType
  devicePixelRatio?: number
  useDirtyRect?: boolean
  useCoarsePointer?: boolean
  pointerSize?: number
  ssr?: boolean
  width?: number | string
  height?: number | string
  ms?: number // 重绘echarts的防抖延迟时间
}

const emptyOption: any = {
  title: {
    text: '暂无数据',
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
}

export function useECharts(elRef: Ref<HTMLElement | undefined>, theme: 'default' = 'default', opts?: EChartsInitOpts) {
  const getDarkMode = computed(() => {
    return theme === 'default' ? 'default' : theme
  })
  let chartInstance: echarts.ECharts | null = null
  const cacheOptions = ref({}) as Ref<EChartsOption>
  let removeResizer: ResizeObserver

  const getOptions = computed(() => {
    if (getDarkMode.value !== 'dark') return cacheOptions.value as EChartsOption
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption
  })
  const initCharts = (t = theme) => {
    const el = unref(elRef)
    if (!el || !unref(el)) return
    chartInstance = echarts.init(el, t, opts)
    removeResizer = new window.ResizeObserver(
      useDebounceFn((entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => {
          const { width, height } = entry.contentRect
          if (width && height) {
            chartInstance?.resize({
              width,
              height,
              animation: {
                duration: 300,
                easing: 'quadraticIn',
              },
            })
          }
        })
      }, opts?.ms ?? 100),
    )
    removeResizer.observe(el)
  }
  const setOptions = (options?: EChartsOption, clear = true) => {
    cacheOptions.value = isEmpty(options) ? emptyOption : options
    return new Promise((resolve) => {
      if (unref(elRef)?.offsetHeight === 0) {
        useTimeoutFn(() => {
          setOptions(unref(getOptions))
          resolve(null)
        }, 30)
      }
      nextTick(() => {
        useTimeoutFn(() => {
          if (!chartInstance) {
            initCharts(getDarkMode.value as 'default')

            if (!chartInstance) return
          }
          clear && chartInstance?.clear()

          chartInstance?.setOption(unref(getOptions))
          resolve(null)
        }, 30)
      })
    })
  }
  tryOnUnmounted(() => {
    if (!chartInstance) return
    removeResizer.disconnect()
    chartInstance.dispose()
    chartInstance = null
  })
  const getInstance = () => {
    if (!chartInstance) initCharts(getDarkMode.value as 'default')
    return chartInstance
  }
  return {
    echarts,
    setOptions,
    getInstance,
  }
}
