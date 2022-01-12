import dayjs from 'dayjs'
import { catalogName } from './catalogName'
import { catalogs } from './catalogs'

export const tableColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center',
    hidden: true
  },
  {
    title: '标题',
    key: 'title',
    minWidth: 400,
    ellipsis: true,
    tooltip: true,
    search: {
      type: 'input'
    }
  },
  {
    title: '创建时间',
    key: 'created',
    width: 200,
    align: 'center',
    render: (h, params) => {
      return h('div', [h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))])
    },
    search: {
      type: 'date'
    }
  },
  {
    title: '作者',
    key: 'user',
    width: 120,
    align: 'center',
    render: (h, params) => {
      const { nickname } = params.row.uid
      return h('div', [h('span', nickname)])
    },
    search: {
      type: 'input'
    }
  },
  {
    title: '分类',
    key: 'catalog',
    width: 100,
    align: 'center',
    render: (h, params) => {
      const { catalog } = params.row
      const result = catalogName(catalog)
      return h('div', [h('span', result)])
    },
    search: {
      type: 'select',
      options: catalogs
    }
  },
  {
    title: '积分',
    key: 'integral',
    width: 100,
    align: 'center',
    hidden: true
  },
  {
    title: '标签',
    key: 'tags',
    width: 120,
    align: 'center',
    render: (h, params) => {
      const { tags } = params.row
      return h('div', [
        h('span', tags.map((o) => o.name).join(',') || '')
      ])
    },
    search: {
      type: 'input'
    }
  },
  {
    title: '是否结帖',
    key: 'isEnd',
    width: 100,
    align: 'center',
    render: (h, params) => {
      const { isEnd } = params.row
      return h('div', [h('span', isEnd === '0' ? '否' : '是')])
    },
    search: {
      type: 'radio'
    }
  },
  {
    title: '阅读记数',
    key: 'reads',
    width: 100,
    align: 'center',
    hidden: true
  },
  {
    title: '回答记数',
    key: 'answer',
    width: 100,
    align: 'center',
    hidden: true
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    align: 'center',
    render: (h, params) => {
      const { status } = params.row
      return h('div', [
        h('Tag', {
          class: 'test',
          props: {
            color: status === '0' ? 'success' : 'error'
          },
          domProps: {
            innerHTML: status === '0' ? 'on' : 'off'
          }
        })
      ])
    },
    search: {
      type: 'radio'
    }
  },
  {
    title: '是否置顶',
    key: 'isTop',
    width: 100,
    align: 'center',
    render: (h, params) => {
      const { isTop } = params.row
      return h('div', [
        h('Icon', {
          props: {
            color: isTop === '1' ? '#19be6b' : '#c00',
            type: isTop === '1' ? 'md-checkmark' : 'md-close',
            size: 20
          }
        })
      ])
    },
    search: {
      type: 'radio'
    }
  },
  {
    title: '设置',
    key: 'settings',
    slot: 'action',
    fixed: 'right',
    width: 100,
    align: 'center',
    hidden: true
  }
]
