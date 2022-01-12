// 验证角色
export const validateRoles = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请选择用户角色!'))
  } else {
    callback()
  }
}
