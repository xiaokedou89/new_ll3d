import * as storage from '@/utils/storage.js';
import { getAppConfig } from '@/api/config/config.js';
const state = {
  config: storage.getConfig(),
  user: storage.getUser()
};

const mutations = {
  SET_CONFIG: (state, configs) => {
    state.config = configs;
  },
  SET_USER: (state, flag) => {
    state.user = flag;
  }
};

const actions = {
  // 获取项目配置信息
  getAppConfig({commit}) {
    return new Promise((resolve, reject) => {
      getAppConfig()
        .then(res => {
          const { data } = res;
          let userSystem = null;
          if (res.code === 20000) {
            commit('SET_CONFIG', data);
            storage.setConfig(JSON.stringify(data));
            userSystem = data.find(item => {
              return item.label === 'userSystem'
            });
            userSystem && commit('SET_USER', userSystem.value);
            userSystem && storage.setUser(userSystem.value);
            resolve();
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err);
        })
    })
  }
};

export default {
  state,
  mutations,
  actions
};