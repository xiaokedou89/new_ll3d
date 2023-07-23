<template>
  <!-- 最外层的包裹容器相当于Li，以此适配 -->
  <div class="litem">
    <!-- 真正的总容器 -->
    <div class="inner">
      <!-- 右上角的设置按钮 -->
      <i v-if="setting" class="iconfont icon-shezhitianchong ar-set" @click="linkToSet"></i>
      <!-- 右下角的删除图标 -->
      <i v-if="deletable" class="iconfont icon-shanchu1 delete" @click="del"></i>
      <!-- 上面图片容器 -->
      <div class="pic-item">
        <img v-if="thumb" class="img" :src="getThumb(thumb)" @click="itemClick" />
        <div class="mask" @click="itemClick"></div>
        <!-- 模型浏览量、收藏量部分 -->
        <div class="model-count">
          <el-tooltip effect="dark" :content="$t('modelBrowserCount')" placement="top">
            <div class="count" @click="browserClick">
              <i class="iconfont icon-liulan"></i>
              <span>{{ modelBrowserCount }}</span>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('modelCollectCount')" placement="top">
            <div class="count" @click="collectClick">
              <i class="iconfont icon-dianzan"></i>
              <span>{{ modelCollectCount }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- 下面的信息部分 -->
      <div class="caption">
        <!-- 有用户系统的底部 -->
        <div class="model-show-user" v-if="user">
          <!-- 用户头像部分 -->
          <div 
            :ref="`logo${id}`" 
            class="user-logo" 
            @mouseover="userLogoMouseOver"
            
          >
            <div v-if="!!userId" :ref="`userDom${id}`" class="user-outer aniShowOpt" :class="{topLeft, bottomLeft, topRight, bottomRight}">
              <user-item :userId="userId"></user-item>
            </div>
            <el-image :src="getUserThumb(userThumb)">
              <img slot="error" :src="defaultUserThumb" />
            </el-image>
            <!-- <img @click="linkToUserModel" :src="getUserThumb(userThumb)" /> -->
          </div>
          <!-- 用户信息部分 -->
          <div class="user-info">
            <h4 class="model-name">{{ name }} <img class="hot" v-if="!!userGroupThumb" :src="getImage(userGroupThumb)" /></h4>
            <div class="user-name">
              <span>{{ $t('user') + '：' }}</span>
              <a @click="linkToUserModel">{{ userName }}</a>
            </div>
          </div>
        </div>
        <!-- 无用户系统的底部 -->
        <div class="model-show" v-else>
          <div class="model-info">
            <h4 class="model-name">
              <span>{{ $t('model.name') + '： ' }}</span>
              {{ name }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {filePrefix, image, userModelType, isNetworkImg, defaultUserThumb,
  modelLogType} from '@/utils/global.js';
import userItem from '@/components/common/userItem/userItem.vue';
export default {
  name: 'litem',
  components: {
    userItem
  },
  props: {
    // 是否显示左上角的设置开关
    setting: {
      type: Boolean,
      default: false
    },
    // 是否显示右上角的设置开关
    deletable: {
      type: Boolean,
      default: false
    },
    // 是否有用户系统
    user: {
      type: Boolean,
      default: true
    },
    // 数据id
    id: {
      type: Number,
      require: true,
    },
    // 
    thumb: {
      type: String,
      require: true
    },
    // 模型名称
    name: {
      type: String,
      require: true
    },
    // 用户id
    userId: {
      type: Number,
      default: 0
    },
    // 用户名
    userName: {
      type: String,
      default: '用户名'
    },
    // 用户头像
    userThumb: {
      type: String
    },
    // 用户组图标
    userGroupThumb: {
      type: String
    },
    // 浏览量
    modelBrowserCount: {
      type: Number,
      default: 0
    },
    // 收藏量
    modelCollectCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getUserThumb() {
      return function (src) {
        return src ? (isNetworkImg(src) ? src : filePrefix + image + src) : require('@/assets/first/user-logo.jpg');
      }
    },
    getThumb() {
      return function (src) {
        return src ? filePrefix + image + src : require('@/assets/first/user-logo.jpg');
      }
    },
    getImage() {
      return function (src) {
        return filePrefix + image + src
      }
    }
  },
  data() {
    return {
      defaultUserThumb,
      img: require('@/assets/test/1.png'),
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false,
      showUserDom: false
    }
  },
  methods: {
    // 遮挡层和图片绑定的点击事件
    itemClick() {
      this.$emit('itemClick');
    },
    browserClick() {
      this.$emit('browserClick');
    },
    collectClick() {
      this.$emit('collectClick');
    },
    linkToUserModel() {
      this.$router.push({
        path: '/home/userList',
        query: {
          id: this.userId,
          value: userModelType.ALL,
          type: 'model'
        }
      });
    },
    linkToSet() {
      this.$router.push({
        path: '/home/vrSetting',
        query: {
          id: this.id
        }
      })
    },
    del() {
      this.$emit('del');
    },
    // 用户图标鼠标进入事件
    userLogoMouseOver() {
      this.showUserDom = true;
      const logo = this.$refs[`logo${this.id}`],
            position = logo.getBoundingClientRect(),
            dom = this.$refs[`userDom${this.id}`];
      if (position.left < 400) {
        this.topLeft = false;
        this.bottomLeft = false;
        if (position.top < 280) {
          this.bottomRight = true;
          this.topRight = false;
        } else {
          this.topRight = true;
          this.bottomRight = false;
        }
      } else {
        this.topRight = false;
        this.bottomRight = false;
        if (position.top < 280) {
          this.topLeft = false;
          this.bottomLeft = true;
        } else {
          this.topLeft = true;
          this.bottomLeft = false;
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
// 最外层li
.litem {
  box-sizing: border-box;
  padding: 0 5px;
  margin-bottom: 10px;
  // 总容器
  .inner {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background-color: var(--color--navbg);
    border: none;
    padding: 1px;
    border-radius: 4px;
    // overflow: hidden;
    position: relative;
    // 右上角的全景编辑按钮
    .ar-set {
      position: absolute;
      width: 25px;
      height: 25px;
      background-color: $color-ori;
      top: 1px;
      left: 1px;
      line-height: 25px;
      color: $color-fontMain;
      text-align: center;
      border-top-left-radius: 4px;
      border-bottom-right-radius: 4px;
      z-index: 10;
      cursor: pointer;
    }
    // 右下角的删除图标
    .delete {
      position: absolute;
      width: 25px;
      height: 25px;
      background-color: $color-ori;
      top: 1px;
      right: 1px;
      line-height: 25px;
      color: $color-fontMain;
      text-align: center;
      border-top-right-radius: 4px;
      border-bottom-left-radius: 4px;
      z-index: 10;
      cursor: pointer;
    }
    // 上面图片总容器
    .pic-item {
      box-sizing: border-box;
      width: 100%;
      height: 0;
      padding-bottom: 56.0641%;
      // 默认背景图
      background: url('~@/assets/first/background.jpg') no-repeat center;
      background-size: cover;
      border: 1px solid #000;
      position: relative;
      cursor: pointer;
      // 图片
      .img {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      // 蒙层背景微亮
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: none;
      }
      // 模型收藏和浏览量部分
      .model-count {
        height: 20px;
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 10px;
        z-index: 2;
        color: #bdbdbd;
        // 两个部分的外层容器
        .count {
          display: inline-block;
          margin-right: 5px;
          span {
            margin-left: 2px;
          }
          &:hover {
            color: var(--color--main);
          }
        }
      }
      &:hover .mask {
        display: block;
        background: rgba(255, 255, 255, .1);
        z-index: 1;
      }
    } 
    // 下面的信息部分
    .caption {
      box-sizing: border-box;
      width: 100%;
      height: 70px;
      padding: 9px 5px;
      color: var(--color--fontMain);
      // 有用户系统的底部
      .model-show-user {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        // 用户头像部分
        .user-logo {
          width: 48px;
          height: 48px;
          border: 1px solid #fff;
          position: relative;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
          .el-image {
            width: 100%;
            height: 100%;
          }
          &:hover .user-outer {
            display: block;
          }
          // 用户信息悬浮框
          .user-outer {
            // border: 1px solid $color-dialogTitle;
            border-radius: 4px;
            display: none;
            width: 400px;
            position: absolute;
            z-index: 3;
          }
          .topLeft {
            // top: -280px;
            top: 0;
            transform: translateY(-100%);
            right: 0;
          }
          .user-outer.topLeft::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-top: 16px solid $color-uploadShow;
            border-left: 16px solid transparent;
            border-right: 16px solid transparent;
            border-bottom: 16px solid transparent;
            bottom: -31px;
            right: 8px;
          }
          .topRight {
            top: 0;
            transform: translateY(-100%);
            left: 0;
          }
          .user-outer.topRight::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-top: 16px solid $color-uploadShow;
            border-left: 16px solid transparent;
            border-right: 16px solid transparent;
            border-bottom: 16px solid transparent;
            bottom: -31px;
            left: 8px;
          }
          .bottomLeft {
            bottom: 0;
            transform: translateY(100%);
            right: 0;
          }
          .user-outer.bottomLeft::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-top: 16px solid transparent;
            border-left: 16px solid transparent;
            border-right: 16px solid transparent;
            border-bottom: 16px solid $color-uploadShow;
            top: -31px;
            right: 8px;
          }
          .bottomRight {
            bottom: 0;
            transform: translateY(100%);
            left: 0;
          }
          .user-outer.bottomRight::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-top: 16px solid transparent;
            border-left: 16px solid transparent;
            border-right: 16px solid transparent;
            border-bottom: 16px solid $color-uploadShow;
            top: -31px;
            left: 8px;
          }
        }
        // 用户信息部分
        .user-info {
          width: calc(100% - 48px);
          height: 100%;
          // 模型名称
          .model-name {
            font-size: 14px;
            padding-left: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 5px;
          }
          // 用户名称
          .user-name {
            margin-top: 10px;
            padding-left: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      // 无用户系统的底部
      .model-show {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        .model-info {
          height: 100%;
          // 模型名称
          .model-name {
            font-size: 14px;
            padding-left: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
.hot {
  width: 16px;
  height: 16px;
  vertical-align: center;
  margin-left: 4px;
}
@media (min-width: 951px) {
  .litem {
    width: 25%;
  }
}
@media (min-width: 551px) and (max-width: 950px) {
  .litem {
    width: 50%;
  }
}
@media (max-width: 550px) {
  .litem {
    width: 100%;
  }
}
@media (max-width: 800px) {
  .user-outer {
    display: none!important;
  }
}
</style>