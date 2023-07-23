/*普通模型相关注释*/
import request from '@/utils/request.js'
// 普通模型相关接口
const group='/model'
// 上传普通模型对象
export function uploadModelObj(data) {
    return request({
        url: `${group}`,
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data
    })
}
// 获取普通模型列表
export function getList(data) {
    return request({
        url: `${group}/model/list`,
        method: 'post',
        data
    })
}
// 删除普通模型
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



// 无用户系统，根据指定排序方式获取模型列表
export function modelList(params) {
    return request({
        url: '/model',
        method: 'get',
        params
    })
}

// 获取模型详情
export function getModelDetail(id) {
    return request({
        url: `/model/${id}`,
        method: 'get'
    })
}

// 获取模型的相关模型
export function getAboutModel(id, type, params) {
    return request({
        url: `/model/${id}/${type}`,
        method: 'get',
        params
    })
}

// 获取模型相关评论
export function getModelComment(modelId, params) {
    return request({
        url: `/model/${modelId}/review`,
        method: 'get',
        params
    })
}

// 添加模型评论
export function addModelComment(modelId, data) {
    return request({
        url: `/model/${modelId}/review`,
        method: 'post',
        data
    })
}

// 删除模型评论
export function deleteModelComment(modelId, commentId) {
    return request({
        url: `/model/${modelId}/review/${commentId}`,
        method: 'delete'
    })
}

// 创建模型项目
export function uploadModel(data) {
    return request({
        url: '/model',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data
    });
}

// 获取模型分类
export function getModelCategory() {
    return request({
        url: '/model/category',
        method: 'get'
    })
}

// 导出模型
export function exportModel(modelId) {
    return request({
        url: `/model/${modelId}/export`,
        method: 'get'
    })
}

// 修改模型对象
export function setModel(data) {
    return request({
        url: `/model/${data.id}`,
        method: 'put',
        headers: {
            'content-type': 'application/json'
        },
        data
    })
}

// 添加点赞、收藏、下载
export function addModelLog(data) {
    return request({
        url: '/modelLog',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data
    })
}

// 取消点赞、收藏
export function delModelLog(params) {
    return request({
        url: '/modelLog',
        method: 'delete',
        params
    })
}

// 判断是否点赞、收藏、下载
export function checkModelLog(params) {
    return request({
        url: '/modelLog/check',
        method: 'get',
        params
    })
}

// 添加模型浏览量无权限
export function addBrowser(data) {
    return request({
        url: '/modelLog/browse',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data
    })
}

// 删除模型
export function delModel(modelId) {
    return request({
        url: `/model/${modelId}`,
        method: 'delete'
    })
}

// 获取用户相关查询方式的模型
export function getModelByUser(type, params) {
    return request({
        url: `/user/model/${type}`,
        params
    })
}

// 获取收藏、点赞、下载等的模型(需要用户权限)
export function getModelLog(params) {
    return request({
        url: '/modelLog',
        method: 'get',
        params
    })
}

// 获取收藏、点赞、下载等的模型(不需要用户权限)
export function getModelLogOther(params) {
    return request({
        url: '/modelLog/other',
        method: 'get',
        params
    })
}

// 获取模型背景图
export function getModelBg(userId) {
    return request({
        url: `/model/user/${userId}/background`,
        method: 'get'
    })
}

// 根据标签拉取模型
export function getTagModels(tagId, params) {
    return request({
        url: `/model/tag/${tagId}`,
        method: 'get',
        params
    })
}

// 通过oid获取模型详情对象
export function getModelByOid(oid) {
    return request({
        url: `/model/third/${oid}`,
        method: 'get'
    })
}