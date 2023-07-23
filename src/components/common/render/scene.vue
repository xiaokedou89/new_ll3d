<template>
  <div class="tabs-item-container">
    <el-collapse accordion>
      <!-- 常规 -->
      <el-collapse-item :title="$t('scene.convention')">
        <!-- 折叠栏主体部分 -->
        <div class="collapse-item-container">
          <!-- 95%居中对齐 -->
          <div class="collapse-set">
            <!-- 旋转部分 -->
            <div class="item">
              <!-- 文字 -->
              <span class="label">{{ $t('model.rotate') }}</span>
              <!-- 复位图标 -->
              <i class="iconfont icon-shuaxin reset" @click="rotationReset"></i>
              <div class="position-container">
                <el-tooltip effect="dark" placement="top" :content="$t('model.xRotation')">
                  <el-input-number v-model="obj.rotation.x" :step="0.1" :precision="1" :min="0" :max="360" @change="objChange"></el-input-number>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('model.yRotation')" placement="top">
                  <el-input-number v-model="obj.rotation.y" :step="0.1" :precision="1" :min="0"  :max="360" @change="objChange"></el-input-number>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('model.zRotation')" placement="top">
                  <el-input-number v-model="obj.rotation.z" :step="0.1" :precision="1" :min="0" :max="360" @change="objChange"></el-input-number>
                </el-tooltip>
              </div>
              <!-- 底部按钮 -->
              <div class="bottom-group">
                <button type="button" @click="objChange">{{ $t('model.changeRotate') }}</button>
              </div>
            </div>
            <!-- 位置部分 -->
            <div class="item">
              <!-- 文字 -->
              <span class="label">{{ $t('model.position') }}</span>
              <!-- 复位图标 -->
              <i class="iconfont icon-shuaxin reset" @click="positionReset"></i>
              <div class="position-container">
                <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                  <el-input-number v-model="obj.position.x" :step="0.1" :precision="1" @change="objChange"></el-input-number>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('light.yPosition')" placement="top">
                  <el-input-number v-model="obj.position.y" :step="0.1" :precision="1" @change="objChange"></el-input-number>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('light.zPosition')" placement="top">
                  <el-input-number v-model="obj.position.z" :step="0.1" :precision="1" @change="objChange"></el-input-number>
                </el-tooltip>
              </div>
              <!-- 底部按钮 -->
              <div class="bottom-group">
                <button type="button" @click="objChange">{{ $t('model.changePosition') }}</button>
              </div>
            </div>
            <!-- 比例部分 -->
            <div class="item">
              <!-- 文字 -->
              <span class="label">{{ $t('model.scale') }}</span>
              <!-- 复位图标 -->
              <i class="iconfont icon-shuaxin reset" @click="scaleReset"></i>
              <div class="position-container">
                <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                  <el-input-number v-model="obj.scale.x" :step="0.01" :min="0.01" @change="scaleChange"></el-input-number>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('light.yPosition')" placement="top">
                  <el-input-number v-model="obj.scale.y" :step="0.01" :min="0.01" @change="scaleChange"></el-input-number>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('light.zPosition')" placement="top">
                  <el-input-number v-model="obj.scale.z" :step="0.01" :min="0.01" @change="scaleChange"></el-input-number>
                </el-tooltip>
              </div>
              <!-- 底部按钮 -->
              <div class="bottom-group">
                <button type="button" @click="objChange">{{ $t('model.changeScale') }}</button>
                <!-- 等比例修改 -->
                <div class="scalable-container">
                  <!-- 勾选框 -->
                  <a class="scalable" @click="changeScalable">
                    <i class="iconfont icon-duigou1 scale-icon" v-show="scalable"></i>
                  </a>
                  <span>{{ $t('model.scaleLabel') }}</span>
                </div>
              </div>
            </div>
            <!-- 调节放大部分 -->
            <div class="item">
              <!-- 文字 -->
              <span>{{ $t('model.cameraScale') }}</span>
              <!-- 调节相机广角滑块部分 -->
              <div class="el-slider-group">
                <!-- 滑块 -->
                <el-slider
                  v-model="camera.fov"
                  :step="1"
                  :min="0"
                  :max="179"
                  :precision="0"
                  @change="cameraChange"
                ></el-slider>
                <!-- 数字输入框 -->
                <el-input-number
                  v-model="camera.fov"
                  :step="1"
                  :min="0"
                  :max="179"
                  :precision="0"
                  label="label"
                  @change="cameraChange"
                ></el-input-number>
              </div>
              <!-- 模型放大缩小部分 -->
              <div class="model-scale">
                <!-- 文字 -->
                <span>{{ $t('model.modelScale') }}</span>
                <!-- 放大部分 -->
                <div class="flex-item">
                  <span>{{ $t('model.scaleUp') }}</span>
                  <el-input-number
                    v-model="camera.max"
                    :step="1"
                    :precision="0"
                    label="label"
                    @change="cameraChange"
                  ></el-input-number>
                </div>
                <!-- 缩小部分 -->
                <div class="flex-item">
                  <span>{{ $t('model.scaleDown') }}</span>
                  <el-input-number
                    v-model="camera.min"
                    :step="1"
                    :precision="0"
                    label="label"
                    @change="cameraChange"
                  ></el-input-number>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <!-- 背景 -->
      <el-collapse-item :title="$t('scene.background')">
        <!-- 折叠栏主体部分 -->
        <div class="collapse-item-container">
          <!-- 95%居中对齐 -->
          <div class="collapse-set">
            <!-- 背景类型文字显示部分 -->
            <div class="item">
              <p>{{ $t('model.bgType') + '：' }} <span style="font-weight: bold">{{ getBgTypeLabel }}</span> </p>
            </div>
            <!-- 当前背景图展示 -->
            <div class="item">
              <div class="image-show">
                <!-- 当前没有背景图 -->
                <div class="image-show-none" v-if="!bg.url"></div>
                <!-- 展示当前背景 -->
                <div class="image-show-has" v-else>
                  <!-- <el-image :src="getImgSrc(bg.url)" fit="contain"></el-image> -->
                  <el-image :src="getImgSrc(bg.url)" fit="contain"></el-image>
                </div>
              </div>
            </div>
            <!-- 切换全景背景/图片背景单选框 -->
            <div class="item">
              <div class="type-select">
                <el-radio
                  v-model="bg.type"
                  :label="item.value"
                  v-for="(item, index) in bgTypes"
                  :key="index"
                >
                  <span>{{ item.name }}</span>
                </el-radio>
              </div>
            </div>
            <!-- 全景背景下雾颜色部分 -->
            <div class="item panorama-fog" v-if="bg.type === 0">
              <span>{{ $t('model.fogColor') }}</span>
              <el-color-picker color-format="rgb"  v-model="fogPro.color" @change="fogProChange"></el-color-picker>
            </div>
            <!-- 全景背景下雾浓度部分 -->
            <div class="item" v-if="bg.type === 0">
              <!-- 文字 -->
              <span>{{ $t('model.fogPotency') }}</span>
              <!-- 滑块部分 -->
              <div class="el-slider-group">
                <!-- 滑块 -->
                <el-slider
                  v-model="fogPro.density"
                  :step="0.05"
                  :min="0"
                  :max="10"
                  :precision="2"
                  @change="fogProChange"
                ></el-slider>
                <!-- 数字输入框 -->
                <el-input-number
                  v-model="fogPro.density"
                  :step="0.05"
                  :min="0"
                  :max="10"
                  :precision="2"
                  label="label"
                  @change="fogProChange"
                ></el-input-number>
              </div>
            </div>
            <!-- 按钮部分 -->
            <div class="item">
              <!-- 选择/上传按钮 -->
              <button type="button" @click="openDialog">{{ $t('model.selectUpload') }}</button>
              <!-- 恢复默认按钮 -->
              <button type="button" @click="bgReset">{{ $t('model.reset') }}</button>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 选择/上传背景图弹框 -->
    <el-dialog
      class="upload-img-dialog"
      @opened="dialogOpened"
      :visible.sync="dialogFlag"
      :modal-append-to-body="false"
      :before-close="dialogBeforeClose"
      title="选择/上传背景"
    >
      <!-- 弹框主体 -->
      <div class="upload-dialog-body">
        <!-- 选择图片部分 -->
        <div class="upload-image-select">
          <!-- 数组中没有选项时显示 -->
          <div class="upload-image-select-title" v-if="dialogImgs.length === 0">
            {{$t("map.clickImg")}}{{$t("map.uploadImg")}} {{$t("comma")}}{{$t("map.setYourMap")}}
          </div>
          <!-- 图片单选框 -->
          <div class="el-radio-item-container"  v-for="(item, index) in dialogImgs" :key="index">
            <!-- <i class="del-select-image"></i> -->
            <el-radio v-model="selectBg" :label="item.url" :key="index">
              <el-image :src="getImgSrc(item.url)" fit="contain"></el-image>
            </el-radio>
          </div>
        </div>
        <div class="file-selecter">
          <!-- 选择文件input -->
          <input class="file-input" ref="filer" type="file" accept="image/png" @change="selectFile" />
          <button class="file-btn" type="button" @click="openSelect">选择本地图片</button>
          <p class="file-desc">{{ $t('image.uploadRestrictions') }}</p>
        </div>

        <!-- $t("image.uploadRestrictions") -->
        <!-- image/png, image/png, image/jpeg -->

      </div>
      <!-- 弹框底部 -->
      <div class="upload-dialog-footer">
        <button type="button" @click="cancelSelect">{{ $t('cancel') }}</button>
        <button type="button" @click="confirmSelect">{{ $t('confirm') }}</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { filePrefix,sceneObj, image, sceneCamera, sceneFogPro, sceneBg } from '@/utils/global.js';
import { i18n } from '@/assets/languages/i18n.js';
import { uploadFace, delFile } from '@/api/file/file.js';

// 初始化场景对象
let defaultScene = {
  obj: sceneObj,
  camera: sceneCamera,
  fogPro: sceneFogPro,
  bg: sceneBg
};

export default {
  name: 'Scene',
  props: {
    // 传入的场景对象
    scene: {
      type: Object,
      default() {
        return defaultScene
      }
    },objData:{
      type:Object,
      require:true
    }
  },
  data() {
    return {
      // 场景绑定对象
      obj: null,
      // 相机属性绑定对象
      camera: null,
      // 雾化属性绑定对象
      fogPro: null,
      // 背景属性绑定对象
      bg: null,
      // 是否等比例开关
      scalable: false,
      // bg对象type单选框选择数组
      bgTypes: [
        { name: this.$t('model.panoramaBg'), value: 0 },
        { name: this.$t('model.imageBg'), value: 1 }
      ],
      uploadUrl: "",
      // 选择背景图弹框开关
      dialogFlag: false,
      // 弹框图片选择绑定数组
      dialogImgs: [],
      // 背景弹框单选图片绑定值
      selectBg: null,
      // 全景背景图数据
      panoramas: [],
      // 图片背景图数据
      images: [],
      // 本地选择的全景图对象
      panoramaStatic: {},
      // 本地选择的图片对象
      imageStatic: {}
    }
  },
  computed: {
    getImgSrc() {
      return function (src) {
        return /^blob/g.test(src) ? src : filePrefix + image + src;
      }
    },
    // 根据bg对象的type返回对应的类型label文字
    getBgTypeLabel() {
      return this.bg.type ? this.$t('model.imageBg') : this.$t('model.panoramaBg');
    }
  },
  created() {
    this.scene !== null && (defaultScene = JSON.parse(JSON.stringify(this.scene))); 
    this.scene.obj= Object.assign({}, this.objData);
    console.log('objData')
    console.log(this.objData)
    console.log(this.scene)
    this.initScene();
  },
  watch: {
    'bg.type'(val) {
      this.dialogImgs = val ? this.images : this.panoramas;
    }
  },
  methods: {
    // 根据props传进来的scene场景对象初始化对应绑定的对象
    initScene() {
      this.obj = JSON.parse(JSON.stringify(this.scene.obj));
      this.camera = JSON.parse(JSON.stringify(this.scene.camera));
      this.fogPro = JSON.parse(JSON.stringify(this.scene.fogPro));
      this.bg = JSON.parse(JSON.stringify(this.scene.bg));
    },
    // 旋转复位点击事件
    rotationReset() {
      this.obj.rotation = Object.assign({}, defaultScene.obj.rotation);
      this.objChange();
    },
    // 位置复位点击事件
    positionReset() {
      this.obj.position = Object.assign({}, defaultScene.obj.position);
      this.objChange();
    },
    // 比例复位点击事件
    scaleReset() {
      this.obj.scale = Object.assign({}, defaultScene.obj.scale);
      this.objChange();
    },
    // 背景图复位点击事件
    bgReset() {
      this.bg = Object.assign({}, defaultScene.bg);
      this.bgChange();
    },
    // 发射obj对象内属性改变事件
    objChange() {
      this.$emit('objChange', this.obj);
    },
    // 比例值改变事件
    scaleChange(e) {
      if (this.scalable) {
        this.obj.scale.x = e;
        this.obj.scale.y = e;
        this.obj.scale.z = e;
      }
      this.objChange();
    },
    // 发射相机camera对象内属性改变事件
    cameraChange() {
      this.$emit('cameraChange', this.camera);
    },
    // 发射雾化对象fogPro内部属性改变事件
    fogProChange() {
      this.$emit('fogProChange', this.fogPro);
    },
    // 发射背景图对象bg内部属性改变事件
    bgChange() {
      this.$emit('bgChange', this.bg);
    },
    // 勾选等比例选择框事件
    changeScalable() {
      this.scalable = !this.scalable;
    },
    openDialog() {
      this.dialogFlag = true;
    },
    // 背景图选择弹框打开动画后回调
    dialogOpened() {
      // 清除input的文件
      this.$refs.filer.value = ''
    },
    openSelect() {
      this.$refs.filer.click();
    },
    // 图片选择弹框选择本地图片事件
    selectFile(e) {
      let file = e.target.files[0];
      if (!/image/g.test(file.type)) {
        this.$message({
          message: this.$t('model.selectFileWarn'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      let url = window.URL.createObjectURL(file),
          form = new FormData(),
          fileName = file.name;
      form.append('file', e.target.files[0]);
      form.append('fileName', fileName);
      if (this.bg.type) {
        this.revokeBlob(this.imageStatic.url);
        this.imageStatic.url = url;
        this.imageStatic.form = form;
        this.imageStatic.fileName = fileName;
        this.images.findIndex(item => item.form) < 0 && (this.images.push(this.imageStatic));
      } else {
        this.revokeBlob(this.panoramaStatic.url);
        this.panoramaStatic.url = url;
        this.panoramaStatic.form = form;
        this.panoramaStatic.fileName = fileName;
        this.panoramas.findIndex(item => item.form) < 0 && (this.panoramas.push(this.panoramaStatic));
      }
      // 清空选择可以重新选择
      e.target.value = '';
      this.$forceUpdate();
    },
    // 释放之前选择文件的blob
    revokeBlob(blob) {
      if (blob) {
        window.URL.revokeObjectURL(blob);
      }
    },
    dialogBeforeClose(done) {
      this.selectBg = null;
      done();
    },
    // 点击图片弹框取消事件
    cancelSelect() {
      this.dialogFlag = false;
      this.selectBg = null;
    },
    // 点击图片弹框确认事件
    confirmSelect() {
      if (!this.selectBg) {
        this.$message({
          message: this.$t('model.selectBgNone'),
          type: 'warning',
          duration: 1500
        });
        return
      }
      this.bg.url = this.selectBg;
      this.bgChange();
      this.dialogFlag = false;
      this.selectBg = null;
    },
    // 父组件点击保存配置时回调
    async beforeSaveConfig() {
      /*
        1、判断当前使用的背景图是否是本地图片==>根据bg.type对比
        2、上传本地图片成功后修改bg.url，发送bgChange || 或者返回上传成功后的文件名
        3、删除之前的bg.url无论成功与否
      */
      console.log('scene的test事件被调用')
      if (this.bg.url === defaultScene.bg.url) {
        return Object.assign({}, this.bg);
      }
      let form = null;
      if (/^blob/.test(this.bg.url)) {
        form = this.bg.type ? this.imageStatic.form : this.panoramaStatic.form;
        let res = await uploadFace(form);
        if (res.code === 20000) {
          delFile('image', defaultScene.bg.url)
            .then(res => {
              console.log('删除原背景图');
              console.log(res);
            });
          return {
            type: this.bg.type,
            url: res.data.filename
          };
        } else {
          return null;
        }
      } else {
        return Object.assign({}, this.bg);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';
// 引入修改折叠栏默认样式
@include el-collapse;
// 引入修改位置输入框默认样式
@include render-position-input-number;
// 引入侧边栏渲染相关按钮样式
@include render-button;
// 引入侧边栏滑块数字输入组
@include render-slider-group-align;
// 引入侧边栏背景图展示区域样式
@include image-show;
// 引入上传选择图片弹框修改样式
@include el-dialog;
.collapse-set {
  width: 95%;
  margin: 0 auto;
  // 每个修改项
  .item {
    margin-top: 10px;
    position: relative;
    // 复原的圆圈小图标
    .reset {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      font-weight: bold;
    }
    // 三个输入框的外层容器
    .position-container {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
    }
    // 底部按钮的容器
    .bottom-group {
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 2px solid #444;
    }
  }
}
// 等比例修改部分(勾选框和文字)
.scalable-container {
  margin-top: 10px;
  @include flex-align-center;
  // 勾选框
  .scalable {
    display: inline-block;
    background-color: #333;
    border-radius: 4px;
    font-size: 18px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    margin-top: -2px;
    .scale-icon {
      color: $color-main;
    }
  }
  // 文字
  span {
    margin-left: 10px;
  }
}

// 模型缩放部分
.model-scale {
  margin-top: 10px;
  .flex-item {
    margin-top: 8px;
    @include flex-align-center;
    .el-input-number {
      margin-left: 10px;
    }
  }
  @include render-input-number;
}

// 背景下--切换全景/图片背景单选框部分
.type-select {
  @include render-collapse-select-radio;
  width: 100%;
}
// 背景下--全景雾颜色容器部分
.panorama-fog {
  width: 100%;
  @include flex-align-center;
  @include render-collapse-color-picker;
}

// 弹框主体upload-dialog-body下选择文件input部分
.file-selecter {
  margin-top: 10px;
  // 隐藏原生input file
  .file-input {
    display: none;
  }
  // 修改button替换原生input
  .file-btn {
    width: 150px;
  }
  .file-desc {
    padding: 5px;
    color: $color-fontMain;
  }
}
</style>
