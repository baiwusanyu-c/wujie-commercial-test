import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
export default defineConfig({
  presets: [
    presetWind(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['Montserrat', 'ui-serif', 'Georgia'],
      mono: ['Fira Sans', 'ui-monospace', 'SFMono-Regular'],
    },
    colors: {
      success: '#67C23A',
      muted: '#888888',
      warning: '#f8ac59',
      danger: '#ed5565',
      info: '#1c84c6',
      main: '#1D86F0',
      cbd: '#0E53C4',
      prompt_info_icon: '#2cbcfc',
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
  },
  rules: [
    ['w-sidebar-base', { width: '200px !important' }],
    ['w-30p', { width: '30%' }],
  ],
  shortcuts: [
    {
      'f-c-c': 'flex items-center justify-center',
      'f-c-b': 'flex items-center justify-between',
    },
    {
      'title-16': 'py-2 text-[16px] font-600 c-#36434d',
      'title-14': 'py-2 text-[14px] font-600 c-#36434d',
    },
  ],
})
