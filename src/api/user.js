import axios from '@/libs/axios'
import { getToken } from '@/libs/util'
import Dispatch from '@/libs/dispatch'

export const getUserInfo = () => {
  return axios.get('/user/info', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export const userDispatch = new Dispatch({
  statistics: ['/user/statistics', 'get'],
  list: ['/user/list', 'get'],
  create: ['/user/create', 'post'],
  update: ['/user/update', 'post'],
  batchDel: ['/user/batchDel', 'post'],
  batchSet: ['/user/batchSet', 'post'],
  existEmail: ['/user/existEmail', 'post']
})
