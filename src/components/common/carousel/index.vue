<template>
  <el-carousel>
    <el-carousel-item v-for="item in list" :key="item">
      <el-image :src="getImgSrc(item.thumb)" class="carousel_image_type"/>
<!--      <h3>{{ item.thumb }}</h3>-->
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import {filePrefix, image} from "@/utils/global";

export default {
  name: "index",
  props: {
    list: { // 首页父组件给子组件传值的banner图列表
      type: Array,
      default: {}
    }
  },
  computed: {
    getImgSrc() {
      return function (src) {
        return filePrefix + image + src
      }
    }
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}
.el-carousel__item carousel_image_type{
  width: 100%;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
