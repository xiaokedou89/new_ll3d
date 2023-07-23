<template>
  <div 
    class="dropdown" 
    :class="{bottom: placement == 'bottom', top: placement == 'top', left: placement == 'left', right: placement == 'right' }">
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'dropdown',
  props: {
    placement: {
      type: String,
      default: 'bottom'
    }
  }
}
</script>
<style lang="scss" scoped>
.dropdown {
  background-color: #333333;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
  box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
  display: none;
  min-width: 160px;
  margin-top: -10px;
  text-align: left;
  font-size: 14px;
  position: absolute;
  top: 100%;
  // todo这里要判断修改
  left: 0;
  z-index: 999;
  ul {
    padding: 5px 0;
    li {
      box-sizing: border-box;
      display: block;
      padding: 3px 20px;
      font-weight: normal;
      line-height: 1.42857143;
      color: var(--color--fontMain);
      white-space: nowrap;
      span {
        box-sizing: border-box;
      }
    }
    &>li:hover {
      background-color: var(--color--main);
      font-style: italic;
      font-weight: bold;
    }
  }
}
.dropdown.right {
  top: 0;
  left: 100%;
  margin-left: -5px;
}
.dropdown.left {
  top: 0;
  right: 100%;
  margin-right: -5px;
}
.dropdown.bottom {
  top: 100%;
  left: 0;
  margin-top: -10px;
}
.dropdown.top {
  bottom: 100%;
  left: 0;
  margin-bottom: -10px;
}
</style>