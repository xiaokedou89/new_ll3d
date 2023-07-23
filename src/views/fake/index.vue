<template>
  <div id="fake">
  <fakeRender
      v-if="renderFlag"
    :parent="parent"
    :file="file"
    :direction="direction"
      :width="width"
      :height="height"
  >
  </fakeRender>
  </div>
</template>

<script>
import fakeRender from '@/components/common/render/fakeRender.vue'
import * as api from "@/api/model/model";
export default {
  name: "index",
  data() {
    return {
      renderFlag: false,
      id:null,
      parent:null,//父文件地址
      file:null,// 拼接url地址
      direction:0,
      dom:null,//渲染伪3d的dom元素
      width:null,// canvas画布的宽
      height:null//canvas画布的高
    }},
  created() {
    if (this.$route.params && typeof this.$route.params.id != null) {
      this.id = this.$route.params.id
    }
    api.getOne(this.id)
        .then(res => {
        // console.log(res)
          this.parent=res.data.model
          this.file=res.data.texture
          this.renderFlag = true
          this.dom=document.getElementById("fake");
        })
  },
  components: {
    fakeRender
  },
}
</script>

<style lang="scss" scoped>
#fake {
  width: 100%;
  height: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;
}
</style>