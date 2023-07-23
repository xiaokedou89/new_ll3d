<template>
  <div class="main container container-padding">
    <!-- 内层主要内容容器 -->
    <div class="upload-container">
      <!-- 左边上传进度展示部分 -->
      <div class="upload-status">
        <el-radio disabled v-model="uploadStatus" :label="item.value" v-for="(item, index) in uploadStatusArr" :key="index">
          <span>{{ item.name }}</span>
        </el-radio>
      </div>
      <!-- 右边上传编辑主体部分 -->
      <div class="upload-content">
        <!-- 选择文件部分 -->
        <div class="upload-main" v-show="uploadStatus === UploadFile">
          <!-- 标题部分 -->
          <h1 class="upload-title">{{ $t('uploadFile') }}</h1>
          <!-- 主要部分-文字说明和选择文件 -->
          <div class="upload-center">
            <!-- 文字说明部分 -->
            <div class="upload-description">
              <dl class="desc-dl">
                <dt>{{ $t('uploadDtFile') }}</dt>
                <dd>{{ $t('uploadDdFile') }}</dd>
                <dt>{{ $t('uploadDtModel') }}</dt>
                <dd>{{ $t('uploadDdModel') }}</dd>
                <dt>{{ $t('uploadDtImg') }}</dt>
                <dd>{{ $t('uploadDdImg') }}</dd>
                <dt>{{ $t('uploadDtFileType') }}</dt>
                <dd>
                  <ul class="desc-more">
                    <li>{{ $t('uploadDdFileLi1') }}</li>
                    <li>{{ $t('uploadDdFileLi2') }}</li>
                    <li>{{ $t('uploadDdFileLi3') }}</li>
                  </ul>
                </dd>
              </dl>
            </div>
            <!-- 上传文件选择部分 -->
            <div class="uploadFiles">
              <!-- 选择文件input包装 -->
              <div class="file-groups" @click="clickSelect">
                <!-- 文件选择器-默认不显示 -->
                <input
                  type="file"
                  class="file-uploader"
                  ref="FileUploader"
                  style="display: none;"
                  accept=".zip"
                  @change="selectFile"
                />
                <!-- 文件名展示 -->
                <div class="file-upload-show">{{ uploadFile ? uploadFile.name : '' }}</div>
                <!-- 按钮 -->
                <a class="file-upload-btn">{{ $t('modelUpload') }}</a>
              </div>
              <p class="zip">
                <i class="iconfont icon-jinggao"></i>
                {{ $t('uploadZip') }}
              </p>
            </div>
          </div>
          <!-- 底部的说明和按钮 -->
          <div class="upload-footer">
            <p class="attention">{{ $t('uploadAttention') }}</p>
            <!-- 取消 -->
            <button class="btn confirmBtn footer-btn" @click="cancelSelectFile">{{ $t('cancel') }}</button>
            <!-- 继续 -->
            <button class="btn confirmBtn footer-btn" :disabled="!uploadFile" @click="uploading">{{ $t('continue') }}</button>
          </div>
        </div>
        <!-- 处理表单和展示进度部分 -->
        <div class="upload-main" v-show="uploadStatus === TransferDone || uploadStatus === DealModel">
          <!-- 标题部分 -->
          <h1 class="upload-title">{{ $t('transfation') }}</h1>
          <!-- 上传表单部分 -->
          <div class="upload-center">
            <!-- 模型上传进度条 -->
            <div class="progress-group">
              <p class="progress-label">{{ $t('modelUpload') + '：' }}</p>
              <div class="uploading-container">
                <div class="uploading-progress" ref="uploadingProgress"></div>
              </div>
            </div>
            <!-- 模型解压进度条 -->
            <div class="progress-group">
              <p class="progress-label">{{ $t('modeling') + '：' }}</p>
              <div class="uploading-container">
                <div class="uploading-progress" ref="modelingProgress"></div>
              </div>
            </div>
            <!-- 上传对象表单部分 -->
            <el-form ref="uploadForm" class="upload-form" :model="uploadObj" :rules="rules" size="small" label-position="top">
              <!-- 模型名称 -->
              <el-form-item :label="$t('name') + '：'" prop="name">
                <el-input :disabled="allDisabled" v-model="uploadObj.name" maxlength="14" :placeholder="$t('modelNamePlace')"></el-input>
              </el-form-item>
              <!-- 模型描述 -->
              <el-form-item :label="$t('description') + '：'" prop="description">
                <el-input :disabled="allDisabled" type="textarea" :rows="5" :show-word-limit="true" maxlength="255" v-model="uploadObj.description" :placeholder="$t('modelDesPlace')" resize="none" />
              </el-form-item>
              <!-- 模型标签 -->
              <el-form-item :label="$t('tag') + '：'" prop="tag">
                <el-input
                  v-model="tagsInput"
                  :disabled="allDisabled"
                  :placeholder="$t('modelTagPlace')"
                  @change="createTag"
                  @input="inputTag"
                />
                <div class="tags-container" v-if="tagsArr.length > 0">
                  <p>{{ $t('tagDes') }}</p>
                  <el-checkbox-group v-model="tagsValue" @change="selectTags">
                    <div class="tag" v-for="(item, index) in tagsArr" :key="index">
                      <el-checkbox :label="item"></el-checkbox>
                      <i class="iconfont icon-guanbi tag-icon" @click="delTag(item)"></i>
                    </div>
                  </el-checkbox-group>
                </div>
                <p class="tags-empty" v-else>{{ $t('tagInputWarn') }}</p>
              </el-form-item>
              <!-- 购物地址 -->
              <el-form-item :label="$t('foreignLink') + '：'" prop="foreignLink">
                <el-input :disabled="allDisabled" v-model="uploadObj.foreignLink" :placeholder="$t('foreignLinkPlace')" />
              </el-form-item>
              <!-- 模型封面 -->
              <el-form-item :label="$t('thumb') + '：'" prop="thumb">
                <!-- 上传封面部分 -->
                <div class="thumb-container">
                  <div class="thumb-empty" v-if="!uploadObj.thumb">
                    <i class="thumb-empty-icon el-icon-upload"></i>
                    <span class="thumb-empty-text">{{ $t('thumbUpload') }}</span>
                  </div>
                  <img ref="img" :class="{imageWidth: thumbStyle, imageHeight: !thumbStyle}" v-else :src="getThumbSrc(uploadObj.thumb)" />
                </div>
                <el-upload
                  ref="thumbUpload"
                  class="thumb-upload"
                  accept="image/png, image/jpg, image/jpeg"
                  :limit="1"
                  :action="thumbUrl"
                  :before-upload="beforeThumbUpload"
                  :on-progress="thumbProgress"
                  :on-success="thumbSuc"
                  :on-error="thumbFail"
                  :on-remove="thumbUploadRemove"
                  :disabled="uploadObj.thumbDisabled || allDisabled"
                  :show-file-list="uploadObj.thumbShowListFlag"
                >
                  <div class="thumb-group">
                    <span class="thumb-file-box" @click="handleThumbRemove">{{ uploadObj.showThumbName }}</span>
                    <button type="button" class="thumb-btn" @click="handleThumbRemove">{{ getThumbBtn }}</button>
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item :label="$t('modelCategory') + '：'" prop="category">
                <el-cascader
                  :disabled="allDisabled"
                  :options="categorys"
                  :props="categoryProps"
                  v-model="categoryValue"
                  @change="categoryChange"
                ></el-cascader>
              </el-form-item>
              <!-- 允许下载 -->
              <el-form-item :label="$t('downable') + '：'" prop="downloadStatus">
                <el-switch :disabled="allDisabled" v-model="uploadObj.downloadStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
              </el-form-item>
              <!-- 私人模型 -->
              <el-form-item :label="$t('publicable') + '：'" prop="publicStatus">
                <el-switch :disabled="allDisabled" v-model="uploadObj.publicStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
              </el-form-item>
              <!-- 允许评论 -->
              <el-form-item :label="$t('reviewable') + '：'" prop="reviewStatus">
                <el-switch :disabled="allDisabled" v-model="uploadObj.reviewStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
              </el-form-item>
              <!-- 推荐模型 -->
              <el-form-item :label="$t('recommendModel') + '：'" prop="recommendStatus">
                <el-switch :disabled="allDisabled" v-model="uploadObj.recommendStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
              </el-form-item>
            </el-form>
          </div>
          <!-- 底部的按钮 -->
          <div class="upload-footer">
            <!-- 继续 -->
            <button class="btn confirmBtn footer-btn" :disabled="!uploadObj.model" @click="uploadModel">{{ $t('continue') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  UploadFile,
  TransferDone,
  DealModel,
  uploadStatusArr,
  storeModel,
  filePrefix,
  image,
  uploadFaceFile,
  chineseSignReg
} from '@/utils/global.js';
import * as rule from '@/utils/rules.js';
import { i18n } from '@/assets/languages/i18n.js';
import { delFile } from '@/api/file/file.js';
import { getFileToken } from '@/api/user/user.js';
import { uploadModel, getModelCategory } from '@/api/model/model.js';

const rules = {
  name: rule.requiredRules,
  description: rule.requiredRules,
  thumb: rule.requiredRules,
  category: rule.requiredRules
};

// 默认的上传表单对象
const defaultUpload = {
  category: null,
  description: '',
  downloadStatus: false,
  foreignLink: '',
  model: null,
  name: '',
  publicStatus: true,
  recommendStatus: true,
  reviewStatus: true,
  tag: '',
  texture: null,
  thumb: null,
  type: null,
  // 上传是否禁用
  thumbDisabled: false,
  // 是否显示上传文件列表
  thumbShowListFlag: true,
  // 上传的文件名展示
  showThumbName: '',
  // 是否上传中开关
  thumbProgressFlag: false,
  uploadFlag: false
};

export default {
  name: 'UpdataModel',
  data() {
    return {
      allDisabled: false,
      rules,
      // 是否有用户模块
      user: false,
      // 用户是否登录
      isLogin: false,
      // 三个Symbol常量
      UploadFile,
      TransferDone,
      DealModel,
      // 上传状态单选框绑定值
      uploadStatus: UploadFile,
      // 上传状态单选框绑定数组
      uploadStatusArr,
      // input选取保存的文件
      uploadFile: null,
      // 展示选择的文件名
      showFileName: '',
      // 上传模型地址
      uploadModelUrl: storeModel,
      // 获取的用户文件系统token
      storeToken: null,
      // 上传表单绑定对象
      uploadObj: Object.assign({}, defaultUpload),
      // 上传对象thumb封面图适配开关
      thumbStyle: false,
      // 上传封面路径
      thumbUrl: uploadFaceFile,
      // 模型分类数据
      categorys: [],
      // 分类组件配置
      categoryProps: {
        label: 'name',
        value: 'id',
        children: 'child',
        multiple: true,
        checkStrictly: true
      },
      // 分类联级框绑定值
      categoryValue: [],
      // 标签多选框生成数组
      tagsArr: [],
      // 标签多选框绑定值
      tagsValue: [],
      tagsInput: '',
    }
  },
  watch: {
    // 选择的文件-改变展示的文件名
    uploadFile(file) {
      if(file) {
        this.showFileName = file.name;
      } else {
        this.showFileName = '';
      }
    }
  },
  created() {
    this.initConfig();
    this.initCategory();
  },
  updated() {
    const _this = this;
    let img = null;
    if (this.$refs.img) {
      img = this.$refs.img;
      img.onload = function () {
        _this.thumbStyle = img.naturalWidth > img.naturalHeight ? true : false;
      }
    }
  },
  computed: {
    getThumbSrc() {
      return function (src) {
        return `${filePrefix}${image}${src}`;
      }
    },
    getThumbBtn() {
      return this.uploadObj.thumbDisabled ? i18n.t('delete') : i18n.t('upload');
    }
  },
  methods: {
    initConfig() {
      const user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user : false;
      this.isLogin = !! this.$store.getters.token;
    },
    // 初始化模型分类
    initCategory() {
      getModelCategory()
        .then(res => {
          if (res.code === 20000) {
            let categorys = res.data;
            categorys.map(item => {
              item.id = item.parent.id;
              item.name = item.parent.name;
              return item;
            })
            this.categorys = categorys;
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('initCategoryFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initCategoryFail'),
            type: 'error',
            duration: 1500
          });
          this.$router.back(-1);
        })
    },
    // 点击文件选择选取文件事件
    clickSelect() {
      this.$refs.FileUploader.click();
    },
    // 选取文件事件
    selectFile(e) {
      if (e.target.files.length < 1) {
        return;
      }
      const uploadFile = e.target.files[0],
            type = uploadFile.name.slice(uploadFile.name.lastIndexOf('.') + 1),
            size = uploadFile.size,
            name = uploadFile.name;
      if (type !== 'zip') {
        this.$message({
          message: this.$t('fileTypeWarn'),
          type: 'warning',
          duration: 1500
        });
        e.target.value = null;
        return;
      }
      if (size >= 20 * 1024 * 1024) {
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
      this.uploadFile = uploadFile;
    },
    // 点击取消事件
    cancelSelectFile() {
      this.$refs.FileUploader.value = null;
      this.uploadFile = null;
      this.showFileName = '';
    },
    // 点击继续按钮事件
    uploading() {
      if (!this.uploadFile) {
        this.$message({
          message: this.$t('fileNullWarn'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      // this.uploadStatus = this.TransferDone;
      // 判断是否有用户系统
      if (this.user) {
        // 获取文件系统token
        getFileToken({
          operator: 'create',
          fileType: 'zip',
          fileSize: this.uploadFile.size
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
              this.showFileName = '';
              this.$refs.FileUploader.value = null;
            }
          })
      } else {
        this.sendUploadRequest();
      }
    },
    // 发射上传模型请求
    sendUploadRequest() {
      const that = this,
            file = this.uploadFile;
      this.uploadStatus = this.TransferDone;
      this.allDisabled = true;
      let formData = new FormData(),
          xhr = new XMLHttpRequest();
      formData.append('fileName', file);
      formData.append('fileSize', file.size);
      formData.append('type', file.name.slice(file.name.lastIndexOf('.') + 1));
      xhr.open('post', this.uploadModelUrl);
      if (this.user) {
        xhr.setRequestHeader('authorization', this.storeToken);
      }
      // 上传中回调
      xhr.upload.onprogress = function (e) {
        if (e.loaded === e.total) {
          that.$message({
            message: that.$t('uploadDoneForModeling'),
            type: 'success',
            duration: 1500
          });
        }
        let percentage = ((e.loaded / e.total) * 100).toFixed(2);
        that.$refs.uploadingProgress.style.width = `${percentage}%`;
      }
      // 上传请求完成回调
      xhr.onreadystatechange = function (e) {
        if (this.readyState === 4 && this.status === 200) {
          let res = JSON.parse(this.response);
          defaultUpload.model = res.model;
          // defaultUpload.texture = res.texture;
          defaultUpload.texture = JSON.stringify(res.texture);
          if (res.format === 'obj'||res.format==='fbx') {
            defaultUpload.type = 2;
          } else if (res.format === 'fake') {
            defaultUpload.type = 1;
          }
          // this.uploadObj = Object.assign({}, defaultUpload);
          that.uploadObj = JSON.parse(JSON.stringify(defaultUpload));
          that.modeling(100);
        } else if (this.status !== 200) {
          that.modeling(80);
        }
      };
      xhr.send(formData);
    },
    // 模型解压dom动画
    modeling(percentage) {
      const that = this;
      let count = 0;
      let timer = setInterval(function () {
        if (count < percentage) {
          count++;
          that.$refs.modelingProgress.style.width = `${count}%`;
        } else {
          if (percentage < 100) {
            that.$message({
              message: that.$t('modelingFail'),
              type: 'error',
              duration: 1500
            });
            that.showFileName = '';
            that.uploadFile = null;
            that.$refs.FileUploader.value = null;
            that.uploadStatus = UploadFile;
            defaultUpload.model = null;
            defaultUpload.texture = null;
            defaultUpload.type = null;
            that.uploadObj = Object.assign({}, defaultUpload);
            that.$refs.uploadingProgress.style.width = '0%';
            that.$refs.modelingProgress.style.width = '0%';
            // console.log('解压完成，调用失败回调')
            // console.log(that.uploadObj);
          } else {
            // console.log('解压完成调用成功回调')
            // console.log(that.uploadObj);
            that.$message({
              message: that.$t('modelingSuc'),
              type: 'success',
              duration: 1500
            });
          }
          that.allDisabled = false;
          clearInterval(timer);
        }
      }, 100);
    },
    // 上传封面图前回调验证格式大小
    beforeThumbUpload(file) {
      if (this.uploadObj.thumbProgressFlag) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.uploadObj.thumbProgressFlag;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          name = file.name,
          size = file.size,
          extensionFlag = (extension === 'jpg' || extension === 'png' || extension === 'jpeg') && size <= 20 * 1024 * 1024 && !chineseSignReg.test(name) ? true : false;
      if (!extensionFlag) {
        this.$message({
          message: this.$t('thumbTypeWarn'),
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    // 上传封面图中回调
    thumbProgress() {
      this.uploadObj.thumbProgressFlag = true;
    },
    // 上传封面图成功回调
    thumbSuc(e) {
      this.uploadObj.thumbProgressFlag = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('thumbUploadSuc'),
          type: 'success',
          duration: 1500
        });
        this.uploadObj.showThumbName = e.data.oldFilename;
        this.uploadObj.thumbDisabled = true;
        this.uploadObj.thumbShowListFlag = false;
        this.uploadObj.thumb = e.data.filename;
      } else {
        this.$refs.thumbUpload.clearFiles();
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
    },
    // 上传封面图失败回调
    thumbFail() {
      this.uploadObj.thumbProgressFlag = false;
    },
    // 上传取消删除回调
    thumbUploadRemove() {
      this.uploadObj.thumbProgressFlag = false;
    },
    // 点击删除封面图事件
    handleThumbRemove() {
      if (!this.uploadObj.thumbDisabled) {
        return;
      }
      delFile('image', {
        filename: this.uploadObj.thumb
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('delImageSuc'),
              type: 'success',
              duration: 1500
            });
            this.$refs.thumbUpload.clearFiles();
            this.uploadObj.thumbShowListFlag = true;
            this.uploadObj.thumbDisabled = false;
            this.uploadObj.showThumbName = '';
            this.uploadObj.thumb = null;
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          });
        });
    },
    // 标签输入框输入改变事件
    createTag(e) {
      let res = this.tagsArr.findIndex(item => {
        return item === e.trim();
      });
      if (res < 0) {
        !/^\s*$/.test(e) && this.tagsArr.push(e.trim());
        this.tagsInput = '';
      } else {
        this.$message({
          message: this.$t('tagRepeat'),
          type: 'warning',
          duration: 1500
        });
      }
    },
    // 生成标签输入框输入事件
    inputTag(e) {
      let reg = /,/;
      if (reg.test(e)) {
        this.tagsInput = e.slice(0, -1);
      }
    },
    // 选择生成的标签事件
    selectTags(e) {
      if (e.length <= 0) {
        this.uploadObj.tag = null;
      } else {
        this.uploadObj.tag = e.join(',');
      }
    },
    // 点击多选标签框中的删除按钮事件
    delTag(tag) {
      let index = this.tagsArr.findIndex(item => {
        return item === tag;
      }),
          selectIndex = this.tagsValue.findIndex(item => {
            return item === tag;
          });
      this.tagsArr.splice(index, 1);
      if (selectIndex >= 0) {
        this.tagsValue.splice(selectIndex, 1);
        this.tagsValue.length > 0 && (this.uploadObj.tag = this.tagsValue.join(','));
        this.tagsValue.length === 0 && (this.uploadObj.tag = null);
      }
    },
    // 选择模型分类事件
    categoryChange(e) {
      let arr = [];
      if (e. length <= 0) {
        this.uploadObj.category = null;
      } else {
        arr = e.map(item => {
          return item[item.length - 1];
        });
        this.uploadObj.category = arr.join(',');
      }
    },
    // 点击发送创建模型请求
    uploadModel() {
      if (this.uploadFlag) {
        return;
      }
      if (!this.uploadObj.model) {
        this.$message({
          message: this.$t('uploadModelNull'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      if (typeof this.uploadObj.type !== 'number') {
        this.$message({
          message: this.$t('modelTypeWarn'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.uploadObj.uploadFlag = true;
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          uploadModel(this.uploadObj)
            .then(res => {
              if (res.code === 20000) {
                this.uploadStatus = DealModel;
                this.$message({
                  message: this.$t('createModelSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.$router.push('/');
              } else {
                this.$message({
                  message: res.message,
                  type: 'error',
                  duration: 1500
                });
              }
              this.uploadObj.uploadFlag = false;
            })
            .catch(err => {
              this.uploadObj.uploadFlag = false;
              this.$message({
                message: err,
                type: 'error',
                duration: 1500
              });
            });
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.uploadObj.uploadFlag = false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';
// 外层总容器flex
.upload-container {
  margin: 20px 0;
  display: flex;
}
// 左边的上传进度状态部分
.upload-status {
  box-sizing: border-box;
  width: 25%;
  padding: 0 15px;
  @include flex-column;
}
// 修改单选框默认样式
.upload-status::v-deep .el-radio {
  width: 100%;
  & .el-radio__input {
    display: none;
  }
  & .el-radio__label {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0;
    margin-bottom: 10px;
    border-radius: 50px;
    background-color: $color-uploadShow;
    color: $color-fontMain;
  }
}
.upload-status::v-deep .el-radio.is-checked .el-radio__label {
  background-color: $color-main;
}
// 右边的上传主体部分
.upload-content {
  box-sizing: border-box;
  border-radius: 2px;
  width: 75%;
  padding: 20px;
  color: $color-fontMain;
  background-color: $color-navBg;
}
// 右边上传主体部分内层容器
.upload-main {
  box-sizing: border-box;
  // 每个部分的标题
  .upload-title {
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin: 20px 0 10px 0;
  }
  // 底部的按钮和说明部分
  .upload-footer {
    box-sizing: border-box;
    padding-top: 20px;
    border-top: 2px solid $color-mainBg;
    margin-bottom: 10px;
    .attention {
      font-size: 12px;
      color: $color-zip;
      margin: 0 0 10px;
    }
    .footer-btn {
      float: right;
      margin: 0 10px;
    }
  }
}
// 选择文件的中心部分
.upload-center {
  box-sizing: border-box;
  // border-bottom: 1px dashed $color-uploadBorder;
  // 文字说明部分
  .upload-description {
    @include flex-center;
    margin-top: 30px;
    // 上传说明介绍列表
    .desc-dl {
      box-sizing: border-box;
      margin: 0;
      dt {
        box-sizing: border-box;
        font-weight: bold;
        line-height: 1.42857143;
      }
      dd {
        line-height: 1.42857143;
        ul {
          padding-left: 20px;
        }
        ul, li {
          list-style: disc;
        }
      }
    }
  }
}
// 上传和模型解压进度条部分
.progress-group {
  margin-bottom: 15px;
  .progress-label {
    margin-bottom: 10px;
  }
  // 上传进度条外层
  .uploading-container {
    position: relative;
    width: 100%;
    margin: 0;
    font: 12px normal;
    border-radius: 8px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    border: 2px solid $color-mainBg;
    .uploading-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background-color: $color-main;
    }
  }
}

// 上传表单
.upload-form {
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
// 上传文件选择部分
.uploadFiles {
  margin: 20px auto;
  // 上传文件包装项
  .file-groups {
    box-sizing: border-box;
    margin: 0 auto;
    position: relative;
    width: 260px;
    height: 32px;
    cursor: pointer;
    // 文件名展示部分
    .file-upload-show {
      box-sizing: border-box;
      width: 174px;
      height: 32px;
      line-height: 32px;
      border: 1px solid $color-main;
      background-color: $color-navBg;
      position: absolute;
      left: 0;
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    // 按钮部分
    .file-upload-btn {
      position: absolute;
      right: 0;
      width: 88px;
      height: 32px;
      text-align: center;
      background-color: $color-main;
      color: $color-fontMain;
      line-height: 32px;
    }
  }
  // 底部的文件zip说明
  .zip {
    color: $color-zip;
    text-align: center;
    margin: 0 0 10px;
  }
}

// 生成标签部分
.tags-container {
  padding: 10px;
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
        padding: 0 8px;
        color: $color-fontMain;
        display: inline-block;
        height: 100%;
        line-height: 25px;
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
.tags-empty {
  padding: 10px;
}
// 上传封面图部分
.thumb-container {
  width: 200px;
  height: 150px;
  border: 1px solid #2d2e31;
  border-radius: 4px;
  @include f-center;
  overflow: hidden;
  // 没有封面的展示部分
  .thumb-empty {
    width: 100%;
    height: 100%;
    @include flex-column;
    justify-content: center;
    align-items: center;
    .thumb-empty-icon {
      font-size: 50px;
    }
  }
  .imageWidth {
    width: 200px;
    height: auto;
    max-height: 150px;
  }
  .imageHeight {
    height: 150px;
    width: auto;
    max-width: 200px;
  }
}
// 上传封面图组件
.thumb-upload {
  margin-top: 10px;
  .thumb-group {
    width: 200px;
    position: relative;
    .thumb-file-box {
      text-align: left;
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 11px;
      border: 1px solid $color-main;
      border-radius: 4px;
    }
    .thumb-btn {
      position: absolute;
      right: -1px;
      top: 0;
      width: 50px;
      height: 32px;
      background-color: $color-main;
      color: $color-fontMain;
      border: 0;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}
@media (max-width: 1100px) {
  // 外层总容器flex
  .upload-container {
    flex-direction: column;
    .upload-status {
      width: 100%;
      @include flex-just-spacebetween;
    }
    .upload-content {
      width: 100%;
    }
  }
}
@media (min-width: 480px) {
  .desc-dl dt {
    float: left;
    width: 110px;
    overflow: hidden;
    clear: left;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desc-dl dd {
    margin-left: 110px;
  }
}
</style>
