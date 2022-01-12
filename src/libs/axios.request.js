import axios from 'axios'
import errorHandle from './axios.errorHandle,js'
import globalConfig from '@/config'
import { getToken } from '@/libs/util'

const CancelToken = axios.CancelToken

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.pending = {}
  }

  // 配置
  getInsideConfig () {
    return {
      baseUrl: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=utf8'
      },
      timeout: 10000
    }
  }

  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key]
  }

  // 设定拦截器
  interceptors (instance) {
    // 请求拦截器
    instance.interceptors.request.use(config => {
      const token = getToken()
      let needToken = false
      globalConfig.noToken.map((path) => {
        needToken = needToken || path.test(config.url)
      })
      if (!needToken && token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      const key = `${config.url}&${config.method}`
      this.removePending(key, true)
      config.cancelToken = new CancelToken((c) => {
        this.pending[key] = c
      })
      return config
    }, (err) => {
      errorHandle(err)
      return Promise.reject(err)
    })

    // 响应拦截器
    instance.interceptors.response.use((res) => {
      const key = `${res.config.url}&${res.config.method}`
      this.removePending(key)
      return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)
    }, (err) => {
      errorHandle(err)
      return Promise.reject(err)
    })
  }

  // 创建实例
  request (options) {
    const instance = axios.create()
    this.interceptors(instance)
    const newOptions = Object.assign(this.getInsideConfig(), options)
    return instance(newOptions)
  }

  // get请求
  get (url, config) {
    return this.request(Object.assign({
      method: 'get',
      url
    }, config))
  }

  // post请求
  post (url, data) {
    return this.request({
      method: 'post',
      url,
      data
    })
  }
}

export default HttpRequest
