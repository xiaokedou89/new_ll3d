import request from '@/utils/request.js';

// export function getNews(type, params) {
//   return request({
//     url: `/category/${type}/list`,
//     method: 'get',
//     params
//   });
// }

export function getNews(type, params) {
  return request({
    url: `/category/${type}`,
    method: 'get',
    params
  })
}

// 获取navBar新闻分类
export function getNavBarNews() {
  return request({
    url: '/category/navbar',
    method: 'get'
  });
}