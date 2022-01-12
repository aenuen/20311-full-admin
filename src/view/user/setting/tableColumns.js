import dayjs from 'dayjs'

export const tableColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center',
    hidden: true
  },
  {
    title: '用户昵称',
    key: 'nickname',
    minWidth: 140,
    search: {
      type: 'input'
    }
  },
  {
    title: '电子邮箱',
    key: 'email',
    minWidth: 160,
    search: {
      type: 'input'
    }
  },
  {
    title: '角色',
    key: 'roles',
    align: 'center',
    minWidth: 160,
    render: (h, params) => {
      const { roles } = params.row
      const name = roles.join(',')
      return h('div', [h('span', name)])
    },
    search: {
      type: 'select',
      options: [
        {
          key: '超级管理员',
          value: 'super_admin'
        },
        {
          key: '管理员',
          value: 'admin'
        },
        {
          key: '普通用户',
          value: 'user'
        }
      ]
    }
  },
  {
    title: '积分',
    key: 'integral',
    align: 'center',
    hidden: true,
    minWidth: 80
  },
  {
    title: '是否禁用',
    key: 'status',
    align: 'center',
    minWidth: 100,
    render: (h, params) => {
      return h('div', [
        h('span', params.row.status === '0' ? '否' : '是')
      ])
    },
    search: {
      type: 'radio',
      options: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '否',
          value: '0'
        },
        {
          key: '是',
          value: '1'
        }
      ]
    }
  },
  {
    title: '是否是VIP',
    key: 'isVip',
    align: 'center',
    minWidth: 120,
    render: (h, params) => {
      const { isVip } = params.row
      return h('div', [h('span', isVip === '0' ? '否' : '是')])
    },
    search: {
      type: 'radio',
      options: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '否',
          value: '0'
        },
        {
          key: '是',
          value: '1'
        }
      ]
    }
  },
  {
    title: '创建时间',
    key: 'created',
    align: 'center',
    minWidth: 180,
    render: (h, params) => {
      return h('div', [h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))])
    },
    search: {
      type: 'date'
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
