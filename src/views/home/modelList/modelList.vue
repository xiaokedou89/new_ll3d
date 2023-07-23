<template>
  <div class="main">
    <!-- 条件搜索部分和标题部分 -->
    <div class="container container-padding">
      <!-- 标题部分 -->
      <div class="model-title">
        <h1>
          <a class="active">{{ $t('allModel') }}</a>
          <a @click="linkToAr">{{ $t('allVR') }}</a>
          <a @click="linkToWebAR">{{ $t('allWebAR') }}</a>
        </h1>
      </div>
      <!-- 条件筛选部分总容器 -->
      <div class="condition-container">
        <!-- 左侧的单选条件部分 -->
        <div class="radio-condition">
          <!-- 类别 -->
          <dropdown-menu class="radio-item" v-if="categorys.length > 0" :placement="'bottom'" :dropable="true">
            <template v-slot:content>
              <!-- 显示在条件部分的部分 -->
              <div class="radio-container">
                <!-- 左边的icon -->
                <i class="iconfont condition-icon-left icon-fenleib"></i>
                <!-- 中间的固定文字 -->
                <span class="condition-title">{{ $t('category') }}</span>
                <span class="condition-select" v-if="categoryObj">
                  {{ categoryObj.name }}
                  <i class="iconfont icon-close icon-guanbi" @click="categoryCancel"></i>
                </span>
                <!-- 右边的icon -->
                <i class="iconfont condition-icon-right icon-sanjiaodown"></i>
              </div>
            </template>
            <!-- 下拉菜单中的每项 -->
            <li v-for="(item, index) in categorys" :key="index" @click.stop="checkCategory(item)">
              <!-- item无childList显示 -->
              <!-- <span v-if="item.childList < 1" @click.stop="checkCategory(item)">{{ item.name }}</span> -->
              <span v-if="item.childList < 1" >{{ item.name }}</span>
              <!-- item有childList显示的二级菜单 -->
              <dropdown-menu v-else  :dropable="true" :placement="'right'">
                <template v-slot:content>
                  <!-- 二级菜单包裹在li中的部分 -->
                  <div class="dropdown-title" @click.stop="checkCategory(item)">
                    <span>{{ item.name }}</span>
                    <i class="iconfont icon-sanjiaoright condition-icon-inner"></i>
                  </div>
                </template>
                <!-- 二级菜单的每项 -->
                <li v-for="(itm, ind) in item.childList" :key="ind" @click.stop="checkCategory(itm)">{{ itm.name }}</li>
              </dropdown-menu>
            </li>
          </dropdown-menu>
          <!-- 日期 -->
          <dropdown-menu class="radio-item" :placement="'bottom'" :dropable="true">
             <template v-slot:content>
              <!-- 显示在条件部分的部分 -->
              <div class="radio-container">
                <!-- 左边的icon -->
                <i class="iconfont condition-icon-left icon-fenleib"></i>
                <!-- 中间的固定文字 -->
                <span class="condition-title">{{ $t('date') }}</span>
                <span class="condition-select" v-if="timeObj">
                  {{ timeObj.name }}
                  <i class="iconfont icon-close icon-guanbi" @click="timeCancel"></i>
                </span>
                <!-- 右边的icon -->
                <i class="iconfont condition-icon-right icon-sanjiaodown"></i>
              </div>
            </template>
            <li v-for="(item, index) in times" :key="index" @click.stop="checkTime(item)">
              <span>{{ item.name }}</span>
            </li>
          </dropdown-menu>
          <!-- 是否下载 -->
          <dropdown-menu class="radio-item" :placement="'bottom'" :dropable="true">
             <template v-slot:content>
              <!-- 显示在条件部分的部分 -->
              <div class="radio-container">
                <!-- 左边的icon -->
                <i class="iconfont condition-icon-left icon-xiazai-wenjianxiazai-01"></i>
                <!-- 中间的固定文字 -->
                <span class="condition-title">{{ $t('isDownload') }}</span>
                <span class="condition-select" v-if="downloadObj">
                  {{ downloadObj.name }}
                  <i class="iconfont icon-close icon-guanbi" @click="downloadCancel"></i>
                </span>
                <!-- 右边的icon -->
                <i class="iconfont condition-icon-right icon-sanjiaodown"></i>
              </div>
            </template>
            <li v-for="(item, index) in downloads" :key="index" @click.stop="checkDownload(item)">
              <span>{{ item.name }}</span>
            </li>
          </dropdown-menu>
        </div>
        <!-- 右侧的sort排序部分 -->
        <div class="sort-condition">
          <!-- 排序文字部分 -->
          <div class="sort-label">{{ $t('sort') }}</div>
          <!-- 单选框部分 -->
          <div class="sorts">
            <el-radio 
              v-for="(item, index) in sorts" 
              v-model="params.sort"
              :key="index" 
              :label="item.value"
              @change="sortChange"
            >
              <el-tooltip :content="item.tooltip" effect="light">
                <i class="iconfont" :class="[item.icon]" ></i>
              </el-tooltip>
            </el-radio>
          </div>
        </div>
      </div>
      <!-- 名称搜索 -->
      <div class="name-condition">
        <span>{{ $t('nameSearch') + '：' }}</span>
        <el-input type="text" v-model="params.name" />
        <button @click="changeParamsName">{{ $t('search') }}</button>
      </div>
    </div>
    <!-- 主列表部分 -->
    <list 
      :user="user" 
      :loading="loading" 
      :list="list" 
      @btnClick="btnClick"
      @itemClick="itemClick"
      @browserClick="browserClick"
      @collectClick="collectClick"
    ></list>
  </div>
</template>
<script>
import list from '@/components/layout/list/list.vue';
import Vue from 'vue';
import {modelList} from '@/api/model/model.js';
import {getNews} from '@/api/news/news.js';
import {listSize, modelListParams} from '@/utils/global.js';
import {i18n} from '@/assets/languages/i18n.js';
import dropdown from '@/components/common/dropdown/dropdown.vue';
import dropdownMenu from '@/components/common/dropdownMenu/dropdownMenu'
// params默认值
const defaultParams = {
  homeStatus: false,
  type: modelListParams.type.MODEL,
  sort: modelListParams.sort.COMPREHENSIVE,
  downloadStatus: modelListParams.isDownload.all,
  time: modelListParams.time.all,
  // categoryId: null,
  categoryId: -1,
  // sortMode: 'DESC',
  // pkId: 0,
  name: '',
  page: 1,
  size: listSize
};
// 时间条件数组
const times = [
  { value: modelListParams.time.day, name: i18n.t('day')},
  { value: modelListParams.time.week, name: i18n.t('week')},
  { value: modelListParams.time.month, name: i18n.t('month')},
];
// 下载条件数组
const downloads = [
  { value: modelListParams.isDownload.no, name: i18n.t('undownloadable') },
  { value: modelListParams.isDownload.yes, name: i18n.t('downloadable') }
];
// sorts排序条件数组
const sorts = [
  { value: modelListParams.sort.COMPREHENSIVE, icon: 'icon-fenlei1', tooltip: i18n.t('comprehensive') },
  { value: modelListParams.sort.TIME, icon: 'icon-31shijian', tooltip: i18n.t('time')}
];
export default {
  name: 'modelList',
  components: {
    list,
    dropdown,
    dropdownMenu
  },
  data() {
    return {
      user: false,
      // 传入list组件的加载动画开关
      loading: false,
      minId: 0,
      maxId: 0,
      // 传入list组件的列表数据
      list: [],
      // 分类条件选择数组
      categorys: [],
      // 时间条件选择数组
      times,
      // 下载条件选择数组
      downloads,
      // 排序sort数组
      sorts,
      // 拉取数据参数
      params: Object.assign({}, defaultParams),
      // 分类条件绑定的对象
      categoryObj: null,
      // 时间条件绑定对象
      timeObj: null,
      // 下载条件绑定对象
      downloadObj: null,
      flag: false,
      conditionFlag: false
    }
  },
  watch: {
    'params.categoryId'() {
      if (!this.params.categoryId || this.params.categoryId == -1) {
        this.categoryObj = null;
      }
    }
  },
  created() {
    this.initConfig();
    this.$route.query && (this.params = Object.assign(this.params, this.$route.query));
    this.initCategory();
    console.log(this.params)
    this.initList(this.params);
  },
  methods: {
    // 获取项目相关配置信息
    initConfig() {
      let user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user : false;
    },
    // 初始化分类信息
    initCategory() {
      getNews(modelListParams.type.MODEL, {
        recommend: -1,
        status: 1,
        parentId: 1,
        pkId:-1
      })
        .then(res => {
          console.log(res)
          const list = [];
          if (res.code === 20000) {
            for (const item of res.data) {
              Vue.set(item, 'childList', []);
              const promiseItem = new Promise((resolve, reject) => {
                getNews(modelListParams.type.MODEL, {
                  recommend: -1,
                  status: 1,
                  parentId: item.id
                })
                  .then(childRes => {
                    if (childRes.code === 20000 && childRes.data) {
                      item.childList = childRes.data;
                    }
                    resolve(item);
                  })
                  .catch(() => {
                    resolve(item);
                  })
              });
              list.push(promiseItem);
            }
            Promise.all(list)
              .then(result => {
                this.categorys = result;
                this.initCondition();
              })
          } 
        })
        .catch(err => {
          console.log('获取模型分类失败');
          console.log(err);
        })
    },
    // 初始化参数条件回显
    initCondition() {
      // categoryId
      // isDownload
      // time
      let result = null;
      if (+this.params.time !== -1) {
        let time = this.times.find(item => item.value === +this.params.time);
        this.timeObj = Object.assign({}, time);
      }
      if (+this.params.downloadStatus !== -1) {
        let download = this.downloads.find(item => item.value === +this.params.downloadStatus);
        this.downloadObj = Object.assign({}, download);
      }
      if (this.params.categoryId !== null && this.params.categoryId !== -1 && this.categorys.length > 0) {
        find(+this.params.categoryId, this.categorys);
        this.categoryObj = Object.assign({}, result);
      }
      function find(id, arr) {
        +id;
        for (const item of arr) {
          item.id === id && (result = item);
          if (item.childList && item.childList.length > 0) {
            find(id, item.childList);
          }
        }
      }
    },
    // 拉取列表数据
    initList(params) {
      this.loading = true;
      modelList(params)
        .then(res => {
          if (res.code === 20000) {
            this.conditionFlag && (this.list = res.data);
            !this.conditionFlag && (this.list = this.list.concat(res.data));
            // this.sortList();
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
            this.params.page > 1 && (this.params.page--);
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
          })
          this.params.page > 1 && (this.params.page--);
          this.loading = false;
          this.conditionFlag = false;
        });
    },
    btnClick() {
      // this.params.pkId = this.minId;
      this.params.page++;
      this.initList(this.params);
    },
    changeParamsName() {
      this.conditionFlag = true;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 分类条件项点击事件
    checkCategory(item) {
      this.conditionFlag = true;
      this.params.categoryId = item.id;
      this.categoryObj = Object.assign({}, item);
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 点击取消分类条件
    categoryCancel() {
      this.conditionFlag = true;
      // this.params.categoryId = null;
      this.params.categoryId = -1;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 时间条件项点击事件
    checkTime(item) {
      this.conditionFlag = true;
      this.params.time = item.value;
      this.timeObj = Object.assign({}, item);
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 点击取消时间条件
    timeCancel() {
      this.conditionFlag = true;
      this.timeObj = null;
      this.params.time = modelListParams.time.all;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 下载条件项点击事件
    checkDownload(item) {
      this.conditionFlag = true;
      this.params.downloadStatus = item.value;
      this.downloadObj = Object.assign({}, item);
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 点击取消下载条件
    downloadCancel() {
      this.conditionFlag = true;
      this.downloadObj = null;
      this.params.downloadStatus = modelListParams.isDownload.all;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 排序条件改变事件
    sortChange(e) {
      this.conditionFlag = true;
      this.params.sort = e;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 跳转到AR列表页
    linkToWebAR() {
      this.$router.push('/home/webArList');
    },
    // 跳转到全景模型列表页
    linkToAr() {
      this.$router.push('/home/arList');
    },
    // 里层item发射回来的点击事件
    itemClick(item) {
      this.$router.push({
        path: '/home/modelListDetail',
        query: {
          id: item.id
        }
      });
    },
    // 里层item发射回来的浏览点击事件
    browserClick(item) {
      this.$router.push({
        path: '/home/modelListDetail',
        query: {
          id: item.id
        }
      });
    },
    // 里层item发射回来的收藏点击事件
    collectClick(item) {
      this.$router.push({
        path: '/home/modelListDetail',
        query: {
          id: item.id
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
// 标题部分
.model-title {
  margin: 20px 0 10px 0;
  color: var(--color--fontMain);
  h1 {
    font-size: 1.3em;
    a {
      margin: 0 5px;
    }
    .active {
      color: var(--color--ori);
    }
  }
}
// 条件部分
.condition-container {
  display: flex;
  justify-content: space-between;
  // margin-bottom: 20px;
  margin-bottom: 10px;
  // 左侧的筛选条件部分
  .radio-condition {
    display: flex;
    .radio-item {
      margin: 0 10px;
    }
  }
  // 右侧的排序条件部分
  .sort-condition {
    display: flex;
    align-items: center;
    color: var(--color--fontMain);
    .sort-label {
      margin-right: 10px;
    }
    .sorts {
      display: flex;
      align-items: center;
      height: 100%;
      .el-radio {
        margin: 0;
      }
      &::v-deep .el-radio__input {
        display: none;
      }
      &::v-deep .el-radio__label {
        padding: 0;
        width: 36px;
        height: 36px;
        color: var(--color--fontMain);
        display: inline-block;
        text-align: center;
        line-height: 36px;
        background-color: var(--color--navbg);
      }
      .el-radio.is-checked::v-deep .el-radio__label {
        background-color: var(--color--main);
      }
    }
  }
}

// 条件部分中的每一项
.radio-container {
  padding: 0 24px 0 24px;
  height: 30px;
  line-height: 30px;
  position: relative;
  color: var(--color--fontMain);
  border: 1px solid var(--color--fontMain);
  border-radius: 4px;
  background-color: var(--color--navbg);
  // 中间的固定文字
  .condition-title {
    padding-left: 4px;
    padding-right: 4px;
  }
  // 选中的条件标签
  .condition-select {
    display: inline-block;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid var(--color--main);
    background-color: var(--color--fontMain);
    padding-right: 34px;
    padding-left: 4px;
    color: var(--color--fontMainDark);
    font-weight: bold;
    position: relative;
    .icon-close {
      position: absolute;
      right: 0;
      top: 0;
      background-color: var(--color--main);
      color: #fff;
      display: inline-block;
      width: 30px;
      height: 100%;
      text-align: center;
    }
  }
  // 左边的icon
  .condition-icon-left {
    position: absolute;
    left: 5px;
    top: 0;
  }
  // 右边的icon
  .condition-icon-right {
    position: absolute;
    right: 5px;
    top: 0;
  }
}
// 带二级菜单的li中的dropdown头部
.dropdown-title {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding-right: 25px;
  &>span {
    display: inline-block;
    width: 100%;
  }
  .condition-icon-inner {
    position: absolute;
    top: 0;
    right: -18px;
  }
}

// 名称搜索
.name-condition {
  margin-bottom: 20px;
  padding-left: 10px;
  display: flex;
  color: $color-fontMain;
  align-items: center;
  .el-input {
    width: 200px;
    &::v-deep .el-input__inner {
      border: 1px solid $color-mainBg;
    }
    &::v-deep .el-input__inner:active {
      border: 1px solid $color-main;
    }
    &::v-deep .el-input__inner:focus {
      border: 1px solid $color-main;
    }
  }
  button {
    height: 40px;
    border: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 4px;
    background-color: $color-main;
    padding: 0 10px;
    color: $color-fontMain; 
  }
}

@media (max-width: 950px) {
  .condition-container {
    flex-direction: column;
    .sort-condition {
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}
@media (max-width: 800px) {
  .radio-condition {
    flex-direction: column;
    .radio-item {
      margin-top: 10px!important;
    }
  }
  .sort-condition {
    flex-direction: column;
    .sort-label {
      width: 100%;
    }
    .sorts {
      margin-top: 5px;
      width: 100%;
      .el-radio {
        flex: 1;
      }
      &::v-deep .el-radio__label {
        width: 100%!important;
      } 
    }
  }
  // 名称搜索
  .name-condition {
    .el-input {
      width: 80%;
      &::v-deep .el-input__inner {
        border: 1px solid $color-mainBg;
      }
      &::v-deep .el-input__inner:active {
        border: 1px solid $color-main;
      }
      &::v-deep .el-input__inner:focus {
        border: 1px solid $color-main;
      }
    }
    button {
      height: 40px;
      border: none;
      display: inline-block;
      cursor: pointer;
      border-radius: 4px;
    }
  }
}
</style>
