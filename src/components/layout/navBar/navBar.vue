<template>
  <div class="nav-bar">
    <!-- 移动端下的搜索条 -->
    <div class="search-content" :class="{aniShowOpt: searchFlag}" v-show="adaptFlag && searchFlag">
      <i class="iconfont icon-chaxun icon-left"></i>
      <input type="text" v-model="nameInput" />
      <button @click="linkToModelByName">{{ $t('search') }}</button>
      <el-tooltip effect="light" :content="$t('changeNav')" placement="bottom">
        <i class="iconfont icon-shangjiantou icon-right" @click="searchFlag = false"></i>
      </el-tooltip>
    </div>
    <!-- 导航栏主体部分 -->
    <div class="container nav-container" :class="{aniShowOpt: !searchFlag}" v-show="!searchFlag">
      <!-- 适配移动端左边显示侧边栏按钮 -->
      <div class="nav-aside-flag" v-show="adaptFlag && info" @click="asideFlag = true">
        <el-tooltip effect="light" :content="$t('showAsideNav')" placement="bottom">
          <i class="iconfont icon-tubiao13 nav-icon"></i>
        </el-tooltip>
      </div>
      <!-- 适配移动端右边搜索按钮 -->
      <div class="nav-search-flag" v-show="adaptFlag && info" @click="searchFlag = true">
        <el-tooltip effect="light" :content="$t('showSearchNav')" placement="bottom">
          <i class="iconfont icon-chaxun nav-icon"></i>
        </el-tooltip>
      </div>
      <!-- logo -->
      <div class="nav-logo">
        <a @click="logoClick">
          <img src="~@/assets/logo.png" :alt="$t('logoName')" />
        </a>
      </div>
      <!-- 动态主体框 -->
      <!-- 非移动端 -->
      <div class="nav-content" v-show="!adaptFlag" v-if="info">
        <!-- 非移动端-菜单栏 -->
        <div class="content-left">
          <dropdown-menu 
            class="left-item"  
            v-for="(item, index) in menu"
            :key="index"
            :label="item.parent.name" 
            :icon="item.childList.length > 0 ? 'icon-sanjiaodown' : ''"
            :dropable="item.childList.length > 0"
          >
            <li v-for="(child, ind) in item.childList" :key="ind" @click="menuItemClick(child)">{{ child.name }}</li>
            <!-- <li v-for="(child, ind) in item.childList" :key="ind">11</li> -->
          </dropdown-menu>
        </div>
        <!-- 非移动端-右边部分 -->
        <div class="content-right">
          <!-- 搜索框 -->
          <div class="nav-search right-item">
            <i class="iconfont icon-chaxun"></i>
            <input type="text" maxlength="10" v-model="nameInput" />
            <button type="button" @click="linkToModelByName">{{ $t('search') }}</button>
          </div>
          
          <!-- 个人信息 -->
          <dropdown-menu
            v-if="isUserSystem" 
            class="right-item" 
            :class="{nohover: isLogin}" 
            :label="$t('login')" 
            :dropable="userDrop"
            @contentClick="linkToLogin"
          >
            <template v-slot:content v-if="isLogin">
              <div class="user">
                <!-- 临时默认头像 -->
                <img v-if="!userInfo" src="~@/assets/user.png">
                <img v-else :src="getUserThumb(userInfo.thumb)" />
              </div>
            </template>
            <li v-if="userInfo">{{ getNickName(userInfo.nickname) }}</li>
            <li @click="linkToMyModel">{{ $t('myModel') }}</li>
            <li @click="linkToMyAr">{{ $t('myVR') }}</li>
            <li @click="linkToMyWebar">{{ $t('myAR') }}</li>
            <li @click="linkToMyMaterial">{{ $t('myMaterial') }}</li>
            <li @click="linkToMyMessage">{{ $t('myMessage') }}</li>
            <li @click="linkToSetting">{{ $t('userSetting') }}</li>
            <li @click="logout">{{ $t('logout') }}</li>
          </dropdown-menu>
          <!-- 上传部分 -->
          <dropdown-menu class="right-item" :label="$t('upload')" :icon="'icon-sanjiaodown'" dropable>
            <li @click="linkToUpdataVR">{{$t("uploadModelPanorama")}}</li>
            <li @click="linkToUpdataMaterial">{{$t("uploadMaterial")}}</li>
            <li @click="linkToWebAr">{{$t("uploadWebAr")}}</li>
            <li @click="linkToUpdataModel">{{$t("uploadModel")}}</li>
          </dropdown-menu>
          <!-- 语言选择部分 -->
          <!-- <div class="nav-i18n right-item">
            <span class="label">{{$t('language')}}</span>
            <el-select v-model="langType" @change="selectLang">
              <el-option v-for="(item, index) in langTypes" :key="index" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </div> -->
        </div>
        
      </div>  
      <!-- 移动端-以侧边栏形式显示 -->
      <div class="nav-content-adapt" :class="{aniShowOpt: asideFlag && adaptFlag}" v-show="asideFlag && adaptFlag" v-if="info">
        <!-- <div class="nav-content-aside-flag iconfont icon-sanjiaoleft" @click="asideFlag = false"></div> -->
        <!-- 个人信息部分 -->
        <!-- 未登录显示-登录按钮、注册 -->
        <div class="user" v-if="isUserSystem" v-show="!isLogin">
          <button class="btn login confirmBtn" @click="linkToLoginBtn">{{ $t('login') }}</button>
          <!-- <div class="regin-content">
            <a @click="linkToRegin">{{ $t('reginTxt') }}</a>
          </div> -->
        </div>
        <!-- 登录显示-个人头像、用户列表 -->
        <div class="user" v-if="isUserSystem && userInfo" v-show="isLogin">
          <div class="user-photo">
            <img :src="getUserThumb(userInfo.thumb)" />
          </div>
          <div class="collapse">
            <div class="collapse-menu">
              <ul>
                <li class="collapse-item">{{ getNickName(userInfo.nickname) }}</li>
                <li class="collapse-item" @click="linkToMyModel">{{ $t('myModel') }}</li>
                <li class="collapse-item" @click="linkToMyAr">{{ $t('myVR') }}</li>
                <li class="collapse-item" @click="linkToMyWebar">{{ $t('myAR') }}</li>
                <li class="collapse-item" @click="linkToMyMaterial">{{ $t('myMaterial') }}</li>
                <li class="collapse-item" @click="linkToMyMessage">{{ $t('myMessage') }}</li>
                <li class="collapse-item" @click="linkToSetting">{{ $t('userSetting') }}</li>
                <li class="collapse-item" @click="logout">{{ $t('logout') }}</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 下拉菜单部分 -->
        <div class="collapse" v-for="(item, index) in menu" :key="index">
          <div class="collapse-title">
            <span class="collapse-title-label">{{ item.parent.name }}</span>
            <i 
              class="collapse-title-icon iconfont" 
              :class="{'icon-sanjiaodown': item.collapseFlag, 'icon-shangjiantou': !item.collapseFlag}" v-if="item.childList.length > 0"
              @click="item.collapseFlag = !item.collapseFlag"
            ></i>
          </div>
          <div class="collapse-menu" 
            :class="{menuHide: item.collapseFlag, menuShow: !item.collapseFlag}" 
            v-if="item.childList.length > 0"
          >
            <ul>
              <li class="collapse-item" v-for="(itm, ind) in item.childList" @click="menuItemClick(itm)" :key="ind">
                {{ itm.name }}
              </li>
            </ul>
          </div>
        </div>
        <!-- 上传部分 -->
        <div class="collapse">
          <div class="collapse-title">
            <span class="collapse-title-label">{{ $t('upload') }}</span>
            <i 
              class="collapse-title-icon iconfont"
              :class="{'icon-sanjiaodown': uploadAsideFlag, 'icon-shangjiantou': !uploadAsideFlag}"
              @click="uploadAsideFlag = !uploadAsideFlag"
            ></i>
          </div>
          <div class="collapse-menu" :class="{menuHide: uploadAsideFlag, menuShow: !uploadAsideFlag}">
            <ul>
              <li class="collapse-item" @click="linkToUpdataVR">{{$t("uploadModelPanorama")}}</li>
              <li class="collapse-item" @click="linkToUpdataMaterial">{{$t("uploadMaterial")}}</li>
              <li class="collapse-item" @click="linkToWebAr">{{$t("uploadWebAr")}}</li>
              <li class="collapse-item" @click="linkToUpdataModel">{{$t("uploadModel")}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dropdownMenu from '@/components/common/dropdownMenu/dropdownMenu.vue';
import dropdown from '@/components/common/dropdown/dropdown.vue';
import Vue from 'vue';
import { i18n } from '@/assets/languages/i18n.js';
import { getNews, getNavBarNews } from '@/api/navbar/navbar.js';
import { getCurrentInfo } from '@/api/user/user.js';
import { filePrefix, image, modelLogType, userModelType, isNetworkImg } from '@/utils/global.js';
export default {
  name: 'NavBar',
  components: {
    dropdownMenu,
    dropdown
  },
  props: {
    // 是否渲染下拉菜单和用户信息上传等部分
    info: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      langType: '',
      langTypes: this.$i18ntypes,
      // 移动端侧边栏上传下拉菜单的开关控制
      uploadAsideFlag: true,
      // 动态下拉菜单数据列表
      menu: [],
      // 是否有用户系统
      isUserSystem: false,
      // 是否登录
      isLogin: false,
      // 登录后获取的用户信息
      userInfo: null,
      // 非移动端是否开启用户操作下拉
      userDrop: false,
      // 适配开关 true为移动端 false为非移动端
      adaptFlag: false,
      // 搜索条开关
      searchFlag: false,
      // 移动端侧边栏显示开关
      asideFlag: false,
      // 模型名称搜索框绑定值
      nameInput: ''
    }
  },
  watch: {
    adaptFlag(val) {
      if (!val) {
        this.searchFlag = false
      } else {
        this.asideFlag = false
      }
    },
    searchFlag(val) {
      if (val) {
        this.asideFlag = false
      }
    },
    isLogin(val) {
      this.userDrop = val ? (this.userInfo ? true : false) : false;
    },
    userInfo(val) {
      this.userDrop = val ? (this.isLogin ? true : false ) : false;
    }
  },
  created() {
    const that = this;
    // 判断是否有用户系统
    const isUserSystem = this.$store.getters.user;
    this.isUserSystem = isUserSystem !== undefined ? !!+isUserSystem : false;
    // 判断是否登录
    this.isLogin = !!this.$store.getters.token;
    this.isUserSystem && this.isLogin && this.initUser();
    this.init();
    window.addEventListener('resize', that.pageResize, false);
    window.addEventListener('click', that.clickToCloseAside, false);
    this.langType = this.$i18n.locale;
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', that.pageResize, false);
    window.removeEventListener('click', that.clickToCloseAside, false);
  },
  computed: {
    // 获取用户头像
    getUserThumb() {
      return function (src) {
        return src ? (isNetworkImg(src) ? src : filePrefix + image + src) : require('@/assets/user.png');
        // return src ? `${filePrefix}${image}${src}` : require('@/assets/user.png');
      }
    },
    // 获取用户昵称
    getNickName() {
      return function (nickname) {
        return nickname ? nickname : i18n.t('me');
      }
    }
  },
  methods: {
    clickToCloseAside(e) {
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (deviceWidth > 900) {
        return;
      } else {
        e.x > 256 && (this.asideFlag = false);
      }
    },
    // 初始化-计算屏幕尺寸设置初始开关状态、获取动态导航栏数据
    init() {
      // 初始化判断屏幕宽度
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (deviceWidth > 900) {
        this.adaptFlag = false;
      } else {
        this.adaptFlag = true;
      }
      getNavBarNews()
        .then(res => {
          if (res.code === 20000) {
            for (let item of res.data) {
              Vue.set(item, 'collapseFlag', true);
            }
            this.menu = res.data;
          } else {
            this.menu = [];
          }
        })
        .catch(err => {
          console.log(err);
          this.menu = [];
        })
      /*
      getNews('news', {
        recommend: 1,
        status: 1,
        parentId: 0
      })
        .then(res => {
          console.log('旧的导航栏')
          console.log(res);
          if (res.code === 20000) {
            for (let item of res.data) {
              Vue.set(item, 'collapseFlag', true);
              Vue.set(item, 'childList', []);
              getNews('news', {
                recommend: 1,
                status: 1,
                parentId: item.id
              })
                .then(childRes => {
                  if (childRes.code === 20000) {
                    item.childList = childRes.data;
                  }
                })
            }
            this.menu = res.data;
          } else {
            this.menu = [];
          }
        })
        .catch(err => {
          this.menu = [];
        })
      */
    },
    // 初始化用户信息
    initUser() {
      getCurrentInfo()
        .then(res => {
          if (res.code === 20000) {
            this.userInfo = res.data;
          } else {
            this.userInfo = null;
          }
        })
        .catch(err => {
          this.userInfo = null;
        })
    },
    // 点击移动端下搜索切换搜索条
    showSearch() {
      this.searchFlag = true
    },
    // 页面大小调整时触发事件
    pageResize(e) {
      this.$nextTick(() => {
        if (e.currentTarget.innerWidth > 900) {
          this.adaptFlag = false;
        } else {
          this.adaptFlag = true;
        }
      })
    },
    selectLang(e) {
      sessionStorage.setItem('lang', e)
      window.location.reload()
    },
    // logo点击事件
    logoClick() {
      this.$router.replace('/');
      this.asideFlag = false;
    },
    // 跳转到登录页面
    linkToLogin() {
      let path = '/login'
      !this.isLogin && this.$router.push(path)
      this.asideFlag = false;
    },
    linkToLoginBtn() {
      this.$router.push('/login')
    },
    // 跳转到注册页面
    linkToRegin() {
      this.$router.push('/regin')
    },
    // 跳转到上传模型全景
    linkToUpdataVR() {
      this.$router.push('/home/updataVR')
      this.asideFlag = false;
    },
    // 跳转到上传素材
    linkToUpdataMaterial() {
      this.$router.push('/home/updataMaterial')
      this.asideFlag = false;
    },
    // 跳转到上传webAR
    linkToWebAr(){
      this.$router.push('/home/updataWebAr')
      this.asideFlag = false;
    },
    // 跳转到上传模型
    linkToUpdataModel(){
      this.$router.push('/home/updataModel')
      this.asideFlag = false;
    },
    // 跳转到我的vr模型
    linkToMyModel() {
      this.$router.push({
        path: '/home/userList',
        query: {
          value: userModelType.PRIVATE,
          type: 'model'
        }
      });
      this.asideFlag = false;
    },
    // 跳转到我的ar全景
    linkToMyAr() {
      this.$router.push({
        path: '/home/userArList'
      });
      this.asideFlag = false;
    },
    // 跳转到我的webar
    linkToMyWebar() {
      this.$router.push({
        path: '/home/userList',
        query: {
          value: userModelType.AR,
          type: 'model'
        }
      });
      this.asideFlag = false;
    },
    // 跳转到我的素材
    linkToMyMaterial() {
      this.$router.push({
        path: '/home/materialList'
      });
      this.asideFlag = false;
    },
    // 跳转到我的消息
    linkToMyMessage() {
      this.$router.push({
        path: '/home/message'
      });
      this.asideFlag = false;
    },
    // 跳转到用户设置
    linkToSetting() {
      this.$router.push('/home/userSetting');
      this.asideFlag = false;
    },
    // 点击注销登录
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$message({
            message: this.$t('logoutSuc'),
            type: 'success',
            duration: 1500
          });
          // this.$router.replace('/');
          window.location.reload();
        })
        .catch(() => {
          this.$message({
            message: this.$t('logoutFail'),
            type: 'error',
            duration: 1500
          });
        });
      this.asideFlag = false;
    },
    // 名称搜索框点击按钮事件
    linkToModelByName() {
      this.$router.push({
        path: '/home/modelList',
        query: {
          name: this.nameInput
        }
      })
      this.asideFlag = false;
    },
    menuItemClick(item) {
      if (item.type) {
        this.$router.push({
          path: item.url,
          query: {
            categoryId: item.id,
            id: item.id
          }
        })
      } else {
        let a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.click();
      }
      this.asideFlag = false;
    }
  }
}
</script>
<style lang="scss" scoped>
// new style
// 最外层
.nav-bar {
  width: 100%;
  background-color: var(--color--navbg);
  // background-color: $navbg;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  // 移动端下显示的搜索条
  .search-content {
    width: 100%;
    height: 100%;
    position: relative;
    .icon-left {
      position: absolute;
      left: 0;
      top: 0;
      width: 50px;
      height: 100%;
      font-size: 20px;
      text-align: center;
    }
    input {
      box-sizing: border-box;
      width: calc(100% - 80px);
      height: 100%;
      outline: none;
      padding: 0 0 0 50px;
      border: none;
      font-size: 20px;
    }
    button {
      box-sizing: border-box;
      position: absolute;
      right: 50px;
      height: 100%;
      width: 80px;
      border: none;
      cursor: pointer;
      background-color: var(--color--main);
      // background-color: $main;
      color: var(--color--fontMain);
      // color: $fontMain;
    }
    .icon-right {
      width: 50px;
      height: 100%;
      position: absolute;
      right: 0;
      text-align: center;
      font-size: 20px;
      color: var(--color--fontMain);
      // color: $fontMain;
      background-color: rgba(255, 255, 255, .1);
      cursor: pointer;
    }
  }
  // 适配的版心容器部分
  .container {
    height: 100%;
    position: relative;
    // 左右菜单、搜索图标容器
    .nav-aside-flag,
    .nav-search-flag {
      position: absolute;
      width: 18px;
      height: 100%;
      top: 0;
      .nav-icon {
        display: inline-block;
        height: 100%;
        width: 100%;
        line-height: 44px;
        color: var(--color--fontMain);
        // color: $fontMain;
        font-weight: 700;
        font-size: 18px;
        cursor: pointer;
      }
      .nav-icon:hover {
        color: var(--color--main);
        // color: $main;
      }
    }
    .nav-aside-flag {
      left: 10px;
    }
    .nav-search-flag {
      right: 10px;
    }
    // logo容器
    .nav-logo {
      width: 121px;
      height: 100%;
      a {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          vertical-align: center;
        } 
      }
    }
  }
}
// 屏幕大于900像素
@media (min-width: 900px) {
  .nav-bar {
    height: 60px;
    // line-height: 60px;
  }
  .nav-container {
    display: flex;
    justify-content: flex-start;
    // 除了logo以外的部分
    .nav-content {
      width: calc(100% - 121px);
      height: 100%;
      display: flex;
      // overflow: hidden;
      justify-content: space-between;
      color: var(--color--fontMain);
      // color: $fontMain;
      .content-left {
        width: auto;
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 20px;
        .left-item {
          display: inline-block;
          height: 100%;
          line-height: 60px;
          margin-left: 10px;
        }
        .dropdown-menu {
          padding: 0 4px;
          &:hover {
            background-color: rgba(255, 255, 255, .2);
          }
        }
      }
      .content-right {
        width: auto;
        height: 100%;
        display: flex;
        align-items: center;
        .right-item {
          display: inline-block;
          height: 100%;
          line-height: 60px;
          margin-left: 10px;
        }
        .nav-search {
          width: 170px;
          position: relative;
          i {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 18px;
            color: var(--color--fontMain);
            // color: $fontMain;
            margin-left: 8px;
          }
          input {
            box-sizing: border-box;
            width: 100%;
            outline: none;
            height: 32px;
            background-color: var(--color--mainbg);
            // background-color: $mainbg;
            border: 2px solid transparent;
            border-radius: 5px;
            padding-left: 26px;
            font-size: 14px;
            color: var(--color--fontMain);
            // color: $fontMain;
          }
          button {
            position: absolute;
            right: 0;
            top: 14px;
            height: 32px;
            border: none;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            background-color: rgba(255, 255, 255, .5);
            cursor: pointer;
          }
        }
        .dropdown-menu {
          padding: 0 10px;
          .user {
            width: 40px;
            height: 100%;
            img {
              width: 32px;
              height: 32px;
              border-radius: 8px;
              border: 1px solid var(--color--fontMain);
              // border: 1px solid $fontMain;
              vertical-align: middle;
            }
          }
        }
        .dropdown-menu.nohover {
          padding: 0;
        }
        .dropdown-menu:hover {
          background-color: rgba(255, 255, 255, .2);
        }
        // 登录图标去除悬停背景色
        .nohover:hover {
          background-color: transparent;
        }
        // 语言选择部分修改默认样式
        .nav-i18n .el-select {
          width: 80px;
          line-height: 50px;
        }
        .nav-i18n span.label {
          margin-right: 4px;
        }
        .nav-i18n::v-deep .el-input__inner {
          padding: 0 20px 0 10px;
        }
        .nav-i18n::v-deep .el-input__suffix {
          right: 0;
        }
        .nav-i18n::v-deep .el-select .el-input .el-select__caret {
          color: #222;
        }
      }
    }
  }
}
// 屏幕小于900像素
@media (max-width: 900px) {
  .nav-container {
    display: block;
  }
  .nav-bar {
    height: 44px;
    box-shadow: 0 1px 5px rgb(85 85 85 / 15%);
    font-size: 16px;
    line-height: 44px;
    top: 0;
    .container {
      width: 100%;
      .nav-logo {
        margin: 0 auto;
      }
      .nav-content-adapt {
        // box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        width: 256px;
        height: 100%;
        line-height: 1.42857143;
        background-color: var(--color--adaptbg);
        // background-color: $adaptbg;
        border-right: 1px solid var(--color--adaptborder);
        // border-right: 1px solid $adaptborder;

        overflow-y: auto;
        color: var(--color--fontMain);
        // color: $fontMain;
        .nav-content-aside-flag {
          position: fixed;
          top: 50%;
          left: 256px;
          width: 20px;
          height: 36px;
          line-height: 36px;
          font-size: 18px;
          font-weight: bold;
          padding-left: 2px;
          background-color: var(--color--adaptbg);
          // background-color: $adaptbg;
          border-radius: 4px;
          border-top: 1px solid var(--color--adaptborder);
          // border-top: 1px solid $adaptborder;
          border-right: 1px solid var(--color--adaptborder);
          // border-right: 1px solid $adaptborder;
          border-bottom: 1px solid var(--color--adaptborder);
          // border-bottom: 1px solid $adaptborder;
          cursor: pointer;
        }
        // 侧边栏用户信息部分
        .user {
          width: 100%;
          box-sizing: border-box;
          border-bottom: 1px solid var(--color--mainborder);
          // border-bottom: 1px solid $mainborder;
          margin: 10px auto 0 auto;
          display: flex;
          position: relative;
          flex-direction: column;
          // 未登录时的按钮
          .login {
            width: calc(100% - 20px);
            margin: 10px;
          }
          // 注册提示部分
          .regin-content {
            padding: 0 0 10px;
            font-size: 14px;
            text-align: center;
            a {
              color: var(--color--fontMain);
              // color: $fontMain;
            }
            a:hover {
              color: var(--color--main);
              // color: $main;
            }
          }
          // 登录后显示的头像部分
          .user-photo {
            width: 100%;
            margin: 20px auto;
            display: block;
            text-align: center;
            img {
              box-sizing: border-box;
              width: 80px;
              height: 80px;
              padding: 2px;
              border: 2px solid rgba(255, 255, 255, .7);
              border-radius: 50%;
              background-position: center center;
              background-size: cover;
              vertical-align: middle;
            }
          }
        }
        .collapse {
          width: 100%;
          .collapse-title {
            position: relative;
            padding-left: 20px;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1px;
            background-color: #666;
            margin-bottom: 1px;
            .collapse-title-label {
              display: inline-block;
              width: 80%;
              height: 40px;
              line-height: 40px;
            }
            .collapse-title-icon {
              display: inline-block!important;
              width: 20%;
              height: 40px;
              line-height: 40px;
              text-align: center;
              cursor: pointer;
            }
          }
          .collapse-menu {
            width: 100%;
            font-size: 14px;
            overflow: hidden;
            ul {
              width: 100%;
              .collapse-item {
                display: block;
                padding: 10px 25px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                cursor: pointer;
              }
              .collapse-item:hover {
                background-color: rgba(255, 255, 255, .1);
                color: var(--color--main);
                // color: $main;
              }
            }
          }
          .collapse-menu.menuHide {
            max-height: 0;
          }
          .collapse-menu.menuShow {
            max-height: 400px;
            animation: heightShow 1600ms ease 1;
          }
        }
      }
      // 修改侧边栏默认滚动条
      .nav-content-adapt::-webkit-scrollbar {
        width: 6px;
        background-color: #333;
      }
      .nav-content-adapt::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 2px;
      }
      .nav-content-adapt::-webkit-scrollbar-track {
        width: 6px;
        background-color: #333;
      }
    }
  }
}
@keyframes heightShow {
  from {
    max-height: 0;
  }
  to {
    max-height: 400px;
  }
}
</style>
