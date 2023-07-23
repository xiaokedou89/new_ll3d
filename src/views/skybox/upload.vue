<template>
  <div class="updata-material">
    <!-- 上传模型选项卡主体部分 -->
    <div class="pane-body">
      <!-- 上传模型选项卡主体部分--输入框 -->
      <div class="pane-body-title">
        <div class="pane-body-title-item">
          <span>{{$t('model.name')}}</span>
          <el-tooltip effect="light" :content="getInputSize(modelObj.name)" placement="top">
            <input v-model="modelObj.name" :maxlength="inputLint" type="text">
          </el-tooltip>
        </div>
        <div class="pane-body-title-item">
          <span>{{$t('model.description')}}</span>
          <el-tooltip effect="light" :content="getTextareaSize(modelObj.description)" placement="top">
            <textarea v-model="modelObj.description" class="txt-area" cols="30" rows="10" :maxlength="textareaLint"></textarea>
          </el-tooltip>
        </div>
      </div>
      <!-- 上传模型选项卡主体部分--主体 -->
      <div class="updata-container">
        <!-- 上传模型选项卡主体部分--标题 -->
        <div class="updata-container-top">
          <span> {{$t("model.label")}}</span>
          <span>{{$t("model.thumb")}}</span>
        </div>
        <!-- 上传模型选项卡主体部分--内容 -->
        <div class="updata-container-main">
          <!-- 上传模型左 -->
          <div class="updata-main-left">
            <el-upload
                ref="skyBoxUpload"
                action="#"
                list-type="picture-card"
                :auto-upload="false">
              <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url" alt=""
                  >
                  <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                    >
                    <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                   <i class="el-icon-delete"></i>
                  </span>
                </span>
                </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <!-- 上传模型右 -->
          <div class="updata-main-right">
            <el-upload
                ref="uploadModelFace"
                class="image-upload"
                :on-success="modelFaceUploadSuc"
                :before-upload="faceBefUp"
                :before-remove="befRemoveModelFace"
                :on-exceed="exceedInfo"
                accept="image/png, image/png, image/jpeg"
                drag
                :limit="1"
                :action="fileFacUrl"
            >
              <i class="el-icon-upload" v-show="!modelFaceFlag.flag"></i>
              <div class="el-upload__text" v-show="!modelFaceFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
              <div class="el-upload__text" v-if="modelFaceFlag.flag">
                <el-image
                    :src="getFacSrc(modelFaceFlag.src)"
                    fit="scale-down"></el-image>
              </div>
              <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
            </el-upload>
          </div>
        </div>
      </div>
      <!-- 确定、取消 -->
      <div class="updata-footer">
        <el-button size="small" type="primary" @click="uploadModelObj(modelParams)">{{$t("confirm")}}</el-button>
        <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  globalUrl,
  uploadUrl,
  common,
  video,
  image,
  filePrefix,
  inputLintSize,
  textareaLintSize,
  supportFileExtension,
  uploadModel, uploadFile, uploadFaceFile
} from '@/utils/global'
import Vue from 'vue'
import * as api from '@/api/file/file'
import * as skyboxApi from '@/api/skybox/skybox'

const defaultFlagObj = {
  flag: false,
  src: ''
}

const defaultFileFlagObj = {
  flag: false,
  title: null
}

const defaultObj = {
  name: null,
  path: null,
  thumb: null
}

const defaultModelObj = {
  name: null,//模型名称
  description: null,//模型描述
  model:null,//模型文件
  texture:null,//贴图文件
  type:null,//文件类型
  thumb:null// 封面图
}

export default {
  name: 'upload',
  data() {
    return {
      // 输入框默认限制的输入个数
      inputLint: inputLintSize,
      // 文本输入框默认限制的输入个数
      textareaLint: textareaLintSize,

      uploadList: [],
      //上传模型url
      modelUrl: uploadModel,
      // 上传文件url
      fileUrl: uploadFile,
      fileFacUrl: uploadFaceFile,
      modelObj: Object.assign({}, defaultModelObj),

      // 模型上传参数对象
      modelParams: {
        obj: null,
        type: false,
        nameText: this.$t("skybox.nameText"),
        pathText: this.$t("skybox.pathText"),
        thumbText: this.$t("skybox.thumbText"),
        flag: false
      },
      // 模型封面开关对象
      modelFaceFlag: Object.assign({}, defaultFlagObj),
      //上传多个图片使用
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  created() {
    Vue.set(this.modelParams, 'obj', this.modelObj)
  },
  computed: {
    getInputSize() {
      return function (text) {
        return typeof text === 'object' ? `${this.$t("canInput")}${this.inputLint}${this.$t("inputSize")}` : `${this.$t("canInput")}${this.inputLint - text.length}${this.$t("inputSize")}`
      }
    },
    getTextareaSize() {
      return function (text) {
        return typeof text === 'object' ? `${this.$t("canInput")}${this.textareaLint}${this.$t("inputSize")}` : `${this.$t("canInput")}${this.textareaLint - text.length}${this.$t("inputSize")}`
      }
    },
    getImgSrc() {
      return function (src) {
        return filePrefix + common + src
      }
    },
    getVideoSrc() {
      return function (src) {
        return filePrefix + video + src
      }
    },
    getFacSrc() {
      return function (src) {
        return filePrefix + image + src
      }
    }
  },
  methods: {
    handleRemove(file) {
      // this.$refs.skyBoxUpload.uploadFiles.remove(file)
      let files= this.$refs.skyBoxUpload.uploadFiles
      files.some((item, i) => {
        if (item.name == file.name) {
          files.splice(i, 1)
          return true //当内部return true时跳出整个循环
        }
      })
      // console.log(  this.$refs.skyBoxUpload.uploadFiles)
      // this.infoFrom.out_img = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    exceedInfo() {
      this.$message({
        message: this.$t("deleteFileInfo"),
        type: 'warning',
        duration: 1500
      })
    },
    // 上传图片及封面前回调限制
    faceBefUp(file) {
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
    },

    // 上传模型封面成功回调
    modelFaceUploadSuc(res) {
      if (res.code === 20000) {
        this.modelObj.thumb = res.data.filename
        this.modelFaceFlag.src = res.data.thumbnail
        this.modelFaceFlag.flag = true
        this.$message({
          message: this.$t("uploadSuccess"),
          type: 'success',
          duration: 1500
        })
      } else {
        this.$message({
          message: res.message,
          type: 'error',
          duration: 1500
        })
      }
    },
    // 移除图片上传列表回调
    befRemoveImage(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('image', {filename: this.imageObj.path})
              .then(res => {
                if (res.code === 20000) {
                  this.imageFileFlag = Object.assign({}, defaultFlagObj)
                  this.imageObj.path = null
                  this.imageObj.thumb = null
                  this.$message({
                    message: this.$t("deleteSuccess"),
                    type: 'success',
                    duration: 1500
                  })
                  resolve()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 1500
                  })
                  reject()
                }
              })
              .catch(err => {
                this.$message({
                  message: this.$t("deleteFail"),
                  type: 'warning',
                  duration: 1500
                })
                reject()
              })
        })
      }

    },
    // 移除图片封面图上传列表回调
    befRemoveImageFace(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('image', {filename: this.imageObj.thumb})
              .then(res => {
                if (res.code === 20000) {
                  this.imageFaceFlag = Object.assign({}, defaultFlagObj)
                  this.imageObj.thumb = null
                  this.$message({
                    message:this.$t("deleteSuccess"),
                    type: 'success',
                    duration: 1500
                  })
                  resolve()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 1500
                  })
                  reject()
                }
              })
              .catch(err => {
                this.$message({
                  message: this.$t("deleteFail"),
                  type: 'warning',
                  duration: 1500
                })
                reject()
              })
        })
      }
    },

    // 移除模型上传列表的回调
    befRemoveModel(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('model', {filename: this.modelObj.zipName})
              .then(res => {
                if (res.code === 20000) {
                  this.modelObj.zipName = null
                  this.modelObj.path = null
                  this.modelObj.statu=null
                  this.modelObj.format=null
                  this.$message({
                    message: this.$t("deleteSuccess"),
                    type: 'success',
                    duration: 1500
                  })
                  resolve()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 1500
                  })
                  reject()
                }
              })
              .catch(err => {
                this.$message({
                  message: this.$t("deleteFail"),
                  type: 'warning',
                  duration: 1500
                })
                reject()
              })
        })
      }
    },
    // 移除模型封面图上传列表回调
    befRemoveModelFace(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('image', {filename: this.modelObj.thumb})
              .then(res => {
                if (res.code === 20000) {
                  this.modelFaceFlag = Object.assign({}, defaultFlagObj)
                  this.modelObj.thumb = null
                  this.$message({
                    message:  this.$t("deleteSuccess"),
                    type: 'success',
                    duration: 1500
                  })
                  resolve()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 1500
                  })
                  reject()
                }
              })
              .catch(err => {
                this.$message({
                  message: this.$t("deleteFail"),
                  type: 'warning',
                  duration: 1500
                })
                reject()
              })
        })
      }
    },
    // 点击确定上传对象事件
    uploadModelObj(params) {
      if (params.flag) {
        return
      }
      // 防抖
      params.flag = true
      // 核实全景天空盒图片
      if(this.$refs.skyBoxUpload.uploadFiles==[]||this.$refs.skyBoxUpload.uploadFiles.length==0){
        this.$message({
          message: params.pathText,
          type: 'warning',
          duration: 1500
        })
        params.flag = false
        return
      }
      if (params.obj.name === '' || params.obj.name === null) {
        this.$message({
          message: params.nameText,
          type: 'warning',
          duration: 1500
        })
        params.flag = false
        return
      }
      if (params.obj.thumb === '' || params.obj.thumb === null) {
        this.$message({
          message: params.thumbText,
          type: 'warning',
          duration: 1500
        })
        params.flag = false
        return
      }
      let skyBoxUpload=new FormData()
      this.$refs.skyBoxUpload.uploadFiles.forEach((val,index)=>{
         skyBoxUpload.append("files",val.raw)
      })
      // 先上传天空盒图片
      api.uploadFile('skybox',skyBoxUpload).then(res=>{
        // 上传天空盒全景图成功
        if(res.data!=null){

        params.obj.path= JSON.stringify(res.data)
        skyboxApi.create(params.obj)
            .then(res => {
              if (res.data !== null) {
                params.flag = false
                this.$message({
                  message: this.$t("uploadSuccess"),
                  type: 'success',
                  duration: 1500
                })
                this.$router.push('/')
              }
            })
            .catch(err => {
              params.flag = false
              this.$message({
                message: err,
                type: 'error',
                duration: 1500
              })
            })
        }
      }).catch(err=>{
        params.flag = false
        this.$message({
          message: err,
          type: 'error',
          duration: 1500
        })
      })

    },
    // 点击取消事件
    cancelUpload() {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
ul {
  padding: 0;
  margin: 0;
}


.updata-material {
  position: relative;
  width: 85%;
  height: 100%;
  margin: 0 auto;
  background-color: #363636;
  // 选项卡主体部分
  .pane-body {
    width: 100%;
    height: 100%;
    // 主体输入框部分
    .pane-body-title {
      width: 100%;
      height: 80px;
      padding-left: 20px;
      padding-right: 20px;
      display: flex;
      align-items: center;
      // 输入框的其中一项的div
      .pane-body-title-item {
        margin-left: 30px;

        span {
          display: inline-block;
          width: 75px;
          height: 36px;
          border-top-left-radius: 7px;
          border-bottom-left-radius: 7px;
          line-height: 35px;
          text-align: center;
          color: #fff;
          background-color: #222;
        }

        input {
          height: 35px;
          padding-left: 8px;
          outline: none;
          border: none;
          border-top-right-radius: 7px;
          border-bottom-right-radius: 7px;
          background-color: #40424C;
          color: #fff;
          caret-color: #fff;
        }

        input:focus {
          border: none;
        }
        textarea {
          height: 35px;
          padding-left: 8px;
          outline: none;
          border: none;
          border-top-right-radius: 7px;
          border-bottom-right-radius: 7px;
          background-color: #40424C;
          color: #fff;
          caret-color: #fff;
          vertical-align: middle;
          resize: none;
        }
        .txt-area:focus {
          border: none;
          border-top-left-radius: 7px;
          border-bottom-left-radius: 7px;
          height: 70px;
        }
        .txt-area::-webkit-scrollbar {
          width: 5px;
          background-color: rgb(37, 35, 35, .8);
          border-radius: 8px;
        }
        .txt-area::-webkit-scrollbar-thumb {
          background-color: #ccc;
        }
      }
    }

    // 上传主体div
    .updata-container {
      position: relative;
      height: 75%;
      // 主体标题部分
      .updata-container-top {
        display: flex;
        width: 95%;
        margin: 0 auto;
        border-bottom: 1px solid #ccc;

        span {
          display: inline-block;
          width: 50%;
          height: 30px;
          line-height: 30px;
          font-size: 18px;
          color: #fff;
        }
      }

      // 主体上传部分
      .updata-container-main {
        width: 100%;
        height: calc(100% - 30px);
        display: flex;
        // 左边
        .updata-main-left {
          width: 50%;
          padding-top: 10px;
          // background-color: #fff;
          .image-upload::v-deep ul {
            padding-left: 2%;
            padding-right: 2%;
          }
          .video-cap-btn {
            margin-left: 10px;
            margin-top: 10px;
          }

        }

        // 右边
        .updata-main-right {
          width: 50%;
          // background-color: #ccc;
          border-left: 1px dashed #ccc;
          padding-top: 10px;
          .image-upload {
            position: relative;
          }
          .image-upload::v-deep ul {
            padding-left: 2%;
            padding-right: 2%;
          }
          .video-cap-btn {
            margin-left: 20px;
            margin-top: 20px;
          }
        }
        div.updata-main-special {
          width: 100%;
          .image-upload::v-deep ul {
            margin: 0 auto;
            width: 50%;
            padding-left: 2%;
            padding-right: 2%;
          }
        }
      }
    }

    // 底部确定、取消按钮
    .updata-footer {
      width: 95%;
      margin: 10px auto;
      padding-top: 10px;
      padding-right: 50px;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: flex-end;
    }
  }
}

// 上传封面el-upload修改默认样式
.image-upload::v-deep .el-upload--text,
.updata-main-right::v-deep .el-upload--text {
  width: 100%;
  margin-top: 25px;
}

.image-upload::v-deep .el-upload-dragger,
.updata-main-right::v-deep .el-upload-dragger {
  width: 90%;
  height: 250px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.1);
}
div.updata-main-special::v-deep .el-upload-dragger {
  width: 40%;
}
div.updata-main-special::v-deep .el-upload--text{
  width: 100%;
  margin-top: 25px;
}
div.updata-main-special::v-deep .el-upload__tip {
  width: 48%;
  margin: 0 auto;
}


#vd-container canvas {
  width: 50px!important;
  height: 50px!important;
}

.image-upload::v-deep .el-icon-video-camera {
  margin: 80px 0 16px;
}

.image-upload::v-deep .el-icon-headset {
  margin: 80px 0 16px;
}

.image-upload::v-deep .el-icon-upload,
.updata-main-right::v-deep .el-icon-upload {
  margin: 80px 0 16px;
}

.image-upload::v-deep .el-icon-headset,
.image-upload::v-deep .el-icon-video-camera {
  margin: 80px 0 16px;
  color: #ccc;
  font-size: 100px;
}

.image-upload::v-deep .el-upload__text,
.updata-main-right::v-deep .el-upload__text {
  color: #ccc;
  width: 100%;
  height: 100%;
}

.image-upload::v-deep .el-upload__tip,
.updata-main-right::v-deep .el-upload__tip {
  margin-left: 10px;
  color: #ccc;
}

.image-upload::v-deep .el-upload__text .el-image {
  width: 100%;
  height: 100%;
  // background-color: red;
}
</style>
