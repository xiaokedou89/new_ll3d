/*普通模型相关注释*/
import request from '@/utils/request.js'
// 普通模型相关接口
const group='/webar'
// 上传webar模型对象
export function uploadModelObj(data) {
    return request({
        url: `${group}`,
        method: 'post',
        data
    })
}
// 获取webar模型列表
export function getList(data) {
    return request({
        url: `${group}/list`,
        method: 'post',
        data
    })
}
// 删除webar模型
export function deleteModel(id){
    return request({
        url:`${group}/${id}`,
        method:'delete'
    })
}
//得到一个具体的模型内容
export function getOne(id){
    return request({
        url:`${group}/${id}`,
        method:'get'
    })
}


