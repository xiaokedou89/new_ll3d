<template>
  <div class="material-list main container container-padding">
    <!-- tab选项卡 -->
    <el-tabs type="border-card">
      <!-- 天空盒图片 -->
      <el-tab-pane>
        <span slot="label">
          <i> {{$t("skyboxLabel")}}</i>
        </span>
        <!-- 天空盒选项卡主体部分 -->
        <div class="pane-body">
          <!-- 空数据 -->
          <div class="vild" v-if="skyboxList.length === 0">
            <div class="vild-container">
               {{$t("noData")}}
            </div>
          </div>
          <!-- 有数据的列表容器 -->
          <div class="list-container" v-else>
            <!-- 列表项 -->
            <div class="list-item" v-for="(item, index) in skyboxList" :key="index">
              <div class="inner">
                <!-- 删除图标 -->
                <el-tooltip effect="light" :content="$t('delete')" placement="top">
                  <div class="set-icon" @click="del(item, 'vrPanormaImage')"></div>
                </el-tooltip>
                <!-- 预览图 -->
                <div class="top">
                  <el-image
                    :src="getSkyboxSrc(item.thumb)"
                    :preview-src-list="[getSkyboxSrc(item.path)]"
                    fit="contain"></el-image>
                </div>
                <!-- 底部名字日期 -->
                <div class="bottom">
                  <h4>{{ item.name }}</h4>
                  <p>{{ getTime(item.createTime) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="list-footer">
            <el-button :loading="skyboxBtnFlag" type="primary" @click="getSkyboxList"> {{$t("toViewMore")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 图片 -->
      <el-tab-pane>
        <span slot="label">
          <i> {{$t("image.label")}}</i>
        </span>
        <!-- 图片选项卡主体部分 -->
        <div class="pane-body">
          <!-- 空数据 -->
          <div class="vild" v-if="imgList.length === 0">
            <div class="vild-container">
               {{$t("noData")}}
            </div>
          </div>
          <!-- 有数据的列表容器 -->
          <div class="list-container" v-else>
            <!-- 列表项 -->
            <div class="list-item" v-for="(item, index) in imgList" :key="index">
              <div class="inner">
                <!-- 删除图标 -->
                <el-tooltip effect="light" :content="$t('delete')" placement="top">
                  <div class="set-icon" @click="del(item, 'image')"></div>
                </el-tooltip>
                <!-- 预览图 -->
                <div class="top">
                  <el-image
                    :src="getImgSrc(item.thumb)"
                    :preview-src-list="[getImgSrc(item.path)]"
                    fit="contain"></el-image>
                </div>
                <!-- 底部名字日期 -->
                <div class="bottom">
                  <h4>{{ item.name }}</h4>
                  <p>{{ getTime(item.createTime) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="list-footer">
            <el-button :loading="imgBtnFlag" type="primary" @click="getImgList"> {{$t("toViewMore")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 视频 -->
      <el-tab-pane>
        <span slot="label">
          <i>{{$t("video.label")}}</i>
        </span>
        <!-- 视频选项卡主体部分 -->
        <div class="pane-body">
          <!-- 空数据 -->
          <div class="vild" v-if="videoList.length === 0">
            <div class="vild-container">
               {{$t("noData")}}
            </div>
          </div>
          <!-- 有数据的列表容器 -->
          <div class="list-container" v-else>
            <!-- 列表项 -->
            <div class="list-item" v-for="(item, index) in videoList" :key="index">
              <div class="inner">
                <!-- 删除图标 -->
                <el-tooltip effect="light" :content="$t('delete')" placement="top">
                  <div class="set-icon" @click="del(item, 'video')"></div>
                </el-tooltip>
                <!-- 预览图 -->
                <div class="top" @click="showVideo(item)">
                  <el-image
                    :src="getImgSrc(item.thumb, 'video')"
                    fit="contain"></el-image>
                </div>
                <!-- 底部名字日期 -->
                <div class="bottom">
                  <h4>{{ item.name }}</h4>
                  <p>{{ getTime(item.createTime) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="list-footer">
            <el-button :loading="videoBtnFlag" type="primary" @click="getVideoList"> {{$t("toViewMore")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 音频 -->
      <el-tab-pane>
        <span slot="label">
          <i>{{$t("voice.label")}}</i>
        </span>
        <!-- 音频选项卡主体部分 -->
        <div class="pane-body">
          <!-- 空数据 -->
          <div class="vild"  v-if="musicList.length === 0">
            <div class="vild-container">
               {{$t("noData")}}
            </div>
          </div>
          <!-- 有数据的列表容器 -->
          <div class="list-container" v-else>
            <!-- 列表项 -->
            <div class="list-item" v-for="(item, index) in musicList" :key="index">
              <div class="inner">
                <!-- 删除图标 -->
                <el-tooltip effect="light" :content="$t('delete')" placement="top">
                  <div class="set-icon" @click="del(item, 'voice')"></div>
                </el-tooltip>
                <!-- 预览图 -->
                <div class="top" @click="showMusic(item)">
                  <el-image
                    :src="getImgSrc(item.thumb, 'music')"
                    fit="contain"></el-image>
                </div>
                <!-- 底部名字日期 -->
                <div class="bottom">
                  <h4>{{ item.name }}</h4>
                  <p>{{ getTime(item.createTime) }}</p>
                </div>
              </div>
              <!-- <el-dialog class="video-dialog" :title="musicTitle" v-if="musicFlag" :visible.sync="musicFlag">
                <audio controls :src="musicUrl"></audio>
              </el-dialog> -->
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="list-footer">
            <el-button :loading="musicBtnFlag" type="primary" @click="getMusicList"> {{$t("toViewMore")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 模型 -->
      <el-tab-pane v-if="false">
        <span slot="label">
          <i> {{$t("model.label")}}</i>
        </span>
        <div class="pane-body">
          <div class="vild" v-if="modelList.length === 0">
            <div class="vild-container">
               {{$t("noData")}}
            </div>
          </div>
          <!-- 有数据的列表容器 -->
          <div class="list-container" v-else>
            <!-- 列表项 -->
            <div class="list-item" v-for="(item, index) in modelList" :key="index">
              <div class="inner">
                <!-- 删除图标 -->
                <el-tooltip effect="light" :content="$t('delete')" placement="top">
                  <div class="set-icon" @click="del(item, 'model')"></div>
                </el-tooltip>
                <!-- 预览图 -->
                <div class="top" >
                  <el-image
                    @click="showModel(item)"
                    :src="getImgSrc(item.thumb)"
                    fit="contain"></el-image>
                </div>
                <!-- 底部名字日期 -->
                <div class="bottom">
                  <h4>{{ item.name }}</h4>
                  <p>{{ getTime(item.createTime) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="list-footer">
            <el-button :loading="modelBtnFlag" type="primary" @click="getModelList"> {{$t("toViewMore")}}</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 视频弹框 -->
    <dialoger class="dialoger" @confirm="closeVideo" @cancel="closeVideo" :visible="videoFlag" :mask="true" :title="videoTitle" :closable="true">
      <video v-if="videoUrl" controls :src="videoUrl"></video>
    </dialoger>
    <!-- 音频弹框 -->
    <dialoger class="dialoger" @confirm="closeMusic" @cancel="closeMusic" :visible="musicFlag" :mask="true" :title="musicTitle" :closable="true">
      <el-image
        :src="musicThumb"
        fit="contain"></el-image>
      <audio controls :src="musicUrl"></audio>
    </dialoger>
  </div>
</template>
<script>
import * as api from '@/api/material/material'
import {filePrefix, common, globalUrl, image, video, music, skyBoxUrl} from '@/utils/global'
import dialoger from '@/components/common/dialoger/dialoger';
// 拉取数据默认参数
const defaultParams = {
  pkId: 0,
  size: 8
}

export default {
  name: 'MaterialList',
  components: {
    dialoger
  },
  data() {
    return {
      // 天空盒图片查看更多按钮开关
      skyboxBtnFlag: false,
      // 天空盒图片防抖开关
      skyboxDataFlag: false,
      // 拉取方式
      skyboxGetType: 0,
      // 天空盒图片传参
      skyboxParams: Object.assign({}, defaultParams),
      // 天空盒图片列表数据
      skyboxList: [],
      // 图片查看更多按钮开关
      imgBtnFlag: false,
      // 图片防抖开关
      imgDataFlag: false,
      // 拉取数据方式 0为初始化 1为按钮点击加载
      imgGetType: 0,
      // 图片传参
      imgParams: Object.assign({}, defaultParams),
      // 图片列表数据
      imgList: [],
      // 视频查看更多按钮开关
      videoBtnFlag: false,
      // 视频防抖开关
      videoDataFlag: false,
      // 拉取数据方式 0为初始化 1为按钮点击加载
      videoGetType: 0,
      // 视频传参
      videoParams: Object.assign({}, defaultParams),
      // 视频列表数据
      videoList: [],
      // 音频查看更多按钮开关
      musicBtnFlag: false,
      // 音频防抖开关
      musicDataFlag: false,
      // 拉取数据方式 0为初始化 1为按钮点击加载
      musicGetType: 0,
      // 模型查看更多按钮开关
      modelBtnFlag: false,
      // 音频防抖开关
      modelDataFlag: false,
      // 拉取数据方式 0为初始化 1为按钮点击加载
      modelGetType:0,
      // 视频传参
      modelParams: Object.assign({}, defaultParams),
      // 音频传参
      musicParams: Object.assign({}, defaultParams),
      // 音频列表数据
      musicList: [],
      // 模型列表数据
      modelList: [],
      // 视频弹框开关
      videoFlag: false,
      // 视频弹框绑定的url
      videoUrl: '',
      // 视频弹框标题
      videoTitle: '',
      // 音频弹框开关
      musicFlag: false,
      // 音频弹框封面图
      musicThumb: '',
      // 音频弹框标题
      musicTitle: '',
      // 音频弹框绑定的url
      musicUrl: '',
      // 删除防抖
      delFlag: false
    }
  },
  created() {
    this.initSkybox();
    this.initImg()
    this.initVideo()
    this.initMusic()
    this.initModel()
  },
  computed: {
    getTime() {
      const that = this;
      return function (time) {
        return time == null ? '' : that.$moment(time).format('YYYY/MM/D HH:mm')
      }
    },
    // 得到压缩图片
    getImgSrc() {
      return function (src, t) {
        // return src ? filePrefix + image + src : require('@/assets/1.jpg')
        // return src ? filePrefix + image + src : require('@/assets/empty.jpg');
        let type = t ? t : 'image';
        return src ? filePrefix + image + src : require(`@/assets/default/${type}.png`);
      }
    },
    getSkyboxSrc() {
      return function (src) {
        return src ? filePrefix + skyBoxUrl + src : require('@/assets/default/image.png');
      }
    },
    // 得到资源文件
    getCommonSrc(){
      return function (src) {
        return src ? filePrefix + common + src : require('@/assets/1.jpg')
      }
    },
    // 得到视频文件
    getVideoSrc() {
      return function (src) {
        return src ? filePrefix + video + src : require('@/assets/1.jpg');
      }
    },
    getMusicSrc() {
      return function (src) {
        return filePrefix + music + src;
      }
    }
  },
  methods: {
    initSkybox() {
      if (this.skyboxDataFlag) {
        return;
      }
      if (this.skyboxGetType === 1) {
        this.skyboxBtnFlag = true;
      }
      this.skyboxDataFlag = true;
      
      api.getMaterialListAll('vrPanormaImage', api.range.CONFIDENTIAL,this.skyboxParams)
        .then(res => {
          // console.log('天空盒数据');
          // console.log(res.data)
          this.skyboxDataFlag = false;
          this.skyboxBtnFlag = false;
          if (res.data !== null && res.data.length > 0) {
            const arr = res.data;
            this.skyboxParams.pkId = arr[arr.length - 1].id;
            this.skyboxList = [...this.skyboxList, ...arr];
          } else {
            this.$message({
              message: this.$t("noMore"),
              type: 'warning',
              duration: 1500
            })
          }
        })
        .catch(err => {
          this.skyboxDataFlag = false
          this.skyboxBtnFlag = false
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          })
        });
    },
    // 拉取图片
    initImg() {
      if (this.imgDataFlag) {
        return
      }
      if (this.imgGetType === 1) {
        this.imgBtnFlag = true
      }
      this.imgDataFlag = true
      api.getMaterialListAll('image', api.range.CONFIDENTIAL , this.imgParams)
        .then(res => {
          // console.log('图片数据')
          // console.log(res.data)
          this.imgDataFlag = false
          this.imgBtnFlag = false
          if (res.data !== null && res.data.length > 0) {
            const arr = res.data
            this.imgParams.pkId = arr[arr.length - 1].id
            this.imgList = [...this.imgList, ...arr]
          } else {
            this.$message({
              message: this.$t("noMore"),
              type: 'warning',
              duration: 1500
            })
          }
        })
        .catch(err => {
          this.imgDataFlag = false
          this.imgBtnFlag = false
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          })
        })
    },
    // 拉取视频
    initVideo() {
      if (this.videoDataFlag) {
        return
      }
      if (this.videoGetType === 1) {
        this.videoBtnFlag = true
      }
      this.videoDataFlag = true
      api.getMaterialListAll('video', api.range.CONFIDENTIAL, this.videoParams)
        .then(res => {
          // console.log('视频数据')
          // console.log(res.data)
          this.videoDataFlag = false
          this.videoBtnFlag = false
          if (res.data !== null && res.data.length > 0) {
            const arr = res.data
            this.videoParams.pkId = arr[arr.length - 1].id
            this.videoList = [...this.videoList, ...arr]
          } else {
            this.$message({
              message: this.$t("noMore"),
              type: 'warning',
              duration: 1500
            })
          }
        })
        .catch(err => {
          this.videoDataFlag = false
          this.videoBtnFlag = false
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          })
        })
    },
    // 拉取音频
    initMusic() {
      if (this.musicDataFlag) {
        return
      }
      if (this.musicGetType === 1) {
        this.musicBtnFlag = true
      }
      this.musicDataFlag = true
      api.getMaterialListAll('voice', api.range.CONFIDENTIAL, this.musicParams)
        .then(res => {
          // console.log('音频文件')
          // console.log(res.data)
          this.musicDataFlag = false
          this.musicBtnFlag = false
          if (res.data !== null && res.data.length > 0) {
            const arr = res.data
            this.musicParams.pkId = arr[arr.length - 1].id
            this.musicList = [...this.musicList, ...arr]
          } else {
            this.$message({
              message: this.$t("noMore"),
              type: 'warning',
              duration: 1500
            })
          }
        })
        .catch(err => {
          this.musicDataFlag = false
          this.musicBtnFlag = false
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          })
        })
    },
    // 拉取视频
    initModel() {
      if (this.modelDataFlag) {
        return
      }
      if (this.modelGetType === 1) {
        this.modelBtnFlag = true
      }
      this.modelDataFlag = true
      // api.getMaterialList('model', this.modelParams)
      //     .then(res => {
      //       this.modelDataFlag = false
      //       this.modelBtnFlag = false
      //       if (res.data !== null && res.data.length > 0) {
      //         const arr = res.data
      //         this.modelParams.pkId = arr[arr.length - 1].id
      //         this.modelList = [...this.modelList, ...arr]
      //         console.log(this.modelList)
      //       } else {
      //         this.$message({
      //           message: this.$t("noMore"),
      //           type: 'warning',
      //           duration: 1500
      //         })
      //       }
      //     })
      //     .catch(err => {
      //       this.modelDataFlag = false
      //       this.modelBtnFlag = false
      //       this.$message({
      //         message: err,
      //         type: 'error',
      //         duration: 1500
      //       })
      //     })
    },
    // 点击视频预览图
    showVideo(item) {
      this.videoFlag = true
      this.videoUrl = this.getVideoSrc(item.path)
      this.videoTitle = item.name
    },
    // 点击音频预览图
    showMusic(item) {
      this.musicFlag = true
      // this.musicUrl = this.getMusicSrc(item.path)
      this.musicThumb = this.getImgSrc(item.thumb);
      this.musicUrl = this.getMusicSrc(item.path);
      this.musicTitle = item.name
    },
    // 点击模型的预览图
    showModel(item){
      this.$router.push({path:'/modelMaterial', query: { id: item.id }})
    },
    getSkyboxList() {
      this.skyboxGetType = 1;
      this.initSkybox();
    },
    // 点击图片查看更多
    getImgList() {
      this.imgGetType = 1
      this.initImg()
    },
    // 点击视频查看更多
    getVideoList() {
      this.videoGetType = 1
      this.initVideo()
    },
    // 点击视频查看更多
    getMusicList() {
      this.musicGetType = 1
      this.initMusic()
    },
    // 点击模型查看更多
    getModelList(){
      this.modelGetType=1
      this.initModel()
    },
    // 点击删除图片
    del(item, type) {
      if (this.delFlag) {
        return
      }
      this.delFlag = true
      this.$confirm(this.$t('delMaterialWarn'), this.$t('warning'), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: 'warning'
      })
        .then(() => {
          api.delMaterial(item.id, type)
            .then(res => {
              if (res.code === 20000) {
                this.delFlag = false
                this.$message({
                  message: this.$t("deleteSuccess"),
                  type: 'success',
                  duration: 1500
                })
                let arr, fn
                switch (type) {
                  case 'vrPanormaImage':
                    arr = this.skyboxList;
                    fn = this.initSkybox
                  case 'image':
                    arr = this.imgList
                    fn = this.initImg
                    break
                  case 'video':
                    arr = this.videoList
                    fn = this.initVideo
                    break
                  case 'voice':
                    arr = this.musicList
                    fn = this.initMusic
                    break
                  case 'model':
                    arr = this.modelList
                    fn = this.initModel
                    break
                }
                for (let [index, obj] of arr.entries()) {
                  // console.log(obj);
                  // console.log(item);
                  if (item.id == obj.id) {
                    arr.splice(index, 1)
                  }
                }
                if (arr.length === 0) {
                  fn()
                }
              } else {
                this.delFlag = false
                this.$message({
                  message: res.message,
                  type: 'error',
                  duration: 1500
                })
              }
            })
            .catch(err => {
              this.delFlag = false
              this.$message({
                message:  this.$t("deleteFail"),
                type: 'error',
                duration: 1500
              })
            });
        })
        .catch(() => {
          this.$message({
            message: this.$t('delCancel'),
            type: 'warning',
            duration: 1500
          });
          this.delFlag = false;
        });
      // api.delMaterial(item.id, type)
      //   .then(res => {
      //     if (res.code === 20000) {
      //       this.delFlag = false
      //       this.$message({
      //         message: this.$t("deleteSuccess"),
      //         type: 'success',
      //         duration: 1500
      //       })
      //       let arr, fn
      //       switch (type) {
      //         case 'image':
      //           arr = this.imgList
      //           fn = this.initImg
      //           break
      //         case 'video':
      //           arr = this.videoList
      //           fn = this.initVideo
      //           break
      //         case 'voice':
      //           arr = this.musicList
      //           fn = this.initMusic
      //           break
      //         case 'model':
      //           arr = this.modelList
      //           fn = this.initModel
      //           break
      //       }
      //       for (let [index, obj] of arr.entries()) {
      //         if (item.id == obj.id) {
      //           arr.splice(index, 1)
      //           console.log(arr)
      //         }
      //       }
      //       if (arr.length === 0) {
      //         fn()
      //       }
      //     } else {
      //       this.delFlag = false
      //       this.$message({
      //         message: res.message,
      //         type: 'warning',
      //         duration: 1500
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     this.delFlag = false
      //     this.$message({
      //       message:  this.$t("deleteFail"),
      //       type: 'warning',
      //       duration: 1500
      //     })
      //   })
    },
    closeVideo() {
      this.videoFlag = false;
    },
    closeMusic() {
      this.musicFlag = false;
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';

// 总
//  .material-list .pane-body .list-container .list-item
.material-list {
  position: relative;
  // height: 100%;
  margin: 0 auto;
  background-color: #363636;
  // 选项卡主体部分
  .pane-body {
    // width: 100%;
    box-sizing: border-box;
    padding: 20px;
    // height: 100%;
    // background-color: pink;
    // 空数据时的布局占位
    .vild {
      width: 100%;
      height: 450px;
      border-radius: 4px;
      border: 1px solid $color-ori;
      padding: 10px;
      .vild-container {
        width: 100%;
        height: 100%;
        border: 1px dashed $color-ori;
        border-radius: 15px;
        line-height: 420px;
        text-align: center;
        font-size: 28px;
        color: $color-ori;
      }
    }
    // 列表主体
    .list-container {
      width: 100%;
      // height: 450px;
      min-height: 450px;
      // background-color: pink;
      // overflow-y: auto;
      padding-top: 20px;
      padding-left: 5px;
      padding-right: 5px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      // 列表项
      .list-item {
        // position: relative;
        padding: 0 5px;
        margin-bottom: 10px;
        // height: 180px;
        // border: 1px solid rgb(233,150,5);
        // border-radius: 5px;
        overflow: hidden;
        // box-shadow: 0 0 3px -1px rgb(233,150,25);
        .inner {
          border: 1px solid rgb(233,150,5);
          overflow: hidden;
          box-shadow: 0 0 3px -1px rgb(233,150,25);
          border-radius: 5px;
          position: relative;
          width: 100%;
          // 删除图标
          .set-icon {
            position: absolute;
            z-index: 99;
            right: 0;
            width: 18px;
            height: 18px;
            background: url('~@/assets/del-icon.png') no-repeat;
            background-color: #FF9B00;
            cursor: pointer;
          }
        }
        
        // 预览图部分
        .top {
          box-sizing: border-box;
          width: 100%;
          height: 0;
          padding-bottom: 56.0641%;
          position: relative;
          cursor: pointer;
          .el-image {
            box-sizing: border-box;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
        // 底部文字部分
        .bottom {
          width: 100%;
          height: 20%;
          padding-top: 2px;
          background-color: #222;
          h4 {
            padding-left: 10px;
            color: #fff;
            font-weight: 100;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p {
            padding-left: 10px;
            padding-top: 4px;
            color: rgba(204, 204, 204, 0.452);
          }
        }
      }
    }
    // 修改列表默认滚动条
    .list-container::-webkit-scrollbar {
      width: 5px;
      background-color: rgb(37, 35, 35, .8);
      border-radius: 8px;
    }
    .list-container::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }
    // 底部按钮
    .list-footer {
      width: 100%;
      padding-top: 20px;
      display: flex;
      justify-content: center;
      button {
        width: 200px;
        height: 50px;
        border: 0;
        border-radius: 10px;
        box-shadow: 0 0 1px 1px rgb(233,150,5, .6);
        margin: 0 auto;
        background-color: rgb(233,150,5);
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        cursor: pointer;
      }
      button:hover {
        box-shadow: 0 0 1px 1px rgb(233,150,5, .9);
        transform: translateY(-1px);
      }
    }
  }
}

// 选项卡默认样式修改
.el-tabs {
  border: 0;
  // height: 100%;
}
.material-list .el-tabs::v-deep .el-tabs__header {
  border: 0;
  height: 39px;
  background-color: rgb(68, 67, 67);
}
.el-tabs::v-deep .el-tabs__item {
  background-color: #363636;
  border: 1px solid rgb(155, 155, 155);
  color: #fff;
}
.el-tabs::v-deep .el-tabs__item.is-active {
  // background-color: #414247;
  background-color: #57585f;
  color: rgb(233,150,5);
  border: 1px solid #34353a;
}
// 选项卡主体部分
.el-tabs::v-deep .el-tabs__content {
  background-color: #363636;
  // height: calc(100% - 39px);
  padding: 0;
}
.el-tabs::v-deep .el-tabs__content .el-tab-pane {
  width: 100%;
  height: 100%;
}

// 修改视频弹框默认样式
.video-dialog::v-deep .el-dialog__header {
  height: 30px;
  width: 100%;
  padding: 0;
  background-color: #363636;
  // border: 2px solid #ccc;
}
.video-dialog::v-deep .el-dialog__header span.el-dialog__title {
  display: inline-block;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  color: #fff;
}
.video-dialog::v-deep .el-dialog__header .el-dialog__headerbtn {
  top: 5px;
  right: 5px;
}
.video-dialog::v-deep .el-dialog {
  background-color: rgba(255, 255, 255, .1)
}
.video-dialog::v-deep .el-dialog__body {
  padding: 0;
  background-color: rgba(255, 255, 255, .1)!important;
}
.video-dialog::v-deep .el-dialog__body video {
  width: 100%;
  vertical-align: bottom;
}
.video-dialog::v-deep .el-dialog__body audio {
  width: 100%;
  vertical-align: bottom;
}
.dialoger::v-deep .dialog-body {
  video {
    width: 100%;
    height: 100%;
  }
  .el-image {
    width: 100%;
    height: 200px;
  }
  audio {
    width: 100%;
  }
}
@media (min-width: 951px) {
  .material-list .pane-body .list-container .list-item {
    width: 25%;
  }
}

@media (min-width: 551px) and (max-width: 950px) {
  .material-list .pane-body .list-container .list-item {
    width: 50%;
  }
}
@media (max-width: 550px) {
  .material-list .pane-body .list-container .list-item {
    width: 100%;
  }
}
// change
.operates-container {
  margin-top: 20px;
}

.tables-container {
  margin-top: 20px;
}

.paginations-container {
  float: right;
}
.el-tables {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
