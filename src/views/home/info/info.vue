<template>
  <div class="main">
    <!-- 上边 -->
    <div class="header">
      <div class="container container-padding">
        <h1>{{ $t('llCloud') }}</h1>
        <div class="description">{{ $t('llDescription') }}</div>
        <!-- 单选框部分 -->
        <div class="news">
          <el-radio
            v-model="selectId"
            v-for="(item, index) in news"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio>
        </div>
      </div>
    </div>
    <!-- 下边的渲染内容 -->
    <div class="container container-padding">
      <div class="message">
        <h2 class="message-title">
          {{ getMessageTitle() }}
        </h2>
        <div v-if="news.length > 0 && getMessageContent()" class="message-content" v-html="getMessageContent()"></div>
        <div v-else class="message-content message-empty">
          <div class="message-empty-content">
            {{ $t('noData') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAllInfo,
  getNewInfo 
} from '@/api/news/news.js';
import { i18n } from '@/assets/languages/i18n.js';
import Vue from 'vue';


export default {
  name: 'Info',
  data() {
    return {
      news: [],
      selectId: null
    }
  },
  created() {
    let id = this.$route.query && this.$route.query.id ? +this.$route.query.id : undefined;
    this.initNews(id);
  },
  computed: {
    getMessageTitle() {
      const that = this;
      return function () {
        let title;
        if (that.selectId === null) {
          title = i18n.t('messageTitle');
        } else {
          title = that.news.find(item => item.id == that.selectId).name;
        }
        return title;
      }
    },
    getMessageContent() {
      const that = this;
      return function () {
        let content;
        if(that.selectId === null) {
          content = '';
        } else {
          let item = that.news.find(item => item.id == that.selectId);
          if (item.detail && item.detail.content) {
            content = item.detail.content;
          } else {
            content = '';
          }
        }
        return content;
      }
    }
  },
  methods: {
    initNews(id) {
      getAllInfo()
        .then(res => {
          console.log(res);
          if (res.code === 20000) {
            this.news = res.data;
            const promiseArr = [];
            this.news.forEach(item => {
              const promiseItem = new Promise((resolve, reject) => {
                getNewInfo(item.id)
                  .then(result => {
                    if (result.code === 20000) {
                      Vue.set(item, 'detail', result.data);
                      resolve();
                    } else {
                      Vue.set(item, 'detail', { content: ''});
                      reject();
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    Vue.set(item, 'detail', { content: ''});
                    reject();
                  })
              });
              promiseArr.push(promiseItem);
            });
            Promise.allSettled(promiseArr)
              .then(() => {
                if (typeof id != 'undefined') {
                  this.selectId = id;
                } else {
                  this.selectId = Array.isArray(this.news) && this.news.length > 0 ? this.news[0].id : null;
                }
              })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
.header {
  min-height: 210px;
  text-align: center;
  background: url('~@/assets/message-header.jpg') repeat-x scroll center bottom;
  padding-bottom: 80px;
  color: $color-fontMain;
  margin-bottom: 10px;
  h1 {
    font-size: xx-large;
    padding-top: 52px;
    padding-bottom: 10px;
    font-weight: 500;
  }
  .description {
    font-size: 14px;
    margin-bottom: 18px;
  }
}
.news {
  height: 40px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  .el-radio {
    // margin: 0 10px;
    margin: 5px 10px 0 10px;
  }
  &::v-deep .el-radio__input {
    display: none;
  }
  &::v-deep .el-radio__label {
    display: block;
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    border-radius: 20px;
    background-color: $color-fontMain;
  }
  .el-radio.is-checked::v-deep .el-radio__label {
    background-color: $color-main;
    color: $color-fontMain;
  }
}
.message {
  padding: 30px;
  background-color: $color-navBg;
  .message-title {
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin: 20px 0 10px 0;
    color: $color-fontMain;
  }
  .message-content {
    color: $color-fontMain;
    margin-bottom: 30px;
    overflow: hidden;
    padding: 0;
    text-overflow: ellipsis;
    img {
      width: 100%!important;
    }
  }
  .message-empty {
    height: 300px;
    border-radius: 10px;
    border: 1px solid $color-ori;
    padding: 10px;
    box-sizing: border-box;
    .message-empty-content {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 278px;
      border: 1px dashed $color-ori;
      font-size: large;
      color: $color-ori;
    }
  }
}
</style>