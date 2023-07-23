import axios from 'axios';
import { storeUrl } from './global.js';
const service = axios.create({
  baseURL: storeUrl,
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
    // console.log(res);
    return res;
    if (res.data.code !== 20000 && res.data.code !== 20004) {
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
    return Promise.reject(error)
  }
)

export default service