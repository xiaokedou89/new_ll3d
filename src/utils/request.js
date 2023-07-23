import axios from 'axios'
import store from '@/store/index.js';
import router from '@/router/index.js';
import { MessageBox, Message} from 'element-ui'
import { globalUrl,localUrl } from './global.js'
import { getToken } from '@/utils/storage.js';
const service = axios.create({
  baseURL: globalUrl,
  timeout: 30000000
})

// 请求拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = getToken();
    }
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
    if (res.data.code !== 20000 && res.data.code !== 20004 && res.data.code !== 20008) {
      // 如果响应未登录去除缓存中的token和用户信息，保存当前路径跳到login
      if (res.data.code === 50002) {
        store.dispatch('logout')
          .then(() => {
            // console.log('request 50002');
            // console.log(router.app.$route)
            // console.log(router.app.$route.fullPath);
            if (!/^\/login/.test(router.app.$route.fullPath)) {
              // console.log('50002第一次重定向');
              router.push({
                path: '/login',
                query: {
                  redirect: router.app.$route.fullPath
                }
              });
            } else {
              console.log('路由已重定向到/login');
            }
          });
      }
      return Promise.reject(new Error(res.message || 'error'));
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
