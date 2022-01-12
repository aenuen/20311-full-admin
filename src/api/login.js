import axios from '@/libs/axios'

// 登录
export const loginAdmin = (loginInfo) => axios.post('/login/admin', { ...loginInfo })
