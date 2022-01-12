import dayjs from 'dayjs'
import Expand from '../components/expand'

export default [
  {
    type: 'expand',
    key: 'stack',
    width: 50,
    render: (h, params) => {
      return h(Expand, {
        props: {
          row: params.row
        }
      })
    }
  },
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '错误消息',
    key: 'message',
    align: 'center',
    minWidth: 180
  },
  {
    title: '错误码',
    key: 'code',
    align: 'center',
    minWidth: 120,
    filters: [],
    filterMultiple: false,
    filterRemote: that.filterHandle
  },
  {
    title: '请求类型',
    key: 'method',
    align: 'center',
    minWidth: 140,
    filters: [],
    filterMultiple: false,
    filterRemote: that.filterHandle
  },
  {
    title: '请求路径',
    key: 'path',
    align: 'center',
    minWidth: 200
  },
  {
    title: '请求参数',
    key: 'param',
    minWidth: 240,
    render: (h, params) => {
      return h(More, {
        props: {
          row: params.row
        }
      })
    }
  },
  {
    title: '日期',
    key: 'created',
    align: 'center',
    minWidth: 180,
    render: (h, params) => {
      return h('div', [
        h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
      ])
    }
  },
  {
    title: '用户',
    key: 'username',
    align: 'center',
    minWidth: 120
  }
]
