<template>
  <div class="tabs-item-container">
    <div class="icon-title">普通热点 (使用鼠标左键拖动)</div>
    <!-- 图标区 -->
    <div class="icon-container">
      <div v-for="(item, index) in icons" :key="index" class="icon-item">
        <img :src="item.src" draggable="true" @dragstart="iconDragStart($event, item, index,iconObj)" />
      </div>
    </div>
    <!-- 调整大小滑块区 -->
    <div class="icon-size-container">
      <span>图标大小</span>
      <div class="el-slider-group">
        <el-slider  @change="iconSizeChange" v-model="iconObj.size" :step="0.1" :min="0.1" :max="1" />
        <div class="show-box">
          <span>0.1</span>
          <span>1</span>
        </div>
      </div>
      <!-- <span>链接地址</span>
      <div class="el-slider-group">
        <el-input placeholder="Please input" v-model="iconObj.href">
        </el-input>
      </div> -->
    </div>
    <!-- 按钮区 -->
    <div class="icon-btn-container">
      <!-- <div class="change-btn-group">
        <button>均布</button>
        <button>等高</button>
        <button>取消</button>
      </div> -->
      <!-- <button class="confirm-btn" @click="iconConfirm">确定</button>
      <button class="del-btn" @click="iconDel">删除</button> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'hot',
  data() {
    return {
      icons: [
        { src: require('@/assets/hot/icon1.png') },
        { src: require('@/assets/hot/icon2.png') },
        { src: require('@/assets/hot/icon3.png') },
        { src: require('@/assets/hot/icon4.png') },
        { src: require('@/assets/hot/icon5.png') },
        { src: require('@/assets/hot/icon6.png') },
        { src: require('@/assets/hot/icon7.png') },
        { src: require('@/assets/hot/icon8.png') },
        { src: require('@/assets/hot/icon9.png') },
        { src: require('@/assets/hot/icon10.png') }
      ],
      iconObj: {
        size: 0,// 图标尺寸大小
        href:"" //图标链接url
      }
    }
  },
  methods: {
    iconDragStart(e, item, index,iconObj) {
      this.$emit('iconDragStart',e, item, index,iconObj)
    },
    iconSizeChange(e) {
      this.$emit('iconSizeChange', e)
    },
    iconDel() {
      this.$emit('iconDel')
    },iconConfirm(){
      this.$emit('iconConfirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-item-container {
  // 标题
  .icon-title {
    padding: 10px 5px;
  }
  // 图标区域
  .icon-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 15px;
    padding: 0 5px;
    .icon-item {
      width: 20%;
      height: 50px;
      margin: 10px 0;
      // border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  // 调整大小滑块区域
  .icon-size-container {
    padding: 10px 10px;
    .el-slider-group {
      padding: 10px 10px;
      .show-box {
        width: 100%;
        height: 20px;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        span {
          color: #ccc;
        }
      }
    }
  }
  // 按钮区域
  .icon-btn-container {
    padding: 10px 10px;
    .change-btn-group {
      display: flex;
      width: 100%;
      justify-content: space-between;
      button {
        width: 30%;
        margin: 0 4px;
      }
    }
    .del-btn {
      margin-top: 10px;
      background-color: #ccc;
      width: 100%;
    }
      .confirm-btn {
      margin-top: 10px;
      background-color: #1e80ff;
      width: 100%;
    }
  }
}


// 按钮默认样式
// 调节位置和旋转按钮样式
button {
  display: block;
  margin-top: 8px;
  height: 30px;
  color: #fff;
  background-color: rgba(204, 204, 204, .5);
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: rgba(204, 204, 204, .8);
  text-shadow: 0 0 10px #fff;
  font-style: italic;
  font-weight: 700;
  box-shadow: 0 0 5px #fff;
}
button:active {
  background-color: rgba(204, 204, 204, 1);
  font-weight: 500;
  font-style: normal;
  box-shadow: none;
}
button[disabled] {
  cursor: not-allowed;
}
button[disabled]:hover {
  background-color: rgba(204, 204, 204, .5);
  text-shadow: none;
  font-style: normal;
  font-weight: 500;
  box-shadow: none;
}
</style>