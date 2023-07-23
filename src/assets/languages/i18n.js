import VueI18n from 'vue-i18n'
import Vue from 'vue'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
const zh = {
  ...require('@/assets/languages/zh_CN.json'),
  ...zhLocale
}
const en = {
  ...require('@/assets/languages/en_US.json'),
  ...enLocale
}
function getLang() {
  let lang = 'zh'
  if (sessionStorage.getItem('lang')) {
    lang = sessionStorage.getItem('lang')
  }
  return lang
}
Vue.use(VueI18n)
export const i18n = new VueI18n({
  locale: getLang(),
  messages: {
    'zh': zh,
    'en': en
  }
})



