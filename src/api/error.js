import Dispatch from '@/libs/dispatch'

export const errorDispatch = new Dispatch({
  list: ['/error/list', 'get'],
  create: ['/error/create', 'post'],
  delete: ['/error/delete', 'post']
})
