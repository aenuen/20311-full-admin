export const tableColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center',
    hidden: true
  },
  {
    title: '资源名称',
    key: 'name',
    search: {
      type: 'input'
    },
    align: 'center'
  },
  {
    title: '资源路径',
    key: 'path',
    search: {
      type: 'input'
    },
    align: 'center'
  },
  {
    title: '请求类型',
    key: 'method',
    search: {
      type: 'input'
    },
    align: 'center',
    render: (h, params) => {
      return h('div', params.row.method.toUpperCase())
    }
  },
  {
    title: '资源类型',
    key: 'type',
    search: {
      type: 'radio',
      options: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '接口',
          value: 'api'
        },
        {
          key: '按钮',
          value: 'btn'
        }
      ]
    },
    align: 'center'
  },
  {
    title: '资源描述',
    key: 'description',
    search: {
      type: 'input'
    }
  },
  {
    title: '设置',
    key: 'settings',
    slot: 'action',
    hidden: true,
    fixed: 'right',
    width: 100,
    align: 'center'
  }
]
