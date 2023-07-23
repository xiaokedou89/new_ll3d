<template>
  <div class="updata-vr main">
    <!-- 项目名称描述 -->
    <div class="updata-vr-title">
      <div class="updata-vr-title-item">
        <span>{{$t("projectName")}}</span>
        <el-tooltip effect="light" :content="getInputSize(uploadObj.name)" placement="top">
          <input v-model="uploadObj.name" :maxlength="inputLint" type="text">
        </el-tooltip>
      </div>
      <div class="updata-vr-title-item">
        <span>{{$t("projectDescription")}}</span>
        <el-tooltip effect="light" :content="getInputSize(uploadObj.description)" placement="top">
          <input v-model="uploadObj.description" :maxlength="inputLint" type="text">
        </el-tooltip>
      </div>
      <div class="updata-vr-title-item">
        <span>{{$t("projectTag")}}</span>
        <el-tooltip effect="light" :content="getInputSize(uploadObj.tag)" placement="top">
          <input v-model="uploadObj.tag" :maxlength="inputLint" type="text">
        </el-tooltip>
      </div>
     <div class="updata-vr-title-item">
           <span>类型</span> 
          <el-switch
            v-model="uploadObj.type"
            @change="changeType" 
            active-text="全景模型"
            inactive-text="全景球">
          </el-switch>
      </div>
    </div>
    <!-- 上传模型、封面 -->
    <div class="updata-container">
      <div class="updata-container-top">
        <span>{{$t("uploadModel")}}</span>
        <span>{{$t("uploadThumb")}}</span>
      </div>
      <div class="updata-container-main">
        <div class="updata-main-left">
          <table cellpadding="3">
            <tr>
              <td class="align-right">{{$t('model.requirements')}}{{$t('colon')}}</td>
              <td>{{$t("model.zipRequirements")}}{{$t("comma")}}{{$t("model.zipSize")}}</td>
            </tr>
            <tr>
              <td class="align-right">{{$t("model.modelFormat")}}{{$t("colon")}}</td>
              <td>{{$t("model.obj")}}{{$t("comma")}}{{$t("model.stl")}}{{$t("comma")}}{{$t("model.gltf")}}{{$t("comma")}}{{$t("model.fbx")}}{{$t("leftBracket")}}{{$t("model.objFormat")}}{{$t("comma")}}{{$t("model.stlFormat")}}{{$t("rightBracket")}}</td>
            </tr>
            <tr>
              <td class="align-right">{{$t("model.textureFormat")}}{{$t("colon")}}</td>
              <td>{{$t("model.jpeg")}}{{$t("comma")}}{{$t("model.jpg")}}{{$t("comma")}}{{$t("model.png")}}</td>
            </tr>
            <tr>
              <td class="align-right">{{$t("model.property")}}{{$t("colon")}}</td>
              <td>
                <ul>
                  <li>{{$t("model.nameRequirements")}}{{$t("comma")}}{{$t("model.notRequirements")}}</li>
                </ul>
              </td>
            </tr>
          </table>
          <div class="model-upload">
            <el-upload
                class="upload-model"
                :action="modelUrl"
                ref="upload"
                :multiple="false"
                accept=".zip"
                :file-list="uploadList"
                :limit="1"
                :auto-upload="false"
                :before-upload="modelBefUp"
                :on-success="modelUploadSuc"
                :before-remove="befRemoveModel"
                :on-exceed="exceedInfo"
            >
              <el-button class="btn-left" slot="trigger" size="small" type="primary">{{$t("model.selectModel")}}</el-button>
              <el-button class="btn-right" size="small" type="info" @click="submitUpload">{{$t("model.uploadServer")}}</el-button>
            </el-upload>
          </div>
        </div>
        <div class="updata-main-right">
          <el-upload
              ref="uploadImg"
              class="image-upload"
              :on-success="imgUploadSuc"
              :before-remove="befRemoveFace"
              :on-exceed="exceedInfo"
              accept="image/png, image/png, image/jpeg"
              drag
              :before-upload="imgBefUp"
              :limit="1"
              :action="imgUrl"
          >
            <i class="el-icon-upload" v-show="!faceFlag.flag"></i>
            <div class="el-upload__text" v-show="!faceFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
            <div class="el-upload__text" v-if="faceFlag.flag">
              <el-image
                  :src="getImgSrc(uploadObj.thumb)"
                  fit="scale-down"></el-image>
            </div>
            <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
          </el-upload>
        </div>
      </div>

    </div>
    <!-- 确定、取消 -->
    <div class="updata-footer">
      <el-button size="small" type="primary" @click="uploadModelObj">{{$t("confirm")}}</el-button>
      <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
    </div>
  </div>
</template>
<script>
import {globalUrl, image, common, filePrefix, inputLintSize, uploadFaceFile, uploadModel,uploadSkybox} from '@/utils/global'
import * as api from '@/api/vr/vr.js'
import * as skyboxApi from '@/api/skybox/skybox.js'
import * as fileApi from '@/api/file/file.js'
import Vue from 'vue'
import { modelUrl } from '../../../utils/global'
const defaultFlag = {
  flag: false,
  src: ''
}

export default {
  name: 'UpdataVR',
  data() {
    return {
      inputLint: inputLintSize,
      confirmFlag: false,
      modelUrl: uploadSkybox,
      imgUrl: uploadFaceFile,
      uploadList: [],
      uploadObj: {
        path: null,
        thumb: null,
        name: null,
        description: null,
        tag: null,
        type: 2,
        panoConfigId: null,
        createTime: null,
        type:false
      },
      faceFlag: Object.assign({}, defaultFlag)
    }
  },
  computed: {
    getImgSrc() {
      return function (src) {
        return filePrefix + image + src
      }
    },
    getInputSize() {
      return function (text) {
        return typeof text === 'object' ? `${this.$t("canInput")}${this.inputLint}${this.$t("inputSize")}` : `${this.$t("canInput")}${this.inputLint - text.length}${this.$t("inputSize")}`
      }
    }
  },
  methods: {
    exceedInfo() {
      this.$message({
        message: this.$t("deleteFileInfo"),
        type: 'warning',
        duration: 1500
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 上传模型上传前回调限制
    modelBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      console.log(textMsg)
      const extension = textMsg === 'zip'
      if (!extension) {
        this.$message({
          message: this.$t("zip.uploadRestrictions"),
          type: 'warning',
          duration: 1500
        })
      }
      return extension
    },
    // 上传封面上传前回调限制
    imgBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      console.log(textMsg)
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
    // 上传模型成功回调
    modelUploadSuc(res, file, fileList) {
      if (res.code === 50000) {
        this.uploadList = []
      }
      if (res.code === 20000 && res.data !== null) {
        if(this.uploadObj.type){
          const data = {
            modelName: res.data.modelName,
            mapName: res.data.mapName
          };
          this.uploadObj.path = JSON.stringify(data)
        }else{
          this.uploadObj.path=JSON.stringify(res.data.path)
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error',
          duration: 1500
        })
      }
    },
    // 上传封面成功回调
    imgUploadSuc(res, file, fileList) {
      console.log(res)
      if (res.code === 20000) {
        this.uploadObj.thumb = res.data.filename
        this.faceFlag.src = res.data.filename
        this.faceFlag.flag = true
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
    // 移除模型前回调
    befRemoveModel(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          fileApi.delFile('model', { filename: this.uploadObj.path})
              .then(res => {
                if (res.code === 20000) {
                  this.uploadObj.path = null
                  this.$message({
                    message: this.$t("deleteSuccess"),
                    type: 'success',
                    duration: 1500
                  })
                  resolve()
                } else {
                  this.$message({
                    message: this.$t("deleteFail"),
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
    // 移除封面前回调
    befRemoveFace(file) {
      if (file && file.status === "success") {
        return new Promise((resolve, reject) => {
          fileApi.delFile('common', { filename: this.uploadObj.thumb } )
              .then(res => {
                if (res.code === 20000) {
                  this.faceFlag = Object.assign({}, defaultFlag)
                  this.uploadObj.thumb = null
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
    // 点击确定事件上传全景模型对象
    uploadModelObj() {
      if (this.confirmFlag) {
        return
      }
      this.confirmFlag = true
      if (this.uploadObj.name === '' || this.uploadObj.name === null) {
        this.$message({
          message: this.$t("haveProjectName")+this.$t("comma")+this.$t("check"),
          type: 'warning',
          duration: 1500
        })
        this.confirmFlag = false
        return
      }
      if (this.uploadObj.path === '' || this.uploadObj.path === null) {
        this.$message({
          message: this.$t("model.pathText"),
          type: 'warning',
          duration: 1500
        })
        this.confirmFlag = false
        return
      }
      if (this.uploadObj.thumb === '' || this.uploadObj.thumb === null) {
        this.$message({
          message: this.$t("model.thumbText"),
          type: 'warning',
          duration: 1500
        })
        this.confirmFlag = false
        return
      }
      console.log(this.uploadObj)
      if(this.uploadObj.type){
        api.uploadVrObj(this.uploadObj)
            .then(res => {
              this.confirmFlag = false
              this.$message({
                message: this.$t("uploadSuccess"),
                type: 'success',
                duration: 1500
              })
              this.$router.push('/')
            })
            .catch(err => {
              this.confirmFlag = false
              this.$message({
                message: err,
                type: 'error',
                duration: 1500
              })
            })
      }else{
        skyboxApi.create(this.uploadObj).then(res=>{
          this.confirmFlag = false
              this.$message({
                message: this.$t("uploadSuccess"),
                type: 'success',
                duration: 1500
              })
              this.$router.push('/')
        }).catch(err=>{
          this.confirmFlag = false
              this.$message({
                message: err,
                type: 'error',
                duration: 1500
              })
        })
      }

    },
    // 点击取消事件
    cancelUpload() {
      this.$router.push('/')
    },
    changeType(){
      console.log('change type'+this.uploadObj.type)
      if(this.uploadObj.type){
        this.modelUrl=uploadModel
      }else{
        this.modelUrl=uploadSkybox
      }
    }
  }
}
</script>
<style lang="scss" scoped>
ul {
  padding: 0;
  margin: 0;
}

// 上传组件修改默认样式
.updata-container-main::v-deep .el-upload-list__item-name {
  color: #fff;
  font-size: 16px;
}
.updata-container-main::v-deep .el-icon-document {
  color: #fff;
}
.updata-container-main::v-deep .el-upload-list__item:hover {
  background-color: #ccc;
}
.updata-container-main::v-deep .el-upload-list__item:hover .el-upload-list__item-name {
  color: #409EFF;
}
.updata-container-main::v-deep .el-upload-list__item:hover .el-icon-document {
  color: #409EFF;
}

// 容器
.updata-vr {
  position: relative;
  width: 85%;
  height: 100%;
  margin: 0 auto;
  background-color: #363636;

  // 项目名称、描述
  .updata-vr-title {
    width: 100%;
    height: 100px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: rgba(54, 53, 53, 0.911);
    display: flex;
    align-items: center;

    .updata-vr-title-item {
      margin-left: 30px;
      span {
        display: inline-block;
        width: 75px;
        height: 35px;
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
    }
  }

  // 上传主体
  .updata-container {
    position: relative;
    height: 60%;
    // 标题
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

    // 内容
    .updata-container-main {
      width: 100%;
      height: 100%;
      // background-color: pink;
      display: flex;

      // 上传模型
      .updata-main-left {
        width: 50%;
        // background-color: red;
        table {
          color: #fff;
          width: 100%;
          height: 70%;
          padding-right: 40px;
          font-size: 14px;
          .align-right {
            text-align: right;
            width: 30%;
          }
        }
        .model-upload {
          padding-top: 10px;
          padding-left: 2%;
          padding-right: 2%;
          .btn-left {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .btn-right {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
      }

      // 上传封面
      .updata-main-right {
        width: 50%;
        border-left: 1px dashed #ccc;
        padding-top: 10px;
        .image-upload::v-deep ul {
          padding-left: 2%;
          padding-right: 2%;
        }
      }
    }
  }

  // 底部确定、取消按钮
  .updata-footer {
    width: 95%;
    margin: 45px auto;
    padding-top: 10px;
    padding-right: 50px;
    border-top: 1px solid #ccc;
    // background-color: pink;
    display: flex;
    justify-content: flex-end;
  }
}
// 上传封面el-upload修改默认样式
.updata-main-right::v-deep .el-upload--text {
  width: 100%;
  margin-top: 20px;
}

.updata-main-right::v-deep .el-upload-dragger {
  width: 90%;
  height: 250px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.1);
}

.updata-main-right::v-deep .el-icon-upload {
  margin: 80px 0 16px;
}

.updata-main-right::v-deep .el-upload__text {
  width: 100%;
  height: 100%;
  color: #ccc;
}
.updata-main-right::v-deep .el-upload__text .el-image {
  width: 100%;
  height: 100%;
}
.updata-main-right::v-deep .el-upload__tip {
  margin-left: 10px;
  color: #ccc;
}
.image-upload::v-deep ul {
  padding-left: 5%;
  padding-right: 5%;
}
</style>
