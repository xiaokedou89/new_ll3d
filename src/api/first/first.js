import request from '@/utils/request.js';

// 首页拉取模型分类推荐
export function getRecommend(type, params) {
  return request({
    url: `/category/list/${type}`,
    method: 'get',
    params
  })
}

// 首页获取轮播图数据
export function getSwiper() {
  return request({
    url: '/banner',
    method: 'get'
  })
}