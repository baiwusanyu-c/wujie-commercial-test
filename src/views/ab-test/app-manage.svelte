<script lang="ts">
  import { KMessage } from '@ikun-ui/core'
  import WujieSvelte from '../../lib/wujie-svelte.svelte'
  import { InstanceofPlugin } from 'wujie-polyfill'
  const cache = localStorage.getItem('wujie-test-config') || '{}'
  const params = JSON.parse(cache)
  if (!params.env) {
    KMessage({
      content: '请点击设置，选择运行环境',
      type: 'warning',
      target: document.body,
    })
    params.env = {}
  }
  const props = {
    ...JSON.parse(cache),
    groupId: '267356',
    brandId: params.env.brandId,
    brandName: params.env.brandName,
    token: params.token,
    url: params.env.abTestUrl,
    parentName: 'comm',
    redirectUrl: '/app-manage',
  }
</script>
<WujieSvelte
        width="100%"
        height="100%"
        name="app-manage"
        alive="{false}"
        url="{props.url}"
        props="{props}"
        plugins="{[InstanceofPlugin()]}"
>
</WujieSvelte>
