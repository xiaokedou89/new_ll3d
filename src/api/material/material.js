import request from '@/utils/request.js'
// 素材相关接口
const group = '/vr/material'
export const range = {
    // 所有的
    ALL: 'all',
    // 私有的
    CONFIDENTIAL: 'confidential',
    // 公有的
    EXPOSED: 'exposed'
}
// 上传素材
export function uploadVrMaterial(type, data) {
    return request({
        url: `${group}/${type}`,
        method: 'post',
        data
    })
}
// 得到具体的一个素材
export function getOneMaterial(type,id){
    return request({
        url:`${group}/${type}/${id}`,
        method:'get',
    })
}
// 获取素材列表
export function getMaterialList(type, params) {
    return request({
        url: `${group}/${type}`,
        method: 'get',
        params
    })
}

// 获取素材列表，区分公有私有
// range参数：all所有的，confidential私有的 , exposed公有的
export function getMaterialListAll(type, range, params) {
    return request({
        url: `${group}/type/${type}/range/${range}`,
        method: 'get',
        params
    })
}

// 删除素材
export function delMaterial(id, type) {
    return request({
        url: `${group}/${id}/${type}`,
        method: 'delete'
    })
}
