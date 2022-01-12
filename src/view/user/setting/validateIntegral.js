// 验证积分
export const validateIntegral = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户积分'))
  }
  if (!/^[1-9]\d*$/.test(value)) {
    callback(new Error('请输入正确的数值'))
  }
  const result = parseInt(value)
  if (result % 5 === 0) {
    callback()
  } else {
    callback(new Error('请输入可以除以5的整数'))
  }
}
