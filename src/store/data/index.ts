/*
 * @Author: liyang1
 * @Date: 2023-04-19 10:44:16
 * @LastEditTime: 2023-06-14 09:57:15
 * @LastEditors: liyang
 * @Description: 数据字典
 */
export interface DictItem {
  label: string
  value: any
}
type DictionaryProps = Record<string, Array<DictItem>>
const dictData: DictionaryProps = {
  isNewShop: [
    { label: '是', value: 1 },
    { label: '否', value: 0 },
  ],
  // 新店新品
  isNewProductOrNewShop: [
    { label: '新店', value: 'new_shop' },
    { label: '新品', value: 'new_product' },
  ],
  beforeDays: [
    { label: '近7天', value: 7 },
    { label: '近14天', value: 14 },
    { label: '近30天', value: 30 },
  ],
  beforeMonths: [
    { label: '近90日', value: 90 },
    { label: '近180日', value: 180 },
  ],
  // 杯型
  cupShapeds: [
    { label: '超大杯', value: '超大杯' },
    { label: '大杯', value: '大杯' },
    { label: '中杯', value: '中杯' },
  ],
  // 周配次数
  weeklyTimes: [
    { label: '1次', value: 1 },
    { label: '2次', value: 2 },
    { label: '3次', value: 3 },
    { label: '4次', value: 4 },
    { label: '5次', value: 5 },
    { label: '6次', value: 6 },
    { label: '7次', value: 7 },
  ],
  // 物料储存条件
  materialStorageConditions: [
    { label: '冷冻', value: 1 },
    { label: '冷藏', value: 2 },
    { label: '常温', value: 3 },
  ],
}

export default dictData
