<template>
  <div class="main">
    <!-- 条件搜索部分和标题部分 -->
    <div class="container container-padding">
      <!-- 标题部分 -->
      <div class="model-title">
        <h1>
          <a @click="linkToModel">{{ $t('allModel') }}</a>
          <a @click="linkToVr">{{ $t('allVR') }}</a>
          <a class="active">{{ $t('allWebAR') }}</a>
        </h1>
      </div>
      <!-- 条件筛选部分总容器 -->
      <div class="condition-container">
        <!-- 左侧的单选条件部分 -->
        <div class="radio-condition">
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
    </div>
    <!-- 主列表部分 -->
    <list :user="user" :loading="loading" :list="list" @btnClick="btnClick" @itemClick="listItemClick"></list>
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
  </div>
</template>
<script>
import list from '@/components/layout/list/list.vue';
import { modelList } from '@/api/model/model.js';
import { getCategoryList } from '@/api/news/news.js';
import { modelListParams, listSize, webArUrl,  filePrefix, image, storeGetModel } from '@/utils/global.js';
import { i18n } from '@/assets/languages/i18n.js';
import dialoger from '@/components/common/dialoger/dialoger.vue';
import dropdown from '@/components/common/dropdown/dropdown.vue';
import dropdownMenu from '@/components/common/dropdownMenu/dropdownMenu'
import QRCode from 'qrcodejs2';
// params默认值
const defaultParams = {
  homeStatus: false,
  type: modelListParams.type.WEBAR,
  sort: modelListParams.sort.COMPREHENSIVE,
  downloadStatus: modelListParams.isDownload.all,
  time: modelListParams.time.all,
  // pkId: 0,
  page: 1,
  sortMode: 'DESC',
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
    dropdownMenu,
    dialoger
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
      // 时间条件选择数组
      times,
      // 下载条件选择数组
      downloads,
      // 排序sort数组
      sorts,
      // 拉取数据参数
      params: Object.assign({}, defaultParams),
      // 时间条件绑定对象
      timeObj: null,
      // 下载条件绑定对象
      downloadObj: null,
      flag: false,
      conditionFlag: false,
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
    this.initConfig();
    this.$route.query && (this.params = Object.assign(this.params, this.$route.query));
    this.initList(this.params);
  },
  computed: {
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
  methods: {
    // 获取项目相关配置信息
    initConfig() {
      let user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user : false;
    },
    // 初始化参数条件回显
    initCondition() {
      // isDownload
      // time
      if (+this.params.time !== -1) {
        let time = this.times.find(item => item.value === +this.params.time);
        this.timeObj = Object.assign({}, time);
      }
      if (+this.params.downloadStatus !== -1) {
        let download = this.downloads.find(item => item.value === +this.params.downloadStatus);
        this.downloadObj = Object.assign({}, download);
      }
    },
    // 搜索条件改变时初始化params调用
    initParams() {
      this.minId = 0;
      this.maxId = 0;
      this.params.pkId = 0;
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
            })
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
    // sortList() {
    //   this.list.sort((a, b) => {
    //     if (a.id > b.id) {
    //       return -1;
    //     } else if (a.id < a.id) {
    //       return 1;
    //     } else {
    //       return 0;
    //     }
    //   })
    //   this.maxId = this.list[0].id;
    //   this.minId = this.list[this.list.length - 1].id;
    // },
    btnClick() {
      // this.params.pkId = this.minId;
      this.params.page++;
      this.initList(this.params);
    },
    // 时间条件项点击事件
    checkTime(item) {
      this.conditionFlag = true;
      this.params.time = item.value;
      this.timeObj = Object.assign({}, item);
      // this.initParams();
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 点击取消时间条件
    timeCancel() {
      this.conditionFlag = true;
      this.timeObj = null;
      this.params.time = modelListParams.time.all;
      // this.initParams();
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 下载条件项点击事件
    checkDownload(item) {
      this.conditionFlag = true;
      this.params.downloadStatus = item.value;
      this.downloadObj = Object.assign({}, item);
      // this.initParams();
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 点击取消下载条件
    downloadCancel() {
      this.conditionFlag = true;
      this.downloadObj = null;
      this.params.downloadStatus = modelListParams.isDownload.all;
      // this.initParams();
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 排序条件改变事件
    sortChange(e) {
      this.conditionFlag = true;
      this.params.sort = e;
      // this.initParams();
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    listItemClick(it) {
      let model = this.list.find(item => {
          return item.id === it.id;
        });
        this.webArTitle = model.name;
        this.webArImg = model.imageRecognition;
        this.webArFlag = true;
        this.$nextTick(() => {
          this.createQRCode(model.id);
        });

        
        this.webArFlag = true;
    },
    // 点击webAr弹框关闭和确定
    closeWebAr() {
      this.webArTitle = '';
      this.qrcode = '';
      this.webArImg = '';
      this.webArFlag = false;
    },
     test(path) {
  let origin;
  if (!window.location.origin) {
    origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
  } else {
    origin = window.location.origin;
  }
  return `${origin}${path}`;
},
    createQRCode(id) {
      const that = this;
      console.dir(this.$refs.code);
      // console.log(`${that.qrcodeUrl}?id=${id}`)
      this.qrcode = new QRCode(that.$refs.code, {
        text: that.test(`${that.qrcodeUrl}?id=${id}`),
        width: that.$refs.code.clientWidth,
        height: that.$refs.code.clientHeight
      })
    },
    // 跳转到模型列表页
    linkToModel() {
      this.$router.push('/home/modelList');
    },
    // 跳转到Vr全景列表页
    linkToVr() {
      this.$router.push('/home/arList');
    }
  }
}
</script>
<style lang="scss" scoped>
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
  margin-bottom: 20px;
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
}
</style>
