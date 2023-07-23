import request from '@/utils/uploadRequest.js'

const group = '/vr/material'
// 获取素材列表
export function getMaterialList(type, params) {
  return request({
      url: `${group}/${type}/list`,
      method: 'get',
      params
  })
}