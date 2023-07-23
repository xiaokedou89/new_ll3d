// 表单必选规则
import {i18n} from '@/assets/languages/i18n.js'

// 自定义验证规则
export const verifyObj = {
  min: 6,
  max: 15,
  // 手机号格式验证函数
  phone(rule, value, callback) {
    const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(value)) {
      return callback(new Error(i18n.t('rules.phone')));
    } else {
      return callback();
    }
  },
  verification(rule, value, callback) {
    const reg = /\d{6}/;
    if (!reg.test(value)) {
      return callback(new Error(i18n.t('rules.verification')));
    } else {
      callback();
    }
  },
  // 密码验证规则
  password(rule, value, callback) {
    if (value == undefined || value == null || value == '') {
      return callback(new Error(i18n.t('rules.regPasswordnull')))
    } else if (!/^[^\u4e00-\u9fa5]/.test(value)) {
      return callback(new Error(i18n.t('rules.regPasswordcn')))
    } else if (value.length < this.min || value.length > this.max) {
      return callback(new Error(i18n.t('rules.regPasswordtype')))
    } else {
      callback()
    }
  },
};

// 必填项规则
export const requiredRules = [
  { required: true, message: i18n.t("haveContent"), trigger: ['blur', 'change']}
]

export const requiredBlurRules = [
  { required: true, message: i18n.t("haveContent"), trigger: ['blur', 'change']}
]

// 验证手机号规则
export const phoneRules = [
  { validator: verifyObj.phone, trigger: ['blur', 'change']}
];

// 验证验证码规则
export const verificationRules = [
  { validator: verifyObj.verification, trigger: ['blur', 'change']}
];

// 登录用户名
export const loginUsername = [
  { required: true, message: i18n.t('haveContent'), trigger: ['blur'] }
];

// 个人设置昵称
export const settingNickname = [
  { min: 0, max: 16, message: i18n.t('rules.settingNickname'), trigger: ['blur']}
];

// 个人设置邮箱
export const settingEmail = [
  { type: 'email', message: i18n.t('rules.settingEmail'), trigger: ['blur', 'change']}
];

// 个人设置职业
export const settingOccupation = [
  { min: 0, max: 15, message: i18n.t('rules.settingOccupation'), trigger: ['blur']}
];

export const settingHomepage = [
  { pattern: /(https:\/\/|http:\/\/)?([a-zA-Z0-9]+\.){2,}/, message: '请输入正确的网址', trigger: ['blur', 'change']}
];

export const settingDomain = [
  { min: 0, max: 20, message: i18n.t('rules.settingDomain'), trigger: 'blur'}
];

export const settingArea = [
  { min: 0, max: 10, message: i18n.t('rules.settingArea'), trigger: ['change', 'blur']}
];

export const settingPassword = [
  { required: true, validator: verifyObj.password, trigger: 'blur' },
  { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,15}$/, message: i18n.t('rules.regPasswordmessage'), trigger: ['blur', 'change'] }
];

export const messageTitle = [
  { required: true, message: i18n.t("haveContent"), trigger: ['blur', 'change'] },
  { max: 25, message: i18n.t('rules.messageTitle'), trigger: ['blur', 'change'] }
];