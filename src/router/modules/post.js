import Main from '_c/main'

export default [
  {
    path: '/post',
    name: 'post_management',
    meta: {
      icon: 'md-albums',
      title: '帖子管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'post_list',
        meta: {
          icon: 'ios-paper',
          title: '帖子管理',
          notCache: true
        },
        component: () => import('@/view/post/lists/table')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'ios-paper',
          title: '标签管理',
          notCache: true
        },
        component: () => import('@/view/post/tags/table')
      }
    ]
  }
]
