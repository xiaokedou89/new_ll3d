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
            <i v-show="item.id !== 0" class="iconfont icon-bianjisekuai category-icon category-set" @click="setCategory(item)"></i>
            <!-- 删除图标 -->
            <i v-show="item.id !== 0" class="iconfont icon-shanchu1 category-icon category-del" @click="delCategory(item)"></i>
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
      <!-- 右侧模型列表部分部分 -->
      <div class="upload-content">
        <!-- 头部标题 -->
        <h1 class="upload-title">{{ $t('myArList') }}</h1>
        <!-- 条件部分 -->
        <div class="conditions">
          <!-- 开始时间 -->
          <div class="condition-item">
            <el-date-picker
              v-model="params.begin"
              class="input-width"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="开始时间"
              clearable
              @change="beginChange"
            />
          </div>
          <!-- 结束时间 -->
          <div class="condition-item">
            <el-date-picker
              v-model="params.end"
              class="input-width"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="结束时间"
              clearable
              @change="endChange"
            />
          </div>
          <!-- 模糊搜索 -->
          <div class="condition-item">
            <el-input v-model="paramsName" placeholder="搜索模型名称" clearable />
            <button class="search-btn" @click="nameChange">
              <i class="iconfont icon-chaxun"></i>
            </button>
          </div>
          <!-- 分类搜索 -->
          <div class="condition-item">
            <el-select @change="categoryChange" v-model="params.categoryId" :placeholder="$t('vrCategoryPlace')" size="small">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <!-- 类型改变 -->
          <div class="condition-item">
            <div class="types">
              <el-radio 
                v-model="params.type" 
                :label="item.value" 
                v-for="(item, index) in types"
                :key="index"
                @change="typeChange"
              >
                {{ item.name }}
              </el-radio>
            </div>
          </div>
        </div>
        <!-- 模型列表 -->
        <list 
          :user="false" 
          :list="list"
          :setting="true"
          :deletable="true"
          :loading="loading"
          @btnClick="btnClick"
          @itemClick="itemClick"
          @del="del"
        ></list>
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
// getUserVr
import * as api from '@/api/vr/vr.js';
import * as rule from '@/utils/rules.js';
import { listSize, arListTypes } from '@/utils/global.js';
import Vue from 'vue';
import list from '@/components/layout/list/list.vue';
import dialoger from '@/components/common/dialoger/dialoger.vue';

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

// 默认请求参数
const defaultParams = {
  timeColumn: 'createTime',
  userId: null,
  categoryId: null,
  begin: '',
  end: '',
  name: '',
  page: 1,
  size: listSize,
  type: 'model'
};

export default {
  name: 'UserArList',
  components: {
    dialoger,
    list
  },
  data() {
    return {
      rules,
      userId: null,
      // 分类列表绑定数据
      categorys: [],
      // 分类弹框绑定开关
      categoryVisible: false,
      // 分类弹框标题
      categoryTitle: '',
      // 分类弹框表单绑定对象
      categoryObj: Object.assign({}, defaultCategory),
      // 列表加载动画开关
      loading: false,
      // 请求参数
      params: Object.assign({}, defaultParams),
      paramsName: '',
      // 是否是条件变化驱动
      conditionFlag: false,
      // 我的全景列表数组
      list: [],
      // 全景类型切换数组
      types: arListTypes
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id !== undefined) {
      this.userId = +this.$route.query.id;
    } else {
      this.userId = +this.$store.getters.userId;
    }
    defaultParams.userId = this.userId;
    this.params = Object.assign({}, defaultParams);
    this.initCategory();
    this.initList(this.params);
  },
  methods: {
    // 拉取分类列表数据
    initCategory() {
      api.getCategory()
        .then(res => {
          if (res.code === 20000) {
            this.categorys = res.data;
            this.categorys.unshift({
              id: 0,
              name: '默认分类'
            });
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
    // 获取模型列表
    initList(params) {
      this.loading = true;
      api.getUserVr(params.type, params)
        .then(res => {
          if (res.code === 20000) {
            this.conditionFlag && (this.list = res.data);
            !this.conditionFlag && (this.list = this.list.concat(res.data));
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
            this.params.page > 1 && (this.params.page--);
            this.conditionFlag && (this.list = []);
          }
          this.loading = false;
          this.conditionFlag = false;
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          })
          this.params.page > 1 && (this.params.page--);
          this.loading = false;
          this.conditionFlag = false;
        })
    },
    // 开始时间条件事件
    beginChange(e) {
      this.conditionFlag = true;
      if (e === null) {
        this.params.begin = '';
      }
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 结束时间条件事件
    endChange(e) {
      this.conditionFlag = true;
      if (e === null) {
        this.params.end = '';
      }
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 分类条件事件
    categoryChange(e) {
      this.conditionFlag = true;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 类型改变事件
    typeChange(e) {
      this.conditionFlag = true;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 名称搜索条件改变
    nameChange() {
      this.conditionFlag = true;
      this.params.name = this.paramsName;
      this.params.page = 1;
      this.list = [];
      this.initList(this.params);
    },
    // 点击全景项事件
    itemClick(item) {
      let path = '/vrmodelEditor'
      if (this.params.type === 'skybox') {
        path = '/panEditor';
      }
      this.$router.push({
        path,
        query: {
          id: item.id,
          flag: false
        }
      });
    },
    // 点击删除按钮事件
    del(item) {
      this.$confirm(this.$t('delVrWarning'), this.$t('warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          api.delVrModel(item.id)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('deleteSuccess'),
                  type: 'success',
                  duraion: 1500
                });
                this.conditionFlag = true;
                this.params.page = 1;
                this.list = [];
                this.initList(this.params);
              } else {
                this.$message({
                  message: this.$t('deleteFail'),
                  type: 'success',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('deleteFail'),
                type: 'success',
                duration: 1500
              });
            });
        })
        .catch(() => {
          this.$message({
            message: this.$t('delCancel'),
            type: 'warning',
            duration: 1500
          });
        });       
    },
    // 点击加载按钮
    btnClick() {
      this.params.page++;
      this.initList(this.params);
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
  background-color: #37373a;
  // background-color: $color-navBg;
  // 头部标题
  .upload-title {
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid $color-mainBg;
    margin: 20px 0 10px 0;
  }
}

// 右侧条件部分
.conditions {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .condition-item {
    position: relative;
    width: 30%;
    justify-content: space-around;
    padding: 5px;
    .search-btn {
      position: absolute;
      width: 40px;
      height: 32px;
      border: 0;
      right: 5px;
      top: 5px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: $color-uploadShow;
      color: $color-ori;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
    }
  }
}

.condition-item {
  .el-date-editor {
    width: 100%;
  }
  &::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
    background-color: rgb(64, 66, 76);
    border-color: rgb(64, 66, 76);
    color: $color-fontMain;
  }
  &::v-deep .el-input__inner:active {
    border-color: $color-ori;
  }
  &::v-deep .el-input__inner:focus {
    border-color: $color-ori;
  }
  &::v-deep .el-input__icon {
    line-height: 32px;

  }
  .types {
    width: 100%;
    height: 32px;
    display: flex;
    border-radius: 6px;
    overflow: hidden;
    &::v-deep .el-radio__input {
      display: none;
    }
    &::v-deep .el-radio {
      width: 50%;
      height: 100%;
      display: inline-block;
      margin: 0;
      & .el-radio__label {
        padding: 0;
        display: block;
        width: 100%;
        height: 100%;
        line-height: 32px;
        text-align: center;
        background-color: $color-uploadShow;
      }
    }
    &::v-deep .el-radio.is-checked {
      & .el-radio__label {
        background-color: $color-ori;
        color: $color-fontMain;
      }
    }
  }
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
@media (max-width: 720px) {
  .conditions {
    flex-direction: column;
    .condition-item {
      width: 100%;
    }
  }
}
</style>