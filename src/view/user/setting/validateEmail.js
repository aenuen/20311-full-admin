import { pmFormat } from 'plugins-methods'
import { userDispatch } from '@/api/user'
// 验证邮箱
export const validateEmail = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入电子邮箱'))
  }
  if (pmFormat.formatEmail(value)) {
    userDispatch.use('existEmail', { email: value }).then(({
      code,
      data,
      msg
    }) => {
      if (code === 200) {
        if (data === '0') {
          callback()
        } else if (data === '1') {
          callback(new Error('电子邮箱已被使用，请更换'))
        }
      } else {
        callback(new Error(msg))
      }
    })
  } else {
    callback(new Error('电子邮箱格式不正确'))
  }
}
