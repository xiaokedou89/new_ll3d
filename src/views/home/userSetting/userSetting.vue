<template>
  <div class="main container container-padding">
    <!-- 标题 -->
    <h1 class="page-title">{{ $t('mySetting') }}</h1>
    <div class="setting">
      <!-- 左边选择设置选项部分 -->
      <div class="left">
        <el-radio 
          v-model="settingStatus" 
          v-for="(item, index) in settingStatusArr" 
          :key="index" 
          :label="item.value"
          @change="settingStatusChange"
        >
          <span>{{ item.name }}</span>
        </el-radio>
      </div>
      <!-- 右边的编辑主体部分 -->
      <div class="right">
        <!-- 编辑主体标题部分 -->
        <h4 class="right-title">{{ rightTitle }}</h4>
        <!-- 基本信息修改部分 -->
        <div class="right-content" v-if="settingStatus === BasicSetting">
          <el-form ref="basicForm" class="basic-form" :model="userInfo" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
            <el-form-item :label="$t('username') + '：'">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>
            <el-form-item :label="$t('nickname') + '：'" prop="nickname">
              <el-input v-model="userInfo.nickname" :placeholder="$t('nicknamePlace')" />
            </el-form-item>
            <el-form-item :label="$t('email') + '：'" prop="email">
              <el-input v-model="userInfo.email" :placeholder="$t('emailPlace')" />
            </el-form-item>
            <el-form-item :label="$t('occupation') + '：'" prop="occupation">
              <el-input v-model="userInfo.occupation" :placeholder="$t('occupationPlace')" />
            </el-form-item>
            <el-form-item :label="$t('introduce') + '：'">
              <el-input type="textarea" :rows="5" :show-word-limit="true" maxlength="500" v-model="userInfo.introduce" resize="none" :placeholder="$t('introducePlace')" />
            </el-form-item>
            <el-form-item :label="$t('homepage') + '：'" prop="homepage">
              <el-input v-model="userInfo.homepage" :placeholder="$t('homepagePlace')" />
            </el-form-item>
            <el-form-item :label="$t('domain') + '：'" prop="domain">
              <el-input v-model="userInfo.domain" :placeholder="$t('domainPlace')" />
            </el-form-item>
            <!-- 省 -->
            <el-form-item :label="$t('province') + '：'" prop="province">
              <!-- <el-input v-model="userInfo.province" :placeholder="$t('provincePlace')" /> -->
              <el-select v-model="userInfo.province" :placeholder="$t('provincePlace')" @change="provinceChange">
                <el-option v-for="(item, index) in provinces" :key="index" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <!-- 市 -->
            <el-form-item :label="$t('city') + '：'" prop="city">
              <!-- <el-input v-model="userInfo.city" :placeholder="$t('cityPlace')" /> -->
              <el-select v-model="userInfo.city" :placeholder="$t('cityPlace')" @change="cityChange">
                <el-option v-for="(item, index) in citys" :key="index" :value="item.name"></el-option>
              </el-select>
            </el-form-item> 
            <!-- 县 -->
            <el-form-item :label="$t('county') + '：'" prop="county">
              <!-- <el-input v-model="userInfo.county" :placeholder="$t('countyPlace')" /> -->
              <el-select v-model="userInfo.county" :placeholder="$t('countyPlace')">
                <el-option v-for="(item, index) in countys" :key="index" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sex') + '：'" prop="sex">
              <el-switch 
                v-model="userInfo.sex" 
                active-color="#2489f3" 
                :active-text="$t('woman')" 
                :inactive-text="$t('man')"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-form>
          <!-- 底部的按钮部分 -->
          <div class="right-content-footer">
            <button type="button" class="btn confirmBtn setBtn" @click="basicSetting">{{ $t('saveSetting') }}</button>
          </div>
        </div>
        <!-- 手机号码修改部分 -->
        <div class="right-content" v-if="settingStatus === PhoneSetting">
          <p class="phone-description">{{ $t('phoneDescription') }}</p>
          <!-- 旧手机号验证部分 -->
          <div class="oldPhone" v-if="!changePhone">
            <el-form ref="oldPhoneForm" :model="oldPhone" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
              <el-form-item :label="$t('oldPhone') + '：'" prop="phone">
                <el-input v-model="oldPhone.phone" clearable />
              </el-form-item>
              <el-form-item class="form-item-verification" :label="$t('oldCode') + '：'" prop="code">
                <el-input v-model="oldPhone.code" show-password />
                <button :disabled="oldPhone.verifiable" type="button" class="btn confirmBtn" @click="oldSendVer">{{ oldPhone.verifiLabel }}</button>
              </el-form-item>
            </el-form>
            <div class="right-content-footer">
              <button type="button" class="btn confirmBtn setBtn" @click="receviewOldPhone">验证手机</button>
            </div>
          </div>
          <!-- 新手机号验证部分 -->
          <div class="newPhone" v-else>
            <el-form ref="newPhoneForm" :model="newPhone" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
              <el-form-item :label="$t('newPhone') + '：'" prop="phone">
                <el-input v-model="newPhone.phone" clearable />
              </el-form-item>
              <el-form-item class="form-item-verification" :label="$t('newCode') + '：'" prop="code">
                <el-input v-model="newPhone.code" show-password />
                <button :disabled="newPhone.verifiable" type="button" class="btn confirmBtn" @click="newSendVer">{{ newPhone.verifiLabel }}</button>
              </el-form-item>
            </el-form>
            <div class="right-content-footer">
              <button type="button" class="btn confirmBtn setBtn" @click="resetPhone" >验证手机</button>
            </div>
          </div>
        </div>
        <!-- 密码修改部分 -->
        <div class="right-content" v-if="settingStatus === PasswordSetting">
          <p class="phone-description">{{ $t('passwordDescription') }}</p>
          <div class="verifi-password" v-if="!changePassword">
            <el-form ref="passwordPhoneForm" :model="passwordObj" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
              <el-form-item :label="$t('phoneSetting') + '：'" prop="phone">
                <el-input v-model="passwordObj.phone" clearable />
              </el-form-item>
              <el-form-item class="form-item-verification" :label="$t('phoneCode') + '：'" prop="code">
                <el-input v-model="passwordObj.code" show-password />
                <button :disabled="passwordObj.verifiable" type="button" class="btn confirmBtn" @click="passwordSendVer">{{ passwordObj.verifiLabel }}</button>
              </el-form-item>
            </el-form>
            <div class="right-content-footer">
              <button type="button" class="btn confirmBtn setBtn" @click="receviewPassword">验证手机</button>
            </div>
          </div>
          <div class="set-password" v-else>
            <el-form ref="passwordForm" :model="passwordObj" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
              <el-form-item :label="$t('newPassword') + '：'" prop="password">
                <el-input v-model="passwordObj.password" show-password />
              </el-form-item>
              <el-form-item :label="$t('repeatPassword') + '：'" prop="repeatPassword">
                <el-input v-model="passwordObj.repeatPassword" show-password />
              </el-form-item>
            </el-form>
            <div class="right-content-footer">
              <button type="button" class="btn confirmBtn setBtn" @click="resetPassword">修改密码</button>
            </div>
          </div>
        </div>
        <!-- 账户信息修改部分 -->
        <div class="right-content" v-if="settingStatus === InfoSetting">
          <el-form ref="thumbForm" :model="userInfo" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
            <el-form-item :label="$t('registrationDate') + '：'">
              <span>{{ getTime(userInfo.registrationDate) }}</span>
            </el-form-item>
            <!-- 用户组 -->
            <el-form-item :label="$t('myUserGroup') + '：'">
              <span>{{ userGroup.name }}</span>
            </el-form-item>
            <!-- 模型配额 -->
            <el-form-item :label="$t('modelQuota') + '：'">
              <span class="c_m">{{`${userInfo.numberQuota}`}}</span><span>{{ ` / ${userGroup.modelQuota}` }}</span>
            </el-form-item>
            <!-- 下载配额 -->
            <el-form-item :label="$t('downloadQuota') + '：'">
              <span class="c_m">{{`${userInfo.downloadQuota}`}}</span><span>{{ ` / ${userGroup.downloadQuota}` }}</span>
            </el-form-item>
            <!-- 空间配额 -->
            <el-form-item :label="$t('diskQuota') + '：'">
              <span class="c_m">{{ `${getDisk(userInfo.sizeQuota)}` }}</span><span>{{  ` / ${getDisk(userGroup.diskQuota)}` }}</span>
            </el-form-item>
            <el-form-item :label="$t('userThumb') + '：'" prop="thumb">
              <el-upload
                ref="thumbUpload"
                class="thumb-upload"
                accept="image/png, image/jpg, image/jpeg"
                :limit="1"
                :action="thumbUploadUrl"
                :headers="headers"
                :before-upload="beforeThumbUpload"
                :on-progress="thumbProgress"
                :on-success="thumbSuc"
                :on-error="thumbFail"
                :on-remove="thumbRemove"
                :disabled="uploadObj.progress"
                :show-file-list="uploadObj.showFileFlag"
              >
                <div class="thumb-container">
                  <div class="thumb-empty" v-if="!userInfo.thumb">
                    <i class="thumb-empty-icon el-icon-upload"></i>
                    <span class="thumb-empty-text">{{ $t('map.uploadImg') }}</span>
                  </div>
                  <img class="thumb" v-else :src="getImageUrl(userInfo.thumb)" />
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div class="right-content-footer">
              <button type="button" class="btn confirmBtn setBtn" @click="saveThumb">保存头像</button>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { 
  getCurrentInfo,
  getUserPermission,
  getUserGroup,
  setUserInfo,
  // 发送验证码
  sendVerification,
  // 旧手机接收验证码
  receiveVerification,
  // 新手机接受验证码修改用户手机号
  setUserPhone,
  // 修改密码
  setUserPassword
} from '@/api/user/user.js';
import { delFile } from '@/api/file/file.js';
import { getMap } from '@/api/map/map.js';
import { 
  BasicSetting,
  PhoneSetting,
  PasswordSetting,
  InfoSetting,
  settingStatusArr,
  verificationType,
  filePrefix,
  image,
  uploadFaceFile,
  // 地图api秘钥key
  mapKey,
  chineseSignReg
} from '@/utils/global.js';
import { i18n } from '@/assets/languages/i18n.js';
import { getToken } from '@/utils/storage.js';
import * as rule from '@/utils/rules.js';

const rules = {
  nickname: rule.settingNickname,
  email: rule.settingEmail,
  occupation: rule.settingOccupation,
  homepage: rule.settingHomepage,
  domain: rule.settingDomain,
  phone: rule.phoneRules,
  code: rule.verificationRules,
  password: rule.settingPassword,
  repeatPassword: rule.settingPassword
};

// 默认用户信息
let defaultUserInfo = {
  city: null,
  county: null,
  domain: null,
  // 邮箱
  email: null,
  // 个人主页
  homepage: null,
  id: null,
  // 个人介绍
  introduce: null,
  // 手机号
  mobile: null,
  // 昵称
  nickname: "",
  // 职业
  occupation: null,
  // 用户来源
  origin: null,
  province: null,
  // 性别
  sex: 0,
  // 头像
  thumb: null,
  // 账号名
  username: ""
};

// 默认的手机号修改对象
let defaultOldPhone = {
  phone: '',
  code: '',
  setFlag: false,
  verifiable: false,
  verifiTime: 60,
  verifiLabel: i18n.t('getVerification')
};

let defaultNewPhone = {
  phone: '',
  code: '',
  setFlag: false,
  verifiable: false,
  verifiTime: 60,
  verifiLabel: i18n.t('getVerification')
};

// 默认的修改密码对象
let defaultPassword = {
  phone: '',
  password: '',
  repeatPassword: '',
  code: '',
  verifiFlag: false,
  setFlag: false,
  verifiable: false,
  verifiTime: 60,
  verifiLabel: i18n.t('getVerification')
};

// 默认用户组信息对象 
let defaultGroup = {
  description: '',
  diskQuota: 0,
  downloadQuota: 0,
  id: null,
  modelQuota: 0,
  name: ''
};

let defaultUpload = {
  showFileFlag: false,
  progress: false,
  setFlag: false
};

export default {
  name: 'UserSetting',
  data() {
    return {
      // 表单的验证规则
      rules,
      // 四个Symbol常量
      BasicSetting,
      PhoneSetting,
      PasswordSetting,
      InfoSetting,
      // 当前用户信息
      userInfo: {},
      // 切换新旧手机验证变量
      changePhone: false,
      // 切换修改密码表单变量
      changePassword: false,
      // 修改手机号绑定旧手机对象
      oldPhone: Object.assign({}, defaultOldPhone),
      // 修改手机号绑定旧手机对象
      newPhone: Object.assign({}, defaultNewPhone),
      // 修改密码绑定对象
      passwordObj: Object.assign({}, defaultPassword),
      // 当前用户权限组
      userGroup: Object.assign({}, defaultGroup),
      // 设置的选项卡绑定值
      settingStatus: BasicSetting,
      // 设置的单选框绑定数组
      settingStatusArr,
      // 右边的编辑主体标题绑定值
      rightTitle: settingStatusArr[0].title,
      // el-form表单标签位置设定值
      labelPosition: 'left',
      // 封面图上传地址
      thumbUploadUrl: uploadFaceFile,
      // 封面图上传请求头
      headers: {},
      uploadObj: Object.assign({}, defaultUpload),
      // 省下拉菜单遍历数组
      provinces: [],
      // 市下拉菜单遍历数组
      citys: [],
      // 县下拉菜单遍历数组
      countys: []
    }
  },
  created() {
    const that = this;
    this.getToken();
    this.initUserInfo();
    this.initUserGroup();
    window.addEventListener('resize', that.pageResize, false);
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', that.pageResize, false);
  },
  watch: {
    settingStatus(val) {
      const current = this.settingStatusArr.find(item => {
        return item.value == val
      });
      this.rightTitle = current.title;
    }
  },
  computed: {
    getTime() {
      return function (time) {
        return time ? new Date(time).toLocaleString() : i18n.t('noData');
      }
    },
    getDisk() {
      return function (disk) {
        return disk ? `${(disk / 1e+6).toFixed(0)}M` : i18n.t('noData');
      }
    },
    getImageUrl() {
      return function (src) {
        return filePrefix + image + src;
      }
    },
    getUploadBtn() {
      return this.uploadObj.disabled ? '删除' : '上传';
    }
  },
  methods: {
    getToken() {
      this.$store.getters.token && (this.headers['authorization'] = getToken())
    },
    pageResize(e) {
      this.$nextTick(() => {
        this.labelPosition = e.currentTarget.innerWidth <= 1100 ? 'top' : 'left';
      });
    },
    // 初始化省市区信息并回显
    initMapProvince() {
      getMap({
        key: mapKey,
        keyWords: '中国',
        subdistrict: 3
      })
        .then(res => {
          if (res.data.status && res.data.infocode === '10000') {
            this.provinces = res.data.districts[0].districts;
            let provinceItem = this.provinces.find(item => item.name.includes(this.userInfo.province));
            this.citys =  provinceItem ? provinceItem.districts : [];
            let cityItem = this.citys.find(item => item.name.includes(this.userInfo.city));
            this.countys = cityItem ? cityItem.districts : [];
          }  
        })
    },
    // 初始化用户信息
    initUserInfo() {
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this.labelPosition = deviceWidth <= 1100 ? 'top' : 'left';
      // if (this.$store.getters.userInfo) {
      //   console.log('storage')
      //   defaultUserInfo = JSON.parse(this.$store.getters.userInfo);
      //   this.userInfo = JSON.parse(this.$store.getters.userInfo);
      //   defaultOldPhone.phone = this.userInfo.username;
      //   defaultPassword.phone = this.userInfo.username;
      //   this.passwordObj = Object.assign({}, defaultPassword);
      //   this.oldPhone = Object.assign({}, defaultOldPhone);
      //   this.initMapProvince();
      //   return;
      // }
      getCurrentInfo()
        .then(res => {
          if (res.code === 20000) {
            defaultUserInfo = res.data;
            this.userInfo = res.data;
            defaultOldPhone.phone = this.userInfo.username;
            defaultPassword.phone = this.userInfo.username;
            this.passwordObj = Object.assign({}, defaultPassword);
            this.oldPhone = Object.assign({}, defaultOldPhone);
            this.initMapProvince();
          } else {
            this.$message({
              message: this.$t('getUserInfoFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t('getUserInfoFail'),
            type: 'error',
            duration: 1500
          });
          this.$router.back(-1);
        })
    },
    // 初始化用户组合
    initUserGroup() {
      getUserGroup()
      .then(res => {
        if (res.code === 20000) {
          this.userGroup = res.data;
        } else {
          this.$message({
            message: this.$t('getUserGroupFail'),
            type: 'error',
            duration: 1500
          });
        }
      })
      .catch(() => {
        this.$message({
          message: this.$t('getUserGroupFail'),
          type: 'error',
          duration: 1500
        });
      })
    },
    // 左侧设置单选框状态改变事件
    settingStatusChange(e) {
      this.userInfo = JSON.parse(JSON.stringify(defaultUserInfo));
      this.oldPhone = Object.assign({}, defaultOldPhone);
      this.newPhone = Object.assign({}, defaultNewPhone);
      this.changePhone = false;
      this.passwordObj = Object.assign({}, defaultPassword);
      this.changePassword = false;
      this.thumbUploadShowList = false;
      this.thumbProgressFlag = false;
      this.uploadObj = Object.assign({}, defaultUpload);
    },
    // 点击基本信息的保存修改事件
    basicSetting() {
      this.$refs.basicForm.validate(valid => {
        if (valid) {
          setUserInfo(this.userInfo)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('infoSetSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.$store.dispatch('getInfo')
                  .then(data => {
                    defaultUserInfo = JSON.parse(JSON.stringify(data));
                    this.userInfo = JSON.parse(JSON.stringify(data));
                  })
              } else {
                this.$message({
                  message: this.$t('infoSetFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('infoSetFail'),
                type: 'error',
                duration: 1500
              });
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      });
    },
    // 发送验证码回调函数
    verifiSending(obj) {
      obj.verifiable = true;
      const that = this;
      let timer = setInterval(function () {
        obj.verifiLabel = `${obj.verifiTime}${that.$t('resendVerification')}`;
        if (obj.verifiTime === 0) {
          obj.verifiLabel = that.$t('getVerification');
          obj.verifiable = false;
          obj.verifiTime = 60;
          clearInterval(timer);
        }
        obj.verifiTime--;
      }, 1000);
    },
    // 旧手机发送验证码
    oldSendVer() {
      if (!this.oldPhone.phone) {
        this.$message({
          message: this.$t('phoneEmpty'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(this.oldPhone.phone)) {
        this.$message({
          message: this.$t('phoneWrong'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.oldPhone.verifiable = true;
      sendVerification(verificationType.OLDPHONE, {
        phone: this.oldPhone.phone
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('verifiSendSuc'),
              type: 'success',
              duration: 1500
            });
            this.verifiSending(this.oldPhone)
          } else {
            this.$message({
              message: this.$t('getVerificationFail'),
              type: 'error',
              duration: 1500
            });
            this.oldPhone.verifiable = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('getVerificationFail'),
            type: 'error',
            duration: 1500
          });
          this.oldPhone.verifiable = false;
        })
    },
    // 旧手机表单点击验证手机事件
    receviewOldPhone() {
      if (this.oldPhone.setFlag) {
        return;
      }
      this.oldPhone.setFlag = true;
      this.$refs.oldPhoneForm.validate(valid => {
        if (valid) {
          receiveVerification(this.oldPhone)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('oldPhoneVerifSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.oldPhone = Object.assign({}, defaultOldPhone);
                this.changePhone = true;
              } else {
                this.$message({
                  message: this.$t('oldPhoneVerifFail'),
                  type: 'error',
                  duration: 1500
                });
              }
              this.oldPhone.setFlag = false;
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('oldPhoneVerifFail'),
                type: 'error',
                duration: 1500
              });
              this.oldPhone.setFlag = false;
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.oldPhone.setFlag = false;
        }
      })
    },
    // 新手机发送验证码
    newSendVer() {
      if (!this.newPhone.phone) {
        this.$message({
          message: this.$t('phoneEmpty'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(this.newPhone.phone)) {
        this.$message({
          message: this.$t('phoneWrong'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.newPhone.verifiable = true;
      sendVerification(verificationType.NEWPHONE, {
        phone: this.newPhone.phone
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('verifiSendSuc'),
              type: 'success',
              duration: 1500
            });
            this.verifiSending(this.newPhone);
          } else {
            this.$message({
              message: this.$t('getVerificationFail'),
              type: 'error',
              duration: 1500
            });
            this.newPhone.verifiable = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('getVerificationFail'),
            type: 'error',
            duration: 1500
          });
          this.newPhone.verifiable = false;
        })
    },
    // 点击新手机表单修改手机事件
    resetPhone() {
      if (this.newPhone.setFlag) {
        return;
      }
      this.newPhone.setFlag = true;
      this.$refs.newPhoneForm.validate(valid => {
        if (valid) {
          setUserPhone(this.newPhone)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('setPhoneSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.$store.dispatch('getInfo')
                  .then(data => {
                    defaultUserInfo = JSON.parse(JSON.stringify(data));
                    this.userInfo = JSON.parse(JSON.stringify(data));
                    defaultOldPhone.phone = this.userInfo.username;
                    this.oldPhone = Object.assign({}, defaultOldPhone);
                    this.newPhone = Object.assign({}, defaultNewPhone);
                    this.changePhone = false;
                  })
              } else {
                this.$message({
                  message: this.$t('setPhoneFail'),
                  type: 'success',
                  duration: 1500
                });
                this.oldPhone = Object.assign({}, defaultOldPhone);
                this.newPhone = Object.assign({}, defaultNewPhone);
                this.changePhone = false; 
              }
              this.newPhone.setFlag = false;
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('setPhoneFail'),
                type: 'error',
                duration: 1500
              });
              this.oldPhone = Object.assign({}, defaultOldPhone);
              this.newPhone = Object.assign({}, defaultNewPhone);
              this.changePhone = false; 
              this.newPhone.setFlag = false;
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.newPhone.setFlag = false;
        }
      });
    },
    // 修改密码发送验证码
    passwordSendVer() {
      if (!this.passwordObj.phone) {
        this.$message({
          message: this.$t('phoneEmpty'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(this.passwordObj.phone)) {
        this.$message({
          message: this.$t('phoneWrong'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.passwordObj.verifiable = true;
      sendVerification(verificationType.RESETPASSWORD, {
        phone: this.passwordObj.phone
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('verifiSendSuc'),
              type: 'success',
              duration: 1500
            });
            this.verifiSending(this.passwordObj);
          } else {
            this.$message({
              message: this.$t('getVerificationFail'),
              type: 'error',
              duration: 1500
            });
            this.passwordObj.verifiable = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('getVerificationFail'),
            type: 'error',
            duration: 1500
          });
          this.passwordObj.verifiable = false;
        });
    },
    // 修改密码点击底部的验证手机号按钮
    receviewPassword() {
      if (this.passwordObj.verifiFlag) {
        return;
      }
      this.passwordObj.verifiFlag = true;
      this.$refs.passwordPhoneForm.validate(valid => {
        if (valid) {
          receiveVerification(this.passwordObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('phoneVerifiSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.changePassword = true;
                this.passwordObj = Object.assign({}, defaultPassword);
              } else {
                this.$message({
                  message: this.$t('phoneVerifiFail'),
                  type: 'error',
                  duration: 1500
                });
              }
              this.passwordObj.verifiFlag = false;
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('phoneVerifiFail'),
                type: 'error',
                duration: 1500
              });
              this.passwordObj.verifiFlag = false;
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.passwordObj.verifiFlag = false;
        }
      })
    },
    // 点击修改密码按钮事件
    resetPassword() {
      if (this.passwordObj.setFlag) {
        return;
      }
      this.passwordObj.setFlag = true;
      if (this.passwordObj.password !== this.passwordObj.repeatPassword) {
        this.$message({
          message: this.$t('repeatPasswordFail'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          setUserPassword(this.passwordObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('setPasswordSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.passwordObj = Object.assign({}, defaultPassword);
                this.changePassword = false;
              } else {
                this.$message({
                  message: this.$t('setPasswordFail'),
                  type: 'error',
                  duration: 1500
                });
              }
              this.passwordObj.setFlag = false;
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('setPasswordFail'),
                type: 'error',
                duration: 1500
              });
              this.passwordObj.setFlag = false;
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.passwordObj.setFlag = false;
        }
      })
    },
    // 封面图上传前回调
    beforeThumbUpload(file) {
      if (this.uploadObj.progress) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.uploadObj.progress;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          size = file.size,
          name = file.name,
          extensionFlag = (extension === 'jpg' || extension === 'png' || extension === 'jpeg') && size <= 5 * 1024 * 1024 && !chineseSignReg.test(name) ? true : false;
      if (!extensionFlag) {
        this.$message({
          message: this.$t('userThumbTypeWarn'),
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    // 封面图上传中回调
    thumbProgress() {
      this.uploadObj.showFileFlag = true;
      this.uploadObj.progress = true;
    },
    // 上传封面图成功回调
    thumbSuc(e) {
      this.uploadObj.progress = false;
      this.uploadObj.showFileFlag = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('uploadUserThumbSuc'),
          type: 'success',
          duration: 1500
        });
        this.userInfo.thumb && this.userInfo.thumb !== defaultUserInfo.thumb && (this.delCallback(this.userInfo.thumb));
        this.userInfo.thumb = e.data.filename;
      } else {
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
      this.$refs.thumbUpload.clearFiles();
    },
    thumbFail(e) {
      this.uploadObj.progress = false;
      this.uploadObj.showFileFlag = false;
      this.$message({
        message: e.message || this.$t('uploadFailWarn'),
        type: 'error',
        duration: 1500
      });
    },
    // 上传中移除文件
    thumbRemove() {
      this.uploadObj.progress = false;
    },
    delCallback(filename) {
      delFile('image', {
        filename
      })
        .then(res => {
          console.log(res)
        })
    },
    saveThumb() {
      if(this.uploadObj.setFlag) {
        return;
      }
      if (!this.userInfo.thumb) {
        this.$message({
          message: this.$t('userThumbNull'),
          type: 'warning',
          duration: 1500
        });
        return;
      } 
      if (this.userInfo.thumb === defaultUserInfo.thumb) {
        this.$message({
          message: this.$t('userThumbSame'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.uploadObj.setFlag = true;
      setUserInfo(this.userInfo)
        .then(res => {
          if (res.code === 20000) { 
            this.$message({
              message: this.$t('setUserThumbSuc'),
              type: 'success',
              duration: 1500
            });
            defaultUserInfo.thumb && this.delCallback(defaultUserInfo.thumb);
            this.$store.dispatch('getInfo')
              .then(data => {
                console.log(this.$store.getters.userInfo)
                defaultUserInfo = JSON.parse(JSON.stringify(data));
                this.userInfo = JSON.parse(JSON.stringify(data));
                this.$forceUpdate()
              })
          } else {
            this.$message({
              message: this.$t('setUserThumbFail'),
              type: 'error',
              duration: 1500
            });
          }
          this.uploadObj.setFlag = false;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('setUserThumbFail'),
            type: 'error',
            duration: 1500
          });
          this.uploadObj.setFlag = false;
        });
    },
    // 省区域值改变事件
    provinceChange(province) {
      // this.provinces.forEach(item => {
      //   console.log(this);
      //   if (item.name === province) {
      //     this.citys = item.districts;
      //   }
      // })
      this.citys = [];
      let provinceItem = this.provinces.find(item => item.name === province);
      provinceItem && (this.citys = provinceItem.districts);
      this.userInfo.city = '';
      this.userInfo.county = '';
    },
    // 市区域值改变事件
    cityChange(city) {
      this.countys = [];
      let cityItem = this.citys.find(item => item.name === city);
      cityItem && (this.countys = cityItem.districts);
      this.userInfo.county = '';
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
// 页面标题
.page-title {
  margin: 20px 0 10px 0;
  color: $color-fontMain;
  font-weight: 700;
  font-size: 1.3em;
}
// 底下的主容器
.setting {
  display: flex;
  box-sizing: border-box;
}
// 左边的单选框部分
.left {
  box-sizing: border-box;
  width: 260px;
  margin-right: 40px;
  // background-color: yellow;
  @include flex-column;
}
// 修改左侧单选框默认样式
.left::v-deep .el-radio {
  width: 100%;
  & .el-radio__input {
    display: none;
  }
  & .el-radio__label {
    box-sizing: border-box;
    display: block;
    height: 34px;
    line-height: 34px;
    padding: 0;
    margin-bottom: 10px;
    border-radius: 20px;
    font-size: 14px;
    text-align: center;
    color: $color-fontMain;
  }
  & .el-radio__label:hover {
    background-color: $color-navBg;
  }
}
.left::v-deep .el-radio.is-checked .el-radio__label {
  background-color: $color-main;
}

// 右边的编辑主体部分
.right {
  width: calc(100% - 300px);
  padding: 25px 30px;
  background-color: $color-navBg;
  border-radius: 2px;
  color: $color-fontMain;
  // 右边的标题部分
  .right-title {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 800;
    padding-bottom: 20px;
    border-bottom: 2px solid $color-mainBg;
  }
}

.right-content-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid $color-mainBg;
  text-align: center;
  .setBtn {
    box-sizing: border-box;
    width: 150px;
    height: 40px;
  }
}

.phone-description {
  padding: 0;
  margin: 0 0 10px;
}

.thumb-container {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .thumb-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ccc;
    .thumb-empty-icon {
      font-size: 50px;
    }
  }
  .thumb {
    width: 100%;
    height: 100%;
  }
}
.thumb-upload {
  margin-top: 10px;
}
.upload-group {
    width: 150px;
    position: relative;
    .upload-file-box {
      text-align: left;
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 11px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .upload-btn {
      position: absolute;
      right: -1px;
      top: 0;
      width: 50px;
      height: 32px;
      background: #1890ff;
      color: #fff;
      border: 0;
      border-radius: 2px;
      cursor: pointer;
    }
  }

// 右边的表单部分
.el-form {
  .el-form-item {
    margin-bottom: 20px;
    // 表单项的标题label
    &::v-deep .el-form-item__label {
      color: $color-fontMain;
      font-weight: 700;
    }
    &::v-deep .el-input__inner,
    &::v-deep .el-textarea__inner {
      background-color: $color-mainBg;
      border: 1px solid $color-mainBg;
      color: $color-fontMain;
    }
    &::v-deep .el-textarea__inner {
      @include scrollBar;
    }
    &::v-deep .el-input.is-disabled .el-input__inner {
      color: $color-fontDisabled;
    }
    &::v-deep .el-input__inner:active,
    &::v-deep .el-textarea__inner:active {
      border: 1px solid $color-main;
    }
    &::v-deep .el-input__inner:focus,
    &::v-deep .el-textarea__inner:focus {
      border: 1px solid $color-main;
    }
  }
  // 短信登录部分el-form-item
  .form-item-verification {
    // width: 100%;
    &::v-deep .el-form-item__content {
      display: flex;
      justify-content: space-evenly;
      // clear: both;
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
}
.el-textarea::v-deep .el-input__count {
  border-radius: 4px;
  right: 5px;
  background-color: #ccc;
}


@media (max-width: 1100px) {
  .setting {
    flex-direction: column;
  }
  .left {
    width: 100%;
    @include flex-just-spacebetween;
  }
  .right {
    width: 100%;
  }
}
.c_m {
  color: $color-main;
}
</style>