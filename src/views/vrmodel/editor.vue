<template>
  <div id="vr-model-editor">

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
              <td>{{$t("mouse.clickLeft")}}</td>
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
              <td>{{$t("keyboard.w")}}</td>
              <td>{{$t("keyboard.changePosition")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.e")}}</td>
              <td>{{$t("keyboard.changeRotate")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.r")}}</td>
              <td>{{$t("keyboard.changeScale")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.q")}}</td>
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
    <el-dialog :visible.sync="modelhelperFlag" class="helper-father" width="30%">
      <div class="modelhelper-container">
        <div class="modelhelper-container-left">
          <div class="modelhelper-container-left-header"></div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("mouse.clickLeft")}}</td>
              <td>{{$t("mouse.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressLeft")}}</td>
              <td>{{$t("mouse.rotate")}}</td>
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
        <!-- 保存设置 -->
        <el-tooltip v-if="isArListFlag" :content="$t('saveConfig')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-save" @click="setSave"></span>
        </el-tooltip>
        <!-- 全屏开关 -->
        <el-tooltip :content="$t('preview')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-full" @click="fullScreen"></span>
        </el-tooltip>
        <!-- 退出 -->
        <el-tooltip :content="$t('exit')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-exit" @click="back"></span>
        </el-tooltip>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div v-show="asideFlag&&isArListFlag" class="editor-aside">
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
                  draggable="true"
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
                  @dragstart="videoDragStart($event, item, index)"
              />
              <video :src="getCommonSrc(item.path)" class="tabs-item-video"  crossorigin="anonymous" controls loop></video>
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
                  draggable="true"
                  @dragstart="modelDragStart($event, item)"
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
            v-if="modelPanorama!=null&&modelPanorama.textures!=null"
            :materialTypeProp="modelPanorama.textures.materialsFront.type"
            :model="modelPanorama.textures.flag"
            @changeMaterial="changeMaterial"
            :material="modelPanorama.textures.materialsFront"
          >
            <div class="material-select-obj material-set-flex" slot="material-select-obj">
              <span class="material-set-radio-title">{{$t("material.object")}}</span>
              <el-tooltip effect="dark" placement="top" :content="$t('multiModelToolTip')">
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
          <light
              v-if="modelPanorama!=null&&modelPanorama.light!=null"
              :isBindByPano="isBindByPano"
              :lights="modelPanorama.light.lightSaveNode"
              @changeAmbient="changeAmbientLight"
              @changeLight="changeLight"
              @showPhysicalLight="showPhysicalLight"
              @showAmbientLight="showAmbientLight"
          >
          </light>
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
    <div
        v-if="loading.flag"
        v-loading="loading.flag"
        element-loading-background="rgba(0, 0, 0, 0.8)"
          :element-loading-text="$t('modelLoading')"
        :class="{loading: asideFlag&&isArListFlag, fullloading: !(asideFlag&&isArListFlag)}"
    ></div>
    <!-- canvas内容区 -->
    <div class="container">
      <div
          class="editor-container"
          @dragover="allDrop"
          @drop.prevent="fileDrop"
      >
      </div>
      <!-- 模型旋转遮挡层 -->
      <div v-show="modelShowFlag.show"  class="show-model-dialog" style="background-color: coral" @click.stop.prevent>
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

import {
  common,
  globalUrl,
  filePrefix,
  image,
  model,
  videoMaterial,
  imgMaterial,
  modelMaterial,
  renderType
} from "@/utils/global.js";
import * as api from '@/api/vr/vr.js'
import * as materialApi from '@/api/material/material.js'
import light from '@/components/common/render/light.vue'
import material from '@/components/common/render/material.vue'
import Vue from 'vue'
import listitem from "@/components/common/listItem/listitem";
import Model from "@/views/model";
import {ModelRender} from "@/render/ModelRender";
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
  name: 'editor',
  inject: ['reload'],
  components: {
    light,
    material
  },
  data() {
    return {
      // 选中的tab栏名称
      tabName:  this.$t("image.label"),
      material: {
        materialSelectType:0,// 更改的是单个还是多个
        tabFlag:false, //更改的是否是素材栏
        asideFlag:true
      },// 是不是在改单个要选择的模型
      materialSelectTypeArr: [
        {
          type: 0,
          name: this.$t("map.selectOne")
        }
        // ,
        // {
        //   type: 1,
        //   name: this.$t("map.selectOne")
        // }
      ],
      // 全景模型 || 普通模型开光
      isBindByPano: false,
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
        flag: true
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
      modelPanorama: null,
      materialPanoramas: [],// 全景当中所使用的素材
      panoConfig: null,// 全景配置
      saveData: null,
      flag:null,//判断是否是编辑状态
      fullscreenFlag: false //判断全屏状态
    };
  },
  watch: {
    tabName(val){
      if(val===this.$t('material')){
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
    if (this.$route.params && typeof this.$route.params.id != null) {
      this.id = this.$route.params.id
    }
    if (this.$route.query&& typeof this.$route.query.flag!=null){
      this.flag=this.$route.query.flag
    }
    api.getVrModel(this.id)
        .then(res => {
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
          }
          const container = document.getElementsByClassName("editor-container")[0];
          const modelShow=document.getElementsByClassName("show-model-container")[0];
          var data=JSON.parse(res.data.path)

          var pano = {
            path: null,
            url: null
          };
          pano.path=filePrefix + model+data.modelName
          if(data.mapName!=null&&data.mapName.length>0) {
            pano.url = filePrefix + model + data.mapName[0]
          }
          this.modelPanorama = new ModelRender();
          // this.refresh()
          this.modelPanorama.init(container,renderType.webgl);
          this.modelPanorama.loadVrModel(pano.path,pano.url).then(res => {
            // console.log("res:"+res)
           if(res.finish) {
             this.loading.flag = false
           }
          });
          // this.modelPanorama.loadMaterial(this.sceneGroup.scene)
          // this.refresh()
        })
    this.isArListFlag = this.$route.query.flag === 'false' ? false : true
    window.addEventListener('keydown', this.listenDel, false)
  },
  destroyed() {
    window.removeEventListener('keydown', this.listenDel, false)
    window.removeEventListener('keydown', this.keydownForFull, false)

    window.removeEventListener('fullscreenchange', this.fullscreenchange)
  },
  computed: {
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
    // tab栏点击事件
    tabsClick() {
      // 判断tabName是不是材质
      console.log(this.tabName)
    },
    // 模型材质渲染对象单选框值改变事件
    materialSelectTypeChange(e) {
      // 0 为单模型
      // 1 为全部模型
      console.log(e)
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
      // materialApi.getMaterialList('model', {
      //   pkId: 0,
      //   size: 50
      // })
      //     .then(res => {
      //       if (res.code === 20000 && res.data !== null) {
      //         this.modelList = res.data
      //       }
      //     })

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
      this.modelPanorama.changeAnti(this.sceneGroup.anti)
    },
    // 模拟步行速度值改变事件
    speedChange(e) {
      this.modelPanorama.changeSpeed(this.sceneGroup.speed)
    },
    // 导航栏保存按钮事件
    setSave() {
      this.sceneGroup.light=this.modelPanorama.light.saveLight()
      this.sceneGroup.scene = this.modelPanorama.saveMaterial()
      this.sceneGroup.textures=this.modelPanorama.textures.saveTextures()
      this.panoConfig.sceneGroup = JSON.stringify(this.sceneGroup)
      this.panoConfig.materialPanoramas=JSON.stringify(this.materialPanoramas)
      const data={
        panoConfig:this.panoConfig,
        materials:[]
      }
      const materialEntry={
        materialId:null,
        type:null,
        panoramaId:null
      }
      // 素材的保存
      var map = new Map();
      for(var i=0;i<this.materialPanoramas.length;i++){
        // console.log(this.materialPanoramas[i])
        if(this.materialPanoramas[i].music!=null){
          map.set(this.materialPanoramas[i].music.id,this.materialPanoramas[i].music.type)
        }
        map.set(this.materialPanoramas[i].materialId,this.materialPanoramas[i].type)
      }

      map.forEach((v,k)=>{
        materialEntry.materialId=k
        materialEntry.type=v
        materialEntry.panoramaId=this.id
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
      this.modelPanorama.removeObj(index)
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
      this.modelPanorama.placeMusic(music)
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
      if(this.modelPanorama.isEditor()){
        //  todo警告框退出编辑状态才可以
        return
      }else {
        const ele = document.getElementsByClassName('container')[0]
        this.requestFullScreen(ele)
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
      self.fullscreenFlag = !!document.fullscreenElement
      if(self.fullscreenFlag&&this.flag){ // 进入全屏
        this.modelPanorama.disableControl()
      }else if(this.flag&&!self.fullscreenFlag){
        this.modelPanorama.enableControl()
      }
    },
    // 底部编辑栏输入框值改变事件
    changeScale(e) {
      if (e != null && e != "") {
        this.modelPanorama.changeGeometryScale(e)
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
    // 图片拖拽起始事件退
    imgDragStart(e, item,index) {
      e.dataTransfer.setData("src",item.path);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("index", index);
      e.dataTransfer.setData("thumb", item.thumb);
      e.dataTransfer.setData("path", item.path);
      e.dataTransfer.setData("type", imgMaterial);
    },
    // 视频拖拽起始事件
    videoDragStart(e, item, index) {
      e.dataTransfer.setData("src", item.url);
      e.dataTransfer.setData("type", videoMaterial);
      e.dataTransfer.setData("index", index);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("thumb", item.thumb);
      e.dataTransfer.setData("path", item.path);
    },
    // 模型拖拽起始事件
    modelDragStart(e, item) {
      e.dataTransfer.setData("src", item.path);
      e.dataTransfer.setData("type", modelMaterial);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("thumb", item.thumb);
    },
    // 模型展示div接受拖拽事件
    fileDrop(e) {
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
        planes = this.modelPanorama.placeMaterial( type, {
          x: e.x,
          y: e.y,
          index:index
        }, dom);
      }
      if (type === imgMaterial) {
        planes = this.modelPanorama.placeMaterial( type, {
          x: e.x,
          y: e.y,
          index:index
        }, this.getImgSrc(src));
      }
      if (type === modelMaterial) {
        let srcJson= JSON.parse(src)
        srcJson.id=materialId
        planes = this.modelPanorama.placeMaterial( type, {
          x: e.x,
          y: e.y
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
        this.modelPanorama.changeGeometryScale(this.bottomSet.scale)
      }
    },
    changeAmbientLight(ambientLightMo){
      for(let key in ambientLightMo){
        this.modelPanorama.light.changeLightProperty(this.modelPanorama.light.ambientLightInScene,key,ambientLightMo[key])
      }
    },
    changeLight(light) {
      this.modelPanorama.light.changeLight(light.index,light.light)
    },
    showPhysicalLight(phyLightFlag){
      this.modelPanorama.light.showPhysicalLight(phyLightFlag)
    },
    showAmbientLight(ambientLightMoFlag){
      this.modelPanorama.light.showAmbientLight(ambientLightMoFlag)
    },
    changeMaterial(type, material) {
      this.modelPanorama.textures.changeMaterial(type,material)
    }
  },
};
</script>
<style lang="scss" scoped>
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
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 2px solid #fff;
      background: url("~@/assets/model-close.png") no-repeat 3px 3px;
      background-color: rgba(34, 34, 34, 0.4);
      box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
      cursor: pointer;
      position: absolute;
      right: 50px;
      top: 50px;
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
  background-color: rgba(34, 34, 34, 0.5);
  box-shadow: 1px 1px 1px 1px rgba(34, 34, 34, 0.5);
  height: 100%;

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
</style>
