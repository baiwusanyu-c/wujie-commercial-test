<!--
<script lang="ts">
  import { KMenu, KMenuItem, KButton, KDrawer } from "@ikun-ui/core";
  import { menuItems } from './utils/menu'
  import Router, { push } from 'svelte-spa-router'
  import { RouterConfig } from "./utils/router-config";
  import Config from './lib/config.svelte'
  const handleMenuClick = (item: CustomEvent) => {
    localStorage.setItem('wujie-test-select', JSON.stringify(item.detail.uidPath))
    push(item.detail.item.path)
  };

  const selectedUidPathsCache = localStorage.getItem('wujie-test-select') || '["首页"]'
  const selectedUidPaths = JSON.parse(selectedUidPathsCache)
  localStorage.setItem('wujie-test-select', JSON.stringify(selectedUidPaths))
  let show = false;
  const open = () => (show = true);
  const close = () => (show = false);
</script>
<div class="w-full h-full flex p-0">

    <div class="w-300px h-full border-0 border-r-1px border-gray-200 border-solid">
        <div class="w-full fcc">
            <KButton icon="i-carbon-settings" type="primary" cls="m-2 w-full" on:click={open}>设置</KButton>
        </div>
        <KMenu mode="inline"
               selectedUids={selectedUidPaths}
               openUids={selectedUidPaths}
               on:select={handleMenuClick} ctxKey="inline">
            <KMenuItem items="{menuItems}" ctxKey="inline"/>
        </KMenu>
    </div>
    <div class="h-full w-full">
        <Router routes={RouterConfig}/>
    </div>
</div>

<KDrawer value={show} on:close={close} cls='!w-[350px] !min-w-[300px]'>
    <Config/>
</KDrawer>
-->
<script>
    import ABTestAppManage from './views/ab-test/app-manage.svelte'
</script>
<ABTestAppManage/>
