export const ruleDetail = {
  name: [
    {
      required: true,
      message: '请输入资源名称',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      message: '请输入资源路径',
      trigger: 'blur'
    }
  ],
  method: [
    {
      required: true,
      message: '请选择请求方式',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: '请选择资源类型',
      trigger: 'blur'
    }
  ]
}
