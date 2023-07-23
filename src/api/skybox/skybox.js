//天空盒全景接口
import request from '@/utils/request.js'

const vrGroup='/vr'
const group = '/vr/skybox'
//获取天空盒全景列表
export function getList(params) {
    return request({
        url: `${group}/list`,
        method: 'get',
        params
    })
}
// 创建天空盒全景
export function create(data) {
    return request({
        url: `${group}`,
        method: 'post',
        data
    })
}
// 获取天空盒详情
export function get(id){
    return request({
        url: `${vrGroup}/${id}`,
        method: 'get'
      })
}
export function getPanormaImages(id){
    return request({
        url: `${vrGroup}/${id}/image`,
        method: 'get'
      })
}
export function update(id,data){
    return request({
      url:`${group}/${id}`,
      method:'put',
      data
    })
  }
  // 删除全景
export function deletePanorama(id){
    return request({
      url:`${group}/${id}`,
      method:'delete'
    })
  }
