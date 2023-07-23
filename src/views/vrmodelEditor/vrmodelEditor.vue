<template>
  <div id="vr-model-editor">
    <!-- 进度条 -->
    <div class="bg" v-show="loading.flag">
      <div id="bg" class="basic">
        <div class="left"></div>
        <div class="right"></div>
        <div class="hide"></div>
        <div class="cover"></div>
      </div>
    </div>
    <!-- 侧边栏开关 -->
    <el-tooltip :content="asideFlag ? $t('closeAside') : $t('openAside')" effect="dark" placement="top">
      <div
          v-if="isArListFlag"
          :class="{ 'aside-flag': asideFlag, 'aside-flag-close': !asideFlag }"
          @click="showAside"
      ></div>
    </el-tooltip>
    <!-- 帮助弹框 -->
    <el-dialog :visible.sync="helperFlag" class="helper-father" width="60%">
      <div class="helper-container">

        <div class="helper-container-left">
          <div class="helper-container-left-header">
            <el-image :src="helpImgUrlLeft" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("mouse.wheel")}}</td>
              <td>{{$t("mouse.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressLeft")}}</td>
              <td>{{$t("mouse.rotate")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.clickRightFirst")}}</td>
              <td>{{$t("mouse.pickUpMaterial")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.clickLeftMaterial")}}</td>
              <td>{{$t("mouse.moveMaterial")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressSecond")}}</td>
              <td>{{$t("mouse.placeMaterial")}}</td>
            </tr>
            <tr align="center">
              <td>{{$t("mouse.pressLeftMaterial")}}</td>
              <td>{{$t("mouse.changeViewPlace")}}</td>
            </tr>
          </table>
        </div>
        <div class="helper-container-right">
          <div class="helper-container-right-header">
            <el-image :src="helpImgUrlRight" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("keyboard.wasd")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
              <tr>
              <td>{{$t("keyboard.udlr")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.t")}}</td>
              <td>{{$t("keyboard.changePosition")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.r")}}</td>
              <td>{{$t("keyboard.changeRotate")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.s")}}</td>
              <td>{{$t("keyboard.changeScale")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.esc")}}</td>
              <td>{{$t("keyboard.exit")}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
    <!-- 设置弹框 -->
    <el-dialog :visible.sync="setterFlag" :title="$t('panoramaConfig')" class="setter-father" width="40%">
      <div class="tabs-item-container">
        <ul>
          <!-- <li>
            <span>抗锯齿：</span>
            <el-tooltip :content="sceneGroup.anti == true? '开' : '关'" placement="top">
              <el-switch
                  v-model="sceneGroup.anti"
                  :active-value="true"
                  :inactive-value="false"
                  active-color="#ccc"
                  inactive-color="rgba(20, 20, 20, 0.5)"
                  size="small"
                  @change="antiChange"
              />
            </el-tooltip>
          </li> -->
          <li>
            <span>{{$t("config.speedChange")}}{{$t("colon")}}</span>
            <el-input-number v-model="sceneGroup.speed" :max="1" :min="0" :step="0.1" size="small"
                             @change="speedChange"></el-input-number>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!-- 展示页面帮助弹框 -->
    <el-dialog :visible.sync="modelhelperFlag" class="helper-father" width="70%">
     <div class="helper-container">

        <div class="helper-container-left">
          <div class="helper-container-left-header">
            <el-image :src="helpImgUrlLeft" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("mouse.wheel")}}</td>
              <td>{{$t("mouse.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressLeft")}}</td>
              <td>{{$t("mouse.rotate")}}</td>
            </tr>
          </table>
        </div>
        <div class="helper-container-right">
          <div class="helper-container-right-header">
            <el-image :src="helpImgUrlRight" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("keyboard.wasd")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
              <tr>
              <td>{{$t("keyboard.udlr")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
    <!-- 上传音频弹框 -->
    <el-dialog :visible.sync="uploadMusicFlag" :title="$t('voice.select')" class="setter-father" width="40%">
      <div class="tabs-item-container">
        <div class="upload-music">
          <el-form ref="uploadMusic" :model="musicObj" label-width="120px" label-position="right">
            <el-form-item class="item-select-music" prop="id" :label="$t('voice.pleaseSelect')+$t('colon')">
              <el-select v-model="musicObj.id" clearable size="small" @change="selectMusic" :placeholder="$t('voice.pleaseSelect')">
                <el-option
                    v-for="item in musicList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <div id="audio-container" :class="{play: !playFlag, pause: playFlag}" v-if="musicFlag && uploadMusicFlag" @click="playMusic">
                <audio id="audio" :src="musicUrl"></audio>
              </div>
            </el-form-item>
            <el-form-item prop="autoPlayFlag"  :label="$t('voice.isPlay')+$t('colon')">
              <el-tooltip effect="light" :content="getUploadMuiscStatus(musicObj.autoPlayFlag)" placement="top">
                <el-switch
                    v-model="musicObj.autoPlayFlag"
                    :active-value="true"
                    :inactive-value="false"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item class="btn-group">
              <el-button type="primary" size="small" @click="handleSelectMusic">{{$t("confirm")}}</el-button>
              <el-button size="small" @click="cancelSelectMusic">{{$t("cancel")}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 顶部导航栏 -->
    <div class="editor-nav">
      <div class="nav-left">
        <a href="/">
          <img :alt="$t('logoName')" src="~@/assets/logo.png"/>
        </a>
        <span>{{ isArListFlag ? this.$t("modelPanorama.editorHeader") : this.$t("modelPanorama.previewHeader") }}</span>
      </div>
      <div class="nav-right">
        <!-- 帮助弹框开关 -->
        <el-tooltip :content="$t('help')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-helper" @click="showHelper"></span>
        </el-tooltip>
        <!-- 打开设置 -->
        <el-tooltip v-if="isArListFlag" :content="$t('openConfig')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-set" @click="showSetter"></span>
        </el-tooltip>
        <!-- 导出功能 -->
        <el-tooltip v-if="isArListFlag" :content="$t('export')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-export" @click="exportFunction"></span>
        </el-tooltip>
        <!-- 保存设置 -->
        <el-tooltip v-if="isArListFlag" :content="$t('saveConfig')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-save" @click="setSave"></span>
        </el-tooltip>
        <!-- 全屏开关 -->
        <el-tooltip v-if="flag" :content="$t('preview')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-full" @click="fullScreen"></span>
        </el-tooltip>
        <el-tooltip v-else :content="$t('fullscreen')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-full" @click="fullScreen"></span>
        </el-tooltip>
        <!-- 退出 -->
        <el-tooltip :content="$t('exit')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-exit" @click="back"></span>
        </el-tooltip>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div @mousedown="preventDefault" v-show="asideFlag&&isArListFlag" class="editor-aside">
      <el-tabs type="border-card" v-model="tabName" @tab-click="tabsClick">
        <!-- 图片 -->
        <el-tab-pane :name="$t('image.label')">
          <span slot="label">
            <i> {{$t("image.label")}}</i>
          </span>
          <div class="tabs-item-container">
            <div
                v-for="(item, index) in imgList"
                :key="index"
                class="tabs-item-container-item"
            >
              <img
                  :src="getImgSrc(item.thumb)"
                  alt=""
                  class="tabs-item-img"
                  :draggable="true"
                  @dragstart="imgDragStart($event,item,index)"
              />
            </div>
          </div>
        </el-tab-pane>
        <!-- 视频 -->
        <el-tab-pane :name="$t('video.label')">
          <span slot="label">
            <i>{{$t("video.label")}}</i>
          </span>
          <div class="tabs-item-container">
            <div
                v-for="(item, index) in videoList"
                :key="index"
                class="tabs-item-container-item"
            >
              <img
                  :src="getImgSrc(item.thumb)"
                  alt=""
                  :draggable="true"
                  @dragstart="videoDragStart($event, item, index)"
              />
              <video crossorigin="anonymous" :src="getCommonSrc(item.path)" class="tabs-item-video" controls loop></video>
            </div>
          </div>
        </el-tab-pane>
        <!-- 模型 -->
        <el-tab-pane :name="$t('model.label')">
          <span slot="label">
            <i> {{$t("model.label")}}</i>
          </span>
          <div class="tabs-item-container">
            <div
                class="tabs-item-container-item"
                v-for="(item, index) in modelList"
                :key="index"
            >
              <img
                  :src="getImgSrc(item.thumb)"
                  :draggable="true"
                  @dragstart="modelDragStart($event, item,index)"
                  alt=""
              />
            </div>
          </div>
        </el-tab-pane>
        <!-- 已选 -->
        <el-tab-pane :name="$t('selected')">
          <span slot="label">
            <i>{{$t("selected")}}</i>
          </span>
          <div class="tabs-item-container">
            <div
                v-for="(item, index) in materialPanoramas"
                :key="index"
                class="tabs-item-container-item select-item"
            >
              <div class="select-item-type"  @click="getMaterial(index)">{{ getTypeLabel(item.type) }}</div>
              <el-tooltip content="删除该项" effect="dark" placement="top">
                <span class="select-item-del" @click="delSectedItem(index)"></span>
              </el-tooltip>
              <el-tooltip :content="$t('voice.select')" effect="dark" placement="top">
                <span v-if="item.type !== videoMaterial" class="select-item-up-music" @click="showUploadMusic(item, index)"></span>
              </el-tooltip>
              <audio v-if="item.music!=null" :src="getCommonSrc(item.music.path)"  style="display:none" class="tabs-item-audio" controls loop></audio>
              <img
                  :src="getImgSrc(item.thumb)"
                  :alt="item.thumb"
                  draggable="false"

              />
            </div>
          </div>
        </el-tab-pane>
        <!-- 材质设置 -->
        <el-tab-pane :name="$t('material.label')">
          <span slot="label">
            <i>{{$t("material.label")}}</i>
          </span>

          <material
            v-if="renderer.textures!=null"
            :materialTypeProp="renderer.textures.materialsFront.type"
            :flag="renderer.textures.flag"
            @changeMaterial="changeMaterial"
            :material="renderer.textures.materialsFront"
          >
            <div class="material-select-obj material-set-flex" slot="material-select-obj">
              <span class="material-set-radio-title">{{$t("material.object")}}</span>
              <el-tooltip effect="dark" placement="top" :content="$t('map.multiModelToolTip')">
              <div class="material-set-radio">
                  <el-radio v-model="material.materialSelectType" :label="item.type" v-for="(item, index) in materialSelectTypeArr" :key="index" @change="materialSelectTypeChange">
                    {{ item.name }}
                  </el-radio>
              </div>
              </el-tooltip>
            </div>

          </material>
        </el-tab-pane>
        <!--灯光设置-->
        <el-tab-pane :name="$t('light.light')">
          <span slot="label">
            <i>{{$t("light.light")}}</i>
          </span>
          <Light
              v-if="renderer.light!=null"
              :isBindByPano="isBindByPano"
              :lights="renderer.light.lightSaveNode"
             :position="renderer.center"
              :size="renderer.size"
              @changeAmbient="changeAmbientLight"
              @changeLight="changeLight"
              @showPhysicalLight="showPhysicalLight"
              @showAmbientLight="showAmbientLight"
              @adjustPosition="adjustPosition"
          >
          <!--   -->
          </Light>
        </el-tab-pane>

        <!-- 设置 -->
        <!-- <el-tab-pane>
          <span slot="label">
            <i>设置</i>
          </span>
          <div class="tabs-item-container">
            <ul>
              <li>
                <span>抗锯齿：</span>
                <el-tooltip :content="sceneGroup.anti == true? '开' : '关'" placement="top">
                  <el-switch
                      v-model="sceneGroup.anti"
                      :active-value="true"
                      :inactive-value="false"
                      active-color="#ccc"
                      inactive-color="rgba(20, 20, 20, 0.5)"
                      size="small"
                      @change="antiChange"
                  />
                </el-tooltip>
              </li>
              <li>
                <span>模拟人步行速度：</span>
                <el-input-number v-model="sceneGroup.speed" :max="1" :min="0" :step="0.1" size="small"
                                 @change="speedChange"></el-input-number>
              </li>
            </ul>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <!-- 预加载遮挡层 -->
    <!-- <div
        v-if="loading.flag"
        v-loading="loading.flag"
        element-loading-background="rgba(0, 0, 0, 0.8)"
          :element-loading-text="$t('modelLoading')"
        :class="{loading: asideFlag&&isArListFlag, fullloading: !(asideFlag&&isArListFlag)}"
    >
    </div> -->
    <!-- canvas内容区 -->
    <div class="container" :class="{asideContainer: asideFlag&&isArListFlag}">
      <div
          class="editor-container"
          @dragover="allDrop"
          @drop.prevent="fileDrop"
      >
      </div>
      <!-- 模型旋转遮挡层 -->
      <div v-show="modelShowFlag.show"  class="show-model-dialog" style="background-color: coral" @click.stop.prevent>
        <!-- 进度条 -->
        <div class="bg-dialog" v-show="dialogLoading.flag">
          <div id="bg" class="dialog">
            <div class="left"></div>
            <div class="right"></div>
            <div class="hide"></div>
            <div class="cover"></div>
          </div>
        </div>
        <i class="show-model-dialog-close" @click.stop.prevent="modelDialogClose"></i>
        <div v-if="modelShowFlag.description" class="show-model-description">
          <p> {{ modelShowFlag.text }}</p>
        </div>
        <div class="show-model-container"></div>
      </div>
    </div>

  </div>
</template>
<script>
import {common, globalUrl,filePrefix,image, modelUrl, iconMaterial, videoMaterial,imgMaterial,modelMaterial} from "@/utils/global.js";
import * as api from '@/api/vr/vr.js'
import * as materialApi from '@/api/material/material.js'
import * as modelApi from '@/api/model/model.js'
import Light from '@/components/common/render/light.vue'
import material from '@/components/common/render/material.vue'
import hot from '@/components/common/render/hot.vue'
import Vue from 'vue'
import listitem from "@/components/common/listItem/listitem";
import {getList} from "@/api/model/model.js";
import * as renderApi from "@/render/panorama/render.js"
import { exportFunction } from "../../api/vr/vr";
const bottomSetObj = {
  scale: "",
  interObj: null
}

const sceneGroup = {
  anti: true,
  speed: 0,
  scene: null
}
const defaultMusicObj = {
  id: null,
  autoPlayFlag: false
}

export default {
  name: 'vrmodelEditor',
  inject: ['reload'],
  components: {
    Light,
    material,
    hot
  },
  data() {
    return {
      // 选中的tab栏名称
      tabName:  this.$t("image.label"),
      material: {
        materialSelectType:1,// 默认更改一个整体
        tabFlag:false, //更改的是否是素材栏
        asideFlag:true
      },// 是不是在改单个要选择的模型
      materialSelectTypeArr: [
        {
          type: 0,
          name: this.$t("map.selectOne")
        }
        ,
        {
          type: 1,
          name: this.$t("map.selectMore")
        }
      ],
      // 全景模型 || 普通模型开光
      isBindByPano: true,
      // 编辑页面帮助弹框左边图片
      helpImgUrlLeft: require('@/assets/left.png'),
      // 编辑页面帮助弹框右边图片
      helpImgUrlRight: require('@/assets/right.png'),
      playFlag: false,
      musicUrl: '',
      musicFlag: false,
      videoMaterial: videoMaterial,
      // 选择音频绑定对象
      musicObj: Object.assign({}, defaultMusicObj),
      // 已选数组中修改音频保存节点
      saveMusicNode: null,
      // 模型展示弹框开关
      modelShowFlag: {
        show: false,
        description: false,
        text: ''
      },
      // 抗锯齿绑定值
      antiFlag: false,
      // 模拟步行速度
      speed: 0,
      sceneGroup: Object.assign({}, sceneGroup),
      // 帮助弹框控制开关
      helperFlag: false,
      // 设置弹框控制开关
      setterFlag: false,
      // 上传音频开关
      uploadMusicFlag: false,
      modelhelperFlag: false,
      // 路由跳转时携带的flag参数决定是否渲染侧边栏
      isArListFlag: false,
      // 模型加载开关
      loading: {
        flag: true,
        progress: 0
      },
      dialogLoading: {
        flag: true,
        progress: 0
      },
      modelLoading:{
        flag: true,
        progress: 0
      },
      // 侧边栏开关
      asideFlag: true,
      // asideFlagStyle: false,
      // 底部编辑栏开关
      bottomFlag: {
        flag: false
      },
      // 底部编辑栏绑定值
      bottomSet: Object.assign({}, bottomSetObj),
      // 侧边栏图片绑定数组
      imgList: [],
      // 侧边栏视频绑定数组
      videoList: [],
      // 侧边栏模型绑定数组
      modelList: [],

      // 音乐素材数组
      musicList: [],
      materialPanoramas: [],// 全景当中所使用的素材
      panoConfig: null,// 全景配置
      saveData: null,
      flag:false,//判断是否是编辑状态
      fullscreenFlag: false, //判断全屏状态
      renderer:{
        light:null,// 渲染方面控制灯光相关
        center:null,// 模型中心位
        size:null,// 模型尺寸
        textures:null// 模型材质贴图
      }


    };
  },
  watch: {
    'loading.progress'(val) {
      this.loadingAnimation('basic',val);
      if (val == 100) {
        this.loading.flag = false
      }
    },
    'dialogLoading.progress'(val) {
      this.loadingAnimation('dialog', val);
      if (val == 100) {
        this.dialogLoading.flag = false
      }
    },
    tabName(val){
      if(val===this.$t('material.label')){
        this.material.tabFlag=true
      }else{
        this.material.tabFlag=false
      }
    },asideFlag(val){
      this.material.asideFlag=val
    },
    uploadMusicFlag(val, old) {
      if (val === false) {
        this.musicFlag = false
        this.playFlag = false
        this.musicUrl = ''
      }
    },
    musicFlag(val, old) {
      if (val === false) {
        this.playFlag = false
      }
    }
  },

  created() {
    document.oncontextmenu = function (e) {
      e.returnValue = false
    }
    this.initMaterial()
    this.addFullScreenListener()
    if (this.$route.query && typeof this.$route.query.id != null) {
      this.id = this.$route.query.id
    }
    if (this.$route.query&& typeof this.$route.query.flag!=null){
      this.flag=JSON.parse(this.$route.query.flag)
    }
    api.getVRModel(this.id)
        .then(res => {
          document.title = res.data && res.data.name ? res.data.name : this.$t('pageTitle.main');
          if (res.data.panoConfig != null) {
            this.panoConfig = res.data.panoConfig
            if (this.panoConfig.sceneGroup != null && this.panoConfig.sceneGroup !== "") {
              this.sceneGroup = JSON.parse(this.panoConfig.sceneGroup)
            } else {
              this.sceneGroup = Object.assign({}, sceneGroup)
            }
            if (this.panoConfig.materialPanoramas!=null&&this.panoConfig.materialPanoramas!=""){
              this.materialPanoramas=JSON.parse(this.panoConfig.materialPanoramas)
            }else{
              this.materialPanoramas=[]
            }
          }else{
            this.panoConfig={
              sceneGroup:null,
              materialPanoramas:null
            }
          }
          //这里就是监听当DOM元素完全加载的时候，获取表格中的数据
          this.$nextTick(()=>{
             this.initRender(res.data.path)
          })
        })
    this.isArListFlag = this.$route.query.flag === 'false' ? false : true
    window.addEventListener('keydown', this.listenDel, false)
  },
  destroyed() {
    window.removeEventListener('keydown', this.listenDel, false)
    window.removeEventListener('keydown', this.keydownForFull, false)

    window.removeEventListener('fullscreenchange', this.fullscreenchange)
    renderApi.quitRender()
  },
  computed: {
    getTypeLabel() {
      return function (type) {
        let label = '';
        switch (type) {
          case 0:
            label = 'P'
            break
          case 1:
            label = 'M'
            break
          case 3:
            label = 'V'
            break
        }
        return label
      }
    },
    getImgSrc() {
      return function (src) {
        return src ? filePrefix + image + src : require('@/assets/1.jpg')
      }
    },
    getCommonSrc(){
      return function (src) {
        return src ? filePrefix + common + src : require('@/assets/1.jpg')
      }
    },
    getMusicSrc() {
      return function (src) {
        return filePrefix + common + src
      }
    },
    getUploadMuiscStatus() {
      return function (status) {
        return status ? this.$t("autoPlay") : this.$t("manualPlay")
      }
    }
  },
  methods: {
    loadingAnimation(className, value) {
      let cover = document.querySelector(`.${className}>.cover`),
          left = document.querySelector(`.${className}>.left`),
          right = document.querySelector(`.${className}>.right`),
          hide = document.querySelector(`.${className}>.hide`);
      let deg;//左环转动角度
      if (Number.isNaN(value) || value < 0) value = 0;
      if (value > 100) value = 100;
      if(value % 1 !== 0){  //若value为小数，保留一位小数
          value = value.toFixed(1);
      }
      cover.innerText = value + "%";
      if (value < 50) {  //值小于50，显示遮罩
          left.style.display = "inhert";
          right.style.display = "none";
          hide.style.display = "block";
          deg = value / 50 * 180;
          left.style.transform = "rotate("+ (deg) +"deg)";
      } else {  //值大于或等于50，不显示遮罩
          hide.style.display = "none";
          right.style.display = "block";
          left.style.transform = "rotate(180deg)";
          deg =  (value - 50) / 50 * 180;
          right.style.transform = "rotate("+ (deg) +"deg)";
      }
    },
    preventDefault(e) {
      e.stopPropagation()
    },
    // 初始化渲染同render.js 结合
    initRender(_data){
        const container = document.getElementsByClassName("editor-container")[0];
          const modelShow=document.getElementsByClassName("show-model-container")[0];
          var data=JSON.parse(_data)
          var pano = {
            path: null,
            url: null
          };
          pano.path=filePrefix + modelUrl+data.modelName
          if(data.mapName) {
            Array.isArray(data.mapName) && data.mapName.length > 0 && (pano.url = filePrefix + modelUrl + data.mapName[0]);
            typeof data.mapName === 'string' && (pano.url = filePrefix + modelUrl + data.mapName);
          }
          const param={
            loading:this.loading,
            material:this.material,
            sceneGroup:this.sceneGroup,
            flag:this.flag,
            modelShowFlag:this.modelShowFlag,
            modelShow:modelShow,
          }
          renderApi.initDom(container,pano,param)
            .then(res => {
              if (res) {
                // 获取到灯光,与外部操作关联
                this.renderer.light=renderApi.initLight()
                this.renderer.textures=renderApi.initTextures()
                this.renderer.center=renderApi.getCenter()
                this.renderer.size=renderApi.getSize()
              }
            })

    },
    // 显示灯光helper，调节灯光
    adjustPosition(e) {
      // e.type
      // e.index
    },
    // tab栏点击事件
    tabsClick() {
      // 判断tabName是不是材质
    },
    // 模型材质渲染对象单选框值改变事件
    materialSelectTypeChange(e) {
      // 0 为单模型
      // 1 为全部模型
      this.material.materialSelectType=e

    },
    refresh() {
      if (localStorage.getItem("refreshFlag") == null) {
        localStorage.setItem("refreshFlag", "false");
      }
      const item = JSON.parse(localStorage.getItem("refreshFlag"));
      localStorage.setItem("refreshFlag", "false");
      if (!item) {
        this.reload();
        localStorage.setItem("refreshFlag", "true");
      }
    },
    // 模型展示弹框关闭按钮事件
    modelDialogClose(e) {
      this.modelShowFlag.show = false
      // 关闭模型详情弹框
      renderApi.addControl()
    },
    // 初始化素材列表
    initMaterial() {
      materialApi.getMaterialListAll('image', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
          .then(res => {
            if (res.code === 20000 && res.data !== null) {
              this.imgList = res.data
            }
          })
      materialApi.getMaterialListAll('video', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
          .then(res => {
            if (res.code === 20000 && res.data !== null) {
              this.videoList = res.data
            }
          })
      modelApi.getList({
        pkId: 0,
        size: 50
      })
          .then(res => {
            if (res.code === 20000 && res.data !== null) {
              this.modelList = res.data
            }
          })

      materialApi.getMaterialListAll('voice', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
          .then(res => {
            if (res.code === 20000 && res.data !== null) {
              this.musicList = res.data
            }
          })
    },
    // 抗锯齿开关值改变事件
    antiChange(e) {
    },
    // 模拟步行速度值改变事件
    speedChange(e) {
    },
    // 导航栏保存按钮事件
    setSave() {
      // 保存场景中的灯光
      this.sceneGroup.light=this.renderer.light.saveLight()
      this.sceneGroup.scene = renderApi.saveMaterial()
      this.sceneGroup.texture=null
      // this.sceneGroup.textures=this.renderer.textures.saveTextures()
      this.panoConfig.sceneGroup = JSON.stringify(this.sceneGroup)
      this.panoConfig.materialPanoramas=JSON.stringify(this.materialPanoramas)
      const data={
          panoConfig:this.panoConfig,
          materials:[]
      }

      // 素材的保存
      var map = new Map();
      for(var i=0;i<this.materialPanoramas.length;i++){
        if(this.materialPanoramas[i].music!=null){
          map.set(this.materialPanoramas[i].music.id,this.materialPanoramas[i].music.type)
        }
        map.set(this.materialPanoramas[i].materialId,this.materialPanoramas[i].type)
      }
      map.forEach((v,k)=>{
        const materialEntry={
        materialId:null,
        type:null,
        panoramaId:null
      }
        materialEntry.materialId=k
        materialEntry.type=v
        materialEntry.panoramaId=Number(this.id)
        data.materials.push(materialEntry)
      })
      api.updateVrModel(this.id, data).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: this.$t("saveSuccess"),
            type: 'success',
            duration: 1500
          })
        }
      })
    },
    // 监听键盘删除键事件
    listenDel() {
      setTimeout(() => {
        if (typeof window.index === 'number') {
          this.materialPanoramas.splice(window.index, 1)
        }
      }, 100)


    },
    // 点击已选选项卡项的删除按钮事件
    delSectedItem(index) {
      this.materialPanoramas.splice(index, 1)
      renderApi.removeObj(index)
    },
    // 点击已选列表的音乐按钮显示上传音频弹框
    showUploadMusic(item, index) {
      this.musicObj = Object.assign({}, defaultMusicObj)
      if (item.type === videoMaterial) {
        this.$message({
          message: this.$t("voice.notRequirements"),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.saveMusicNode = item
      Vue.set(this.musicObj, 'index', index)
      if (!item.music) {
        Vue.set(item, 'music', null)
      } else {
        // this.musicObj = Object.assign({}, item.music)
        this.musicObj = JSON.parse(JSON.stringify(item.music))
      }
      this.uploadMusicFlag = true
      if (this.musicObj.path) {
        this.musicUrl = this.getMusicSrc(this.musicObj.path)
        this.musicFlag = true
      }
    },
    // 音频选择弹框选择音频事件
    selectMusic(e) {
      for (const [index, item] of this.musicList.entries()) {
        if (item.id === e) {
          this.musicObj = Object.assign(this.musicObj, item)
        }
      }
      if (typeof e === 'string') {
        this.musicFlag = false
        this.musicUrl = ''
        this.musicObj.id = null
        this.musicObj.name = ''
        this.musicObj.path = ''
        this.musicObj.publicFlag = false
        this.musicObj.thumb = ''
      } else {
        this.musicFlag = true
        this.playFlag = false
        this.musicUrl = this.getMusicSrc(this.musicObj.path)
      }
    },
    // 点击试听按钮事件
    playMusic() {
      const that = this
      let audio = document.getElementById('audio')
      if (audio.paused) {
        audio.play()
        this.playFlag = true
      } else {
        audio.pause()
        this.playFlag = false
      }
      audio.onended = function () {
        that.playFlag = false
      }
    },
    // 音频选择框点击确定事件
    handleSelectMusic() {
      if (!this.musicObj.path) {
        this.$message({
          message: this.$t("voice.pleaseSelect"),
          type: 'warning',
          duration: 1500
        })
        return
      }
      var music=JSON.parse(JSON.stringify(this.musicObj))
      Vue.set(this.saveMusicNode, 'music',music )
      renderApi.placeMusic(music)
      this.saveMusicNode = null
      this.musicObj = Object.assign({}, defaultMusicObj)
      this.$message({
        message: this.$t("voice.selectSuccess"),
        type: 'success',
        duration: 1500
      })
      this.uploadMusicFlag = false
      this.musicFlag = false
      this.musicUrl = ''

    },
    // 音频选择框点击取消事件
    cancelSelectMusic() {
      this.$message({
        message: this.$t("voice.cancelSelect"),
        type: 'warning',
        duration: 1500
      })
      this.saveMusicNode = null
      this.musicObj = Object.assign({}, defaultMusicObj)
      this.uploadMusicFlag = false
      this.musicFlag = false
      this.musicUrl = ''
    },
    // 点击问号帮助按钮打开帮助弹框
    showHelper() {
      if (this.isArListFlag) {
        this.helperFlag = true
      } else {
        this.modelhelperFlag = true
      }
    },
    // 点击顶部设置按钮打开设置弹框
    showSetter() {
      this.setterFlag = true
    },
    // 点击查看按钮实现全屏展示功能
    fullScreen() {
      // const ele = document.getElementsByClassName('editor-container')[0]
       const ele = document.getElementsByClassName('container')[0]
        this.requestFullScreen(ele)
        // 如果目前是编辑状态，更改render操作
        if(this.flag){
          renderApi.changeEditor(false)
        }
    },
    requestFullScreen(element) {
      const elementDom = element || document.documentElement
      if (elementDom.requestFullscreen) {
        elementDom.requestFullscreen();
      } else if (elementDom.mozRequestFullScreen) {
        elementDom.mozRequestFullScreen();
      } else if (elementDom.webkitRequestFullScreen) {
        elementDom.webkitRequestFullScreen();
      } else if (elementDom.msRequestFullscreen) {
        elementDom.msRequestFullscreen();
      }
    },
    addFullScreenListener() {
      const self = this
      window.addEventListener('keydown', self.keydownForFull)
      window.addEventListener('fullscreenchange', self.fullscreenchange)
    },
    dispatchForCode (event, callback) {
      let code;
      if (event.key !== undefined) {
        code = event.key;
      } else if (event.keyCode !== undefined) {
        code = event.keyCode;
      } else if (event.keyIdentifier !== undefined) {
        code = event.keyIdentifier;
      }
      callback(code);
    },
    keydownForFull (event) {
      const self = this
      self.dispatchForCode(event, (code) => {
        if (code === 'F11' || code === 122) {
          event.preventDefault();
        }
      })
    },
    // 监听全屏事件，使用fullscreenFlag 进行判断
    fullscreenchange (e) {

      const self = this
      // 退出全屏
      if(this.flag && self.fullscreenFlag){
          renderApi.changeEditor(true)
      }
      self.fullscreenFlag = !!document.fullscreenElement

    },
    // 底部编辑栏输入框值改变事件
    changeScale(e) {
      if (e != null && e != "") {
      }
    },
    // 开启/关闭侧边栏
    showAside() {
      this.asideFlag = this.asideFlag == true ? false : true;
    },
    // 退出按钮路由跳转
    back() {
      this.$router.back(-1);
    },
    // 模型展示div绑定去除不可拖拽事件
    allDrop(e) {
      e.preventDefault();
    },
    // 热点删除
    iconDel() {
    },
    // 确定热点
    iconConfirm(){
    },
    // 热点调整大小
    iconSizeChange(e) {
    },
    // 图片拖拽起始事件退
    imgDragStart(e, item,index) {

       e.stopPropagation()
      if(renderApi.isEditor()){
           e.preventDefault()
          this.$message({
            message: this.$t("isEditor"),
            type: 'warning',
            duration: 1500
          })
          return
      }

      e.dataTransfer.setData("src",item.path);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("index", index);
      e.dataTransfer.setData("thumb", item.thumb);
      e.dataTransfer.setData("path", item.path);
      e.dataTransfer.setData("type", imgMaterial);
    },
    iconDragStart(e, item, index,iconObj) {
        if(renderApi.isEditor()){
           e.preventDefault()
          this.$message({
            message: this.$t("isEditor"),
            type: 'warning',
            duration: 1500
          })
          return
      }
      e.dataTransfer.setData("src", item.src)
      e.dataTransfer.setData("index", index)
      e.dataTransfer.setData("type", iconMaterial)
      e.dataTransfer.setData("iconObj",JSON.stringify(iconObj))
    },
    // 视频拖拽起始事件
    videoDragStart(e, item, index) {
      e.stopPropagation()
        if(renderApi.isEditor()){
           e.preventDefault()
          this.$message({
            message: this.$t("isEditor"),
            type: 'warning',
            duration: 1500
          })
          return
      }
      e.dataTransfer.setData("src", item.url);
      e.dataTransfer.setData("type", videoMaterial);
      e.dataTransfer.setData("index", index);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("thumb", item.thumb);
      e.dataTransfer.setData("path", item.path);
    },
    // 模型拖拽起始事件
    modelDragStart(e, item,index) {
      e.stopPropagation()
        if(renderApi.isEditor()){
           e.preventDefault()
          this.$message({
            message: this.$t("isEditor"),
            type: 'warning',
            duration: 1500
          })
          return
      }
      const src={
        modelName:item.model,
        mapName:[item.texture]
      }
      e.dataTransfer.setData("src", JSON.stringify(src));
      e.dataTransfer.setData("type", modelMaterial);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("thumb", item.thumb);
      e.dataTransfer.setData("index", index);
    },
    // 模型展示div接受拖拽事件
    fileDrop(e) {
      e.stopPropagation()
      // e的x,y属性就是拖动过程中鼠标的实时x,y坐标值，使用 e.x 和 e.y来获取鼠标坐标
      this.bottomSet = Object.assign({}, bottomSetObj)
      this.bottomFlag.flag = true
      let src = '' + e.dataTransfer.getData("src");
      let type = +e.dataTransfer.getData("type");
      let materialId = +e.dataTransfer.getData("materialId");
      let thumb = '' + e.dataTransfer.getData("thumb");
      let path = '' + e.dataTransfer.getData("path");
      let index=e.dataTransfer.getData("index");
      let  dom;
      var planes=null
      if (type === videoMaterial) {
        dom = document.getElementsByClassName("tabs-item-video")[index];

        planes = renderApi.placeMaterial( type, {
          x: e.x,
          y: e.y,
          index:index
        }, dom);
      }
      if (type === imgMaterial) {
        planes = renderApi.placeMaterial( type, {
          x: e.x,
          y: e.y,
          index:index
        }, this.getImgSrc(src));
      }
      // 拖拽icon
      if(type===iconMaterial){
        let iconObj =  e.dataTransfer.getData("iconObj");
          planes=renderApi.placeMaterial(type,{
            x:e.x,
            y:e.y,
            index:index,
            iconObj:JSON.parse(iconObj) // 将icon的大小与所指链接传入
          },src)
      }
      if (type === modelMaterial) {
        let srcJson= JSON.parse(src)
        srcJson.id=materialId
        planes = renderApi.placeMaterial( type, {
          x: e.x,
          y: e.y,
          index:index
        }, srcJson);

      }

      this.materialPanoramas.push({
        materialId: materialId,
        panoramaId: this.id,
        type: type,
        thumb: thumb,
        path: path
      })
    },
    // 底边编辑栏按钮点击事件
    bottomSetClick() {
      if (this.bottomSet.scale != null && this.bottomSet.scale != "") {
      }
    },
    changeAmbientLight(ambientLightMo){
      for(let key in ambientLightMo){
        this.renderer.light.changeLightProperty( this.renderer.light.ambientLightInScene,key,ambientLightMo[key])
      }
    },
    changeLight(_light) {
      this.renderer.light.changeLight(_light.index,_light.light)
    },
    showPhysicalLight(phyLightFlag){
      this.renderer.light.showPhysicalLight(phyLightFlag)
    },
    showAmbientLight(ambientLightMoFlag){
      this.renderer.light.showAmbientLight(ambientLightMoFlag)
    },
    getMaterial(index){
      renderApi.toMaterial(index)
    },
    changeMaterial(type, material) {

      this.renderer.textures.changeMaterial(type,material)
    },
    exportFunction(){

      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = "http://192.168.1.126:8080/api1" + "/vr/model/"+this.id+"/download"
       document.body.appendChild(link);
       link.click();
    },
    downloadFile(url, fileName, flieId, type) {

   }
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
#vr-model-editor {
  width: 100%;
  height: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;
}

// 导航栏部分
.editor-nav {
  position: relative;
  height: 60px;
  background-color: rgb(111, 109, 109);
  display: flex;
  justify-content: space-between;
  z-index: 999;
}

.editor-nav .nav-left a {
  display: inline-block;
  height: 100%;
  padding: 15px;
}

.editor-nav .nav-left img {
  vertical-align: middle;
}

.editor-nav .nav-left span {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  color: #fff;
}

.editor-nav .nav-right {
  display: flex;
  position: relative;
  padding-right: 10px;
  justify-content: space-around;
  align-items: center;
}

.editor-nav .nav-right .icon-flag-helper {
  border-radius: 50%;
  background: url("~@/assets/help.png") no-repeat 3px;
}

.editor-nav .nav-right .icon-flag-set {
  border-radius: 50%;
  background: url("~@/assets/set2.png") no-repeat 3px;
}
.editor-nav .nav-right .icon-flag-export {
  border-radius: 50%;
  background: url("~@/assets/export.png") no-repeat 3px;
}
.editor-nav .nav-right .icon-flag-save {
  border-radius: 6px;
  background: url("~@/assets/save.png") no-repeat 1px 1px;
}

.editor-nav .nav-right .icon-flag-full {
  border-radius: 6px;
  background: url("~@/assets/full.png") no-repeat 3px 3px;
  background-size: 25px 25px;
}

.editor-nav .nav-right .icon-flag-exit {
  border-radius: 6px;
  background: url("~@/assets/exit.png") no-repeat 1px 1px;
}

.editor-nav .nav-right .icon-flag {
  width: 33px;
  height: 33px;
  margin-right: 12px;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  // border-radius: 50%;
  z-index: 99;
  cursor: pointer;
}
.container{
  width: 100%;
  height: 100%;
  margin-top: 0;
  display: flex;
  background-color: #000;
  // 主体部分
  .editor-container {
    width: 100%;
    height: 100%;
    margin-top: 0;
    display: flex;
  }
  // 模型旋转展示弹框
  .show-model-dialog {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(34, 34, 34, 0.6);
    z-index: 9999;
    display: flex;
    // 弹框关闭小按钮
    .show-model-dialog-close {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 2px solid #fff;
      background: url("~@/assets/model-close.png") no-repeat 3px 3px;
      background-color: rgba(34, 34, 34, 0.4);
      background-size: 25px 25px;
      box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
      cursor: pointer;
      position: absolute;
      right: 15px;
      top: 15px;
    }
    // 左边模型描述部分
    .show-model-description {
      width: 40%;
      height: 100%;
      padding: 50px;
      background-color: rgba(34, 34, 34, 0.6);
      p {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        color: #ccc;
        font-size: 16px;
        background-color: rgba(189, 185, 185, 0.788);

      }
    }
    // 模型展示部分
    .show-model-container {
      width: 100%;
      height: 100%;
      background-color: rgba(34, 34, 34, 0.6);
    }
  }
}


.editor-container .container-aside {
  width: 321px;
  height: 100%;
  background-color: #595959;
}

.editor-container .container-center {
  border-left: 1px solid #000;
  width: calc(100% - 321px);
  height: calc(100% - 60px);
}

// 侧边栏开关-打开
.aside-flag {
  position: absolute;
  top: 65px;
  left: 320px;
  width: 36px;
  height: 35px;
  background: url("~@/assets/unsee.png") no-repeat 3px 3px;
  background-size: 28px 28px;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  z-index: 99;
  cursor: pointer;
}

// 侧边栏开关-关闭
.aside-flag-close {
  position: absolute;
  top: 65px;
  left: 10px;
  width: 36px;
  height: 35px;
  background: url("~@/assets/see.png") no-repeat;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  z-index: 99;
  cursor: pointer;
}

// 帮助提示开关
.helper-flag {
  position: absolute;
  top: 65px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: url("~@/assets/help.png") no-repeat 2px 2px;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  z-index: 99;
  cursor: pointer;
}
// 全景设置弹框
.setter-father::v-deep .el-dialog div.el-dialog__header {
  height: 50px;
  background-color: rgba(34, 34, 34);
  color: #ccc;
}
.setter-father::v-deep .el-dialog div.el-dialog__header span {
  color: #ccc;
}
.setter-father::v-deep .el-dialog div.el-dialog__body {
  background-color: rgba(34, 34, 34);
  color: #ccc;
}
// 帮助提示弹框
.helper-father::v-deep .el-dialog__body {
  // padding-top: 30px;
  padding: 0;
}

.helper-container {
  display: flex;
  height: 400px;
  font-size: 18px;
}

.helper-container table {
  text-align: center;
  font-size: 16px;
}
.helper-container table tr {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  td {
    flex: 1;
  }
}

.helper-container-left,
.helper-container-right {
  width: 50%;
  height: 90%;
  padding: 20px;
  // border: 1px solid red;
}

// .helper-container-left-header {
//   background: url('~@/assets/left.png') no-repeat 80px 10px;
// }

// .helper-container-right-header {
//   background: url('~@/assets/right.png') no-repeat 80px 4px;
// }

.helper-container-left-header,
.helper-container-right-header {
  width: 100%;
  height: 30%;
  // background-color: green;
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.helper-container-left {
  border-right: 1px solid #ccc;
}

// 展示帮助
.modelhelper-container {
  display: flex;
  height: 400px;
  font-size: 18px;
}

.modelhelper-container-left {
  width: 100%;
  height: 90%;
  padding: 20px;
  // border: 1px solid red;
}

.modelhelper-container-left-header {
  height: 60%;
  background: url('~@/assets/left.png') no-repeat 80px 10px;
}
// 上传音频弹框
.upload-music {
  width: 100%;
  padding-top: 10px;
  position: relative;
  .item-select-music {
    position: relative;
    #audio-container {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
      cursor: pointer;
      margin-left: 5px;
      margin-top: 5px;
    }
    #audio-container.play {
      background: url('~@/assets/play-icon.png');
    }
    #audio-container.pause {
      background: url('~@/assets/pause-icon.png');
    }
  }
}
.item-select-music::v-deep .el-form-item__content {
  display: flex;
}
// 预加载遮挡层
.loading {
  width: calc(100% - 310px);
  height: calc(100% - 60px);
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 999;
}
.fullloading {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 999;
}
// 侧边栏部分
.editor-aside {
  width: 310px;
  height: calc(100% - 60px);
  background-color: rgba(34, 34, 34, 0.5);
  position: absolute;
  top: 60px;
  z-index: 999;
}

.editor-aside::v-deep span.el-tabs__nav-prev,
.editor-aside::v-deep span.el-tabs__nav-next {
  background-color: rgba(34, 34, 34, 0.5);
  // border: 1px solid rgb(99, 89, 89);
  line-height: 39px;
  color: #fff;
  font-weight: 700;
}

.editor-aside::v-deep span.el-tabs__nav-prev.is-disabled,
.editor-aside::v-deep span.el-tabs__nav-next.is-disabled {
  background-color: rgba(34, 34, 34, 0.1);
}


.el-tabs {
  border: 0;
  height: 100%;
}

.el-tabs::v-deep .el-tabs__header {
  background-color: rgba(34, 34, 34, 0.5);
  border-bottom: 1px solid #000;
}

.el-tabs::v-deep .el-tabs__header .el-tabs__item {
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}

.el-tabs::v-deep .el-tabs__header .el-tabs__item span {
  display: inline-block;
  color: #fff;
}

.el-tabs::v-deep .el-tabs__header .el-tabs__item.is-active {
  background-color: rgba(20, 20, 20, 0.5);
  border-right: 1px solid #000;
  border-left: 1px solid #000;
  border-bottom: 0;
  color: #fff;
}

// tabs选项卡主体部分
.el-tabs::v-deep .el-tabs__content {
  background-color: rgba(34, 34, 34, 0.5);
  // height: 100%;
  height: calc(100% - 39px);
  padding: 10px;
  overflow-y: auto;
}
// tabs选项卡主体部分--滚动条
.el-tabs::v-deep .el-tabs__content::-webkit-scrollbar {
  background: rgba(34, 34, 34, 0.2);
  width: 10px;
}
.el-tabs::v-deep .el-tabs__content::-webkit-scrollbar-thumb {
  width: 9px;
  background-color: rgba(255, 255, 255, .6);
  border-radius: 4px;
}


.el-tabs::v-deep .el-tabs__content .el-tab-pane {
  height: 100%;

}

.tabs-item-container {
  // background-color: rgba(34, 34, 34, 0.5);
  // box-shadow: 1px 1px 1px 1px rgba(34, 34, 34, 0.5);
  // height: 100%;
  @include tabs-item-container;
  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-around;

    li {
      width: 90%;
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        margin-right: 10px;
        width: 120px;
        text-align: right;
      }
    }
  }
}

.tabs-item-container-item {
  display: inline-block;
  width: 130px;
  height: 85px;
  margin-left: 10px;
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  overflow: hidden;
}

// 已选选项卡主体
.select-item {
  position: relative;
  .select-item-type {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 40px;
    line-height: 85px;
    text-align: center;
    color: rgba(255, 255, 255, .5);
  }
}

.select-item .select-item-del {
  position: absolute;
  right: 0;
  top: 0;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background: url('~@/assets/del.png') no-repeat;
  background-color: #ccc;
  cursor: pointer;
}
.select-item .select-item-up-music {
  position: absolute;
  left: 0;
  top: 0;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background: url('~@/assets/music.png') no-repeat;
  background-color: #ccc;
  cursor: pointer;
}
.tabs-item-container-item img {
  width: 100%;
  height: 100%;
}

.tabs-item-container-item video {
  width: 100%;
  height: 100%;
}

// 主体部分
.editor-container {
  width: 100%;
  height: calc(100% - 60px);
}

// 底部编辑栏
.bottom-editor {
  position: fixed;
  bottom: 0;
  right: 0;
  height: 40px;
  background-color: rgba(34, 34, 34, 0.5);
  border: 1px solid #ccc;
}

.bottom-editor .el-form {
  display: flex;
  align-items: center;
}

.bottom-editor .el-form::v-deep .el-form-item {
  margin: 0;
}

.bottom-editor .el-form::v-deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.5);
  border: 0;
  width: 50px;
  height: 25px;
  line-height: 25px;
  color: #fff;
}

// 底部编辑栏按钮
.bottom-editor .bottom-editor-btn {
  margin-left: 20px;
  width: 40px;
  height: 25px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  border: 1px solid #ccc;
  line-height: 25px;
  text-align: center;
  color: black;
}

// 材质其他贴图设置flex模式
.material-set-flex {
  width: 95%;
  padding-top: 10px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  // background-color: pink;


}
.material-set-flex::v-deep span.material-set-radio-title {
  width: 25%;
}
.material-set-flex::v-deep .material-set-radio {
  display: flex;
  width: 70%;
  border-radius: 4px;
  overflow: hidden;
  // 单选框每项
  label.el-radio {
    flex: 1;
    height: 30px;
    margin: 0;
    // 单选圆圈
    span.el-radio__input {
      display: none;
    }
    // 单选文字
    span.el-radio__label {
      padding: 0;
      display: block;
      height: 30px;
      line-height: 30px;
      color: #fff;
      text-align: center;
      background-color: rgba(59, 59, 59);
    }
    // 单选文字悬停
    span.el-radio__label:hover {
      background-color: rgba(59, 59, 59, .5);
    }
  }
  // 单选框每项--选中
  label.el-radio.is-checked span.el-radio__label {
    background-color: #0c0c0c;
    color: #2489f3;
  }
}


// 进度条
.bg {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 60px;
  background-color: rgba(204, 204, 204, .9);
  z-index: 1000;
  div {
    box-sizing: content-box;
  }
}
.bg-dialog {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(204, 204, 204, .9);
  z-index: 1000;
  div {
    box-sizing: content-box;
  }
}
.basic, .dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  margin: auto;
  border-radius: 50%;
  background-color: #fff;
  border: 8px solid #ccc;
}
.left {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 40px;
  height: 80px;
  border-radius: 46px 0 0 46px;
  background-color: transparent;
  border-top: 4px solid #00ccf6;
  border-left: 4px solid #00ccf6;
  border-bottom: 4px solid #00ccf6;
  transform-origin: right center;
  transform: rotate(0deg);
  z-index: 1;
}
.right {
  display: none;
  position: absolute;
  top: -4px;
  right: -4px;
  width: 40px;
  height: 80px;
  border-radius: 0 46px 46px 0;
  background-color: transparent;
  border-top: 4px solid #00ccf6;
  border-right: 4px solid #00ccf6;
  border-bottom: 4px solid #00ccf6;
  transform-origin: left center;
  transform: rotate(0deg);
  z-index: 1;
}
.hide {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 40px;
  height: 80px;
  border-radius: 46px 0 0 46px;
  background-color: #fff;
  border-top: 8px solid #ccc;
  border-left: 8px solid #ccc;
  border-bottom: 8px solid #ccc;
  transform-origin: right center;
  transform: rotate(0deg);
  z-index: 2;
}
.cover {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fff;
  text-align: center;
  line-height: 80px;
  font-size: 18px;
  color: #000;
  z-index: 10;
}
.asideContainer {
  width: calc(100% - 310px);
  position: absolute;
  left: 310px;
  top: 60px;
}
</style>
