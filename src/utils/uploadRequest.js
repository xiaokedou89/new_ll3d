import axios from 'axios'
import { MessageBox, Message} from 'element-ui'
import { globalUrl, localUrl, uploadUrl } from './global.js'
const service = axios.create({
  baseURL: uploadUrl,
  timeout: 30000000
})

// 请求拦截
service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    Message({
      message: err || 'error',
      type: 'error',
      duration: 1500
    })
    return Promise.reject(err)
  }
)

// 响应拦截
service.interceptors.response.use(
  res => {
    if (res.data.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 1500
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('res is err')
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
