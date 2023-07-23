<template>
  <div class="updata-material main">
    <!-- tab选项卡 -->
    <el-tabs type="border-card">
      <!-- 上传天空盒图片 -->
      <el-tab-pane>
        <span slot="label">
          <i>{{ $t('skyboxLabel') }}</i>
        </span>
        <!-- 主体部分 -->
        <div class="pane-body">
          <!-- 上传选项卡主体部分--输入框 -->
          <div class="pane-body-title">
            <div class="pane-body-title-item">
              <span>{{ $t('skyboxName')}}</span>
              <el-tooltip effect="light" :content="getInputSize(skyboxObj.name)" placemengt="top">
                <input v-model="skyboxObj.name" :maxlength="inputLint" type="text" />
              </el-tooltip>
            </div>
          </div>
          <!-- 上传天空盒图片选项卡主体部分--主体 -->
          <div class="updata-container">
            <!-- 上传图片选项卡主体部分--标题 -->
            <div class="updata-container-top">
              <span>{{ $t('image.imgAndCover') }}</span>
            </div>
            <!-- 选项卡主体部分--内容 -->
            <div class="updata-container-main">
              <div class="updata-main-left updata-main-special">
                <el-upload
                  ref="uploadSkybox"
                  class="image-upload"
                  :auto-upload="false"
                  accept="image/png, image/png, image/jpeg"
                  drag
                  :limit="1"
                  action="#"
                  :on-change="skyboxChange"
                >
                  <i class="el-icon-upload" v-show="!skyboxFileFlag.flag"></i>
                  <div class="el-upload__text" v-show="!skyboxFileFlag.flag"> {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="skyboxFileFlag.flag">
                    <el-image :src="skyboxFileFlag.src" fit="scale-down"></el-image>
                  </div>
                  <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
                </el-upload>
              </div>
            </div>
          </div>
          <!-- 确定、取消 -->
          <div class="updata-footer">
            <el-button size="small" type="primary" @click="uploadMaterialObj(skyboxParams)">{{$t("confirm")}}</el-button>
            <el-button size="small" type="info" @click="cancelUpload">{{$t("cancel")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
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
                <input v-model="imageObj.name" :maxlength="inputLint" type="text" />
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
                  :auto-upload="false"
                  :on-change="picchange"
                  accept="image/png, image/png, image/jpeg"
                  drag
                  :limit="1"
                  action="#"
                >
                  <i class="el-icon-upload" v-show="!imageFileFlag.flag"></i>
                  <div class="el-upload__text" v-show="!imageFileFlag.flag"> {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="imageFileFlag.flag">
                    <el-image
                      :src="imageFileFlag.src"
                      fit="scale-down">
                    </el-image>
                  </div>
                  <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
                </el-upload>
              </div>
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
<!--                   :on-success="videoUploadSuc"
                    :on-exceed="exceedInfo"-->
                <el-upload
                    ref="uploadVideo"
                    class="image-upload"
                    :auto-upload="false"
                    :on-change="videoChange"
                    accept=".mp4"
                    drag
                    :limit="1"
                    action="#"
                >
                  <i class="el-icon-upload" v-show="!videoFileFlag.flag"></i>
                  <div class="el-upload__text" v-show="!videoFileFlag.flag"> {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <video id="vd" v-if="videoFileFlag.flag" width="100%" height="100%" controls :src="videoFileFlag.src"></video>
                  <div class="el-upload__tip" slot="tip">{{$t("video.uploadRestrictions")}}</div>
                </el-upload>
                <el-button class="video-cap-btn" v-if="videoFileFlag.flag" type="primary" size="small" @click="captureVideoFace">{{$t("video.captureVideoCover")}}</el-button>
              </div>
              <!-- 上传右 -->
              <div class="updata-main-right">
                <div class="image-upload">
                  <!-- 捕获视频截图前显示 -->
                  <div class="el-upload-dragger video-face" v-if="videoFileFlag.src === null ? true : false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text"> {{$t("video.uploadVideoFirst")}}{{$t("comma")}}{{$t("space")}}{{$t("video.getThumb")}}</div>
                  </div>
                  <!-- 捕获视频截图后显示 -->
                  <div id="vd-container" class="el-upload-dragger video-face" v-else></div>
<!--                  <el-button v-if="videoObj.path === null ? false : true" class="video-cap-btn" type="primary" size="small" @click="saveVideoFace">{{$t("video.saveVideoCover")}}</el-button>-->
                </div>
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
                    :auto-upload="false"
                    :on-change="musicChange"
                    accept=".mp3"
                    drag
                    :limit="1"
                    action="#"
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
                    :auto-upload="false"
                    :on-change="musicFaceChange"
                    accept="image/png, image/png, image/jpeg"
                    drag
                    :limit="1"
                    action="#"
                >
                  <i class="el-icon-upload" v-show="!musicFaceFlag.flag"></i>
                  <div class="el-upload__text" v-show="!musicFaceFlag.flag">  {{$t("dragFile")}}{{$t("comma")}}{{$t("space")}}{{$t("or")}}<em>{{$t("space")}}{{$t("clickUpload")}}</em></div>
                  <div class="el-upload__text" v-if="musicFaceFlag.flag">
                    <el-image
                        :src="musicFaceFlag.src"
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
import {uploadFace} from "@/api/file/file";
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
      videoFaceFile:null,
      saveVideoFaceFlag: false,
      skyboxObj: Object.assign({}, defaultObj),
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
      skyboxParams: {
        obj: null,
        type: 'skybox',
        nameText: this.$t('skyboxNameText'),
        pathText: this.$t('skyboxPathText'),
        thumbText: this.$t('skyboxThumbText'),
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
      // 天空盒图片开关对象
      skyboxFileFlag: Object.assign({}, defaultFlagObj),
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
      //上传的天空盒图片文件
      skyboxFile: [],
      //上传的图片文件
      imgFile:[],
      // 上传的音频文件
      voiceFile:[],
      // 音频封面
      voiceThumb:[],
      // 上传的视频文件
      videoFile:[]
    }
  },
  created() {
    Vue.set(this.skyboxParams, 'obj', this.skyboxObj)
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
      const dataurl = canvas.toDataURL("image/png")
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.videoFaceFile = new File([u8arr], 'caputure.png', {type: mime});

      const that=this
      canvas.toBlob(function (blobObj) {
          that.videoFace = window.URL.createObjectURL(blobObj)
      })
    },
    picchange(file) {
      this.$refs.uploadImage.clearFiles()
      this.beforeUpload(file)
    },
    skyboxChange(file) {
      this.$refs.uploadSkybox.clearFiles();
      this.skyboxBeforeUpload(file);
    },
    skyboxBeforeUpload(file) {
      const that = this;
      const textMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      let extension;
      if (textMsg === 'jpg' || textMsg === 'png' || textMsg === 'jpeg') {
        extension = true
      } else {
        extension = false
      }
      // banner 图片尺寸校验
      if (!extension) {
        this.$message({
          message: this.$t('image.uploadRestrictions'),
          type: 'warning',
          duration: 1500
        })
      }
      console.log(file)
      new Promise(function(resolve, reject) {
        const img = new Image();
        let fileBlobName = that.getBlob(file);
        img.src = fileBlobName;
        img.onload = () => {
          that.skyboxFileFlag.src = fileBlobName;
          that.skyboxFileFlag.flag = true;
          that.skyboxFile = file.raw;
          resolve();
        };
      });
      return extension;
    },
    // 上传图片及封面前回调限制
    beforeUpload(file) {
      const that = this
      const textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let extension
      if (textMsg === 'jpg' || textMsg === 'png' || textMsg === 'jpeg') {
        extension = true
      } else {
        extension = false
      }
      // banner 图片尺寸校验
      if (!extension) {
        this.$message({
          message: this.$t('image.uploadRestrictions'),
          type: 'warning',
          duration: 1500
        })
      }
      new Promise(function(resolve, reject) {
        const img = new Image()
        let fileBlobName = that.getBlob(file)
        img.src=fileBlobName
        img.onload = () => {
            that.imageFileFlag.src = fileBlobName
            that.imageFileFlag.flag = true
            that.imgFile = file.raw
            resolve()
        }
      })
      return extension
    },
    videoChange(file) {
      this.$refs.uploadVideo.clearFiles()
      this.videoBefUp(file)
    },
    musicChange(file){
      this.$refs.uploadMusic.clearFiles(),
      this.musicBefUp(file)
    },
    musicFaceChange(file){
      this.$refs.uploadMusicFace.clearFiles()
      this.musicThumbBefUp(file)
    },
    // 上传音频封面校验
    musicThumbBefUp(file) {
      const that=this
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
      new Promise(function(resolve, reject) {
        const img = new Image()
        let fileBlobName = that.getBlob(file)
        img.src=fileBlobName
        img.onload = () => {
          that.musicFaceFlag.src = fileBlobName
          that.musicFaceFlag.flag = true
          that.voiceThumb = file.raw
          resolve()
        }
      })
      return extension
    },
    // 上传视频前回调限制
    videoBefUp(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const that=this
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
      new Promise(function(resolve, reject) {
        const video = document.createElement("video");
        let fileBlobName = that.getBlob(file)
        video.src=fileBlobName
        video.addEventListener('loadedmetadata', function () { //加载数据
          that.videoFileFlag.src = fileBlobName
          that.videoFileFlag.flag = true
          that.videoFile = file.raw
          resolve()
        });
      })
      return extension
    },
    // 上传音频前回调限制
    musicBefUp(file) {
      const that=this
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
      new Promise(function(resolve, reject) {
        const video = document.createElement("audio");
        let fileBlobName = that.getBlob(file)
        video.src=fileBlobName
        video.addEventListener('loadedmetadata', function () { //加载数据
          that.musicFileFlag.src = fileBlobName
          that.musicFileFlag.flag = true
          that.voiceFile = file.raw
          resolve()
        });
      })
      return extension
    },
    // 上传模型至服务器提交事件
    submitUpload() {
      this.$refs.upload.submit()
    },
    getBlob(file){
      let fileBlobName;
      if (window.createObjectURL !== undefined) {
        fileBlobName = window.createObjectURL(file.raw)
      } else if (window.URL !== undefined) {
        const binaryData = []
        binaryData.push(file)
        fileBlobName = window.URL.createObjectURL(file.raw)
      } else if (window.webkitURL !== undefined) {
        fileBlobName = window.webkitURL.createObjectURL(file.raw)
      }
      return fileBlobName
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
    uploadSkyboxBlob(params) {
      const that = this;
      return new Promise((resolve, reject) => {
        if (that.skyboxFile.length !== 0) {
          const formData = new FormData();
          formData.append('file', that.skyboxFile);
          api.uploadFile('skybox', formData)
            .then(res => {
              params.obj.path = res.data.path;
              params.obj.thumb = res.data.thumbnail;
              resolve();
            })
        }
      });
    },
    uploadImageBlob(params){
      const that=this
      return new Promise(function(resolve, reject) {
        // 上传图片
        if (that.imgFile.length !== 0) {
          // 赋值给formData
          const formData = new FormData()
          formData.append('file', that.imgFile)
          // 上传文件api
          api.uploadFile('image', formData).then(res => {
            params.obj.path = res.data.filename
            params.obj.thumb = res.data.thumbnail
            resolve()
          })
        }
      })
    },
    // 上传视频
    uploadVideoBlob(params){
      const that=this
      return new Promise(function(resolve, reject) {
        // 上传视频
        if (that.videoFile.length !== 0) {
          const formData = new FormData()
          formData.append('file', that.videoFile)
          // 上传文件api
          api.uploadFile('common', formData).then(res => {
            params.obj.path = res.data.filename
            resolve()
          })
        }
      })
    },
    // 上传视频封面
    uploadVideoThumbBlob(params) {
      const that = this
      return new Promise(function(resolve, reject) {
        if (that.videoFaceFile !==null) {
          const formData = new FormData()
          formData.append('file', that.videoFaceFile)
          // 上传、文件api
          api.uploadFile('image', formData).then(res => {
            params.obj.thumb = res.data.filename
            resolve()
          })
        }
      });
    },
    // 上传音频
    uploadVoiceBlob(params){
      const that = this
      return new Promise(function(resolve, reject) {
        if (that.voiceFile.length != 0) {
          // 赋值给formData
          const formData = new FormData()
          formData.append('file', that.voiceFile)
          // 上传文件api
          api.uploadFile('common', formData).then(res => {
            params.obj.path = res.data.filename
            resolve()
          })
        }
      });
    },
    // 上传音频封面
    uploadVoiceThumbBlob(params){
      const that = this
      return new Promise(function(resolve, reject) {
        if (that.voiceThumb!= null&& that.voiceThumb.size!=0) {
          const formData = new FormData()
          formData.append('file', that.voiceThumb)
          // 上传文件api
          // api.uploadFile('common', formData).then(res => {
          //   params.obj.thumb = res.data.filename
          //   resolve()
          // })
          api.uploadFile('image', formData).then(res => {
            params.obj.thumb = res.data.filename;
            resolve();
          })
        }else {
          reject()
        }
      });
    },
    // 点击确定上传对象事件
    async uploadMaterialObj(params) {
      const that=this
      if (params.flag) {
        return
      }
      params.flag = true
      if (params.type == 'skybox') {
        this.uploadSkyboxBlob(params)
          .then(res => {
            params.type = 'vrPanormaImage'
            that.submitForm(params)
          })
      }
      if(params.type=='image'){
         this.uploadImageBlob(params).then(res=>{
           that.submitForm(params)
         })
      }
      if(params.type=='voice'){
        Promise.all([this.uploadVoiceThumbBlob(params),this.uploadVoiceBlob(params)]).then(res=>{
           that.submitForm(params)
        })
      }
      if(params.type=='video'){
        Promise.all([this.uploadVideoThumbBlob(params),this.uploadVideoBlob(params)]).then(res=>{
          that.submitForm(params)
        })
      }

    },
    submitForm(params){
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
ul {
  padding: 0;
  margin: 0;
}


.updata-material {
  position: relative;
  width: 85%;
  // height: 100%;
  margin: 0 auto;
  // background-color: #363636;
  // 选项卡主体部分
  .pane-body {
    width: 100%;
    // height: 100%;
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
      // height: 75%;
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
          // padding-top: 10px;
          padding: 20px;
          .image-upload::v-deep ul {
            padding-left: 2%;
            padding-right: 2%;
          }
          .video-cap-btn {
            margin-left: 10px;
            margin-top: 10px;
          }
          // 上传模型表格
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

        }

        // 右边
        .updata-main-right {
          width: 50%;
          border-left: 1px dashed #ccc;
          // padding-top: 10px;
          padding: 20px;
          .image-upload {
            position: relative;
            width: 100%;
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

@media (max-width: 800px) {
  .updata-material .pane-body .pane-body-title {
    flex-direction: column;
    justify-content: space-around;
    .pane-body-title-item {
      width: 100%;
      margin: 0;
      input {
        width: calc(100% - 75px);
      }
    }
  }
  .updata-material .pane-body .updata-container .updata-container-main .updata-main-left,
  .updata-material .pane-body .updata-container .updata-container-main .updata-main-right {
    padding: 0;
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
//
.updata-main-right::v-deep div.video-face {
  margin-top: 25px;
  position: relative;
  canvas {
    width: auto;
    height: 100%;
  }
}
.image-upload div.video-face-cap {
  width: 100%;
  height: 380px;
  display: flex;
}
.image-upload div.video-face-cap .video-face-cap-container {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.image-upload div.video-face-cap .video-face-cap-canvas {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.image-upload div.video-face-cap .video-face-cap-canvas .canvas-container {
  width: 95%;
  height: 150px;
  border: 1px dashed #ccc;
  border-radius: 10px;
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

// 选项卡默认样式修改
.el-tabs {
  border: 0;
  height: 100%;
}

.updata-material .el-tabs::v-deep .el-tabs__header {
  border: 0;
  height: 39px;
  background-color: rgb(68, 67, 67);
}

.el-tabs::v-deep .el-tabs__item {
  background-color: #363636;
  border: 1px solid rgb(155, 155, 155);
  color: #fff;
}

.el-tabs::v-deep .el-tabs__item.is-active {
  // background-color: #414247;
  background-color: #57585f;
  color: rgb(233, 150, 5);
  border: 1px solid #34353a;
}

// 选项卡主体部分
.el-tabs::v-deep .el-tabs__content {
  background-color: #363636;
  height: calc(100% - 39px);
  padding: 0;
}

.el-tabs::v-deep .el-tabs__content .el-tab-pane {
  width: 100%;
  height: 100%;
}
</style>
