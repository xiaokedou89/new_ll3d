<template>
  <div class="user-item">
    <!-- 上面的用户信息部分 -->
    <div class="user">
      <!-- 左边的用户头像 -->
      <div class="user-thumb" @click="linkToUser">
        <el-image :src="getThumb(userInfo.thumb)">
          <img slot="error" :src="defaultUserThumb" />
        </el-image>
        <!-- <img :src="getThumb(userInfo.thumb)" /> -->
      </div>
      <!-- 右边的其他信息 -->
      <div class="user-info">
        <!-- 昵称 -->
        <h4 @click="linkToUser">{{ userInfo.nickname }}</h4>
        <!-- 个性签名 -->
        <p>{{ userInfo.signature ? userInfo.signature : $t('noSignature') }}</p>
        <!-- 其他 -->
        <div class="user-other">
          <!-- 关注 -->
          <button v-if="!isAttension" class="btn confirmBtn" type="button" @click="attension">
            <i class="iconfont icon-tianjia"></i>{{ $t('attention') }}
          </button>
          <!-- 已关注 -->
          <button v-else class="btn btn-ori" @click="attensioned">
            <i class="iconfont icon-duigou1"></i>
            {{ $t('attentioned') }}
          </button>
          <!-- 粉丝 -->
          <el-tooltip effect="dark" :content="$t('fans')" placement="top">
            <span class="fans" @click="linkToUserFans">
              <i class="iconfont icon-haoyou"></i> 
              {{ fans ? fans.count : 0 }}
            </span>
          </el-tooltip>
          <!-- 关注 -->
          <el-tooltip effect="dark" :content="$t('follows')" placement="top">
            <span class="fans" @click="linkToUserFollows">
              <i class="iconfont icon-haoyou"></i> 
              {{ follows ? follows.count : 0 }}
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 最近的三个模型部分 -->
    <div class="models">
      <!-- 有模型数据时显示 -->
      <div class="models-container" v-if="recentlyModel && recentlyModel.length > 0">
        <div class="models-item" v-for="(item, index) in recentlyModel" :key="index">
          <div class="inner" @click="linkToModelDetail(item.id)">
            <img :src="getImg(item.thumb)" />
          </div>
        </div>
      </div>
      <!-- 没有模型时显示 -->
      <div class="models-empty" v-else>
        <div class="models-empty-inner">
          <div class="inner">
            <span>{{ $t('noModels') }}</span>
          </div>  
        </div>
      </div>
    </div>
    <!-- 展示数据部分 -->
    <div class="counts">
      <!-- 收藏 -->
      <span class="count" @click="linkToCollect">
        <i class="iconfont icon-shoucang"></i>
        {{ collect ? collect.count : 0 }}
      </span>
      <!-- 浏览 -->
      <span class="count" @click="linkToAll">
        <i class="iconfont icon-liulan"></i>
        {{ browser ? browser.count : 0 }}
      </span>
      <!-- 点赞 -->
      <span class="count" @click="linkToSupport">
        <i class="iconfont icon-dianzan"></i>
        {{ support ? support.count : 0 }}
      </span>
    </div>
  </div>
</template>
<script>
import { 
  // 判断是否关注
  getAttension,
  // 关注用户
  attension,
  // 取关
  cancelAttension,
  // 获取粉丝
  getUserFans,
  // 获取关注
  getUserFollows,
  getUserInfo
} from '@/api/user/user.js';
import {
  // 获取收藏、浏览、点赞模型
  getModelLogOther,
  // 获取用户查询相关模型(最近三个)
  getModelByUser
} from '@/api/model/model.js';
import {
  userModelType,
  modelLogType,
  listSize,
  filePrefix,
  image,
  isNetworkImg,
  defaultUserThumb
} from '@/utils/global.js';
import Vue from 'vue';

// 静态用户信息
const userInfo = {
  city: null,
  county: null,
  domain: null,
  email: null,
  homepage: null,
  introduce: null,
  mobile: null,
  nickname: null,
  occuptaion: null,
  origin: null,
  province: null,
  sex: null,
  thumb: null
};

export default {
  name: 'UserItem',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      defaultUserThumb,
      // 当前用户是否登录
      isLogin: false,
      // 用户的信息对象
      userInfo: Object.assign({}, userInfo),
      // 当前用户的用户id
      currentUserId: null,
      // 当前用户是否关注了目标用户
      isAttension: false,
      // 用户的粉丝数据
      fans: null,
      // 用户的关注数据
      follows: null,
      // 底部的三个最近模型数据
      recentlyModel: null,
      collect: null,
      browser: null,
      support: null
    }
  },
  created() {
    this.initUserInfo();
    this.initConfig();
    this.isLogin && this.getAttension();
    this.initFans();
    this.initFollows();
    this.initModel();
    this.initCollect();
    this.initBrowser();
    this.initSupport();
  },
  computed: {
    getThumb() {
      return function (src) {
        return src ? (isNetworkImg(src) ? src : filePrefix + image + src) : require('@/assets/default/user.jpg');
      }
    },
    getImg() {
      return function (src) {
        return src ? filePrefix + image + src: '';
      }
    }
  },
  methods: {
    // 跳转到用户模型页面
    linkToUser() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId
        }
      });
    },
    // 跳转到用户粉丝页面
    linkToUserFans() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId,
          value: 'fans',
          type: 'userFans'
        }
      });
    },
    // 跳转到用户关注
    linkToUserFollows() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId,
          value: 'follows',
          type: 'userFollows'
        }
      });
    },
    // 跳转到模型详情页
    linkToModelDetail(id) {
      this.$router.push({
        path: '/home/modelListDetail',
        query: {
          id
        }
      });
    },
    // 跳转到用户收藏
    linkToCollect() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId,
          value: modelLogType.COLLECT.type,
          type: 'modelLog'
        }
      });
    },
    // 跳转到用户点赞
    linkToSupport() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId,
          value: modelLogType.SUPPORT.type,
          type: 'modelLog'
        }
      });
    },
    // 跳转到用户点赞
    linkToAll() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId,
          value: userModelType.ALL,
          type: 'model'
        }
      });
    },
    // 初始化判断条件
    initConfig() {
      this.isLogin = !! this.$store.getters.token;
      this.isLogin && (this.currentUserId = +this.$store.getters.userId);
    },
    initUserInfo() {
      getUserInfo(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.userInfo = res.data;
          }
        })
    },
    // 初始化是否已关注用户判断条件
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
    // 获取用户的粉丝列表
    initFans() {
      getUserFans(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.fans = res.data;
          } else {
            this.fans = null;
          }
        })
        .catch(err => {
          console.log(err);
          this.fans = null;
        })
    },
    // 获取用户的关注列表
    initFollows() {
      getUserFollows(this.userId)
        .then(res => {
          if (res.code === 20000) {
            this.follows = res.data;
          } else {
            this.follows = null;
          }
        })
        .catch(err => {
          console.log(err);
          this.follows = null;
        })
    },
    // 获取三个最近的模型
    initModel() {
      getModelByUser(userModelType.RECENTLY, {
        page: 1,
        size: 3,
        userId: this.userId
      })
        .then(res => {
          if (res.code === 20000) {
            this.recentlyModel = res.data;
          } 
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取收藏
    initCollect() {
      getModelLogOther({
        type: modelLogType.COLLECT.type,
        pkId: 0,
        size: listSize,
        sortModel: 'DESC',
        userId: this.userId
      })
        .then(res => {
          if (res.code === 20000) {
            this.collect = res.data;
          }
        }) 
    },
    // 获取浏览
    initBrowser() {
      getModelLogOther({
        type: modelLogType.BROWSER.type,
        pkId: 0,
        size: listSize,
        sortModel: 'DESC',
        userId: this.userId
      })
        .then(res => {
          if (res === 20000) {
            this.browser = res.data;
          }
        }) 
    },
    // 获取点赞
    initSupport() {
      getModelLogOther({
        type: modelLogType.SUPPORT.type,
        pkId: 0,
        size: listSize,
        sortModel: 'DESC',
        userId: this.userId
      })
        .then(res => {
          if (res === 20000) {
            this.support = res.data;
          }
        }) 
    },
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
// 真正的内层项容器
.user-item {
  padding: 20px;
  // background-color: $color-navBg;
  background-color: $color-uploadShow;
  width: 100%;
  border-radius: 4px;
}
// 上面用户部分
.user {
  display: flex;
  box-sizing: border-box;
  margin-bottom: 15px;
  // 左边头像部分
  .user-thumb {
    padding-right: 10px;
    cursor: pointer;
    img {
      width: 90px;
      height: 90px;
      border-radius: 6px;
    }
    .el-image {
      width: 90px;
      height: 90px;
      border-radius: 6px;
      &::v-deep img {
        width: 100%;
        height: 100%;
      }
    }
  }
  // 右边的信息部分
  .user-info {
    box-sizing: border-box;
    min-width: 112px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    color: $color-fontMain;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 60px;
      max-height: 60px;
      -webkit-line-clamp: 3;
      text-overflow: ellipsis;
    }
    // 用户昵称
    h4 {
      height: 22px;
      font-size: 16px;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: $color-main;
      }
    }
    .user-other {
      .btn {
        line-height: 0;
      }
      .btn-ori {
        background-color: $color-ori;
      }
      .fans {
        margin-left: 5px;
        cursor: pointer;
        &:hover {
          color: $color-main;
        }
      }
    }
  }
}

// 最近的三个模型部分
.models {
  width: 100%;
  .models-empty {
    width: 100%;
    padding-bottom: 18.67%;
    position: relative;
    .models-empty-inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 4px;
      border: 1px solid $color-ori;
      .inner {
        height: 100%;
        border: 1px dashed $color-ori;
        color: $color-ori;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    
  }
  .models-container {
    width: 100%;
    .models-item {
      display: inline-block;
      box-sizing: border-box;
      width: 33%;
      padding: 0 2px;
      cursor: pointer;
      .inner {
        width: 100%;
        padding-top: 56%;
        position: relative;
        background: url('~@/assets/first/background.jpg') no-repeat center;
        background-size: 100%;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

// 下面的展示数据部分
.counts {
  margin-top: 5px;
  color: $color-fontMain;
  text-align: center;
  cursor: pointer;
  .count {
    margin: 0 4px;
      &:hover {
      color: $color-main;
    }
  }
}

@media (max-width: 800px) {
  .user-item {
    padding: 20px 10px;
  }
}

@media (max-width: 840px) {
  // 上面用户部分
  .user {
    // 左边头像部分
    .user-thumb {
      img {
        width: 120px;
        height: 120px;
      }
      .el-image {
        width: 120px;
        height: 120px;
      }
    }
  }
}

@media (max-width: 680px) {
  // 上面用户部分
  .user {
    // 左边头像部分
    .user-thumb {
      img {
        width: 100px;
        height: 100px;
      }
      .el-image {
        width: 100px;
        height: 100px;
      }
    }
  }
}

@media (max-width: 450px) {
  // 上面用户部分
  .user {
    // 左边头像部分
    .user-thumb {
      img {
        width: 120px;
        height: 120px;
      }
      .el-image {
        width: 120px;
        height: 120px;
      }
    }
  }
}
@media (min-width: 450px) and (max-width: 750px) {
  .user {
    flex-direction: column;
    align-items: center;
    // 右边的信息部分
    .user-info {
      width: 100%;
      text-align: center;
      h4 {
        margin: 5px 0;
      }
      .user-other {
        margin-top: 5px;
      }
    }
  }
}
// @media (max-width: 450px) {
//   .user {

//   }
// }
</style>