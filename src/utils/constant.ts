export const ENV_CONFIG = [
  {
    label: '本地',
    value: 'http://192.168.125.241:3012/user-tower/auth-redirect',
    dataPortalUrl: 'http://localhost:3014/transfer.html#',
    commRedirectUrl: 'https://web-dev.shuxinyc.shop/#/',
  },
  {
    label: '开发',
    value: 'https://cdp-dev.shuxinyc.shop/user-tower/auth-redirect',
    dataPortalUrl: 'https://data-portal-dev.shuxinyc.shop/transfer.html#',
    commRedirectUrl: 'https://web-dev.shuxinyc.shop/#/',
  },
  {
    label: '测试',
    value: 'https://cdp-qa.shuxinyc.shop/user-tower/auth-redirect',
    dataPortalUrl: 'https://data-portal-qa.shuxinyc.shop/transfer.html#',
    commRedirectUrl: 'https://web-test.shuxinyc.shop/#/',
  },
  {
    label: '生产',
    value: 'https://cdp.shuxinyc.shop/user-tower/auth-redirect',
    dataPortalUrl: 'https://data-portal.shuxinyc.shop/transfer.html#',
    commRedirectUrl: 'https://web.shuxinyc.shop/#/',
  },
]
