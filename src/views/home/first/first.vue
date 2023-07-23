<template>
  <div class="main">
    <!-- 轮播图部分 -->
    <swiper></swiper>
    <!-- 图标文字介绍部分-静态 -->
    <div class="pic-container">
      <div class="container container-padding">
        <div class="pic-content">
          <ul class="pic-ul">
            <!-- 单个图片项 -->
            <li class="pic-litem" v-for="(item, index) in pics" :key="index">
              <img :src="getPicitem(index)" />
              <el-tooltip effect="light" :content="item.tooltip" placement="top">
                <p>{{item.title}}</p>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 模型推荐部分 -->
    <div class="explore-model-center">
      <!-- 上方搜索条件及标题部分 -->
      <div class="container container-padding">
        <!-- 标题 -->
        <h1 class="explore-title">探索更多模型</h1>
        <!-- 搜索条件部分 -->
        <div class="sort-container">
          <el-radio
            v-for="(item, index) in sorts"
            v-model="exploreSort"
            :key="index"
            :label="item.index"
            @change="exploreSortChange"
          >
            {{ item.label }}
          </el-radio>
        </div>
      </div>
      <!-- 列表组件 -->
      <list 
        :user="user" 
        :loading="loading" 
        :list="modelList" 
        :btnTxt="btnTxt"
        @btnClick="btnClick"
        @itemClick="listItemClick"
        @browserClick="browserClick"
        @collectClick="collectClick"
      >
      </list>
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
            <img :src="getImageRecognition(webArImg)" />
          </div>
        </div>
      </div>
      <!-- <div style="width: 200px;height: 200px;" ref="code"></div> -->
    </dialoger>
    <!-- 分类推荐部分 -->
    <recommend></recommend>
  </div>
</template>
<script>
import {firstPics, exploreSorts, modelListParams, listSize, webArUrl, filePrefix, image, storeGetModel} from '@/utils/global.js';
import { modelList } from '@/api/model/model.js';
import { getAllVr } from '@/api/vr/vr.js';
import Vue from 'vue';
import QRCode from 'qrcodejs2';
import dialoger from '@/components/common/dialoger/dialoger';
import recommend from '@/components/layout/recommend/recommend.vue';
import swiper from '@/components/layout/swiper/swiper.vue';
import list from '@/components/layout/list/list.vue';
export default {
  name: 'first',
  components: {
    recommend,
    swiper,
    list,
    dialoger
  },
  computed: {
    // 根据数组项获取图标文字介绍部分的图标
    getPicitem() {
      return function (index) {
        return require(`@/assets/first/picitem${index + 1}.png`);
      }
    },
    getImg() {
      return function (src) {
        return filePrefix + image + src
      }
    },
    getImageRecognition() {
      return function (src) {
        return src ? `${storeGetModel}/${src}` : require('@/assets/default/user.jpg');
      }
    }
  },
  created() {
    this.getOtherLogin();
    this.initConfig();
    this.initModelList(this.params);
  },
  data() {
    return {
      // 是否有用户系统
      user: false,
      // 图标文字介绍部分遍历数组
      pics: firstPics,
      // 探索更多模型部分单选框遍历数组
      sorts: exploreSorts,
      // 探索更多模型单选框绑定值
      exploreSort: exploreSorts[0].index,
      // 传入list组件的按钮文字
      btnTxt: exploreSorts[0].btnTxt,
      // 模型推荐部分数据列表
      modelList: [],
      // 加载动画开关
      loading: false,
      // 模型推荐部分请求参数
      params: {
        type: modelListParams.type.MODEL,
        sort: modelListParams.sort.COMPREHENSIVE,
        homeStatus: true,
        page: 1,
        size: listSize
      },
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
  methods: {
    getOtherLogin() {
      let { query } = this.$route;
      if (query && query.hasOwnProperty('code') && query.hasOwnProperty('state')) {
        console.log('第三方登录');
        this.$store.dispatch('otherLogin', query)
          .then(() => {
            this.$message({
              message: this.$t('loginSuc'),
              type: 'success',
              duration: 1500
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
      }
    },
    initConfig() {
      let user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user: false;
    },
    // 加载模型推荐部分模型列表数据
    initModelList(params) {
      this.loading = true;
      modelList(params)
        .then(res => {
          if (res.code === 20000) {
            this.modelList = res.data;
          } else {
            this.modelList = [];
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          });
          this.modelList = [];
          this.loading = false;
        })
    },
    initVrModelList(params) {
      this.loading = true;
      getAllVr(params)
        .then(res => {
          if (res.code === 20000) {
            this.modelList = res.data;
          } else {
            this.modelList = [];
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          });
          this.modelList = [];
          this.loading = false;
        });
    },
    // 模型推荐部分按钮点击事件
    btnClick() {
      let current = this.sorts.find(item => item.index === this.exploreSort),
          path = '/home/modelList',
          query = {
            type: current.type
          };
      if (current.type == modelListParams.type.MODEL) {
        query.sort = modelListParams.sort.COMPREHENSIVE;
      } else if (current.type == modelListParams.type.WEBAR) {
        path = '/home/webArList';
      } else if (current.type == modelListParams.type.VR) {
        path = '/home/arList';
      }
      this.$router.push({
        path,
        query
      });
    },
    // 模型推荐部分条件改变事件
    exploreSortChange(e) {
      let current = this.sorts.find(item => item.index === e);
      this.btnTxt = current.btnTxt;
      this.params = Object.assign(this.params, current);
      !current.sort && (Vue.delete(this.params, 'sort'));
      if (current.type === modelListParams.type.VR) {
        this.initVrModelList(this.params);
      } else {
        this.initModelList(this.params);
      }
    },
    // 模型列表项点击事件
    listItemClick(it) {
      if (this.exploreSort === 0 || this.exploreSort === 2) {
        this.$router.push({
          path: '/home/modelListDetail',
          query: {
            id: it.id
          }
        })
      } else if (this.exploreSort === 3) {
        let model = this.modelList.find(item => {
          return item.id === it.id;
        });
        this.webArTitle = model.name;
        this.webArImg = model.imageRecognition;
        this.webArFlag = true;
        this.$nextTick(() => {
          this.createQRCode(model.id);
        });
        // this.createQRCode(model.id);
        this.webArFlag = true;
      } else {
        let path = it.type ? '/vrmodelEditor' : '/panEditor';
        this.$router.push({
          path,
          query: {
            id: it.id,
            flag: false
          }
        })
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
      this.qrcode = new QRCode(that.$refs.code, {
        text: `${that.qrcodeUrl}${id}`,
        width: that.$refs.code.clientWidth,
        height: that.$refs.code.clientHeight
      })
    },
    // 模型列表浏览量点击事件
    browserClick(item) {
      if (this.exploreSort === 0 || this.exploreSort === 1) {
        this.$router.push({
          path: '/home/modelListDetail',
          query: {
            id: item.id
          }
        })
      }
    },
    collectClick(item) {
      if (this.exploreSort === 0 || this.exploreSort === 1) {
        this.$router.push({
          path: '/home/modelListDetail',
          query: {
            id: item.id
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

// 图标文字介绍部分
.pic-container {
  padding: 20px 0;
  background-color: var(--color--navbg);
  // background-color: $navbg;
  .pic-content {
    display: flex;
    box-sizing: border-box;
    color: #fff;
  }
}
// 图标文字介绍部分里的ul
.pic-ul {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .pic-litem {
    width: 12%;
    box-sizing: border-box;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 50px;
      height: auto;
    }
    p {
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 500;
    }
  }
}

// 模型推荐列表部分
.explore-model-center {
  background-color: var(--color--mainbg);
  // 探索更多模型标题
  .explore-title {
    color: var(--color--ori);
    font-size: 30px;
    text-align: center;
    margin: 20px 0 10px 0;
  }
  // 单选框外层
  .sort-container {
    width: 100%;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    &::v-deep .el-radio__input {
      display: none;
    }
    &::v-deep .el-radio__label {
      box-sizing: border-box;
      min-width: 100px;
      color: var(--color--fontMain);
      border-radius: 20px;
      padding: 6px 10px;
      background-color: #222;
      display: block;
      text-align: center;
      font-size: 14px;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    .el-radio.is-checked::v-deep .el-radio__label {
      background-color: var(--color--main);
    }
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

// 适配
@media (max-width: 800px) {
  // 图标文字介绍部分里的ul
  .pic-ul {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .pic-litem {
      width: 24%;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
      padding-bottom: 20px;
    }
  }
}


</style>