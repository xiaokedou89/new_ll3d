import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUI from 'element-ui'
import moment from 'moment'
import store from './store/index.js';
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/assets/iconfont/iconfont.css'
import { Popover } from 'element-ui'
import {i18n} from '@/assets/languages/i18n.js'
import ElementLocale from 'element-ui/lib/locale'
store.dispatch('getAppConfig');
function getI18nTypes(i18n) {
  const i18ntypes = []
  for (let key in i18n.messages) {
    let obj = {}
    obj.type = key
    obj.name = i18n.messages[key].langType
    i18ntypes.push(obj)
  }
  return i18ntypes
}
Vue.prototype.$i18ntypes = getI18nTypes(i18n)
Vue.prototype.$moment = moment
// 使用预加载图片，优化效果
import preloadImage from 'vue-preload-image'
  Vue.component('preload-image', preloadImage)
Vue.use(elementUI)
Vue.use(Popover)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')
ElementLocale.i18n((key, value) => i18n.t(key, value))

