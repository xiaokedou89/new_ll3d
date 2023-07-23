<template>
  <div class="main container container-padding">
    <!-- 外层总容器 -->
    <div class="upload-container">
      <!-- 左侧分类 -->
      <div class="upload-category">
        <!-- 作品分类标题 -->
        <h1>{{ $t('workCategory') }}</h1>
        <!-- 分类列表容器 -->
        <ul class="category-container" v-if="categorys.length > 0">
          <!-- 每一个分类项 -->
          <li v-for="(item, index) in categorys" :key="index">
            {{ item.name }}
            <!-- 编辑图标 -->
            <i class="iconfont icon-bianjisekuai category-icon category-set" @click="setCategory(item)"></i>
            <!-- 删除图标 -->
            <i class="iconfont icon-shanchu1 category-icon category-del" @click="delCategory(item)"></i>
          </li>
        </ul>
        <!-- 列表为空时显示 -->
        <div class="category-empty" v-else>
          <div class="content">{{ $t('noCategory') }}</div>
        </div>
        <!-- 新建分类按钮 -->
        <div class="new-category">
          <button type="button" class="btn newBtn" @click="openCategory">{{ $t('createCategory') }}</button>
        </div>
      </div>
      <!-- 右侧上传部分 -->
      <div class="upload-content">
        <!-- 头部标题 -->
        <h1 class="upload-title">{{ $t('uploadVR') }}</h1>
        <!-- 上传表单部分 -->
        <div class="upload-center">
          <p class="upload-description">
            <i class="iconfont icon-jinggao"></i>
            {{ $t('vrDescription') }}
          </p>
          <el-form ref="uploadForm" class="upload-form" :model="uploadObj" :rules="rules" size="small" :label-position="labelPosition" label-width="160px">
            <el-form-item :label="$t('modelUpload') + '：'" prop="path">
              <el-upload
                ref="modelUpload"
                class="model-upload"
                accept="zip"
                :limit="1"
                :action="modelUrl"
                :headers="headers"
                :before-upload="modelBeforeUpload"
                :on-progress="modelProgress"
                :on-success="modelSuc"
                :on-error="modelError"
                :on-remove="modelRemove"
                :disabled="modelUpload.disabled"
                :show-file-list="modelUpload.showList"
              >
                <div class="model-upload-group">
                  <span class="upload-file-box" @click="handleModelRemove">{{ modelUpload.showName }}</span>
                  <button type="button" class="upload-btn" @click="handleModelRemove">{{ getUploadBtn }}</button>
                </div>
              </el-upload>
            </el-form-item>
            <!-- 封面图上传 -->
            <el-form-item :label="$t('thumb') + '：'" prop="thumb">
              <el-upload
                ref="thumbUpload"
                class="thumb-upload"
                accept="image/png, image/jpg, image/jpeg"
                :limit="1"
                :action="thumbUrl"
                :headers="headers"
                :before-upload="thumbBeforeUpload"
                :on-progress="thumbProgress"
                :on-success="thumbSuc"
                :on-error="thumbError"
                :on-remove="thumbRemove"
                :disabled="thumbUpload.disabled"
                :show-file-list="thumbUpload.showList"
              >
                <div class="thumb-container">
                  <div class="thumb-empty" v-if="!uploadObj.thumb">
                    <i class="thumb-empty-icon el-icon-upload"></i>
                    <span class="thumb-empty-text">{{ $t('map.uploadImg') }}</span>
                  </div>
                  <img class="thumb" v-else :src="getImageUrl(uploadObj.thumb)" />
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('name') + '：'" prop="name">
              <el-input v-model="uploadObj.name" maxlength="14" :placeholder="$t('vrNamePlace')" />
            </el-form-item>
            <el-form-item :label="$t('description') + '：'">
              <el-input type="textarea" :rows="5" :show-word-limit="true" maxlength="255" v-model="uploadObj.description" :placeholder="$t('modelDesPlace')" resize="none" />
            </el-form-item>
            <!-- 标签 -->
            <el-form-item :label="$t('tag') + '：'">
              <div class="tags-container" v-if="tags.length > 0">
                <p>{{ $t('vrTagDes') }}</p>
                <el-checkbox-group v-model="tagsValue" :max="3" @change="selectTags">
                  <div class="tag" v-for="(item, index) in tags" :key="index">
                    <el-checkbox :label="item" >{{item.name}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
              <p class="tags-empty" v-else>{{ $t('vrTagEmpty') }}</p>
            </el-form-item>
            <!-- 模型分类 -->
            <el-form-item :label="$t('workCategory') + '：'" prop="categoryId">
              <el-select v-model="uploadObj.categoryId" :placeholder="$t('vrCategoryPlace')" size="small">
                <el-option
                  v-for="item in categorys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- 上传类型 -->
            <el-form-item :label="$t('vrType') + '：'" prop="type">
              <el-switch :disabled="!!uploadObj.path" v-model="uploadObj.type" active-color="#2489f3" :active-text="$t('modelVr')" :inactive-text="$t('skybox')" active-value="model" inactive-value="skybox" @change="vrTypeChange"></el-switch>
            </el-form-item>
            <!-- 是否推荐模型 -->
            <el-form-item :label="$t('recommendModel') + '：'" prop="recommendStatus">
              <el-switch v-model="uploadObj.recommendStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <!-- 底部的按钮 -->
        <div class="upload-footer">
            <!-- 继续 -->
          <button class="btn confirmBtn footer-btn" :disabled="!uploadObj.path" @click="uploadModel">{{ $t('confirm') }}</button>
        </div>
      </div>
    </div>
    <!-- 分类弹框 -->
    <dialoger
      :visible="categoryVisible"
      :title="categoryTitle"
      :mask="true"
      :closable="true"
      @confirm="confirmCategory"
      @cancel="cancelCategory"
    >
      <el-form
        ref="categoryForm"
        :model="categoryObj"
        :rules="rules"
        label-width="120px"
        label-position="left"
        size="small"
      >
        <el-form-item :label="$t('categoryName') + '：'" prop="name">
          <el-input v-model="categoryObj.name" :placeholder="$t('categoryNamePlace')" />
        </el-form-item>
      </el-form>
    </dialoger>
  </div>
</template>
<script>
import * as api from '@/api/vr/vr.js';
import * as rule from '@/utils/rules.js';
import Vue from 'vue';
import dialoger from '@/components/common/dialoger/dialoger.vue';
import {
  uploadModel,
  uploadSkybox,
  uploadFaceFile,
  filePrefix,
  image,
  chineseSignReg
} from '@/utils/global.js';
import { delFile } from '@/api/file/file.js';
import { getToken } from '@/utils/storage.js';
import { i18n } from '@/assets/languages/i18n.js';

const rules = {
  name: rule.requiredBlurRules,
  path: rule.requiredBlurRules,
  thumb: rule.requiredBlurRules,
  categoryId: rule.requiredBlurRules
};

// 默认的分类对象
const defaultCategory = {
  name: '',
  setFlag: false
};

// 默认全景上传对象
const defaultUpload = {
  categoryId: null,
  description: '',
  name: '',
  path: null,
  recommendStatus: false,
  sort: 0,
  tag: null,
  thumb: null,
  type: 'model',
  uploadFlag: false
};

const upload = {
  disabled: false,
  progress: false,
  showName: i18n.t('vrTypeConfirm'),
  showList: true
};

export default {
  name: 'UpdataVR',
  components: {
    dialoger
  },
  data() {
    return {
      allDisabled: false,
      rules,
      // 分类列表绑定数据
      categorys: [],
      // 分类弹框绑定开关
      categoryVisible: false,
      // 分类弹框标题
      categoryTitle: '',
      // 分类弹框表单绑定对象
      categoryObj: Object.assign({}, defaultCategory),
      // 上传全景表单绑定对象
      uploadObj: Object.assign({}, defaultUpload),
      // 表单适配标签label位置
      labelPosition: 'left',
      // 模型上传地址
      // uploadSkybox, uploadModel
      modelUrl: uploadModel,
      // 封面图上传地址
      thumbUrl: uploadFaceFile,
      // 文件上传头
      headers: {},
      // 模型上传控制对象
      modelUpload: Object.assign({}, upload),
      // 封面图上传控制对象
      thumbUpload: Object.assign({}, upload),
      // 标签多选框生成数组
      tags: [],
      // 标签多选框绑定值
      tagsValue: []
    }
  },
  created() {
    const that = this;
    this.init();
    this.initCategory();
    this.initTags();
    window.addEventListener('resize', that.pageReize, false);
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', that.pageReize, false);
  },
  computed: {
    getUploadBtn() {
      return this.modelUpload.disabled ? i18n.t('delete') : i18n.t('upload');
    },
    getImageUrl() {
      return function (src) {
        return filePrefix + image + src;
      }
    }
  },
  methods: {
    init() {
      let deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this.labelPosition = deviceWidth <= 1100 ? 'top' : 'left';
      this.$store.getters.token && (this.headers['authorization'] = getToken());
    },
    pageReize(e) {
      this.$nextTick(() => {
        this.labelPosition = e.currentTarget.innerWidth <= 1100 ? 'top' : 'left';
      });
    },
    // 拉取分类列表数据
    initCategory() {
      api.getCategory()
        .then(res => {
          if (res.code === 20000) {
            this.categorys = res.data;
            this.categorys.forEach(item => {
              Vue.set(item, 'setFlag', false);
              Vue.set(item, 'delFlag', false);
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('getCategoryFail'),
            type: 'error',
            duration: 1500
          });
        })
    },
    // 拉取全景标签
    initTags() {
      api.getTags()
        .then(res => {
          if (res.code === 20000) {
            this.tags = res.data;
          } else {
            this.$message({
              message: this.$t('initTagFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initTagFail'),
            type: 'error',
            duration: 1500
          });
          this.$router.back(-1);
        });
    },
    // 点击打开分类弹框
    openCategory() {
      this.categoryObj = Object.assign({}, defaultCategory);
      this.categoryTitle = this.$t('createCategory');
      this.categoryVisible = true;
    },
    // 点击分类的编辑图标事件
    setCategory(item) {
      this.categoryObj = Object.assign({}, item);
      this.categoryTitle = this.$t('setCategory');
      this.categoryVisible = true;
    },
    // 点击删除分类图标事件
    delCategory(item) {
      this.$confirm(this.$t('delCategoryWarn'), this.$t('warning'),{
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          if (item.delFlag) {
            return;
          }
          item.delFlag = true;
          api.delCategory(item.id)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('delCategorySuc'),
                  type: 'success',
                  duration: 1500
                });
                item.delFlag = false;
                this.initCategory();
              } else {
                this.$message({
                  message: this.$t('delCategoryFail'),
                  type: 'error',
                  duration: 1500
                });
                item.delFlag = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('delCategoryFail'),
                type: 'error',
                duration: 1500
              });
              item.delFlag = false;
            })
        })
        .catch(() => {
          this.$message({
            message: this.$t('delCategoryCancel'),
            type: 'warning',
            duration: 1500
          });
          item.delFlag = false;
        })
    },
    // 点击弹框确认按钮
    confirmCategory() {
      if (this.categoryObj.setFlag) {
        return;
      }
      let request = api.createCategory;
      this.categoryObj.id !== undefined && (request = api.setCategory);
      this.categoryObj.setFlag = true;
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          if (this.categoryObj.id === undefined) {
            request(this.categoryObj)
              .then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: this.$t('createCategorySuc'),
                    type: 'success',
                    duration: 1500
                  });
                  this.initCategory();
                  this.categoryObj = Object.assign({}, defaultCategory);
                  this.categoryVisible = false;
                } else {
                  this.$message({
                    message: this.$t('createCategoryFail'),
                    type: 'error',
                    duration: 1500
                  });
                }
                this.categoryObj.setFlag = false;
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  message: this.$t('createCategoryFail'),
                  type: 'error',
                  duration: 1500
                });
                this.categoryObj.setFlag = false;
              });
          } else {
            request(this.categoryObj.id, {
              name: this.categoryObj.name
            })
              .then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: this.$t('setCategorySuc'),
                    type: 'success',
                    duration: 1500
                  });
                  this.initCategory();
                  this.categoryObj = Object.assign({}, defaultCategory);
                  this.categoryVisible = false;
                } else {
                  this.$message({
                    message: this.$t('setCategoryFail'),
                    type: 'error',
                    duration: 1500
                  });
                }
                this.categoryObj.setFlag = false;
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  message: this.$t('setCategoryFail'),
                  type: 'error',
                  duration: 1500
                });
                this.categoryObj.setFlag = false;
              })
          }
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      })
    },
    // 点击弹框取消按钮
    cancelCategory() {
      this.categoryObj = Object.assign({}, defaultCategory);
      this.categoryVisible = false;
    },
    // 模型上传前回调
    modelBeforeUpload(file) {
      if (this.modelUpload.progress) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.modelUpload.progress;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          size = file.size,
          name = file.name,
          extensionFlag = extension === 'zip' && size <= 70 * 1024 * 1024 && !chineseSignReg.test(name) ? true : false;
      if (!extensionFlag) {
        this.$message({
          message: this.$t('modelUploadTypeWarn'),
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    // 模型上传中回调
    modelProgress() {
      this.modelUpload.progress = true;
    },
    // 模型上传成功
    modelSuc(e) {
      this.modelUpload.progress = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('uploadSuccess'),
          type: 'success',
          duration: 1500
        });
        if (e.data.path) {
          // 天空盒
          let path = e.data.path.map(item => {
            return { path: item.path, name: item.name ,thumbnail:item.thumbnail};
          });
          this.uploadObj.path = JSON.stringify(path);
          this.modelUpload.showName = e.data.zipName;
          this.modelUpload.disabled = true;
          this.modelUpload.showList = false;
        } else {
          // 模型
          let { modelName, mapName, zipName } = e.data;
          this.uploadObj.path = JSON.stringify({ modelName, mapName });
          this.modelUpload.showName = zipName;
          this.modelUpload.disabled = true;
          this.modelUpload.showList = false;
        }
      } else {
        this.$refs.modelUpload.clearFiles();
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
    },
    // 模型上传失败
    modelError(e) {
      this.modelUpload.progress = false;
      this.$message({
        message: e.message || this.$t('uploadFailWarn'),
        type: 'error',
        duration: 1500
      })
    },
    // 上传中移除文件
    modelRemove() {
      this.modelUpload.progress = false;
    },
    // 上传后处理删除
    handleModelRemove() {
      if (!this.modelUpload.disabled) {
        return;
      }
      let type = this.uploadObj.type === 'model' ? 'model' : 'skybox';
      delFile(type, {
        filename: this.modelUpload.showName
      }).then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('deleteSuccess'),
              type: 'success',
              duration: 1500
            });
            this.$refs.modelUpload.clearFiles();
            this.modelUpload.showList = true;
            this.modelUpload.disabled = false;
            this.modelUpload.showName = '';
            this.uploadObj.path = null;
          } else {
            this.$message({
              message: this.$t('deleteFail'),
              type: 'error',
              duration: 1500
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
              message: this.$t('deleteFail'),
              type: 'error',
              duration: 1500
            });
        })
    },
    // 封面上传前回调
    thumbBeforeUpload(file) {
      if (this.thumbUpload.progress) {
        this.$message({
          message: this.$t('uploadProgressWarn'),
          type: 'warning',
          duration: 1500
        });
        return !this.thumbUpload.progress;
      }
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1),
          size = file.size,
          name = file.name,
          extensionFlag = (extension === 'jpg' || extension === 'png' || extension === 'jpeg') && size <= 5 * 1024 * 1024 && !chineseSignReg.test(name) ? true : false;
      if (!extensionFlag) {
        this.$message({
          message: this.$t('userThumbTypeWarn'),
          type: 'warning',
          duration: 1500
        });
      }
      return extensionFlag;
    },
    thumbProgress() {
      this.thumbUpload.showList = true;
      this.thumbUpload.progress = true;
    },
    thumbSuc(e) {
      this.thumbUpload.progress = false;
      this.thumbUpload.showList = false;
      if (e.code === 20000) {
        this.$message({
          message: this.$t('uploadUserThumbSuc'),
          type: 'success',
          duration: 1500
        });
        this.uploadObj.thumb && this.delCallback('image', this.uploadObj.thumb);
        this.uploadObj.thumb = e.data.filename;
      } else {
        this.$message({
          message: e.message || this.$t('uploadFailWarn'),
          type: 'error',
          duration: 1500
        });
      }
      this.$refs.thumbUpload.clearFiles();
    },
    thumbError(e) {
      this.thumbUpload.progress = false;
      this.thumbUpload.showList = false;
      this.$message({
        message: e.message || this.$t('uploadFailWarn'),
        type: 'error',
        duration: 1500
      });
    },
    thumbRemove() {
      this.thumbUpload.progress = false;
    },
    delCallback(type, filename) {
      delFile(type, {
        filename
      })
        .then(res => {
          console.log(res)
        })
    },
    // 上传类型改变事件
    vrTypeChange(e) {
      this.modelUrl = e === 'model' ? uploadModel : uploadSkybox;
    },
    // 生成的标签多选框选择事件
    selectTags(e) {
      if (e.length <= 0) {
        this.uploadObj.tag = null;
      } else {
        this.uploadObj.tag = e.map(item => {
          return item.id
        }).join(',');
      }
    },
    // 点击上传模型
    uploadModel() {
      if (this.uploadObj.uploadFlag) {
        return;
      }
      if (this.categorys.length <= 0) {
        this.$message({
          message: this.$t('noCategorys'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      if (!this.uploadObj.path) {
        this.$message({
          message: this.$t('uploadVrNull'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      this.uploadObj.uploadFlag = true;
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          api.updataVr(this.uploadObj.type, this.uploadObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('createVrSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.$router.push('/');
              } else {
                this.$message({
                  message: res.message || this.$t('createVrFail'),
                  type: 'error',
                  duration: 1500
                });
              }
              this.uploadObj.uploadFlag = false;
            })
            .catch(err => {
              this.$message({
                message: err || this.$t('createVrFail'),
                type: 'error',
                duration: 1500
              });
              this.uploadObj.uploadFlag = false;
            })
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
// 外层总容器
.upload-container {
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
}
// 左侧分类管理部分
.upload-category {
  box-sizing: border-box;
  width: 25%;
  background-color: #292929;
  h1 {
    width: 100%;
    background-color: $color-uploadShow;
    color: $color-ori;
    font-size: 20px;
    padding: 10px;
    font-weight: bold;
    text-align: center;
  }
  // 分类列表
  .category-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    li {
      height: 40px;
      line-height: 40px;
      color: $color-fontMain;
      padding: 0 10px;
      position: relative;
      border-bottom: 1px solid $color-category;
      cursor: pointer;
      &:hover {
        background-color: $color-adaptBorder;
      }
      .category-icon {
        display: block;
        text-align: center;
        width: 40px;
        height: 40px;
        line-height: 40px;
        position: absolute;
      }
      .category-set {
        right: 40px;
        top: 0;
      }
      .category-del {
        right: 0;
        top: 0;
      }
    }

  }
  // 分类列表为空时显示
  .category-empty {
    box-sizing: border-box;
    min-height: 200px;
    height: 200px;
    border: 1px solid $color-ori;
    padding: 10px;
    .content {
      display: block;
      width: 100%;
      height: 180px;
      line-height: 180px;
      color: $color-ori;
      border: 1px dashed $color-ori;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
  }
  // 新建作品分类按钮部分
  .new-category {
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
    .newBtn {
      width: 80%;
      background-color: $color-ori;
      &:hover {
        color: $color-fontMain;
      }
    }
  }
}

// 右侧的上传表单部分
.upload-content {
  box-sizing: border-box;
  border-radius: 2px;
  width: 75%;
  padding: 20px;
  margin-left: 20px;
  color: $color-fontMain;
  background-color: $color-navBg;
  // 头部标题
  .upload-title {
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin: 20px 0 10px 0;
  }
  // 底部的按钮部分
  .upload-footer {
    box-sizing: border-box;
    padding-top: 20px;
    border-top: 2px solid $color-mainBg;
    margin-bottom: 10px;
    .footer-btn {
      width: 100%;
      background-color: $color-ori;
    }
    .footer-btn[disabled] {
      background: $color-second;
      color: $color-adaptBorder;
      cursor: not-allowed;
    }
  }
}
// 上传模型描述部分
.upload-description {
  padding: 0 10px 10px;
  color: $color-fontDisabled
}

// 模型上传组件内部
.model-upload {
  position: relative;
  &::v-deep .el-upload--text {
    width: 100%;
  }
  .upload-file-box {
    display: inline-block;
    box-sizing: border-box;
    padding-left: 11px;
    background-color: $color-mainBg;
    border-radius: 4px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: left;
    border: 1px solid $color-main;
  }
  .upload-btn {
    position: absolute;
    right: -1px;
    top: 0;
    height: 32px;
    width: 70px;
    background-color: $color-main;
    color: $color-fontMain;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
  }
}

// 封面图上传内部
.thumb-container {
  width: 150px;
  height: 150px;
  border: 1px solid $color-main;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .thumb-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ccc;
    .thumb-empty-icon {
      font-size: 50px;
    }
  }
  .thumb {
    width: 100%;
    height: 100%;
  }
}

// 生成标签部分
.tags-container {
  padding: 0 10px 10px;
  background-color: $color-mainBg;
  border-radius: 4px;
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
        padding: 4px 10px;
        color: $color-fontMain;
        display: inline-block;
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

@media (max-width: 1100px) {
  // 外层总容器
  .upload-container {
    flex-direction: column;
    // 左侧分类管理部分
    .upload-category {
      width: 100%;

    }
    // 右侧上传主体部分
    .upload-content {
      width: 100%;
      margin: 20px 0 0;
    }
  }

}
</style>
