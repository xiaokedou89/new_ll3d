<template>
  <div class="dropdown-menu" tabindex="0" @click="contentClick">
    <slot name="content">
      <span class="menu-label">
        {{ label ? label : $t('none')}}
        <i class="iconfont" v-if="icon" :class="{[icon]: icon ? true : false}"></i>
      </span>
    </slot>
    <dropdown v-if="dropable" :placement="placement">
      <slot>
      </slot>
    </dropdown>
  </div>
</template>
<script>
import dropdown from '@/components/common/dropdown/dropdown.vue';
export default {
  name: 'dropdown-menu',
  components: {
    dropdown
  },
  props: {
    // 默认插槽的文本
    label: {
      type: String,
      default: null
    },
    // iconfont的类名
    icon: {
      type: String,
      default: ''
    },
    // 是否开启下拉菜单
    dropable: {
      type: Boolean,
      default: false
    },
    // 下拉菜单出现的位置
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  methods: {
    contentClick() {
      // 发射默认头部的点击事件
      this.$emit('contentClick')
    }
  }
}
</script>
<style lang="scss" scoped>
.dropdown-menu {
  position: relative;
  cursor: pointer;
  color: #fff;
  .menu-label {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100px;
    .iconfont {
      vertical-align: middle;
    }
  }
}
.dropdown-menu:hover>.dropdown {
  display: block;
  animation: show 500ms linear 1;
}
.dropdown-menu:hover>.menu-label {
  color: var(--color--main);
}
</style>