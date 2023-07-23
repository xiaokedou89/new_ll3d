import * as storage from '@/utils/storage.js';
import { i18n } from '@/assets/languages/i18n.js';
import { receiveVerification, login, getCurrentInfo, otherLoginCallback } from '@/api/user/user.js';
const state = {
  token: storage.getToken(),
  userId: storage.getUserId(),
  userInfo: storage.getUserInfo()
};

const mutations = {
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERID: (state, id) => {
    state.userId = id;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  // 手机号验证码登录
  phoneLogin({ commit }, phoneInfo) {
    return new Promise((resolve, reject) => {
      receiveVerification(phoneInfo)
        .then(res => {
          if (res.code === 20000) {
            let token = res.data.token;
            commit('SET_TOKEN', `Bearer ${token}`);
            storage.setToken(`Bearer ${token}`);
            this.dispatch('getInfo');
            resolve();
          } else {
            console.log(i18n.t('loginFail'));
            reject(res.message);
          }
        })
        .catch(err => {
          reject(err);
        })
    });
  },
  // 账号密码登录
  passwordLogin({ commit }, loginObj) {
    const { username, password } = loginObj;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then(res => {
          if (res.code === 20000) {
            let token = res.data.token;
            commit('SET_TOKEN', `Bearer ${token}`);
            storage.setToken(`Bearer ${token}`);
            this.dispatch('getInfo');
            resolve();
          } else {
            reject(res.message);
          }
        })
        .catch(err => {
          console.log(i18n.t('loginFail'));
          reject(err);
        })
    });
  },
  // 第三方登录
  otherLogin({ commit }, data) {
    return new Promise((resolve, reject) => {
      otherLoginCallback(data)
        .then(res => {
          if (res.code === 20000) {
            let token = res.data.token;
            commit('SET_TOKEN', `Bearer ${token}`);
            storage.setToken(`Bearer ${token}`);
            this.dispatch('getInfo');
            resolve();
          } else {
            reject(res.message);
          }
        })
        .catch(err => {
          console.log(i18n.t('loginFail'));
          reject(err);
        })
    });
  },
  // 获取当前用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getCurrentInfo()
        .then(res => {
          const { data } = res;
          // console.log('当前用户信息：');
          // console.log(data);
          if (!data) {
            reject(res.message);
          }
          let { id } = data;
          const userInfo = JSON.stringify(data);
          commit('SET_USERID', id);
          commit('SET_USERINFO', userInfo);
          storage.setUserId(id);
          storage.setUserInfo(userInfo);
          resolve(data);
        })
        .catch(err => {
          reject(err);
        })
    });
  },
  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', null);
      commit('SET_USERID', null);
      commit('SET_USERINFO', null);
      storage.removeToken();
      storage.removeUserId();
      storage.removeUserInfo();
      if (state.token || storage.getToken()) {
        reject();
      }
      resolve();
    })
  }
};

export default {
  state,
  mutations,
  actions
};