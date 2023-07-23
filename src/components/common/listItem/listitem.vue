<template>
  <div class="list-item">
    <el-tooltip effect="light" :content="$t('setting')" placement="top">
      <div class="set-icon" v-if="isConfig" @click="linkToSetDetail"></div>
    </el-tooltip>

    <div class="top">
      <a href="#" @click.prevent="linkToDetail">
        <el-image
            :src="getImgSrc(src)"
            fit="scale-down"></el-image>
        <!-- <img :src="getImgSrc(src)" :alt="title"> -->
      </a>
    </div>
    <div class="bottom">
      <h4>{{ title }}</h4>
      <p>{{ getTime(updataTime) }}</p>
      <el-tooltip effect="light" :content="$t('delete')" placement="top">
        <div class="set-icon icon-del" v-if="isAr" @click="delAr"></div>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import {filePrefix, common,image} from '@/utils/global.js'
export default {
  name: 'listitem',
  props: {
    id: {
      type: Number,
      default: null
    },
    src: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    isAr: {
      type: Boolean,
      default: false
    },
    updataTime: {
      type: String,
      default: ''
    },
    isConfig: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  computed: {
    getTime() {
      // return this.$moment(time).format('YYYY/MM/D HH:mm')
      return function (time) {
        return time == null ? '' : this.$moment(time).format('YYYY/MM/D HH:mm')
      }
    },
    getImgSrc() {
      return function (src) {
        return src ?  filePrefix + image + src : require('@/assets/1.jpg')
      }
    }
  },
  methods: {
    linkToDetail() {
      this.$router.push({
        path: this.url,
        query: {
          flag: false,
          id: this.id
        }
      })
    },
    linkToSetDetail() {
      this.$router.push({
        path: this.url,
        query: {
          flag: true,
          id: this.id
        }
      })
      // this.$router.push('/home/arListDetail')
    },
    // 点击删除图片事件
    delAr() {
      this.$emit('delItem')
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.set-icon {
  position: absolute;
  z-index: 99;
  right: 0;
  width: 23px;
  height: 23px;
  background: url('~@/assets/set-icon.png') no-repeat;
  background-color: #FF9B00;
  cursor: pointer;
}

.set-icon:hover {
  border: 1px solid #fff;
}
.set-icon.icon-del {
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background: url('~@/assets/del.png') no-repeat 3px 3px;
  background-color: #ccc;
}
.list-item .top {
  width: 100%;
  height: 75%;
}

.list-item .top a {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #222;
  justify-content: center;
  overflow: hidden;
}
.list-item .top a img {
  height: auto;
  width: 100%;
}
.list-item .top a .el-image {
  height: 100%;
  width: 100%;
}
.list-item .bottom {
  width: 100%;
  height: 25%;
  position: relative;
  padding-top: 5px;
  background-color: #222;
}
.list-item .bottom h4 {
  padding-left: 10px;
  color: #fff;
  font-weight: 100;
}
.list-item .bottom p {
  padding-left: 10px;
  padding-top: 4px;
  color: rgba(204, 204, 204, 0.452);
}
</style>
