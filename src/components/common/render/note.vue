<template>
  <div class="note">
    <!-- 单模型内部内容区 -->
    <div v-if="single" class="content">
      <!-- 注释数组不为空显示 -->
      <div v-if="noteArr.length > 0" class="single-note-container">
        <!-- 每一项注释 -->
        <div class="single-note-item" v-for="(item, index) in noteArr" :key="index">
          <!-- 头部 -->
          <div class="single-note-header">
            <div class="sort">
              <span>{{ $t('note.sort') }}</span>
              <!-- <el-input type="number" v-model="item.sort"></el-input> -->
              <input type="number" v-model="item.sort" />
            </div>
            <div class="actions">
              <el-tooltip effect="dark" :content="$t('delete')" placement="top">
                <i class="iconfont icon-shanchu1" @click="delNote(index)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('saveNote')" placement="top">
                <i class="iconfont icon-baocun" @click="saveEditNote(item, index)"></i>
              </el-tooltip>
            </div>
          </div>
          <!-- 下边 -->
          <div class="single-note-content">
            <div class="inner">
              <!-- 左边封面 -->
              <div class="single-note-thumb">
                <img :src="getThumb(item.thumb)" />
              </div>
              <!-- 右边编辑 -->
              <div class="single-note-form">
                <el-input v-model="item.title" :placeholder="$t('note.title')"></el-input>
                <el-input v-model="item.content" type="textarea" resize="none" :placeholder="$t('note.contentPlace')"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 注释数组为空显示 -->
      <div v-else class="single-note-empty">
        <div class="single-note-empty-content">
          <span>
            {{ $t('note.singleEmpty') }}
          </span>
        </div>
      </div>
    </div>
    <!-- 多模型内部内容区 -->
    <div v-else class="content">
      <!-- 多模型注释内容区-有内容 -->
      <div v-if="notes.length > 0" class="mult-note-container">
        <!-- 每一项 -->
        <div class="mult-note-item" :class="itemActive === index ? 'active' : ''" v-for="(item, index) in notes" :key="index" @click="selectItem(item, index)">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <!-- 多模型注释无内容 -->
      <div v-else class="mult-note-empty">
        <div class="mult-note-empty-content">
          <span>
            {{ $t('note.multEmpty') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  filePrefix,
  image
} from '@/utils/global.js';
// 单模型注释默认对象
const defaultSingle = {
  thumb: null,
  title: '',
  content: '',
  sort: '',
  position: null
};

export default {
  name: 'Note',
  props: {
    // 模型是单模型还是多模型
    single: {
      type: Boolean,
      required: true
    },
    notes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      noteArr: [],
      itemActive: null
    }
  },
  created() {
    this.noteArr = this.notes;
  },
  computed: {
    getThumb() {
      return function (src) {
        return src ? filePrefix + image + src : require('@/assets/default/user.jpg');
      }
    }
  },
  methods: {
    // 双击单模型创建注释
    createNote() {
      this.noteArr.push(JSON.parse(JSON.stringify(defaultSingle)));
    },
    // 单模型删除注释
    delNote(index) {
      this.noteArr.splice(index, 1);
      this.$emit('delNote',index)
    },
    
    // 多模型选择列表中项事件
    selectItem(item, index) {
      this.itemActive = index;
      this.$emit('selectNoteItem', item, index);
    },
    saveEditNote(item, index) {
      console.log(item);
      this.$emit('saveEditNote', item, index);
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
.note {
  height: 100%;
  padding: 10px;
  .content {
    box-sizing: border-box;
    min-height: 100%;
    border-radius: 6px;
    background-color: $color-animation;
    padding: 0 10px;
  }
}
// 单模型注释不为空外层容器
.single-note-container,
.mult-note-container {
  padding: 10px 0;
}
// 单模型注释中的每项
.single-note-item {
  border-radius: 6px;
  overflow: hidden;
  // 头部
  .single-note-header {
    background-color: $color-singleNoteHeader;
    height: 30px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    .sort {
      display: flex;
      align-items: center;
      input[type="number"] {
        -moz-appearance: textfield;
        height: 20px;
        line-height: 20px;
        background-color: transparent;
        width: 30px;
        border: 0;
        outline: 0;
        text-align: center;
        margin-left: 15px;
        color: $color-fontMain;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none!important;
      }
    }
    .actions {
      display: flex;
      align-items: center;
    }
    .iconfont {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 10px;
    }
  }
  // 下面
  .single-note-content {
    background-color: $color-dialogTitle;
    .inner {
      padding: 10px;
      display: flex;
      // 左边封面
      .single-note-thumb {
        width: 64px;
        height: 64px;
        margin-right: 15px;
        overflow: hidden;
        display: flex;
        flex: 0 0 auto;
        img {
          vertical-align: middle;
          background-size: cover;
          background-position: center;
          width: 100%;
          height: 100%;
        }
      }
      // 右边编辑
      .single-note-form {
        flex: 1 1 auto;
        font-size: 13px;
        overflow-wrap: break-word;
        .el-input {
          width: 100%;
          margin-bottom: 5px;
          &::v-deep .el-input__inner {
            width: 100%;
            padding: 0 0 0 5px;
            height: 24px;
            line-height: 24px;
            background-color: $color-singleNoteHeader;
            border: 1px solid $color-singleNoteHeader;
            color: $color-fontMain;
          }
        }
        .el-textarea::v-deep .el-textarea__inner {
          width: 100%;
          padding: 0 0 0 5px;
          height: 44px;
          background-color: $color-singleNoteHeader;
          border: 1px solid $color-singleNoteHeader;
          color: $color-fontMain;
        }
      }
    }
  }
}

// 多模型注释中的每项
.mult-note-item {
  box-sizing: border-box;
  display: block;
  margin-top: 10px;
  border-radius: 6px;
  width: 100%;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  background-color: $color-dialogTitle;
  cursor: pointer;
}
.mult-note-item.active {
  border: 1px solid $color-fontMain;
}

// 模型注释为空时
.single-note-empty,
.mult-note-empty {
  height: 200px;
  padding: 10px;
  .single-note-empty-content,
  .mult-note-empty-content {
    height: 100%;
    border: 1px dashed $color-fontMain;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>