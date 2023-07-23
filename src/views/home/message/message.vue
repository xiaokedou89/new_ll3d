<template>
  <div class="main">
    <!-- 背景图片头部 -->
    <div class="header">
      <div class="container container-padding">
        <h1>{{ $t('mesHeaderTitle') }}</h1>
        <p>{{ getUserName(currentUserInfo) + $t('newMessageDes') }}</p>
      </div>
    </div>
    <!-- 下方主体部分 -->
    <div class="container container-padding">
      <!-- 切换站内消息、系统消息、发送消息的单选框 -->
      <div class="content-type-select">
        <el-radio
          class="message-radio"
          v-model="messageRadio"
          v-for="(item, index) in messageRadios"
          :key="index"
          :label="item.value"
          @change="messageRadioChange"
        >
          {{ item.label }}
        </el-radio>
      </div>
      <!-- 站内消息 -->
      <div class="message-inner message-content aniShowOpt" v-if="messageRadio === messageStatic.INNER">
        <el-table class="message-table" v-loading="innerLoading" :data="innerList" :empty-text="$t('noData')" >
          <el-table-column align="center" :label="$t('messageTitle')">
            <template slot-scope="scope">
              <el-link type="primary" @click="linkToMesDetail(scope.row.id)">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('sendTime')">
            <template slot-scope="scope">
              {{ getTime(scope.row.time) }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('fromUser')">
            <template slot-scope="scope">
              {{ getUser(scope.row.fromUser) }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('status')">
            <template slot-scope="scope">
              {{ getStatus(scope.row.status) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <pagination :page-count="innerPageCount" @next="nextPage('inner')" @prev="prevPage('inner')" @selectchange="pageSizeChange($event, 'inner')" />
        </div>
      </div>
      <!-- 系统消息 -->
      <div class="message-system message-content aniShowOpt" v-if="messageRadio === messageStatic.SYSTEM">
        <el-table class="message-table" v-loading="systemLoading" :data="systemList" :empty-text="$t('noData')" >
          <el-table-column align="center" :label="$t('messageTitle')">
            <template slot-scope="scope">
              <el-link type="primary" @click="linkToMesDetail(scope.row.id)">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('sendTime')">
            <template slot-scope="scope">
              {{ getTime(scope.row.time) }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('fromUser')">
            <template slot-scope="scope">
              {{ getUser(scope.row.fromUser) }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('status')">
            <template slot-scope="scope">
              {{ getStatus(scope.row.status) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <pagination :page-count="systemPageCount" @next="nextPage('system')" @prev="prevPage('system')" @selectchange="pageSizeChange($event, 'system')" />
        </div>
      </div>
      <!-- 发送消息 -->
      <div class="message-send message-content aniShowOpt" v-if="messageRadio === messageStatic.SEND">
        <h2>{{ $t('sendMessage') }}</h2>
        <el-form
          ref="sendForm"
          class="send-form"
          :model="sendObj"
          :rules="rules"
          size="small"
          :label-position="labelPosition"
          label-width="100px"
        >
          <el-form-item :label="$t('toUsername') + '：'" prop="username">
            <el-input v-model="sendObj.username" :placeholder="$t('toUsernamePlace')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('messageTitle') + '：'" prop="title">
            <el-input v-model="sendObj.title" maxlength="25" :placeholder="$t('messageTitlePlace')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('messageContent') + '：'" prop="content">
            <el-input type="textarea" :rows="5" :show-word-limit="true" maxlength="255" v-model="sendObj.content" :placeholder="$t('messageContentPlace')" resize="none" />
          </el-form-item>
        </el-form>
        <div class="message-send-bottom">
          <button type="button" class="btn confirmBtn" @click="messageSend">{{ $t('send') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { i18n } from '@/assets/languages/i18n.js';
import {
  messageStatic,
  messageRadios,
  messageType,
  listSize
} from '@/utils/global.js';
import * as api from '@/api/message/message.js';
import * as rule from '@/utils/rules.js';
import pagination from '@/components/common/pagination/pagination.vue';

const rules = {
  username: rule.messageTitle,
  title: rule.messageTitle,
  content: rule.requiredRules
};

// 发送消息默认对象
const defaultSend = {
  title: '',
  username: '',
  content: '',
  flag: false
};

const defaultParams = {
  pkId: 0,
  sortMode: 'DESC',
  size: listSize,
  status: -1
};

export default {
  name: 'Message',
  components: {
    pagination
  },
  data() {
    return {
      rules,
      labelPosition: 'left',
      // 切换站内消息、系统消息、发送消息type静态对象
      messageStatic,
      // 切换站内消息、系统消息、发送消息单选框绑定数组
      messageRadios,
      // 切换下方内容单选框绑定值
      messageRadio: messageStatic.INNER,
      // 当前登录用户id
      currentUserId: null,
      // 当前登录用户信息
      currentUserInfo: null,
      // 发送消息表单绑定对象
      sendObj: Object.assign({}, defaultSend),
      innerParams: Object.assign({}, defaultParams),
      innerLoading: false,
      innnerMin: 0,
      innerMax: 0,
      innerList: [],
      innerPageCount: 1,
      innerFlag: false,
      systemLoading: false,
      systemParams: Object.assign({}, defaultParams),
      systemMin: 0,
      systemMax: 0,
      systemList: [],
      systemPageCount: 1,
      systemFlag: false
    }
  },
  created() {
    const that = this;
    if (this.$route.query && this.$route.query.username) {
      this.sendObj.username = this.$route.query.username;
      this.messageRadio = messageStatic.SEND;
    }
    this.init();
    this.initCurrentUserInfo();
    this.initList('inner', this.innerParams);
    this.initList('system', this.systemParams);
    window.addEventListener('resize', that.pageResize, false);
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', that.pageResize, false);
  },
  computed: {
    getUserName() {
      return function (user){
        return user ? (user.nickname ? user.nickname: i18n.t('user')) : i18n.t('user');
      }
    },
    getTime() {
      return function (time) {
        return time ? (new Date(time)).toLocaleString() : '';
      }
    },
    getUser() {
      return function (user) {
        return user ? user.name : '';
      }
    },
    getStatus() {
      return function (status) {
        return status == 0 ? i18n.t('unRead') : i18n.t('readed');
      }
    }
  },
  methods: {
    init() {
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this.labelPosition = deviceWidth <= 1100 ? 'top' : 'left';
      this.currentUserId = +this.$store.getters.userId;
      !this.currentUserId && (this.$router.back(-1));
    },
    pageResize(e) {
      this.$nextTick(() => {
        this.labelPosition = e.currentTarget.innerWidth <= 1100 ? 'top' : 'left';
      });
    },
    initList(type, params) {
      this[`${type}Loading`] = true;
      const apiType = type == 'inner' ? messageType.INNER : messageType.SYSTEM;
      api.getMessages(apiType, params)
        .then(res => {
          if (res.code === 20000) {
            this[`${type}List`] = res.data;
            this[`${type}List`].forEach(item => {
              item.title = this.changeTitle(item.title);
            });
            this.sortList(type);
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noMore'),
              type: 'warning',
              duration: 1500
            });
            if (this[`${type}Params`].sortMode === 'DESC') {
              this[`${type}PageCount`] !== 1 && this[`${type}PageCount`]--;
            } else {
              this[`${type}PageCount`] !== 1 && this[`${type}PageCount`]++;
            }
          }
          this[`${type}Flag`] = false;
          this[`${type}Loading`] = false;
        })
        .catch(err => {
          console.log(err);
          this[`${type}Flag`] = false;
          this[`${type}Loading`] = false;
          if (this[`${type}Params`].sortMode === 'DESC') {
            this[`${type}PageCount`] !== 1 && this[`${type}PageCount`]--;
          } else {
            this[`${type}PageCount`] !== 1 && this[`${type}PageCount`]++;
          }
          this.$message({
            message: err.message || this.$t('getMesFail'),
            type: 'error',
            duration: 1500
          });
        })
    },
    changeTitle(text) {
      const reg = /(?<=<(\w+)>).*(?=<\/\1>)/;
      if (Array.isArray(reg.exec(text))) {
        return reg.exec(text)[0];
      }
      return text;
    },
    sortList(type) {
      this[`${type}List`].sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        } else {
          return 0;
        }
      });
      this[`${type}Max`] = this[`${type}List`][0].id;
      this[`${type}Min`] = this[`${type}List`][this[`${type}List`].length - 1].id;
    },
    nextPage(type) { 
      if (this[`${type}Flag`]) {
        return;
      } else {
        this[`${type}Flag`] = true;
        this[`${type}PageCount`]++;
        this[`${type}Params`].sortMode = 'DESC';
        this[`${type}Params`].pkId = this[`${type}Min`];
        this.initList(type, this[`${type}Params`]);
      }
    },
    prevPage(type) {
      if (this[`${type}PageCount`] <= 1) {
        return;
      } else {
        if (this[`${type}Flag`]) {
          return;
        } else {
          this[`${type}Flag`] = true;
          this[`${type}PageCount`]--;
          this[`${type}Params`].sortMode = 'ASC';
          this[`${type}Params`].pkId = this[`${type}Max`];
          this.initList(type, this[`${type}Params`]);
        }
      }
    },
    pageSizeChange(e, type) {
      this[`${type}Params`].sortMode = 'DESC';
      this[`${type}Params`].size = e;
      this[`${type}Params`].pkId = 0;
      this[`${type}PageCount`] = 1;
      this.initList(type, this[`${type}Params`]);
    },
    // 点击站内消息标题跳转到消息详情
    linkToMesDetail(id) {
      this.$router.push({
        path: '/home/messageDetail',
        query: {
          id
        }
      });
    },
    // 初始化用户信息
    initCurrentUserInfo() {
      let infoRes = this.$store.getters.userInfo;
      if (!infoRes) {
        this.$store.dispatch('getInfo')
          .then(res => {
            this.currentUserInfo = res;
          })
          .catch(err => {
            console.log(err);
            this.$message({
              message: this.$t('getUserInfoFail'),
              type: 'error',
              duration: 1500
            });
          })
      } else {
        this.currentUserInfo = JSON.parse(infoRes);
      }
    },
    // 切换下方内容单选框值改变事件
    messageRadioChange(e) {

    },
    // 发送消息点击发送按钮
    messageSend() {
      if (this.sendObj.flag) {
        return;
      }
      this.sendObj.flag = true;
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          api.sendMessage(this.sendObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('sendMesSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.sendObj = Object.assign({}, defaultSend);
                this.messageRadio = messageStatic.INNER;
              } else {
                this.$message({
                  message: res.message || this.$t('sendMesFail'),
                  type: 'error',
                  duration: 1500
                });
              }
              this.sendObj.flag = false;
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('sendMesSuc'),
                type: 'error',
                duration: 1500
              });
              this.sendObj.flag = false;
            });
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.sendObj.flag = false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';

// 背景头部部分
.header {
  box-sizing: border-box;
  text-align: center;
  min-height: 160px;
  padding-bottom: 20px;
  color: $color-fontMain;
  margin-bottom: 10px;
  background: url('~@/assets/message-header.jpg') repeat-x scroll center bottom;
  h1 {
    padding-top: 52px;
    padding-bottom: 10px;
    font-size: xx-large;
    font-weight: 500;
    line-height: 1.1;
  }
}
// 切换下方内容单选框容器
.content-type-select {
  text-align: center;
  margin: 20px 0 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .message-radio {
    margin: 5px 5px;
    &::v-deep .el-radio__input {
      display: none;
    }
    &::v-deep .el-radio__label {
      display: block;
      padding: 10px 20px;
      background-color: #0e0e0e;
      color: #999;
      border-radius: 20px;
      line-height: 1;
    }
  }
  .message-radio.is-checked::v-deep .el-radio__label {
    background-color: $color-main;
    color: $color-fontMain;
  }
}

// 下方的主体内容容器
.message-content {
  padding: 30px;
  background-color: $color-navBg;
  box-sizing: border-box;
  border-radius: 4px;
}

// 发送消息
.message-send {
  h2 {
    font-size: large;
    font-weight: bold;
    color: $color-fontMain;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .message-send-bottom {
    margin-top: 10px;
    border-top: 2px solid $color-mainBg;
    padding-top: 20px;
  }
}
// 发送消息表单
.send-form {
  // 表单中的每项
  margin-bottom: 15px;
  // 表单项的标题label
    &::v-deep .el-form-item__label {
      color: $color-fontMain;
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
    &::v-deep .el-input__inner:active,
    &::v-deep .el-textarea__inner:active {
      border: 1px solid $color-main;
    }
    &::v-deep .el-input__inner:focus,
    &::v-deep .el-textarea__inner:focus {
      border: 1px solid $color-main;
    }
}
.el-textarea::v-deep .el-input__count {
  border-radius: 4px;
  right: 5px;
  background-color: #ccc;
}

// 修改消息表格默认样式
.message-table {
  background-color: $color-navBg;
  min-height: 400px;
  &::before {
    background-color: transparent;
  }
  &::v-deep .el-loading-mask {
    background-color: rgba(255, 255, 255, .2);
  }
  &::v-deep .el-table__body tr:hover>td.el-table__cell {
    background-color: rgba(255, 255, 255, .1);
  }
  &::v-deep .el-table__header-wrapper thead th {
    background-color: $color-mainBg;
    color: $color-fontMain;
  }
  &::v-deep th.el-table__cell.is-leaf {
    border: none;
  }
  &::v-deep .el-table__body-wrapper {
    & .el-table__empty-block {
      min-height: 400px!important;
      background-color: $color-navBg;
      border: 1px #505050 dashed;
      border-radius: 4px;
      span {
        font-size: xx-large;
      }
    }

    & tbody tr {
      background-color: $color-navBg;
      border-bottom: 1px solid $color-mainBg;
    }
    & tbody tr td {
      border-bottom: 1px solid $color-mainBg;
      color: $color-fontMain;
    }
  }
}
.pagination-container {
  text-align: right;
  &::v-deep .el-input__inner {
    background-color: $color-mainBg;
    color: $color-fontMain;
  }
  &::v-deep .btn-arrow {
    background-color: $color-mainBg;
    color: $color-fontMain;
  }
}
</style>