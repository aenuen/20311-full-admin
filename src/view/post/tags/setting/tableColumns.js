export const tableColumns = [
  {
    title: '序号',
    key: 'sort',
    width: 120,
    align: 'center',
    render: (h, params) => {
      const { index } = params
      return h('div', [h('span', index + 1)])
    }
  },
  {
    title: '名称',
    key: 'tagName'
  },
  {
    title: '类名',
    key: 'tagClass',
    align: 'center'
  },
  {
    title: '设置',
    slot: 'action',
    align: 'center',
    key: 'settings'
  }
]
