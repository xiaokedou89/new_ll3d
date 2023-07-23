import request from '@/utils/uploadRequest.js'

// 删除文件
export function delFile(type, params) {
  return request({
    url: `/file/${type}`,
    method: 'delete',
    params
  })
}

export function uploadFile(type, data) {
  return request({
    url: `/file/upload/${type}`,
    method: 'post',
    data
  })
}
