
<script lang="ts">
  import { KMenu, KMenuItem, KButton, KDrawer } from "@ikun-ui/core";
  import { menuItems } from './utils/menu'
  import { Route, Router, navigate } from 'svelte-routing'
  import Home from './views/home/index.svelte'
  import ABTestAppManage from './views/ab-test/app-manage.svelte'
  import ABTestExpLayer from './views/ab-test/layer.svelte'
  import UserLabel from './views/user-tower/user-label.svelte'
  import UserTower from './views/user-tower/user-tower.svelte'
  import CrowdInsight from './views/user-tower/crowd-insight.svelte'
  import Config from './lib/config.svelte'
  const handleMenuClick = (item: CustomEvent) => {
    localStorage.setItem('wujie-test-select', JSON.stringify(item.detail.uidPath))
    navigate(item.detail.item.path, { replace: true })
  };

  const url = location.pathname === '/' ? '/home' : location.pathname
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

    <Router {url}>
        <div class="h-full w-full">
            <Route path="/home" component={Home} />
            <Route path="/ab-test/app-manage" component={ABTestAppManage} />
            <Route path="/ab-test/experiment" component={ABTestExpLayer} />
            <Route path="/user-tower/tower" component={UserTower} />
            <Route path="/user-tower/label" component={UserLabel} />
            <Route path="/user-tower/crowd-insight" component={CrowdInsight} />
        </div>
    </Router>
</div>

<KDrawer value={show} on:close={close} cls='!w-[350px] !min-w-[300px]'>
    <Config/>
</KDrawer>
