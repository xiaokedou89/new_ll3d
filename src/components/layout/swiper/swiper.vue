<template>
  <div class="swiper" v-if="show && flag">
    <!-- autoplay loop -->
    <el-carousel :height="height" :autoplay="false"  arrow="hover" >
      <el-carousel-item v-for="(item, index) in list" :key="index">
        <!-- 图片 -->
        <el-image :src="getImg(item.thumb)" fit="cover" />
        <!-- 模型的通版容器 -->
        <div class="model-container">
          <div class="model-content">
            <model :key="`swiper${item.modelId}`" :show-loading="false" v-if="item.modelId !== 0" :id="item.modelId" :show-btn="false"></model>
          </div>
        </div>  
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import { getSwiper } from '@/api/first/first.js';
import { filePrefix, image } from '@/utils/global.js';
import model from '@/components/common/render/model.vue';
export default {
  name: 'swiper',
  components: {
    model
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      flag: true,
      // 适配swiper外层的高度
      height: '250px'
    }
  },
  created() {
    const that = this;
    this.initHeight();
    this.init();
    window.addEventListener('resize', that.pageResize, false);
  },
  computed: {
    getImg() {
      return function (src) {
        return filePrefix + image + src;
      }
    }
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', that.pageResize, false);
  },
  methods: {
    init() {
      getSwiper()
        .then(res => {
          if (res.code === 20000) {
            this.list = res.data;
          } else {
            this.list = [];
            this.flag = false;
          }
        })
        .catch(err => {
          this.list = [];
          this.flag = false;
        })
    },
    // 初始化适配
    initHeight() {
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      let height = deviceWidth * 500 / 1920;
      height <= 250 && (height = 250);
      height >= 500 && (height = 500);
      this.height = `${height}px`;
    },
    // 屏幕尺寸变化适配
    pageResize(e) {
      const that = this;
      this.$nextTick(() => {
        e.currentTarget.innerWidth
        let height = e.currentTarget.innerWidth * 500 / 1920;
        height <= 250 && (height = 250);
        height >= 500 && (height = 500);
        that.height = `${height}px`;
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.el-image {
  height: 100%;
}
.model-container {
  height: 100%;
  width: 80%;
  background-color: transparent;
  // background-color: pink;
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  .model-content {
    width: 50%;
    height: 100%;
    background-color: transparent;
    // background-color: red;
    position: absolute;
    top: 0;
    left: 50%;
  }
}
@media (min-width: 768px) {
  .model-container {
    width: 80%;
    left: 10%;
    right: 10%;
    .model-content {
      height: 100%;
    }
  }
}
@media (max-width: 520px) {
  .model-container {
    width: 84%;
    left: 8%;
    right: 8%;
    .model-content {
      height: 130px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>