<template>
  <div>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
      <div
          style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        回到顶部
      </div>
    </el-backtop>
    <Carousel
      :list="bannerList"
    ></Carousel>
    <div class="pic_list">
      <div>
        <img src="~@/assets/3d/upload.png">
        <span>免费上传</span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>模型安全
        </span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>VR全景展示
        </span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>3D扫描
        </span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>3d打印
        </span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>下载模型
        </span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>共享交流
        </span>
      </div>
      <div>
        <img src="~@/assets/3d/mxaq.png">
        <span>VR调用
        </span>
      </div>
    </div>
    <div class="good">
      <header class="good-header">探索更多模型</header>
      <div class="good_button_group">
        <el-button  size="small" plain round>精品</el-button>
        <el-button  size="small" plain round>全景</el-button>
        <el-button  size="small" plain round>下载</el-button>
        <el-button  size="small"plain round>webAR</el-button>
      </div>
      <div class="good-box">
        <div class="good-item" v-for="item in newGoodses" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="prefix(item.goodsCoverImg)" alt="">
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="categorys">
      <h1 class="category-header">乐乐三维云</h1>
      <p class="category-p">中国领先共享VR互动展示平台</p>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Carousel from '@/components/common/carousel/index'
import Footer from '@/components/common/Footer/index'
import modelItem from '@/components/common/item/model'
import {filePrefix, image} from "@/utils/global";
import {getList} from "@/api/home/banner";
export default {
	name: 'Home',
  components: {
    Carousel,Footer,modelItem
  },
  data() {
    return {
      currentDate: new Date(),
      bannerList:[]// 轮播图列表
    };
  },
  computed: {
    getAssetSrc() {
      return function (src) {
        // return require(src)
       return  require('@/assets/1.jpg')
      }
    }
  },
  created() {
    this.getBannerList()
  },
  methods:{
      getBannerList(){
        let data={
          pkId:0,
          pagesize:10
        }
        getList(data).then(res => {
          console.log(res)
          this.bannerList=res.data
        })
      }

  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
.home-container {
  // height: 100%;
  //height: calc(100% - 60px);
  background-color: #2D2E31;
}
//.home-container::-webkit-scollbar {
//  display: none;
//}
.panel_pic{
  //background: #222 url(../images/menu.jpg) bottom left repeat-x;
  background-color: black;
  padding-bottom: 20px;
  padding-top: 20px;
  position: relative;
  z-index: 0;
  .container{
    width: 96%;
    background-color: pink;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    .pic_li{
      width: 12.5%;
      float: left;
    }
  }
}
.pic_list{
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 13px;
  background-color: #222;
  div {
    display: flex;
    flex-direction: column;
    width: 12%;
    text-align: center;
    img {
      width: 40px;
      height: 40px;
      margin: 13px auto 8px auto;
    }
  }
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.good {
  .good-header {
    background: #2d2e31;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #e99605;
    font-size: 16px;
    font-weight: 500;
  }
  .good_button_group{
      display: flex;
      justify-content: center;
      width: 70%;
      margin: 0 auto;
      .el-button {
        margin: 0 30px;
      }
  }
  .good-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .good-item {
      box-sizing: border-box;
      width: 50%;
      border-bottom: 1PX solid #e9e9e9;
      padding: 10px 10px;
      img {
        display: block;
        width: 120px;
        margin: 0 auto;
      }
      .good-desc {
        text-align: center;
        font-size: 14px;
        padding: 10px 0;
        .title {
          color: #222333;
        }
        .price {
          color:#1baeae;
        }
      }
      &:nth-child(2n + 1) {
        border-right: 1PX solid #e9e9e9;
      }
    }
  }
}
.categorys {
  background: #222;
  .category-header {
    background: #2d2e31;
    text-align: center;
  }
  .category-p{
    text-align: center;
    letter-spacing:2px;
  }
}
</style>
