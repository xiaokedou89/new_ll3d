import request from '@/utils/request.js'
const group = '/news'
//
export function getMenuList(type,data){
    return request({
        url: `${group}/category/${type}/list`,
        method: 'post',
        data
    })
}

// 首页拉取模型分类推荐
export function getRecommend(type, params) {
    return request({
      url: `/category/${type}`,
      method: 'get',
      params
    })
  }

// 模型列表页获取父子级关系的分类
export function getCategoryList(type, params) {
    return request({
        url: `/category/${type}/list`,
        method: 'get',
        params
    })
}
// 模型列表页获取父子级关系的分类
export function getNews(type, params) {
  return request({
    url: `/category/${type}`,
    method: 'get',
    params
  })
}

// 获取所有网站信息新闻
export function getAllInfo() {
  return request({
    url: '/new',
    method: 'get'
  })
}

// 获取单个网站信息新闻
export function getNewInfo(id) {
  return request({
    url: `/new/${id}`,
    method: 'get'
  })
}