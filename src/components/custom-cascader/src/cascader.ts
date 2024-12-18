import { type PropType } from 'vue'
import { cascaderProps as elCascaderProps, cascaderEmits as elCascaderEmits, tagProps } from 'element-plus'
import { placements } from '@popperjs/core'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import type { Placement } from 'element-plus'

export const cascaderProps = {
  titles: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * @description position of dropdown
   */
  placement: {
    type: definePropType<Placement>(String),
    values: placements,
    default: 'bottom-start',
  },
  /**
   * @description list of possible positions for dropdown
   */
  fallbackPlacements: {
    type: definePropType<Placement[]>(Array),
    default: ['bottom-start', 'bottom', 'top-start', 'top', 'right', 'left'],
  },
  /**
   * @description when dropdown is inactive and `persistent` is `false`, dropdown will be destroyed
   */
  persistent: {
    type: Boolean,
    default: true,
  },
  /**
   * @description tag effect
   */
  tagEffect: { ...tagProps.effect, default: 'light' },
  ...elCascaderProps,
}

export const cascaderEmits = {
  clear: () => true,
  ...elCascaderEmits,
}
