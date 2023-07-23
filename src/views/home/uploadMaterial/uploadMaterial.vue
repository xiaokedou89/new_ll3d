<template>
  <div class="main container container-padding">
    <!-- 内层主要内容容器 -->
    <div class="upload-container">
      <!-- 左边选择上传素材类别部分 -->
      <div class="upload-type">
        <el-radio v-model="uploadType" :disabled="changeTypeDisabled" :label="item.value" v-for="(item, index) in uploadMaterialTypes" :key="index">
          <span>{{ item.name }}</span>
        </el-radio>
      </div>
      <!-- 右边上传编辑主体部分 -->
      <div class="upload-content">
        <!-- 天空盒图片 -->
        <div class="upload-main">
          <!-- 标题部分 -->
          <h1 class="upload-title">{{ uploadTitle }}</h1>
          <!-- 上传编辑主体部分--天空盒图片 -->
          <div class="upload-center" v-if="uploadType === SkyboxMaterial">
            <el-form 
              ref="skyboxForm" 
              class="upload-form" 
              :model="skyboxObj.data" 
              :rules="rules" 
              size="small"
              label-position="top"
            >
              <el-form-item :label="$t('name') + '：'" prop="name">
                <el-input v-model="skyboxObj.data.name" :maxlength="inputLintSize" :placeholder="$t('image.namePlace')" />
              </el-form-item>
              <el-form-item :label="$t('skyboxPath') + '：'" prop="path">
                <el-upload
                  ref="skyboxFile"
                  class="thumb-upload"
                  :accept="skyboxObj.pathAccept"
                  :limit="1"
                  :action="filePath"
                  :headers="headers"
                  :before-upload="fileBeforeUpload"
                  :on-progress="fileOnProgress"
                  :on-success="fileSuc"
                  :on-error="fileFail"
                  :on-remove="fileRemove"
                  :show-file-list="skyboxObj.showFileFlag"
                >
                  <div class="image-container">
                    <div class="image-empty" v-if="!skyboxObj.data.path">
                      <i class="image-empty-icon el-icon-upload"></i>
                      <span class="thumb-empty-text">{{ $t('clickUpload') }}</span>
                    </div>
                    <el-image v-else class="imageFile" fit="cover" :src="getSkyboxSrc(skyboxObj.data.thumb)"></el-image>
                  </div>
                </el-upload>
              </el-form-item> 
            </el-form>
          </div>
          <!-- 上传编辑主体部分--图片 -->
          <div class="upload-center" v-else-if="uploadType === ImageMaterial">
            <el-form 
              ref="imageForm" 
              class="upload-form" 
              :model="imageObj.data" 
              :rules="rules" 
              size="small"
              label-position="top"
            >
              <el-form-item :label="$t('name') + '：'" prop="name">
                <el-input v-model="imageObj.data.name" :maxlength="inputLintSize" :placeholder="$t('image.namePlace')" />
              </el-form-item>
              <el-form-item :label="$t('skyboxPath') + '：'" prop="path">
                <el-upload
                  ref="imageFile"
                  :accept="imageObj.pathAccept"
                  :limit="1"
                  :action="filePath"
                  :headers="headers"
                  :before-upload="fileBeforeUpload"
                  :on-progress="fileOnProgress"
                  :on-success="fileSuc"
                  :on-error="fileFail"
                  :on-remove="fileRemove"
                  :show-file-list="imageObj.showFileFlag"
                >
                  <div class="image-container">
                    <div class="image-empty" v-if="!imageObj.data.path">
                      <i class="image-empty-icon el-icon-upload"></i>
                      <span class="thumb-empty-text">{{ $t('clickUpload') }}</span>
                    </div>
                    <el-image v-else class="imageFile" fit="cover" :src="getImageSrc(imageObj.data.thumb)">
                    </el-image>
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <!-- 上传编辑主体部分--视频 -->
          <div class="upload-center" v-else-if="uploadType === VideoMaterial">
            <el-form 
              ref="videoForm" 
              class="upload-form" 
              :model="videoObj.data" 
              :rules="rules" 
              size="small"
              label-position="top"
            >
              <el-form-item :label="$t('name') + '：'" prop="name">
                <el-input v-model="videoObj.data.name" :maxlength="inputLintSize" :placeholder="$t('video.namePlace')" />
              </el-form-item>
              <el-form-item :label="$t('videoAndThumb') + '：'">
                <div class="video-container">
                  <!-- 左边的视频上传 -->
                  <div class="video-upload">
                    <!-- 定位宽高的内层容器-相对定位 -->
                    <div class="video-upload-inner">
                      <!-- 上面的文字说明 || 视频部分 -->
                      <div class="video-upload-inner-top">
                        <p v-if="!videoObj.data.path">{{ $t('videoUploadDes') }}</p>
                        <video 
                          id="vd"
                          ref="vd" 
                          v-else 
                          width="100%" 
                          height="100%" 
                          controls
                          :src="getVideoSrc(videoObj.data.path)"
                        ></video>
                      </div>
                      <!-- 下面的上传按钮 || 截取封面按钮 -->
                      <div class="video-upload-inner-bottom">
                        <el-upload
                          ref="videoFile"
                          class="video-uploader"
                          :accept="videoObj.pathAccept"
                          :limit="1"
                          :action="filePath"
                          :headers="headers"
                          :before-upload="fileBeforeUpload"
                          :on-progress="fileOnProgress"
                          :on-success="fileSuc"
                          :on-error="fileFail"
                          :on-remove="fileRemove"
                          :show-file-list="videoObj.showFileFlag"
                          :disabled="!!videoObj.data.path"
                        >
                          <button type="button" class="btn confirmBtn" @click="delVideo">{{ getUploadVideoBtn }}</button>
                          <button v-if="videoObj.data.path" type="button" class="btn confirmBtn" @click="captureVideoFace">{{ $t('capThumb') }}</button>
                        </el-upload>
                        
                      </div>
                    </div>
                  </div>
                  <!-- 截取的视频封面 -->
                  <div class="video-thumb" v-show="!!videoObj.data.thumb">
                    <!-- 定位宽高的内层容器-相对定位 -->
                    <div class="video-thumb-inner">
                      <!-- 上面截取的视频截图封面 -->
                      <div class="video-thumb-inner-top" ref="thumbContainer">
                        <el-image class="imageFile" fit="cover" :src="getImageSrc(videoObj.data.thumb)"></el-image>
                      </div>
                      <!-- 下面的文字说明 -->
                      <div class="video-thumb-inner-bottom">
                        <p>{{ $t('videoThumb') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 上传编辑主体部分--音频 -->
          <div class="upload-center" v-else>
            <el-form 
              ref="voiceForm" 
              class="upload-form" 
              :model="voiceObj.data" 
              :rules="rules" 
              size="small"
              label-position="top"
            >
              <el-form-item :label="$t('name') + '：'" prop="name">
                <el-input v-model="voiceObj.data.name" :maxlength="inputLintSize" :placeholder="$t('voice.namePlace')" />
              </el-form-item>
              <!-- 上传音频封面图 -->
              <el-form-item :label="$t('thumbUpload') + '：'">
                <el-upload
                  ref="voiceThumbFile"
                  :accept="imageObj.pathAccept"
                  :limit="1"
                  :action="imagePath"
                  :headers="headers"
                  :before-upload="thumbBeforeUpload"
                  :on-progress="thumbOnProgress"
                  :on-success="thumbSuc"
                  :on-error="thumbFail"
                  :on-remove="thumbRemove"
                  :show-file-list="voiceObj.thumbShowFileFlag"
                >
                  <div class="image-container">
                    <div class="image-empty" v-if="!voiceObj.data.thumb">
                      <i class="image-empty-icon el-icon-upload"></i>
                      <span class="thumb-empty-text">{{ $t('clickUpload') }}</span>
                    </div>
                    <el-image v-else class="imageFile" fit="cover" :src="getImageSrc(voiceObj.data.thumb)">
                    </el-image>
                  </div>
                </el-upload>
              </el-form-item>
              <!-- 上传音频文件 -->
              <el-form-item :label="$t('uploadMusic') + '：'">
                <div class="video-container">
                  <div class="video-upload" :class="{noPath: !voiceObj.data.path}">
                    <div class="video-upload-inner" :class="{noPath: !voiceObj.data.path}">
                      <!-- 上面的显示音频部分 -->
                      <div class="video-upload-inner-top">
                        <el-image class="musicDefault" fit="contain" :src="musicDefault"></el-image>
                        <audio v-if="!!voiceObj.data.path" :src="getVoiceSrc(voiceObj.data.path)" controls></audio>
                      </div>
                      <!-- 下面的上传部分 -->
                      <div class="video-upload-inner-bottom">
                        <el-upload
                          ref="voiceFile"
                          :accept="voiceObj.pathAccept"
                          :limit="1"
                          :action="filePath"
                          :headers="headers"
                          :before-upload="fileBeforeUpload"
                          :on-progress="fileOnProgress"
                          :on-success="fileSuc"
                          :on-error="fileFail"
                          :on-remove="fileRemove"
                          :show-file-list="voiceObj.showFileFlag"
                          :disabled="!!voiceObj.data.path"
                        >
                          <button type="button" class="btn confirmBtn" @click="delVoice">{{ getUploadVoiceBtn }}</button>
                        </el-upload>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 底部的按钮 -->
          <div class="upload-footer">
            <button type="button" class="btn confirmBtn footer-btn" :disabled="!uploadObj.data.path" @click="confirmUpload">{{ $t('upload') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SkyboxMaterial,
  ImageMaterial,
  VideoMaterial,
  MusicMaterial,
  uploadMaterialTypes,
  inputLintSize,
  // 图片和封面图的上传path直接用
  uploadFaceFile,
  // skybox、视频、音频的path需要拼接type
  fileUploadPath,
  filePrefix,
  skyBoxUrl,
  image,
  video,
  music,
  // 验证中文符号文件名正则
  chineseSignReg,
  // 图片上传大小限制
  imageUploadLint,
  // 视频上传大小限制
  videoUploadLint,
  // 音频上传大小限制
  voiceUploadLint
} from '@/utils/global.js';
import * as rule from '@/utils/rules.js';
import * as api from '@/api/material/material.js';
import { delFile, uploadFile } from '@/api/file/file.js';
import { getToken } from '@/utils/storage.js';
import { i18n } from '@/assets/languages/i18n.js';

const rules = {
  name: rule.requiredRules
};

const defaultObj = {
  name: '',
  path: null,
  thumb: null,
  thumbFileName: null
};

export default {
  name: 'UpdataModel',
  data() {
    return {
      rules,
      inputLintSize,
      // 四个类型判断常量
      SkyboxMaterial,
      ImageMaterial,
      VideoMaterial,
      MusicMaterial,
      // 上传表单绑定对象
      skyboxObj: {
        data: Object.assign({}, defaultObj),
        pathAccept: 'image/png, image/jpg, image/jpeg',
        type: 'skybox',
        showFileFlag: false,
        progress: false,
        flag: false,
        typeWarning: i18n.t('image.typeWarning'),
        dom: null
      },
      imageObj: {
        data: Object.assign({}, defaultObj),
        pathAccept: 'image/png, image/jpg, image/jpeg',
        type: 'image',
        showFileFlag: false,
        progress: false,
        flag: false,
        typeWarning: i18n.t('image.typeWarning'),
        dom: null
      },
      videoObj: {
        data: Object.assign({}, defaultObj),
        pathAccept: '.mp4',
        type: 'video',
        showFileFlag: false,
        progress: false,
        flag: false,
        typeWarning: i18n.t('video.typeWarning'),
        capFlag: false,
        delFlag: false,
        dom: null
      },
      voiceObj: {
        data: Object.assign({}, defaultObj),
        pathAccept: '.mp3',
        type: 'voice',
        showFileFlag: false,
        progress: false,
        flag: false,
        typeWarning: i18n.t('voice.typeWarning'),
        delFlag: false,
        thumbAccept: 'image/png, image/jpg, image/jpeg',
        thumbShowFileFlag: false,
        thumbProgress: false,
        dom: null,
        thumbDom: null
      },
      uploadObj: null,
      // 上传封面图的path
      imagePath: uploadFaceFile,
      // 上传主文件的path
      filePath: '',
      // 上传文件的请求头配置
      headers: {},
      // 左边选择上传类型绑定数组
      uploadMaterialTypes,
      // 当前选择的上传类型绑定值
      uploadType: SkyboxMaterial,
      // 禁用切换类型开关
      changeTypeDisabled: false,
      // 右边的标题
      uploadTitle: uploadMaterialTypes[0].title,
      musicDefault: require('@/assets/default/music.png')
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.uploadObj.dom = this.$refs['skyboxFile'];
  },
  updated() {
    switch (this.uploadType){
      case this.SkyboxMaterial:
        this.skyboxObj.dom = this.$refs.skyboxFile;
        break;
      case this.ImageMaterial:
        this.imageObj.dom = this.$refs.imageFile;
        break;
      case this.VideoMaterial:
        this.videoObj.dom = this.$refs.videoFile;
        break;
      default:
        this.voiceObj.dom = this.$refs.voiceFile;
        this.voiceObj.thumbDom = this.$refs.voiceThumbFile;
    }
    
  },
  computed: {
    // 获取天空盒文件
    getSkyboxSrc() {
      return function (src) {
        return src ? `${filePrefix}${skyBoxUrl}${src}` : require('@/assets/default/image.png');
      }
    },
    // 获取图片文件
    getImageSrc() {
      return function (src) {
        return src ? `${filePrefix}${image}${src}` : require('@/assets/default/image.png');
      }
    },
    // 获取视频文件
    getVideoSrc() {
      return function (src) {
        return `${filePrefix}${video}${src}`;
      }
    },
    // 获取音频文件
    getVoiceSrc() {
      return function (src) {
        return `${filePrefix}${music}${src}`;
      }
    },
    // 获取上传视频按钮文字
    getUploadVideoBtn() {
      return this.videoObj.data.path ? this.$t('delete') : this.$t('selectFile');
    },
    // 获取上传音频按钮文字
    getUploadVoiceBtn() {
      return this.voiceObj.data.path ? this.$t('delete') : this.$t('selectFile');
    }
  },
  watch: {
    uploadType(value) {
      const uploadTypeObj = this.uploadMaterialTypes.find(item => {
        return item.value === value;
      });
      // 更右边标题部分
      this.uploadTitle = uploadTypeObj.title;
      // 更改path上传路径
      switch (value){
        case SkyboxMaterial:
          this.filePath = `${fileUploadPath}${this.skyboxObj.type}`;
          this.uploadObj = this.skyboxObj;
          break;
        case ImageMaterial:
          this.filePath = this.imagePath;
          this.uploadObj = this.imageObj;
          break;
        case VideoMaterial:
          this.filePath = `${fileUploadPath}${this.videoObj.type}`;
          this.uploadObj = this.videoObj;
          break;
        case MusicMaterial:
          this.filePath = `${fileUploadPath}${this.voiceObj.type}`;
          this.uploadObj = this.voiceObj;
          break;
      }
    }
  },
  methods: {
    // 初始化回调
    init() {
      this.getToken();
      this.uploadObj = this.skyboxObj;
      this.filePath = `${fileUploadPath}${this.skyboxObj.type}`;
    },
    // 获取上传文件token
    getToken() {
      this.$store.getters.token && (this.headers['authorization'] = getToken());
    },
    thumbBeforeUpload(file) {
      if (this.voiceObj.thumbProgress) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.voiceObj.thumbProgress;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          size = file.size,
          name = file.name,
          extensionFlag = (extension === 'jpg' || extension === 'png' || extension === 'jpeg') && size <= imageUploadLint && !chineseSignReg.test(name) ? true : false;
      if (!extensionFlag) {
        this.$message({
          message: this.uploadObj.typeWarning,
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    thumbOnProgress() {
      this.voiceObj.thumbShowFileFlag = true;
      this.voiceObj.thumbProgress = true;
    },
    thumbSuc(e) {
      this.voiceObj.thumbProgress = false;
      this.voiceObj.thumbShowFileFlag = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('uploadSuccess'),
          type: 'success',
          duration: 1500
        });
        if (this.voiceObj.data.thumb) {
          delFile('image', {
            filename: this.voiceObj.data.thumb
          })
        }
        if (this.voiceObj.data.thumbFileName) {
          delFile('image', {
            filename: this.voiceObj.data.thumbFileName
          })
        }
        // 判断是否删除之前的封面
        this.voiceObj.data.thumb = e.data.thumbnail;
        this.voiceObj.data.thumbFileName = e.data.filename;
      } else {
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
      this.voiceObj.thumbDom.clearFiles();
    },
    thumbFail(e) {
      this.voiceObj.thumbProgress = false;
      this.voiceObj.thumbShowFileFlag = false;
      this.$message({
        message: e.message || this.$t('uploadFailWarn'),
        type: 'error',
        duration: 1500
      });
    },
    thumbRemove() {
      this.voiceObj.thumbProgress = false;
    },
    // 文件path的上传前文件校验回调
    fileBeforeUpload(file) {
      if (this.uploadObj.progress) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.uploadObj.progress;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          size = file.size,
          name = file.name,
          extensionFlag;
      if (this.uploadType === this.SkyboxMaterial || this.uploadType === ImageMaterial) {
        extensionFlag = (extension === 'jpg' || extension === 'png' || extension === 'jpeg') && size <= imageUploadLint && !chineseSignReg.test(name) ? true : false;
      } else if (this.uploadType === this.VideoMaterial) {
        extensionFlag = (extension === 'mp4') && size <= videoUploadLint && !chineseSignReg.test(name) ? true : false;
      } else {
        extensionFlag = (extension === 'mp3') && size <= voiceUploadLint && !chineseSignReg.test(name) ? true : false;
      }
      if (!extensionFlag) {
        this.$message({
          message: this.uploadObj.typeWarning,
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    fileOnProgress() {
      this.uploadObj.showFileFlag = true;
      this.uploadObj.progress = true;
    },
    fileSuc(e) {
      this.uploadObj.progress = false;
      this.uploadObj.showFileFlag = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('uploadSuccess'),
          type: 'success',
          duration: 1500
        });
        this.uploadObj.data.path && (this.delCallback(this.uploadObj));
        if (this.uploadType === this.SkyboxMaterial) {
          this.uploadObj.data.path = e.data.path;
          this.uploadObj.data.thumb = e.data.thumbnail;
        } else if (this.uploadType === this.ImageMaterial) {
          this.uploadObj.data.path = e.data.filename;
          this.uploadObj.data.thumb = e.data.thumbnail;
        } else if (this.uploadType === this.VideoMaterial || this.uploadType === this.MusicMaterial) {
          this.uploadObj.data.path = e.data.filename;
        }
      } else {
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
      this.uploadObj.dom.clearFiles();
    },
    fileFail(e) {
      this.uploadObj.progress = false;
      this.uploadObj.showFileFlag = false;
      this.$message({
        message: e.message || this.$t('uploadFailWarn'),
        type: 'error',
        duration: 1500
      });
    },
    fileRemove() {
      this.uploadObj.progress = false;
    },
    // 删除文件回调
    delCallback(obj) {
      delFile(obj.type, {
        filename: obj.data.path
      })
        .then(res => {
          console.log('del file')
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 点击删除视频按钮
    delVideo() {
      if (!this.videoObj.data.path) {
        return;
      }
      if (this.videoObj.delFlag) {
        return;
      }
      this.videoObj.delFlag = true;
      delFile(this.videoObj.type, {
        filename: this.videoObj.data.path
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('delSuc'),
              type: 'success',
              duration: 1500
            });
            if (this.videoObj.data.thumb) {
              delFile('image', {
                filename: this.videoObj.data.thumb
              })
            }
            if (this.videoObj.data.thumbFileName) {
              delFile('image', {
                filename: this.videoObj.data.thumbFileName
              })
            }
            this.videoObj.data.path = null;
            this.videoObj.data.thumb = null;
            this.videoObj.data.thumbFileName = null;
          } else {
            this.$message({
              message: this.$t('delFail'),
              type: 'error',
              duration: 1500
            });
          }
          this.videoObj.delFlag = false;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('delFail'),
            type: 'error',
            duration: 1500
          });
          this.videoObj.delFlag = false;
        })
    },
    // 点击截取视频封面
    captureVideoFace() {
      if (this.videoObj.capFlag) {
        return;
      }
      this.videoObj.capFlag = true;
      let clearNode = null;
      if (document.getElementsByTagName('canvas').length > 0) {
        clearNode = document.getElementsByTagName('canvas')[0];
        clearNode.parentNode.removeChild(clearNode);
      }
      const video = this.$refs.vd,
            container = this.$refs.thumbContainer,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'none';
      ctx.drawImage(video, 0, 0);
      container.appendChild(canvas);
      // ===
      const dataurl = canvas.toDataURL("image/png")
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      console.log(new File([u8arr], 'caputure.png', {type: mime}));
      // let file = new File([u8arr], 'caputure.png', {type: mime})
      const formData = new FormData();
      formData.append('file', new File([u8arr], 'caputure.png', {type: mime}));
      uploadFile('image', formData)
        .then(res => {
          console.log(res);
          if (res.code === 20000) {
            if (this.videoObj.data.thumb) {
              delFile('image', {
                filename: this.videoObj.data.thumb
              })
            }
            if (this.videoObj.data.thumbFileName) {
              delFile('image', {
                filename: this.videoObj.data.thumbFileName
              })
            }
            this.$message({
              message: this.$t('capVideoThumbSuc'),
              type: 'success',
              duration: 1500
            });
            this.videoObj.data.thumb = res.data.thumbnail;
            this.videoObj.data.thumbFileName = res.data.filename;
          } else {
            this.$message({
              message: this.$t('capVideoThumbFail'),
              type: 'error',
              duration: 1500
            });
          }
          this.videoObj.capFlag = false;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('capVideoThumbFail'),
            type: 'error',
            duration: 1500
          });
          this.videoObj.capFlag = false;
        });
    },
    // 上传音频点击删除
    delVoice() {
      if (!this.voiceObj.data.path) {
        return;
      }
      if (this.voiceObj.delFlag) {
        return;
      }
      this.voiceObj.delFlag = true;
      delFile(this.voiceObj.type, {
        filename: this.voiceObj.data.path
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('delSuc'),
              type: 'success',
              duration: 1500
            });
            this.voiceObj.data.path = null;
          } else {
            this.$message({
              message: this.$t('delFail'),
              type: 'error',
              duration: 1500
            });
          }
          this.voiceObj.delFlag = false;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('delFail'),
            type: 'error',
            duration: 1500
          });
          this.voiceObj.delFlag = false;
        });
    },
    // 点击下面的上传按钮
    confirmUpload() {
      if (!this.uploadObj.data.path) {
        this.$message({
          message: this.$t('uploadPathWarn'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      if (!this.uploadObj.data.thumb) {
        this.$message({
          message: this.$t('uploadThumbWarn'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.uploadObj.flag = true;
      this.$refs[`${this.uploadObj.type}Form`].validate(valid => {
        if (valid) {
          let type = this.uploadObj.type === 'skybox' ? 'vrPanormaImage' : this.uploadObj.type;
          api.uploadVrMaterial(type, this.uploadObj.data)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('uploadMaterialSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.$router.push('/');
              } else {
                this.$message({
                  message: this.$t('uploadMaterialFail'),
                  type: 'error',
                  duration: 1500
                });
              }
              this.uploadObj.flag = false;
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('uploadMaterialFail'),
                type: 'error',
                duration: 1500
              });
              this.uploadObj.flag = false;
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.uploadObj.flag = false;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';
// 外层总容器flex
.upload-container {
  margin: 20px 0;
  display: flex;
}
// 左边选择素材类别
.upload-type {
  box-sizing: border-box;
  width: 25%;
  padding: 0 15px;
  @include flex-column;
}
// 修改单选框默认样式
.upload-type::v-deep .el-radio {
  width: 100%;
  & .el-radio__input {
    display: none;
  }
  & .el-radio__label {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0;
    margin-bottom: 10px;
    border-radius: 50px;
    background-color: $color-uploadShow;
    color: $color-fontMain;
  }
}
.upload-type::v-deep .el-radio.is-checked .el-radio__label {
  background-color: $color-main;
}

// 右边的上传主体部分
.upload-content {
  box-sizing: border-box;
  border-radius: 2px;
  width: 75%;
  padding: 20px;
  color: $color-fontMain;
  background-color: $color-navBg;
}
// 右边上传主体部分内层容器
.upload-main {
  box-sizing: border-box;
  // 标题
  .upload-title {
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin: 20px 0 10px 0;
  }
  .upload-center {
    box-sizing: border-box;
  }
  .upload-footer {
    box-sizing: border-box;
    padding-top: 20px;
    border-top: 2px solid $color-mainBg;
    margin-bottom: 10px;
    text-align: right;
    .footer-btn {
      // width: 100%;
      width: 50px;
      color: $color-fontMain;
      background-color: $color-main;
    }
    .footer-btn[disabled] {
      background-color: $color-second;
      color: $color-adaptBorder;
      cursor: not-allowed;
    }
  }
}

// 上传表单公用样式
.upload-form {
  // 表单中的每项
  .el-form-item {
    margin-bottom: 15px;
    // 表单项的标题label
    &::v-deep .el-form-item__label {
      color: $color-fontMain;
    }
    &::v-deep .el-input__inner {
      background-color: $color-mainBg;
      border: 1px solid $color-mainBg;
      color: $color-fontMain;
    }
    &::v-deep .el-input__inner:active,
    &::v-deep .el-input__inner:focus {
      border: 1px solid $color-main;
    }
  }
}
// 文件及封面上传的容器
.image-container {
  width: 150px;
  height: 150px;
  border: 1px solid $color-second;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .image-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: $color-second;
    .image-empty-icon {
      font-size: 50px;
    }
  }
  .imageFile {
    width: 100%;
    height: 100%;
  }
}

// 视频上传外层容器
.video-container {
  display: flex;
  margin-bottom: 20px;
  .video-upload.noPath {
    padding: 0;
  }
  // 视频上传部分
  .video-upload {
    padding: 10px;
    width: 50%;
    // 定位大小的内层容器
    .video-upload-inner {
      width: 100%;
      height: 0;
      padding-bottom: 80%;
      position: relative;
      // background-color: red;
      // 上方的文字说明 || 视频播放
      .video-upload-inner-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 80%;
        border: 1px solid $color-second;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        // background-color: #ccc;
        p {
          font-size: 20px;
          font-weight: 700;
          text-align: center;
        }
        .musicDefault {
          width: 100%;
          height: 100%;
        }
        audio {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 110%;
          height: 30px;
        }
      }
      // 下面的上传按钮和捕获截图按钮
      .video-upload-inner-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20%;
        // background-color: green;
        .video-uploader {
          width: 100%;
          height: 100%;
          &::v-deep .el-upload--text {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            button {
              margin-left: 5px;
            }
          }
        }
      }
    }
    .video-upload-inner.noPath {
      width: 100%;
      position:static;
      height: auto;
      padding-bottom: 0;
      .video-upload-inner-top {
        position: static;
        width: 150px;
        height: 150px;
      }
      .video-upload-inner-bottom {
        position: static;
        width: 100%;
        margin-top: 10px;
      }
    }
  }
  // 截取的封面图部分
  .video-thumb {
    padding: 10px;
    width: 50%;
    // 定位大小的内层容器
    .video-thumb-inner {
      width: 100%;
      height: 0;
      padding-bottom: 80%;
      position: relative;
      // background-color: yellow;
      .video-thumb-inner-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 80%;
        border: 1px solid $color-second;
        border-radius: 10px;
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
      .video-thumb-inner-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        p {
          color: $color-fontMain;
          font-size: 20px;
          font-weight: 700;
        }
      }
    }
  }
}
@media (max-width: 1100px) {
  // 外层总容器flex
  .upload-container {
    flex-direction: column;
    .upload-type {
      width: 100%;
      @include flex-just-spacebetween;
    }
    .upload-content {
      width: 100%;
      .upload-main .upload-footer .footer-btn {
        width: 100%;
      }
    }
  }
}
@media (max-width: 600px) {
  .video-container {
    flex-direction: column;
    align-items: center;
    .video-upload {
      width: 80%;
    }
    .video-thumb {
      width: 80%;
    }
  }
}
</style>