import { validateRoles } from './validateRoles'

export const ruleBatchSet = {
  roles: [
    {
      validator: validateRoles,
      trigger: 'change'
    }
  ]
}
