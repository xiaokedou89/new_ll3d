import request from '@/utils/request.js'
// 素材相关接口
const group = '/banner'
//获取轮播图列表
export function getList(data) {
  return request({
    url: `${group}`,
    method: 'post',
    data
  })
}
