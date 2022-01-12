import { validateEmail } from './validateEmail'
import { validateIntegral } from './validateIntegral'
import { validateRoles } from './validateRoles'
import { pmValidate } from 'plugins-methods'

export const ruleCreate = {
  nickname: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'change'
    },
    {
      type: 'string',
      min: 3,
      message: '昵称长度至少为3位',
      trigger: 'change'
    },
    {
      type: 'string',
      max: 16,
      message: '昵称长度不能超过16位',
      trigger: 'change'
    }
  ],
  email: [
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  roles: [
    {
      validator: validateRoles,
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      type: 'string',
      min: 6,
      message: '密码长度至少为6位',
      trigger: 'change'
    },
    {
      type: 'string',
      max: 20,
      message: '密码长度不能超过20位',
      trigger: 'change'
    }
  ],
  integral: [
    {
      validator: validateIntegral,
      trigger: 'change'
    }
  ],
  mobile: [
    {
      validator: (rule, value, callback) => pmValidate.validateMobile(rule, value, callback),
      trigger: 'change'
    }
  ]
}
