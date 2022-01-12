import Dispatch from '../libs/dispatch'

export const menuDispatch = new Dispatch({
  create: ['/menu/create', 'post'],
  tree: ['/menu/tree', 'get'],
  update: ['/menu/update', 'post'],
  delete: ['/menu/delete', 'post'],
  route: ['/menu/routes', 'get']
})
