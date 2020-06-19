const saleRouter = {
  route: null,
  name: null,
  title: '营销管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  order: 2,
  inNav: true,
  permission: ['查询优惠规则'],
  children: [
    {
      route: '/sale/discounts',
      name: null,
      title: '优惠规则',
      type: 'view', // 取 route 为默认加载页
      icon: null,
      filePath: 'views/sale/discounts/List',
      inNav: true,
    },
  ],
}

export default saleRouter
