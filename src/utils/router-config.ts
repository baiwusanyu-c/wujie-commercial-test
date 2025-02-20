import Home from '../views/home/index.svelte'
import ABTestAppManage from '../views/ab-test/app-manage.svelte'
import ABTestExpLayer from '../views/ab-test/layer.svelte'
import UserLabel from '../views/user-tower/user-label.svelte'
import UserTower from '../views/user-tower/user-tower.svelte'
import CrowdInsight from '../views/user-tower/crowd-insight.svelte'


export const RouterConfig = {
  '/': Home,
  '/home': Home,
  '/ab-test/app-manage': ABTestAppManage,
  '/ab-test/experiment': ABTestExpLayer,
  '/user-tower/tower': UserTower,
  '/user-tower/label': UserLabel,
  '/user-tower/crowd-insight': CrowdInsight,
}
