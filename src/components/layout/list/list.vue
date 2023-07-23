<template>
  <div class="list">
    <div class="container container-padding" v-loading="loading">
      <!-- litem外层flex容器-有用户系统 -->
      <div class="list-container" v-if="list.length > 0 && user">
        <!-- list遍历项 -->
        <litem 
          v-for="(item) in list" 
          :key="item.id"
          :setting="setting"
          :deletable="deletable"
          :user="true"
          :id="item.id"
          :thumb="item.thumb"
          :name="item.name"
          :userId="item.userId"
          :userName="item.nickName"
          :userThumb="item.userThumb"
          :modelBrowserCount="item.modelBrowserCount"
          :modelCollectCount="item.modelCollectCount"
          @itemClick="itemClick(item)"
          @browserClick="browserClick(item)"
          @collectClick="collectClick(item)"
        ></litem>
      </div>
      <!-- litem外层flex容器-无用户系统 -->
      <div class="list-container" v-else-if="list.length > 0 && !user">
        <!-- list遍历项 -->
        <litem 
          v-for="(item, index) in list" 
          :key="index"
          :setting="setting"
          :deletable="deletable"
          :user="false"
          :id="item.id"
          :thumb="item.thumb"
          :name="item.name"
          :modelBrowserCount="item.modelBrowserCount"
          :modelCollectCount="item.modelCollectCount"
          @del="del(item)"
          @itemClick="itemClick(item)"
          @browserClick="browserClick(item)"
          @collectClick="collectClick(item)"
        ></litem>
      </div>
      <!-- list.length为0的空项显示 -->
      <div class="empty-container" v-else>
        <div class="content">{{ $t('noData') }}</div>
      </div>
      <!-- 按钮容器 -->
      <div class="btn-container">
        <button class="btn confirmBtn loading" type="button" @click="btnClick">{{ btnTxt }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import litem from '@/components/common/litem/litem.vue';
import { i18n } from '@/assets/languages/i18n.js';
export default {
  name: 'list',
  components: {
    litem
  },
  props: {
    // 是否显示右上角的设置开关
    setting: {
      type: Boolean,
      default: false
    },
    // 是否显示删除按钮
    deletable: {
      type: Boolean,
      default: false
    },
    // 是否有用户系统
    user: {
      type: Boolean,
      required: true
    },
    // 加载动画开关
    loading: {
      type: Boolean,
      required: true
    },
    // 渲染的列表数据
    list: {
      type: Array,
      required: true
    },
    btnTxt: {
      type: String,
      default: i18n.t('loading')
    }
  },
  methods: {
    // 发射按钮的点击事件
    btnClick() {
      this.$emit('btnClick');
    },
    itemClick(item) {
      this.$emit('itemClick', item);
    },
    browserClick(item) {
      this.$emit('browserClick', item);
    },
    collectClick(item) {
      this.$emit('collectClick', item);
    },
    del(item) {
      this.$emit('del', item);
    }
  }
}
</script>
<style lang="scss" scoped>
// 总容器
.list {
  width: 100%;
  box-sizing: border-box;
  &::v-deep .el-loading-mask {
    background-color: rgba(45,46,49, .5);
    .el-loading-spinner .circular {
      width: 80px;
      height: 80px;
    }
  }
}
// 内部litem项的外层容器
.list-container {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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

</style>