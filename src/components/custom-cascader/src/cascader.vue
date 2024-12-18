<template>
  <el-tooltip
    ref="tooltipRef"
    :visible="popperVisible"
    :teleported="teleported"
    :popper-class="[nsCascader.e('dropdown'), popperClass]"
    :popper-options="popperOptions"
    :fallback-placements="fallbackPlacements"
    :stop-popper-mouse-event="false"
    :gpu-acceleration="false"
    :placement="placement"
    :transition="`${nsCascader.namespace.value}-zoom-in-top`"
    effect="light"
    pure
    :persistent="persistent"
    @hide="hideSuggestionPanel"
  >
    <template #default>
      <div
        v-clickoutside:[contentRef]="() => togglePopperVisible(false)"
        :class="cascaderKls"
        :style="cascaderStyle"
        @click="() => togglePopperVisible(readonly ? undefined : true)"
        @mouseenter="inputHover = true"
        @mouseleave="inputHover = false"
      >
        <el-input
          ref="input"
          :placeholder="currentPlaceholder"
          :readonly="readonly"
          :disabled="isDisabled"
          :validate-event="false"
          :size="realSize"
          :class="inputClass"
          :tabindex="multiple && filterable && !isDisabled ? -1 : undefined"
          @focus="handleFocus"
          @blur="handleBlur"
        >
          <template #suffix>
            <el-icon v-if="clearBtnVisible" key="clear" :class="[nsInput.e('icon'), 'icon-circle-close']" @click.stop="handleClear">
              <circle-close />
            </el-icon>
            <el-icon v-else key="arrow-down" :class="cascaderIconKls" @click.stop="togglePopperVisible()">
              <arrow-down />
            </el-icon>
          </template>
        </el-input>
      </div>
    </template>

    <template #content>
      <CascaderPanel
        v-show="!filtering"
        ref="cascaderPanelRef"
        v-model="checkedValue"
        :options="options"
        :props="props.props"
        :render-label="$slots.default"
        :titles="titles"
      >
        <template #empty>
          <slot name="empty" />
        </template>
      </CascaderPanel>
    </template>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { ClickOutside as vClickoutside, useLocale, useNamespace, useFormItem, useFormSize } from 'element-plus'
import { ArrowDown, CircleClose } from '@element-plus/icons-vue'
import { cascaderEmits, cascaderProps } from './cascader'
import CascaderPanel from './cascader-panel/index.vue'
import type { Ref, StyleValue } from 'vue'
import type { InputInstance, Options, TooltipInstance } from 'element-plus'

const popperOptions: Partial<Options> = {
  modifiers: [
    {
      name: 'arrowPosition',
      enabled: true,
      phase: 'main',
      fn: ({ state }: any) => {
        const { modifiersData, placement } = state as any
        if (['right', 'left', 'bottom', 'top'].includes(placement)) return
        modifiersData.arrow.x = 35
      },
      requires: ['arrow'],
    },
  ],
}
const COMPONENT_NAME = 'CustomCascader'

defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(cascaderProps)
const emit = defineEmits(cascaderEmits)
const attrs = useAttrs()

const nsCascader = useNamespace('cascader')
const nsInput = useNamespace('input')

const { t } = useLocale()
const { form } = useFormItem()

const tooltipRef: Ref<TooltipInstance | null> = ref(null)
const input: Ref<InputInstance | null> = ref(null)
const popperVisible = ref(false)
const inputHover = ref(false)
const filtering = ref(false)
const filterFocus = ref(false)
const checkedValue = ref()
const cascaderPanelRef = ref()

const cascaderStyle = computed<StyleValue>(() => {
  return attrs.style as StyleValue
})

const isDisabled = computed(() => props.disabled || form?.disabled)
const inputPlaceholder = computed(() => props.placeholder || t('el.cascader.placeholder'))
const currentPlaceholder = computed(() => inputPlaceholder.value)
const realSize = useFormSize()
const multiple = computed(() => !!props.props.multiple)
const readonly = computed(() => !props.filterable || multiple.value)
const clearBtnVisible = computed(() => {
  return false
})

const cascaderKls = computed(() => {
  return [nsCascader.b(), nsCascader.m(realSize.value), nsCascader.is('disabled', isDisabled.value), attrs.class]
})

const cascaderIconKls = computed(() => {
  return [nsInput.e('icon'), 'icon-arrow-down', nsCascader.is('reverse', popperVisible.value)]
})

const inputClass = computed(() => {
  return nsCascader.is('focus', popperVisible.value || filterFocus.value)
})

const contentRef = computed(() => {
  return tooltipRef.value?.popperRef?.contentRef
})

const togglePopperVisible = (visible?: boolean) => {
  if (isDisabled.value) return

  visible = visible ?? !popperVisible.value

  if (visible !== popperVisible.value) {
    popperVisible.value = visible
    input.value?.input?.setAttribute('aria-expanded', `${visible}`)

    emit('visibleChange', visible)
  }
}

const updatePopperPosition = () => {
  nextTick(() => {
    tooltipRef.value?.updatePopper()
  })
}

const hideSuggestionPanel = () => {
  filtering.value = false
}

const handleClear = () => {
  togglePopperVisible(false)
  emit('clear')
}

const handleFocus = (e: FocusEvent) => {
  const el = e.target as HTMLInputElement
  const name = nsCascader.e('search-input')
  if (el.className === name) {
    filterFocus.value = true
  }
  emit('focus', e)
}

const handleBlur = (e: FocusEvent) => {
  filterFocus.value = false
  emit('blur', e)
}

watch(filtering, updatePopperPosition)

defineExpose({
  /**
   * @description toggle the visible of popper
   */
  togglePopperVisible,
  /**
   * @description cascader content ref
   */
  contentRef,
})
</script>
