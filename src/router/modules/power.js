import Main from '_c/main'

export default [
  {
    path: '/power',
    name: 'power_management',
    meta: {
      icon: 'md-key',
      title: '权限管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'menu',
        name: 'menu_setting',
        meta: {
          icon: 'md-menu',
          title: '菜单配置',
          notCache: true
        },
        component: () => import('@/view/power/menu/main')
      },
      {
        path: 'role',
        name: 'role_setting',
        meta: {
          icon: 'md-settings',
          title: '角色配置',
          notCache: true
        },
        component: () => import('@/view/power/role/main')
      }
    ]
  }
]
