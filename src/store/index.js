import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters.js';
Vue.use(Vuex);

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {});

const store = new Vuex.Store({
  modules,
  getters
});
/*
store:{
  user: {
    state: {},
    actions: {},
    mutations: {}
  }
}
*/
export default store;