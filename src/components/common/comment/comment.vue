<template>
  <div class="comment">
    <!-- 用户名及头像 头部部分 -->
    <div class="comment-header">
      <!-- 头像 -->
      <div class="comment-logo">
        <img :src="getImg(commentObj.userThumb)" />
      </div>
      <!-- 用户名 -->
      <h4 class="comment-user">
        {{ commentObj.nickName }}
        <i class="iconfont icon-sanjiaoright icon"></i>
        {{ parentUsername }}
      </h4>
    </div>
    <!-- 评论内容部分 -->
    <p class="comment-content">{{ commentObj.content }}</p>
    <!-- 评论时间部分 -->
    <div class="comment-time">{{ getTime(commentObj.time) }}</div>
    <!-- 评论相关操作按钮部分 -->
    <div class="comment-action">
      <!-- 显示回复表单 -->
      <el-button type="text" @click="commentObj.replyShow = true">{{ $t('reply') }}</el-button>
      <!-- 查看回复 -->
      <el-button type="text" @click="commentObj.childrenShow = !commentObj.childrenShow">{{ getBtnShowTxt(commentObj.childrenShow) }}</el-button>
      <!-- 更多评论按钮 -->
      <el-button :loading="commentObj.loading" type="text" v-show="commentObj.childrenShow" @click="getChildList">{{ $t('moreComments') }}</el-button>
      <!-- 删除评论 -->
      <el-button type="text" @click="delComment(commentObj)">{{ $t('delete') }}</el-button>
    </div>
    <!-- 评论提交表单部分 -->
    <div class="comment-reply" :class="{aniShowOpt: commentObj.replyShow}" v-show="commentObj.replyShow">
      <!-- 二级评论回复表单 -->
      <el-form :ref="`commentForm${item.id}`" :model="commentObj.reply" size="small">
        <el-form-item prop="content">
          <!-- 输入框 -->
          <el-input v-model="commentObj.reply.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 确定按钮 -->
          <button type="button" class="btn confirmBtn" @click="commentClick(commentObj)">{{ $t('confirm') }}</button>
          <!-- 收起按钮 -->
          <el-button class="m_l5" type="text" @click="commentObj.replyShow = false">{{ $t('pack') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 下一级评论列表循环渲染 -->
    <div class="comment-childList" v-show="commentObj.childrenShow" v-if="commentObj.childList.length > 0">
      <comment 
        v-for="(item, index) in commentObj.childList" 
        :key="index" 
        :parent-username="commentObj.nickName" 
        :item="item"
        @delComment="delChildComment"
      ></comment>
    </div>
    <!-- 空列表时展示 -->
    <p class="comment-childList-empty" v-show="commentObj.childrenShow" v-else>{{ $t('noMoreComments') }}</p>
  </div>
</template>
<script>
import { filePrefix, image, isNetworkImg } from '@/utils/global.js';
import { i18n } from '@/assets/languages/i18n.js';
import Vue from 'vue';
import comment from '@/components/common/comment/comment.vue';
import {
  // 获取模型评论
  getModelComment,
  // 添加模型评论
  addModelComment,
  // 删除模型评论
  deleteModelComment 
} from '@/api/model/model.js';

// 获取模型评论默认参数对象
const commentParams = {
  parentId: 0,
  pkId: 0,
  size: 3,
  sortMode: 'DESC'
};

export default {
  name: 'comment',
  props: {
    // 上级评论的用户名
    parentUsername: {
      type: String,
      require: true
    },
    // 评论对象
    item: {
      type: Object,
      require: true
    }
  },
  components: {
    comment
  },
  data() {
    return {
      // 评论对象
      commentObj: this.item,
      userId: null
    }
  },
  created() {
    this.userId = this.$store.getters.userId;
  },
  computed: {
    getImg() {
      return function (src) {
        return src ? (isNetworkImg(src) ? src : filePrefix + image + src) : require('@/assets/default/user.jpg');
      }
    },
    getTime() {
      return function (time) {
        return new Date(time).toLocaleString();
      }
    },
    getBtnShowTxt() {
      return function (flag) {
        return flag ? i18n.t('packReply') : i18n.t('checkReply');
      }
    }
  },
  methods: {
    // 初始化子列表childList
    initChildList() {
      getModelComment(this.commentObj.modelId, this.commentObj.params)
        .then(res => {
          if (res.code === 20000) {
            for (const item of res.data) {
              this.setCommentPropery(item);
            }
            this.commentObj.childList = res.data;
            this.sortCommentChildList(this.commentObj.childList, this.commentObj);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击更多评论拉数据
    getChildList() {
      this.commentObj.loading = true;
      this.commentObj.params.pkId = this.commentObj.minId;
      getModelComment(this.commentObj.modelId, this.commentObj.params)
        .then(res => {
          this.commentObj.loading = false;
          if (res.code === 20000) {
            for (const item of res.data) {
              this.setCommentPropery(item);
            }
            this.commentObj.childList = this.commentObj.childList.concat(res.data);
            this.sortCommentChildList(this.commentObj.childList, this.commentObj);
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noMoreComments'),
              type: 'warning',
              duration: 1500
            });
          }
        })
        .catch(err => {
          this.commentObj.loading = false;
          console.log(err);
        });
    },
    // 排序childList并保存minId
    sortCommentChildList(list, item) {
      list.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        } else {
          return 0;
        }
      });
      item.minId = list[list.length - 1].id;
    },
    // 工具函数，为评论对象添加自定义属性
    setCommentPropery(item) {
      Vue.set(item, 'childList', []);
      Vue.set(item, 'reply', {
        content: '',
        parentId: item.id,
        userId: null
      });
      Vue.set(item, 'loading', false);
      Vue.set(item, 'replyShow', false);
      Vue.set(item, 'childrenShow', false);
      Vue.set(item, 'minId', 0);
      Vue.set(item, 'params', {
        pkId: 0,
        sortMode: 'DESC',
        size: 3,
        parentId: item.id
      });
    },
    // 点击评论确定事件
    commentClick(item) {
      this.$refs[`commentForm${item.id}`].validate(valid => {
        if (valid) {
          item.reply.userId = this.userId;
          addModelComment(item.modelId, item.reply)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('addCommentSuc'),
                  type: 'success',
                  duration: 1500
                });
                item.reply.content = '';
                item.minId = 0;
                item.params.pkId = 0;
                item.childList = [];
                this.initChildList()
              } else {
                this.$message({
                  message: this.$t('addCommentFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('addCommentFail'),
                type: 'error',
                duration: 1500
              })
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      })
    },
    // 点击删除评论发射到父级
    delComment(item) {
      this.$emit('delComment', item);
    },
    // 绑定发射过来的删除子级的评论事件
    delChildComment(child) {
      this.$confirm(this.$t('delCommentWarning'), this.$t('warning'),{
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteModelComment(child.modelId, child.id)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('delModelReviewSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.commentObj.pkId = 0;
                this.commentObj.childList = [];
                this.initChildList();
              } else {
                this.$message({
                  message: this.$t('delModelReviewFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('delModelReviewFail'),
                type: 'error',
                duration: 1500
              });
            })
        })
        .catch(() => {
          this.$message({
            message: this.$t('delCommentCancel'),
            type: 'warning',
            duration: 1500
          });
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
.comment {
  box-sizing: border-box;
  width: 100%;
  background-color: $color-footerBorder;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
}
// 头部头像及用户名部分
.comment-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  // 用户头像部分
  .comment-logo {
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 30px;
      height: 30px;
    }
  }
  // 用户名部分
  .comment-user {
    width: calc(100% - 35px);
    margin-left: 5px;
    .icon {
      vertical-align: middle;
    }
  }
}
// 评论内容部分
.comment-content {
  padding: 4px;
}
// 评论表单部分
.comment-reply {
  & .el-form-item {
    margin-bottom: 10px;
  }
  // 修改默认样式
  &::v-deep .el-textarea__inner {
    border: transparent;
    outline: medium none;
    resize: none;
    color: $color-fontMain;
    font-size: 14px;
    background-color: #2d2e31;
  }
}
// 评论子列表为空时显示
.comment-childList-empty {
  border-radius: 2px;
  padding: 4px;
  border: 1px dashed $color-ori;
  color: $color-ori;
  text-align: center;
}
</style>