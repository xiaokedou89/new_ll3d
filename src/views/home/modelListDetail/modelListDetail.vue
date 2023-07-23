<template>
  <div class="main">
    <div class="container container-padding">
      <!-- 模型名称-标题 -->
      <div class="model-name">
        <h1 v-if="model">{{ model.name }}</h1>
      </div>
      <!-- 标题下面的主体内容区域 -->
      <div class="content">
        <!-- 左边部分 -->
        <div class="left">
          <!-- 模型展示容器 -->
          <div ref="model-container" class="model-container">
            <model :key="+modelId" :id="+modelId" :set-thumb="true" />
          </div>
          <!-- 模型底部按钮部分 -->
          <div class="btn-container">
            <!-- 左边按钮部分 -->
            <div class="left-content">
              <!-- 点赞 -->
              <el-tooltip effect="dark" :content="$t('thumbUp')" placement="top" v-if="!!user">
                <div class="leftBtn" :class="{isActive: model.supportFlag}" @click="changeSupport">
                  <i class="iconfont icon-dianzan left-icon"></i>{{ model.supportCount }}
                </div>
              </el-tooltip>
              <!-- 收藏 -->
              <el-tooltip effect="dark" :content="$t('collect')" placement="top" v-if="!!user">
                <div class="leftBtn" :class="{isActive: model.collectFlag}" @click="changeCollect">
                  <i class="iconfont icon-31shoucangxuanzhong left-icon"></i>{{ model.collectCount }}
                </div>
              </el-tooltip>
              <!-- 浏览 -->
              <el-tooltip effect="dark" :content="$t('browser')" placement="top">
                <div class="leftBtn" :class="{isActive: model.browserFlag}">
                  <i class="iconfont icon-liulan left-icon"></i>{{ model.browserCount }}
                </div>
              </el-tooltip>
              <!-- 下载 -->
              <el-tooltip effect="dark" :content="$t('download')" placement="top">
                <div class="leftBtn" :class="{isActive: model.downloadFlag}">
                  <i class="iconfont icon-xiazai left-icon"></i>{{ model.downloadCount }}
                </div>
              </el-tooltip>
            </div>
            <!-- 右边按钮部分 -->
            <div class="right-content">
              <!-- 淘宝引用 -->
              <button v-if="model.publicStatus" type="button" class="btn confirmBtn rightBtn" @click="openTaobaoDialog">{{ $t('taobaoQuote') }}</button>
              <!-- 引用代码 -->
              <button v-if="model.publicStatus" type="button" class="btn confirmBtn rightBtn" @click="openQuoteCode">{{ $t('quoteCode') }}</button>
              <!-- 下载 -->
              <button v-if="model.downloadStatus" ref="downloadBtn" type="button" class="btn confirmBtn rightBtn downloadBtn" @click="download">
                  <!-- <i class="bg" v-show="downloadShow"></i>
                  <i class="count" v-show="downloadShow">{{ `${downloadCount}%` }}</i>
                  <i class="downloadProgress" ref="downloadProgress" v-show="downloadShow"></i> -->
                  {{ $t('download') }}
              </button>
              <!-- 分享 -->
              <!-- <button type="button" class="btn confirmBtn rightBtn">{{ $t('share') }}</button> -->
              <dropdown-menu class="share" v-if="model.publicStatus" dropable>
                <template v-slot:content>
                  <!-- <div class="btns shareBtn">{{ $t('share') }}</div> -->
                  <button type="button" class="btn confirmBtn rightBtn">{{ $t('share') }}</button>
                </template>
                <li @click="openWeixinShare">
                  <i class="iconfont icon-weixin weixin"></i> {{ $t('weixin') }}
                </li>
                <li @click="weiboShare">
                  <i class="iconfont icon-weibo weibo"></i> {{ $t('weibo') }}
                </li>
                <li @click="qqShare">
                  <i class="iconfont icon-QQkongjian qq"></i> {{ $t('qq') }}
                </li>
              </dropdown-menu>
              <!-- 自己的模型操作部分 -->
              <dropdown-menu v-if="currentUser.id === model.userId" class="actions" dropable>
                <template v-slot:content>
                  <div class="btns oriBtn">
                    <!-- {{ $t('action') }} -->
                    <i class="iconfont icon-shezhitianchong"></i>
                    <i class="iconfont icon-sanjiaodown"></i>
                  </div>
                </template>
                <!-- 修改 -->
                <li @click="showSetModel">{{ $t('set') }}</li>
                <!-- 3D设置 -->
                <li v-if="model.type != 1" @click="linkToEditor">{{ $t('3DSet') }}</li>
                <!-- 删除 -->
                <li @click="delModel">{{ $t('delete') }}</li>
                <!-- 仅对自己可见 -->
                <!-- <li>{{ $t('showMyself') }}</li> -->
              </dropdown-menu>
            </div>
          </div>
          <!-- 添加评论部分 -->
          <div class="add-comment" v-if="user && model.reviewStatus">
            <!-- 默认头像 -->
            <div class="comment-user">
              <img :src="getImg(currentUser.thumb)" />
            </div>
            <!-- 添加评论表单部分 -->
            <el-form class="comment-form" ref="parentCommentAdd" :rules="rules" :model="commentObj" size="small">
              <el-form-item prop="content">
                <el-input v-model="commentObj.content" :placeholder="$t('commentPlace')" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <button type="button" class="btn confirmBtn" @click="addParentComment">{{ $t('commenting') }}</button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 评论列表部分 -->
          <div class="comments" v-if="user && model.reviewStatus">
            <ul class="comments-container" v-if="comments.length > 0">
              <li class="comment-item" v-for="(item, index) in comments" :key="index">
                <!-- 用户头像部分 -->
                <div class="item-user">
                  <img :src="getImg(item.userThumb)" />
                </div>
                <!-- 右侧的评论主体部分 -->
                <div class="item-content">
                  <!-- 评论用户名 -->
                  <h4 class="item-username">{{ item.nickName }}</h4>
                  <!-- 评论内容部分 -->
                  <p class="item-inner">{{ item.content }}</p>
                  <!-- 评论时间部分 -->
                  <div class="item-time">{{ getTime(item.time) }}</div>
                  <!-- 评论操作部分 -->
                  <div class="item-action">
                    <!-- 显示回复表单 -->
                    <el-button type="text" @click="item.replyShow = true">{{ $t('reply') }}</el-button>
                    <!-- 查看回复 -->
                    <el-button type="text" @click="item.childrenShow = !item.childrenShow">{{ getBtnShowTxt(item.childrenShow) }}</el-button>
                    <!-- 删除评论 -->
                    <el-button type="text" @click="deleteComment(item)">{{ $t('delete') }}</el-button>
                  </div>
                  <!-- 二级回复表单部分 -->
                  <div class="item-reply" :class="{aniShowOpt: item.replyShow}" v-show="item.replyShow">
                    <!-- 二级评论回复表单 -->
                    <el-form :ref="`commentForm${item.id}`" :model="item.reply" size="small">
                      <el-form-item prop="content">
                        <!-- 输入框 -->
                        <el-input v-model="item.reply.content" type="textarea"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <!-- 确定按钮 -->
                        <button type="button" class="btn confirmBtn" @click="addChildComment(item)">{{ $t('confirm') }}</button>
                        <!-- 收起按钮 -->
                        <el-button class="m_l5" type="text" @click="item.replyShow = false">{{ $t('pack') }}</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <!-- 回复列表渲染 -->
                  <div class="item-childList" v-if="item.childList.length > 0" :class="{aniShowOpt: item.childrenShow}" v-show="item.childrenShow">
                    <!-- 循环渲染子评论 -->
                    <comment
                      :parent-username="item.nickName"
                      :item="itm"
                      v-for="(itm, ind) in item.childList"
                      :key="ind"
                      @delComment="deleteComment"
                    ></comment>
                  </div>
                  <p v-show="item.childrenShow" class="item-childList-empty" v-else>{{ $t('noMoreComments') }}</p>
                </div>
              </li>
            </ul>
            <!-- 评论数组为空时展示 -->
            <div class="empty" v-else>
              <div class="content">{{ $t('noComment') }}</div>
            </div>
            <!-- 加载更多评论按钮部分 -->
            <div class="btn-group">
              <el-button :loading="commentLoading" type="primary" size="small" @click="getMoreComments">{{ $t('moreComments') }}</el-button>
            </div>
          </div>
        </div>
        <!-- 右边部分 -->
        <div class="right">
          <!-- 模型用户信息部分 -->
          <div v-if="user" class="userInfo">
            <!-- 左边头像部分 -->
            <a class="user-logo" @click="linkToUser">
              <img :src="getImg(model.userThumb)" />
            </a>
            <!-- 右边信息部分 -->
            <div class="user-info">
              <!-- 上部分的用户名 -->
              <div class="top">
                <span>{{ $t('username') + '：'}}</span>
                <a @click="linkToUser">{{ model.nickName ? model.nickName : $t('noData') }}</a>
              </div>
              <!-- 下部分的按钮 -->
              <div class="bottom">
                <!-- 我的模型 -->
                <button v-if="isLogin && currentUser.id == model.userId" class="btn btn-color" @click="linkToMyModels">{{ $t('myModels') }}</button>
                <!-- 关注 -->
                <button v-else-if="!isAttension" class="btn confirmBtn" type="button" @click="attension">
                  <i class="iconfont icon-tianjia"></i>{{ $t('attention') }}
                </button>
                <!-- 已关注 -->
                <button v-else class="btn btn-ori" @click="attensioned">
                  <i class="iconfont icon-duigou1"></i>
                  {{ $t('attentioned') }}
                </button>
                <button class="btn cancelBtn btn-color" type="button" @click="sendMessage()">
                  <i class="iconfont icon-aite btn-color"></i>Ta
                </button>
              </div>
            </div>
          </div>
          <!-- 模型介绍信息等部分 -->
          <div class="model-about right-item">
            <!-- 标题 -->
            <h3>{{ $t('modelIntroduction') }}</h3>
            <!-- 模型简介 -->
            <p class="intro">{{ getValue(model, 'description') ? getValue(model, 'description') : $t('noData') }}</p>
            <!-- 发布时间 -->
            <p class="time about-item">
              <i class="iconfont icon-shijian"></i>
              <span>{{ getValue(model, 'time') ? $t('timeShow') + ' ' + getTime(getValue(model, 'time')) : $t('noData') }}</span>
            </p>
            <!-- 模型分类部分 -->
            <div class="about-item">
              <i class="iconfont icon-fenleib"></i>
              <ul class="category">
                <li v-for="(item, index) in categorys" :key="index" @click="linkToListByCategory(item)">{{ item.name }}</li>
              </ul>
            </div>
            <!-- 模型标签部分 -->
            <div class="about-item">
              <i class="iconfont icon-24gf-tags2"></i>
              <ul class="tag">
                <li v-for="(item, index) in tags" :key="index" @click="linkToTagModels(item)">{{ item.name }}</li>
              </ul>
            </div>
          </div>
          <!-- 相关模型部分 -->
          <div class="models right-item">
            <!-- 标题 -->
            <h3>{{ $t('aboutModel') }}</h3>
            <!-- 数据列表 -->
            <ul v-if="!!aboutModels && aboutModels.length > 0">
              <!-- 每一项模型数据 -->
              <li v-for="(item, index) in aboutModels" :key="index">
                <!-- 图片封面容器 -->
                <div class="thumb">
                  <a @click="linkToModel(item)">
                    <img :src="getImage(item.thumb)" />
                  </a>
                </div>
                <!-- 模型信息部分 -->
                <div class="info">
                  <h4 :class="{noUser: !user}"><a @click="linkToModel(item)">{{ item.name }}</a></h4>
                  <div class="info-bottom" v-if="user">
                    <el-tooltip effect="dark" :content="$t('browser')" placement="top">
                      <a class="info-count" @click="linkToModel(item)">
                        <i class="iconfont icon-liulan"></i>{{ item.modelBrowserCount }}
                      </a>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('collect')" placement="top">
                      <a class="info-count" @click="linkToModel(item)">
                        <i class="iconfont icon-31shoucangxuanzhong"></i>{{ item.modelCollectCount}}
                      </a>
                    </el-tooltip>
                    <!-- <el-tooltip effect="dark" :content="$t('thumbUp')" placement="top">
                      <a class="info-count" @click="linkToModel(item)">
                        <i class="iconfont icon-dianzan"></i>111
                      </a>
                    </el-tooltip> -->
                  </div>
                </div>
              </li>
            </ul>
            <div class="empty" v-else>
              <div class="content">{{ $t('noData') }}</div>
            </div>
          </div>
          <!-- 推荐模型部分 -->
          <div class="models right-item">
            <!-- 标题 -->
            <h3>{{ $t('recommendModel') }}</h3>
            <!-- 数据列表 -->
            <ul v-if="recommendModels && recommendModels.length > 0">
              <!-- 每一项模型数据 -->
              <li v-for="(item, index) in recommendModels" :key="index">
                <!-- 图片封面容器 -->
                <div class="thumb">
                  <a @click="linkToModel(item)">
                    <img :src="getImage(item.thumb)" />
                  </a>
                </div>
                <!-- 模型信息部分 -->
                <div class="info">
                  <h4 :class="{noUser: !user}"><a @click="linkToModel(item)">{{ item.name }}</a></h4>
                  <div class="info-bottom" v-if="user">
                    <el-tooltip effect="dark" :content="$t('browser')" placement="top">
                      <a class="info-count" @click="linkToModel(item)">
                        <i class="iconfont icon-liulan"></i> {{ item.modelBrowserCount }}
                      </a>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('collect')" placement="top">
                      <a class="info-count" @click="linkToModel(item)">
                        <i class="iconfont icon-31shoucangxuanzhong"></i> {{ item.modelCollectCount }}
                      </a>
                    </el-tooltip>
                    <!-- <el-tooltip effect="dark" :content="$t('thumbUp')" placement="top">
                      <a class="info-count" @click="linkToModel(item)">
                        <i class="iconfont icon-dianzan"></i>111
                      </a>
                    </el-tooltip> -->
                  </div>
                </div>
              </li>
            </ul>
            <div class="empty" v-else>
              <div class="content">{{ $t('noData') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改模型弹框 -->
    <dialoger
      :visible="showDialog"
      :title="$t('modelSet')"
      @confirm="confirmSetModel"
      @cancel="cancelSetModel"
    >
      <!-- 修改模型对象表单 -->
      <el-form ref="setModelForm" class="setModelForm" :model="setModelObj" :rules="rules" size="small" label-position="left" label-width="100px">
        <!-- 模型名称 -->
        <el-form-item :label="$t('name') + '：'" prop="name">
          <el-input v-model="setModelObj.name" maxlength="14" :placeholder="$t('modelNamePlace')"></el-input>
        </el-form-item>
        <!-- 模型描述 -->
        <el-form-item :label="$t('description') + '：'" prop="description">
          <el-input  type="textarea" :rows="5" :show-word-limit="true" maxlength="255" v-model="setModelObj.description" :placeholder="$t('modelDesPlace')" resize="none" />
        </el-form-item>
        <!-- 模型标签 -->
        <el-form-item :label="$t('tag') + '：'">
          <el-input
            v-model="tagsInput"
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
          <el-input  v-model="setModelObj.foreignLink" :placeholder="$t('foreignLinkPlace')" />
        </el-form-item>
        <!-- 模型分类 -->
        <el-form-item :label="$t('modelCategory') + '：'" prop="category">
          <el-cascader
            :options="categoryArr"
            :props="categoryProps"
            v-model="categoryValue"
            @change="categoryChange"
          ></el-cascader>
        </el-form-item>
        <!-- 允许下载 -->
        <el-form-item :label="$t('downable') + '：'">
          <el-switch  v-model="setModelObj.downloadStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
        </el-form-item>
        <!-- 私人模型 -->
        <el-form-item :label="$t('publicable') + '：'">
          <el-switch  v-model="setModelObj.publicStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
        </el-form-item>
        <!-- 允许评论 -->
        <el-form-item :label="$t('reviewable') + '：'">
          <el-switch  v-model="setModelObj.reviewStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
        </el-form-item>
        <!-- 推荐模型 -->
        <el-form-item :label="$t('recommendModel') + '：'">
          <el-switch  v-model="setModelObj.recommendStatus" active-color="#2489f3" active-text="ON" inactive-text="OFF"></el-switch>
        </el-form-item>
      </el-form>
    </dialoger>
    <!-- 淘宝引用弹框 -->
    <dialoger
      :visible="showTaobaoDialog"
      :title="$t('taobaoQuote')"
      @confirm="taobaoClose"
      @cancel="taobaoClose"
    >
      <el-input  type="textarea" :rows="5" maxlength="255" v-model="taobaoLink" resize="none" />
    </dialoger>
    <!-- 引用代码弹框 -->
    <dialoger
      :visible="showQuoteCodeDialog"
      :title="$t('quoteCode')"
      @confirm="quoteCodeClose"
      @cancel="quoteCodeClose"
    >
      <el-input type="textarea" :rows="5" maxlength="255" v-model="quoteCode" resize="none" />
    </dialoger>
    <!-- 微信分享弹框 -->
    <dialoger
      :visible="showWeixinDialog"
      :title="$t('weixinShareTitle')"
      @confirm="weixinClose"
      @cancel="weixinClose"
    >
      <div class="weixin-container">
        <!-- 左边的qrcode -->
        <div class="qrcode-pic">
          <p>手机微信扫一扫</p>
          <div class="qrcode-outer">
            <div class="qrcode-inner" ref="code"></div>
          </div>
        </div>
        <!-- 右边的识别图 -->
        <div class="qrcode-pic">
          <p>说明图</p>
          <div class="pic">
            <img :src="weixinss" />
          </div>
        </div>
      </div>
    </dialoger>
  </div>
</template>
<script>
import {
  // 获取模型详情
  getModelDetail,
  // 获取相关模型|推荐模型列表
  getAboutModel,
  // 获取模型评论
  getModelComment,
  // 添加模型评论
  addModelComment,
  // 删除模型评论
  deleteModelComment,
  // 获取模型分类
  getModelCategory,
  // 修改模型对象
  setModel,
  exportModel,
  // 添加模型浏览数据
  addModelLog,
  // 取消模型点赞收藏等
  delModelLog,
  // 查询浏览状态
  checkModelLog,
  // 添加浏览量无权限
  addBrowser,
  delModel
} from '@/api/model/model.js';
import {
  getCurrentInfo,
  getUserInfo,
  getAttension,
  attension,
  cancelAttension,
  // 获取文件系统token
  getFileToken
} from '@/api/user/user.js';
import {
  filePrefix,
  image,
  aboutModelType,
  taobaoLink,
  modelLogType,
  storeModelDownload,
  userModelType,
  weiboShare,
  qqShare,
  isNetworkImg
} from '@/utils/global.js';
import { i18n } from '@/assets/languages/i18n.js';
import { requiredBlurRules } from '@/utils/rules.js';
import * as rule from '@/utils/rules.js';
import model from '@/components/common/render/model.vue';
import comment from '@/components/common/comment/comment.vue';
import dropdownMenu from '@/components/common/dropdownMenu/dropdownMenu.vue';
import dialoger from '@/components/common/dialoger/dialoger.vue';
import Vue from 'vue';
import QRCode from 'qrcodejs2';

const rules = {
  content: requiredBlurRules,
  name: rule.requiredRules,
  description: rule.requiredRules,
  category: rule.requiredRules
};

// 静态用户信息
const userInfo = {
  city: null,
  county: null,
  domain: null,
  email: null,
  homepage: null,
  introduce: null,
  mobile: null,
  nickname: '厦门三维云科技有限公司',
  occuptaion: null,
  origin: null,
  province: null,
  sex: null,
  thumb: null
};

// 获取相关模型和推荐模型公用参数对象
const params = {
  page: 1,
  size: 3
};

// 获取模型评论默认参数对象
const commentParams = {
  parentId: 0,
  pkId: 0,
  size: 3,
  sortMode: 'DESC'
};
// 默认评论对象
const defaultComment = {
  parentId: null,
  content: '',
  userId: null
};

export default {
  name: 'ModelListDetail',
  components: {
    model,
    comment,
    dropdownMenu,
    dialoger
  },
  data() {
    return {
      rules,
      // 路由传过来的模型id
      modelId: null,
      // 外部获取模型页面的oid
      oid: null,
      // 根据模型id拉取的模型对象数据
      model: {},
      // 是否有用户模块
      user: false,
      // 用户是否登录
      isLogin: false,
      // 该模型的用户是否已关注
      isAttension: false,
      // 模型的用户信息
      userInfo: Object.assign({}, userInfo),
      // 当前用户信息
      currentUser: {},
      // 获取相关模型和推荐模型传参
      params,
      // 模型评论列表加载开关
      commentLoading: false,
      // 获取模型评论参数
      commentParams,
      // 模型评论数据保存最小id
      commentMin: 0,
      // 模型评论数据保存最大id
      commentMax: 0,
      // 相关模型数组
      aboutModels: null,
      // 推荐模型数组
      recommendModels: null,
      // 添加评论表单默认绑定对象
      commentObj: Object.assign({}, defaultComment),
      // 模型评论数据数组
      comments: [],
      // 模型分类数组
      categorys: [],
      // 标签绑定数组数据
      tags: [],
      // 编辑模型对象弹框开关
      showDialog: false,
      // 淘宝引用弹框开关
      showTaobaoDialog: false,
      // 淘宝引用弹框显示的地址
      taobaoLink: null,
      // 引用代码弹框开关
      showQuoteCodeDialog: false,
      showWeixinDialog: false,
      // 
      quoteCode: null,
      // 修改模型对象弹框绑定对象
      setModelObj: {},
      // 修改模型对象表单模型标签输入框绑定值
      tagsInput: '',
      // 生成的标签数组
      tagsArr: [],
      // 模型标签多选框绑定数组
      tagsValue: [],
      categoryArr: [],
      // 修改模型对象分类选择配置对象
      categoryProps: {
        label: 'name',
        value: 'id',
        children: 'child',
        multiple: true,
        checkStrictly: true
      },
      // 修改模型对象分类选择绑定值数组
      categoryValue: [],
      // 修改模型对象请求防抖开关
      setModelFlag: false,
      // 下载按钮防抖开关
      downloadFlag: false,
      // 下载按钮动画显示百分比数字
      downloadCount: 0,
      // 下载动画显示
      downloadShow: false,
      // 删除模型防抖
      delModelFlag: false,
      weixinss: require('@/assets/wxss.jpg'),
      qrcode: ''
    }
  },
  created() {
    this.initConfig();
    if (this.$route.query && this.$route.query.id !== undefined) {
      this.modelId = +this.$route.query.id;
      addBrowser({
        modelId: this.modelId,
        type: modelLogType.BROWSER.type
      });
      // 初始化模型详情数据
      this.initDetail(this.modelId);
      // 获取相关模型数据
      this.initAboutModels(this.modelId);
      // 获取推荐模型数据
      this.initRecommendModels(this.modelId);
      this.initCategorys();
    } else {
      // console.log('路径没有模型id')
      // 没有获取到模型id
      this.$message({
        message: this.$t('initModelFail'),
        type: 'error',
        duration: 1500
      });
      this.$router.back(-1);
    }
  },
  computed: {
    getImg() {
      return function (src) {
        return src ? (isNetworkImg(src) ? src : filePrefix + image + src) : require('@/assets/default/user.jpg');
      }
    },
    getImage() {
      return function (src) {
        return src ? filePrefix + image + src : '';
      }
    },
    getValue() {
      return function (obj, key) {
        return obj ? obj[key] : i18n.t('noData');
      }
    },
    getTime() {
      return function (time) {
        console.log(time)
        return time ? new Date(time).toLocaleString() : i18n.t('noTime');
      }
    },
    getBtnShowTxt() {
      return function (flag) {
        return flag ? i18n.t('packReply') : i18n.t('checkReply');
      }
    },
    getHref() {
      return function (path) {
        let origin;
        if (!window.location.origin) {
          origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' +  window.location.port : ''}`;
        } else {
          origin = window.location.origin;
        }
        return path ? `${origin}${path}` : `${origin}`; 
      }
    }
  },
  watch: {
    isLogin(value) {
      if (value) {
        this.checkModelLog(modelLogType.SUPPORT);
        this.checkModelLog(modelLogType.COLLECT);
      }
    }
  },
  methods: {
    // 获取项目相关配置信息
    initConfig() {
      let user = this.$store.getters.user;
      this.user = user !== undefined ? !!+user : false;
      this.isLogin = !! this.$store.getters.token;
      // 是用户系统就初始化用户信息
      this.user && this.initCurrentUser();
      // console.log(`用户系统：${this.user}`);
      // console.log(`是否登录：${this.isLogin}`);
    },
    // 初始化登录用户信息
    initCurrentUser() {
      if (!this.isLogin) {
        return;
      }
      let infoRes = this.$store.getters.userInfo;
      if (!infoRes) {
        this.$store.dispatch('getInfo')
          .then(res => {
            this.currentUser = res;
          })
          .catch(err => {
            this.$message({
              message: this.$t('getUserInfoFail') + err,
              type: 'error',
              duration: 1500
            });
          });
      } else {
        this.currentUser = JSON.parse(infoRes);
      }
      // console.log(this.currentUser);
    },
    // 初始化模型用户信息
    initUserInfo() {
      getUserInfo(this.model.userId)
        .then(res => {
          if (res.code === 20000) {
            this.userInfo = res.data;
          }
        })
    },
    // 初始化模型信息
    initDetail(id) {
      getModelDetail(id)
        .then(res => {
          if (res.code === 20000) {
            console.log(res.data)
            // 获取到模型数据
            this.model = res.data;
            // console.log(this.model)
            document.title = this.model.name ? `${this.model.name}${this.$t('pageTitle.model')}` : this.$t('pageTitle.main');
            this.oid = this.model.oid;
            this.model.userId && (this.initUserInfo());
            Vue.set(this.model, `${modelLogType.COLLECT.key}Flag`, false);
            Vue.set(this.model, `${modelLogType.SUPPORT.key}Flag`, false);
            Vue.set(this.model, `${modelLogType.BROWSER.key}Flag`, false);
            Vue.set(this.model, `${modelLogType.DOWNLOAD.key}Flag`, false);
            // 设置右边的分类标签数据
            this.categorys = this.model.categorys;
            // 构建对象的category字符串属性用于修改模型对象
            if (Array.isArray(this.model.categorys)) {
              this.model.category = this.model.categorys.map(item => item.id).join(',');
            } else {
              this.model.category = '';
            }
            // Array.isArray(this.model.categorys) && (this.model.category = this.model.categorys.map(item => item.id).join(','));
            // 设置右边的tag标签数据
            this.model.tags && Array.isArray(this.model.tags) && (this.tags = this.model.tags);
            // 有用户系统，已登录发送该模型用户是否已关注
            !this.setModelFlag && this.user && this.isLogin && this.getAttension();
            // 有用户系统，模型设置可评论拉取评论数据
            this.user && this.model.reviewStatus && this.initComments(this.modelId, this.commentParams);
            // 有用户系统，获取点赞和收藏的状态
            this.user && this.isLogin && (this.checkModelLog(modelLogType.SUPPORT));
            this.user && this.isLogin && (this.checkModelLog(modelLogType.COLLECT));
          } else {
            this.$message({
              message: this.$t('initModelFail'),
              type: 'error',
              duration: 1500
            });
            this.$router.back(-1);
          }
          this.setModelFlag = false;
        })
        .catch(err => {
          this.$message({
            message: this.$t('initModelFail'),
            type: 'error',
            duration: 1500
          });
          this.setModelFlag = false;
          this.$router.back(-1);
        });
    },
    // 初始化模型分类数据
    initCategorys() {
      getModelCategory()
        .then(res => {
          if (res.code === 20000) {
            let categorys = res.data;
            categorys.map(item => {
              item.id = item.parent.id;
              item.name = item.parent.name;
              return item;
            })
            this.categoryArr = categorys;
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('initCategoryFail'),
              type: 'error',
              duration: 1500
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initCategoryFail'),
            type: 'error',
            duration: 1500
          });
        })
    },
    // 初始化模型相关模型
    initAboutModels(id) {
      getAboutModel(id, aboutModelType.COMPREHENSIVE, this.params)
        .then(res => {
          if (res.code === 20000) {
            this.aboutModels = res.data;
          } else if (res.code === 20004) {
            this.aboutModels = [];
          }
        })
        .catch(err => {
          this.$message({
            message: this.$t('initAboutModelFail'),
            type: 'error',
            duration: 1500
          });
        });
    },
    // 初始化模型推荐模型
    initRecommendModels(id) {
      getAboutModel(id, aboutModelType.THUMB, this.params)
        .then(res => {
          if (res.code === 20000) {
            this.recommendModels = res.data;
          } else if (res.code === 20004) {
            this.recommendModels = [];
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('initRecommendModelFail'),
            type: 'error',
            duration: 1500
          });
        });
    },
    // 有用户系统用户已登录获取模型用户是否关注
    getAttension() {
      getAttension(this.model.userId)
        .then(res => {
          if (res.code === 20000) {
            this.isAttension = res.data;
          } else {
            this.isAttension = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.isAttension = false;
        })
    },
    // 初始化模型评论
    initComments(modelId, params) {
      this.commentLoading = true;
      getModelComment(modelId, params)
        .then(res => {
          this.commentLoading = false;
          if (res.code === 20000) {
            for (const item of res.data) {
              this.setCommentPropery(item);
              getModelComment(modelId, item.params)
                .then(result => {
                  if (result.code === 20000) {
                    for (const itm of result.data) {
                      this.setCommentPropery(itm);
                    }
                    item.childList = result.data;
                    this.sortCommentChildList(item.childList, item);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
            this.comments = this.comments.concat(res.data);
            this.sortComment();
          } else if (res.code === 20004) {
            // this.$message({
            //   message: this.$t('noMoreComments'),
            //   type: 'warning',
            //   duration: 1500
            // });
          }
        })
        .catch(err => {
          this.commentLoading = false;
          console.log(err);
        });
    },
    // 排序评论数据数组
    sortComment() {
      this.comments.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        } else {
          return 0;
        }
      });
      this.commentMax = this.comments[0].id;
      this.commentMin = this.comments[this.comments.length - 1].id;
    },
    // 工具函数，为评论对象添加自定义属性
    setCommentPropery(item) {
      Vue.set(item, 'childList', []);
      Vue.set(item, 'reply', {
        content: '',
        parentId: item.id,
        userId: null
      });
      Vue.set(item, 'loading', false);
      Vue.set(item, 'replyShow', false);
      Vue.set(item, 'childrenShow', false);
      Vue.set(item, 'minId', 0);
      Vue.set(item, 'params', {
        pkId: 0,
        sortMode: 'DESC',
        size: 3,
        parentId: item.id
      });
    },
    // 排序childList并保存minId
    sortCommentChildList(list, item) {
      list.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        } else {
          return 0;
        }
      });
      item.minId = list[list.length - 1].id;
    },
    // 点击加载更多一级评论
    getMoreComments() {
      this.commentParams.pkId = this.commentMin;
      this.initComments(this.modelId, this.commentParams);
    },
    // 添加一级模型评论使用this.commentObj
    addParentComment() {
      // 用户未登录跳转到登录页面
      if (!this.isLogin) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.$refs.parentCommentAdd.validate(valid => {
        if (valid) {
          this.commentObj.userId = this.currentUser.id;
          this.commentObj.parentId = 0;
          addModelComment(this.modelId, this.commentObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('addCommentSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.commentObj = Object.assign({}, defaultComment);
                this.commentMin = 0;
                this.commentMax = 0;
                this.commentParams = Object.assign({}, commentParams);
                this.comments = [];
                this.initComments(this.modelId, this.commentParams);
              } else {
                this.$message({
                  message: this.$t('addCommentFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('addCommentFail'),
                type: 'error',
                duration: 1500
              });
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      });
    },
    addChildComment(item) {
      // 用户未登录跳转到登录页面
      if (!this.isLogin) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.$refs[`commentForm${item.id}`][0].validate(valid => {
        if (valid) {
          item.reply.userId = this.currentUser.id;
          addModelComment(this.modelId, item.reply)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('addCommentSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.commentObj = Object.assign({}, defaultComment);
                this.commentMin = 0;
                this.commentMax = 0;
                this.commentParams = Object.assign({}, commentParams);
                this.comments = [];
                this.initComments(this.modelId, this.commentParams);
              } else {
                this.$message({
                  message: this.$t('addCommentFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('addCommentFail'),
                type: 'error',
                duration: 1500
              });
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
        }
      });
    },
    deleteComment(item) {
      this.$confirm(this.$t('delCommentWarning'), this.$t('warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteModelComment(item.modelId, item.id)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('delModelReviewSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.commentParams = Object.assign({}, commentParams);
                this.comments = [];
                this.initComments(this.modelId, this.commentParams);
              } else {
                this.$message({
                  message: this.$t('delModelReviewFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('delModelReviewFail'),
                type: 'error',
                duration: 1500
              });
            })
        })
        .catch(() => {
          this.$message({
            message: this.$t('delCommentCancel'),
            type: 'warning',
            duration: 1500
          });
        });
    },
    // 点击右边用户部分的关注按钮
    attension() {
      attension({
        followedId: this.model.userId
      })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('attentionSuc'),
              type: 'success',
              duration: 1500
            });
            this.isAttension = true;
          } else {
            this.$message({
              message: this.$t('attentionFail'),
              type: 'error',
              duration: 1500
            });
            this.isAttension = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('attentionFail'),
            type: 'error',
            duration: 1500
          });
          this.isAttension = false;
        });
    },
    // 点击右边用户部分的取消关注按钮
    attensioned() {
      cancelAttension(this.model.userId)
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: this.$t('cancelAttensionSuc'),
              type: 'success',
              duration: 1500
            });
            this.isAttension = false;
          } else {
            this.$message({
              message: this.$t('cancelAttensionFail'),
              type: 'error',
              duration: 1500
            });
            this.isAttension = true;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
              message: this.$t('cancelAttensionFail'),
              type: 'error',
              duration: 1500
            });
            this.isAttension = true;
        })
    },
    // 点击模型下方的修改按钮事件
    showSetModel() {
      this.setModelObj = JSON.parse(JSON.stringify(this.model));
      if (this.setModelObj.tags !== null) {
        // this.tagsArr = this.setModelObj.tags.split(',');
        // this.tagsValue = this.setModelObj.tags.split(',');
        this.tagsArr = this.setModelObj.tags.map(item => item.name);
        this.tagsValue = this.setModelObj.tags.map(item => item.name);
      }
      if (Array.isArray(this.setModelObj.categorys)) {
        this.categoryValue = this.setModelObj.categorys.reduce((arr, cur) => {
          this.categoryArr.forEach(item => {
            if (item.id === cur.id) {
              arr.push([item.id]);
            } else if (Array.isArray(item.child)){
              for (let child of item.child) {
                child.id === cur.id && (arr.push([item.id, child.id]));
              }
            }
          });
          return arr;
        } ,[]);
      }
      this.showDialog = true;
    },
    // 模型标签输入框输入事件
    inputTag(e) {
      let reg = /,/;
      if (reg.test(e)) {
        this.tagsInput = e.slice(0, -1);
      }
    },
    // 模型标签输入框生成标签事件
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
    // 删除模型标签事件
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
        this.tagsValue.length > 0 && (this.setModelObj.tag = this.tagsValue.join(','));
        this.tagsValue.length === 0 && (this.setModelObj.tag = null);
      }
    },
    // 模型标签多选框选择事件
    selectTags(e) {
       if (e.length <= 0) {
        this.setModelObj.tag = null;
      } else {
        this.setModelObj.tag = e.join(',');
      }
    },
    // 分类选择事件
    categoryChange(e) {
      let arr = [];
      if (e.length <= 0) {
        this.setModelObj.category = null;
      } else {
        arr = e.map(item => item[item.length - 1]);
        this.setModelObj.category = arr.join(',');
      }
    },
    // 点击模型修改弹框确定事件
    confirmSetModel() {
      if (this.setModelFlag) {
        return;
      }
      this.setModelFlag = true;
      this.$refs.setModelForm.validate(valid => {
        if (valid) {
          setModel(this.setModelObj)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('setModelSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.tagsArr = [];
                this.tagsValue = [];
                this.categoryValue = [];
                this.setModelObj = {};
                this.showDialog = false;
                this.initDetail(this.modelId);
              } else {
                this.$message({
                  message: this.$t('setModelFail'),
                  type: 'error',
                  duration: 1500
                });
                this.setModelFlag = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('setModelFail'),
                type: 'error',
                duration: 1500
              });
              this.setModelFlag = false;
            })
        } else {
          this.$message({
            message: this.$t('validateFail'),
            type: 'warning',
            duration: 1500
          });
          this.setModelFlag = false;
        }
      })
    },
    // 点击模型修改弹框取消和关闭按钮事件
    cancelSetModel() {
      this.tagsArr = [];
      this.tagsValue = [];
      this.categoryValue = [];
      this.setModelObj = {};
      this.showDialog = false;
    },
    // 点击淘宝引用按钮
    openTaobaoDialog() {
      // this.taobaoLink = `${taobaoLink}${this.modelId}`;
      this.taobaoLink = `${taobaoLink}${this.oid}`;
      this.showTaobaoDialog = true;
    },
    // 淘宝引用弹框关闭
    taobaoClose() {
      this.showTaobaoDialog = false;
    },
    // 用户点击点赞按钮
    changeSupport() {
      if (this.model.supportFlag) {
        this.delCount(modelLogType.SUPPORT);
      } else {
        this.addCount(modelLogType.SUPPORT);
      }
    },
    // 用户点击收藏按钮
    changeCollect() {
      if (this.model.collectFlag) {
        this.delCount(modelLogType.COLLECT);
      } else {
        this.addCount(modelLogType.COLLECT);
      }
    },
    // 增加点赞收藏浏览下载量
    addCount(typeObj, success, fail) {
      addModelLog({
        modelId: this.modelId,
        type: typeObj.type
      })
        .then(res => {
          if (res.code === 20000) {
            let message = typeObj.type === modelLogType.SUPPORT.type ? this.$t('supportAddSuc') : this.$t('collectAddSuc');
            typeObj.type !== modelLogType.DOWNLOAD.type && this.$message({
              message,
              type: 'success',
              duration: 1500
            });
            this.model[`${typeObj.key}Count`]++;
            this.model[`${typeObj.key}Flag`] = true;
            success && success();
          } else {
            let message = typeObj.type === modelLogType.SUPPORT.type ? this.$t('supportAddFail') : this.$t('collectAddFail');
            typeObj.type !== modelLogType.DOWNLOAD.type && this.$message({
              message,
              type: 'error',
              duration: 1500
            });
            fail && fail();
          }
        })
        .catch(err => {
          console.log(err);
          let message = typeObj.type === modelLogType.SUPPORT.type ? this.$t('supportAddFail') : this.$t('collectAddFail');
          typeObj.type !== modelLogType.DOWNLOAD.type && this.$message({
            message,
            type: 'error',
            duration: 1500
          });
          fail && fail();
        })
    },
    delCount(typeObj, success, fail) {
      delModelLog({
        modelId: this.modelId,
        type: typeObj.type
      })
        .then(res => {
          if (res.code === 20000) {
            let message = typeObj.type === modelLogType.SUPPORT.type ? this.$t('supportDelSuc') : this.$t('collectDelSuc');
            this.$message({
              message,
              type: 'success',
              duration: 1500
            });
            this.model[`${typeObj.key}Count`]--;
            this.model[`${typeObj.key}Flag`] = false;
            success && success();
          } else {
            let message = typeObj.type === modelLogType.SUPPORT.type ? this.$t('supportDelFail') : this.$t('collectDelFail');
            this.$message({
              message,
              type: 'error',
              duration: 1500
            });
            fail && fail();
          }
        })
        .catch(err => {
          console.log(err);
          let message = typeObj.type === modelLogType.SUPPORT.type ? this.$t('supportDelFail') : this.$t('collectDelFail');
          this.$message({
            message,
            type: 'error',
            duration: 1500
          });
          fail && fail();
        })
    },
    // 判断点赞收藏的状态
    checkModelLog(typeObj) {
      checkModelLog({
        modelId: this.modelId,
        type: typeObj.type
      })
        .then(res => {
          if (res.code === 20000) {
            this.model[`${typeObj.key}Flag`] = res.data;
          } else {
            this.model[`${typeObj.key}Flag`] = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.model[`${typeObj.key}Flag`] = false;
        })
    },
    // 用户点击下载按钮
    download() {
      if (!this.model.downloadStatus) {
        this.$message({
          message: this.$t('downloadFalse'),
          type: 'warning',
          duration: 1500
        });
        return;
      }
      if (this.downloadFlag) {
        return;
      }
      this.downloadFlag = true;
      getFileToken({
        operator: 'query',
        fileType: 'zip',
        fileSize: 0
      })
        .then(res => {
          if (res.code === 20000) {
            this.downloadShow = true;
            this.$message({
              message: this.$t('downloadStart'),
              type: 'success',
              duration: 1500
            });
            this.modelDownloading()
          } else {
            this.$message({
              message: this.$t('downloadTokenFail'),
              type: 'warning',
              duration: 1500
            });
            this.downloadFlag = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: this.$t('downloadTokenFail'),
            type: 'warning',
            duration: 1500
          });
          this.downloadFlag = false;
        });
    },
    modelDownloading() {
      const reg = /(?<=.+_.+)_/;
      const that = this;
      if (this.model.model && this.model.model.search(reg) > 0 || this.model.type == 1) {
        let filename = this.model.type == 1 ? this.model.model : this.model.model.slice(0, this.model.model.search(reg));
        let xhr = new XMLHttpRequest();
        xhr.open('get', storeModelDownload + filename, true);
        xhr.responseType = 'blob';
        xhr.send();
        // 下载进度展示回调---响应头没有content-length没法获取total做进度条
        // xhr.onprogress = function (e) {
        //   console.log(e)
        //   // that.downloadCount = (e.loaded / e.currentTarget.response.size * 100).toFixed(2);
        // };
        xhr.onload = function () {
          let blob,
              a,
              fileUrl;
          if (this.status >= 200 && this.status < 300 || this.status == 304) {
            that.downloadShow = false;
            blob = new Blob([this.response]);
            a = document.createElement('a');
            fileUrl = window.URL.createObjectURL(blob);
            a.href = fileUrl;
            a.download = `${filename}.zip`;
            a.click();
            that.addCount(modelLogType.DOWNLOAD);
            that.$message({
              message: that.$t('downloadSuc'),
              type: 'success',
              duration: 1500
            });
            that.downloadFlag = false;
            // window.URL.revokeObjectURL(blob);
          } else {
            that.downloadShow = false;
            that.downloadCount = 0;
          }
        };
      } else {
        this.$message({
          message: this.$t('modelTypeWrong'),
          type: 'error',
          duration: 1500
        });
        this.downloadFlag = false;
        return;
      }
    },
    // 点击删除模型事件
    delModel() {
      if (this.delModelFlag) {
        return;
      }
      this.delModelFlag = true;
      this.$confirm(this.$t('delModelWarning'),this.$t('warning'),{
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          delModel(this.modelId)
            .then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: this.$t('delSuc'),
                  type: 'success',
                  duration: 1500
                });
                this.delModelFlag = false;
                this.$router.push('/');
              } else {
                this.$message({
                  message: this.$t('delFail'),
                  type: 'error',
                  duration: 1500
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: this.$t('delFail'),
                type: 'error',
                duration: 1500
              });
              this.delModelFlag = false;
            });
        })
        .catch(() => {
          this.$message({
            message: this.$t('delCancel'),
            type: 'error',
            duration: 1500
          });
          this.delModelFlag = false;
        });
    },
    // 点击标签跳转到标签模型页面
    linkToTagModels(item) {
      this.$router.push({
        path: '/home/tagModelList',
        query: {
          tagId: item.id,
          title: item.name
        }
      });
    },
    // 点击3D设置跳转到模型编辑页面
    linkToEditor() {
      this.$router.push({
        path: '/model/editor',
        query: {
          id: this.modelId
        }
      });
    },
    // 点击相关模型和推荐模型的各个部分跳转到对应模型详情页
    linkToModel(item) {
      this.$router.push({
        path: '/home/modelListDetail',
        query: {
          id: item.id
        }
      });
    },
    // 点击右边用户部分我的模型
    linkToMyModels() {
      this.$router.push({
        path: '/home/userList',
        query: {
          value: userModelType.PRIVATE,
          type: 'model'
        }
      });
    },
    // 点击用户头像跳转到用户信息界面
    linkToUser() {
      this.$router.push({
        path: '/home/userList',
        query: {
          value: userModelType.ALL,
          type: 'model'
        }
      });
    },
    // 点击分类标签跳转到模型列表页
    linkToListByCategory(item) {
      this.$router.push({
        path: '/home/modelList',
        query: {
          categoryId: item.id
        }
      });
    },
    // 点击@Ta跳转到消息页面
    sendMessage() {
      if (this.userInfo.id) {
        this.$router.push({
          path: '/home/message',
          query: {
            userId: this.userInfo.id,
            username: this.userInfo.username
          }
        });
      }
    },
    // 点击引用代码
    openQuoteCode() {
      // let template = `<div ><iframe width="100%" height="480" src="${this.getHref()}/modelDetail/?id=${this.modelId}" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe></div>`;
      let template = `<div ><iframe width="100%" height="480" src="${this.getHref()}/model/${this.oid}" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe></div>`;
      this.quoteCode = template;
      this.showQuoteCodeDialog = true;
    },
    // 关闭引用代码弹框
    quoteCodeClose() {
      this.showQuoteCodeDialog = false;
    },
    openWeixinShare() {
      this.showWeixinDialog = true;
      this.$nextTick(() => {
        this.createQRCode();
      });
    },
    createQRCode() {
      const that = this;
      this.qrcode = new QRCode(that.$refs.code, {
        text: that.getHref(`/modelDetail/?id=${that.modelId}`),
        width: that.$refs.code.clientWidth,
        height: that.$refs.code.clientHeight
      })
    },
    weixinClose() {
      this.showWeixinDialog = false;
    },
    weiboShare() {
      let link = document.createElement('a');
      link.href = weiboShare + this.getHref(`/modelDetail/?id=${this.modelId}&title=我在乐乐三维云发现一个有趣的模型！#_loginLayer_1676459670101`);
      link.target = '_blank';
      link.click();
      link = null;
    },
    qqShare() {
      let link = document.createElement('a');
      link.href = qqShare + this.getHref(`/modelDetail/?id=${this.modelId}&title=我在乐乐三维云发现一个有趣的模型！#_loginLayer_1676459670101`);
      link.target = '_blank';
      link.click();
      link = null;
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';
// 模型名称部分
.model-name {
  width: 100%;
  margin: 20px auto;
  color: var(--color--fontMain);
  h1 {
    font-size: 20px;
    line-height: 20px;
  }
}
// 下方的主体内容区域
.content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  color: var(--color--fontMain);
}
.left,
.right {
  box-sizing: border-box;
  padding: 0 15px;
}
// 左边部分公用样式
.left {
  box-sizing: border-box;
  // 模型展示容器
  .model-container {
    width: 100%;
    padding-top: 56.2%;
    // 背景透明
    // background-color: transparent;
    background-color: #ccc;
    position: relative;
  }
  // 模型容器下方的按钮部分
  .btn-container {
    display: flex;
    margin: 10px auto;
    justify-content: space-between;
    .left-content,
    .right-content {
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
    }
    .right-content {
      .actions::v-deep .dropdown.bottom {
        margin-top: -4px;
      }
    }
  }

  // 下方按钮左边部分
  .left-content {
    .leftBtn {
      box-sizing: border-box;
      padding: 4px;
      border: 2px solid $color-fontMain;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
      &:hover {
        color: $color-main;
        border-color: $color-main;
      }
      .left-icon {
        margin-right: 4px;
      }
    }
    .leftBtn.isActive {
      background-color: $color-main;
      border-color: $color-main;
      &:hover {
        color: $color-fontMain;
      }
    }

  }
  // 下方按钮右边部分
  .right-content {
    .rightBtn {
      margin-right: 5px;
    }
  }

  // 添加评论部分
  .add-comment {
    box-sizing: border-box;
    margin: 30px auto 0;
    display: flex;
    // 用户头像
    .comment-user {
      width: 50px;
      height: 50px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    // 右边表单部分
    .comment-form {
      box-sizing: border-box;
      width: calc(100% - 50px);
      margin-left: 20px;
      &::v-deep .el-textarea__inner {
        padding: 9px 14px;
        border-radius: 4px;
        box-sizing: border-box;
        line-height: 18px;
        height: 50px;
        color: var(--color--fontMain);
        transition: height 0.2s ease 0s;
        font-size: 16px;
        background-color: var(--color--navbg);
        border: transparent;
        outline: medium none;
        resize: none;
      }
      &::v-deep .el-textarea__inner:focus {
        height: 108px;
      }
    }
  }
  // 评论列表部分-外层容器
  .comments {
    box-sizing: border-box;
    padding-top: 10px;
    border-top: 1px solid #505050;
    margin-bottom: 20px;
    // 内层ul容器
    .comments-container {
      margin-bottom: 10px;
      // 每一个评论项
      .comment-item {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        margin-bottom: 10px;
        // 用户头像部分
        .item-user {
          // width: 50px;
          // height: 50px;
          margin-right: 20px;
          img {
            width: 50px;
            height: 50px;
          }
        }
        // 评论内容主体部分
        .item-content {
          width: calc(100% - 70px);
          padding: 20px;
          background-color: var(--color--navbg);
          border-radius: 4px;
          color: var(--color--fontMain);
          position: relative;
          // 左侧的小三角
          &::before {
            content: "";
            border: 0 solid transparent;
            border-width: 10px 10px 10px 0;
            border-right-color: var(--color--navbg);
            position: absolute;
            top: 15px;
            left: -10px;
          }
          // 用户名
          .item-username {
            box-sizing: border-box;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
            min-width: 112px;
            margin-bottom: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          // 评论内容部分
          .item-inner {
            margin-bottom: 10px;
          }
          // 评论时间部分
          .item-time {
            margin-bottom: 5px;
          }

          // 二级评论部分
          .item-reply {
            & .el-form-item {
              margin-bottom: 10px;
            }
            // 修改默认样式
            &::v-deep .el-textarea__inner {
              border: transparent;
              outline: medium none;
              resize: none;
              color: var(--color--fontMain);
              font-size: 14px;
              background-color: #2d2e31;
            }
          }
          // 二级评论子列表为空时显示
          .item-childList-empty {
            border-radius: 2px;
            padding: 4px;
            border: 1px dashed var(--color--ori);
            color: var(--color--ori);
            text-align: center;
          }
        }

      }
    }
    .empty {
      margin-bottom: 20px;
    }
    .btn-group {
      text-align: center;
    }
  }
}
// 右边公用样式
.right {
  box-sizing: border-box;
  .right-item {
    box-sizing: border-box;
    width: 100%;
    background-color: var(--color--navbg);
    padding: 20px;
    margin-top: 20px;
    border-radius: 4px;
  }
  // 用户信息部分
  .userInfo {
    box-sizing: border-box;
    width: 100%;
    background-color: var(--color--navbg);
    display: flex;
    border-radius: 4px;
    height: 82px;
    overflow: hidden;
    // 用户头像部分
    .user-logo {
      width: 82px;
      height: 82px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    // 用户名部分
    .user-info {
      box-sizing: border-box;
      width: calc(100% - 82px);
      height: 100%;
      // 上方的用户名
      .top {
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      // 下面的按钮部分
      .bottom {
        padding-left: 10px;
        height: 46px;
        .btn {
          margin: 0 10px;
          .iconfont {
            vertical-align: middle;
          }
        }
        .btn-color {
          color: $color-main;
          font-weight: bold;
        }
        .btn-ori {
          background-color: $color-ori;
          color: $color-fontMain;
          font-weight: bold;
        }
      }
    }
  }

  // 模型简介信息等部分
  .model-about {
    // 标题
    h3 {
      font-size: 18px;
      margin: 0 0 16px;
    }
    // 简介部分
    .intro {
      max-height: 200px;
      margin-bottom: 30px;
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      white-space:pre-line;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 9;
    }
    // 公共项样式
    .about-item {
      font-size: 14px;
      margin-bottom: 8px;
      .category li {
        border: 1px solid #555;
      }
      .category li:hover {
        color: var(--color--main);
      }
      .tag li {
        background-color: #171616;
        border: 0;
      }
      .tag li:hover {
        background-color: #666;
      }
    }
    div.about-item {
      display: flex;
      ul {
        display: flex;
        margin-left: 12px;
        flex-wrap: wrap;
        li {
          padding: 5px 20px;
          margin: 5px;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }
    // 时间部分
    .time {
      span {
        margin-left: 12px;
      }
    }
  }
}
// 相关模型和推荐模型部分
.models {
  // 标题
  h3 {
    font-size: 18px;
    margin-bottom: 16px;
  }
  // 列表容器
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    // 每个模型列表项
    li {
      width: 100%;
      padding: 0 5px;
      margin-bottom: 10px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      // 图片容器
      .thumb {
        box-sizing: border-box;
        width: 128px;
        // 内层撑开高度默认背景图
        a {
          display: block;
          width: 100%;
          height: 0;
          padding-bottom: 56.0641%;
          position: relative;
          // 默认背景图
          background: url('~@/assets/first/background.jpg') no-repeat center;
          background-size: cover;
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      // 模型信息部分
      .info {
        box-sizing: border-box;
        width: calc(100% - 128px);
        padding: 5px 10px;
        height: 100%;
        h4 {
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .noUser {
          height: 60px;
          line-height: 60px;
        }
        .info-bottom {
          margin-top: 10px;
          .info-count {
            margin: 0 5px;
          }
        }
      }
    }
  }
  // 列表为空时显示

}
.empty {
  box-sizing: border-box;
  min-height: 200px;
  height: 200px;
  border: 1px solid var(--color--ori);
  border-radius: 10px;
  padding: 10px;
  .content {
    display: block;
    width: 100%;
    height: 180px;
    line-height: 180px;
    color: var(--color--ori);
    border: 1px dashed var(--color--ori);
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
}
.btns {
  box-sizing: border-box;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  min-width: 40px;
  padding: 0 10px;
  border-radius: 4px;
  color: var(--color--fontMain);
}
.weibo {
  color: #F56467!important;
}
.weixin {
  color: #28C445!important;
}
.qq {
  color: #FFCD00!important;
}

.downloadBtn {
  position: relative;
  box-sizing: border-box;
  .bg {
    position: absolute;
    background-color: #ccc;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .count {
    position: absolute;
    background-color: transparent;
    color: #000;
    z-index: 1;
    width: 100%;
    height: 100%;
    line-height: 32px;
    text-align: center;
    top: 0;
    left: 0;
    z-index: 3;
  }
  .downloadProgress {
    position: absolute;
    background-color: $color-main;
    z-index: 1;
    width: 0%;
    height: 100%;
    line-height: 32px;
    text-align: center;
    top: 0;
    left: 0;
    z-index: 2;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  // 适配模型名称
  .model-name {
    width: 88%;
    margin: 10px auto;
  }
  // 适配相关模型和推荐模型列表中的li
  .models ul li {
    width: 50%;
    .thumb {
      width: 100%;
    }
    .info {
      width: 100%;
      height: 80px;
      text-align: center;
      h4 {
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
@media (max-width: 768px) {
  // 适配模型名称
  .model-name {
    width: 96%;
    text-align: center;
  }
  // 适配相关模型和推荐模型列表中的li
  .models ul li {
    width: 50%;
    .thumb {
      width: 100%;
    }
    .info {
      width: 100%;
      height: 80px;
      text-align: center;
      h4 {
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .btn-container {
    flex-direction: column;
    .left-content,
    .right-content {
      justify-content: start!important;
    }
    .right-content {
      margin-top: 10px;
    }
  }
}
.tags-container {
  padding: 10px;
  p {
    line-height: 1em;
    color: $color-fontForm;
  }
  .el-checkbox-group {
    display: flex;
    margin-top: 10px;
    .tag {
      box-sizing: border-box;
      display: inline-block;
      margin-right: 10px;
      height: 25px;
      background-color: $color-zip;
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
        color: $color-fontMain;
        cursor: pointer;
      }
    }
  }
}
.tags-empty {
  padding: 10px;
}
// webAr弹框主体
.weixin-container {
  display: flex;
  box-sizing: border-box;
  .qrcode-pic {
    width: 50%;
    box-sizing: border-box;
    padding: 0 20px;
    text-align: center;
    p {
      margin: 0 0 10px;
      padding: 0;
    }
    .qrcode-outer {
      width: 100%;
      padding: 50%;
      position: relative;
      .qrcode-inner {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .pic {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
// 适配下方主体的左右部分
@media (min-width: 1100px) {
  .left {
    width: calc(100% - 400px);
  }
  .right {
    width: 400px;
  }
}
@media (max-width: 1099px) {
  .left {
    width: 100%;
  }
  .right {
    width: 100%;
  }
}
</style>
