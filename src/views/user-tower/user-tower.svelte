
<WujieSvelte
        width="100%"
        height="100%"
        name="user-tower"
        url="{props.url}"
        props="{props}"
        plugins="{[InstanceofPlugin()]}">
</WujieSvelte>

<script lang="ts" >

  import { InstanceofPlugin } from 'wujie-polyfill'

  import WujieSvelte from "../../lib/wujie-svelte.svelte";
  import {KMessage} from "@ikun-ui/core";

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
    redirectUrl: '/crowd',
  }

  console.log('props：', props)

  // onMounted(() => {
  //   bus.$on('__USER_TOWER_OSP_INSIGHT', () => {
  //     router.push(`/crowd-insight`)
  //   })
  //   bus.$on('__USER_TOWER_CLICK_INSIGHT', () => {
  //     router.push(`/crowd-insight`)
  //   })
  // })
  // onUnmounted(() => {
  //   bus.$clear()
  //   destroyApp('user-tower')
  // })
</script>
