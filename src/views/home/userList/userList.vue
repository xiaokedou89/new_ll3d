<template>
  <div class="main">
    <!-- 上面的用户信息部分 -->
    <div class="userInfo-top">
      <!-- 内部容器适配宽度、flex布局 -->
      <div class="container container-padding info-container">
        <!-- 头像部分 -->
        <div class="user-thumb">
          <img :src="getImg(userInfo.thumb)" />
        </div>
        <!-- 右边用户其他信息部分 -->
        <div class="user-info">
          <!-- 用户昵称、地址 -->
          <div class="username">
            <!-- 昵称 -->
            <h4 class="nickname">{{ userInfo.nickname }}</h4>
            <!-- 地址 -->
            <div class="address" v-if="userInfo.province || userInfo.city || userInfo.county || userInfo.domain">
              <i class="iconfont icon-weizhi"></i>
              <span>{{ userInfo.province ? userInfo.province : '' }}</span>
              <span>{{ userInfo.city ? userInfo.city : '' }}</span>
              <span>{{ userInfo.county ? userInfo.county : '' }}</span>
              <span>{{ userInfo.domain ? userInfo.domain : '' }}</span>
            </div>
          </div>
          <!-- 个性化签名 -->
          <div class="signature">
            <p>{{ userInfo.signature ? userInfo.signature : $t('noSignature') }}</p>
          </div>
          <!-- 用户描述 -->
          <div class="introduce">
            <p>{{ userInfo.introduce ? userInfo.introduce : $t('noIntroduce') }}</p>
          </div>
          <!-- 关注按钮、粉丝等数量部分 -->
          <div class="fans-follows">
            <!-- 按钮部分 -->
            <div class="btns" v-if="userId !== currentUserId">
              <!-- 关注 -->
              <button v-if="!isAttension" class="btn confirmBtn" type="button" @click="attension">
                <i class="iconfont icon-tianjia"></i>{{ $t('attention') }}
              </button>
              <!-- 已关注 -->
              <button v-else class="btn btn-ori" @click="attensioned">
                <i class="iconfont icon-duigou1"></i>
                {{ $t('attentioned') }}
              </button>
              <button class="btn cancelBtn btn-color" type="button" @click="sendMessage">
                <i class="iconfont icon-aite btn-color"></i>Ta
              </button>
            </div>
            <!-- 粉丝数量部分 -->
            <div class="counts">
              <span @click="changeFans">{{ fans ? `${fans.count} ${$t('fans')}` : `0 ${$t('fans')}`}}</span>
              <span @click="changeFollows">{{ follows ? `${follows.count} ${$t('follows')}` : `0 ${$t('follows')}` }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底下的展示部分 -->
    <div class="container container-padding">
      <!-- 选择type单选框部分 -->
      <div class="params">
        <el-radio 
          v-model="type" 
          v-for="(item, index) in types" 
          :label="item.value" 
          :key="index"
          @change="changeType(item)"
        >
          {{ item.name }}
        </el-radio>
      </div>
      <!-- 下面的列表和用户信息部分 -->
      <div class="list-container">
        <!-- 用户信息部分 -->
        <div class="user-show" v-if="typeObj.value === 'private' || typeObj.value === 'webar'">
          <!-- 内层显示出来的部分 -->
          <div class="user-container">
            <!-- 简介部分 -->
            <div class="user-item">
              <h3>{{ $t('userShowDes') }}</h3>
              <p>{{ userInfo.introduce ? userInfo.introduce : $t('noIntroduce')}}</p>
            </div>
            <!-- 个人主页 -->
            <div class="user-item">
              <h3>{{ $t('homepage') }}</h3>
              <p>{{ userInfo.homepage ? userInfo.homepage : $t('noHomepage') }}</p>
            </div>
            <!-- 建立时间 -->
            <div class="user-item">
              <h3>{{ $t('createTime') }}</h3>
              <p>{{ userInfo.registrationDate ? new Date(userInfo.registrationDate).toLocaleString() : $t('noCreateTime')}}</p>
            </div>
          </div>
        </div>
        <!-- 列表部分 -->
        <div class="list-show">
          <!-- 模型列表 -->
          <list v-if="typeObj.type !== 'userFans' && typeObj.type !== 'userFollows'" :loading="loading" :list="list" :user="isUser" @btnClick="btnClick" @itemClick="itemClick"></list>
          <!-- 用户列表 -->
          <!-- <div v-else class="user-list">
            <div class="user-list-item" v-for="(item, index) in list" :key="index">
              <user-item :userId="item.id"></user-item>
            </div>
          </div> -->
          <div v-else>
            <div class="user-list" v-if="list.length > 0">
              <div class="user-list-item" v-for="(item, index) in list" :key="index">
                <user-item :userId="item.id"></user-item>
              </div>
            </div>
            <div class="user-list-empty" v-else>
              <div class="content">{{$t('noData')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- webAr弹框 -->
    <dialoger 
      :closable="true" 
      :mask="true" 
      :visible="webArFlag" 
      :title="webArTitle" 
      @confirm="closeWebAr"
      @cancel="closeWebAr"
    >
      <div class="ar-container">
        <!-- 左边的qrcode -->
        <div class="qrcode-pic">
          <p>手机扫一扫</p>
          <div class="qrcode-outer">
            <div class="qrcode-inner" ref="code"></div>
          </div>
        </div>
        <!-- 右边的识别图 -->
        <div class="qrcode-pic">
          <p>识别图</p>
          <div class="pic">
            <!-- <img :src="getImg(webArImg)" /> -->
            <img :src="getImageRecognition(webArImg)" />
          </div>
        </div>
      </div>
      <!-- <div style="width: 200px;height: 200px;" ref="code"></div> -->
    </dialoger>
  </div>
</template>
<script>
import { 
  filePrefix,
  image,
  // 单选框的绑定数组
  paramsTypes,
  listSize,
  userModelType,
  modelLogType,
  webArUrl,
  storeGetModel
} from '@/utils/global.js';
import { 
  // 获取指定用户的信息
  getUserInfo,
  // 获取用户粉丝
  getUserFans,
  // 获取用户关注
  getUserFollows,
  // 判断是否关注
  getAttension,
  // 关注
  attension,
  // 取消关注
  cancelAttension
} from '@/api/user/user.js';
import { getModelByUser, getModelLog } from '@/api/model/model.js';
import dialoger from '@/components/common/dialoger/dialoger.vue';
import list from '@/components/layout/list/list.vue';
import userItem from '@/components/common/userItem/userItem.vue';
import QRCode from 'qrcodejs2';
// 静态用户信息
const userInfo = {
  id: null,
  city: null,
  county: null,
  domain: null,
  email: null,
  homepage: null,
  introduce: null,
  mobile: null,
  nickname: '',
  occuptaion: null,
  origin: null,
  province: null,
  sex: null,
  signature: null,
  thumb: null,
  registrationDate: null
};

const modelLogParams = {
  pkId: 0,
  size: listSize,
  sortMode: 'DESC',
  type: modelLogType.COLLECT.type,
  userId: null
};

const modelParams = {
  page: 1,
  size: listSize,
  userId: null
};

const defaultFans = {
  count: 0,
  users: []
};

export default {
  name: 'UserList',
  components: {
    list,
    dialoger,
    userItem
  },
  data() {
    return {
      // 登录用户的userId
      currentUserId: null,
      // 页面的userId
      userId: null,
      isLogin: false,
      // 当前用户是否被登录用户关注
      isAttension: false,
      // 用户信息对象
      userInfo: Object.assign({}, userInfo),
      // 关注列表数据
      follows: JSON.parse(JSON.stringify(defaultFans)),
      // 粉丝列表数据
      fans: JSON.parse(JSON.stringify(defaultFans)),
      // 单选框绑定数组
      types: paramsTypes,
      // 单选框绑定值类型
      type: paramsTypes[1].value,
      typeObj: paramsTypes[1],
      // 列表是否渲染用户
      isUser: false,
      // 列表数据
      list: [],
      // 列表加载开关
      loading: false,
      conditionFlag: false,
      // 点赞收藏下载模型参数
      modelLogParams: Object.assign({}, modelLogParams),
      // 用户查询模型参数
      modelParams: Object.assign({}, modelParams),
      minId: 0,
      maxId: 0,
      // 拼接的qrcode地址路径
      qrcodeUrl: webArUrl,
      // webAr展示弹框开关
      webArFlag: false,
      // webAr弹框标题
      webArTitle: '',
      // 点击的webAr项的识别图地址
      webArImg: '',
      // 生成的qrcode
      qrcode: ''
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id !== undefined) {
      this.userId = +this.$route.query.id;
    } else {
      this.currentUserId = +this.$store.getters.userId;
      this.userId = this.currentUserId;
    }
    modelLogParams.userId = this.userId;
    modelParams.userId = this.userId;
    this.modelLogParams = Object.assign({}, modelLogParams);
    this.modelParams = Object.assign({}, modelParams);
    this.userId !== this.currentUserId && this.getAttension();
    this.initUserInfo();
    Promise.allSettled([this.initFans(), this.initFollows()])
      .then(() => {
        this.initType();
      })
    // this.initFans();
    // this.initFollows();
    // this.initType();
  },
  computed: {
    getImg() {
      return function (src) {
        return src ? filePrefix + image + src : require('@/assets/default/user.jpg');
      }
    },
    getImage() {
      return function (src) {
        return filePrefix + image + src;
      }
    },
    getImageRecognition() {
      return function (src) {
        return src ? `${storeGetModel}/${src}` : require('@/assets/default/user.jpg');
      }
    }
  },
  methods: {
    initType() {
      if (this.$route.query && this.$route.query.type !== undefined && this.$route.query.value !== undefined) {
        let type = this.$route.query.type,
            value = this.$route.query.value;
        this.typeObj = this.types.find(item => {
          return item.value == value && item.type == type;
        });
        if (type !== 'model' && type !== 'userFans' && type !== 'userFollows') {
          this.type = +value;
        } else {
          this.type = value;
        }
        !this.typeObj && (this.typeObj = paramsTypes[1]) && (this.type = paramsTypes[1].value);
      }
      if (this.typeObj.type === 'model') {
        this.initModel(this.modelParams);
      } else if (this.typeObj.type === 'modelLog') {
        this.isUser = true;
        this.initModelLog(this.modelLogParams);
      } else {
        this.typeObj.type === 'userFans' && (this.list = this.fans.users);
        this.typeObj.type === 'userFollows' && (this.list = this.follows.users);
      }
    },
    // 初始化登录用户信息
    initUserInfo() {
      if (this.userId === this.currentUserId) {
        this.initCurrentUserInfo();
      } else {
        getUserInfo(this.userId)
          .then(res => {
            if (res.code === 20000) {
              this.userInfo = res.data;
              console.log(this.userInfo)
              document.title = this.userInfo.nickname ? `${this.userInfo.nickname}${this.$t('pageTitle.user')}` : this.$t('pageTitle.main');
            } else {
              this.$message({
                message: this.$t('initUserInfoFail'),
                type: 'error',
                duration: 1500
              });
              this.$router.back(-1);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message({
              message: this.$t('initUserInfoFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          })
      }
      
    },
    initCurrentUserInfo() {
      this.isLogin = !! this.$store.getters.token;
      let infoRes = this.$store.getters.userInfo;
      if (!infoRes) {
        this.$store.dispatch('getInfo')
          .then(res => {
            this.userInfo = res;
          })
          .catch(err => {
            this.$message({
              message: this.$t('getUserInfoFail') + err,
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          });
      } else {
        this.userInfo = JSON.parse(infoRes);
      }
      document.title = this.userInfo.nickname ? `${this.userInfo.nickname}${this.$t('pageTitle.user')}` : this.$t('pageTitle.main');
    },
    // 获取用户的粉丝列表
    initFans() {
      return getUserFans(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.fans = res.data;
          } 
        })
        .catch(err => {
          this.$message({
            message: this.$t('initFansFail'),
            type: 'error',
            duration: 1500
          });
        })
    },
    // 获取用户的关注列表
    initFollows() {
      return getUserFollows(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.follows = res.data;
          }
        })
        .catch(err => {
          this.$message({
            message: this.$t('initFollowsFail'),
            type: 'error',
            duration: 1500
          });
        })
    },
    // 判断当前用户是否被登录用户关注
    getAttension() {
      getAttension(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.isAttension = res.data;
          } else {
            this.isAttension = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.isAttension = false;
        })
    },
    // 点击关注用户
    attension() {
      attension({
        followedId: this.userId
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('attentionSuc'),
              type: 'success',
              duration: 1500
            });
            this.isAttension = true;
          } else {
            this.$message({
              message: this.$t('attentionFail'),
              type: 'error',
              duration: 1500
            });
            this.isAttension = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('attentionFail'),
            type: 'error',
            duration: 1500
          });
          this.isAttension = false;
        });
    },
    // 点击取消关注
    attensioned() {
      cancelAttension(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('cancelAttensionSuc'),
              type: 'success',
              duration: 1500
            });
            this.isAttension = false;
          } else {
            this.$message({
              message: this.$t('cancelAttensionFail'),
              type: 'error',
              duration: 1500
            });
            this.isAttension = true;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
              message: this.$t('cancelAttensionFail'),
              type: 'error',
              duration: 1500
            });
            this.isAttension = true;
        })
    },
    // 单选框值改变事件
    changeType(item) {
      this.modelLogParams = Object.assign({}, modelLogParams);
      this.modelParams = Object.assign({}, modelParams);
      this.minId = 0;
      this.typeObj = this.types.find(item => {
        return item.value === this.type;
      });
      this.conditionFlag = true;
      if (this.typeObj.type === 'model') {
        // console.log('model切换');
        this.isUser = false;
        this.initModel(this.modelParams);
      } else if (this.typeObj.type === 'modelLog') {
        // console.log('modelLog切换');
        this.isUser = true;
        this.modelLogParams.type = this.typeObj.value;
        this.initModelLog(this.modelLogParams);
      } else if (this.typeObj.type === 'userFans') {
        // console.log('fans切换');
        this.list = this.fans.users;
      } else {
        // console.log('follows切换');
        this.list = this.follows.users;
      }
    },
    initModel(params) {
      this.loading = true;
      getModelByUser(this.typeObj.value, params)
        .then(res => {
          if (res.code === 20000) {
            this.conditionFlag && (this.list = res.data);
            !this.conditionFlag && (this.list = this.list.concat(res.data));
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
            this.modelParams.page > 1 && (this.modelParams.page--);
            this.conditionFlag && (this.list = []);
          }
          this.loading = false;
          this.conditionFlag = false;
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          });
          this.modelParams.page > 1 && (this.modelParams.page--);
          this.loading = false;
          this.conditionFlag = false;
        })
    },
    // 获取点赞、收藏、下载相关模型
    initModelLog(params) {
      console.log('sss')
      this.loading = true;
      getModelLog(params)
        .then(res => {
          if (res.code === 20000) {
            for (const item of res.data.modelLogs) {
              this.buildModelLog(item);
            }
            this.conditionFlag && (this.list = res.data.modelLogs);
            !this.conditionFlag && (this.list = this.list.concat(res.data.modelLogs));
            this.sortModelLogList();
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
            this.conditionFlag && (this.list = []);
          }
          this.loading = false;
          this.conditionFlag = false;
        })
        .catch(err => {
          console.log('sssseee')
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          });
          this.loading = false;
          this.conditionFlag = false;
        });
    },
    // 更改点赞、收藏、下载模型对象的数据结构
    buildModelLog(obj) {
      console.log(obj);
      obj.id = obj.model.id;
      obj.name = obj.model ? obj.model.name : '';
      obj.thumb = obj.model ? obj.model.thumb : null;
      obj.nickName = obj.user ? obj.user.nickname : '';
      obj.userThumb = obj.user ? obj.user.thumb: null;
      obj.modelBrowserCount = obj.model ? obj.model.browserCount : 0;
      obj.modelCollectCount = obj.model ? obj.model.collectCount: 0;
      obj.userId = obj.user ? obj.user.id : null;
    },
    // 排序点赞、收藏、下载的模型列表
    sortModelLogList() {
      this.list.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        } else {
          return 0;
        }
      });
      this.maxId = this.list[0].id;
      this.minId = this.list[this.list.length - 1].id;
    },
    btnClick() {
      if (this.typeObj.type === 'model') {
        this.modelParams.page++;
        this.initModel(this.modelParams);
      } else {
        this.modelLogParams.pkId = this.minId;
        this.initModelLog(this.modelLogParams);
      }
    },
    // 列表项点击事件
    itemClick(item) {
      if (this.typeObj.value === userModelType.AR) {
        let model = this.list.find(it => {
          return it.id === item.id;
        });
        this.webArTitle = model.name;
        this.webArImg = model.imageRecognition;
        this.webArFlag = true;
        this.$nextTick(() => {
          this.createQRCode(model.id);
        });
        this.webArFlag = true;
      } else if (this.typeObj.type === 'userFans' || this.typeObj.type === 'userFollows') {
        // console.log('点击用户对象');
      } else {
        // console.log('点击模型对象');
        this.$router.push({
          path: '/home/modelListDetail',
          query: {
            id: item.id
          }
        });
      }
    },
    // 点击webAr弹框关闭和确定
    closeWebAr() {
      this.webArTitle = '';
      this.qrcode = '';
      this.webArImg = '';
      this.webArFlag = false;
    },
    createQRCode(id) {
      const that = this;
      console.dir(this.$refs.code);
      this.qrcode = new QRCode(that.$refs.code, {
        text: `${that.qrcodeUrl}${id}`,
        width: that.$refs.code.clientWidth,
        height: that.$refs.code.clientHeight
      })
    },
    // 点击上面的粉丝数事件
    changeFans() {
      this.modelLogParams = Object.assign({}, modelLogParams);
      this.modelParams = Object.assign({}, modelParams);
      this.minId = 0;
      this.type = 'fans'
      this.typeObj = this.types.find(item => {
        return item.value === 'fans';
      });
      this.list = this.fans.users;
    },
    // 点击上面的关注的人事件
    changeFollows() {
      this.modelLogParams = Object.assign({}, modelLogParams);
      this.modelParams = Object.assign({}, modelParams);
      this.minId = 0;
      this.type = 'follows'
      this.typeObj = this.types.find(item => {
        return item.value === 'follows';
      });
      this.list = this.follows.users;
    },
    // 点击@Ta跳转到消息页面
    sendMessage() {
      console.log(this.userInfo);
      if (this.userInfo.id && this.userInfo.username) {
        this.$router.push({
          path: '/home/message',
          query: {
            userId: this.userInfo.id,
            username: this.userInfo.username
          }
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';

// 顶部的用户信息部分
.userInfo-top {
  box-sizing: border-box;
  padding: 30px 0;
  min-height: 204px;
  margin-bottom: 10px;
  background: url('~@/assets/userinfo-bg.jpg') center;
  color: $color-fontMain;
}
// 顶部用户部分内部flex容器
.info-container {
  display: flex;
  box-sizing: border-box;
  align-items: flex-start;
  // 用户头像部分
  .user-thumb {
    margin-right: 10px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 6px;
    }
  }
  // 用户其他信息部分
  .user-info {
    box-sizing: border-box;
    min-height: 120px;

    // 用户昵称、地址部分
    .username {
      display: flex;
      text-align: center;
      .nickname {
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: 500;
        line-height: 1.1;
      }
      .address {
        margin-left: 10px;
        font-size: 14px;
        i {
          vertical-align: middle;
        }
      }
    }
    // 用户签名部分
    .signature {
      margin-bottom: 10px;
    }
    .introduce {
      margin-bottom: 10px;
    }
    // 粉丝、关注按钮部分
    .fans-follows {
      display: flex;
      text-align: center;
      // 两个按钮的外层容器
      .btns {
        display: flex;
        vertical-align: middle;
        .btn {
          line-height: 0;
        }
        .btn-ori {
          background-color: $color-ori;
        }
        .btn-color {
          margin-left: 10px;
        }
      }
      // 粉丝数量
      .counts {
        height: 32px;
        margin-left: 10px;
        span {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          margin-left: 10px;
          cursor: pointer;
          &:hover {
            color: $color-main;
          }
        }
      }
    }
  }
}

// type单选框部分
.params {
  margin-bottom: 10px;
  .el-radio {
    box-sizing: border-box;
    display: inline-block;
    margin: 10px auto;
    text-align: center;
    padding: 0 5px;
    &::v-deep .el-radio__input {
      display: none;
    }
    &::v-deep .el-radio__label {
      background-color: $color-radio;
      color: $color-zip;
      border-radius: 50px;
      padding: 8px 19px 8px 16px;
      text-transform: uppercase;
    }
    &::v-deep .el-radio__label:hover {
      color: $color-fontMain;
      background-color: $color-radiohover;
    }
  }
  .el-radio.is-checked::v-deep .el-radio__label {
    background-color: $color-main;
    color: $color-fontMain;
  }
}

// 下面的列表和用户信息部分
.list-container {
  display: flex;
  flex-direction: row-reverse;
  // 用户信息部分
  .user-show {
    width: 400px;
    padding: 0 15px;
    box-sizing: border-box;
    // 内层显示出来的部分
    .user-container {
      box-sizing: border-box;
      border-radius: 4px;
      padding: 20px;
      background-color: $color-navBg;
      text-align: left;
      .user-item {
        font-size: 14px;
        margin-bottom: 18px;
        color: $color-fontMain;
        h3 {
          font-size: 18px;
          font-weight: 500;
          line-height: 1.1;
          margin-top: 0;
          margin-bottom: 16px;
          padding: 0;
        }
        p {
          margin: 0 0 10px;
          padding: 0;
        }
      }
    }
  }
  // 列表部分
  .list-show {
    width: 100%;
  }
}

// 用户列表外层容器
.user-list {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: center;
  // 用户项的外层
  .user-list-item {
    box-sizing: border-box;
    width: 50%;
    padding: 0 5px;
    margin-bottom: 10px;
  }
}

// webAr弹框主体
.ar-container {
  display: flex;
  box-sizing: border-box;
  .qrcode-pic {
    width: 50%;
    box-sizing: border-box;
    padding: 0 20px;
    text-align: center;
    p {
      margin: 0 0 10px;
      padding: 0;
    }
    .qrcode-outer {
      width: 100%;
      padding: 50%;
      position: relative;
      .qrcode-inner {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .pic {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.user-list-empty {
  box-sizing: border-box;
  width: 100%;
  min-height: 350px;
  border: 1px solid var(--color--ori);
  border-radius: 10px;
  padding: 10px;
  .content {
    width: 100%;
    height: 330px;
    line-height: 330px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: var(--color--ori);
    border: 1px dashed var(--color--ori);
  }
}
@media (max-width: 768px) {
  // 顶部的用户信息部分
  .userInfo-top {
    height: 450px;
    background-repeat: repeat-y;
    min-height: 380px;
  }
  // 顶部用户部分内部flex容器
  .info-container {
    flex-direction: column;
    align-items: center;
    // 用户其他信息部分
    .user-info {
      margin-top: 15px;
      .username {
        flex-direction: column;
        align-items: center;
        .address {
          margin: 0;
        }
      }
      .signature {
        text-align: center;
        margin-top: 15px;
      }
      .introduce {
        text-align: center;
        margin-top: 15px;
      }
      .fans-follows {
        flex-direction: column;
        align-items: center;
        .btns {
          margin-top: 10px;
        }
        .counts {
          margin: 10px 0 0 0;
        }
      }
    }
  }
}
// 适配单选框部分
@media (max-width: 800px) {
  .params {
    display: flex;
    flex-wrap: wrap;
    .el-radio {
      flex: 1 1 auto;
      width: 50%;
      margin: 10px auto;
      text-align: center;
      display: inline-block;
      padding: 0 5px;
      &::v-deep .el-radio__label {
        display: block;
        line-height: 22px!important;
        margin-right: 4px;
        margin-top: -4px;
        max-width: calc(100% + 4px);
        text-align: left;
        white-space: nowrap;
      }
    }
  }
}
// 适配下方的列表和用户信息布局
@media (max-width: 1220px) {
  .list-container {
    flex-direction: column;
    .user-show {
      width: 100%;
    }
    .list-show {
      margin-top: 15px;
    }
  }
}
@media (max-width: 600px) {
  .user-list {
    .user-list-item {
      width: 100%;
    }
  }
}
</style>