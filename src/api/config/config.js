import request from '@/utils/request.js';

// 获取项目配置信息
export function getAppConfig() {
  return request({
    url: '/config',
    method: 'get'
  })
}