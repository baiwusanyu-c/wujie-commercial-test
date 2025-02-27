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

  function getAppIdFromUrl(url: string) {
    const regex = /[?&]appId=(\d+)/; // 匹配 ?appId= 后面的数字
    const match = url.match(regex);

    if (match) {
      return match[1]; // 返回捕获的数字部分，即 appId 的值
    } else {
      return null; // 如果没有找到 appId 参数，返回 null
    }
  }

  const props = {
    ...JSON.parse(cache),
    groupId: '267356',
    brandId: params.env.brandId,
    brandName: params.env.brandName,
    token: params.token,
    url: params.env.abTestUrl,
    parentName: 'comm',
    redirectUrl: `/experiment-manage/list?appId=${getAppIdFromUrl(location.href)}&u=baiwu`,
  }
</script>
<WujieSvelte
        width="100%"
        height="100%"
        name="app-experiment"
        alive="{false}"
        url="{props.url}"
        plugins="{[InstanceofPlugin()]}"
        props="{props}">
</WujieSvelte>
