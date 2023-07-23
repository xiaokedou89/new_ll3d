import request from '@/utils/ll3d.js';

export function getToken(data) {
  return request({
    url: '/fs/get/token',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}