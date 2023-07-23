<template>
  <div class="fake-container">
    <canvas class="fake" ref="fake"></canvas>
  </div>
</template>
<script>
// 伪3d渲染组件
import {uploadUrl} from "@/utils/global";

export default {
  name: "fakeRender",
  props: {
    parent: {
      type: String,
      require: true
    },
    file: {
      type: String,
      require: true
    },
    direction:{
      type:Number,
      require:true
    }
  },
  data() {
    return {
      ctx:null,
      inter:null,//循环函数值
      start:null,// 多图片开始值
      end:null,//多图片结束值
      suffix:null,//文件后缀值
      num:null,
      width:null,
      height:null
    }},
  mounted() {
    const canvas=this.$refs.fake
    this.ctx=canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
        this.ctx.mozBackingStorePixelRatio ||
        this.ctx.msBackingStorePixelRatio ||
        this.ctx.oBackingStorePixelRatio ||
        this.ctx.backingStorePixelRatio || 1;
    const ratio = devicePixelRatio / backingStoreRatio;
    canvas.width = canvas.width * ratio;
    canvas.height = canvas.height* ratio;
    this.width=canvas.width
    this.height=canvas.height
    this.ctx.scale(ratio, ratio);
    this.getBasic()

  },
  destroyed() {
    clearInterval(this.inter)
  },
  methods: {
    getBasic(){
      this.start=this.file.split("_")[0]
      this.end=this.file.split("_")[1]
      this.suffix=this.file.split("_")[2]
      this.num=this.start
      this.inter = setInterval(this.changeLeftBg, 200)
    },
    changeLeftBg() {
      // this.num === this.start && (this.num = this.end)
      if (this.num==this.end){
        this.num=this.start
      }
      this.num++
      let that=this
      let img = new Image()
      img.src = "http://192.168.1.126:8082/file/model?filename="+this.parent+"/"+this.num+this.suffix
      // console.log("http://192.168.1.126:8082/file/model?filename="+this.parent+"/"+this.num+this.suffix)
      img.onload = function () {
        that.$refs.fake.width = img.width;//重点
        that.$refs.fake.height = img.height;//重点
        that.ctx.drawImage(img, 0, 0, that.$refs.fake.width,that.$refs.fake.height);
        that.$refs.fake.style.width = '100%';//重点
      }
    },
  }

}
</script>

<style lang="scss" scoped>
.fake-container {
  width: 100%;
  height: 100%;
  canvas.fake {
    width: 100% ;
    height: 100%;
  }
}
</style>