<template>
  <div class="main">
    <div class="container container-padding">
      <div class="header">
        <h2 class="header-title">{{ tagTitle }}</h2>
      </div>
    </div>
    <!-- 模型列表 -->
    <list
      :user="user"
      :loading="loading"
      :list="list"
      @btnClick="btnClick"
      @itemClick="itemClick"
      @browserClick="itemClick"
      @collectClick="itemClick"
    ></list>
  </div>
</template>
<script>
import { getTagModels } from '@/api/model/model.js';
import { listSize } from '@/utils/global.js';
import list from '@/components/layout/list/list.vue';
const defaultParams = {
  pkId: 0,
  sortMode: 'DESC',
  size: listSize
};

export default {
  name: 'tagModelList',
  components: {
    list
  },
  data() {
    return {
      user: false,
      tagId: null,
      tagTitle: this.$t('tagPageTitle'),
      params: Object.assign({}, defaultParams),
      // 传入模型列表组件的数据
      list: [],
      loading: false,
      minId: 0,
      maxId: 0
    }
  },
  created() {
    if (this.$route.query && this.$route.query.tagId !== undefined) {
      this.tagId = +this.$route.query.tagId;
      this.tagTitle = this.$route.query.title ? `${this.$route.query.title}${this.$t('namedTagPageTitle')}` : this.$t('tagPageTitle');
      console.log(this.tagId)
    } else {
      this.$message({
        message: this.$t('initTagFail'),
        type: 'error',
        duration: 1500
      });
      this.$router.back(-1);
    }
    this.initConfig();
    this.initList(this.params)
  },
  methods: {
    // 初始化项目配置
    initConfig() {
      let user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user : false;
    },
    // 拉取模型
    initList(params) {
      this.loading = true;
      getTagModels(this.tagId, params)
        .then(res => {
          console.log(res)
          if (res.code === 20000) {
            this.list = this.list.concat(res.data);
            this.sortList();
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          });
          this.loading = false;
          this.$router.back(-1);
        });
    },
    sortList() {
      if (this.list.length < 1) {
        return;
      }
      this.list.sort((a, b) => {
        return b.id - a.id;
      });
      console.log(this.list)
      this.minId = this.list[this.list.length - 1].id;
    },
    // 点击加载按钮
    btnClick() {
      this.params.pkId = this.minId;
      this.initList(this.params);
    },
    // 点击单个模型项
    itemClick(item) {
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
.header {
  text-align: left;
  .header-title {
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: 700;
    font-size: 1.3em;
    color: $color-ori;
    padding-left: 20px;
  }
}
</style>