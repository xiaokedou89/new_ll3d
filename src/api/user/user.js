import request from '@/utils/request.js';

// 获取类型向手机号发送验证码
export function sendVerification(type, params) {
  return request({
    url: `/user/send/${type}`,
    method: 'get',
    params
  })
}

// 接收验证码--手机用户使用验证码登录或注册
export function receiveVerification(params) {
  return request({
    url: '/user/receive',
    method: 'post',
    params
  })
}

// 用户账号密码登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 登录用户获取自己的用户信息
export function getCurrentInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}

// 获取指定用户的信息
export function getUserInfo(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

// 根据用户查询权限
export function getUserPermission() {
  return request({
    url: '/user/permission',
    method: 'get'
  });
}

// 根据用户查询用户组
export function getUserGroup() {
  return request({
    url: '/user/userGroup',
    method: 'get'
  })
}

// 生成文件系统token
export function getFileToken(params) {
  return request({
    url: '/user/store/token',
    method: 'get',
    params
  })
}

// 用户修改基本信息
export function setUserInfo(data) {
  return request({
    url: '/user',
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}

// 用户接受验证码修改手机号
export function setUserPhone(params) {
  return request({
    url: '/user/phone',
    method: 'put',
    params
  });
}

// 用户修改密码
export function setUserPassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}

// 得到指定用户是否已关注
export function getAttension(userId) {
  return request({
    url: `/follow/judgment/${userId}`,
    method: 'get'
  })
}

// 关注特定用户
export function attension(data) {
  return request({
    url: '/follow',
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}

// 取消关注用户
export function cancelAttension(followId) {
  return request({
    url: `/follow/${followId}`,
    method: 'delete'
  })
}

// 获取指定用户的粉丝列表
export function getUserFans(id) {
  return request({
    url: `/follow/fans/${id}`,
    method: 'get'
  })
}

// 获取指定用户关注列表
export function getUserFollows(id) {
  return request({
    url: `/follow/${id}`,
    method: 'get'
  })
}

// 获取所有用户列表
export function getAllUser(data) {
  return request({
    url: '/user',
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    data
  })
}

// 获取第三方登录链接
export function getOtherLoginURL(source) {
  return request({
    url: `/user/other/${source}`,
    method: 'get'
  })
}

// 第三方登录回调
export function otherLoginCallback(data) {
  return request({
    url: `/user/callback/${data.state}`,
    method: 'post',
    data
  })
}


