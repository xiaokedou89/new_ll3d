<template>
  <div class="login">
    <nav-bar :info="false"/>
    <div class="main">
      <dialoger :visible="true" :title="$t('login')" :mask="false" :closable="false">
        <div class="login-container">
          <!-- 上边的登录表单--账号密码登录 -->
          <el-form ref="passwordForm" v-if="!isPhoneLogin" hide-required-asterisk :model="loginObj" size="small" :rules="rules" label-position="top">
            <el-form-item :label="$t('username')" prop="username">
              <el-input v-model="loginObj.username" clearable :placeholder="$t('loginUserPlace')" />
            </el-form-item>
            <el-form-item :label="$t('password')" prop="password">
              <!-- <i class="forgot">{{ $t('forgetPassword') }}</i> -->
              <el-input v-model="loginObj.password" clearable show-password :placeholder="$t('loginPassPlace')" />
            </el-form-item>
            <el-form-item>
              <a @click="changeLoginType">{{ $t('phoneLogin') }}</a>
            </el-form-item>
            <el-form-item>
              <button type="button" class="btn confirmBtn loginBtn" @click="passwordLogin">{{ $t('login') }}</button>
            </el-form-item>
          </el-form>
          <!-- 上边的登录表单--短信登录 -->
          <el-form ref="phoneForm" v-else hide-required-asterisk :model="phoneObj" size="small" :rules="rules">
            <!-- 输入手机号 -->
            <el-form-item prop="phone" :label="$t('phone')">
              <el-input v-model="phoneObj.phone" clearable />
            </el-form-item>
            <!-- 获取输入验证码 -->
            <el-form-item class="form-item-verification" prop="code" :label="$t('verification')">
              <el-input v-model="phoneObj.code" show-password />
              <button :disabled="verifiable" type="button" class="btn confirmBtn" @click="getVerif">{{ verifiLabel }}</button>
            </el-form-item>
            <el-form-item>
              <a @click="changeLoginType">{{ $t('passwordLogin') }}</a>
            </el-form-item>
            <el-form-item>
              <button type="button" class="btn confirmBtn loginBtn" @click="phoneLogin">{{ $t('login') }}</button>
            </el-form-item>
          </el-form> 
          <!-- 第三方账号 -->
          <div class="agreed">
            <p>{{ $t('cooperAccount') }}</p>
            <ul>
              <li >
                <i class="iconfont cooper icon-logo-wechat" @click="getOtherLogin(weixin)"></i>
              </li>
              <li>
                <i class="iconfont cooper icon-logo-qq" @click="getOtherLogin(qq)"></i>
              </li>
              <li>
                <i class="iconfont cooper icon-logo-weibo" @click="getOtherLogin(sina)"></i>
              </li>
            </ul>
          </div>
        </div>
      </dialoger>
    </div>
  </div>
</template>
<script>
import navBar from '@/components/layout/navBar/navBar.vue';
import dialoger from '@/components/common/dialoger/dialoger.vue';
import { verificationType, otherLoginType } from '@/utils/global.js';
import { getToken, getUser } from '@/utils/storage.js';
import * as rule from '@/utils/rules.js';
import * as api from '@/api/user/user.js';
const rules = {
  username: rule.loginUsername,
  password: rule.requiredRules,
  phone: rule.phoneRules,
  code: rule.verificationRules
};

export default {
  name: 'login',
  components: {
    navBar,
    dialoger
  },
  created() {
    // console.log(this.$route);
    // console.log(this.$router);
    // console.log(window.location)
  },
  data() {
    return {
      // 微信跳转地址
      weixin: otherLoginType.WEIXIN,
      // qq跳转地址
      qq: otherLoginType.QQ,
      // 微博跳转地址
      sina: otherLoginType.SINA,
      // 表单验证规则对象
      rules,
      // 路由重定向保存的跳转路径
      redirect: null,
      // 重定向时路由中包含的其他query参数
      otherQuery: {},
      // 是否短信登录
      isPhoneLogin: true,
      // 获取验证码按钮禁用开关
      verifiable: false,
      verifiTime: 60,
      verifiLabel: this.$t('getVerification'),
      // 账号密码登录表单绑定对象
      loginObj: {
        username: '',
        password: ''
      },
      // 短信登录表单绑定对象
      phoneObj: {
        phone: '',
        code: ''
      }
    }
  },
  watch: {
    $route: {
      handler(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  methods: {
    // 跳转到注册页面
    linkToRegin() {
      this.$router.push('/regin');
    },
    // 路由跳转进来后获取保存路由中的其他参数
    getOtherQuery(query) {
      return Object.keys(query).reduce((prev, cur) => {
        if (cur !== 'redirect') {
          prev[key] = query[key];
        }
        return prev;
      }, {});
    },
    // 切换登录方式
    changeLoginType() {
      this.isPhoneLogin = !this.isPhoneLogin;
      this.$refs.passwordForm && this.$refs.passwordForm.clearValidate();
      this.$refs.phoneForm && this.$refs.phoneForm.clearValidate();
    },
    // 点击获取验证码事件
    getVerif() {
      if (!this.phoneObj.phone) {
        this.$message({
          message: this.$t('phoneEmpty'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(this.phoneObj.phone)) {
        this.$message({
          message: this.$t('phoneWrong'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.verifiable = true;
      api.sendVerification(verificationType.LOGIN, {
        phone: this.phoneObj.phone
      })
        .then(res => {
          if (res.code === 20000) {
            this.verifSending();
          } else {
            this.$message({
              message: this.$t('getVerificationFail'),
              type: 'error',
              duration: 1500
            });
            this.verifiable = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('getVerificationFail'),
            type: 'error',
            duration: 1500
          });
          this.verfiable = false;
        })
    },
    // 发送验证码中回调
    verifSending() {
      // this.verifiable = true;
      const that = this;
      let timer = setInterval(function () {
        that.verifiLabel = `${that.verifiTime}${that.$t('resendVerification')}`;
        if (that.verifiTime === 0) {
          that.verifiLabel = that.$t('getVerification');
          that.verifiable = false;
          that.verifiTime = 60;
          clearInterval(timer);
        }
        that.verifiTime--;
      }, 1000);
    },
    // 手机号验证码登录点击登录事件
    phoneLogin() {
      this.$refs.phoneForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('phoneLogin', this.phoneObj)
            .then(() => {
              this.$message({
                message: this.$t('loginSuc'),
                type: 'success',
                duration: 1500
              });
              this.$router.push({
                path: this.redirect || '/', query: this.otherQuery
              });
            })
            .catch(err => {
              console.log('phoneLogin fail：');
              console.log(err);
              this.$message({
                message: this.$t('loginFail'),
                type: 'error',
                duration: 1500
              });
            }) 
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          })
        }
      });
    },
    // 账号密码登录点击登录事件
    passwordLogin() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('passwordLogin', this.loginObj)
            .then(() => {
              this.$message({
                message: this.$t('loginSuc'),
                type: 'success',
                duration: 1500
              });
              this.$router.push({
                path: this.redirect || '/', query: this.otherQuery
              });
            })
            .catch(err => {
              console.log('passwordLogin fail');
              console.log(err);
              this.$message({
                message: this.$t('loginFail'),
                type: 'error',
                duration: 1500
              });
            });
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      });
    },
    // 
    getOtherLogin(source) {
      api.getOtherLoginURL(source)
        .then(res => {
          if (res.code === 20000) {
            window.location.href = res.data;
          } else {

          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.login {
  width: 100%;
  height: 100%;
  .main {
    box-sizing: border-box;
    height: 100%;
    position: relative;
    .forgot {
      position: absolute;
      color: var(--color--main);
      // color: $main;
      font-weight: bold;
      right: 0;
      top: -32px;
      cursor: pointer;
    }
    .forgot:hover {
      color: var(--color--adaptborder);
      // color: $adaptborder;
    }
    .forgot:active {
      color: var(--color--adaptborder);
      // color: $adaptborder;
    }
  }
}
// 登录弹框插槽主体部分
.login-container {
  .el-form-item {
    margin-bottom: 15px;
    .loginBtn {
      width: 100%;
      margin-top: 5px;
    }
  }
  .el-form-item::v-deep .el-form-item__label {
    padding-bottom: 5px;
    font-weight: bold;
    line-height: inherit;
    font-size: 14px;
  }
  .agreed {
    border-top: 1px solid #c7c7c7;
    padding-top: 10px;
    box-sizing: border-box;
    text-align: center;
    p {
      margin-bottom: 10px;
    }
    ul {
      margin-bottom: 10px;
      li {
        display: inline-block;
        padding: 0 8px;
        .cooper {
          font-size: 34px;
          color: var(--color--main);
          // color: $main;
          cursor: pointer;
        }
      }
    }
  }
}
.login-footer {
  text-align: center;
  a {
    color: var(--color--main);
    // color: $main;
  }
  a:hover {
    color: var(--color--adaptborder);
    // color: $adaptborder;
  }
}
// 短信登录部分el-form-item
.form-item-verification {
  width: 100%;
  &::v-deep .el-form-item__content {
    // @include flex-just-spacebetween;
    display: flex;
    justify-content: space-evenly;
    clear: both;
    .el-input {
      width: 50%;
      margin-right: 10px;
    }
    button {
      width: 50%;
      margin-left: 10px;
    }
  }
}
</style>