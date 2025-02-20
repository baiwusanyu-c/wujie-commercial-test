import type {SubMenuType} from "@ikun-ui/core";

export const menuItems: SubMenuType[] = [
  {
    label: '首页',
    uid: '首页',
    icon: 'i-carbon-email',
    path: '/home',
  },
  {
    label: '人群智库',
    uid: '人群智库',
    icon: 'i-carbon-cloud-satellite-config',
    children: [
      { label: '用户群体', uid: '用户群体', path: '/user-tower/tower'},
      { label: '人群洞察', uid: '人群洞察', path: '/user-tower/crowd-insight'},
    ]
  },
  {
    label: '标签管理',
    uid: '标签管理',
    icon: 'i-carbon-cloud-satellite-config',
    children: [
      { label: '用户标签', uid: '用户标签', path: '/user-tower/label'},
    ]
  },
  {
    label: 'ABTest',
    uid: 'ABTest',
    icon: 'i-carbon-cloud-satellite-config',
    children: [
      { label: '应用管理', uid: '应用管理' ,path: '/ab-test/app-manage'},
      { label: '实验列表', uid: '实验列表' ,path: '/ab-test/experiment'},
    ]
  },
];
