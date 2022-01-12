import Dispatch from '../libs/dispatch'

export const roleDispatch = new Dispatch({
  roles: ['/role/roles', 'get'],
  names: ['/role/names', 'get'],
  create: ['/role/create', 'post'],
  update: ['/role/update', 'post'],
  delete: ['/role/delete', 'post']
})
