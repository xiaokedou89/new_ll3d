<template>
  <div class="ar-list-detail">
    <!-- 侧边栏 -->
    <div class="aside">
      <!-- 上传封面 -->
      <div class="aside-top">
        <div class="aside-top-img">
          <el-upload
            class="avatar-uploader"
            :action="imgUrl"
            :show-file-list="false"
            :on-success="uploadImgSuc"
            :before-upload="imgBefUp"
          >
            <img class="avatar" v-if="imgSrc" :src="imgSrc" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="aside-top-p">
          {{ $t("thumb") }}
        </div>
      </div>
      <!-- 选项卡 -->
      <div class="aside-bottom">
        <el-tabs type="border-card" :stretch="true">
          <!-- 全景设置选项卡 -->
          <el-tab-pane>
            <span slot="label">
              <i>{{ $t("panoramaConfig") }}</i>
            </span>
            <div class="tab-container">
              <div class="tab-container-item" v-for="(item, index) in vrSetArr" :key="index">
                <el-tooltip effect="light" placement="top" :open-delay="300" :content="item.tooltipTitle">
                  <span>{{ item.title }}</span>
                </el-tooltip> 
              </div>
            </div>
          </el-tab-pane>
          <!-- 功能启用选项卡 -->
          <el-tab-pane>
            <span slot="label">
              <i>{{ $t("panorama.enable") }}</i>
            </span>
            <div class="tab-container">
              <div class="tab-container-flag-item" v-for="(item, index) in openFlagArr" :key="index">
                <span>{{ item.title }}</span>
                <el-tooltip effect="light" placement="top" :open-delay="300" :content="item.tooltipTitle">
                  <div class="switch-container">
                    <el-switch
                      size="small"
                      v-model="item.flag"
                      active-color="#cccccc"
                      inactive-color="#222222">
                    </el-switch>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="container">
      <div class="container-top">
        <span>作品编辑</span>
      </div>
      <div class="container-body">
        <el-form :model="formObj">
          <el-form-item :label="$t('panorama.name')+$t('colon')">
            <el-input v-model="formObj.name"></el-input>
          </el-form-item>
          <el-form-item label="$t('panorama.description')+$t('colon')">
            <el-input v-model="formObj.name"></el-input>
          </el-form-item>
          <el-form-item label="$t('panorama.tag')+$t('colon')">
            <el-input v-model="formObj.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { globalUrl, filePrefix, common } from '@/utils/global.js'
import * as api from '@/api/file/file.js'
export default {
  name: 'ArListDetail',
  data() {
    return {
      value: '',
      // 上传封面请求路径
      imgUrl: globalUrl + '/file/upload/common',
      // 上传图片的src
      imgSrc: '',
      // 全景设置渲染数组
      vrSetArr: [
        {
          title:  this.$t("config.VisualEdit"),
          tooltipTitle: this.$t("config.VisualEditInfo")
        },
        {
          title: this.$t("config.bgMusic"),
          tooltipTitle: this.$t("config.panBgMusicInfo")
        },
        {
          title: this.$t("config.openTip"),
          tooltipTitle: this.$t("config.panOpenTipInfo")
        },
        {
          title: this.$t("config.customLogo"),
          tooltipTitle: this.$t("config.panCustomLogoInfo")
        },
        {
          title: this.$t("config.author"),
          tooltipTitle: this.$t("config.panAuthorInfo")
        }
      ],
      // 功能启用渲染数组
      openFlagArr: [
        {
          title: this.$t("config.autoRotate"),
          tooltipTitle: this.$t("config.autoRotateInfo"),
          flag: false
        },
        {
          title: this.$t("config.hideAuthor"),
          tooltipTitle: this.$t("config.hideAuthorInfo"),
          flag: false
        },
        {
          title: this.$t("config.hideVR"),
          tooltipTitle: this.$t("config.hideVRInfo"),
          flag: false
        },
        {
          title: this.$t("config.hideDescription"),
          tooltipTitle: this.$t("config.hideDescriptionInfo"),
          flag: false
        }
      ],
      // 表单绑定对象
      formObj: {
        name: '',
        description: '',
        tag: ''
      }
    }
  },
  computed: {
    // 根据图片名拼接图片路径
    getImgSrc() {
      return function (src) {
        return src ? filePrefix + common + src : require('@/assets/1.jpg')
      }
    }
  },
  methods: {
    // 上传封面成功回调
    uploadImgSuc(res, file) {
      if (res.data !== null) {
        if (this.imgSrc) {
          api.delFile('common', {filename: this.imgSrc})
            .then(res => {
              // console.log('del success')
              // console.log(res)
            })
        }
        this.imgSrc = this.getImgSrc(res.data.filename)
      }
    },
    // 上传封面前回调--检查格式
    imgBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let extension
      if (textMsg === 'jpg' || textMsg === 'png' || textMsg === 'jpeg') {
        extension = true
      } else {
        extension = false
      }
      if (!extension) {
        this.$message({
          message:  this.$t("image.uploadRestrictions"),
          type: 'warning',
          duration: 1500
        })
      }
      return extension
    }
  }
}
</script>
<style lang="scss" scoped>
.ar-list-detail {
  width: 85%;
  height: 100%;
  margin: 0 auto;
  padding-top: 10px;
  // background-color: pink;
  display: flex;
  // 侧边栏
  .aside {
    width: 20%;
    height: 100%;
    // background-color: yellow;
    // 上传封面
    .aside-top {
      height: 200px;
      // 上传部分
      .aside-top-img {
        height: 160px;
        background-color: rgb(71, 68, 68);
      }
      // 文字部分
      .aside-top-p {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background-color: #222;
        color: #fff;
        text-align: center;
      }
    }
    // 选项卡
    .aside-bottom {
      width: 100%;
      margin-top: 20px;
      background-color: blue;
      // 选项卡主体部分
      .tab-container {
        padding: 0;
        background-color: rgb(53, 52, 52);
        // 选项卡item
        .tab-container-item {
          height: 40px;
          box-shadow: 0 -1px 1px -1px rgb(173, 173, 173);
          line-height: 40px;
          color: #ccc;
          text-align: center;
          cursor: pointer;
        }
        .tab-container-item:hover {
          background-color: rgba(90, 90, 90, .3);
          color: rgb(233,150,5);
          transform: translateY(-1px);
        }
        .tab-container-flag-item {
          position: relative;
          height: 40px;
          padding-left: 40px;
          box-shadow: 0 -1px 1px -1px rgb(173, 173, 173);
          line-height: 40px;
          color: #ccc;
          cursor: pointer;
          .switch-container {
            position: absolute;
            right: 50px;
            display: inline-block;
            padding-left: 20px;
          }
        }
        .tab-container-flag-item:hover {
          background-color: rgba(90, 90, 90, .3);
          color: rgb(233,150,5);
          transform: translateY(-1px);
        }
      }
    }
  }
  // 主体
  .container {
    width: 70%;
    height: 100%;
    margin-left: 2%;
    background-color: #222;
    // 头部标题
    .container-top {
      border-bottom: 1px solid #ccc;
      span {
        display: inline-block;
        width: 100px;
        height: 50px;
        padding: 0 2px;
        margin-left: 10px;
        line-height: 50px;
        font-size: 18px;
        text-align: center;
        color: #ccc;
        border-bottom: 3px solid rgba(212,212,212, .5);
      }
    }
    // 表单部分
    .container-body {
      height: calc(100% - 50px);
      background-color: yellow;
      padding: 30px 50px 0;
    }
  }
}

// 表单及input输入框默认样式修改
.container-body::v-deep .el-form-item {
  width: 100%;
}
.container-body::v-deep label.el-form-item__label {
  display: inline-block;
  background-color: red;
}
.container-body::v-deep .el-input__inner {
  width: 10%;
  margin-left: 10px;
  background-color: pink;
}

// 选项卡默认样式修改
.el-tabs {
  border: 0;  
}
.el-tabs::v-deep .el-tabs__headers {
  border: 0;
}

.el-tabs::v-deep .el-tabs__item {
  background-color: #222;
  border: 1px solid #222;
  color: #fff;
}

.el-tabs::v-deep .el-tabs__item.is-active {
  background-color: #414247;
  color: rgb(233,150,5);
  border: 1px solid #34353a;
}
// 选项卡主体部分container容器
.el-tabs::v-deep .el-tabs__content {
  padding: 0;
}

// el-upload
.avatar-uploader::v-deep .el-upload {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 160px;
    display: block; 
  }
}
.avatar-uploader::v-deep .el-upload:hover {
  border-color: #409EFF;
}

</style>