<template>
  <div class="item">
    <!-- 顶部导航栏 -->
    <div class="editor-nav">
      <div class="nav-left">
        <a href="/">
          <img src="~@/assets/logo.png" :alt="$t('logoName')">
        </a>
        <span>{{$t("modelEditor.label")}}</span>
      </div>
      <div class="nav-right">
        <el-button size="medium" type="info" @click="back">{{$t("exit")}}</el-button>
        <el-button size="medium" type="warning">{{$t("preview")}}</el-button>
<!--        此处要做一个默认是网格开值变成true状态，点击变成网格关值变成flase状态-->
        <el-button size="medium" type="warning">{{$t("showGrid")}}</el-button>
        <el-button size="medium" type="primary">{{$t("saveThumb")}}</el-button>
        <el-button size="medium" type="primary">{{$t("saveConfig")}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import light from '@/components/common/render/light.vue';
import scene from '@/components/common/render/scene.vue';
export default {
  name: 'testForLi',
  components: {
    light,
    scene
  },
  data() {
    return {
      
    }
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
  }
}
</script>
<style lang="scss" scoped>

</style>