<template>
  <!-- <el-select v-model="value"  @change="playAction">
    <el-option
        v-for="item in names"
        :key="item"
        :label="item"
        :value="item">
    </el-option>
  </el-select> -->
  <div class="animation">
    <!-- 内部内容区 -->
    <div class="content">
      <!-- 每一个动画选项 -->
      <div class="animation-item switch-container" v-for="(item, index) in animations" :key="index">
        <span>{{ item.name }}</span>
        <el-switch
          v-model="item.value"
          active-text="ON"
          inactive-text="OFF"
          @change="animationChange(item)"
        ></el-switch>
      </div>
    </div>
  </div>
</template>
<script>


export default {
  name: "animations",
  props: {
    names: {
      type: Array,
      require: true
    }
  }, 
  data() {
    return {
      value: '',
      animations: []
    }
  },
  created() {
    this.animations = this.names;
  },
  methods: {
    animationChange(item) {
      this.$emit('animationChange', item);
    }
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
.animation {
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

// 每个动画项
.animation-item {
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
}
@include render-switch;
</style>
