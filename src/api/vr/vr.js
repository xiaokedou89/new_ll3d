import request from '@/utils/request.js'
// 全景模型相关接口
const group='/vr/model'
// 上传全景模型对象
export function uploadVrObj(data) {
  return request({
    url: `${group}`,
    method: 'post',
    data
  })
}

// 获取全景对象
export function getVrModel(id) {
  return request({
    url: `${group}/${id}`,
    method: 'get'
  })
}
// 保存全景对象
export function updateVrModel(id,data){
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
// =========================================
// 获取单独的全景模型
export function getVRModel(id) {
  return request({
    url: `/vr/${id}`,
    method: 'get'
  })
}


// 获取全景模型列表
export function getVrList(type, params) {
  return request({
    url: `/vr/${type}/list`,
    method: 'get',
    params
  })
}

// 创建全景
export function updataVr(type, data) {
  return request({
    url: `/vr/${type}`,
    method: 'post',
    data
  })
}

// 创建全景分类
export function createCategory(data) {
  return request({
    url: '/vr/category',
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}

// 修改全景分类
export function setCategory(id, params) {
  return request({
    url: `/vr/category/${id}`,
    method: 'put',
    params
  })
}

// 删除全景分类
export function delCategory(id) {
  return request({
    url: `/vr/category/${id}`,
    method: 'delete'
  })
}

// 获取全景分类
export function getCategory() {
  return request({
    url: '/vr/category',
    method: 'get'
  })
}

// 获取全景标签
export function getTags() {
  return request({
    url: '/vr/tag',
    method: 'get'
  })
}

// 获取用户的全景模型列表
export function getUserVr(type, params) {
  return request({
    url: `/vr/user/${type}/list`,
    method: 'get',
    params
  })
}

// 删除全景
export function delVrModel(id) {
  return request({
    url: `/vr/${id}`,
    method: 'delete'
  })
}

// 修改全景配置
export function setVrConfig(id, data) {
  return request({
    url: `/vr/${id}/config`,
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}

// 获取全景天空盒所用的全景图
export function getSkyboxImage(id) {
  return request({
    url: `/vr/${id}/image`,
    method: 'get'
  })
}

// 获取首页的全景(获取所有类型的全景)
export function getAllVr(params) {
  return request({
    url: '/vr',
    method: 'get',
    params
  })
}