<template>
    <div class="upload-img ">
      <div class="body">
        <div class="upload-dialog-body">
            <!-- 选择图片框 -->
            <div class="upload-image-select">
              <!-- 没有上传图片时的文字提示框 -->
              <div class="upload-image-select-title" v-if="list.length === 0">{{$t("map.clickImg")}}{{$t("map.uploadImg")}} {{$t("comma")}}{{$t("map.setYourMap")}} </div>
              <!-- 图片复选框-->
              <div class="el-item-container" v-if="isMulti" v-for="(item, index) in list" :key="index">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox :label="item" :key="index" @change="selectImgMapList($event, item)">
                    <el-image :src="getImgSrc(item.path)" fit="contain">
                    </el-image>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <!-- 图片复选框 -->
              <!-- 图片单选框 -->
              <div v-if="!isMulti" class="el-item-container" v-for="(item, index) in list" :key="index">
                <el-radio v-model='selectOne' :label="item.id" :key="index" @change="selectImgMap($event, item)"> 
                  <video v-if="type==materialType.video" controls="controls" :src="getVideoSrc(item.path)" fit="contain"></video>
                  <el-image v-else-if="type==materialType.model" :src="getImgSrc(item.thumb)" fit="contain"></el-image>
                  <el-image v-else :src="getImgSrc(item.path)" fit="contain">
                  </el-image>
                </el-radio>
              </div>
            </div>
            <el-upload
              class="image-upload"
              ref="upload"
              v-if="isUpload"
              :multiple="true"
              :on-success="imageUploadSuccess"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              accept="image/png, image/png, image/jpeg"
              :action="url"
            >
              <el-button class="image-upload-button">{{$t("clickUpload")}}</el-button>
              <div class="el-upload__tip" slot="tip">{{$t("image.uploadRestrictions")}}</div>
            </el-upload>
        </div>
      </div>
    </div>
</template>
<script>
import {filePrefix,image,video,skyBoxUrl,common,skyBoxMaterial,imgMaterial,videoMaterial,modelMaterial,audioMaterial} from "@/utils/global.js";
import { timingSafeEqual } from "crypto";
import { Material } from "three";
export default {
  name: 'uploadList',
  props: {
    list:{
        type:Array
    },url:{
        type:String
    },type:{
        type:Number
    },isUpload:{
      type:Boolean
    },isMulti:{
      type:Boolean
    },name:{
      type:String // 所要改的属性
    }
  },
  watch: {
    name(val){
      this.sName=val
    }
  },
  data() {
    return {
        imgList:[],
         // 上传图片贴图选择的src
         saveSrc: null,
         // 上传图片贴图选择的src
        saveThumbnail: null,
        // 图片贴图单选框绑定数组
        imgFileList: [],
        // 选择的对象id
        selectOne:null,
        // 上传路径url
        uploadUrl: "",
        // 选择的图片列表
        checkList:[],
        materialType:{
          image:imgMaterial,
          video:videoMaterial,
          audio:audioMaterial,
          model:modelMaterial
        },
    }
  },
  computed: {
    getImgSrc() {
      return function(src){
        if(this.type==skyBoxMaterial){
             return src ? filePrefix + skyBoxUrl + src : require('@/assets/1.jpg')
        }else if(this.type==modelMaterial){
          return src ? filePrefix + image + src : require('@/assets/1.jpg')
        }
        else if(this.type==imgMaterial){
          if(src.indexOf("./icons/hot/icon")!=-1){
            return src
          }else{
              return src ? filePrefix + image + src : require('@/assets/1.jpg')
          }
        }
      }
    },
    getVideoSrc(){
      return function(src){
        return src ? filePrefix + common + src : require('@/assets/1.jpg')
      }
    }
  },
  methods: {
       // 选择单个图片使用
    selectImgMap(event, item) {
      this.selectOne=item.id
      const data={
        name:this.name,
        item:item
      }
      // 将所选对象返回
      this.$emit('selectOne',data);
    },
    // 选择多个图片使用
    selectImgMapList(event,item){
      const data={
        name:this.name,
        item:this.checkList
      }
      this.$emit('selectOne',data)
    },
      // 图片贴图上传成功回调
      imageUploadSuccess(res) {
      if (res.code === 20000) {
        this.$message({
          message: this.$t("uploadSuccess"),
          type: 'success',
          duration: 1500
        })
        this.list.push(JSON.parse(JSON.stringify(res.data)))
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
  }
  }

</script>
<style lang="scss" scoped>
video{
  width: 100%;
  height: 90%;
  -webkit-user-drag: none;
 }
  .upload-img ::v-deep{
  background-color: #90909033;
  .body {
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
        .el-item-container {
          width: 200px;
          height: 150px;
          position: relative;
          margin: 5px;
          .el-checkbox-group, .el-checkbox {
            width: 100%;
            height: 100%;
          }

          .el-checkbox span.el-checkbox__input {
            display: none;
          }
          .el-checkbox span.el-checkbox__label {
            width: 100%;
            height: 100%;
            padding: 0;
            display: block;
            div.el-image {
              width: 100%;
              height: 100%;
            }
            
            div.el-image::v-deep img {
              -webkit-user-drag: none;
            }
          }
          label.el-checkbox.is-checked {
            border: 3px solid #2489f3;
            box-shadow: 0 0 5px #2489f3;
            transform: translate(-2px, -2px);
          }
        }
        .el-item-container:hover {
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
            display: none ;
          }
          // 图片框
          span.el-radio__label {
            width: 100% ;
            height: 100%;
            padding: 0 ; 
            display: inline-block ;
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
</style>