<template>
  <div id="model-editor">
    <!-- 顶部导航栏 -->
    <div class="editor-nav">
      <div class="nav-left">
        <a @click="linkToHome">
          <img src="~@/assets/logo.png" :alt="$t('logoName')">
        </a>
        <span>{{$t("modelEditor.label")}}</span>
      </div>
      <div class="nav-right">
        <el-button size="medium" type="info" @click="back">{{$t("exit")}}</el-button>
        <el-button size="medium" type="warning" @click="fullScreen">{{$t("preview")}}</el-button>
        <el-button size="medium" type="warning" @click="changeGrid">{{ getGridTxt }}</el-button>
        <el-button size="medium" type="primary" @click="getThumb">{{$t("saveThumb")}}</el-button>
        <el-button size="medium" type="primary" @click="saveConfig">{{$t("saveConfig")}}</el-button>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="editor-aside">
      <el-tabs type="border-card"  v-model="tabName">
        <!-- 场景 -->
        <el-tab-pane v-if="renderer.objData!=null" :name="$t('scene.label')">
          <span slot="label">
            <i>{{$t("scene.label")}}</i>
          </span>
          <scene
            ref="scene"
            
            :objData="renderer.objData"
            @objChange="objChange"
            @cameraChange="cameraChange"
            @fogProChange="fogProChange"
            @bgChange="bgChange"
          ></scene>
        </el-tab-pane>
        <!-- 材质设置 -->
        <el-tab-pane :name="$t('material.label')">
          <span slot="label">
            <i>{{$t("material.label")}}</i>
          </span>
          <material
            @changeMaterial="changeMaterial"
          >
            <div class="material-select-obj material-set-flex" slot="material-select-obj">
              <span class="material-set-radio-title">     {{$t("material.object")}}</span>
              <el-tooltip effect="dark" placement="top" :content="$t('map.multiModelToolTip')">
                <div class="material-set-radio">
                  <el-radio v-model="material.materialSelectType" :label="item.type" v-for="(item, index) in materialSelectTypeArr" :key="index" >
                    {{ item.name }}
                  </el-radio>
                </div>
              </el-tooltip>
            </div>
          </material>
        </el-tab-pane>
        <!--灯光设置-->
        <el-tab-pane>
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
          </Light>
        </el-tab-pane>
        <!-- 动画 -->
        <!-- <el-tab-pane>
          <span slot="label">
            <i>{{$t("animations.label")}}</i>
          </span>
          <animations
            :names="names"
            @animationChange="animationChange"
          >
          </animations>
        </el-tab-pane> -->
        <!-- 注释 -->
        <el-tab-pane>
          <span slot="label">
            <i>{{$t("note.label")}}</i>
          </span>
          <note
            ref="note"
            :single="modelType"
            :notes="notes"
            @selectNoteItem="selectNoteItem"
            @changeNoteItemColor="changeNoteItemColor"
            @saveEditNote="saveEditNote"
            @delNote="delNote"
          ></note>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- canvas内容区 -->
    <div class="container">
      <!-- 进度条 -->
      <div class="bg" v-show="loading.flag">
        <div id="bg" class="basic">
          <div class="left"></div>
          <div class="right"></div>
          <div class="hide"></div>
          <div class="cover">{{ loading.progress + '%' }}</div>
        </div>
      </div>
      <!-- 编辑多模型注释表单弹框 -->
      <div v-show="showEditNote" class="edit-note aniShowOpt" @click.stop="onCanvasTagMouseClick">
        <el-form v-model="noteObj" size="small">
          <el-form-item prop="label" :label="$t('tag')" width="180">
            {{ noteObj.label }}
          </el-form-item>
          <el-form-item prop="name" :label="$t('name')" width="180">
            <el-input v-model="noteObj.name" :placeholder="$t('namePlace')" />
          </el-form-item>
          <el-form-item prop="description" :label="$t('description')" width="180">
            <el-input v-model="noteObj.description" resize="none" type="textarea" :placeholder="$t('descriptionPlace')" />
          </el-form-item>
          <el-form-item
            prop="size"
            :label="$t('size')"
            width="180"
          >
            <el-input v-model="noteObj.size" :placeholder="$t('sizePlace')" />
          </el-form-item>
          <el-form-item :label="$t('tag')" prop="tag" width="180">
            <el-select v-model="tagValue" clearable multiple filterable allow-create default-first-option :placeholder="$t('tagPlace')" @change="changeNoteTag" />
          </el-form-item>
          <el-form-item>
            <el-button
              style="float:right; margin-top: 10px"
              type="primary"
              size="small"
              @click.stop="changeShow($event)"> 确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-center">

      </div>

    </div>
  </div>
</template>
<script>
import * as api from "@/api/model/model";
import {filePrefix, modelUrl, storeGetModel} from "@/utils/global";
import note from '@/components/common/render/note.vue';
import animations from '@/components/common/render/animations.vue'
import Light from '@/components/common/render/light.vue'
import material from '@/components/common/render/material.vue'
import scene from '@/components/common/render/scene.vue'
import * as fileApi from "@/api/file/file";
import * as modelApi from "@/render/model/model.js"
import {getSize, loadModel} from "@/render/model/model.js";
import {base64ToFile} from "@/utils/imgUtils";

const defaultMultNote = {
  label: '标签',
  name: '',
  description: '',
  size: '',
  tag: ''
};

export default {
  name: 'ModelEditor',
  components: {
    animations,
    Light,
    material,
    scene,
    note
  },
  data() {
    return {
      loading: {
        flag: true,
        progress: 0
      },
      // 单模型模拟注释数组
      // notes: [
      //   { thumb: null, title: '', content: '', sort: '', position: null }
      // ],
      // 多模型模拟注释数组
      // notes: [
      //   { label: '模型1', name: '', description: '', color: '', size: '', tag: null },
      //   { label: '模型2', name: '', description: '', color: '', size: '', tag: null },
      //   { label: '模型3', name: '', description: '', color: '', size: '', tag: null },
      //   { label: '模型4', name: '', description: '', color: '', size: '', tag: null }
      // ],
      notes:[],
      // 模型的动画数组(后续用模型的对象中数组替代)
      names: [
        { name: '旋转', value: true },
        { name: '平移', value: true },
        { name: '抖动', value: true }
      ],
      // 修改多模型表单弹框开关
      showEditNote: false,
      clickNoteItem: false,
      // 修改多模型表单弹框绑定对象
      noteObj: Object.assign({}, defaultMultNote),
      // 修改多模型表单标签绑定数组
      tagValue: [],
      modelOrigin: null,
      test: {
        x: 0,
        y: 0,
        z: 0
      },
      id:null,// 当前模型id
      model:null,//模型渲染对象
      path: {
        suffix:null,
        model: null,
        texture: null
      },//模型素材地址
      dom:null,//渲染对象的dom元素
      material: {
        materialSelectType:null,// 更改的是单个还是多个
        tabFlag:false, //更改的是否是素材栏
        asideFlag:true
      },// 是不是在改单个要选择的模型
        materialSelectTypeArr: [
      {
        type: 0,
        name: this.$t("map.selectOne")
      },
      {
        type: 1,
        name: this.$t("map.selectMore")
      }
    ],
      // 全景模型 || 普通模型开光
      isBindByPano: false,
      // 选中的tab栏名称
      tabName:  this.$t("scene.label"),
      renderer:{
        light:null,// 渲染方面控制灯光相关
        center:null,// 模型中心位
        size:null,// 模型尺寸
        textures:null// 模型材质贴图
      },
      modelType:false,// 模型类型，多child为false
      //修改模型时必须要使用
      downloadStatus:null,
      recommendStatus:null,
      publicStatus:null,
      reviewStatus:null,
      // 编辑器修改内容
      objJson:null,
      // dom 监听
      ResizeObserver:null,
      gridFlag: true
    }},

  watch: {
    tabName(val){
      if(val===this.$t('material.label')){
        this.material.tabFlag=true
        // this.model.changeModelMap(this.material.materialSelectType)
      }else{
        this.material.tabFlag=false
      }
    },
    asideFlag(val){
      this.material.asideFlag=val
    },
    'loading.progress'(val) {
      this.loadingAnimation('basic',val);
      // if (val == 100) {
      //   this.loading.flag = false
      // }
    }
  },
  created() {
    const that = this;
    if (this.$route.query && typeof this.$route.query.id != null && this.$route.query.id != undefined) {
      this.id = this.$route.query.id
    }
    if (this.$route.query&& typeof this.$route.query.flag!=null){
      this.flag=this.$route.query.flag
    }
    window.addEventListener('click', that.otherClick, false);
    this.addFullScreenListener();
    api.getOne(this.id)
        .then(res => {
          if(res.data!=null) {
            this.downloadStatus=res.data.downloadStatus
            this.publicStatus=res.data.publicStatus
            this.recommendStatus=res.data.recommendStatus
            this.reviewStatus=res.data.reviewStatus
            this.dom = document.getElementsByClassName("container-center")[0];
            var config={
              editor:this.flag,
            }
            // 初始化渲染页面
            // 给dom元素添加大小变动监听函数
            this.addDomResize(this.dom, this.debounce((entries) => {
              for (const entry of entries) {
                // console.log('dom width:'+entries[0].contentRect.width)
                modelApi.onDomResize( this.id,entries[0].contentRect.width,entries[0].contentRect.height)
              }
            }, 500))
            modelApi.initDom(this.dom,true,this.id)


            this.path.path=res.data.model
            this.path.texture=res.data.texture
            if (res.data.model==null){
              //直接返回
            }else {
              this.objJson=JSON.parse(res.data.objJson)
              this.path.suffix=this.getSuffix(res.data.model)
              if(this.path.texture!=null) {
                // console.log(JSON.parse(res.data.texture)[0].new)
                this.path.texture = storeGetModel +"/"+ JSON.parse(res.data.texture)[0].new
              }
              // 第一次进行编辑
              if(this.objJson==null||this.objJson==[]) {
                this.initModel(res.data.model)
                    .then(res => {
                      this.path.path = res;
                      this.path.loading = this.loading
                      modelApi.loadModel(this.path, this.id)
                          .then(res => {
                            this.modelType = res
                            modelApi.initNote(this.notes, this.modelType, this.id)
                            this.renderer.objData=modelApi.getData(this.id)
                            console.log(this.renderer.objData)
                            this.renderer.light = modelApi.initLight(this.id)
                            this.renderer.position = modelApi.getCameraPosition(this.id)
                            this.renderer.textures = modelApi.initTextures(this.id)
                            this.material.materialSelectType = res
                          })
                    })
              }else{

              }
            }
          }
        })
  },
  destroyed() {
    window.removeEventListener('keydown', this.listenDel, false)
    window.removeEventListener('keydown', this.keydownForFull, false)
    window.removeEventListener('click', this.otherClick, false);
    window.removeEventListener('fullscreenchange', this.fullscreenchange)
    this.ResizeObserver&&this.ResizeObserver.disconnect()
    modelApi.destory(this.id)

  },
  computed: {
    getGridTxt() {
      return this.gridFlag ? this.$t('showGrid') : this.$t('closeGrid');
    }
  },
  methods: {
    // 网格开 / 关点击事件
    changeGrid() {
      this.gridFlag = !this.gridFlag;
      console.log('点击网格开关'+this.gridFlag)
      modelApi.gridChange(this.id,this.gridFlag)
    },
    // dom元素尺寸监听函数
    addDomResize(dom, callback){
      this.ResizeObserver = new ResizeObserver(entries => {
        if (callback) callback(entries)
      })
      this.ResizeObserver.observe(dom)
    },
    // 窗口监听函数防抖
    debounce(func, wait) {
      let timer
      return function () {
        const context = this // 注意 this 指向
        const args = arguments // arguments中存着e
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, wait)
      }
    },
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
    getSuffix(url){
      url+=""
      return url.substring(url.lastIndexOf('.')+1)
    },
    charCode(str) {
      return Array.from(str).map((item) => {
          return String.fromCharCode(item.charCodeAt(0) ^ 49)
        }).join('')
    },
    async initModel(modelName) {
      const that = this;
      return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', `${storeGetModel}/${modelName}`);
        xhr.send();
        xhr.onreadystatechange = function (e) {
          if (this.readyState === 4 && this.status === 200) {
            that.modelOrigin = this.response;
            that.modelOrigin = that.charCode(that.modelOrigin);
            that.modelOrigin = new Blob([that.modelOrigin]);
            let url = window.URL.createObjectURL(new Blob([that.modelOrigin]));
            resolve(url);
          } else if (this.status !== 200) {
            that.$message({
              message: '获取模型数据失败',
              type: 'error',
              duration: 1500
            });
            reject(null);
          }
        };
      });

    },

    objChange(e) {
      console.log('id:'+this.id)
      modelApi.objChange(this.id,e)
    },
    cameraChange(e) {
      modelApi.cameraChange(this.id,e)
    },
    fogProChange(e) {
      modelApi.fogChange(this.id,e)
    },
    bgChange(e) {
      console.log('e')
      console.log(e)
      modelApi.changeBg(e.type,e.url,this.id)
    },
    playAction(name){
      this.model.animations.getActionByName(name)
    },
    // 显示灯光helper，调节灯光
    adjustPosition(e) {
      // e.type
      // e.index
    },
    back() {
      this.$router.back(-1);
    },
    // 点击查看按钮实现全屏展示功能
    fullScreen() {
      this.requestFullScreen(this.dom)
    },
    // 获取封面
    getThumb(){
      const formData=base64ToFile(this.dom.getElementsByTagName('canvas')[0].toDataURL(),Date.now().toString())
      fileApi.uploadFile('image', formData)
          .then(res => {
            if(res.data==null){
              this.$message({
                message: this.$t("uploadFailWarn"),
                type: 'error',
                duration: 1500
              })
            }
            var path= res.data.filename
            // console.log('upload image===>'+path)
            const data={
              'thumb':res.data.filename,
              'downloadStatus':this.downloadStatus,
              'publicStatus':this.publicStatus,
              'recommendStatus':this.recommendStatus,
              'reviewStatus':this.reviewStatus,
              'id':this.id
            }
             api.setModel(data).then(res=>{
              if (res.data !== null) {
                this.$message({
                  message: this.$t("uploadSuccess"),
                  type: 'success',
                  duration: 1500
                })
              }
            })
          })
          .catch(err => {
            this.$message({
              message: err,
              type: 'error',
              duration: 1500
            })
          })
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
    fullscreenchange () {
      const self = this
      self.fullscreenFlag = !!document.fullscreenElement
      if(self.fullscreenFlag&&this.flag){ // 进入全屏
        this.model.disableControl()
      }else if(this.flag&&!self.fullscreenFlag){
        this.model.enableControl()
      }
    },
    changeAmbientLight(ambientLightMo){
      for(let key in ambientLightMo){
        this.renderer.light.changeLightProperty(this.renderer.light.ambientLightInScene,key,ambientLightMo[key])
      }
    },
    changeLight(light) {
      this.renderer.light.changeLight(light.index,light.light)
    },
    showPhysicalLight(phyLightFlag){
      modelApi.showPhysicalLight(phyLightFlag,this.id)
    },
    showAmbientLight(ambientLightMoFlag){
      this.renderer.light.showAmbientLight(ambientLightMoFlag)
    },
    changeMaterial(type, material) {
      this.renderer.textures.changeMaterial(type,material)
    },
    // 点击导航栏保存配置事件
    async saveConfig() {
      // 获取灯光

      this.objJson={
        obj:modelApi.getData(this.id),
        material:this.renderer.textures.saveTextures(),
        light:this.renderer.light.saveLight(),
        camera:modelApi.getCameraPosition(this.id)
      }
      // model
      let uploadResult = await this.$refs.scene.beforeSaveConfig();
      if (!uploadResult) {
        this.$message({
          message: '上传背景图失败，请稍后重试或联系管理员',
          type: 'error',
          duration: 1500
        });
        return;
      }
      // todo 保存设置
      const data={
        'objJson':this.objJson,
        'downloadStatus':this.downloadStatus,
        'publicStatus':this.publicStatus,
        'recommendStatus':this.recommendStatus,
        'reviewStatus':this.reviewStatus,
        'id':this.id
      }
      console.log('model json')
      console.log(data)
      api.setModel(data).then(res=>{
        this.$message({
          message: this.$t("saveSuccess"),
          type: 'success',
          duration: 1500
        })
      })
    },
    // 修改每个动画项的switch事件
    animationChange(item) {
      console.log(this.names);
      console.log(item);
    },
    // 单模型创建注释
    createNote() {
      this.$refs.note.createNote()
    },
    // note组件发射过来的选择
    selectNoteItem(item, index) {
      this.clickNoteItem = true;
      this.noteObj = item;
      this.tagValue = [];
      if (item.tag && typeof item.tag == 'string') {
        this.tagValue = item.tag.split(',');
      }
      this.showEditNote = true;
    },
    // note组件发射过来的保存注释编辑内容事件
    saveEditNote(item, index) {
      modelApi.changeNoteItem(item,index,this.id)
    },
    delNote(index){
      modelApi.delNote(index,this.id)
    },
    // note组件发射过来的改变颜色值事件
    changeNoteItemColor(e, item, index) {
      console.log(e);
      console.log(item);
      console.log(index);
    },
    // 多模型note表单弹框输入生成标签
    changeNoteTag(e) {
      this.noteObj.tag = e.join(',');
    },
    onCanvasTagMouseClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.clickNoteItem = true;
      this.showEditNote = true;
    },
    otherClick() {
      if (this.clickNoteItem) {
        this.showEditNote = true;
      } else {
        this.showEditNote = false;
      }
      this.clickNoteItem = false;
    },
    changeShow(e) {
      this.showEditNote = false;
      this.noteObj = Object.assign({}, defaultMultNote);
    },
    linkToHome() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
@import '@/styles/mixin.scss';
#model-editor {
  width: 100%;
  height: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;
  // 导航栏部分
  .editor-nav {
    position: relative;
    height: 60px;
    background-color: rgb(111, 109, 109);
    display: flex;
    justify-content: space-between;
    z-index: 900;
    // 左边部分
    .nav-left {
      a {
        display: inline-block;
        height: 100%;
        padding: 15px;
      }
      img {
        vertical-align: middle;
      }
      span {
        display: inline-block;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #fff;
      }
    }
    // 右边部分
    .nav-right {
      display: flex;
      position: relative;
      padding-right: 10px;
      justify-content: space-around;
      align-items: center;
    }
  }
  // 侧边栏部分
  .editor-aside {
    width: 310px;
    height: calc(100% - 60px);
    // background-color: rgba(34, 34, 34, 0.5);
    position: absolute;
    top: 60px;
    z-index: 900;
    // lixin-change
    &::v-deep .el-tabs--border-card>.el-tabs__content {
      padding: 0;
    }
    .el-tabs {
      border: 0;
      height: 100%;
    }

    .el-tabs::v-deep .el-tabs__header {
      background-color: rgba(34, 34, 34, 0.5);
      border-bottom: 1px solid #000;
      .el-tabs__item {
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        span {
          display: inline-block;
          color: #fff;
        }
      }
      .el-tabs__item.is-active {
        background-color: rgba(20, 20, 20, 0.5);
        border-right: 1px solid #000;
        border-left: 1px solid #000;
        border-bottom: 0;
        color: #fff;
      }
    }
    // tabs选项卡主体部分
    .el-tabs::v-deep .el-tabs__content {
      box-sizing: border-box;
      background-color: rgba(34, 34, 34, 0.5);
      // height: 100%;
      height: calc(100% - 39px);
      // lixin-change
      // padding: 10px;
      overflow-y: auto;
      .el-tab-pane {
        height: 100%;
        .tabs-item-container {
          // background-color: rgb(100, 100, 100);
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
      }
    }
  }

  // canvas内容区
  .container{
    width: 100%;
    height: calc(100% - 60px);
    margin-top: 0;
    display: flex;
    background-color: #000;
    position: relative;
    // 修改多模型注释表单弹框
    .edit-note {
      background-color: $color-noteDialog;
      position: absolute;
      z-index: 2;
      width: 220px;
      padding: 10px;
      border: 1px solid $color-noteDialogBorder;
      border-radius: 10px;
      right:0;
      top:60px;
      color:$color-fontMain;
      .special {
        margin-top: 5px;
      }
      .el-form::v-deep .el-form-item--small {
        margin-bottom: 0;
        .el-form-item__label {
          // color: yellow;
          color: $color-ori;
        }
        .el-input__inner,
        .el-textarea__inner {
          background: transparent;
          border:1px solid $color-ori;
          color: $color-fontMain;
        }
      }
    }
    // 主体部分
    .container-center {
      width: 100%;
      height: 100%;
      margin-top: 0;
      display: flex;
      position: relative;
    }
  }
}

// 侧边栏tab栏头部左右箭头按钮
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
.material-set-radio {
  @include render-collapse-select-radio;

}
// 进度条
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(204, 204, 204, .9);
  z-index: 999;
  div {
    box-sizing: content-box;
  }
}
.basic {
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
</style>
