<script lang="ts">
  import { KMessage } from '@ikun-ui/core'
  import WujieSvelte from '../../lib/wujie-svelte.svelte'
  import { bus } from "../../esm";
  import { InstanceofPlugin } from 'wujie-polyfill'
  import {getContext} from "svelte";
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

  const ctx = getContext('selectedUidPaths')
  bus.$on('__AB_TEST_ENTER_EXP', (data: {  appId: string }) => {
    console.log(data.appId)
    if(ctx){
      ctx(`/ab-test/experiment?appId=${data.appId}`, ["ABTest","实验列表"])
    }

  })
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
