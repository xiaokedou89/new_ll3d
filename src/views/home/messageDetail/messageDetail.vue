<template>
  <div class="main">
    <!-- 背景图片头部 -->
    <div class="header">
      <div class="container container-padding">
        <h1>{{ $t('mesHeaderTitle') }}</h1>
        <p>{{ getUserName(currentUserInfo) + $t('newMessageDes') }}</p>
      </div>
    </div>
    <!-- 下方的主体部分 -->
    <div class="container container-padding">
      <div class="message-content">
        <h2>{{ message.title }}</h2>
        <div class="from">
          <span class="title">发送者：</span> {{ getUserName(message.fromUser) }}
        </div>
        <p class="content">{{ message.content }}</p>
        <div class="time">{{ changeTime(message.time) }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { i18n } from '@/assets/languages/i18n.js';
import { getMessageDetail } from '@/api/message/message.js';
const defaultMessage = {

};

export default {
  name: 'MessageDetail',
  data() {
    return {
      // 当前登录用户id
      currentUserId: null,
      // 当前登录用户信息
      currentUserInfo: null,
      messageId: null,
      message: Object.assign({}, defaultMessage)
    }
  },
  created() {
    this.initCurrentUserInfo();
    if (this.$route.query && this.$route.query.id) {
      this.messageId = +this.$route.query.id;
    } else {
      this.$message({
        message: this.$t('initMessageFail'),
        type: 'error',
        duration: 1500
      });
    }
    this.initMessage();
  },
  computed: {
    getUserName() {
      return function (user){
        return user ? (user.nickname ? user.nickname: i18n.t('user')) : i18n.t('user');
      }
    },
    changeTime() {
      return function (time) {
        return time ? (new Date(time).toLocaleString()) : '';
      }
    }
  },
  methods: {
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
    initMessage() {
      getMessageDetail(this.messageId)
        .then(res => {
          if (res.code === 20000) {
            this.message = res.data;
            this.message.title = this.changeText(this.message.title);
            this.message.content = this.changeText(this.message.content);
          } else {
            this.$message({
              message: this.$t('initMessageFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initMessageFail'),
            type: 'error',
            duration: 1500
          });
          this.$router.back(-1);
        })
    },
    changeText(text) {
      let reg = /(?<=<(\w+)>).*(?=<\/\1>)/;
      if (Array.isArray(reg.exec(text))) {
        return reg.exec(text)[0];
      }
      return text;
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
.message-content {
  padding: 30px;
  background-color: $color-navBg;
  box-sizing: border-box;
  border-radius: 4px;
  color: $color-fontMain;
  h2 {
    font-size: large;
    font-weight: bold;
    color: $color-fontMain;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .from {
    background-color: $color-mainBg;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    border-radius: 4px;
    .title {
      font-weight: bold;
      vertical-align: top;
    }
  }
  .content {
    margin-top: 10px;
    background-color: $color-mainBg;
    padding: 20px;
    border-radius: 4px;
    min-height: 200px;
  }
  .time {
    background-color: $color-mainBg;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    padding-left: 10px;
  }
}
</style>