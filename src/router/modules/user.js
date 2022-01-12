import Main from '_c/main'

export default [
  {
    path: '/user',
    name: 'user_management',
    meta: {
      icon: 'md-albums',
      title: '帖子管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'user_list',
        meta: {
          icon: 'ios-people',
          title: '帖子列表',
          notCache: true
        },
        component: () => import('@/view/user/table')
      }
    ]
  }
]
