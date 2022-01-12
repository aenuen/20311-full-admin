import { validateIntegral } from './validateIntegral'
import { validateRoles } from './validateRoles'

export const ruleUpdate = {
  nickname: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    },
    {
      type: 'string',
      min: 4,
      message: '昵称长度至少为4位',
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
      required: true,
      message: '请输入电子邮箱',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请检查电子邮箱格式',
      trigger: 'change'
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
  ]
}
