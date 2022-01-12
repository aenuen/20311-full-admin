import store from '@/store'

const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: { responseURL }
  } = errorInfo
  if (!responseURL.includes('save_error_logger')) {
    store.dispatch('addErrorLog', {
      type: 'ajax',
      code: status,
      mes: statusText,
      url: responseURL
    }).then()
  }
}

const errorHandle = (err) => {
  addErrorLog(err)
}

export default errorHandle
