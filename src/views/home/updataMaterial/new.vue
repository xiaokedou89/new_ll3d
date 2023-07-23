<template>
  <div class="container container-padding main">
    <!-- tab选项卡 -->
    <el-tabs type="border-card">
      <!-- 上传图片选项卡 -->
      <el-tab-pane>
        <span slot="label">
          <i> {{$t("image.label")}}</i>
        </span>
        <!-- 上传图片选项卡主体部分 -->
        <div class="pane-body">
          <!-- 上传图片选项卡主体部分--输入框 -->
          <div class="pane-body-title">
            <div class="pane-body-title-item">
              <span>{{$t("image.label")}}</span>
              <el-tooltip effect="light" :content="getInputSize(imageObj.name)" placement="top">
                <input v-model="imageObj.name" :maxlength="inputLint" type="text">
              </el-tooltip>
            </div>
          </div>
          <!-- 上传图片选项卡主体部分--主体 -->
          <div class="updata-container">
            <!-- 上传图片选项卡主体部分--标题 -->
            <div class="updata-container-top">
              <span>{{$t("image.imgAndCover")}}</span>
            </div>
            <!-- 上传图片选项卡主体部分--内容 -->
            <div class="updata-container-main">
              <!-- 上传图片左 -->
              <div class="updata-main-left updata-main-special">
                <el-upload
                    ref="uploadImage"
                    class="image-upload"
                    :on-success="imageUploadSuc"
                    :before-upload="faceBefUp"
                    :before-remove="befRemoveImage"
                    :on-exceed="exceedInfo"
                    accept="image/png, image/png, image/jpeg"
                    drag
                    :limit="1"
                    :action="fileFacUrl"
                >
                  <i class="el-icon-upload" v-show="!imageFileFlag.flag"></i>
                  <div class="el-upload__text" v-show="!imageFileFlag.flag"> {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="imageFileFlag.flag">
                    <el-image
                        :src="getFacSrc(imageFileFlag.src)"
                        fit="scale-down"></el-image>
                  </div>
                  <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
                </el-upload>
              </div>
              <!-- 上传图片右 -->
              <!-- <div class="updata-main-right">
                <el-upload
                    ref="uploadImageFace"
                    class="image-upload"
                    :on-success="imageFaceUploadSuc"
                    :before-upload="faceBefUp"
                    :before-remove="befRemoveImageFace"
                    accept="image/png, image/png, image/jpeg"
                    drag
                    :limit="1"
                    :action="fileFacUrl"
                >
                  <i class="el-icon-upload" v-show="!imageFaceFlag.flag"></i>
                  <div class="el-upload__text" v-show="!imageFaceFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="imageFaceFlag.flag">
                    <el-image
                        :src="getFacSrc(imageFaceFlag.src)"
                        fit="scale-down"></el-image>
                  </div>
                  <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
                </el-upload>
              </div> -->
            </div>
          </div>
          <!-- 确定、取消 -->
          <div class="updata-footer">
            <el-button size="small" type="primary" @click="uploadMaterialObj(imageParams)">{{$t("confirm")}}</el-button>
            <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 上传视频选项卡 -->
      <el-tab-pane>
        <span slot="label">
          <i>{{$t("video.label")}}</i>
        </span>
        <!-- 上传视频选项卡主体部分 -->
        <div class="pane-body">
          <!-- 上传视频选项卡主体部分--输入框 -->
          <div class="pane-body-title">
            <div class="pane-body-title-item">
              <span>{{$t("video.label")}}</span>
              <el-tooltip effect="light" :content="getInputSize(videoObj.name)" placement="top">
                <input v-model="videoObj.name" :maxlength="inputLint" type="text">
              </el-tooltip>
            </div>
          </div>
          <!-- 上传视频选项卡主体部分--主体 -->
          <div class="updata-container">
            <!-- 上传视频选项卡主体部分--标题 -->
            <div class="updata-container-top">
              <span>{{$t("video.label")}}</span>
              <span>{{$t("video.thumb")}}</span>
            </div>
            <!-- 上传视频选项卡主体部分--内容 -->
            <div class="updata-container-main">
              <!-- 上传视频左 -->
              <div class="updata-main-left">
                <el-upload
                    ref="uploadVideo"
                    class="image-upload"
                    :on-success="videoUploadSuc"
                    :before-upload="videoBefUp"
                    :before-remove="befRemoveVideo"
                    :on-exceed="exceedInfo"
                    accept=".mp4"
                    drag
                    :limit="1"
                    :action="fileUrl"
                >
                  <i class="el-icon-upload" v-show="!videoFileFlag.flag"></i>
                  <div class="el-upload__text" v-show="!videoFileFlag.flag"> {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <video id="vd" v-if="videoFileFlag.flag" width="100%" height="100%" controls :src="getImgSrc(videoObj.path)"></video>
                  <div class="el-upload__tip" slot="tip">{{$t("video.uploadRestrictions")}}</div>
                </el-upload>
                <el-button class="video-cap-btn" v-if="videoFileFlag.flag" type="primary" size="small" @click="captureVideoFace">{{$t("video.captureVideoCover")}}</el-button>
              </div>
              <!-- 上传右 -->
              <div class="updata-main-right">
                <div class="image-upload">
                  <!-- 捕获视频截图前显示 -->
                  <div class="el-upload-dragger video-face" v-if="videoObj.path === null ? true : false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text"> {{$t("video.uploadVideoFirst")}}{{$t("comma")}}{{$t("space")}}{{$t("video.getThumb")}}</div>
                  </div>
                  <!-- 捕获视频截图后显示 -->
                  <div id="vd-container" class="el-upload-dragger video-face" v-else></div>
                  <el-button v-if="videoObj.path === null ? false : true" class="video-cap-btn" type="primary" size="small" @click="saveVideoFace">{{$t("video.saveVideoCover")}}</el-button>
                </div>
                <!-- <el-upload
                    ref="uploadVideoFace"
                    class="image-upload"
                    :on-success="videoFaceUploadSuc"
                    :before-upload="faceBefUp"
                    :before-remove="befRemoveVideoFace"
                    accept="image/png, image/png, image/jpeg"
                    drag
                    :limit="1"
                    :action="fileFacUrl"
                >
                  <i class="el-icon-upload" v-show="!videoFaceFlag.flag"></i>
                  <div class="el-upload__text" v-show="!videoFaceFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="videoFaceFlag.flag">
                    <el-image
                        :src="getFacSrc(videoFaceFlag.src)"
                        fit="scale-down"></el-image>
                  </div>
                  <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
                </el-upload> -->
              </div>
            </div>
          </div>
          <!-- 确定、取消 -->
          <div class="updata-footer">
            <el-button size="small" type="primary" @click="uploadMaterialObj(videoParams)">{{$t("confirm")}}</el-button>
            <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 上传音频选项卡 -->
      <el-tab-pane>
        <span slot="label">
          <i>{{$t("voice.label")}}</i>
        </span>
        <!-- 上传音频选项卡主体部分 -->
        <div class="pane-body">
          <!-- 上传音频选项卡主体部分--输入框 -->
          <div class="pane-body-title">
            <div class="pane-body-title-item">
              <span>{{$t("voice.name")}}</span>
              <el-tooltip effect="light" :content="getInputSize(musicObj.name)" placement="top">
                <input v-model="musicObj.name" :maxlength="inputLint" type="text">
              </el-tooltip>
            </div>
          </div>
          <!-- 上传音频选项卡主体部分--主体 -->
          <div class="updata-container">
            <!-- 上传音频选项卡主体部分--标题 -->
            <div class="updata-container-top">
              <span>{{$t("voice.label")}}</span>
              <span>{{$t("voice.thumb")}}</span>
            </div>
            <!-- 上传音频选项卡主体部分--内容 -->
            <div class="updata-container-main">
              <!-- 上传音频左 -->
              <div class="updata-main-left">
                <el-upload
                    ref="uploadMusic"
                    class="image-upload"
                    :on-success="musicUploadSuc"
                    :before-upload="musicBefUp"
                    :before-remove="befRemoveMusic"
                    :on-exceed="exceedInfo"
                    accept=".mp3"
                    drag
                    :limit="1"
                    :action="fileUrl"
                >
                  <i class="el-icon-upload" v-show="!musicFileFlag.flag"></i>
                  <div class="el-upload__text" v-show="!musicFileFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <i class="el-icon-headset" v-if="musicFileFlag.flag"></i>
                  <div class="el-upload__text" v-if="musicFileFlag.flag">{{ musicFileFlag.title }}</div>
                  <div class="el-upload__tip" slot="tip">{{$t("voice.uploadRestrictions")}}</div>
                </el-upload>
              </div>
              <!-- 上传音频右 -->
              <div class="updata-main-right">
                <el-upload
                    ref="uploadMusicFace"
                    class="image-upload"
                    :on-success="musicFaceUploadSuc"
                    :before-upload="faceBefUp"
                    :before-remove="befRemoveMusicFace"
                    :on-exceed="exceedInfo"
                    accept="image/png, image/png, image/jpeg"
                    drag
                    :limit="1"
                    :action="fileFacUrl"
                >
                  <i class="el-icon-upload" v-show="!musicFaceFlag.flag"></i>
                  <div class="el-upload__text" v-show="!musicFaceFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="musicFaceFlag.flag">
                    <el-image
                        :src="getFacSrc(musicFaceFlag.src)"
                        fit="scale-down"></el-image>
                  </div>
                  <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
                </el-upload>
              </div>
            </div>
          </div>
          <!-- 确定、取消 -->
          <div class="updata-footer">
            <el-button size="small" type="primary" @click="uploadMaterialObj(musicParams)">{{$t("confirm")}}</el-button>
            <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 上传模型选项卡 -->
      <el-tab-pane v-if="false">
        <span slot="label">
          <i> {{$t("model.label")}}</i>
        </span>
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
                <!-- 表格说明 -->
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
                      :limit="1"
                      :file-list="uploadList"
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
            <el-button size="small" type="primary" @click="uploadMaterialObj(modelParams)">{{$t("confirm")}}</el-button>
            <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  globalUrl,
  common,
  video,
  image,
  filePrefix,
  inputLintSize,
  textareaLintSize,
  uploadFaceFile, uploadModel, uploadFile
} from '@/utils/global'
import Vue from 'vue'
import * as api from '@/api/file/file'
import * as materialApi from '@/api/material/material'
import {base64ToFile} from "@/utils/imgUtils";
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
  name: null,
  path: null,
  thumb: null,
  description: null
}

export default {
  name: 'UpdataMaterial',
  data() {
    return {
      // 输入框默认限制的输入个数
      inputLint: inputLintSize,
      // 文本输入框默认限制的输入个数
      textareaLint: textareaLintSize,
      videoFace: null,
      saveVideoFaceFlag: false,
      uploadList: [],
      //上传模型url
      modelUrl: uploadModel,
      // 上传文件url
      fileUrl: uploadFile,
      fileFacUrl: uploadFaceFile,
      imageObj: Object.assign({}, defaultObj),
      videoObj: Object.assign({}, defaultObj),
      musicObj: Object.assign({}, defaultObj),
      modelObj: Object.assign({}, defaultModelObj),
      // 图片上传参数对象
      imageParams: {
        obj: null,
        type: 'image',
        nameText: this.$t("image.nameText"),
        pathText: this.$t("image.pathText"),
        thumbText: this.$t("image.thumbText"),
        flag: false
      },
      // 视频上传参数对象
      videoParams: {
        obj: null,
        type: 'video',
        nameText: this.$t("video.nameText"),
        pathText: this.$t("video.pathText"),
        thumbText: this.$t("video.thumbText"),
        flag: false
      },
      // 音频上传参数对象
      musicParams: {
        obj: null,
        type: 'voice',
        nameText: this.$t("voice.nameText"),
        pathText: this.$t("voice.pathText"),
        thumbText: this.$t("voice.thumbText"),
        flag: false
      },
      // 模型上传参数对象
      modelParams: {
        obj: null,
        type: 'model',
        nameText: this.$t("model.nameText"),
        pathText: this.$t("model.pathText"),
        thumbText: this.$t("model.thumbText"),
        flag: false
      },
      // 图片文件开关对象
      imageFileFlag: Object.assign({}, defaultFlagObj),
      // 图片封面开关对象
      imageFaceFlag: Object.assign({}, defaultFlagObj),
      // 视频文件开关对象
      videoFileFlag: Object.assign({}, defaultFileFlagObj),
      // 视频封面开关对象
      videoFaceFlag: Object.assign({}, defaultFlagObj),
      // 音频文件开关对象
      musicFileFlag: Object.assign({}, defaultFileFlagObj),
      // 音频封面开关对象
      musicFaceFlag: Object.assign({}, defaultFlagObj),
      // 模型封面开关对象
      modelFaceFlag: Object.assign({}, defaultFlagObj),
      //
    }
  },
  created() {
    Vue.set(this.modelParams, 'obj', this.modelObj)
    Vue.set(this.imageParams, 'obj', this.imageObj)
    Vue.set(this.videoParams, 'obj', this.videoObj)
    Vue.set(this.musicParams, 'obj', this.musicObj)
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
    exceedInfo() {
      this.$message({
        message: this.$t("deleteFileInfo"),
        type: 'warning',
        duration: 1500
      })
    },
    captureVideoFace() {
      let clearNode = null
      if (document.getElementsByTagName('canvas').length > 0) {
        clearNode = document.getElementsByTagName('canvas')[0]
        clearNode.parentNode.removeChild(clearNode)
      }
      const video = document.getElementById('vd')
      const container = document.getElementById('vd-container')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      container.appendChild(canvas)
      this.videoFace = canvas.toDataURL('image/png', 1)
    },
    saveVideoFace() {
      if (this.saveVideoFaceFlag) {
        return
      }
      this.saveVideoFaceFlag = true
      if (this.videoFace == null) {
        this.$message({
          message:this.$t("video.coverInfo"),
          type: 'warning',
          duration: 1500
        })
        this.saveVideoFaceFlag = false
        return
      }
      var file=base64ToFile(this.videoFace,this.videoObj.path.split('.')[0])
      api.uploadFace(file)
          .then(res => {
            if (res.code === 20000) {
              this.videoObj.thumb = res.data.filename
              this.saveVideoFaceFlag = false
              this.$message({
                message: this.$t("saveSuccess"),
                type: 'success',
                duration: 1500
              })
            }
          })
          .catch(err => {
            this.$message({
              message: err,
              type: 'error',
              duration: 1500
            })
            this.saveVideoFaceFlag = false
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
    // 上传视频前回调限制
    videoBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let extension
      if (textMsg === 'mp4') {
        extension = true
      } else {
        extension = false
      }
      if (!extension) {
        this.$message({
          message:this.$t("video.uploadRestrictions"),
          type: 'warning',
          duration: 1500
        })
      }
      return extension
    },
    // 上传音频前回调限制
    musicBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let extension
      if (textMsg === 'mp3') {
        extension = true
      } else {
        extension = false
      }
      if (!extension) {
        this.$message({
          message: this.$t("voice.uploadRestrictions"),
          type: 'warning',
          duration: 1500
        })
      }
      return extension
    },
    // 上传模型前回调限制
    modelBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
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
    // 上传模型至服务器提交事件
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 上传图片成功回调
    imageUploadSuc(res) {
      if (res.code === 20000) {
        this.imageObj.path = res.data.filename
        this.imageObj.thumb = res.data.thumbnail
        this.imageFileFlag.src = res.data.filename
        this.imageFileFlag.flag = true
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
    // 上传图片封面成功回调
    imageFaceUploadSuc(res) {
      if (res.code === 20000) {
        this.imageObj.thumb = res.data.filename
        this.imageFaceFlag.src = res.data.thumbnail
        this.imageFaceFlag.flag = true
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
    // 上传视频成功回调
    videoUploadSuc(res) {
      if (res.code === 20000) {
        this.videoObj.path = res.data.filename
        this.videoFileFlag.title = res.data.oldFilename
        this.videoFileFlag.flag = true
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
    // 上传视频封面成功回调
    // videoFaceUploadSuc(res) {
    //   if (res.code === 20000) {
    //     this.videoObj.thumb = res.data.filename
    //     this.videoFaceFlag.src = res.data.thumbnail
    //     this.videoFaceFlag.flag = true
    //     this.$message({
    //       message: '上传封面文件成功',
    //       type: 'success',
    //       duration: 1500
    //     })
    //   } else {
    //     this.$message({
    //       message: res.message,
    //       type: 'error',
    //       duration: 1500
    //     })
    //   }
    // },
    // 上传音频成功回调
    musicUploadSuc(res) {
      if (res.code === 20000) {
        this.musicObj.path = res.data.filename
        this.musicFileFlag.title = res.data.oldFilename
        this.musicFileFlag.flag = true
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
    // 上传音频封面成功回调
    musicFaceUploadSuc(res) {
      if (res.code === 20000) {
        this.musicObj.thumb = res.data.filename
        this.musicFaceFlag.src = res.data.thumbnail
        this.musicFaceFlag.flag = true
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
    // 上传模型成功回调
    modelUploadSuc(res, file, fileList) {
      if (res.code === 50000) {
        this.uploadList = []
      }
      if (res.code === 20000 && res.data !== null) {
        this.$message({
          message: this.$t("uploadSuccess"),
          type: 'success',
          duration: 1500
        })
        const data = {
          modelName: res.data.modelName,
          mapName: res.data.mapName
        };
        this.modelObj.path = JSON.stringify(data)
        Vue.set(this.modelObj, 'zipName', res.data.zipName)
      } else {
        this.$message({
          message: res.message,
          type: 'error',
          duration: 1500
        })
      }
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
    // 移除视频上传列表回调
    befRemoveVideo(file) {
      if (document.getElementsByTagName('canvas').length > 0) {
        const canvas = document.getElementsByTagName('canvas')[0]
        canvas.parentNode.removeChild(canvas)
      }
      this.videoFace = null
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('common', {filename: this.videoObj.path})
              .then(res => {
                if (res.code === 20000) {
                  this.videoFileFlag = Object.assign({}, defaultFileFlagObj)
                  this.videoObj.path = null
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
    // 移除视频封面图上传列表回调
    // befRemoveVideoFace(file) {
    //   if (file && file.status === 'success') {
    //     return new Promise((resolve, reject) => {
    //       api.delFile('image', {filename: this.videoObj.thumb})
    //           .then(res => {
    //             console.log(res)
    //             if (res.code === 20000) {
    //               this.videoFaceFlag = Object.assign({}, defaultFlagObj)
    //               this.videoObj.thumb = null
    //               this.$message({
    //                 message: '删除封面成功',
    //                 type: 'success',
    //                 duration: 1500
    //               })
    //               resolve()
    //             } else {
    //               this.$message({
    //                 message: res.message,
    //                 type: 'warning',
    //                 duration: 1500
    //               })
    //               reject()
    //             }
    //           })
    //           .catch(err => {
    //             this.$message({
    //               message: '删除封面失败，请稍后再试',
    //               type: 'warning',
    //               duration: 1500
    //             })
    //             reject()
    //           })
    //     })
    //   }
    // },
    // 移除音频上传列表回调
    befRemoveMusic(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('common', {filename: this.musicObj.path})
              .then(res => {
                if (res.code === 20000) {
                  this.musicFileFlag = Object.assign({}, defaultFileFlagObj)
                  this.musicObj.path = null
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
    // 移除音频封面图上传列表回调
    befRemoveMusicFace(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('image', {filename: this.musicObj.thumb})
              .then(res => {
                if (res.code === 20000) {
                  this.musicFaceFlag = Object.assign({}, defaultFlagObj)
                  this.musicObj.thumb = null
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
    // 移除模型上传列表的回调
    befRemoveModel(file) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('model', {filename: this.modelObj.zipName})
              .then(res => {
                if (res.code === 20000) {
                  this.modelObj.path = null
                  this.modelObj.zipName = null
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
    // 点击确定上传对象事件
    uploadMaterialObj(params) {
      if (params.flag) {
        return
      }
      params.flag = true
      if (params.obj.name === '' || params.obj.name === null) {
        this.$message({
          message: params.nameText,
          type: 'warning',
          duration: 1500
        })
        params.flag = false
        return
      }
      if (params.obj.path === '' || params.obj.path === null) {
        this.$message({
          message: params.pathText,
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
      materialApi.uploadVrMaterial(params.type, params.obj)
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
    },
    // 点击取消事件
    cancelUpload() {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
