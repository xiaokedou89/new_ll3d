<template>
  <div :class="{dialogMask: mask, dialog: !mask, aniShowOpt: visible}" v-if="visible">
    <!-- 弹框主体部分 -->
    <div class="dialog-container">
      <!-- 头部 -->
      <div class="dialog-header" :class="{headerFill: !title}">
        <h4 class="dialog-header-title" v-if="title">{{ title }}</h4>
        <i v-if="closable" class="iconfont icon-guanbi close" :class="{closePos: title}" @click="cancel"></i>
      </div>
      <!-- 弹框主体 -->
      <div class="dialog-body">
        <slot></slot>
      </div>
      <div class="dialog-footer">
        <slot name="footer">
          <div class="footerDefault" v-if="closable">
            <button type="button" class="btn confirmBtn" @click="confirm">{{ $t('confirm') }}</button>
            <button type="button" class="btn cancelBtn m_l10" @click="cancel">{{ $t('cancel') }}</button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dialoger',
  props: {
    // 弹窗开关
    visible: {
      type: Boolean,
      default: false
    },
    // 是否开启全屏蒙层，不开启蒙层时内容以弹框内容为主，依靠外部定位
    mask: {
      type: Boolean,
      default: true
    },
    // 传入的header标题
    title: {
      type: String,
      default: ''
    },
    // 是否可以关闭
    closable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dialogMask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001;
  background-color: var(--color--maskBg);
  // background-color: $maskBg;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-container {
  box-sizing: border-box;
  width: 400px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 6px;
  outline: 0;
  -webkit-box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
  box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
  // 弹框头部
  .dialog-header {
    box-sizing: border-box;
    padding: 15px;
    border-bottom: 2px solid var(--color--dialogInnerBorder);
    // border-bottom: 2px solid $dialogInnerBorder;
    text-align: left;
    position: relative;
    .dialog-header-title {
      color: var(--color--dialogTitle);
      // color: $dialogTitle;
      font-weight: bold;
      font-size: 18px;
    }
    .close {
      text-align: right;
      cursor: pointer;
    } 
    // 传入title时候的关闭图标
    .closePos {
      position: absolute;
      right: 10px;
      top: 18px;
    }
  }
  // 未传入title时close按钮右侧对齐
  .headerFill {
    text-align: right;
  }
  // 弹框主体容器
  .dialog-body {
    @include scrollBar;
    box-sizing: border-box;
    background-color: var(--color--dialogBody);
    // background-color: $dialogBody;
    position: relative;
    padding: 15px;
    min-height: 100px;
    max-height: 450px;
    overflow: auto;
  }
  // 弹框底部
  .dialog-footer {
    padding: 15px;
    border-top: 2px solid var(--color--dialogInnerBorder);
    // border-top: 2px solid $dialogInnerBorder;
  }
  // 开启关闭功能时的默认样式
  .footerDefault {
    text-align: right;
  }
}
@media (max-width: 600px) {
  .dialog {
    width: 100%;
  }
  .dialog-container {
    width: 100%;
  }
}
</style>