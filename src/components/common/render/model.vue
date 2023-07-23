<template>
  <div class="modelContent" ref="fullDom">
    <!-- 进度条 -->
    <div v-if="showLoading" class="bg" v-show="loading.flag">
      <div id="bg" class="basic">
        <div class="left"></div>
        <div class="right"></div>
        <div class="hide"></div>
        <div class="cover">{{ loading.progress + '%' }}</div>
      </div>
    </div>
    <div :ref="'model-content' + modelId" class="model-canvas" :class="`model${modelId}`"></div>
    <!-- 显示的帮助部分 -->
    <div class="help" v-if="helpFlag">
      <!-- 右上角关闭按钮 -->
      <i class="iconfont icon-guanbi1 closeHelp" @click="closeHelp"></i>
      <!-- 标题 -->
      <div class="help-title">
        <h4>{{ $t('actionNav') }}</h4>
      </div>
      <!-- 帮助内容部分 -->
      <div class="help-content">
        <!-- 左边部分 -->
        <div class="left gestures">
          <i class="iconfont icon-fangda fs_20"></i>
          <p>{{ $t('zoom') }}</p>
          <p>
            {{ $t('zoomDes1') }}
            <br />
            {{ $t('zoomDes2') }}
          </p>
        </div>
        <!-- 中间部分 -->
        <div class="center gestures">
          <i class="iconfont icon-move fs_20"></i>
          <p>{{ $t('move') }}</p>
          <p>
            {{ $t('moveDes1') }}
            <br />
            {{ $t('moveDes2') }}
          </p>
        </div>
        <!-- 右边部分 -->
        <div class="right gestures">
          <i class="iconfont icon-shuaxin1 fs_20"></i>
          <p>{{ $t('rotato') }}</p>
          <p>
            {{ $t('rotatoDes1') }}
            <br />
            {{ $t('rotatoDes2') }}
          </p>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="bottom-action">
        <button type="button" class="btn confirmBtn" @click="resetCamare">{{ $t('buttonAction') }}</button>
      </div>
    </div>
    <!-- 截取封面部分 -->
    <el-tooltip placement="top" :content="$t('saveForThumb')">
      <div v-if="setThumbable" class="set-thumb" @click="capThumb">
        <i class="iconfont icon-xiangji"></i>
        <span>{{ $t('setForThumb') }}</span>
      </div>
    </el-tooltip>
    <!--  -->
    <div class="capThumb aniShowOpt" ref="thumbContainer" v-show="capShow"></div>
    <!-- 底部的功能按钮部分 -->
    <div class="btn-container" v-if="showBtn">
      <!-- 停止旋转 -->
      <el-tooltip :content="rotateFlag ? $t('stopRotate') : $t('startRotate')" placement="top">
        <div class="btn-bottom" @click="stopRotato">
          <i class="iconfont" :class="{'icon-tingzhi': rotateFlag, 'icon-shuaxin': !rotateFlag}"></i>
        </div>
      </el-tooltip>
      <!-- 开启AR -->
      <el-tooltip :content="arFlag ? $t('closeAR') : $t('openAR')" placement="top">
        <div class="btn-bottom" v-if="!isPesudo" @click="openAR">
          <i class="iconfont" :class="{'icon-Dyanjing': !arFlag, 'icon-yanjing2': arFlag}"></i>
        </div>
      </el-tooltip>
      <!-- 帮助 -->
      <el-tooltip :content="$t('openHelp')" placement="top">
        <div class="btn-bottom" v-if="!isPesudo" @click="openHelp">
          <i class="iconfont icon-wenhao"></i>
        </div>
      </el-tooltip>
      <!-- 查看方式 -->
      <div class="btn-bottom"  v-if="user && !isPesudo && modelBg.length > 0">
        <el-tooltip :content="$t('checkType')" placement="top">
          <i class="iconfont icon-liulan" @click="clickType"></i>
        </el-tooltip>
        <!-- 背景切换部分 -->
        <div class="model-bg-container aniShowOpt" v-show="bgFlag">
          <div class="title">{{ $t('bgChange') }}</div>
          <div class="model-bg-content">
            <i class="iconfont icon-sanjiaoleft arr left" @click="modelBgLeft"></i>
            <div class="model-bg-select">
              <div ref="bgContent" class="model-bg-select-content">
                <el-radio class="model-bg-select-item" v-for="(item, index) in modelBg" :key="index" v-model="bg" :label="item.path">
                  <img :src="getImg(item.path)" @click="changeBg(item.type,getImg(item.path),id)" />
                </el-radio>
              </div>
            </div>
            <i class="iconfont icon-sanjiaoright arr right" @click="modelBgRight"></i>
          </div>
          <!-- 底部的小箭头 -->
          <div class="arrow"></div>
        </div>
      </div>

      <!-- 开启VR -->
      <el-tooltip :content="vrFlag ? $t('closeVR') : $t('openVR')" placement="top">
        <div class="btn-bottom" v-if="!isPesudo" @click="openVR">
          <i class="iconfont" :class="{'icon-VR': !vrFlag, 'icon-VRFilled': vrFlag}"></i>
        </div>
      </el-tooltip>
      <!-- 全屏展示 -->
      <el-tooltip :content="!fullScreenFlag ? $t('openFullScreen') : $t('closeFullScreen')" placement="top">
        <div class="btn-bottom" @click="openFullScreen">
          <i class="iconfont " :class="{'icon-quanping': !fullScreenFlag, 'icon-tuichuquanping': fullScreenFlag}"></i>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { getModelDetail, getModelBg } from '@/api/model/model.js';
import { getFile } from '@/api/store/store.js';
import {
  storeGetModel,
  filePrefix,
  image
} from '@/utils/global.js';
import * as modelApi from "@/render/model/model.js"
import { uploadFile } from '@/api/file/file.js';
import { setModel } from '@/api/model/model.js';
import {resetCamera} from "@/render/model/model.js";
import { changeJson } from '../../../render/threejsR96/changeJson';
export default {
  name: 'Model',
  props: {
    id: {
      type: Number,
      required: true
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    setThumb: {
      type: Boolean,
      default: false
    },
    showLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      random: null,
      loading: {
        flag: true,
        progress: 0
      },
      // 是否有用户系统
      user: false,
      // 当前用户是否已登录
      isLogin: false,
      // 是否渲染设置封面图的dom部分
      setThumbable: false,
      modelId: null,
      model: null,
      modelBg: [],
      modelDom:null,// 模型渲染dom元素
      path: {
        suffix:null,
        path: null,
        texture: null
      },
      // 帮助部分开关
      helpFlag: false,
      // 模型背景图绑定
      bg: null,
      // 是否显示背景选择框开关
      bgFlag: false,
      // 是否全屏开关
      fullScreenFlag: false,
      // 是否旋转开关
      rotateFlag: true,
      // 伪3d开启旋转保存定时器
      rotateTimer: null,
      // 是否开启AR开关
      arFlag: false,
      // 是否开启VR开关
      vrFlag: false,
      url: null,
      capShow: false,
      // 窗口监听器
      ResizeObserver:null,
      // 模型是否是伪3d(model.type为1)
      isPesudo: false,
      // 伪3d控制对象
      pesudo: {
        images: null,
        index: 0,
        start: 0,
        end: 0,
        mouseX: 0,
        canvas: null,
        ctx: null,
        mousedown: null,
        mousemove: null,
        mouseup: null,
        //canvas原来的宽高
        widthSource:0,
        heightSource:0
      },
      objJson:null//修改的保存数据
    }
  },
  created() {
    this.initConfig();
    this.modelId = this.id;
  },
  mounted() {
    this.modelDom=this.$refs["model-content" + this.modelId];
    this.getModel();
    console.log(this.$refs.thumbContainer.clientWidth)
  },
  computed: {
    getImg() {
      return function (src) {
        return src ? filePrefix + image + src : '';
      }
    }
  },
  destroyed() {
    this.path.path=null
    this.ResizeObserver&&this.ResizeObserver.disconnect()
    // modelApi.destory(this.modelId);
    if (this.model.type != 1) {
      modelApi.destory(this.modelId);
    } else {
      document.removeEventListener('mouseup', this.pesudo.mouseup, false);
      this.pesudo.canvas.removeEventListener('mousedown', this.pesudo.mousedown, false);
      this.pesudo.canvas.removeEventListener('mousemove', this.pesudo.mousemove, false);
      // 清除伪3d自动旋转定时器
      this.rotateTimer && (this.closePesudoRotate());
      this.rotateTimer = null;
      // 释放保存的伪3d Blob图片
      if (Array.isArray(this.pesudo.images) && this.pesudo.images.length > 0) {
        for (const item of this.pesudo.images) {
          window.URL.revokeObjectURL(item.blobSrc);
        }
      }
      
    }
  },
  watch: {
    'loading.progress'(val) {
      if (this.showLoading) {
        this.loadingAnimation('basic',val);
      } else {
        return;
      }
      // if (val == 100) {
      //   this.loading.flag = false
      // }
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
      // cover.innerText = value + "%";
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
    initConfig() {
      let user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user : false;
      this.isLogin = !!this.$store.getters.token;
    },
    charCode(str) {
      return Array.from(str).map((item) => {
        return String.fromCharCode(item.charCodeAt(0) ^ 49)
      }).join('')
    },
    // 获取模型后缀名
    getSuffix(url){
      url+=""
      return url.substring(url.lastIndexOf('.')+1)
    },
    async initModel(modelName,modelSuffix) {
      const that = this;
      return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', `${storeGetModel}/${modelName}`);
        xhr.send();
        xhr.onreadystatechange = function (e) {
          if (this.readyState === 4 && this.status === 200) {
            that.modelOrigin = this.response;
            if(modelSuffix!='stl'){
              that.modelOrigin = that.charCode(that.modelOrigin);
            }
            that.modelOrigin = new Blob([that.modelOrigin]);
            // add
            // let modelBlob = new Blob([that.modelOrigin]);
            // let url = window.URL.createObjectURL(new Blob([that.modelOrigin]));
            let url = window.URL.createObjectURL(that.modelOrigin);
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
    // 判断修改是否渲染设置封面图的dom
    getSetThumbable() {
      if (!this.user) {
        this.setThumbable = false;
        return;
      } else if (!this.isLogin) {
        this.setThumbable = false;
        return;
      } else {
        let inforRes = this.$store.getters.userInfo;
        if (inforRes) {
          this.setThumbable = JSON.parse(inforRes).id == this.model.userId;
          return;
        } else {
          this.$dispatch('getInfo')
            .then(res => {
              this.setThumbable = res.id == this.model.userId;
            })
        }
      }
    },
    // 获取模型数据
    getModel() {
      const that =this
      getModelDetail(this.modelId)
        .then(async(res) => {
          if (res.code === 20000) {
            console.log('获取模型详情')
            this.model = res.data;
            
            console.log( res.data.objJson.indexOf('scene'))
            await new Promise((resolve, reject) =>{
              if( res.data.objJson.indexOf('scene')!=-1){
                changeJson(res.data.objJson).then(res => {
                  this.objJson=res
                  resolve(this.objJson)
                })
              }else{
                this.objJson=res.data.objJson
                resolve(this.objJson)
              }
            })
            console.log('objJson=====>')
            console.log(this.objJson)
            let lightProperty=null;//获取之前保存的灯光属性
            if((this.objJson!=null)&&(this.objJson.light!=null)){
              lightProperty=this.objJson.light
            }
            this.getSetThumbable();
            this.user && (this.getModelBg());
            // 初始化canvas
            // modelApi.initDom(this.modelDom,this.showBtn,this.modelId)
            if (res.data.model==null){
              //直接返回
            } else if (res.data.type == 1) {
              this.isPesudo = true;
              // 该模型为伪3d模型
              this.initPseudo3d();
            } else {
              // 给dom元素添加大小变动监听函数
              this.addDomResize(this.modelDom, this.debounce((entries) => {
              for (const entry of entries) {
                  modelApi.onDomResize( this.id,entries[0].contentRect.width,entries[0].contentRect.height)
                }
              }, 500));
              modelApi.initDom(this.modelDom,this.showBtn,this.modelId)
              this.path.suffix=this.getSuffix(res.data.model)
              if((res.data.texture!=null)&&(res.data.texture!="")) {
                // todo this texture 结构
                // this.path.texture = storeGetModel +"/"+ res.data.texture.split(",")[0]
                if(JSON.parse(res.data.texture).length>0){
                  this.path.texture = storeGetModel +"/"+ JSON.parse(res.data.texture)[0].new
                }
              }
                if(this.path.suffix=='stl'){
                    this.path.path=`${storeGetModel}/${res.data.model}`
                    this.path.loading=this.loading
                    modelApi.loadModel( this.path,this.modelId)
                          .then(res => {
                            modelApi.initLight(that.modelId,lightProperty)
                            modelApi.getCameraPosition(that.modelId)
                            modelApi.initTextures(that.modelId)
                          })
                }else{
                this.initModel(res.data.model,this.path.suffix)
                    .then(res => {
                      this.path.path = res;
                      this.path.loading=this.loading
                      this.revokeBlob(this.modelOrigin);
                      modelApi.loadModel( this.path,this.modelId)
                          .then(res => {
                            modelApi.initLight(that.modelId,lightProperty)
                            modelApi.getCameraPosition(that.modelId)
                            modelApi.initTextures(that.modelId)
                          })
                    })
                  }
          
            }
          } else {
            this.$message({
              message: this.$t('initModelFail'),
              type: 'success',
              duration: 1500
            });
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: this.$t('initModelFail'),
            type: 'error',
            duration: 1500
          });
        })
    },
    // 获取伪3d模型的图片组数据
    initPseudo3d() {
      const that = this;
      let modelFilename = this.model.model,
          result = JSON.parse(this.model.texture).match(/(?<start>\d+)_(?<end>\d+)_\.(?<suffix>\w*)/);
      const promiseArr = [];
      for (let i = +result.groups.start; i <= +result.groups.end;i++) {
        promiseArr.push(new Promise((resolve, reject) => {
          getFile(`${modelFilename}_1_${i}.${result.groups.suffix}`)
            .then(res => {
              if (res.status === 200) {
                resolve({
                  blobSrc: window.URL.createObjectURL(res.data, res.data.type)
                });
              } else {
                reject(false);
              }
            })
            .catch(err => {
              reject(err);
            });
        }));
      }
      this.pesudo.canvas = document.createElement('canvas');
      this.pesudo.canvas.width = this.modelDom.clientWidth;
      this.pesudo.widthSource=this.modelDom.clientWidth
      this.pesudo.heightSource=this.modelDom.clientHeight
      this.pesudo.canvas.height = this.modelDom.clientHeight;
      this.modelDom.appendChild(this.pesudo.canvas);
      this.pesudo.ctx = this.pesudo.canvas.getContext('2d');
      Promise.all(promiseArr)
        .then(res => {
          let image = new Image();
          this.pesudo.images = res;
          this.pesudo.index = 0;
          this.pesudo.end = res.length - 1;
          image.src = res[0].blobSrc;
          image.onerror = function (e) {
            console.log(e)
          };
          // 给dom元素添加大小变动监听函数
          this.addDomResize(this.modelDom, entries => {
            for (const entry of entries) {
              this.pesudo.canvas.width = entry.contentRect.width;
              this.pesudo.canvas.height = entry.contentRect.height;
              // this.pesudo.canvas.style.width = `${entry.contentRect.width}px`;
              // this.pesudo.canvas.style.height = `${entry.contentRect.height}px`;
              this.pesudo.ctx.clearRect(0, 0, this.pesudo.widthSource, this.pesudo.heightSource);
              this.pesudo.widthSource=entry.contentRect.width
              this.pesudo.heightSource=entry.contentRect.height
              this.updateAnimationFrame(this.pesudo.index, entry.contentRect.width, entry.contentRect.height);
            }
          })
          image.onload = function () { 
            that.pesudo.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, that.pesudo.canvas.offsetWidth, that.pesudo.canvas.offsetHeight);
            that.loading.progress = 100;
            that.loading.flag = false;
            that.pesudo.mousedown = that.mouseDown.bind(that);
            that.pesudo.mousemove = that.mouseMove.bind(that);
            that.pesudo.mouseup = that.mouseUp.bind(that);
            that.pesudo.canvas.addEventListener('mousedown', that.pesudo.mousedown, false);
            that.pesudo.canvas.addEventListener('mousemove', that.pesudo.mousemove, false);
            // that.pesudo.canvas.addEventListener('mouseup', that.pesudo.mouseup, false);
            document.addEventListener('mouseup', that.pesudo.mouseup, false);
            // 初始化页面后渲染出第一次画面开始判断有无初始旋转
            that.rotateFlag && (that.setPesudoRotate());
          };
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initPesudoFail'),
            type: 'error',
            duration: 1500
          });
        });
    },
    mouseDown(e) {
      this.pesudo.click = true;
      this.pesudo.mouseX = e.x;
    },
    mouseMove(e) {
      if (!this.pesudo.click) {
        return;
      } else {
        if (this.isOutOfEl(e, this.pesudo.canvas)) {
          this.pesudo.click = false;
          this.pesudo.mouseX = 0;
          return;
        }
        // 鼠标移动的距离
        let distance = e.x - this.pesudo.mouseX,
        // dom元素宽度 / 图片的份数
            basic = Math.round(this.pesudo.canvas.offsetWidth / (this.pesudo.end + 1));
        if (distance > 0 && Math.abs(distance) > basic) {
          this.pesudo.index++;
          this.pesudo.index > this.pesudo.end && (this.pesudo.index = 0);
          this.updateAnimationFrame(this.pesudo.index);
        } else if (distance < 0 && Math.abs(distance) > basic) {
          this.pesudo.index--;
          this.pesudo.index < 0 && (this.pesudo.index = this.pesudo.end);
          this.updateAnimationFrame(this.pesudo.index);
        }
      }
    },
    mouseUp(e) {
      this.pesudo.click = false;
      this.pesudo.mouseX = 0;
    },
    // 渲染画布回调
    updateAnimationFrame(index, width, height) {
      const that = this;
      let image = new Image();
      image.src = this.pesudo.images[index].blobSrc;
      image.onload = function () {
        let domWidth = width ? width : that.pesudo.canvas.offsetWidth,
            domHeight = height ? height: that.pesudo.canvas.offsetHeight;
        that.pesudo.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, domWidth, domHeight);
      }
    },
    // 判断鼠标移动事件中是否移动到了元素外
    isOutOfEl(event, dom) {
      const { width, height, x, y} = dom.getBoundingClientRect();
      let clientX;
      let clientY;
      if (event.changedTouches) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      if (clientY > y + height - 15 || clientY < y + 15 || clientX < x + 15 || clientX > x + width - 15 ) {
        return true;
      } else {
        return false;
      }
    },
    // 有用户系统下根据model.userId获取模型背景图
    getModelBg() {
      getModelBg(this.model.userId)
        .then(res => {
          if (res.code === 20000) {
            this.modelBg = res.data;
          }
        })
    },
    getStoreModel() {
      const that = this;
      let xhr = new XMLHttpRequest();
      xhr.open('get', `${storeGetModel}/${this.model.model}`);
      xhr.onreadystatechange = function (e) {
        if (this.readyState === 4 && this.status === 200) {
          that.modelOrigin = this.response;
          //that.modelOrigin = that.modelOrigin ^ 49;


          this.modelOrigin = new Blob([that.modelOrigin]);
        } else if (this.status !== 200) {
          that.$message({
            message: '获取模型数据失败',
            type: 'error',
            duration: 1500
          });
        }
      };
      xhr.send();
    },
    // 释放之前选择文件的blob
    revokeBlob(blob) {
      if (blob) {
        window.URL.revokeObjectURL(blob);
      }
    },
    // 点击打开帮助
    openHelp() {
      this.helpFlag = true;
    },
    // 点击右上角关闭帮助
    closeHelp() {
      this.helpFlag = false;
    },
    // 点击停止旋转
    stopRotato() {
      this.rotateFlag = !this.rotateFlag;
      if (this.model.type != 1) {
        modelApi.changeAutoRotate(this.modelId,this.rotateFlag)
      } else {
        if (!this.rotateFlag) {
          Array.isArray(this.pesudo.images) && this.closePesudoRotate();
        } else {
          Array.isArray(this.pesudo.images) && this.setPesudoRotate();
        }
      }
    },
    // 开启伪3d旋转定时器
    setPesudoRotate() {
      const that = this;
      !this.rotateTimer && (this.rotateTimer = setInterval(function () {
        that.pesudo.index++;
        that.pesudo.index > that.pesudo.end && (that.pesudo.index = 0);
        that.updateAnimationFrame(that.pesudo.index);
      }, 300));
    },
    closePesudoRotate() {
      this.rotateTimer && (clearInterval(this.rotateTimer));
      this.rotateTimer = null;
    },
    // 点击开启AR
    openAR() {
      this.arFlag = !this.arFlag;
    },
    // 点击开启VR
    openVR() {
      this.vrFlag = !this.vrFlag;
      modelApi.changeVr(this.modelId,this.vrFlag)
    },
    // 帮助部分底部重置相机按钮点击
    resetCamare() {
      modelApi.resetCamera(this.modelId);
    },
    changeBg(type,path,modelId){
      modelApi.changeBg(type,path,modelId)
    },
    // 点击查看方式
    clickType() {
      this.bgFlag = !this.bgFlag;
    },
    // 点击模型背景图左边按钮
    modelBgLeft() {
      const content = this.$refs.bgContent;
      if (content.offsetLeft >= 0) {
        return;
      } else {
        let left = +content.style.left.slice(0, content.style.left.search('px'));
        content.style.left = `${left + 26}px`;
        content.style.transition = 'left 300ms ease';
      }
    },
    // 点击模型背景图右边按钮
    modelBgRight() {
      const content = this.$refs.bgContent;
      if (content.offsetLeft <= -content.offsetWidth) {
        return;
      } else {
        let left = +content.style.left.slice(0, content.style.left.search('px'));
        content.style.left = `${left - 26}px`;
        content.style.transition = 'left 300ms ease';
      }

    },
    // 点击开启全屏
    openFullScreen() {
      const dom = this.$refs.fullDom;
      if (!this.fullScreenFlag && dom) {
        // console.dir(dom);
        this.enterFull(dom);
      } else if (this.fullScreenFlag && dom) {
        this.exitFull(dom);
      }
    },
    enterFull(ele) {
      if (ele.requestFullScreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.msRequestFullScreen) {
        ele.msRequestFullscreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      }
      this.fullScreenFlag = true;
    },
    exitFull() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.fullScreenFlag = false;
    },
    // 截取封面图
    capThumb() {
      let file = this.createThumb();
      let formData = new FormData();
      formData.append('file', file);
      uploadFile('image', formData)
        .then(res => {
          if (res.code === 20000) {
            const model = JSON.parse(JSON.stringify(this.model));
            model.thumb = res.data.filename;
            Array.isArray(model.categorys) && (model.category = model.categorys.map(item => item.id).join(''));
            setModel(model)
              .then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: this.$t('setModelThumbSuc'),
                    type: 'success',
                    duration: 1500
                  });
                  const container = this.$refs.thumbContainer;
                  container.className = "capThumb aniCloseOpt";
                  const that = this;
                  setTimeout(function () {
                    that.capShow = false;
                    container.removeChild(container.firstElementChild);
                  }, 3000);
                  file = null;
                  formData = null;
                }
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  message: this.$t('setModelThumbFail'),
                  type: 'error',
                  duration: 1500
                });
                const container = this.$refs.thumbContainer;
                container.className = "capThumb aniCloseOpt";
                const that = this;
                setTimeout(function () {
                  that.capShow = false;
                  container.removeChild(container.firstElementChild);
                }, 3000);
              })
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('setModelThumbFail'),
            type: 'error',
            duration: 1500
          });
          const container = this.$refs.thumbContainer;
          container.className = "capThumb aniCloseOpt";
          const that = this;
          setTimeout(function () {
            that.capShow = false;
            container.removeChild(container.firstElementChild);
          }, 3000);
        });
    },
    createThumb() {
      let dom = document.getElementsByTagName('canvas')[0];
      const container = this.$refs.thumbContainer;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // canvas.width = dom.clientWidth;
      // canvas.height = dom.clientHeight;
      canvas.width = dom.width;
      canvas.height = dom.height;
      ctx.drawImage(dom, 0, 0);
      //=====>
      const dataurl = canvas.toDataURL("image/png");
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      //<=====
      const that=this
      canvas.toBlob(function (blobObj) {
        that.url = window.URL.createObjectURL(blobObj);
        window.URL.revokeObjectURL(blobObj);
        const img = document.createElement('img');
        img.src = that.url;
        img.style.width = "100%";
        img.style.height = "auto";
        container.appendChild(img);
        container.className = "capThumb aniShowOpt";
        that.capShow = true;
      });
      return new File([u8arr], 'caputure.png', {type: mime});
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';

.modelContent {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  // 背景透明
  background-color: transparent;
  // 装canvas的dom元素
  .model-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    canvas {
      -webkit-user-drag: none;
    }
  }
  // 显示的帮助部分
  .help {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 7;
    background-color: $color-helpBg;
    color: $color-fontHelp;
    cursor: pointer;
    // 关闭按钮
    .closeHelp {
      cursor: pointer;
      position: absolute;
      top: 5px;
      right: 10px;
    }
    // 标题
    .help-title {
      width: 100%;
      display: flex;
      justify-content: center;
      h4 {
        padding: 0;
        margin: 10px 0;
        font-size: 16px;
      }
    }
    // 内容部分
    .help-content {
      display: flex;
      justify-content: center;
      .gestures {
        flex: 1 1 0;
        font-size: 12px;
        text-align: center;
      }
    }
    // 底部按钮
    .bottom-action {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 10px;
      text-align: center;
      width: 100%;
    }
  }
  // 底部的功能按钮部分
  .btn-container {
    height: 30px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    z-index: 3;
    .btn-bottom {
      margin-right: 5px;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background-color: $color-modelBtn;
      color: $color-fontMain;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      position: relative;
    }
  }
}
.fs_20 {
  font-size: 20px;
}
.model-bg-container {
  position: absolute;
  width: 180px;
  height: 60px;
  background-color: $color-modelBtn;
  top: -70px;
  left: -80px;
  border-radius: 10px;
  .title {
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
    font-size: 14px;
    text-align: left;
  }
  .arrow {
    width: 0;
    height: 0;
    border-top: 6px solid $color-modelBtn;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    position: absolute;
    bottom: -6px;
    left: 87px;
  }
  .model-bg-content {
    box-sizing: border-box;
    width: 160px;
    height: 24px;
    margin: 2px auto;
    font-size: 12px;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
    overflow: hidden;
    .arr {
      width: 20px;
      height: 24px;
      display: inline-block;
      text-align: center;
      line-height: 24px;
      position: absolute;
      top: 0;
      color: $color-fontMain;
      background-color: $color-helpBg;
    }
    .left {
      left: 0;
      z-index: 1;
    }
    .right {
      right: 0;
      z-index: 1;
    }
    .model-bg-select {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      .model-bg-select-content {
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        line-height: 0;
        height: 100%;
        .model-bg-select-item {
          height: 100%;
          width: 24px;
          margin: 0;
          display: inline-block;
          margin: 0 2px;
          &::v-deep .el-radio__input {
            display: none;
          }
          &::v-deep .el-radio__label {
            box-sizing: border-box;
            padding: 0;
            width: 100%;
            height: 100%;
            display: inline-block;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .model-bg-select-item.is-checked::v-deep .el-radio__label {
          border: 2px solid $color-main;
        }
      }

    }
  }
}
.capThumb {
  position: absolute;
  top: 80px;
  left: 20px;
  width: 250px;
  max-height: 150px;
  // height: 150px;
  border: 5px solid #666;
  overflow: hidden;
  img {
    width: 100%!important;
    height: auto;
  }
}
.set-thumb {
  height: 30px;
  background-color: $color-adaptBorder;
  position: absolute;
  top: 40px;
  left: 20px;
  z-index: 2;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  i {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin: 0 10px;
  }
  span {
    // display: inline-block;
    display: none;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin: 0 10px 0 0;
  }
  &:hover span {
    display: inline-block;
  }
}
// 进度条
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(204, 204, 204, .9);
  z-index: 900;
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
}
// .left {
//   position: absolute;
//   top: -4px;
//   left: -4px;
//   width: 40px;
//   height: 80px;
//   border-radius: 46px 0 0 46px;
//   background-color: transparent;
//   border-top: 4px solid #00ccf6;
//   border-left: 4px solid #00ccf6;
//   border-bottom: 4px solid #00ccf6;
//   transform-origin: right center;
//   transform: rotate(0deg);
//   z-index: 1;
// }
// .right {
//   display: none;
//   position: absolute;
//   top: -4px;
//   right: -4px;
//   width: 40px;
//   height: 80px;
//   border-radius: 0 46px 46px 0;
//   background-color: transparent;
//   border-top: 4px solid #00ccf6;
//   border-right: 4px solid #00ccf6;
//   border-bottom: 4px solid #00ccf6;
//   transform-origin: left center;
//   transform: rotate(0deg);
//   z-index: 1;
// }
// .hide {
//   position: absolute;
//   top: -8px;
//   left: -8px;
//   width: 40px;
//   height: 80px;
//   border-radius: 46px 0 0 46px;
//   background-color: #fff;
//   border-top: 8px solid #ccc;
//   border-left: 8px solid #ccc;
//   border-bottom: 8px solid #ccc;
//   transform-origin: right center;
//   transform: rotate(0deg);
//   z-index: 2;
// }
// .cover {
//   position: absolute;
//   width: 80px;
//   height: 80px;
//   border-radius: 50%;
//   background-color: #fff;
//   text-align: center;
//   line-height: 80px;
//   font-size: 18px;
//   color: #000;
//   z-index: 10;
// }
</style>
