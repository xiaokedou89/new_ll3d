<template>
  <div class="main">
    <!-- 上边的标题和搜索条件部分 -->
    <div class="header">
      <div class="container container-padding">
        <h1>{{ $t('allUsers') }}</h1>
      </div>
    </div>
    <!-- 用户列表部分 -->
    <!-- <div class="container container-padding" v-loading="loading"> -->
    <div class="container container-padding">
      <!-- 上边的用户列表 -->
      <div class="user-list" v-if="list.length > 0">
        <!-- 每个用户项 -->
        <div class="user-list-item" v-for="(item, index) in list" :key="index">
          <user-item :userId="item.id"></user-item>
        </div>
      </div>
      <div v-else class="empty-container">
        <div class="content">{{ $t('noData') }}</div>
      </div>
      <!-- 按钮容器 -->
      <div class="btn-container">
        <button class="btn confirmBtn loading" type="button" @click="loadUser">{{ $t('loading') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/user/user.js';
import userItem from '@/components/common/userItem/userItem.vue';
import {
  listSize
} from '@/utils/global.js';

const defaultParams = {
  page: 1,
  size: listSize
};

export default {
  name: 'AllUser',
  components: {
    userItem
  },
  data() {
    return {
      params: Object.assign({}, defaultParams),
      loading: false,
      flag: false,
      list: []
    };
  },
  created() {
    this.initList(this.params);
  },
  methods: {
    initList(params) {
      if (this.flag) {
        return;
      }
      this.flag = true;
      this.loading = true;
      api.getAllUser(params)
        .then(res => {
          // console.log('所有用户数据');
          // console.log(res);
          this.flag = false;
          this.loading = false;
          if (res.code === 20000) {
            this.list = this.list.concat(res.data);
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
            this.params.page > 1 && (this.params.page--);
          }
        })
        .catch(err => {
          this.flag = false;
          this.params.page > 1 && (this.params.page--);
          this.loading = false;
          this.$message({
            message: err,
            type: 'warning',
            duration: 1500
          });
        });
    },
    // 点击下方的加载更多
    loadUser() {
      this.params.page++;
      this.initList(this.params);
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';


.header h1 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  line-height: 1.42857143;
  color: $color-ori;
}
// 用户列表外层容器
.user-list {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  // 用户项的外层
  .user-list-item {
    box-sizing: border-box;
    width: 50%;
    padding: 0 5px;
    margin-bottom: 10px;
  }
}
// list为空时显示
.empty-container {
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
// 按钮容器
.btn-container {
  width: 100%;
  margin: 30px 0;
  .loading {
    display: block;
    min-width: 200px;
    height: 45px;
    font-size: 16px;
    font-weight: bold;
    margin: 0 auto;
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