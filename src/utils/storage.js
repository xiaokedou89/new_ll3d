const TOKEN = 'token';
const USERID = 'userId';
const CONFIG = 'config';
const USER = "userSystem";
const USERINFO = 'userInfo';
// 缓存token
export function setToken(token) {
  window.localStorage.setItem(TOKEN, token);
}
// 获取缓存token
export function getToken() {
  return window.localStorage.getItem(TOKEN);
}
// 移除token
export function removeToken() {
  return window.localStorage.removeItem(TOKEN);
}
// 缓存用户id
export function setUserId(id) {
  window.localStorage.setItem(USERID, id);
}
// 获取缓存用户id
export function getUserId() {
  return window.localStorage.getItem(USERID);
}
// 移除用户id
export function removeUserId() {
  window.localStorage.removeItem(USERID);
}
// 缓存用户信息
export function setUserInfo(userInfo) {
  window.localStorage.setItem(USERINFO, userInfo);
}
export function getUserInfo() {
  return window.localStorage.getItem(USERINFO);
}
// 移除用户信息
export function removeUserInfo() {
  return window.localStorage.removeItem(USERINFO);
}
// 缓存项目配置
export function setConfig(configs) {
  window.localStorage.setItem(CONFIG, configs);
}
// 获取项目配置
export function getConfig() {
  return window.localStorage.getItem(CONFIG);
}
// 移除项目配置
export function removeConfig() {
  window.localStorage.removeItem(CONFIG);
}
// 缓存是否用户系统
export function setUser(flag) {
  window.localStorage.setItem(USER, flag);
}
// 获取是否用户系统
export function getUser() {
  return window.localStorage.getItem(USER);
}
// 移除是否用户系统
export function removeUser() {
  window.localStorage.removeItem(USER);
}
