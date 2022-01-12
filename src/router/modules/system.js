import Main from '_c/main'

export default [
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'error_logs',
        meta: {
          icon: 'ios-bug',
          title: '错误日志',
          notCache: true
        },
        component: () => import('@/view/system/logs/table')
      }
    ]
  }
]
