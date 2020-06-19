const distributionRouter = {
  route: null,
  name: null,
  title: '分销管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  filePath: 'distribution/',
  order: 3,
  inNav: true,
  permission: ['代理信息查询'],
  children: [
    {
      route: '/distribution/company',
      name: null,
      title: '公司管理',
      type: 'view', // 取 route 为默认加载页
      icon: 'iconfont icon-huiyuanguanli',
      filePath: 'views/distribution/Company.vue',
      inNav: true,
    },
    {
      route: '/distribution/branch',
      name: null,
      title: '分支机构管理',
      type: 'view', // 取 route 为默认加载页
      icon: null,
      filePath: 'views/distribution/Branch.vue',
      inNav: true,
    },
  ],
}

export default distributionRouter
