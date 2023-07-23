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
<!--        此处要做一个默认是网格开值变成true状态，点击变成网格关值变成flase状态-->
        <el-button size="medium" type="warning">{{$t("showGrid")}}</el-button>
        <el-button size="medium" type="primary" @click="getThumb">{{$t("saveThumb")}}</el-button>
        <el-button size="medium" type="primary" @click="saveConfig">{{$t("saveConfig")}}</el-button>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="editor-aside">
      <el-tabs type="border-card"  v-model="tabName">
        <!-- 场景 -->
        <el-tab-pane :name="$t('scene.label')">
          <span slot="label">
            <i>{{$t("scene.label")}}</i>
          </span>
          <scene
            ref="scene"
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
      ResizeObserver:null
    }},

  watch: {
    tabName(val){
      console.log('tabname:'+val)
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
          console.log('获取模型详情，查看是否打印')
          console.log(res)
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
                console.log('dom width:'+entries[0].contentRect.width)
                modelApi.onDomResize( this.id,entries[0].contentRect.width,entries[0].contentRect.height)
              }
            }, 500))
            modelApi.initDom(this.dom,true,this.id)


            this.path.path=res.data.model
            this.path.texture=res.data.texture
            if (res.data.model==null){
              //直接返回
            }else {
              console.log('请求获取到的数据')
              console.log(res.data)
              this.objJson=JSON.parse(res.data.objJson)
              this.path.suffix=this.getSuffix(res.data.model)
              if(this.path.texture!=null) {
                console.log(JSON.parse(res.data.texture)[0].new)
                this.path.texture = storeGetModel +"/"+ JSON.parse(res.data.texture)[0].new
              }
              // 第一次进行编辑
              if(this.objJson==null||this.objJson==[]) {
                this.initModel(res.data.model)
                    .then(res => {
                      console.log('模型地址：' + res);
                      this.path.path = res;
                      this.path.loading = this.loading
                      modelApi.loadModel(this.path, this.id)
                          .then(res => {
                            this.modelType = res
                            modelApi.initNote(this.notes, this.modelType, this.id)
                            this.renderer.light = modelApi.initLight(this.id)
                            console.log('init light====>')
                            console.log(this.renderer.light)
                            this.renderer.position = modelApi.getCameraPosition(this.id)
                            this.renderer.textures = modelApi.initTextures(this.id)
                            this.material.materialSelectType = res
                          })
                    })
              }else{

              }
              console.log(this.path);
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
  methods: {
    // dom元素尺寸监听函数
    addDomResize(dom, callback){
      console.log('add dom resize')
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
      console.log(modelName)
      const that = this;
      return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', `${storeGetModel}/${modelName}`);
        xhr.send();
        xhr.onreadystatechange = function (e) {
          if (this.readyState === 4 && this.status === 200) {
            that.modelOrigin = this.response;
            that.modelOrigin = that.charCode(that.modelOrigin);
            console.log(that.modelOrigin)
            that.modelOrigin = new Blob([that.modelOrigin]);
            let url = window.URL.createObjectURL(new Blob([that.modelOrigin]));
            console.log(url);
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
      console.log(e);
      modelApi.objChange(e)
    },
    cameraChange(e) {
      console.log(e);
      modelApi.cameraChange(e)
    },
    fogProChange(e) {
      console.log(e);
      modelApi.fogChang(e)
    },
    bgChange(e) {
      console.log(e);
      modelApi.bgChange(e)
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
            console.log('upload image===>'+path)
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
      console.log('change light')
      console.log(light)
      console.log(this.renderer.light)
      this.renderer.light.changeLight(light.index,light.light)
    },
    showPhysicalLight(phyLightFlag){
      modelApi.showPhysicalLight(phyLightFlag,this.id)
    },
    showAmbientLight(ambientLightMoFlag){
      this.renderer.light.showAmbientLight(ambientLightMoFlag)
    },
    changeMaterial(type, material) {
      // console.log(type)
      // console.log(material)
    },
    // 点击导航栏保存配置事件
    async saveConfig() {
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
      api.setModel(data).then(res=>{
        this.$message({
          message: this.$t("saveSuccess"),
          type: 'success',
          duration: 1500
        })
      })
      console.log(uploadResult);

    },
    // 修改每个动画项的switch事件
    animationChange(item) {
      console.log(this.names);
      console.log(item);
    },
    // 单模型创建注释
    createNote() {
      this.$refs.note.createNote()
      console.log('父组件的数组')
      console.log(this.notes)
    },
    // note组件发射过来的选择
    selectNoteItem(item, index) {
      console.log(item);
      console.log(index);
      this.clickNoteItem = true;
      this.noteObj = item;
      this.tagValue = [];
      if (item.tag && typeof item.tag == 'string') {
        this.tagValue = item.tag.split(',');
      }
      this.showEditNote = true;
    },
    // note组件发射过来的改变颜色值事件
    changeNoteItemColor(e, item, index) {
      console.log(e);
      console.log(item);
      console.log(index);
    },
    // 多模型note表单弹框输入生成标签
    changeNoteTag(e) {
      console.log(e)
      this.noteObj.tag = e.join(',');
      console.log(this.noteObj.tag)
    },
    onCanvasTagMouseClick(e) {
      console.log(e)
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
@import '@/styles/mixin.scss';
.map-container {
  width: 100%;
  padding-top: 10px;
  // 单选框选择贴图类型部分: 未设置、图片、颜色
  .select-map-type {
    @include render-collapse-select-radio;
  }
  // 图片贴图设置部分
  .map-set-img {
    width: 100%;
    padding-top: 10px;
    // 图片展示框部分
    .map-set-img-show {
      width: 95%;
      height: 120px;
      margin: 0 auto;
      padding: 10px;
      border: 1px solid  rgb(59, 59, 59);
      border-radius: 4px;
      background-color:  rgba(59, 59, 59, .5);
      // 没有图片展示框
      .map-set-img-show-none,
      .map-set-img-show-has {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        border: 1px dashed rgb(59, 59, 59);
      }
      .map-set-img-show-has {
        div.el-image {
          width: 100%;
          height: 100%;
        }
        div.el-image::v-deep img {
          -webkit-user-drag: none;
        }
      }
    }
  }
  // 颜色设置部分
  .map-set-color {
    width: 95%;
    padding-top: 10px;
    margin: 0 auto;
    .map-set-color-body {
      width: 100%;
      display: flex;
      align-items: center;
      // 颜色选择器
      .el-color-picker {
        height: 32px;
      }
      // 颜色输入框样式
      .map-set-color-input {
        width: 70px;
        height: 28px;
        background-color: #333;
        color: #fff;
        padding: 4px;
        border: none;
        outline: none;
        margin-left: 10px;
        border-radius: 4px;
      }
    }
    .map-set-color-body::v-deep div.el-color-picker__trigger {
      width: 32px;
      height: 32px;
      border: 1px solid #333;
      background: #595959;
    }
  }
}


// 修改按钮默认样式
// 按钮默认样式
// 调节位置和旋转按钮样式
button {
  display: block;
  margin: 8px auto 0;
  width: 95%;
  height: 30px;
  color: #fff;
  background-color: rgba(204, 204, 204, .5);
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: rgba(204, 204, 204, .8);
  text-shadow: 0 0 10px #fff;
  font-style: italic;
  font-weight: 700;
  box-shadow: 0 0 5px #fff;
}
button:active {
  background-color: #ccc;
  font-weight: 500;
  font-style: normal;
  box-shadow: none;
}
button[disabled] {
  cursor: not-allowed;
}
button[disabled]:hover {
  background-color: rgba(204, 204, 204, .5);
  text-shadow: none;
  font-style: normal;
  font-weight: 500;
  box-shadow: none;
}

// 修改弹框默认样式
.upload-img-dialog::v-deep .el-dialog__header {
  height: 30px;
  width: 100%;
  padding: 0;
  background-color: #363636;
  // 弹框标题
  span.el-dialog__title {
    display: inline-block;
    width: 100%;
    height: 30px;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 5px;
    right: 5px;
  }
}
.upload-img-dialog::v-deep .el-dialog {
  background-color: #909090;
  .el-dialog__body {
    padding: 0;
    padding-top: 10px;
    .upload-dialog-body {
      width: 100%;
      padding: 0 10px;
      // 选择图片框
      .upload-image-select {
        width: 100%;
        background-color: rgba(255, 255, 255, .3);
        border: 1px dashed #fff;
        border-radius: 4px;
        height: 300px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        position: relative;
        overflow-y: auto;
        // 没有单选框时的文字提示框
        .upload-image-select-title {
          width: 100%;
          height: 298px;
          line-height: 298px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          color: #fff;
          // background-color: pink;
          font-size: 18px;
          font-weight: 700;
        }
        .el-radio-item-container {
          width: 200px;
          height: 150px;
          position: relative;
          margin: 5px;
        }
        .el-radio-item-container:hover {
          transform: translate(-1px, -1px);
          box-shadow: 0 0 10px #fff;
        }
        // 单选框每项的容器label
        label.el-radio {
          width: 200px;
          height: 150px;
          border: 3px solid #fff;
          border-radius: 4px;
          // margin: 5px;
          background-color: #3b3b3b;
          // 去掉单选框的小圆点
          span.el-radio__input {
            display: none;
          }
          // 图片框
          span.el-radio__label {
            width: 100%;
            height: 100%;
            padding: 0;
            display: inline-block;
            div.el-image {
              width: 100%;
              height: 100%;
            }
            div.el-image::v-deep img {
              -webkit-user-drag: none;
            }
          }
        }
        // 单选框每项hover
        // label.el-radio:hover {
        //   transform: translate(-1px, -1px);
        //   box-shadow: 0 0 10px #fff;
        // }
        // 单选框选中
        label.el-radio.is-checked {
          border: 3px solid #2489f3;
          box-shadow: 0 0 5px #2489f3;
          transform: translate(-2px, -2px);
        }
      }
      // 修改滚动条默认样式
      .upload-image-select::-webkit-scrollbar {
        width: 10px;
        background: rgba(34, 34, 34, 0.2);
      }
      .upload-image-select::-webkit-scrollbar-thumb {
        width: 9px;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 4px;
      }
      // 上传部分
      .image-upload {
        margin-top: 10px;
        button {
          margin: 0;
          width: 96px;
          height: 30px;
          padding: 0;
          span {
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 30px;
          }
        }
        button.el-button:hover {
          color: #fff;
        }
      }
    }
    // 底部取消，确定按钮部分
    .upload-dialog-footer {
      width: 100%;
      padding: 10px 5px 10px;
      display: flex;
      justify-content: space-around;
      button {
        width: 45%;
      }
    }
  }
}

i.del-select-image {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: url('~@/assets/del-select-image.png') no-repeat 2px 2px;

  background-color: #fff;
  z-index: 999;
  cursor: pointer;
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
