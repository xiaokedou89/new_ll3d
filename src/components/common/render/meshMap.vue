<template>
  <div class="map-container">
    <!-- 单选框选择贴图类型:不设置、图片、颜色 -->
    <div class="select-map-type">
      <el-radio v-model="mapType" v-for="(item, index) in mapTypeArr" :label="item.type" :key="index" @change="mapTypeChange">
        {{ getMapType(item.type)}}
      </el-radio>
    </div>
    <!-- 图片贴图设置 -->
    <div v-if="meshMap.map !== null && mapType === 'img'" class="map-set-img">
      <!-- 图片展示框 -->
      <div class="map-set-img-show">
        <!-- 没有图片时显示 -->
        <div v-if="meshMap.map.src === null" class="map-set-img-show-none"></div>
        <!-- 有图片时显示 -->
        <div v-else class="map-set-img-show-has">
          <!-- <el-image
            :src="getImgSrc(meshMapImgThumb)"
            fit="contain"></el-image> -->
          <!-- getStoreFile -->
          <el-image
            :src="getStoreFile(meshMapImgThumb)"
            fit="contain"></el-image>
        </div>
      </div>
      <button @click="showUpLoadImgMap">{{$t("map.useMap")}}</button>
      <button @click="unsetImgMap">{{$t("map.unsetMap")}}</button>
      <button v-if="originMap.src !== null" @click="recoverImgMap">{{$t("map.originMap")}}</button>
      <!-- 上传贴图并选择贴图弹框 -->
      <el-dialog
        class="upload-img-dialog"
        :title="$t('map.uploadUseMap')"
        :visible.sync="upLoadImgMapFlag"
        v-if="upLoadImgMapFlag"
        :modal-append-to-body="false"
      >
        <!-- 弹框主体 -->
        <div class="upload-dialog-body">
          <!-- 选择图片框 -->
          <div class="upload-image-select">
            <!-- 没有上传图片时的文字提示框 -->
            <div class="upload-image-select-title" v-if="meshMap.map.mapArr.length === 0">{{$t("map.clickImg")}}{{$t("map.uploadImg")}} {{$t("comma")}}{{$t("map.setYourMap")}} </div>
            <!-- 图片单选框 -->
            <div class="el-radio-item-container" v-for="(item, index) in meshMap.map.mapArr" :key="index">
              <!-- <i class="del-select-image" @click.stop="delImageSelect(item, index, $event)"></i> -->
              <i class="del-select-image" @click.stop="delImgSelect(item, index, $event)"></i>
              <!-- <el-radio v-model="saveSrc" :label="item.filename" :key="index" @change="selectImgMap($event, item)"> -->
              <el-radio v-model="saveSrc" :label="item" :key="index" @change="selectImgMap($event, item)">
                <!-- <el-image :src="getImgSrc(item.thumbnail)" fit="contain">
                </el-image> -->
                <el-image :src="getStoreFile(item)" fit="contain"></el-image>
              </el-radio>
            </div>
          </div>
          <!-- <el-upload
            class="image-upload"
            ref="upload"
            :multiple="true"
            :on-success="imageUploadSuccess"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            accept="image/png, image/png, image/jpeg"
            :action="uploadUrl"
          >
            <el-button class="image-upload-button">{{$t("clickUpload")}}</el-button>
            <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
          </el-upload> -->
          <!-- 新的上传贴图部分 -->
          <div class="img-upload">
            <!-- <el-button>{{$t("clickUpload")}}</el-button> -->
            <input 
              type="file"
              ref="imgUpload" 
              style="display: none"
              accept=".jpg, .png, .jpeg"
              @change="selectImgFile"
            />
            <button :disabled="uploadFileProgress" @click="clickSelect">{{ $t("clickUpload") }}</button>
            <!-- 下方显示的上传进度条 -->
            <div class="progress-container" :class="{aniShowOpt: uploadFileProgress}" v-show="uploadFileProgress">
              <!-- 显示进度数值 -->
              <span class="progress-percentage">{{ `${uploadFilePercentage} %` }}</span>
              <!-- 显示进度条 -->
              <div class="progress-content">
                <div class="progress-inner" ref="progressInner"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="upload-dialog-footer">
          <button @click="cancelSelectImgMap">{{$t("cancel")}}</button>
          <button @click="handleSelectImgMap">{{$t("confirm")}}</button>
        </div>
      </el-dialog>
      
    </div>
    <!-- 颜色贴图设置 -->
    <div v-if="meshMap.map !== null && mapTypeArr.length > 2 && mapType === 'color'" class="map-set-color">
      <div class="map-set-color-body">
        <el-color-picker v-model="meshMap.map.color" @change="mapColorChange"></el-color-picker>
        <el-tooltip effect="dark" :content="$t('map.colorTooltip')" placement="top">
          <input class="map-set-color-input" type="text" maxlength="7" v-model="meshMap.map.color" @change="mapColorChangeInput">
        </el-tooltip>
      </div>
      <button @click="unsetColorMap">{{$t("map.unsetColorMap")}}</button>
      <button v-if="originMap.color !== null" @click="recoverColorMap">{{$t("map.useOriginColor")}}</button>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/file/file'
import { 
  filePrefix, 
  image, 
  globalUrl, 
  mapType, 
  uploadUrl, 
  imageUploadLint, 
  chineseSignReg,
  storeFile,
  storeGetModel
} from '@/utils/global.js'
import { getFileToken } from '@/api/user/user.js';
const defaultColorType = {
  type: 'color'
}
export default {
  name: 'meshMap',
  props: {
    // 传入是否有颜色贴图选择布尔值
    hasColor: {
      type: Boolean,
      default: true
    },
    // 传入是什么贴图
    mapCategory: {
      type: String,
      require: true
    },
    // 贴图对象
    map: {
      type: Object,
      default() {
        return {
          src: null,
          color: null,
          mapArr: []
        }
      }
    }
  },
  created() {

    // 判断是否传入了颜色选项的开关，如果有就添加
    if (this.hasColor) {
      this.mapTypeArr.push(defaultColorType)
    }
    this.originMap = Object.assign({}, this.transformOriginMap(this.mapCategory, this.map))
  },
  computed: {
    // 根据type回显对应文字
    getMapType() {
      return function (type) {
        let name = ''
        if (type === 'unset' || type === null) {
          name = this.$t("unset")
        } else if (type === 'img') {
          name = this.$t("map.label")
        } else {
          name = this.$t("color")
        }
        return name
      }
    },
    getImgSrc() {
      return function (src) {
        return filePrefix + image + src
      }
    },
    getStoreFile() {
      return function (src) {
        return `${storeGetModel}/${src}`;
      }
    }
  },
  watch: {
    map(map) {
      this.meshMap.map = Object.assign({}, this.transformOriginMap(this.mapCategory, map))
      this.originMap = Object.assign({}, this.transformOriginMap(this.mapCategory, this.map))
      this.imgFileList = this.meshMap.map.mapArr
      this.saveSrc = null
      this.saveThumbnail = null
      this.saveThumb = null;
      this.meshMapImgThumb = this.meshMap.map.src
    },
    hasColor(flag) {
      if (flag) {
        this.mapTypeArr.length === 2 && (this.mapTypeArr.push(defaultColorType))
      } else {
        this.mapTypeArr.length === 3 && (this.mapTypeArr.pop())
        this.meshMap.map.color = null
      }
    }
  },
  data() {
    return {
      // 传入的map对象保存值
      originMap: null,
      // 上传图片贴图选择的src
      saveSrc: null,
      // 上传图片贴图选择的src
      saveThumbnail: null,
      saveThumb: null,
      // 图片贴图单选框绑定数组
      imgFileList: [],
      // 上传图片的url
      uploadUrl: uploadUrl + '/file/upload/image',
      // 上传贴图弹框开关
      upLoadImgMapFlag: false,
      // 可选择的贴图类型数组
      mapTypeArr: [
        {
          type: 'unset'
        },
        {
          type: 'img'
        }
      ],
      // 选择贴图类型绑定变量
      mapType: 'img',
      meshMap: {
        category: this.mapCategory,
        map: Object.assign({}, this.transformOriginMap(this.mapCategory, this.map))
      },
      meshMapImgThumb: null,
      uploadFile: null,
      uploadFileUrl: storeFile,
      // 控制显示上传进度条开关
      uploadFileProgress: false,
      uploadFilePercentage: 0
    }
  },
  methods: {
    // 将threejs 给的颜色color.r color.g color.b 转换成color的16进制
    transformOriginColor(colorVar) {

      if(colorVar===null){
        return colorVar
      }
      var strReg=/^#/;
      if(strReg.test(colorVar)){
        return colorVar
      }

      var s="rgb("+(Math.round((colorVar.r)*255))+","+(Math.round((colorVar.g)*255))+","+(Math.round((colorVar.b)*255))+")"
      // RGB颜色值的正则
      var reg = /^(rgb|RGB)/;
      var color = s;
      var strHex = "#";


      if (reg.test(color)) {

        // 把RGB的3个数值变成数组
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
          var hex = Number(colorArr[i]).toString(16);
          if (hex === "0") {
            hex += hex;
          }
          strHex += hex;
        }
      }
       return strHex;
    },
    transformColor(color) {
      let newColor = null
      if (typeof color === 'string') {
        let r = color.slice(1, 3)
        let g = color.slice(3, 5)
        let b = color.slice(5)
        newColor = {
          r: parseInt(r, 16) / 255,
          g: parseInt(g, 16) / 255,
          b: parseInt(b, 16) / 255,
        }
      }
      return newColor
    },
    // 转换根据category，将prop传入的map转换为src,color格式
    transformOriginMap(category, propMap) {
      let map = {
        src: null,
        color: null,
        mapArr: null
      }
      map.mapArr = propMap[`${category}MapArr`]
      switch (category) {
        case mapType.basic:
          map.src = propMap.map
          map.color = this.transformOriginColor(propMap.color)
          break
        case mapType.specular:
          map.src = propMap[`${category}Map`]
          map.color = this.transformOriginColor(propMap[category])
          break
        case mapType.emissive:
          map.src = propMap[`${category}Map`]
          map.color = this.transformOriginColor(propMap[category])
          break
        default:
          map.src = propMap[`${category}Map`]
          break
      }
      return map
    },
    // 转换根据mapCategory转换meshMap为对应的图片颜色属性名格式
    transformMap(category, meshMap) {
      let map = {}
      let colorName = 'color'
      if (category === mapType.basic) {
        map.map = meshMap.map.src
        map[colorName] = meshMap.map.color
      } else {
        map[`${category}Map`] = meshMap.map.src
        switch (category) {
          case mapType.specular:
            colorName = 'specular'
            break
          case mapType.emissive:
            colorName = 'emissive'
            break
          default:
            colorName = 'color'
            break
        }
        map[colorName] = meshMap.map.color
      }
      map[`${category}MapArr`] = meshMap.map.mapArr
      return map
    },
    // 贴图对象改变时发射自定义事件函数
    changeMap() {
      const meshMap = {
        category: this.mapCategory,
        map: this.transformMap(this.mapCategory, this.meshMap)
      }
      this.$emit('changeMap', this.mapCategory, meshMap)
    },
    // 单选框选择贴图、颜色、未设置改变事件
    mapTypeChange(e) {
      // 选择未设置meshmap的map为null，发射出去
      if (e === 'unset') {
        this.meshMap.map.src = null
        this.meshMap.map.color = null
        this.meshMapImgThumb = null
        this.changeMap()
      }
    },
    // 点击使用贴图按钮打开上传贴图弹框
    showUpLoadImgMap() {
      this.upLoadImgMapFlag = true
    },
    // 选择贴图弹框点击上传按钮
    clickSelect() {
      this.$refs.imgUpload.click();
    },
    // 上传图片input选取文件事件
    selectImgFile(e) {
      if (e.target.files.length < 1) {
        return;
      }
      const uploadFile = e.target.files[0],
            name = uploadFile.name,
            type = name.slice(name.lastIndexOf('.') + 1),
            size = uploadFile.size;
      if (type !== 'jpg' && type !== 'png' && type !== 'jpeg') {
        this.$message({
          message: this.$t('fileTypeWarn'),
          type: 'warning',
          duration: 1500
        });
        e.target.value = null;
        return;
      }
      if (size > imageUploadLint) { 
        this.$message({
          message: this.$t('fileSizeWarn'),
          type: 'warning',
          duration: 1500
        });
        e.target.value = null;
        return;
      }
      if (chineseSignReg.test(name)) {
        this.$message({
          message: this.$t('fileZhSignWarn'),
          type: 'warning',
          duration: 1500
        });
        e.target.value = null;
        return;
      }
      // uploadFile是file文件需要传
      this.uploadFile = uploadFile;
      if (!this.storeToken) {
        this.getStoreToken(type, size)
      } else {
        this.sendUploadRequest();
      }
    },
    getStoreToken(type, size) {
      getFileToken({
        operator: 'create',
        fileType: type,
        fileSize: size
      })
        .then(res => {
          if (res.code === 20000) {
            this.storeToken = res.data;
            this.sendUploadRequest();
          } else if (res.code === 20008) {
            this.$message({
              message: this.$t('userLimitWarn'),
              type: 'warning',
              duration: 1500
            });
            this.uploadFile = null;
            this.$refs.imgUpload.value = null;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('serveUploadFile'),
            type: 'error',
            duration: 1500
          });
          this.uploadFile = null;
          this.$refs.imgUpload.value = null;
        });
    },
    // 发送上传文件到serve服务器的请求
    sendUploadRequest() {
      const that = this,
            file = this.uploadFile;
      let formData = new FormData(),
          xhr = new XMLHttpRequest();
      formData.append('filename', file);
      formData.append('fileSize', file.size);
      formData.append('type', file.name.slice(file.name.lastIndexOf('.') + 1));
      xhr.open('post', this.uploadFileUrl);
      xhr.setRequestHeader('authorization', this.storeToken);
      // 上传中回调
      xhr.upload.onprogress = function (e) {
        if (e.loaded === e.total) {
          that.uploadFileProgress = false;
          return;
        }
        that.uploadFileProgress = true;
        that.$refs.progressInner.style.width = `${((e.loaded / e.total) * 100).toFixed(2)}%`;
      };
      xhr.onreadystatechange = function (e) {
        console.log(e);
        if (this.readyState === 4 && this.status === 200) {
          console.log(this.response)
          that.$message({
            message: that.$t('uploadSuccess'),
            type: 'success',
            duration: 1500
          });
          that.meshMap.map.mapArr.push(this.response);
        }
      };
      xhr.send(formData);
    },
    // 图片贴图上传成功回调
    imageUploadSuccess(res) {
      if (res.code === 20000) {
        this.$message({
          message: this.$t("uploadSuccess"),
          type: 'success',
          duration: 1500
        })
        console.log(res.data)
        // this.imgFileList.push(JSON.parse(JSON.stringify(res.data)))
        this.meshMap.map.mapArr.push(JSON.parse(JSON.stringify(res.data)))
      } else {
        this.$message({
          message: res.message,
          type: 'error',
          duration: 1500
        })
      }
    },
    // 上传图片贴图前回调检查格式
    beforeUpload(file) {
      let textMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let extension
      if (textMsg === 'jpg' || textMsg === 'png' || textMsg === 'jpeg') {
        extension = true
      } else {
        extension = false
      }
      if (!extension) {
        this.$message({
          message: this.$t("image.uploadRestrictions"),
          type: 'warning',
          duration: 1500
        })
      }
      return extension
    },
    // 点击文件列表中删除按钮回调
    beforeRemove(file, fileList) {
      if (file && file.status === 'success') {
        return new Promise((resolve, reject) => {
          api.delFile('image', {filename: file.response.data.filename})
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t("deleteSuccess"),
                  type: 'success',
                  duration: 1500
                })
                this.meshMap.map.mapArr.splice(this.getIndex(this.meshMap.map.mapArr, file.response.data.filename), 1)
                // this.imgFileList.splice(this.getIndex(this.imgFileList, file.response.data.filename), 1)
                resolve()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error',
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
    getIndex(arr, filename) {
      for (let [index, item] of arr.entries()) {
        if (item.filename === filename) {
          return index
        }
      }
    },
    // 选择图片贴图弹框选择图片事件
    selectImgMap(src, item) {
      // this.saveThumb = item.thumbnail
      this.saveThumb = item;
    },
    recoverImgMap() {
      this.meshMapImgThumb = this.originMap.src
      this.saveSrc = this.originMap.src
      this.saveThumb = this.originMap.src
      this.meshMap.map.src = this.originMap.src
      this.changeMap()
    },
    // 选择图片贴图点击确定按钮
    handleSelectImgMap() {

      if (typeof this.saveSrc !== 'string') {
        this.$message({
          message: this.$t("map.uploadRequirements"),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.meshMap.map.src = this.saveSrc
      this.meshMapImgThumb = this.saveThumb
      this.saveSrc = null
      this.saveThumb = null
      this.changeMap()
      this.upLoadImgMapFlag = false
    },
    // 取消选择图片贴图
    cancelSelectImgMap() {
      this.saveSrc = null
      this.saveThumb = null
      this.upLoadImgMapFlag = false
    },
    // 点击不适用图片贴图按钮事件
    unsetImgMap() {
      this.saveSrc = null
      this.saveThumb = null
      this.meshMapImgThumb = null
      this.meshMap.map.src = null
      this.changeMap()
    },
    // 点击图片从选择框中删除
    delImgSelect(item, index, event) {
      event.cancelBubble = true;
      if (item === this.meshMap.map.src) {
        this.$confirm('当前贴图正在使用，是否确认删除', this.$t("warning"), {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: 'warning'
        })
          .then(() => {
            this.meshMap.map.mapArr.splice(index, 1);
            this.meshMapImgThumb = null
            this.meshMap.map.src = null
            this.saveSrc = null
            this.saveThumb = null
          })
          .catch(() => {
            this.$message({
              message: this.$t('delCancel'),
              type: 'warning',
              duration: 1500
            });
          })
      } else {
        this.meshMap.map.mapArr.splice(index, 1);
        if (item === this.saveSrc) {
          this.saveSrc = null
          this.saveThumb = null
        }
      }
      
    },
    // 点击图片从选择框中删除
    delImageSelect(item, index, event) {
      event.cancelBubble = true
      if (item.filename === this.meshMap.map.src) {
        this.$confirm('当前贴图正在使用，是否确认删除', this.$t("warning"), {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: 'warning'
        })
          .then(() => {
            api.delFile('image', {filename: item.filename})
              .then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: this.$t("deleteSuccess"),
                    type: 'success',
                    duration: 1500
                  })
                  if (this.$refs.upload.uploadFiles.length > 0) {
                    let ind = null
                    for (let [index, itemFile] of this.$refs.upload.uploadFiles.entries()) {
                      if (item.filename === itemFile.response.data.filename) {
                        ind = index
                      }
                    }
                    ind !== null && this.$refs.upload.uploadFiles.splice(ind, 1)
                  }
                  this.meshMap.map.mapArr.splice(index, 1)
                  // this.imgFileList.splice(index, 1)
                  this.meshMapImgThumb = null
                  this.meshMap.map.src = null
                  this.saveSrc = null
                  this.saveThumb = null
                  this.changeMap()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error',
                    duration: 1500
                  })
                }
              })
              .catch(() => {
                this.$message({
                  message: this.$t("deleteCancel"),
                  type: 'warning',
                  duration: 1500
                })
              })
          })
      } else {
        api.delFile('image', {filename: item.filename})
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t("deleteSuccess"),
              type: 'success',
              duration: 1500
            })
            if (this.$refs.upload.uploadFiles.length > 0) {
              let ind = null
              for (let [index, itemFile] of this.$refs.upload.uploadFiles.entries()) {
                if (item.filename === itemFile.response.data.filename) {
                  ind = index
                }
              }
              ind !== null && this.$refs.upload.uploadFiles.splice(ind, 1)
            }
            this.meshMap.map.mapArr.splice(index, 1)
            // this.imgFileList.splice(index, 1)
            if (item.filename === this.saveSrc) {
              this.saveSrc = null
                  this.saveThumb = null
            }

          } else {
            this.$message({
              message: res.message,
              type: 'error',
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
        })
      }
    },
    // 颜色选择器选择事件
    mapColorChange(e) {
      this.changeMap()
    },
    // 颜色部分输入框事件
    mapColorChangeInput(e) {
      this.changeMap()
    },
    // 点击不适用颜色贴图事件
    unsetColorMap() {
      this.meshMap.map.color = null
      this.changeMap()
    },
    recoverColorMap() {
      this.meshMap.map.color = this.originMap.color
      this.changeMap()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';
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
      // 新的上传到serve服务器的上传部分
      .img-upload {
        margin-top: 10px;
        button {
          width: 100%;
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


// 颜色选择器
// .map-set-color::v-deep div.el-color-picker__trigger {
//   width: 32px;
//   height: 32px;
//   border: 1px solid #333;
//   background: #595959;
// }
.progress-container {
  display: flex;
  padding-top: 4px;
  flex-direction: column;
  align-items: flex-end;
  .progress-content {
    width: 100%;
    height: 6px;
    border-radius: 2px;
    border: 1px solid $color-adaptBorder;
    background: $color-fontMain;
    overflow: hidden;
    .progress-inner {
      height: 100%;
      background-color: $color-main;
    }
  }
}
</style>
