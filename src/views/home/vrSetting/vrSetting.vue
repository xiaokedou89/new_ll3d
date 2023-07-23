<template>
  <div class="main container container-padding">
    <!-- 外层总容器 -->
    <div class="vr-container">
      <!-- 左边 -->
      <div class="left">
        <!-- 上边的封面图部分 -->
        <div class="top">
          <!-- 上传/更改封面 -->
          <div class="thumb-outer">
            <!-- 上传封面图部分 -->
            <el-upload 
              class="thumb-upload"
              ref="thumbUpload"
              accept="image/png, image/jpg, image/jpeg"
              :limit="1"
              :action="thumbUrl"
              :headers="headers"
              :before-upload="thumbBeforeUpload"
              :on-progress="thumbProgressing"
              :on-success="thumbSuc"
              :on-error="thumbError"
              :disabled="thumbProgress"
              :show-file-list="thumbShowList"
            >
              <div class="thumb-container">
                <div class="thumb-empty" v-if="!configObj.thumb">
                  <i class="thumb-empty-icon el-icon-upload"></i>
                  <span class="thumb-empty-text">{{ $t('noThumb') }}</span>
                </div>
                <img class="thumb" v-else :src="getImageUrl(configObj.thumb)" />
              </div>
            </el-upload>
          </div>
          <!-- 底部文字 -->
          <p class="thumb-title">{{ $t('changeThumb') }}</p>
        </div>
        <!-- 下边的编辑框 -->
        <div class="bottom">
          <!-- 头部单选框容器 -->
          <div class="bottom-select">
            <el-radio class="select-radio" v-model="selectRadio" v-for="(item, index) in selectRadios" :key="index" :label="item.value">
              {{ item.name }}
            </el-radio>
          </div>
          <!-- 全局设置 -->
          <ul class="select-ul" v-if="selectRadio">
            <!-- 可视化编辑 -->
            <el-tooltip :open-delay="500" effect="light" :content="$t('visionTool')" placement="top">
              <li @click="linkToVisionSetting">
                <i class="iconfont icon-shezhitianchong"></i>
                {{ $t('visionSetting') }}
              </li>
            </el-tooltip>
            <!-- 背景音乐设置 -->
            <el-tooltip :open-delay="500" effect="light" :content="$t('bgMusicTool')" placement="top">
              <li @click="bgMusicOpen">
                <i class="iconfont icon-yinle"></i>
                {{ $t('bgMusicSetting') }}
              </li>
            </el-tooltip>
            <!-- 开场提示 -->
            <el-tooltip :open-delay="500" effect="light" :content="$t('openTipTool')" placement="top">
              <li @click="openTipOpen">
                <i class="iconfont icon-dengpao"></i>
                {{ $t('openTip') }}
              </li>
            </el-tooltip>
            <!-- 自定义LOGO -->
            <el-tooltip :open-delay="500" effect="light" :content="$t('logoTool')" placement="top">
              <li @click="customLogoOpen">
                <i class="iconfont icon-xianxingtubiaozhizuomoban-25"></i>
                {{ $t('logoSetting') }}
              </li>
            </el-tooltip>
            <!-- 自定义作者名 -->
            <el-tooltip :open-delay="500" effect="light" :content="$t('authorTool')" placement="top">
              <li @click="customAuthorOpen">
                <i class="iconfont icon-yongyan"></i>
                {{ $t('authorSetting') }}
              </li>
            </el-tooltip>
          </ul>
          <!-- 功能开启 -->
          <ul class="select-ul" v-else>
            <li class="select-switch-li" v-for="(item, index) in switches" :key="index">
              <el-tooltip :open-delay="500" effect="light" :content="item.tooltip" placement="top">
                <span class="switch-label">{{ item.label }}</span>
              </el-tooltip>
              <el-switch 
                @change="switchChange(item, $event)"
                v-model="configObj[item.key]" 
                active-color="#2489f3" 
                active-text="ON" 
                inactive-text="OFF"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </li>
          </ul>
        </div>
      </div>
      <!-- 右边 -->
      <div class="right">
        <!-- 头部标题 -->
        <h1 class="setting-title">{{ $t('workSetting') }}</h1>
        <!-- 表单部分 -->
        <div class="setting-center">
          <el-form 
            ref="settingForm" 
            class="setting-form" 
            :model="configObj" 
            :rules="rules" 
            size="small"
            :label-position="labelPosition"
            label-width="160px"
          >
            <!-- 名称 -->
            <el-form-item :label="$t('name') + '：'" prop="name">
              <el-input v-model="configObj.name" maxlength="14" :placeholder="$t('vrNamePlace')" @input="textInput" />
            </el-form-item>
            <!-- 简介 -->
            <el-form-item :label="$t('description') + '：'">
              <el-input type="textarea" :rows="5" :show-word-limit="true" maxlength="255" v-model="configObj.description" :placeholder="$t('modelDesPlace')" resize="none" @input="textInput" />
            </el-form-item>
            <!-- 标签 -->
            <el-form-item :label="$t('tag') + '：'">
              <div class="tags-container" v-if="tags.length > 0">
                <p>{{ $t('vrTagDes') }}</p>
                <el-checkbox-group v-model="tagsValue" :max="3" @change="selectTags">
                  <div class="tag" v-for="(item, index) in tags" :key="index">
                    <el-checkbox :label="item.id" >{{item.name}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
              <p class="tags-empty" v-else>{{ $t('vrTagEmpty') }}</p>
            </el-form-item>
            <!-- 编辑天空盒图片 -->
            <el-form-item v-if="!configObj.type" :label="$t('selectSkybox') + '：'">
              <div class="skybox-show" @click="openSkyboxDialog">{{ ' +' + $t('addSkybox') }}</div>
              <div class="skybox-select-container" v-if="!!configObj.skybox && Array.isArray(configObj.skybox)">
                <div class="skybox-select-item" v-for="(item, index) in configObj.skybox" :key="index">
                  <div class="inner">
                    <i class="iconfont icon-guanbi del-icon" @click="delSkyboxItem(item)"></i>
                    <el-image
                      :src="getSkyboxSrc(item.thumb)"
                      :fit="'cover'"></el-image>
                    <div class="skybox-select-item-action">
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 分类 -->
            <el-form-item :label="$t('workCategory') + '：'" prop="categoryId">
              <el-select v-model="configObj.categoryId" :placeholder="$t('vrCategoryPlace')" size="small">
                <el-option
                  v-for="item in categorys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- 作品地址 -->
            <el-form-item class="form-item-copy" :label="$t('workVrShow') + '：'">
              <el-input ref="vrShow" id="vrShow" readonly v-model="getVrShow"></el-input>
              <button type="button" class="btn confirmBtn copyBtn" @click="copyVrShow">{{ $t('copy') }}</button>
            </el-form-item>
            <!-- 二维码分享 -->
            <el-form-item :label="$t('qrcodeShare') + '：'">
              <div class="codeOuter">
                <div ref="code" class="qrcode"></div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部的按钮 -->
        <div class="setting-footer">
            <!-- 继续 -->
          <button class="btn confirmBtn footer-btn"  @click="setVr">{{ $t('saveSetting') }}</button>
        </div>
      </div>
    </div>
    <!-- 天空盒图片素材选择框 -->
    <dialoger
      :visible="skyboxDialogFlag"
      :mask="true"
      :title="$t('addSkybox')"
      :closable="true"
      @confirm="addSkybox"
      @cancel="closeSkybox"
    >
      <!-- 选择开场提示图片 -->
      <div class="images">
        <!-- label -->
        <div class="current-label">{{ $t('imagesSelect') + '：' }}</div>
        <!-- 有图片 -->
        <div class="musics-select-container" v-if="skyboxs.length > 0">
          <el-checkbox-group class="image-select-container" v-model="skyboxSelects" @change="skyboxSelectsChange">
            <el-checkbox :disabled="item.disabled" class="images-select-item" v-for="(item, index) in skyboxs" :key="index" :label="item.id">
              <el-image
                  style="width: 100px; height: 100px"
                  :src="getSkyboxSrc(item.thumb)"
                  :fit="'cover'"></el-image>
              <span class="image-item-name">{{ item.name }}</span>
            </el-checkbox>
          </el-checkbox-group>
          <!-- 底部的加载按钮 -->
          <el-button :loading="skyboxLoading"  class="loading" @click="loadSkyboxs">{{ $t('loadMore') }}</el-button>
        </div>
      </div>
    </dialoger>
    <!-- 左侧编辑弹框 -->
    <dialoger
      :visible="dialogerControl.flag"
      :mask="true"
      :title="dialogerControl.title"
      :closable="true"
      @confirm="dialogerConfirm"
      @cancel="dialogerCancel"
    >
      <!-- 背景音乐设置 -->
      <div class="bgMusic" v-if="dialogerControl.type === vrSettingDialogTypes.BGMUSIC.type">
        <!-- 上边的当前音乐部分 -->
        <div class="current">
          <!-- label -->
          <div class="current-label">
            {{ $t('currentBgMusic') + '：' }}
            <div class="remove-bgMusic" v-if="!!dialogerSetting.bgMusic" @click="removeBgMusic">{{ $t('removeBgMusic') }}</div>
          </div>
          <!-- 有背景音乐时 -->
          <div class="current-bgMusic" v-if="!!dialogerSetting.bgMusic">
            <span>{{ dialogerSetting.bgMusic.name }}</span>
            <audio controls :src="getMusicUrl(dialogerSetting.bgMusic.path)"></audio>
          </div>
          <!-- 当前没有背景音乐 -->
          <div class="current-empty" v-else>{{ $t('currentBgMusicEmpty') }}</div>
        </div>
        <!-- 选择音乐部分 -->
        <div class="musics">
          <!-- label -->
          <div class="current-label">{{ $t('bgMusicSelect') + '：' }}</div>
          <!-- 有音乐素材 -->
          <div class="musics-select-container" v-if="musics.length > 0">
            <el-radio
              class="musics-select-item"
              v-model="bgMusic"
              v-for="(item, index) in musics"
              :label="item.id"
              :key="index"
              @change="bgMusicChange"
            >
              <i class="iconfont icon-duigou1 bgmusic-icon"></i>
              <span>{{ item.name }}</span>
              <audio controls :src="getMusicUrl(item.path)"></audio>
            </el-radio>
            <el-button :loading="musicLoading"  class="loading" @click="loadMusics">{{ $t('loadMore') }}</el-button>
          </div>
          <!-- 无音乐素材 -->
          <div class="musics-select-empty" v-else>{{ $t('musicsEmpty') }}</div>
        </div>
      </div>
      <!-- 开场提示设置 -->
      <div v-if="dialogerControl.type === vrSettingDialogTypes.OPENTIP.type">
        <!-- 当前的开场提示 -->
        <div class="current">
          <!-- 标题label -->
          <div class="current-label">
            {{ $t('currentOpenTip') + '：' }}
            <div class="remove-bgMusic" v-if="!!dialogerSetting.openTip" @click="removeOpenTip">{{ $t('removeBgMusic') }}</div>
          </div>
          <!-- 当前开场提示部分 -->
          <div class="current-image-container">
            <!-- 有开场提示 -->
            <div class="current-image" v-if="!!dialogerSetting.openTip">
              <el-image
                style="width: 148px; height: 148px"
                :src="getImageUrl(dialogerSetting.openTip.thumb)"
                :fit="'cover'"></el-image>
            </div>
            <!-- 无开场提示 -->
            <div class="current-image-empty" v-else>{{ $t('openTipEmpty') }}</div>
          </div>
        </div>
        <!-- 选择开场提示图片 -->
        <div class="images">
          <!-- label -->
          <div class="current-label">{{ $t('imagesSelect') + '：' }}</div>
          <!-- 有图片 -->
          <div class="musics-select-container" v-if="images.length > 0">
            <!-- 内层图片flex容器 -->
            <div class="image-select-container">
              <el-radio
                class="images-select-item"
                v-model="openTip"
                v-for="(item, index) in images"
                :label="item.id"
                :key="index"
                @change="openTipChange"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="getImageUrl(item.thumb)"
                  :fit="'cover'"></el-image>
                <span class="image-item-name">{{ item.name }}</span>
              </el-radio>
            </div>
            <!-- 底部的加载按钮 -->
            <el-button :loading="imageLoading"  class="loading" @click="loadImages">{{ $t('loadMore') }}</el-button>
          </div>
          <!-- 没有图片 -->
          <div class="musics-select-empty" v-else>{{ $t('imagesEmpty') }}</div>
        </div>
      </div>
      <!-- 自定义logo设置 -->
      <div v-if="dialogerControl.type === vrSettingDialogTypes.LOGO.type">
        <!-- 当前的自定义logo -->
        <div class="current">
          <!-- 标题label -->
          <div class="current-label">
            {{ $t('currentCustomLogo') + '：' }}
            <div class="remove-bgMusic" v-if="!!dialogerSetting.customLogo" @click="removeCustomLogo">{{ $t('removeBgMusic') }}</div>
          </div>
          <!-- 当前开场提示部分 -->
          <div class="current-image-container">
            <!-- 有开场提示 -->
            <div class="current-image" v-if="!!dialogerSetting.customLogo">
              <el-image
                style="width: 148px; height: 148px"
                :src="getImageUrl(dialogerSetting.customLogo.thumb)"
                :fit="'cover'"></el-image>
            </div>
            <!-- 无开场提示 -->
            <div class="current-image-empty" v-else>{{ $t('openTipEmpty') }}</div>
          </div>
        </div>
        <!-- 选择开场提示图片 -->
        <div class="images">
          <!-- label -->
          <div class="current-label">{{ $t('imagesSelect') + '：' }}</div>
          <!-- 有图片 -->
          <div class="musics-select-container" v-if="images.length > 0">
            <!-- 内层图片flex容器 -->
            <div class="image-select-container">
              <el-radio
                class="images-select-item"
                v-model="customLogo"
                v-for="(item, index) in images"
                :label="item.id"
                :key="index"
                @change="customLogoChange"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="getImageUrl(item.thumb)"
                  :fit="'cover'"></el-image>
                <span class="image-item-name">{{ item.name }}</span>
              </el-radio>
            </div>
            <!-- 底部的加载按钮 -->
            <el-button :loading="imageLoading"  class="loading" @click="loadImages">{{ $t('loadMore') }}</el-button>
          </div>
          <!-- 没有图片 -->
          <div class="musics-select-empty" v-else>{{ $t('imagesEmpty') }}</div>
        </div>
      </div>
      <!-- 自定义作者名设置 -->
      <div v-if="dialogerControl.type === vrSettingDialogTypes.AUTHOR.type">
        <el-form ref="authorForm" :model="dialogerSetting" :rules="rules" size="small" :label-position="labelPosition" label-width="100px">
          <el-form-item prop="customAuthor" :label="$t('authorName') + '：'">
            <el-input v-model="dialogerSetting.customAuthor" maxlength="14" :placeholder="$t('authorPlace')"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </dialoger>
  </div>
</template>
<script>
import {getCategory, getSkyboxImage, getTags, getVRModel, setVrConfig} from '@/api/vr/vr.js';
import * as materialApi from '@/api/material/material.js';
import * as rule from '@/utils/rules.js';
import {
  common,
  filePrefix,
  image,
  music,
  listSize,
  skyBoxUrl,
  uploadFaceFile,
  vrSettingDialogTypes,
  VrShowUrl,
  chineseSignReg
} from '@/utils/global.js';
import Vue from 'vue';
import {i18n} from '@/assets/languages/i18n.js';
import {getToken} from '@/utils/storage.js';
import {delFile} from '@/api/file/file.js';
import QRCode from 'qrcodejs2';
import dialoger from '@/components/common/dialoger/dialoger.vue';

const rules = {
  customAuthor: rule.requiredRules,
  name: rule.requiredBlurRules,
  categoryId: rule.requiredBlurRules
};

const defaultConfig = {
  id: null,
  panoramaId: null,
  authorStatus: false,
  commentStatus: false,
  descriptionStatus: false,
  footmarkStatus: false,
  publicStatus: false,
  rotateStatus: false,
  showSceneStatus: false,
  vrStatus: false,
  description: null,
  bgMusic: null,
  customAuthor: null,
  customLogo: null,
  openTip: null,
  privacyPassword: null,
  name: null,
  path: null,
  tag: null,
  thumb: null,
  categoryId: null
};

const switches = [
  // 隐藏全景
  { key: 'publicStatus', label: i18n.t('publicSwitchLabel'), tooltip: i18n.t('publicSwitchTool') },
  // 场景选择
  { key: 'showSceneStatus', label: i18n.t('showSceneSwitchLabel'), tooltip: i18n.t('showSceneSwitchTool') },
  // 自动旋转
  { key: 'rotateStatus', label: i18n.t('rotateSwitchLabel'), tooltip: i18n.t('rotateSwitchTool') },
  // 隐藏说一说
  { key: 'commentStatus', label: i18n.t('commentSwitchLabel'), tooltip: i18n.t('commentSwitchTool') },
  // 隐藏作者名
  { key: 'authorStatus', label: i18n.t('authorSwitchLabel'), tooltip: i18n.t('authorSwitchTool') },
  // 隐藏人气
  { key: 'footmarkStatus', label: i18n.t('footmarkSwitchLabel'), tooltip: i18n.t('footmarkSwitchTool') },
  // 隐藏vr
  { key: 'vrStatus', label: i18n.t('vrSwitchLabel'), tooltip: i18n.t('vrSwitchTool') },
  // 隐藏简介
  { key: 'descriptionStatus', label: i18n.t('descriptionSwitchLabel'), tooltip: i18n.t('descriptionSwitchTool') }
];

const defaultParams = {
  pkId: 0,
  size: listSize,
  sortMode: 'DESC'
};

export default {
  name: 'VrSetting',
  components: {
    dialoger
  },
  data() {
    return {
      vrSettingDialogTypes,
      rules,
      // 当前全景id
      vrId: null,
      // 获取到的当前全景对象
      vr: null,
      // 当前全景对象(编辑对象)
      configObj: Object.assign({}, defaultConfig),
      // 封面图上传地址
      thumbUrl: uploadFaceFile,
      // 上传封面图关闭列表显示
      thumbShowList: false,
      // 上传封面图过程中开关
      thumbProgress: false,
      // 文件上传头
      headers: {}, 
      // 左边编辑框单选框绑定值
      selectRadio: true,
      // 左边编辑框单选框绑定数组
      selectRadios: [
        { name: i18n.t('allSetting'), value: true },
        { name: i18n.t('openSetting'), value: false }
      ],
      // 左边编辑框开关组渲染数组
      switches,
      // 表单适配标签label位置
      labelPosition: 'left',
      // 标签多选框生成数组
      tags: [],
      // 标签多选框绑定值
      tagsValue: [],
      // 全景分类数组数据
      categorys: [],
      // 生成的qrcode
      qrcode: '',
      // 左侧编辑弹框控制对象
      dialogerControl: {
        title: '',
        flag: false,
        type: ''
      },
      // 左侧弹框编辑绑定对象
      dialogerSetting: null,
      // 背景音乐素材
      musics: [],
      // 拉取音乐按钮加载动画
      musicLoading: false,
      bgMusic: null,
      // 拉取音乐参数
      musicParams: Object.assign({}, defaultParams),
      // 开场提示和自定义logo的图片素材
      images: [],
      // 拉取图片按钮加载动画
      imageLoading: false,
      openTip: null,
      customLogo: null,
      // 拉取图片参数
      imageParams: Object.assign({}, defaultParams),
      // 天空盒图片素材
      skyboxs: [],
      // 拉取天空盒素材加载动画
      skyboxLoading: false,
      // 拉取天空盒素材参数
      skyboxParams: Object.assign({}, defaultParams),
      // 天空盒图片素材多选绑定数组
      skyboxSelects: [],
      // 天空盒图片素材弹框开关
      skyboxDialogFlag: false,
      settingFlag: false
    }
  },
  created() {
    const that = this;
    this.init();
    this.initVr();
    this.initTags();
    this.initCategory();
    this.initMusic();
    this.initImages();
    this.initSkyboxs();
    window.addEventListener('resize', that.pageReize, false);
  },
  mounted() {
    this.createQRCode();
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', that.pageReize, false);
  },
  computed: {
    getImageUrl() {
      return function (src) {
        return filePrefix + image + src;
      }
    },
    // getMusicUrl() {
    //   return function (src) {
    //     return filePrefix + common + src;
    //   }
    // },
    getMusicUrl() {
      return function (src) {
        return filePrefix + music + src;
      }
    },
    getVrShow() {
      return VrShowUrl + this.vrId;
    },
    getSkyboxSrc() {
      return function (src) {
        return src ? filePrefix + skyBoxUrl + src : require('@/assets/empty.jpg');
      }
    },
  },
  methods: {
    init() {
      if (this.$route.query && this.$route.query.id !== undefined) {
        this.vrId = +this.$route.query.id;
      } else {
        this.$message({
          message: this.$t('initVrModelFail'),
          type: 'error',
          duration: 1500
        });
        this.$router.back(-1);
      }
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this.labelPosition = deviceWidth <= 1100 ? 'top' : 'left';
      this.$store.getters.token && (this.headers['authorization'] = getToken());
    },
    pageReize(e) {
      this.$nextTick(() => {
        this.labelPosition = e.currentTarget.innerWidth <= 1100 ? 'top' : 'left';
      });
    },
    // 拉取全景标签
    initTags() {
      getTags()
        .then(res => {
          if (res.code === 20000) {
            this.tags = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 拉取全景分类
    initCategory() {
      getCategory()
        .then(res => {
          if (res.code === 20000) {
            this.categorys = res.data;
          } else {
            this.$message({
              message: this.$t('getCategoryFail'),
              type: 'error',
              duration: 1500
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('getCategoryFail'),
            type: 'error',
            duration: 1500
          });
        });
    },
    // 初始化音乐素材
    initMusic() {
      materialApi.getMaterialListAll('voice', materialApi.range.CONFIDENTIAL, this.musicParams)
        .then(res => {
          if (res.code === 20000) {
            this.musics = this.musics.concat(res.data);
            this.musics.sort((a, b) => {
              if (a.id > b.id) {
                return -1;
              } else if (a.id < b.id) {
                return 1;
              } else {
                return 0;
              }
            });
          }
          this.musicLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.musicLoading = false;
        })
    },
    // 拉取图片素材
    initImages() {
      materialApi.getMaterialListAll('image', materialApi.range.CONFIDENTIAL, this.imageParams)
        .then(res => {
          if (res.code === 20000) {
            this.images = this.images.concat(res.data);
            this.images.sort((a, b) => {
              if (a.id > b.id) {
                return -1;
              } else if (a.id < b.id) {
                return 1;
              } else {
                return 0;
              }
            });
          }
          this.imageLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.imageLoading = false;
        });
    },
    // 拉取天空盒图片素材
    initSkyboxs() {
      materialApi.getMaterialListAll('vrPanormaImage', materialApi.range.CONFIDENTIAL, this.skyboxParams)
        .then(res => {
          if (res.code === 20000) {
            this.skyboxs = this.skyboxs.concat(res.data);
            this.skyboxs.forEach(item => {
              Vue.set(item, 'disabled', false);
            });
            this.skyboxs.sort((a, b) => a - b);
            this.setSkyboxSelectDisabled();
          }
          this.skyboxLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.skyboxLoading = false;
        })
    },
    // 点击加载更多音乐素材
    loadMusics() {
      this.musicLoading = true;
      this.musicParams.pkId = this.musics[this.musics.length - 1].id;
      this.initMusic();
    },
    // 点击加载更多图片素材
    loadImages() {
      this.imageLoading = true;
      this.imageParams.pkId = this.images[this.images.length - 1].id;
      this.initImages();
    },
    // 选取背景音乐事件
    bgMusicChange(e) {
      // this.dialogerSetting.bgMusic = this.musics.find(item => {
      //   return item.id == e;
      // });
      let musicObj = this.musics.find(item => {
        return item.id == e;
      })
      Vue.set(this.dialogerSetting, 'bgMusic', musicObj)
    },
    // 选取开场提示事件
    openTipChange(e) {
      // this.dialogerSetting.openTip = this.images.find(item => {
      //   return item.id == e;
      // });
      let openTip = this.images.find(item => {
        return item.id == e;
      });
      Vue.set(this.dialogerSetting, 'openTip', openTip);
    },
    customLogoChange(e) {
      // this.dialogerSetting.customLogo = this.images.find(item => {
      //   return item.id == e;
      // });
      let customLogo = this.images.find(item => {
        return item.id == e;
      });
      Vue.set(this.dialogerSetting, 'customLogo', customLogo);
    },
    // 移除当前背景音乐
    removeBgMusic() {
      this.bgMusic = null;
      this.dialogerSetting.bgMusic = null;
    },
    // 移除当前开场提示
    removeOpenTip() {
      this.openTip = null;
      this.dialogerSetting.openTip = null;
    },
    // 移除当前自定义logo
    removeCustomLogo() {
      this.cutomLogo = null;
      this.dialogerSetting.customLogo = null;
    },
    // 生成vrShow二维码
    createQRCode() {
      const that = this;
      this.qrcode = new QRCode(that.$refs.code, {
        text: `${that.getVrShow}`,
        width: that.$refs.code.clientWidth,
        height: that.$refs.code.clientHeight
      });
    },
    // 获取全景对象
    initVr() {
      getVRModel(this.vrId)
        .then(res => {
          console.log(res.data);
          if (res.code === 20000) {
            this.vr = res.data;
            !this.vr.type && this.initSkyboxImage();
            this.configObj = Object.assign({}, res.data);
            this.configObj = Object.assign(this.configObj, res.data.panoConfig);
            // this.configObj.tag && (this.tagsValue = this.configObj.tag.split(',').map(item => { return {id: +item} }));
            if (this.configObj.tag) {
              let tags = this.configObj.tag.split(',');
              tags.forEach(tagId => {
                this.tags.forEach(item => {
                  if (+tagId === item.id) {
                    this.tagsValue.push(item.id);
                  }
                }) 
              });
            }
            this.configObj.description = res.data.description;
            this.configObj.openTip && (this.configObj.openTip = JSON.parse(this.configObj.openTip));
            this.configObj.bgMusic && (this.configObj.bgMusic = JSON.parse(this.configObj.bgMusic));
            this.configObj.customLogo && (this.configObj.customLogo = JSON.parse(this.configObj.customLogo));
            // 初始化左侧弹框绑定对象
            this.dialogerSetting = JSON.parse(JSON.stringify(this.configObj));
            !!this.dialogerSetting.bgMusic && this.dialogerSetting.bgMusic.id && (this.bgMusic = this.dialogerSetting.bgMusic.id);
          } else {
            this.$message({
              message: this.$t('initVrModelFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initVrModelFail'),
            type: 'error',
            duration: 1500
          });
          this.$router.back(-1);
        })
    },
    // 获取天空盒模型的图片
    initSkyboxImage() {
      getSkyboxImage(this.vrId)
        .then(res => {
          if (res.code === 20000) {
            Vue.set(this.vr, 'skybox', res.data);
            Vue.set(this.configObj, 'skybox', res.data);
          }
        })
    },
    // 封面图上传前回调
    thumbBeforeUpload(file) {
      if (this.thumbProgress) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.thumbProgress;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          size = file.size,
          name = file.name,
          extensionFlag = (extension === 'jpg' || extension === 'png' || extension === 'jpeg') && size <= 5 * 1024 * 1024 && !chineseSignReg.test(name) ? true : false;
      if (!extensionFlag) {
        this.$message({
          message: this.$t('userThumbTypeWarn'),
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    // 封面图上传中回调
    thumbProgressing() {
      this.thumbProgress = true;
    },
    // 封面图上传成功回调
    thumbSuc(e) {
      this.thumbProgress = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('thumbUploadSuc'),
          type: 'success',
          duration: 1500
        });
        this.configObj.thumb !== this.vr.thumb && (this.delCallback('image', this.configObj.thumb));
        this.configObj.thumb = e.data.filename;
      } else {
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
      this.$refs.thumbUpload.clearFiles();
    },
    // 封面图上传失败回调
    thumbError(e) {
      this.thumbProgress = false;
      this.$message({
        message: e.message || this.$t('uploadFailWarn'),
        type: 'error',
        duration: 1500
      });
    },
    // 删除封面图回调
    delCallback(type, filename) {
      delFile(type, {
        filename
      })
        .then(res => {
          console.log(res)
        })
    },
    switchChange(item, e) {
      this.$forceUpdate();
    },
    // 点击背景音乐设置事件
    bgMusicOpen() {
      this.dialogerSetting = JSON.parse(JSON.stringify(this.configObj));
      if (this.dialogerSetting.bgMusic && this.dialogerSetting.bgMusic.id) {
        this.bgMusic = this.dialogerSetting.bgMusic.id
      } else {
        this.bgMusic = null;
      }
      this.dialogerControl = Object.assign(this.dialogerControl, vrSettingDialogTypes.BGMUSIC);
      this.dialogerControl.flag = true;
    },
    // 背景音乐确定回调
    bgMusicSetting() {
      const requestData = JSON.parse(JSON.stringify(this.dialogerSetting));
      !!requestData.bgMusic && (requestData.bgMusic = JSON.stringify(requestData.bgMusic));
      !!requestData.openTip && (requestData.openTip = JSON.stringify(requestData.openTip));
      !!requestData.customLogo  && (requestData.customLogo = JSON.stringify(requestData.customLogo));
      setVrConfig(this.vrId, requestData)
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('settingSuc'),
              type: 'success',
              duration: 1500
            });
            this.initVr();
            this.dialogerControl.flag = false;
          } else {
            this.$message({
              message: this.$t('settingFail'),
              type: 'error',
              duration: 1500
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('settingFail'),
            type: 'error',
            duration: 1500
          });
        });
    },
    // 点击开场提示事件
    openTipOpen() {
      this.dialogerSetting = JSON.parse(JSON.stringify(this.configObj));
      if (this.dialogerSetting.openTip && this.dialogerSetting.openTip.id) {
        this.openTip = this.dialogerSetting.bgMusic.id
      } else {
        this.openTip = null;
      }
      this.dialogerControl = Object.assign(this.dialogerControl, vrSettingDialogTypes.OPENTIP);
      this.dialogerControl.flag = true;
    },
    // 自定义logo点击事件
    customLogoOpen() {
      this.dialogerSetting = JSON.parse(JSON.stringify(this.configObj));
      this.dialogerControl = Object.assign(this.dialogerControl, vrSettingDialogTypes.LOGO);
      this.dialogerControl.flag = true;
    },
    // 自定义作者名点击事件
    customAuthorOpen() {
      this.dialogerSetting = JSON.parse(JSON.stringify(this.configObj));
      this.dialogerControl = Object.assign(this.dialogerControl, vrSettingDialogTypes.AUTHOR);
      this.dialogerControl.flag = true;
    },
    // 自定义作者名确定回调
    customAuthorSetting() {
      this.$refs.authorForm.validate(valid => {
        if (valid) {
          setVrConfig(this.vrId, this.dialogerSetting)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('settingSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.initVr();
                this.dialogerControl.flag = false;
              } else {
                this.$message({
                  message: this.$t('settingFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('settingFail'),
                type: 'error',
                duration: 1500
              });
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      })
    },
    // 弹框确认点击事件
    dialogerConfirm() {
      switch (this.dialogerControl.type) {
        case vrSettingDialogTypes.BGMUSIC.type:
          this.bgMusicSetting();
          break;
        case vrSettingDialogTypes.OPENTIP.type:
          this.bgMusicSetting();
          break;
        case vrSettingDialogTypes.LOGO.type:
          this.bgMusicSetting();
          break;
        case vrSettingDialogTypes.AUTHOR.type:
          this.customAuthorSetting();
          break;
      }
    },
    // 弹框取消点击事件
    dialogerCancel() {
      this.dialogerControl.flag = false;
    },
    // 生成的标签多选框选择事件
    selectTags(e) {
      if (e.length <= 0) {
        this.configObj.tag = null;
      } else {
        this.configObj.tag = e.map(item => {
          // return item.id;
          return item;
        }).join(',');
      }
    },
    // 点击作品地址复制按钮
    copyVrShow() {
      let content = this.$refs.vrShow;
      content.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.$message({
          message: this.$t('copySuccess'),
          type: 'success',
          duration: 1500
        });
      } else {
        this.$message({
          message: this.$t('copyFail'),
          type: 'error',
          duration: 1500
        });
      }
    },
    textInput() {
      this.$forceUpdate();
    },
    // 点击底部的确定按钮
    setVr() {
      if (this.settingFlag) {
        return;
      }
      this.settingFlag = true;
      this.$refs.settingForm.validate(valid => {
        if (valid) {
          this.configObj.openTip && (this.configObj.openTip = JSON.stringify(this.configObj.openTip));
          this.configObj.bgMusic && (this.configObj.bgMusic = JSON.stringify(this.configObj.bgMusic));
          this.configObj.customLogo && (this.configObj.customLogo = JSON.stringify(this.configObj.customLogo));
          setVrConfig(this.vrId, this.configObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('settingSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.initVr();
                this.settingFlag = false;
              } else {
                this.$message({
                  message: this.$t('settingFail'),
                  type: 'error',
                  duration: 1500
                });
                this.settingFlag = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.settingFlag = false;
              this.$message({
                message: this.$t('settingFail'),
                type: 'error',
                duration: 1500
              });
            });
        } else {
          this.settingFlag = false;
          this.$message({
            message: this.$t(''),
            type: 'warning',
            duration: 1500
          });
        }
      })
    },
    // 点击可视化编辑 
    linkToVisionSetting() {
      let path = '/vrmodelEditor';
      !this.vr.type && (path = '/panEditor'); 
      this.$router.push({
        path,
        query: {
          id: this.vrId,
          flag: true
        }
      });
    },
    // 打开天空盒图片素材弹框
    openSkyboxDialog() {
      this.setSkyboxSelectDisabled();
      this.skyboxDialogFlag =  true;
    },
    setSkyboxSelectDisabled() {
      this.skyboxSelects = [];
      if (Array.isArray(this.configObj.skybox)) {
        this.skyboxs.forEach(item => {
          const has = this.configObj.skybox.find(it => {
            return it.id === item.id;
          });
          if (has) {
            this.skyboxSelects.push(item.id);
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      }
    },
    // 点击天空盒每项的删除按钮
    delSkyboxItem(item) {
      let index = this.configObj.skybox.findIndex(it => {
        return it.id === item.id;
      })
      this.configObj.skybox.splice(index, 1);
    },
    // 天空盒素材多选值改变事件
    skyboxSelectsChange(e) {
      console.log(e)
    },
    // 天空盒图片素材弹框确定事件
    addSkybox() {
      if (this.skyboxSelects.length === 0) {
        this.$message({
          message: this.$t('skyboxSelectEmpty'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.skyboxSelects.forEach(item => {
        let result = this.configObj.skybox.findIndex(it => {
          return it.id === item;
        });
        if (result < 0) {
          this.configObj.skybox.push(
            this.skyboxs.find(skybox => {
              return item === skybox.id;
            })
          )
        }
      });
      this.skyboxDialogFlag = false;
    },
    // 天空盒素材弹框取消事件
    closeSkybox() {
      this.skyboxDialogFlag = false;
    },
    // 天空盒图片弹框点击加载按钮
    loadSkyboxs() {
      this.skyboxLoading = true;
      this.skyboxParams.pkId = this.skyboxs[this.skyboxs.length - 1].id;
      this.initSkyboxs();
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';

// 外层总容器
.vr-container {
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
}
// 左边部分
.left {
  box-sizing: border-box;
  width: 25%;
  // 上面的封面图上传
  .top {
    width: 100%;
    color: $color-fontMain;
    margin-bottom: 20px;
    // 封面图的外层--适配宽度
    .thumb-outer {
      margin: 0 auto;
      width: 100%;
      // 使用padding比例适配高度(relative定位)
      .thumb-upload {
        width: 100%;
        padding-bottom: 90%;
        position: relative;
        // line-height: 0;
        &::v-deep .el-upload {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      }
    }
    // 封面图底部的文字
    .thumb-title {
      height: 36px;
      line-height: 36px;
      width: 100%;
      text-align: center;
      font-size: 16px;
      margin: 0 auto;
      background-color: #292929;
    }
  }
  // 下边的编辑框
  .bottom {
    box-sizing: border-box;
    width: 100%;
    color: $color-fontMain;
    // 头部的单选框选择编辑内容部分
    .bottom-select {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      .select-radio {
        margin: 0;
        width: 50%;
        &::v-deep .el-radio__input {
          display: none;
        }
        &::v-deep .el-radio__label {
          display: inline-block;
          height: 40px;
          width: 100%;
          padding: 0;
          background-color: $color-navBg;
          color: $color-fontMain;
          line-height: 40px;
          text-align: center;
        }
      }
      .select-radio.is-checked {
        &::v-deep .el-radio__label {
          background-color:#43444a;
        }
      }
    }
    // 左边编辑框下面的ul
    .select-ul {
      width: 100%;
      background-color: #292929;
      padding-bottom: 10px;
      li {
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid $color-category;
        text-align: center;
        cursor: pointer;
      }
      li:hover {
        background-color: rgba(0, 0, 0, .1);
      }
      .select-switch-li {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .switch-label {
          width: 50%;
        }
        .el-switch {
          width: 50%;
        }
      }
    }
  }
}

// 上传内部适配
.thumb-container {
  width: 100%;
  height: 100%;
  border: 1px solid $color-main;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .thumb-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ccc;
    .thumb-empty-icon {
      font-size: 50px;
    }
  }
  .thumb {
    width: 100%;
    height: 100%;
  }
}

// 右边部分
.right {
  box-sizing: border-box;
  border-radius: 2px;
  width: 75%;
  padding: 20px;
  margin-left: 20px;
  color: $color-fontMain;
  background-color: $color-navBg;
  // 头部标题
  .setting-title {
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin: 20px 0 10px 0;
  }
  // 底部的按钮部分
  .setting-footer {
    box-sizing: border-box;
    padding-top: 20px;
    border-top: 2px solid $color-mainBg;
    margin-bottom: 10px;
    .footer-btn {
      width: 100%;
      background-color: $color-ori;
    }
    .footer-btn[disabled] {
      background: $color-second;
      color: $color-adaptBorder;
      cursor: not-allowed;
    }
  }
}

// 上传表单
.setting-form {
  // 表单中的每项
  .el-form-item {
    margin-bottom: 15px;
    // 表单项的标题label
    &::v-deep .el-form-item__label {
      color: $color-fontMain;
    }
    &::v-deep .el-input__inner,
    &::v-deep .el-textarea__inner {
      background-color: $color-mainBg;
      border: 1px solid $color-mainBg;
      color: $color-fontMain;
    }
    &::v-deep .el-textarea__inner {
      @include scrollBar;
    }
    &::v-deep .el-input__inner:active,
    &::v-deep .el-textarea__inner:active {
      border: 1px solid $color-main;
    }
    &::v-deep .el-input__inner:focus,
    &::v-deep .el-textarea__inner:focus {
      border: 1px solid $color-main;
    }
  }
}
.el-textarea::v-deep .el-input__count {
  border-radius: 4px;
  right: 5px;
  background-color: #ccc;
}

// 生成标签部分
.tags-container {
  padding: 0 10px 10px;
  background-color: $color-mainBg;
  border-radius: 4px;
  .el-checkbox-group {
    display: flex;
    .tag {
      box-sizing: border-box;
      display: inline-block;
      margin-right: 10px;
      height: 25px;
      background-color: $color-tag;
      border-radius: 4px;
      &:hover {
        background-color: $color-dialogTitle;
      }
      .el-checkbox {
        box-sizing: border-box;
        height: 100%;
      }
      .el-checkbox.is-checked::v-deep .el-checkbox__label {
        color: $color-main;
        font-weight: 700;
      }
      &::v-deep .el-checkbox__input {
        display: none;
      }
      &::v-deep .el-checkbox__label {
        box-sizing: border-box;
        padding: 4px 10px;
        color: $color-fontMain;
        display: inline-block;
        vertical-align: top;
      }
      .tag-icon {
        display: inline-block;
        vertical-align: top;
        height: 100%;
        width: 25px;
        box-sizing: border-box;
        line-height: 25px;
        text-align: center;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }
}

// 作品地址部分el-form-item
.form-item-copy {
  width: 100%;
  &::v-deep .el-form-item__content {
    // @include flex-just-spacebetween;
    display: flex;
    justify-content: space-evenly;
    // clear: both;
    .el-input {
      width: calc(100% - 50px);
      margin-right: 10px;
    }
    button {
      min-width: 50px;
      margin-left: 10px;
    }
    .copyBtn {
      background-color: $color-ori;
    }
  }
}

.codeOuter {
  box-sizing: border-box;
  width: 200px;
  height: 200px;
  padding: 20px;
  background-color: $color-fontMain;
  .qrcode {
    width: 100%;
    height: 100%;
  }
}

// 背景音乐的label标题
.current-label {
  position: relative;
  .remove-bgMusic {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    border: 1px solid $color-main;
    border-radius: 4px;
    padding: 0 4px; 
    color: $color-main;
    outline: none;
  }
}

// 开场提示和自定义logo的当前图片部分
.current-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .current-image {
    border: 1px solid $color-main;
    border-radius: 4px;
    width: 150px;
    height: 150px;
    overflow: hidden;
  }
  .current-image-empty {
    width: 100%;
    padding: 5px;
    border: 1px solid $color-main;
    margin-top: 5px;
    border-radius: 4px;
    text-align: center;
    color: $color-main;
    font-weight: bold;
  }
}

// 背景音乐设置-当前无背景音乐部分
.current-empty {
  padding: 5px;
  border: 1px solid $color-main;
  margin-top: 5px;
  border-radius: 4px;
  text-align: center;
  color: $color-main;
  font-weight: bold;
}
// 背景音乐设置-当前有背景音乐部分
.current-bgMusic {
  border: 1px solid $color-main;
  margin-top: 5px;
  border-radius: 4px;
  background-color: #F1F3F4;
  height: 30px;
  line-height: 0;
  box-sizing: content-box;
  padding-left: 10px;
  // 音乐名
  span {
    display: inline-block;
    width: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 30px;
    line-height: 30px;
  }
  audio {
    width: calc(100% - 50px);
    height: 30px;
  }
}
// 背景音乐设置-音乐素材部分
.musics-select-container,
.musics-select-empty {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid $color-main;
  min-height: 100px;
  margin-top: 5px;
}
.musics-select-empty {
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: $color-main;
  font-weight: bold;
}
.musics-select-container {
  position: relative;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 25px;
  background-color: #ccc;
  // 加载按钮
  .loading {
    width: 100%;
    height: 25px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: $color-main;
    color: $color-fontMain;
    text-align: center;
    border: none;
    border-top: 1px solid $color-fontMain;
    cursor: pointer;
    padding: 0;
    border-radius: 0;
  }

  // 单选音乐的每一项
  .musics-select-item {
    width: 100%;
    margin: 0;
    line-height: 0;
    height: 30px;
    &::v-deep .el-radio__input {
      display: none;
    }
    &::v-deep .el-radio__label {
      position: relative;
      display: block;
      margin: 0;
      height: 30px;
      line-height: 30px;
      background-color: #F1F3F4;
      padding-left: 20px;
      .bgmusic-icon {
        width: 20px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        color: $color-main;
        display: none;
      }
      // 音乐名
      span {
        display: inline-block;
        width: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      audio {
        width: calc(100% - 50px);
        height: 30px;
      }
    }
  }
  .musics-select-item.is-checked::v-deep .el-radio__label .bgmusic-icon {
    display: block;
  }
}
// 图片内层flex容器
.image-select-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  // 每一个图片单选项
  .images-select-item {
    width: 118px;
    height: 118px;
    padding: 4px;
    box-sizing: border-box;
    margin: 0;
    position: relative;
    &::v-deep .el-checkbox__input {
      position: absolute;
      top: 8px;
      left: 7px;
    }
    &::v-deep .el-radio__input {
      display: none;
    } 
    &::v-deep .el-radio__label,
    &::v-deep .el-checkbox__label {
      position: relative;
      border: 2px solid $color-fontMain;
      border-radius: 4px;
      display: inline-block;
      padding: 0;
      width: 100%;
      height: 100%;
      .el-image {
        width: 100%!important;
        height: 100%!important;
      }
      .image-item-name {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .4);
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: $color-fontMain;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .images-select-item.is-checked::v-deep .el-radio__label,
  .images-select-item.is-checked::v-deep .el-checkbox__label {
    border-color: $color-main;
    transform: translate(1px, 2px);
  }
}
// 天空盒打开天空盒图片弹框按钮
.skybox-show {
  width: 150px;
  padding: 5px;
  border-radius: 5px;
  color: $color-fontMain;
  box-sizing: border-box;
  background-color: $color-mainBg;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: $color-ori;
  }
}

// 当前全景天空盒的图片容器
.skybox-select-container {
  display: flex;
  margin-top: 10px;
  .skybox-select-item {
    width: 25%;
    box-sizing: border-box;
    padding: 5px;
    // background-color: #40424c;
    overflow: hidden;
    .inner {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      // background-color: red;
      line-height: 0;
      .del-icon {
        position: absolute;
        width: 20px;
        height: 20px;
        display: inline-block;
        background-color: $color-ori;
        color: $color-fontMain;
        top: 0;
        right: 0;
        z-index: 1;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
      }
      .el-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .skybox-select-item-action {
        width: 100%;
        height: 20%;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: $color-modelBtn;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          margin: 0 10px;
          max-width: 100px;
        }

      }
    }
  }
}

@media (max-width: 1100px) {
  // 外层总容器
  .vr-container {
    flex-direction: column;
    // 左侧
    .left {
      width: 100%;
      .thumb-outer {
        width: 400px;
        
      }
      .thumb-title {
        width: 400px;
      }
    }
    // 右侧
    .right {
      width: 100%;
      margin: 20px 0 0;
    }
  }
}

@media (max-width: 450px) {
  .vr-container .left .top .thumb-outer,
  .vr-container .left .top .thumb-title {
    width: 100%;
  }
}
</style>