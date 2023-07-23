<template>
  <div id="vr-model-editor">
    <!-- 进度条 -->
    <div class="bg" v-show="loading.flag">
      <div id="bg" class="basic">
        <div class="left"></div>
        <div class="right"></div>
        <div class="hide"></div>
        <div class="cover"></div>
      </div>
    </div>
    <!-- 侧边栏开关 -->
    <el-tooltip :content="asideFlag ? $t('closeAside') : $t('openAside')" effect="dark" placement="top">
      <div v-if="isArListFlag" :class="{ 'aside-flag': asideFlag, 'aside-flag-close': !asideFlag }" @click="showAside">
      </div>
    </el-tooltip>
    <!-- 帮助弹框 -->
    <el-dialog :visible.sync="helperFlag" class="helper-father" width="60%">
      <div class="helper-container">

        <div class="helper-container-left">
          <div class="helper-container-left-header">
            <el-image :src="helpImgUrlLeft" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("mouse.wheel")}}</td>
              <td>{{$t("mouse.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressLeft")}}</td>
              <td>{{$t("mouse.rotate")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.clickRightFirst")}}</td>
              <td>{{$t("mouse.pickUpMaterial")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.clickLeftMaterial")}}</td>
              <td>{{$t("mouse.moveMaterial")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressSecond")}}</td>
              <td>{{$t("mouse.placeMaterial")}}</td>
            </tr>
            <tr align="center">
              <td>{{$t("mouse.pressLeftMaterial")}}</td>
              <td>{{$t("mouse.changeViewPlace")}}</td>
            </tr>
          </table>
        </div>
        <div class="helper-container-right">
          <div class="helper-container-right-header">
            <el-image :src="helpImgUrlRight" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("keyboard.wasd")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.udlr")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.t")}}</td>
              <td>{{$t("keyboard.changePosition")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.r")}}</td>
              <td>{{$t("keyboard.changeRotate")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.s")}}</td>
              <td>{{$t("keyboard.changeScale")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.esc")}}</td>
              <td>{{$t("keyboard.exit")}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
    <!-- 设置弹框 -->
    <dialoger
      :visible="setterFlag"
      :mask="true"
      :title="$t('panoramaConfig')"
      :closable="true"
      @cancel="setterFlag = false"
      @confirm="setterFlag = false"
    >
      <div class="tabs-item-container setting-item-container">
        <div class="item-content">
          <span class="item-content-label">{{$t("config.fov")}}</span>
          <el-slider class="item-content-content" v-model="sceneGroup.fov" :step="1" show-input></el-slider>
        </div>
      </div>
    </dialoger>
    <!-- <el-dialog :visible.sync="setterFlag" :title="$t('panoramaConfig')" class="setter-father" width="40%">
      <div class="tabs-item-container">
        <div class="item-content">
          <span class="item-content-label">{{$t("config.fov")}}</span>
          <el-slider class="item-content-content" v-model="sceneGroup.fov" :step="1" show-input></el-slider>
        </div>
      </div>
    </el-dialog> -->
    <!-- 展示页面帮助弹框 -->
    <el-dialog :visible.sync="modelhelperFlag" class="helper-father" width="70%">
      <div class="helper-container">

        <div class="helper-container-left">
          <div class="helper-container-left-header">
            <el-image :src="helpImgUrlLeft" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("mouse.wheel")}}</td>
              <td>{{$t("mouse.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("mouse.pressLeft")}}</td>
              <td>{{$t("mouse.rotate")}}</td>
            </tr>
          </table>
        </div>
        <div class="helper-container-right">
          <div class="helper-container-right-header">
            <el-image :src="helpImgUrlRight" fit="contain"></el-image>
          </div>
          <table align="center" cellpadding="5">
            <tr>
              <td>{{$t("keyboard.wasd")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
            <tr>
              <td>{{$t("keyboard.udlr")}}</td>
              <td>{{$t("keyboard.move")}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
    <!-- 顶部导航栏 -->
    <div class="editor-nav">
      <div class="nav-left">
        <a href="/">
          <img :alt="$t('logoName')" src="~@/assets/logo.png" />
        </a>
        <span>{{ isArListFlag ? this.$t("modelPanorama.editorHeader") : this.$t("modelPanorama.previewHeader") }}</span>
      </div>
      <div class="nav-right">
        <!-- 帮助弹框开关 -->
        <el-tooltip :content="$t('help')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-helper" @click="showHelper"></span>
        </el-tooltip>
        <!-- 打开设置 -->
        <el-tooltip v-if="isArListFlag" :content="$t('openConfig')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-set" @click="showSetter"></span>
        </el-tooltip>
        <!-- 导出功能 -->
        <!-- <el-tooltip v-if="isArListFlag" :content="$t('export')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-export" @click="exportFunction"></span>
        </el-tooltip> -->
        <!-- 保存设置 -->
        <el-tooltip v-if="isArListFlag" :content="$t('saveConfig')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-save" @click="setSave"></span>
        </el-tooltip>
        <!-- 全屏开关 -->
        <el-tooltip v-if="flag" :content="$t('preview')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-full" @click="fullScreen"></span>
        </el-tooltip>
        <el-tooltip v-else :content="$t('fullscreen')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-full" @click="fullScreen"></span>
        </el-tooltip>
        <!-- 退出 -->
        <el-tooltip :content="$t('exit')" effect="dark" placement="bottom">
          <span class="icon-flag icon-flag-exit" @click="back"></span>
        </el-tooltip>
      </div>
    </div>
    <!-- 分组边栏 -->
    <div class="group-aside" v-show="asideFlag&&isArListFlag">
      <div class="group-header">分组</div>
      <div class="group-container">
        <el-radio class="group-radio" v-for="(item, index) in skyBoxList" v-model="groupId" :label="item.id"
          :key="index" @change="changePanorama(index)">
          <el-image class="group-image" :src="getSkyBoxSrc(item.path)" @click="changePanorama(index)"></el-image>
        </el-radio>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div @mousedown="preventDefault" v-show="asideFlag&&isArListFlag" class="editor-aside">
      <el-tabs type="border-card" v-model="tabName" @tab-click="tabsClick">
        <!-- 场景 -->
        <el-tab-pane :name="$t('scene.label')">
          <el-tooltip class="item-tabs" effect="light" placement="top" slot="label">
            <div slot="content">
              <span>从当前场景到目的场景的热点配置</span>
            </div>
            <span>{{$t("scene.label")}}</span>
          </el-tooltip>
          <div class="tabs-item-container">
            <div v-for="(item, index) in skyBoxList" :key="index" v-if="groupId!=item.id"
              class="tabs-item-container-item">
              <!-- <img :src="getSkyBoxSrc(item.path)" alt="" draggable="false" class="tabs-item-img"
                @click="showChangeScene(item)" /> -->
                <el-image
                  class="tabs-item-img"
                  fit="contain"
                  :draggable="false"
                  :src="getSkyBoxSrc(item.path)"
                  @click="showChangeScene(item)"
                ></el-image>
            </div>
          </div>
        </el-tab-pane>
        <!-- 热点 -->
        <el-tab-pane :name="$t('hotspot.label')" id="hot" ref="hot">
          <el-tooltip class="item-tabs" effect="light" placement="top" slot="label">
            <div slot="content">
              <span>素材热点</span>
            </div>
            <span>{{$t("hotspot.label")}}</span>
          </el-tooltip>
          <div class="tabs-item-container" id="content">
            <div v-for="(item, index) in hotSpotList" :key="index" class="tabs-item-container-item">
              <!-- <img :src="getImgSrc(item.thumb)" alt="" class="tabs-item-img" :draggable="true"
                @dragstart="imgDragStart($event,item,index)" /> -->
                <el-image
                  v-if="!item.config"
                  class="tabs-item-img"
                  fit="contain"
                  :src="getImgSrc(item.thumb)"
                  :draggable="true"
                  @dragstart="imgDragStart($event,item,index)"
                ></el-image>
                <div 
                  class="tabs-item-img-public"
                  
                  v-else
                >
                  <img @dragstart="imgDragStart($event,item,index)" :src="getImgSrc(item.thumb)" />
                </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 材质 -->
        <el-tab-pane :name="$t('material.label')" v-if="currentScene!=null&&currentScene.materials!=null">
          <el-tooltip class="item-tabs" effect="light" placement="top" slot="label">
            <div slot="content">
              <span>场景中可更改材质的热点</span>
            </div>
            <span>{{$t("material.label")}}</span>
          </el-tooltip>
          <div class="tabs-item-container">
            <div class="btn-group">
              <button class="add-btn" @click="addReset()">添加</button>
            </div>
            <div v-for="(item, index) in currentScene.materials" :key="index" class="tabs-item-container-item">
              <el-tooltip content="删除" effect="dark" placement="top">
                <span class="select-item-del" @click="delSectedItem(index)"></span>
              </el-tooltip>
              <el-tooltip content="查看" effect="dark" placement="top">
                <span class="select-item-view" @click="showScene(index)"></span>
              </el-tooltip>
              <!-- <img :src="getImgSrc(item.icon.path)" alt="" class="tabs-item-img" /> -->
              <el-image
                class="tabs-item-img"
                fit="contain"
                :src="getImgSrc(item.icon.path)"
              ></el-image>
          </div>
          </div>
        </el-tab-pane>
        <!-- 已选 -->
        <el-tab-pane :name="$t('selected')" v-if="currentScene!=null&&currentScene.dialog!=null">
          <el-tooltip class="item-tabs" effect="light" placement="top" slot="label">
            <div slot="content">
              <span>场景中的素材热点</span>
            </div>
            <span>{{$t("selected")}}</span>
          </el-tooltip>
          <div class="tabs-item-container">
            <div v-for="(item, index) in currentScene.dialog" :key="index" class="tabs-item-container-item select-item">
              <div class="select-item-type" @click="getMaterial(index)">{{ getTypeLabel(item.icon.type) }}</div>
              <el-tooltip content="删除该项" effect="dark" placement="top">
                <span class="select-item-del" @click="delSectedItem(index)"></span>
              </el-tooltip>
              <el-image
                class="tabs-item-img"
                fit="contain"
                draggable="false"
                :src="getImgSrc(item.icon.path)"
              ></el-image>
              <!-- <img :src="getImgSrc(item.icon.thumb)" :alt="item.icon.thumb" draggable="false" /> -->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- canvas内容区 -->
    <div class="container" :class="{asideContainer: asideFlag&&isArListFlag}">
      <div class="editor-container" @dragover="allDrop" @drop.prevent="fileDrop">
      </div>
      <!-- 文字介绍弹框 -->
      <el-dialog :visible.sync="content.textVisible" width="30%">
        <span>{{content.text}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="content.textVisible = false">取 消</el-button>
          <el-button type="primary" @click="content.textVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 视频播放弹框 -->
      <el-dialog :visible.sync="content.videoVisible" width="70%">
        <video :src="getCommonSrc(content.video)" style="width: 100%; height: 100%;" controls="controls"></video>
      </el-dialog>
      <!-- 音频播放器-->
      <audio id="audioContent" :src="getMusicSrc(content.voice)" style="display: none;"></audio>
      <!-- 图片展示 -->
      <div class="carousel-container" v-if="content.imgVisible">
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in content.imgList" :key="item.id">
            <el-image :src="getImgSrc(item.path)" fit="contain"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 布置shotspot弹框 -->
      <div class="shotspot-img-select" v-if="content.resetVisible" :class="{ animationOpen: content.resetVisible}">
        <div class="shotspot-thumb-container show">
          <div class="btn-left" @click="turnPrev"></div>
          <div class="btn-right" @click="turnNext"></div>
          <div class="shotspot-thumb-header">
            <i class="icon-close" @click="closeSelectShot"></i>
          </div>
          <div class="shotspot-thumb-content">
            <el-image :src="getImgSrc(content.resetList[contentIndex].thumb.path)" />
            <div class="shotspot-content-name">
              {{ content.resetList[contentIndex].name }}
              <span class="shotspot-content-index">{{contentIndex + 1}}/{{ content.resetList.length }}</span>
            </div>
            <div class="shotspot-content-info">
              {{ content.resetList[contentIndex].info }}
            </div>
          </div>
          <div class="shotspot-thumb-footer">
            <button class="add-btn" type="button" @click="selectShot(contentIndex)">布置</button>
            <button class="add-btn" type="button" @click="buy(contentIndex)">立即购买</button>
          </div>
        </div>
      </div>
      <!-- 模型旋转遮挡层 -->
      <div v-show="content.modelVisible" class="show-model-dialog" style="background-color: coral" @click.stop.prevent>
        <!-- 进度条 -->
        <div class="bg-dialog" v-show="dialogLoading.flag">
          <div id="bg" class="dialog">
            <div class="left"></div>
            <div class="right"></div>
            <div class="hide"></div>
            <div class="cover"></div>
          </div>
        </div>
        <i class="show-model-dialog-close" @click.stop.prevent="modelDialogClose"></i>
        <div v-if="modelShowFlag.description" class="show-model-description">
          <p> {{ modelShowFlag.text }}</p>
        </div>
        <div class="show-model-container"></div>
      </div>
      <!--图文遮罩 -->
      <div v-show="content.htmlVisible" class="show-model-dialog" style="background-color: coral" @click.stop.prevent>
        <i class="show-model-dialog-close" @click.stop.prevent="htmlDialogClose"></i>
        <div v-if="content.html" class="show-model-description">
          <p v-html="content.html"></p>
        </div>
      </div>
    </div>
    <!-- 材质切换 -->
    <el-dialog title="材质切换" :visible.sync="reset.visible" width="50%">
      <el-form :model="reset" label-position="left" :rules="rules" label-width="100px" ref="resetForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="reset.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称" prop="showName">
              <el-switch v-model="reset.showName"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图标大小" prop="size">
              <el-input v-model="reset.size"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文字距离" prop="distance">
              <el-input v-model.number="reset.distance" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="热点图标" prop="icon.thumb">
          <el-button v-if="reset.icon.thumb == null" type="primary" size="mini" @click="showHotSpot('reset')">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(reset.icon.thumb)" @click="showHotSpot('reset')" />
        </el-form-item>
        <!-- 置换热点 -->
        <el-form-item class="hotspot-change" :label="reset.changeLabel">
          <!-- 图标 -->
          <div class="hotspot-change-btn" :class="{add: reset.addFlag, top: !reset.addFlag}"
            @click="changeResetAddFlag"></div>
          <!-- 添加热点表单 -->
          <div class="float-clear hotspot-add" :class="{ animationOpen: !reset.addFlag}" v-show="!reset.addFlag">
            <el-form class="addForm" ref="addHotspot" :model="resetObj" :rules="rulesObj" size="small"
              label-width="100px">
              <el-form-item prop="name" label="名称">
                <el-input v-model="resetObj.name" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item prop="info" label="简介">
                <el-input v-model="resetObj.info" type="textarea" :row="10" :col="5" resize="none"
                  placeholder="请输入简介" />
              </el-form-item>
              <el-form-item prop="thumb" label="封面">
                <!-- 选择封面 -->
                <el-button v-if="resetObj.thumb == null" type="primary" size="mini" @click="showThumb">选择</el-button>
                <el-image class="prelook" v-else :src="getImgSrc(resetObj.thumb.path)" @click="showThumb" />
              </el-form-item>
              <el-form-item prop="panorama" label="链接全景">
                <el-button v-if="resetObj.panorama == null" type="primary" size="mini" @click="showPanorama">选择
                </el-button>
                <el-image class="prelook" v-else :src="getSkyBoxSrc(resetObj.panorama.path)" @click="showPanorama" />
              </el-form-item>
              <el-form-item prop="link" label="购物车">
                <el-input v-model="resetObj.link" placeholder="请输入链接" />
              </el-form-item>
              <el-form-item>
                <el-button @click="addResetObj">添加</el-button>
                <el-button @click="initResetObj">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 热点列表表格 -->
          <div class="float-clear hotspot-add" :class="{ animationOpen: reset.addFlag}" v-show="reset.addFlag">
            <el-table :data="reset.list" stripe size="mini" :show-header="false">
              <el-table-column align="center" prop="name" />
              <el-table-column align="center" prop="info" />
              <el-table-column align="center" prop="thumb">
                <template slot-scope="scope">
                  <el-image :src="getImgSrc(scope.row.thumb.thumb)" />
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot-scope="scope">
                  <el-image :src="getSkyBoxSrc(scope.row.panorama.path)" />
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="changeResetObj(scope.row)">修改</el-button>
                  <el-button type="text" size="mini" @click="moveResetObj(scope.row)">上移</el-button>
                  <el-button type="text" size="mini" @click="delResetObj(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <!-- 置换热点 -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetMaterialForm">取消</el-button>
        <el-button type="primary" @click="submitMaterialForm">确认</el-button>
      </span>
    </el-dialog> 
    <!-- 材质切换 -->
    <!-- 场景过渡 -->
    <dialoger
      :visible="panorama.visible"
      :closable="true"
      title="场景过渡"
      :mask="true"
      @cancel="resetPanoramaForm"
      @confirm="submitPanoramaForm"
    >
      <el-form :model="panorama" :rules=rules ref="panoramaForm" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="panorama.name"></el-input>
        </el-form-item>
        <el-form-item label="图标大小" prop="size">
          <el-input v-model="panorama.size"></el-input>
        </el-form-item>
        <el-form-item label="文字距离" prop="distance">
          <el-input v-model.number="panorama.distance" type="number"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="showName">
          <el-switch v-model="panorama.showName"></el-switch>
        </el-form-item>
        <el-form-item label="热点图标" prop="icon.thumb">
          <el-button v-if="panorama.icon.thumb == null" type="primary" size="mini" @click="showHotSpot('panorama')">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(panorama.icon.thumb)" @click="showHotSpot('panorama')" />
        </el-form-item>
      </el-form>
    </dialoger>


    <!-- <el-dialog title="场景过渡" :visible.sync="panorama.visible" width="50%">
      <el-form :model="panorama" :rules=rules ref="panoramaForm" label-position="left" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="panorama.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称" prop="showName">
              <el-switch v-model="panorama.showName"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图标大小" prop="size">
              <el-input v-model="panorama.size"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文字距离" prop="distance">
              <el-input v-model.number="panorama.distance" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="热点图标" prop="icon.thumb">
          <el-button v-if="panorama.icon.thumb == null" type="primary" size="mini" @click="showHotSpot('panorama')">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(panorama.icon.thumb)" @click="showHotSpot('panorama')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPanoramaForm">取消</el-button>
        <el-button type="primary" @click="submitPanoramaForm">确认</el-button>
      </span>
    </el-dialog> -->


    <!-- 素材热点 -->
    <dialoger
      :visible="dialog.visible"
      :mask="true"
      title="选择素材"
      :closable="true"
      @cancel="resetDialogForm"
      @confirm="submitDialogForm"
    >
      <el-radio-group v-model="dialog.type" size="small">
        <el-radio-button v-for="(item, index) in materials" :key="index" :label="item.value">{{item.label}}
        </el-radio-button>
      </el-radio-group>
      <el-form class="reset-shotspot-form" :model="dialog.hotspot" :rules="rules" label-position="left"
        label-width="100px" ref="dialogForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialog.hotspot.name"></el-input>
        </el-form-item>
        <el-form-item label="图标大小" prop="size">
          <el-input v-model="dialog.hotspot.size"></el-input>
        </el-form-item>
        <el-form-item label="文字距离" prop="distance">
          <el-input v-model.number="dialog.hotspot.distance" type="number"></el-input>
        </el-form-item>
        <!-- 文本热点 -->
        <el-form-item label="内容" v-if="dialog.type=='text'" prop="content">
          <el-input type="textarea" v-model="dialog.hotspot.content"></el-input>
        </el-form-item>
        <el-form-item v-if="dialog.type=='link'" label="链接地址" prop="url">
          <el-input v-model="dialog.hotspot.url"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="showName">
          <el-switch v-model="dialog.hotspot.showName"></el-switch>
        </el-form-item>
        <!-- 链接热点 -->
        <el-form-item v-if="dialog.type=='link'" label="当前页打开" prop="blank">
          <el-switch v-model="dialog.hotspot.blank"></el-switch>
        </el-form-item>
        <!-- 链接热点 -->
        <!-- 视频热点 -->
        <el-form-item v-if="dialog.type=='video'" label="是否全屏">
          <el-switch v-model="dialog.hotspot.fullscreen"></el-switch>
        </el-form-item>
        <el-form-item v-if="dialog.type=='video'" label="是否循环">
          <el-switch v-model="dialog.hotspot.loop"></el-switch>
        </el-form-item>
        <el-form-item v-if="dialog.type=='video'" label="视频" prop="video.id">
          <el-button v-if="dialog.hotspot.video.id == null" type="primary" size="mini" @click="showVideo">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.video.thumb)" @click="showVideo" />
        </el-form-item>
        <!-- 视频热点 -->
        <!-- 语音热点 -->
        <el-form-item v-if="dialog.type=='voice'" label="语音" prop="voice.id">
          <el-button v-if="dialog.hotspot.voice.id == null" type="primary" size="mini" @click="showVoice">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.voice.thumb)" @click="showVoice" />
        </el-form-item>
        <!-- 语音热点 -->
        <!-- 模型热点 -->
        <el-form-item v-if="dialog.type=='model'" label="模型" prop="model.id">
          <el-button v-if="dialog.hotspot.model.id == null" type="primary" size="mini" @click="showModel">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.model.thumb)" @click="showModel" />
        </el-form-item>
        <!-- 模型热点 -->
        <!-- 图片热点 -->
        <!-- 图片热点 -->
        <el-form-item v-if="dialog.type=='image'" label="语音" prop="voice.id">
          <el-button v-if="dialog.hotspot.voice.id == null" type="primary" size="mini" @click="showVoice">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.voice.thumb)" @click="showVoice" />
        </el-form-item>
        <el-form-item v-if="dialog.type=='image'" label="图片列表" prop="list">
          <el-button v-if="dialog.hotspot.list.length==0" type="primary" size="mini" @click="showImage">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.list[0].thumb)" @click="showImage" />
        </el-form-item>
        
        <!-- 文本热点 -->
        <!-- 图文热点 -->
        <div ref="wangEditor" v-show="dialog.type=='html'" id="w-editor" class="editor-container"
          style="text-align: left"></div>
        <!-- 图文热点 -->

      </el-form>
    </dialoger>
    
    <!-- <el-dialog title="选择素材" :visible.sync="dialog.visible" width="50%" @opened="htmlOpened">
      <el-radio-group v-model="dialog.type" size="small">
        <el-radio-button v-for="(item, index) in materials" :key="index" :label="item.value">{{item.label}}
        </el-radio-button>
      </el-radio-group>
      <el-form class="reset-shotspot-form" :model="dialog.hotspot" :rules="rules" label-position="left"
        label-width="100px" ref="dialogForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialog.hotspot.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称" prop="showName">
              <el-switch v-model="dialog.hotspot.showName"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图标大小" prop="size">
              <el-input v-model="dialog.hotspot.size"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文字距离" prop="distance">
              <el-input v-model.number="dialog.hotspot.distance" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 链接热点 -->
        <!-- <el-row v-if="dialog.type=='link'" prop="url" :gutter="20">
          <el-col :span="12">
            <el-form-item label="链接地址" prop="url">
              <el-input v-model="dialog.hotspot.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前页打开" prop="blank">
              <el-switch v-model="dialog.hotspot.blank"></el-switch>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 链接热点 -->
        <!-- 视频热点 -->
        <!-- <el-row :gutter="20" v-if="dialog.type=='video'">
          <el-col :span="12">
            <el-form-item label="是否全屏">
              <el-switch v-model="dialog.hotspot.fullscreen"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否循环">
              <el-switch v-model="dialog.hotspot.loop"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="dialog.type=='video'" label="视频" prop="video.id">
          <el-button v-if="dialog.hotspot.video.id == null" type="primary" size="mini" @click="showVideo">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.video.thumb)" @click="showVideo" />
        </el-form-item> -->
        <!-- 视频热点 -->
        <!-- 语音热点 -->
        <!-- <el-form-item v-if="dialog.type=='voice'" label="语音" prop="voice.id">
          <el-button v-if="dialog.hotspot.voice.id == null" type="primary" size="mini" @click="showVoice">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.voice.thumb)" @click="showVoice" />
        </el-form-item> -->
        <!-- 语音热点 -->
        <!-- 模型热点 -->
        <!-- <el-form-item v-if="dialog.type=='model'" label="模型" prop="model.id">
          <el-button v-if="dialog.hotspot.model.id == null" type="primary" size="mini" @click="showModel">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.model.thumb)" @click="showModel" />
        </el-form-item> -->
        <!-- 模型热点 -->
        <!-- 图片热点 -->
        <!-- 图片热点 -->
        <!-- <el-form-item v-if="dialog.type=='image'" label="语音" prop="voice.id">
          <el-button v-if="dialog.hotspot.voice.id == null" type="primary" size="mini" @click="showVoice">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.voice.thumb)" @click="showVoice" />
        </el-form-item>
        <el-form-item v-if="dialog.type=='image'" label="图片列表" prop="list">
          <el-button v-if="dialog.hotspot.list.length==0" type="primary" size="mini" @click="showImage">选择
          </el-button>
          <el-image class="prelook" v-else :src="getImgSrc(dialog.hotspot.list[0].thumb)" @click="showImage" />
        </el-form-item> -->
        <!-- 文本热点 -->
        <!-- <el-form-item label="内容" v-if="dialog.type=='text'" prop="content">
          <el-input type="textarea" v-model="dialog.hotspot.content"></el-input>
        </el-form-item> -->
        <!-- 文本热点 -->
        <!-- 图文热点 -->
        <!-- <div ref="wangEditor" v-show="dialog.type=='html'" id="w-editor" class="editor-container"
          style="text-align: left"></div> -->
        <!-- 图文热点 -->

      <!-- </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialogForm">取消</el-button>
        <el-button type="primary" @click="submitDialogForm">确认</el-button>
      </span>
    </el-dialog> -->



    <!-- 素材热点 -->
    <!-- 选择shotspot弹框 -->
    <div class="shotspot-img-select" v-if="shotspotSelectObj.flag" :class="{ animationOpen: shotspotSelectObj.flag}">
      <div class="shotspot-thumb-container">
        <div class="shotspot-thumb-header">
          <h3>{{ shotspotSelectObj.title }}</h3>
        </div>
        <div class="shotspot-thumb-content" v-if="!shotspotSelectObj.isMulti">
          <div class="shotspot-thumb-item" v-for="(item, index) in shotspotSelectObj.list" :key="index">
            <el-radio v-model="shotspotSelectObj.id" :label="item.id" :key="index"
              @change="selectImgShot($event, item)">
              <el-image v-if="shotspotSelectObj.type == 'thumb'" :src="getImgSrc(item.path)" fit="contain" />
              <el-image v-else-if="shotspotSelectObj.type == 'icon'" :src="getImgSrc(item.thumb)" fit="contain" />
              <el-image v-else-if="shotspotSelectObj.type == 'voice'" :src="getImgSrc(item.thumb)" fit="contain" />
              <el-image v-else-if="shotspotSelectObj.type == 'model'" :src="getImgSrc(item.thumb)" fit="contain" />
              <video v-else-if="shotspotSelectObj.type=='video'" :src="getCommonSrc(item.path)" ref="shotVideo"
                @ended="videoShotEnded(index,item)" fit="contain"></video>
              <el-image v-else :src="getSkyBoxSrc(item.path)" fit="contain" />
              <!-- 音频控制器按钮 -->
              <div class="voice-player" :class="{playerRotate: item.rotate}" v-if="shotspotSelectObj.type == 'voice'"
                @click="playVoiceShot(index, item)"></div>
              <audio @ended="voiceShotEnded(index, item)" ref="shotVoiceAudio" controls
                v-if="shotspotSelectObj.type == 'voice'" v-show="false" :src="getMusicSrc(item.path)"></audio>
              <!-- 视频控制器按钮 -->
              <div class="video-player" :class="{playerRotate: item.rotate}" v-if="shotspotSelectObj.type == 'video'"
                @click="playVideoShot(index, item)"></div>
            </el-radio>
          </div>
        </div>
        <div class="shotspot-thumb-content" v-else>
          <div class="shotspot-thumb-item" v-for="(item, index) in shotspotSelectObj.list" :key="index">
            <el-checkbox-group v-model="shotspotSelectObj.checkList">
              <el-checkbox :label="item" :key="index">
                <el-image :src="getImgSrc(item.path)" fit="contain">
                </el-image>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="shotspot-thumb-footer">
          <button class="add-btn default-btn" type="button" @click="cancelSelectShot">取消</button>
          <button class="add-btn default-btn" type="button" @click="confirmSelectShot">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {common, globalUrl, filePrefix, image, modelUrl, iconMaterial, storeGetModel} from "@/utils/global.js";
import * as api from '@/api/skybox/skybox.js'
import { getVRModel } from '@/api/vr/vr.js';
import * as materialApi from '@/api/material/material.js'
import * as modelApi from '@/api/model/model.js'
import Vue from 'vue'
import * as renderApi from "@/render/skybox/render.js"
import * as renderModelApi from "@/render/model/model.js"
import { exportFunction } from "@/api/vr/vr";
import wangEditor from 'wangeditor'
import { imgsPreloader } from '@/utils/imgPreloader.js';
import { skyBoxUrl, uploadSkybox, skyBoxMaterial, uploadFaceFile, uploadFile, imgMaterial, modelMaterial, videoMaterial, audioMaterial } from "../../utils/global";
import { type } from "os";
import dialoger from '@/components/common/dialoger/dialoger.vue';
const defaultSceneGroup = {
  anti: true,
  speed: 0,
  fov: 50,
  scene: []
}
const defaultLink = {
  name: "",//名称
  url: "", //跳转url
  blank: false,// 是否切换当前页
  size: 60,// 大小
  icon: null, // 图标
  showName: true,// 是否在全景中显示名称
  distance: 0//文字距离
}
const defaultImage = {
  name: "",
  voice: {
    id: null
  },
  size: 60,//尺寸
  list: [],
  icon: null,
  showName: true,//是否在全景中显示名称
  distance: 0//文字距离
}
const defaultText = {
  name: "",
  content: "",
  icon: null,
  showName: true,//是否在全景中显示名称
  distance: 0,//文字距离
  size: 60//图标尺寸
}
const defaultPanorama = {
  name: "",
  scene: null,
  icon: {
    thumb: null
  },
  distance: 0,
  size: 60,
  showName: true,
  visible: false,
  flag: false,
  type: 'panorama'
}
const defaultVoice = {
  name: "",
  voice: {
    id: null
  },
  icon: null,
  showName: true,//是否在全景中显示名称
  distance: 0,//文字距离
  size: 60//图标尺寸
}
const defaultHtml = {
  name: "",
  content: "",
  showName: true,//是否在全景中显示名称
  distance: 0,//文字距离
  size: 60,//图标尺寸
  icon: null
}
const defaultVideo = {
  name: "",
  fullscreen: false,
  loop: false,
  video: {
    id: null
  },
  icon: null,
  showName: true,//是否在全景中显示名称
  distance: 0,//文字距离
  size: 60//图标尺寸
}
const defaultResetNode = {
  name: "",//名称
  info: "",//简介
  thumb: null,//封面图
  panorama: null,//全景图对象
  link: ""//购物车链接
}
const defaultModel = {
  name: "",//名称
  showName: true,//是否在全景中显示名称
  distance: 0,//文字距离
  size: 60,//图标尺寸
  model: {
    id: null
  },//模型对象
  url: "",//购物车链接
  bg: null,//背景图
  voice: {
    id: null
  },//音频
  icon: null,
}
const defaultReset = {
  type: 'reset',//材质切换
  name: "",//名称
  showName: true,//是否在全景中显示名称
  distance: 0,//文字距离
  size: 60,//图标尺寸
  list: [],//节点列表
  icon: {
    thumb: null
  },
  addFlag: true,
  changeLabel: '添加材质',
  visible: false
}
const defaultDialog = {
  type: 'image',
  visible: false,
  hotspot: Object.assign({}, defaultImage),
  flag: false,
  index: -1
}
const rulesObj = {
  name: [
    { required: true, message: '名称不能为空', trigger: ['blur', 'change'] }
  ],
  info: [
    { required: true, message: '简介不能为空', trigger: ['blur', 'change'] }
  ],
  thumb: [
    {
      validator(rule, value, callback) {
        if (value == null) {
          return callback(new Error('内容未选择'))
        } else {
          return callback()
        }
      },
      trigger: ['change']
    }
  ],
  panorama: [
    {
      validator(rule, value, callback) {
        if (value == null) {
          return callback(new Error('内容未选择'))
        } else {
          return callback()
        }
      },
      trigger: ['change']
    }
  ],
  link: [
    { required: true, message: '内容不能为空', trigger: ['blur', 'change'] }
  ]
}

const defaultParams = {
  pkId: 0,
  size: 50,
  min: 0,
  max: 0
};

export default {
  name: 'panEditor',
  components: {
    dialoger
  },
  data() {
    return {
      color: 'red',
      filePrefix,
      image,
      hotImgParams: Object.assign({}, defaultParams),
      // 获取的热点区域dom
      hotDom: null,
      // 获取的热点滚动区域
      hotContainer: null,
      contentIndex: 0,
      groupId: null,
      rulesObj,
      // 表单验证数据
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度应在2到10之间', trigger: 'blur' }
        ],
        content: [
          {
            required: true, message: '请输入内容', trigger: 'blur'
          }
        ],
        url: [
          {
            validator: function (rule, value, callback) {
              if (/^http:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(value) == false) {
                callback(new Error("请输入正确的Url"));
              } else {
                callback();
              }
            }, trigger: 'blur'
          },
          { required: true }
        ],
        list:[
        {
          validator(rule, value, callback) {
            if (value.length==0) {
              return callback(new Error('内容未选择'))
            } else {
              return callback()
            }
          },
          trigger: ['change']
        }
        ],
        'voice.id': [
        {
          validator(rule, value, callback) {
            if (value == null) {
              return callback(new Error('内容未选择'))
            } else {
              return callback()
            }
          },
          trigger: ['change']
        }
      ],
      'video.id': [
        {
          validator(rule, value, callback) {
            if (value == null) {
              return callback(new Error('内容未选择'))
            } else {
              return callback()
            }
          },
          trigger: ['change']
        }
      ],
      'model.id':[
      {
          validator(rule, value, callback) {
            if (value == null) {
              return callback(new Error('内容未选择'))
            } else {
              return callback()
            }
          },
          trigger: ['change']
        }
      ],
      'icon.thumb':[
      {
          validator(rule, value, callback) {
            if (value == null) {
              return callback(new Error('内容未选择'))
            } else {
              return callback()
            }
          },
          trigger: ['change']
        }
      ],
        size: [
          {
            required: true, message: '请输入图标尺寸', trigger: 'blur'
          }
        ],
        distance: [
          {
            required: true, message: '请输入文字距离', trigger: 'blur'
          }
        ]
      },
      // 选中的tab栏名称
      tabName: this.$t("hotspot.label"),
      uploadImageUrl: uploadFaceFile,
      uploadVideoUrl: uploadFile,
      hotSpotList: [],//热点图标
      materials: [
        {
          value: 'image',
          label: '图片'
        }, {
          value: 'video',
          label: '视频'
        }, {
          value: "voice",
          label: '语音'
        }, {
          value: "text",
          label: '文字'
        }, {
          value: "html",
          label: '图文'
        },
        {
          value: 'link',
          label: '链接'
        },
        {
          value: 'model',
          label: '模型'
        }
      ],
      // 编辑页面帮助弹框左边图片
      helpImgUrlLeft: require('@/assets/left.png'),
      // 编辑页面帮助弹框右边图片
      helpImgUrlRight: require('@/assets/right.png'),
      playFlag: false,
      content: {
        textVisible: false, //文字介绍弹框
        text: "", // 文字介绍内容
        voice: null, //音频文件
        video: null, //视频文件
        videoVisible: false,//视频介绍弹框
        imgVisible: false,// 图片显示走马灯
        imgList: null,//图片列表
        modelVisible: false,
        modelDiv: null,
        resetVisible: false,
        resetList: [],
        htmlVisible: false,
        html: ""
      },
      materialType: {
        image: imgMaterial,
        video: videoMaterial,
        audio: audioMaterial,
        model: modelMaterial,
        skybox: skyBoxMaterial
      },
      // 模型渲染时遮罩
      dialogLoading: {
        flag: true,
        progress: 0
      },
      // 模型展示弹框开关
      modelShowFlag: {
        show: false,
        description: false,
        text: ''
      },
      // 抗锯齿绑定值
      antiFlag: false,
      // 模拟步行速度
      speed: 0,
      sceneGroup: Object.assign({}, defaultSceneGroup),
      // 帮助弹框控制开关
      helperFlag: false,
      // 设置弹框控制开关
      setterFlag: false,
      modelhelperFlag: false,
      // 路由跳转时携带的flag参数决定是否渲染侧边栏
      isArListFlag: false,
      // 模型加载开关
      loading: {
        flag: true,
        progress: 0
      },
      // 热点变量，控制热点的添加、列表、防抖、可见性
      dialog: Object.assign({}, defaultDialog),
      reset: Object.assign({}, defaultReset),
      // 添加的dialog.reset.hotspot.list中的对象
      resetObj: Object.assign({}, defaultResetNode),
      // thumb || panorama处理对象
      shotspotSelectObj: {
        flag: false,
        // thumb || panorama
        type: 'thumb',
        // 选择封面图片 || 链接全景
        title: '选择封面图片',
        id: null,
        isMulti: false,
        list: [],// 资源列表
        checkList: [],//已选列表
        submitType: 'dialog'
      },
      sceneObj: {
        flag: false
      },
      uploadSkyboxUrl: uploadSkybox,// 上传skybox路由   
      skyBoxUrl: skyBoxUrl,
      // 侧边栏开关
      asideFlag: true,
      // asideFlagStyle: false,
      // 底部编辑栏开关
      bottomFlag: {
        flag: false
      },
      map :new Map(),
      editor: null,//编辑器
      // 侧边栏图片绑定数组
      imgList: [],
      // 侧边栏视频绑定数组
      videoList: [],
      // 侧边栏模型绑定数组
      modelList: [],
      skyBoxList: [],// 全景图列表
      panoramaUploadUrl: "",//全景图上传url
      // 音乐素材数组
      musicList: [],
      panoConfig: null,// 全景配置
      saveData: null,
      flag: false,//判断是否是编辑状态
      fullscreenFlag: false, //判断全屏状态
      currentScene: null, //当前的场景
      panorama: Object.assign({}, defaultPanorama),
      index:0// 第几个素材热点
    };
  },
  watch: {
    'content.modelVisible'(val){
      if(val){
        this.showModelDetail()
      }else{
        this.content.modelId=null
      }
    },
    'loading.progress'(val) {
      console.log('val:'+val)
      this.loadingAnimation('basic',val)
      if (val == 100) {
        this.loading.flag = false
      }
    },
    'dialogLoading.progress'(val) {
    
      this.loadingAnimation('dialog', val);
      if (val == 100) {
        this.dialogLoading.flag = false
      }
    },
    'dialog.hotspot.addFlag'(flag) {
      if (this.$refs.addHotSpot != undefined) {
        this.$refs.addHotspot.clearValidate()
        if (flag) {
          this.dialog.hotspot.changeLabel = '材质列表'
        } else {
          this.dialog.hotspot.changeLabel = '添加材质'
        }
      }
    },
    'shotspotSelectObj.type'(val) {
      if (val == 'thumb') {
        this.shotspotSelectObj.title = "选择封面图片"
      } else if (val == 'voice') {
        this.shotspotSelectObj.title = "请选择语音文件"
      } else if (val == 'video') {
        this.shotspotSelectObj.title = "请选择视频文件"
      } else if (val == 'model') {
        this.shotspotSelectObj.title = "请选择模型文件"
      } else if ((val == 'image')||(val=='img')) {
        this.shotspotSelectObj.title = "请选择图片"
      }
      else {
        this.shotspotSelectObj.title = "选择链接全景"
      }
    },
    'dialog.type'(val) {
      if (val == "text") {
        this.dialog.hotspot = Object.assign({}, defaultText)
      } else if (val == "html") {
        this.dialog.hotspot = Object.assign({}, defaultHtml)
      } else if (val == "video") {
        this.dialog.hotspot = Object.assign({}, defaultVideo)
      } else if (val == 'voice') {
        this.dialog.hotspot = Object.assign({}, defaultVoice)
      } else if (val == 'model') {
        this.dialog.hotspot = Object.assign({}, defaultModel)
      } else if (val == 'image') {
        this.dialog.hotspot = Object.assign({}, defaultImage)
      } else if (val == 'link') {
        this.dialog.hotspot = Object.assign({}, defaultLink)
      }
      // 弹框重置
    }
  },

  created() {
    document.oncontextmenu = function (e) {
      e.returnValue = false
    }
    this.addFullScreenListener()
    if (this.$route.query && typeof this.$route.query.id != null) {
      this.id = this.$route.query.id
      // getVRModel(this.id)
      //   .then(res => {
      //     console.log(res)
      //   })
    }
    if (this.$route.query && typeof this.$route.query.flag != null) {
      this.flag = JSON.parse(this.$route.query.flag)
    }
    this.initMaterial()
    // this.initHotSpot()

    this.isArListFlag = this.$route.query.flag === 'false' ? false : true
  },

  destroyed() {
    this.hotContainer.onscroll = null;
    window.removeEventListener('keydown', this.keydownForFull, false)

    window.removeEventListener('fullscreenchange', this.fullscreenchange)
    renderApi.destory();
  },
  mounted() {
    this.hotDom = document.getElementById('hot');
    this.hotContainer = this.hotDom.parentElement;
    this.hotContainer.onscroll = this.hotScroll;
  },
  computed: {
    getTypeLabel() {
      return function (type) {
        let label = '';
        switch (type) {
          case 0:
            label = 'P'
            break
          case 1:
            label = 'M'
            break
          case 3:
            label = 'V'
            break
        }
        return label
      }
    },
    getSkyBoxSrc() {
      return function (src) {
        return src ? filePrefix + skyBoxUrl + src : require('@/assets/1.jpg')
      }
    },
    getCommonSrc() {
      return function (src) {
        return src ? filePrefix + common + src : require('@/assets/1.jpg')
      }
    },
    getImgSrc() {
      return function (src) {
        // if (src.indexOf("./icons/hot/icon") != -1) {
        //   return src
        // } else {
          return src ? filePrefix + image + src : require('@/assets/1.jpg')
        // }
      }
    },
    getModelSrc() {
      return function (src) {
        return src ? filePrefix + modelUrl + src : require('@/assets/1.jpg')
      }
    },
    getMusicSrc() {
      return function (src) {
        return filePrefix + common + src
      }
    },
    getUploadMuiscStatus() {
      return function (status) {
        return status ? this.$t("autoPlay") : this.$t("manualPlay")
      }
    }
  },
  methods: {
    // 热点滚动触底加载热点图片
    hotScroll(e) {
      const that = this;
      if (!this.hotContainer) {
        return;
      }
      let scrollHeight = this.hotContainer.scrollHeight,
          clientHeight = this.hotContainer.clientHeight,
          scrollTop = Math.round(this.hotContainer.scrollTop);
      if (scrollHeight == (clientHeight + scrollTop)) {
        this.throttle(that.getHotImage)();
      }
    },
    // 节流
    throttle(fn, time) {
      if (time == null || time == undefined) {
        time = 1500;
      }
      let lastTime = null;
      return function () {
        let nowTime = +new Date();
        if (nowTime - lastTime > time || !lastTime) {
          fn.apply(this, arguments);
          lastTime = nowTime;
        }
      }
    },
    //
    getHotImage() {
      this.hotImgParams.pkId = this.hotImgParams.min;
      // console.log(this.hotImgParams);
      materialApi.getMaterialListAll('image', materialApi.range.ALL, this.hotImgParams)
        .then(res => {
          if (res.code === 20000) {
            this.hotSpotList = this.hotSpotList.concat(res.data);
            this.sortList();
          } else if (res.code === 20004) {
            this.$message({
              message: this.$t('noData'),
              type: 'warning',
              duration: 1500
            });
          }
        })
    },
    sortList() {
      this.hotSpotList.sort((a, b) => {
        return b.id - a.id;
      });
      console.log(this.hotSpotList)
      this.hotImgParams.max = this.hotSpotList[0].id;
      this.hotImgParams.min = this.hotSpotList[this.hotSpotList.length - 1].id;
    },
    // 初始化素材列表
    initMaterial() {
      materialApi.getMaterialListAll('image', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
        .then(res => {
          if (res.code === 20000 && res.data !== null) {
            this.imgList = res.data
          }
        })
      // 获取热点列表
      materialApi.getMaterialListAll('image', materialApi.range.ALL, this.hotImgParams)
        .then(res => {
          if (res.code === 20000) {
            // console.log(res.data)
            this.hotSpotList = res.data;
            this.hotSpotList.map(item => {
              if (item.config) {
                item.config = JSON.parse(item.config);
              }
              return item;
            });
            this.sortList();
          }
        })
      materialApi.getMaterialListAll('video', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
        .then(res => {
          if (res.code === 20000 && res.data !== null) {
            this.videoList = res.data
          }
        })
      modelApi.getModelByUser('all',{
        pkId: 0,
        size: 50,
        userId:this.$store.getters.userId
      })
        .then(res => {
          if (res.code === 20000 && res.data !== null) {
            this.modelList = res.data
          }
        })

      materialApi.getMaterialListAll('voice', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      }).then(res => {
        if (res.code === 20000 && res.data !== null) {
          this.musicList = res.data
        }
      })
      // 获取全景项目的天空盒图片
      api.getPanormaImages(this.id).then(async(res) => {
        // 获取到全景图
        if (res.code === 20000 && res.data !== null) {
          // 获取全景图列表，预加载图片
          this.skyBoxList = res.data
          let imgPreloadList=[]
          for(let i=0;i<this.skyBoxList.length;i++){
            imgPreloadList.push(this.getSkyBoxSrc(this.skyBoxList[i].path))
          }
          // console.log('preload')
          // console.log(imgPreloadList)
          await imgsPreloader(imgPreloadList);
          this.loading.flag=false
          this.groupId = this.skyBoxList[0].id
          api.get(this.id)
            .then(res => {
              if ((res.data.panoConfig.sceneGroup == null) || (res.data.panoConfig.sceneGroup == "")) {
                this.sceneGroup = Object.assign({}, defaultSceneGroup),
                  this.panoConfig = {
                    sceneGroup: this.sceneGroup
                  }
                for (let i = 0; i < this.skyBoxList.length; i++) {
                  const param = {
                    pano: this.skyBoxList[i],
                    dialog: [],// 素材热点
                    scene: [],//场景过渡
                    materials: []// 材质切换
                  }
                  this.sceneGroup.scene.push(param)
                }
                this.currentScene = this.sceneGroup.scene[0]


              }
              else {
                this.panoConfig = res.data.panoConfig
                if (this.panoConfig.sceneGroup != null && this.panoConfig.sceneGroup !== "") {
                  this.sceneGroup = JSON.parse(this.panoConfig.sceneGroup)
                  this.currentScene = this.sceneGroup.scene[0]
                } else {
                  this.sceneGroup = Object.assign({}, defaultSceneGroup)
                }
              }
              if (this.currentScene != undefined) {
                this.initRender()
              }

            })
        }
      })
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
    // 渲染模型详情
    showModelDetail(){
      // 通过模型id 渲染
      this.renderModel()
    },
    renderModel(){
      if (this.content.modelId==null) {
        //直接返回
        this.content.modelVisible = false
      }
      const that=this
      modelApi.getOne(this.content.modelId)
          .then(res => {
            if(res.data!=null) {
              this.content.modelDiv = document.getElementsByClassName("show-model-container")[0];
              let path_={
                path:null,
                texture:null,
                suffix:'',
                loading:null
              }
              // 给dom元素添加大小变动监听函数
              this.addDomResize(this.content.modelDiv , this.debounce((entries) => {
                for (const entry of entries) {
                  // console.log('dom width:'+entries[0].contentRect.width)
                  renderModelApi.onDomResize( this.content.modelId,entries[0].contentRect.width,entries[0].contentRect.height)
                }
              }, 500))
              renderModelApi.initDom(this.content.modelDiv,false,this.content.modelId)
              path_.path=res.data.model
              path_.texture=res.data.texture
              if (res.data.model==null){
                //直接返回
                this.content.modelVisible=false
              }else {
                path_.suffix=this.getSuffix(res.data.model)
                if(path_.texture!=null) {
                  // console.log(JSON.parse(res.data.texture)[0].new)
                  path_.texture = storeGetModel +"/"+ JSON.parse(res.data.texture)[0].new
                }
                this.initModel(res.data.model)
                    .then(res => {
                      path_.path = res;
                      path_.loading=this.dialogLoading
                      renderModelApi.loadModel( path_,this.content.modelId)
                          .then(res => {
                            this.modelType=res
                            renderModelApi.initLight(this.content.modelId)
                            renderModelApi.getCameraPosition(this.content.modelId)
                            renderModelApi.initTextures(this.content.modelId)
                          })
                    })
              }
            }
          })
    },
    // 模型加密解密使用
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
      const that = this;
      return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', `${storeGetModel}/${modelName}`);
        xhr.send();
        xhr.onreadystatechange = function (e) {
          if (this.readyState === 4 && this.status === 200) {
            that.modelOrigin = this.response;
            that.modelOrigin = that.charCode(that.modelOrigin);
            that.modelOrigin = new Blob([that.modelOrigin]);
            let url = window.URL.createObjectURL(new Blob([that.modelOrigin]));
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
    showChangeScene(item) {
      this.panorama.visible = true
      this.panorama.scene = item
      // 从currentScene中找寻当前场景的
      for(let i=0;i<this.currentScene.scene.length;i++){
        if(this.currentScene.scene[i].scene.id==item.id){
          this.panorama=JSON.parse(JSON.stringify(this.currentScene.scene[i]))
        }
      }
    },
    // 点击小图标加号
    addHotSpotTab() {

    },
    // 点击热点弹框视频试看
    playVideoShot(index, item) {
      const videoPlayer = this.$refs.shotVideo[index]
      if (videoPlayer.paused) {
        Vue.set(item, 'rotate', true)
        videoPlayer.play()
      } else {
        Vue.set(item, 'rotate', false)
        videoPlayer.pause()
      }
    },
    //视频试看结束回调
    videoShotEnded(index, item) {
      Vue.set(item, 'rotate', false)
    },
    // 点击热点弹框音乐试听
    playVoiceShot(index, item) {
      const audioPlayer = this.$refs.shotVoiceAudio[index]
      if (audioPlayer.paused) {
        Vue.set(item, 'rotate', true)
        audioPlayer.play()
      } else {
        Vue.set(item, 'rotate', false)
        audioPlayer.pause()
      }
    },
    // 音乐试听结束回调
    voiceShotEnded(index, item) {
      Vue.set(item, 'rotate', false)
    },
    // 图片拖拽起始事件退
    imgDragStart(e, item, index) {
      e.stopPropagation()
      if (renderApi.isEditor()) {
        e.preventDefault()
        this.$message({
          message: this.$t("isEditor"),
          type: 'warning',
          duration: 1500
        })
        return
      }

      e.dataTransfer.setData("src", item.path);
      e.dataTransfer.setData("materialId", item.id);
      e.dataTransfer.setData("thumb", item.thumb);
      e.dataTransfer.setData("path", item.path);
      e.dataTransfer.setData("config", item.config);
      console.log('drag suc')
    },
    // 模型展示div接受拖拽事件
    async fileDrop(e) {
      e.stopPropagation()
      // e的x,y属性就是拖动过程中鼠标的实时x,y坐标值，使用 e.x 和 e.y来获取鼠标坐标
      this.bottomFlag.flag = true
      let src = '' + e.dataTransfer.getData("src");
      let materialId = +e.dataTransfer.getData("materialId");
      let thumb = '' + e.dataTransfer.getData("thumb");
      let path = '' + e.dataTransfer.getData("path");
      let config = e.dataTransfer.getData('config') ? JSON.parse(e.dataTransfer.getData('config')) : false;
      console.log(config)
      console.log(typeof config)
      let dom;
      let index=this.index++
      const result = await renderApi.placeMaterial({
        x: e.x,
        y: e.y,
        index: index
      }, this.getImgSrc(src), config);
      const data={
        'data':null, //图标点击信息
         'icon':{
          thumb:thumb,
          path:path
         } //图标本身信息
      }
      this.currentScene.dialog.push(data)
      if (result == 'success') {
        this.dialog.visible = true
        this.dialog.hotspot = Object.assign({}, defaultImage)
        this.dialog.type = 'image'
        this.dialog.index = index
        this.$nextTick(() => {
          this.htmlOpened();
        }); 
      }
    },
    openShot() {
      this.showFlag = true
    },
    // 打开布置热点弹框
    openSelectShot() { },
    // 布置热点弹框点击关闭
    closeSelectShot() {
      this.content.resetVisible = false
      this.contentIndex = 0
    },
    // 布置热点弹框点击左键
    turnPrev() {
      if (this.contentIndex === 0) {
        return
      } else {
        this.contentIndex--
      }
    },
    // 布置热点弹框点击右键
    turnNext() {
      if (this.contentIndex < this.content.resetList.length - 1) {
        this.contentIndex++
      } else {
        return
      }
    },
    // 布置热点弹框点击布置按钮
    async selectShot() {
      const result = await renderApi.changeMaterial(this.reset.list[this.contentIndex])
      if (result == 'success') {
        this.content.resetVisible = false
      }
    },
    // 布置热点弹框点击立即购买
    buy() {

      let link = document.createElement('a');
      link.style.display = 'none';
      link.target = "_blank"
      link.href = this.reset.list[this.contentIndex].link
      document.body.appendChild(link);
      link.click();
    },
    changeResetObj(item) {

    },
    moveResetObj(item) {
      this.dialog.hotspot.list.forEach((obj, index) => {
        if (item.id === obj.id) {
          if (index != 0) {
            this.dialog.hotspot.list.splice(index, 1)
            this.dialog.hotspot.list.splice(index - 1, 0, item)
          }

        }
      })
    },
    addReset() {
      this.reset.visible = true
    },
    delResetObj(item) {
      this.reset.list.forEach((obj, index) => {
        if (item.id === obj.id) {
          this.reset.list.splice(index, 1)
        }
      })
    },
    addResetObj() {
      this.$refs.addHotspot.validate(valid => {
        if (valid) {
          let item = JSON.parse(JSON.stringify(this.resetObj))
          this.reset.list.push(item)
          this.resetObj = Object.assign({}, defaultResetNode)
          this.reset.addFlag = true
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1500
          })
          this.$refs.addHotspot.clearValidate()
        } else {
          this.$message({
            message: '添加内容不正确，请核对后再添加',
            type: 'warning',
            duration: 1500
          })
        }
      })

    },
    initResetObj() {
      this.$refs.addHotspot.clearValidate()
      this.resetObj = Object.assign({}, defaultResetNode)
    },
    showThumb() {
      this.shotspotSelectObj.submitType = 'item'
      this.shotspotSelectObj.type = 'thumb'
      this.shotspotSelectObj.list = this.imgList;
      (this.resetObj.thumb != null) && (this.shotspotSelectObj.id = this.resetObj.thumb.id)
      this.shotspotSelectObj.flag = true
    },
    showPanorama() {
      this.shotspotSelectObj.submitType = 'item'
      this.shotspotSelectObj.type = 'panorama'
      this.shotspotSelectObj.list = this.skyBoxList;
      (this.resetObj.panorama != null) && (this.shotspotSelectObj.id = this.resetObj.panorama.id)
      this.shotspotSelectObj.flag = true
    },
    showVideo() {
      this.shotspotSelectObj.submitType = 'dialog'
      this.shotspotSelectObj.isMulti=false
      this.shotspotSelectObj.type = 'video'
      this.shotspotSelectObj.list = this.videoList
      this.shotspotSelectObj.flag = true
    },
    showVoice() {
      this.shotspotSelectObj.submitType = 'dialog'
      this.shotspotSelectObj.type = 'voice'
      this.shotspotSelectObj.list = this.musicList
      this.shotspotSelectObj.flag = true
    },
    showHotSpot(type) {
      this.shotspotSelectObj.submitType = type
      this.shotspotSelectObj.type = 'icon'
      this.shotspotSelectObj.list = this.hotSpotList
      this.shotspotSelectObj.flag = true
      this.shotspotSelectObj.isMulti = false
    },
    showModel() {
      this.shotspotSelectObj.submitType = 'dialog'
      this.shotspotSelectObj.type = 'model'
      this.shotspotSelectObj.list = this.modelList
      this.shotspotSelectObj.flag = true
      this.shotspotSelectObj.isMulti = false
    },
    showImage() {
      this.shotspotSelectObj.submitType = 'dialog'
      this.shotspotSelectObj.type = 'img'
      this.shotspotSelectObj.list = this.imgList
      this.shotspotSelectObj.flag = true
      this.shotspotSelectObj.isMulti = true
    },
    selectImgShot(e, item) {
    },
    getItem(id, list) {
      let obj = null
      list.forEach(item => {
        if (id == item.id) {
          obj = Object.assign({}, item)
        }
      })
      return obj
    },
    cancelSelectShot() {
      this.shotspotSelectObj.id = null
      this.shotspotSelectObj.flag = false
    },
    confirmSelectShot() {
      if (!this.shotspotSelectObj.isMulti) {
        if (this.shotspotSelectObj.id == null) {
          this.$message({
            message: '选项不能为空，请核对后确认',
            type: 'warning',
            duration: 1500
          })
          return
        }
      } else {
        if (this.shotspotSelectObj.checkList == null) {
          this.$message({
            message: '选项不能为空，请核对后确认',
            type: 'warning',
            duration: 1500
          })
          return
        }
      }
      if (this.shotspotSelectObj.submitType == 'dialog') {
        if (this.shotspotSelectObj.isMulti == false) {
          this.map.set(this.shotspotSelectObj.id,this.getType(this.shotspotSelectObj.type))
          this.dialog.hotspot[this.shotspotSelectObj.type] = this.getItem(this.shotspotSelectObj.id, this.shotspotSelectObj.list)
        } else {
          for(let i=0;i<this.shotspotSelectObj.checkList.length;i++){
            this.map.set(this.shotspotSelectObj.checkList[i].id,this.getType(this.shotspotSelectObj.type))
          }
          this.dialog.hotspot.list = this.shotspotSelectObj.checkList
        }
      } else if (this.shotspotSelectObj.submitType == 'reset') {
        this.map.set(this.shotspotSelectObj.id,this.getType(this.shotspotSelectObj.type))
        this.reset[this.shotspotSelectObj.type] = this.getItem(this.shotspotSelectObj.id, this.shotspotSelectObj.list)
      } else if (this.shotspotSelectObj.submitType == 'panorama') {
        this.map.set(this.shotspotSelectObj.id,this.getType(this.shotspotSelectObj.type))
        this.panorama[this.shotspotSelectObj.type] = this.getItem(this.shotspotSelectObj.id, this.shotspotSelectObj.list)
      } else {
        this.map.set(this.shotspotSelectObj.id,this.getType(this.shotspotSelectObj.type))
        this.resetObj[this.shotspotSelectObj.type] = this.getItem(this.shotspotSelectObj.id, this.shotspotSelectObj.list)
      }
      this.shotspotSelectObj.flag = false
      this.shotspotSelectObj.isMulti = false
      this.shotspotSelectObj.id = null

    },
    getType(type){
        if(type=='voice'){
          return audioMaterial
        }else if(type=='img'){
          return imgMaterial
        }else if(type=='panorama'){
          return skyBoxMaterial
        }else if(type=='model'){
          return modelMaterial
        }else if(type=='video'){
          return videoMaterial
        }
    },
    // 初始化热点图标
    // initHotSpot() {
    //   for (let i = 1; i < 11; i++) {
    //     const data = {
    //       id: 'icon' + i,
    //       name: 'icon' + i + '.png',
    //       thumb: './icons/hot/icon' + i + '.png',
    //       path: './icons/hot/icon' + i + '.png'
    //     }
    //     this.hotSpotList.push(data)
    //   }
    // },
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
    initRender() {
      const container = document.getElementsByClassName("editor-container")[0];
      this.content.modelDiv = document.getElementsByClassName("show-model-container")[0]
      const param = {
        flag: this.flag,
        content: this.content,
        dialog: this.dialog,
        dialogLoading:this.dialogLoading
      }
      renderApi.initDom(container, this.currentScene, param)
    },
    preventDefault(e) {
      e.stopPropagation()
    },
    // tab栏点击事件
    tabsClick() {
      // 判断tabName是不是材质
    },
    changePanorama(index) {
      this.currentScene = this.sceneGroup.scene[index]
      renderApi.changePanorama(this.currentScene)
    },
    // 模型展示弹框关闭按钮事件
    modelDialogClose(e) {
      this.content.modelVisible = false
      // 关闭模型详情弹框
    },
    // 图文弹框关闭
    htmlDialogClose(e) {
      this.content.htmlVisible = false
    },
    // 初始化素材列表
     initMaterial() {
      materialApi.getMaterialListAll('image', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
        .then(res => {
          if (res.code === 20000 && res.data !== null) {
            this.imgList = res.data
          }
        })
      materialApi.getMaterialListAll('image', materialApi.range.ALL, {
        pkId: 0,
        size: 100
      })
        .then(res => {
          if (res.code === 20000) {
            console.log(res.data)
            this.hotSpotList = res.data
          }
        })
      materialApi.getMaterialListAll('video', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      })
        .then(res => {
          if (res.code === 20000 && res.data !== null) {
            this.videoList = res.data
          }
        })
      modelApi.getModelByUser('all',{
        pkId: 0,
        size: 50,
        userId:this.$store.getters.userId
      })
        .then(res => {
          if (res.code === 20000 && res.data !== null) {
            this.modelList = res.data
          }
        })

      materialApi.getMaterialListAll('voice', materialApi.range.CONFIDENTIAL, {
        pkId: 0,
        size: 50
      }).then(res => {
        if (res.code === 20000 && res.data !== null) {
          this.musicList = res.data
        }
      })
      // 获取全景项目的天空盒图片
      api.getPanormaImages(this.id).then(async(res) => {
        // 获取到全景图
        if (res.code === 20000 && res.data !== null) {
          // 获取全景图列表，预加载图片
          this.skyBoxList = res.data
          let imgPreloadList=[]
          for(let i=0;i<this.skyBoxList.length;i++){
            imgPreloadList.push(this.getSkyBoxSrc(this.skyBoxList[i].path))
          }
          // console.log('preload')
          // console.log(imgPreloadList)
          this.loading.progress=0
          for(let i=0;i<98;i++){
            this.loading.progress=i
          }
          await imgsPreloader(imgPreloadList);
          this.loading.progress=100
          this.loading.flag=false
          this.groupId = this.skyBoxList[0].id
          api.get(this.id)
            .then(res => {
              if ((res.data.panoConfig.sceneGroup == null) || (res.data.panoConfig.sceneGroup == "")) {
                this.sceneGroup = Object.assign({}, defaultSceneGroup),
                  this.panoConfig = {
                    sceneGroup: this.sceneGroup
                  }
                for (let i = 0; i < this.skyBoxList.length; i++) {
                  const param = {
                    pano: this.skyBoxList[i],
                    dialog: [],// 素材热点
                    scene: [],//场景过渡
                    materials: []// 材质切换
                  }
                  this.sceneGroup.scene.push(param)
                }
                this.currentScene = this.sceneGroup.scene[0]
                

              }
              else {
                this.panoConfig = res.data.panoConfig
                if (this.panoConfig.sceneGroup != null && this.panoConfig.sceneGroup !== "") {
                  this.sceneGroup = JSON.parse(this.panoConfig.sceneGroup)
                console.log('sceneGroup')
                console.log(this.sceneGroup)
                  this.currentScene = this.sceneGroup.scene[0]
                } else {
                  this.sceneGroup = Object.assign({}, defaultSceneGroup)
                }
              }
              if (this.currentScene != undefined) {
                this.initRender()
              }

            })
        }
      })
    },
    // 抗锯齿开关值改变事件
    antiChange(e) {
    },
    // 模拟步行速度值改变事件
    speedChange(e) {
    },
    // 导航栏保存按钮事件
    setSave() {
      //保存sceneGroup
      let result = renderApi.checkEl()
      if (result!="") {

        this.$message({
          message: this.$t("material.material")+result+this.$t("noData"),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.panoConfig.sceneGroup = JSON.stringify(this.sceneGroup)
      const data = {
        panoConfig: this.panoConfig,
        materials: []
      }
      this.map.forEach((v,k)=>{
        const materialEntry={
        materialId:null,
        type:null,
        panoramaId:null
      }
        materialEntry.materialId=k
        materialEntry.type=v
        materialEntry.panoramaId=Number(this.id)
        data.materials.push(materialEntry)
      })
      for(let i=0;i<this.skyBoxList.length;i++){
        const materialEntry={
        materialId:null,
        type:null,
        panoramaId:null
      }
        materialEntry.materialId=this.skyBoxList[i].id
        materialEntry.type=skyBoxMaterial
        materialEntry.panoramaId=Number(this.id)
        data.materials.push(materialEntry)
      }
      api.update(this.id, data).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: this.$t("saveSuccess"),
            type: 'success',
            duration: 1500
          })
        }
      })
    },
   
    // 删除某种类别的热点
    delSectedItem(index) {
      this.currentScene.dialog.splice(index,1)
      renderApi.removeObj(index)
    },

    // 点击问号帮助按钮打开帮助弹框
    showHelper() {
      if (this.isArListFlag) {
        this.helperFlag = true
      } else {
        this.modelhelperFlag = true
      }
    },
    // 点击顶部设置按钮打开设置弹框
    showSetter() {
      this.setterFlag = true
    },
    // 点击查看按钮实现全屏展示功能
    fullScreen() {
      // const ele = document.getElementsByClassName('editor-container')[0]
      const ele = document.getElementsByClassName('container')[0]
      this.requestFullScreen(ele)
      // 如果目前是编辑状态，更改render操作
      if (this.flag) {
        renderApi.changeEditor(false)
      }
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
    dispatchForCode(event, callback) {
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
    keydownForFull(event) {
      const self = this
      self.dispatchForCode(event, (code) => {
        if (code === 'F11' || code === 122) {
          event.preventDefault();
        }
      })
    },
    // 监听全屏事件，使用fullscreenFlag 进行判断
    fullscreenchange(e) {
      const self = this
      // 退出全屏
      if (this.flag && self.fullscreenFlag) {
        renderApi.changeEditor(true)
          this.content.imgVisible = false
          this.content.textVisible = false, //文字介绍弹框
          this.content.text = "", // 文字介绍内容
          this.content.voice = null, //音频文件
          this.content.video = null, //视频文件
          this.content.videoVisible = false,//视频介绍弹框
          this.content.imgVisible = false,// 图片显示走马灯
          this.content.imgList = null,//图片列表
          this.content.modelVisible = false,
          this.content.modelId=null,
          this.content.modelDiv = null,
          this.content.htmlVisible = false,
          this.content.content = "",
          this.content.modelId=null
      }
      self.fullscreenFlag = !!document.fullscreenElement

    },
    // 开启/关闭侧边栏
    showAside() {
      this.asideFlag = this.asideFlag == true ? false : true;
    },
    // 退出按钮路由跳转
    back() {
      this.$router.back(-1);
    },
    // 模型展示div绑定去除不可拖拽事件
    allDrop(e) {
      e.preventDefault();
    },
    exportFunction() {
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = "http://192.168.1.126:8080/api1" + "/vr/skybox/" + this.id + "/download"
      document.body.appendChild(link);
      link.click();
    },
    // 添加热点name为具体要添加的热点
    addHotSpot(name) {
      this.dialog[name].visible = true
    },
    // 添加或修改素材热点
    async submitDialogForm() {
      if (this.dialog.flag) {
        return
      }
      if (this.dialog.type == 'html') {
        this.dialog.hotspot.content = this.editor.txt.html()
      }
     
      const result=await this.checkForm('dialogForm')
     
      if(result){
        this.dialog.flag = true // 开启防抖
          this.changeHotSpot()
        
      }
    },
    // 验证表单
    checkForm(name) {
      return new Promise((resolve, reject) => {
        this.$refs[name].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
     changeHotSpot() {
      this.currentScene.dialog[this.dialog.index].data=JSON.parse(JSON.stringify(this.dialog))
      const result =  renderApi.changeHotSpot(JSON.parse(JSON.stringify(this.dialog)))
      if (this.dialog.type == 'html') {
          this.editor.txt.html('')
        }
        // 关闭弹框
        this.dialog.visible = false
        // 重置类型
        this.dialog.type = 'image'
        // 重置热点
        this.dialog.hotspot = Object.assign({}, defaultImage)
        // 关闭防抖
        this.dialog.flag = false
        this.$refs['dialogForm'].resetFields();
    },
    // 取消添加或修改链接热点弹框
    resetDialogForm() {
      // 关闭弹框
      this.dialog.visible = false
      // 重置类型
      this.dialog.type = 'image'
      // 重置热点
      this.dialog.hotspot = Object.assign({}, defaultImage)
      // 关闭防抖
      this.dialog.flag = false
      // 重置表单验证
      this.$refs['dialogForm'].resetFields();
    },

    // 获取到选择的单个图标
    selectOne(data) {
      const search = data.name.substring(0, data.name.lastIndexOf('.'))
      const index = data.name.substring(data.name.lastIndexOf(".") + 1)
      let value = this.getObj(search, this.dialog)
      value[index] = data.item
    },
    getObj(strs, obj) {
      let keys = strs.split('.');
      for (let key of keys) {
        obj = obj[key]
      }
      return obj
    },
    changeResetAddFlag() {
      this.reset.addFlag = !this.reset.addFlag
    },
    // 打开图文弹框
    htmlOpened() {
      if (this.editor) {
        return
      }
      this.initEditor()
    },
    initEditor() {
      const that = this
      let uploadImageHooks,
        uploadVideoHooks,
        menus,
        editorConfig;
      if (this.editor === null) {
        // 上传图片和视频钩子
        uploadImageHooks = {
          customInsert(insert, result) {
            let url = that.getImgSrc(result.data.filename),
              xhr = new XMLHttpRequest()
            xhr.open('get', url, true)
            xhr.send()
            xhr.onload = function () {
            }
            insert(url)
          }
        },
          uploadVideoHooks = {
            customInsert(insert, result) {
              let url = that.getCommonSrc(result.data.filename),
                xhr = new XMLHttpRequest()
              xhr.open('get', url, true)
              xhr.send()
              xhr.onload = function () {
              }
              insert(url)
            }
          }
        menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'video',  // 插入视频
          'table',  // 表格
          'code',  // 插入代码
          'undo',  // 撤销
          'redo', // 重复
          'indent',//分割线
          'lineHeight',//行高
          'splitLine',//全屏
        ]
        // 编辑器配置对象
        editorConfig = {
          height: 350,
          menus,
          onchangeTimeout: 1000,
          // uploadImgServer: status.network.uploadFileURL('common'),
          uploadImgServer: this.uploadImageUrl,
          uploadFileName: 'file',
          showLinkImg: false,
          uploadImgMaxLength: 1,
          uploadImgMaxSize: 500 * 1024 * 1024,
          uploadImgTimeout: 500 * 1024 * 1024,
          uploadVideoServer: this.uploadVideoUrl,
          uploadVideoMaxSize: 500 * 1024 * 1024,
          uploadVideoName: 'file',
          uploadVideoTimeout: 500 * 1024 * 1024,
          onchange: that.editorChange,
          uploadImgHooks: uploadImageHooks,
          uploadVideoHooks: uploadVideoHooks
        }
        this.editor = new wangEditor(this.$refs.wangEditor)
        this.editor.config = { ...this.editor.config, ...editorConfig }
        this.editor.create()
        this.editor.txt.html('')
      } else {
        this.editor.txt.html('')
      }
    },
    // 关闭场景过渡弹框
    resetPanoramaForm() {
      this.panorama = Object.assign({}, defaultPanorama)
      // 重置表单验证
      this.$refs['panoramaForm'].resetFields();
    },
    // 确认场景过渡弹框
    async submitPanoramaForm() {
      if (this.panorama.flag) {
        return
      }
      const result=await this.checkForm('panoramaForm')
      if(result){
        this.currentScene.scene.push(JSON.parse(JSON.stringify(this.panorama)))
        this.addPanoramaHotspot()
      }
    },
    async addPanoramaHotspot(){
      this.panorama.flag = true // 开启防抖
        const result = await renderApi.addHotSpot(JSON.parse(JSON.stringify(this.panorama)))
        if (result == 'success') {
          // 关闭弹框
          this.panorama = Object.assign({}, defaultPanorama)
          this.$refs['panoramaForm'].resetFields();
        }
    },
    // 材质切换弹框
    resetMaterialForm() {
      // 关闭弹框
      this.reset = Object.assign({}, defaultReset)
      // 重置表单验证
      this.$refs['resetForm'].resetFields();
    },
   async submitMaterialForm() {
      if (this.reset.flag) {
        return
      }
      const result=await this.checkForm('resetForm')
      if(result){
        this.currentScene.materials.push(this.reset)
        this.addResetHotspot()
      }
    },
    async addResetHotspot(){
      this.reset.flag = true // 开启防抖
        const result = await renderApi.addHotSpot(this.reset)
        if (result == 'success') {
          // 关闭弹框
          this.reset = Object.assign({}, defaultReset)
          this.$refs['resetForm'].resetFields();
        }
    }
  },
};
</script>
<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
}

#vr-model-editor {
  width: 100%;
  height: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;
}

// 热点图片选择框
.shotspot-img-select {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .3);
  z-index: 10000;

  // 主体
  .shotspot-thumb-container {
    position: relative;
    width: 40%;
    min-width: 480px;
    height: 50%;
    min-height: 250px;
    background-color: rgba(34, 34, 34, 1);
    border-radius: 10px;

    // 头部
    .shotspot-thumb-header {
      position: relative;
      width: 100%;
      height: 45px;
      line-height: 45px;

      h3 {
        margin: 0;
        padding: 0;
        padding-left: 20px;
        height: 45px;
        line-height: 45px;
      }

      // 关闭突变
      .icon-close {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 5px;
        right: 5px;
        background: url('~@/assets/del-icon.png') no-repeat;
        background-size: 15px;
        background-position: center;
        cursor: pointer;
      }
    }

    // 选择区域
    .shotspot-thumb-content {
      height: calc(100% - 90px);
      width: 100%;
      display: flex;
      padding: 10px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      flex-wrap: wrap;
      justify-content: flex-start;
      overflow-y: auto;


      // 选择项
      .shotspot-thumb-item {
        width: 40px;
        height: 40px;
        margin: 10px;
        // 复选框

        // 单选框相关样式
        label.el-radio {
          width: 40px;
          height: 40px;
          border: 3px solid #fff;
          border-radius: 6px;
          background-color: #3b3b3b;
        }

        label.el-radio.is-checked {
          border: 3px solid #2489f3;
          box-shadow: 0 0 5px #2489f3;
          transform: translate(-2px, -2px);
        }

        .el-checkbox-group {
          width: 40px;
          height: 40px;

          label.el-checkbox {
            width: 40px;
            height: 40px;
            border: 3px solid #fff;
            border-radius: 6px;
            background-color: #3b3b3b;
          }

          label.el-checkbox.is-checked {
            border: 3px solid #2489f3;
            box-shadow: 0 0 5px #2489f3;
            transform: translate(-2px, -2px);
          }
        }
      }

      .shotspot-thumb-item::v-deep span.el-radio__input {
        display: none;
      }

      .shotspot-thumb-item::v-deep span.el-radio__label {
        width: 100%;
        height: 100%;
        padding: 0;
        display: inline-block;
        position: relative;

        .voice-player {
          position: absolute;
          width: 22px;
          height: 22px;
          background: url('~@/assets/music.png') no-repeat;
          background-size: 18px;
          background-position: center center;
          background-color: #fff;
          bottom: 2px;
          left: 2px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, .5);
        }

        .video-player {
          position: absolute;
          width: 22px;
          height: 22px;
          background: url('~@/assets/video.png') no-repeat;
          background-size: 18px;
          background-position: center center;
          background-color: #fff;
          bottom: 2px;
          left: 2px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, .5);
        }

        .playerRotate {
          border: 2px solid #2489f3;
          animation: rotate 15s infinite linear;
        }

        div.el-image {
          width: 100%;
          height: 100%;
        }

        div.el-image::v-deep img {
          -webkit-user-drag: none;
        }
      }

      .shotspot-thumb-item::v-deep span.el-checkbox__input {
        display: none;
      }

      // el-checkbox__label
      .shotspot-thumb-item::v-deep span.el-checkbox__label {
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

    .shotspot-thumb-content::-webkit-scrollbar {
      width: 10px;
      background: rgba(34, 34, 34, 0.2);
    }

    .shotspot-thumb-content::-webkit-scrollbar-thumb {
      width: 9px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 4px;
    }

    .shotspot-thumb-footer {
      text-align: right;
    }
  }

  // 展示弹框覆盖样式
  .shotspot-thumb-container.show {
    width: 300px;
    min-width: 300px;
    height: 430px;
    overflow: hidden;
    position: relative;

    .shotspot-thumb-header {
      height: 30px;
      line-height: 30px;
    }

    .shotspot-thumb-content {
      position: relative;
      border: none;
      display: block;
      padding: 15px;
      height: calc(100% - 120px);

      // 图片部分
      .el-image {
        width: 100%;
        height: 150px;
      }

      // 名称部分
      .shotspot-content-name {
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        position: relative;
        font-size: 18px;
        font-weight: 700;

        .shotspot-content-index {
          position: absolute;
          width: 100%;
          height: 20px;
          font-size: 12px;
          top: -20px;
          left: 0;
          color: #ccc;
        }
      }

      .shotspot-content-info {
        width: 100%;
        height: 70px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 10px;
        padding: 5px;
        font-size: 12px;
        color: #fff;
        overflow-y: auto;
      }

      .shotspot-content-info::-webkit-scrollbar {
        background: rgba(34, 34, 34, 0.2);
        width: 8px;
      }

      .shotspot-content-info::-webkit-scrollbar-thumb {
        width: 6px;
        background-color: rgba(255, 255, 255, .6);
        border-radius: 4px;
      }


    }

    .shotspot-thumb-footer {
      padding: 0 40px;
    }

    // 左边按钮
    .btn-left {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: 2px solid #fff;
      background: url('~@/assets/cleft.png') no-repeat;
      background-position: center;
      background-size: 20px;
      top: 210px;
      left: -10px;
      z-index: 10000;
      cursor: pointer;
      transition-property: left, border-radius, background;
      transition-duration: 600ms;
    }

    .btn-left:hover {
      left: 0;
      border-radius: 50%;
      background: url('~@/assets/bleft.png') no-repeat;
      background-size: 20px;
      background-position: 1px center;
      background-color: #fff;
    }

    // 右边按钮
    .btn-right {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: 2px solid #fff;
      background: url('~@/assets/cright.png') no-repeat;
      background-position: center;
      background-size: 20px;
      top: 210px;
      right: -10px;
      z-index: 10000;
      cursor: pointer;
      transition-property: right, border-radius, background;
      transition-duration: 600ms;
    }

    .btn-right:hover {
      right: 0;
      border-radius: 50%;
      background: url('~@/assets/bright.png') no-repeat;
      background-size: 20px;
      background-position: 4px center;
      background-color: #fff;
    }
  }
}

.btn-group {
  padding: 10px;
}

button.add-btn {
  display: block;
  margin-top: 8px;
  width: 100%;
  height: 30px;
  color: #fff;
  background-color: rgba(204, 204, 204, .5);
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

button.add-btn:hover {
  background-color: rgba(204, 204, 204, .8);
  text-shadow: 0 0 10px #fff;
  font-style: italic;
  font-weight: 700;
  box-shadow: 0 0 5px #fff;
}

button.add-btn:active {
  background-color: #ccc;
  font-weight: 500;
  font-style: normal;
  box-shadow: none;
}

button.add-btn[disabled] {
  cursor: not-allowed;
}

button.add-btn[disabled]:hover {
  background-color: rgba(204, 204, 204, .5);
  text-shadow: none;
  font-style: normal;
  font-weight: 500;
  box-shadow: none;
}

button.default-btn {
  width: 100px;
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
  background-color: rgb(204, 204, 204);
}

// 导航栏部分
.editor-nav {
  position: relative;
  height: 60px;
  background-color: rgb(111, 109, 109);
  display: flex;
  justify-content: space-between;
  z-index: 999;
}

.editor-nav .nav-left a {
  display: inline-block;
  height: 100%;
  padding: 15px;
}

.editor-nav .nav-left img {
  vertical-align: middle;
}

.editor-nav .nav-left span {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  color: #fff;
}

.editor-nav .nav-right {
  display: flex;
  position: relative;
  padding-right: 10px;
  justify-content: space-around;
  align-items: center;
}

.editor-nav .nav-right .icon-flag-helper {
  border-radius: 50%;
  background: url("~@/assets/help.png") no-repeat 3px;
}

.editor-nav .nav-right .icon-flag-set {
  border-radius: 50%;
  background: url("~@/assets/set2.png") no-repeat 3px;
}

.editor-nav .nav-right .icon-flag-export {
  border-radius: 50%;
  background: url("~@/assets/export.png") no-repeat 3px;
}

.editor-nav .nav-right .icon-flag-save {
  border-radius: 6px;
  background: url("~@/assets/save.png") no-repeat 1px 1px;
}

.editor-nav .nav-right .icon-flag-full {
  border-radius: 6px;
  background: url("~@/assets/full.png") no-repeat 3px 3px;
  background-size: 25px 25px;
}

.editor-nav .nav-right .icon-flag-exit {
  border-radius: 6px;
  background: url("~@/assets/exit.png") no-repeat 1px 1px;
}

.editor-nav .nav-right .icon-flag {
  width: 33px;
  height: 33px;
  margin-right: 12px;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  // border-radius: 50%;
  z-index: 99;
  cursor: pointer;
}

.container {
  width: 100%;
  height: 100%;
  margin-top: 0;
  display: flex;
  position: relative;
  background-color: #000;

  .carousel-container {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
    position: absolute;
    top: 0;
    left: 0;

    .el-carousel {
      width: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
  }

  // 主体部分
  .editor-container {
    width: 100%;
    height: 100%;
    margin-top: 0;
    display: flex;
  }

  // 模型旋转展示弹框
  .show-model-dialog {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 1);
    z-index: 9999;
    display: flex;

    // 弹框关闭小按钮
    .show-model-dialog-close {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 2px solid #fff;
      background: url("~@/assets/model-close.png") no-repeat 3px 3px;
      background-color: rgba(34, 34, 34, 0.4);
      background-size: 25px 25px;
      box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
      cursor: pointer;
      position: absolute;
      right: 15px;
      top: 15px;
    }

    // 左边模型描述部分
    .show-model-description {
      width: 40%;
      height: 100%;
      padding: 50px;
      background-color: rgba(34, 34, 34, 0.6);

      p {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        color: #ccc;
        font-size: 16px;
        background-color: rgba(189, 185, 185, 0.788);

      }
    }

    // 模型展示部分
    .show-model-container {
      width: 100%;
      height: 100%;
      background-color: rgba(34, 34, 34, 0.6);
    }
  }
}


.editor-container .container-aside {
  width: 321px;
  height: 100%;
  background-color: #595959;
}

.editor-container .container-center {
  border-left: 1px solid #000;
  width: calc(100% - 321px);
  height: calc(100% - 60px);
}

// 侧边栏开关-打开
.aside-flag {
  position: absolute;
  top: 65px;
  left: 300px;
  width: 36px;
  height: 35px;
  background: url("~@/assets/unsee.png") no-repeat 3px 3px;
  background-size: 28px 28px;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  z-index: 99;
  cursor: pointer;
}

// 侧边栏开关-关闭
.aside-flag-close {
  position: absolute;
  top: 65px;
  left: 10px;
  width: 36px;
  height: 35px;
  background: url("~@/assets/see.png") no-repeat;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  z-index: 99;
  cursor: pointer;
}

// 帮助提示开关
.helper-flag {
  position: absolute;
  top: 65px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: url("~@/assets/help.png") no-repeat 2px 2px;
  background-color: rgba(34, 34, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  z-index: 99;
  cursor: pointer;
}

// 全景设置弹框
.setter-father .tabs-item-container {
  padding-bottom: 40px;
  .item-content {
    width: 100%;
    height: 80px;
    background-color: red;
    display: flex;

    .item-content-label {
      display: block;
      width: 30%;
      height: 80px;
      line-height: 80px;
    }

    .item-content-content {
      width: 70%;
      height: 80px;
    }
  }
}

.setter-father::v-deep .el-dialog div.el-dialog__header {
  height: 50px;
  background-color: rgba(34, 34, 34);
  color: #ccc;
}

.setter-father::v-deep .el-dialog div.el-dialog__header span {
  color: #ccc;
}

.setter-father::v-deep .el-dialog div.el-dialog__body {
  background-color: rgba(34, 34, 34);
  padding: 40px 0 0 0;

  color: #ccc;
}

// 帮助提示弹框
.helper-father::v-deep .el-dialog__body {
  // padding-top: 30px;
  padding: 0;
}

.helper-container {
  display: flex;
  // height: 400px;
  font-size: 18px;
}

.helper-container table {
  text-align: center;
  font-size: 16px;
}

.helper-container table tr {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;

  td {
    flex: 1;
  }
}

.helper-container-left,
.helper-container-right {
  width: 50%;
  height: 90%;
  padding: 20px;
  // border: 1px solid red;
}

// .helper-container-left-header {
//   background: url('~@/assets/left.png') no-repeat 80px 10px;
// }

// .helper-container-right-header {
//   background: url('~@/assets/right.png') no-repeat 80px 4px;
// }

.helper-container-left-header,
.helper-container-right-header {
  width: 100%;
  height: 30%;

  // background-color: green;
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.helper-container-left {
  border-right: 1px solid #ccc;
}

// 展示帮助
.modelhelper-container {
  display: flex;
  height: 400px;
  font-size: 18px;
}

.modelhelper-container-left {
  width: 100%;
  height: 90%;
  padding: 20px;
  // border: 1px solid red;
}

.modelhelper-container-left-header {
  height: 60%;
  background: url('~@/assets/left.png') no-repeat 80px 10px;
}

// 上传音频弹框
.item-select-music {
  position: relative;

  #audio-container {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ccc;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 5px;
  }

  #audio-container.play {
    background: url('~@/assets/play-icon.png');
  }

  #audio-container.pause {
    background: url('~@/assets/pause-icon.png');
  }
}

.item-select-music::v-deep .el-form-item__content {
  display: flex;
}

// 预加载遮挡层
.loading {
  width: calc(100% - 310px);
  height: calc(100% - 60px);
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 999;
}

.fullloading {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 999;
}
// 模型渲染时进度条
.bg-dialog {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(204, 204, 204, .9);
  z-index: 1000;
  div {
    box-sizing: content-box;
  }
}
.dialog {
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

// 分组边栏
.group-aside {
  width: 40px;
  height: calc(100% - 60px);
  background-color: rgba(34, 34, 34, 0.8);
  border-right: 1px solid #000;
  position: absolute;
  top: 60px;
  left: 0;
  z-index: 999;

  .group-header {
    background-color: rgba(204, 204, 204, 0.5);
    height: 39px;
    border-bottom: 1px solid #000;
    line-height: 39px;
    color: #fff;
    text-align: center;
  }

  .group-container {
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    overflow-y: auto;

    .group-radio {
      margin: 0;
      width: 35px;
      height: 40px;
      margin-top: 8px;
      border: 1px solid #ccc;
      border-radius: 2px;
    }

    .group-radio.is-checked {
      border: 1px solid #00ccf6;
    }
  }

  .group-container::v-deep span.el-radio__input {
    display: none !important;
  }

  .group-container::v-deep span.el-radio__label {
    display: block;
    padding: 0;
    width: 100%;
    height: 100%;

    .group-image {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .group-container::-webkit-scrollbar {
    background: rgba(34, 34, 34, 0.2);
    width: 5px;
  }

  .group-container::-webkit-scrollbar-thumb {
    width: 4px;
    background-color: rgba(255, 255, 255, .6);
    border-radius: 1px;
  }
}

// 侧边栏部分
.editor-aside {
  width: 252px;
  height: calc(100% - 60px);
  background-color: rgba(34, 34, 34, 0.5);
  position: absolute;
  top: 60px;
  left: 40px;
  z-index: 999;
}

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


.el-tabs {
  border: 0;
  height: 100%;
}

.el-tabs::v-deep .el-tabs__header {
  background-color: rgba(34, 34, 34, 0.5);
  border-bottom: 1px solid #000;
}

.el-tabs::v-deep .el-tabs__header .el-tabs__item {
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}

.el-tabs::v-deep .el-tabs__header .el-tabs__item span {
  display: inline-block;
  color: #fff;
}

.el-tabs::v-deep .el-tabs__header .el-tabs__item.is-active {
  background-color: rgba(20, 20, 20, 0.5);
  border-right: 1px solid #000;
  border-left: 1px solid #000;
  border-bottom: 0;
  color: #fff;
}

// tabs选项卡主体部分
.el-tabs::v-deep .el-tabs__content {
  background-color: rgba(34, 34, 34, 0.5);
  // height: 100%;
  height: calc(100% - 39px);
  padding: 10px;
  overflow-y: auto;
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


.el-tabs::v-deep .el-tabs__content .el-tab-pane {
  height: 100%;

}

.tabs-item-container {
  background-color: rgba(34, 34, 34, 0.5);
  box-shadow: 1px 1px 1px 1px rgba(34, 34, 34, 0.5);
  // height: 100%;
  min-height: 100%;

  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-around;

    li {
      width: 90%;
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        margin-right: 10px;
        width: 120px;
        text-align: right;
      }
    }
  }
}

.setting-item-container {
  background-color: transparent;
  box-shadow: unset;
  color: #888;
}

.tabs-item-container-item {
  display: inline-block;
  // width: 63px;
  // height: 46px;
  width: 90px;
  height: 70px;
  margin-left: 14px;
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  .tabs-item-img-public {
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
      transform: translateY(-12px);
    }
  }
  i.tabs-item-add {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 18px;
    height: 18px;
    background: url('~@/assets/add1.png') no-repeat;
    background-position: center;
    background-color: #ccc;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
}

// 已选选项卡主体
.select-item {
  position: relative;

  .select-item-type {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 40px;
    line-height: 85px;
    text-align: center;
    color: rgba(255, 255, 255, .5);
  }
}

.select-item .select-item-del {
  position: absolute;
  right: 0;
  top: 0;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background: url('~@/assets/del.png') no-repeat;
  background-color: #ccc;
  cursor: pointer;
}

.select-item .select-item-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background: url('~@/assets/view.png') no-repeat;
  background-color: #ccc;
  cursor: pointer;
}

.tabs-item-container-item img {
  width: 100%;
  height: 100%;
}
.tabs-item-container-item .el-image {
  width: 100%;
  height: 100%;
}

.tabs-item-container-item video {
  width: 100%;
  height: 100%;
}

// 主体部分
.editor-container {
  width: 100%;
  height: calc(100% - 60px);
}

// 底部编辑栏
.bottom-editor {
  position: fixed;
  bottom: 0;
  right: 0;
  height: 40px;
  background-color: rgba(34, 34, 34, 0.5);
  border: 1px solid #ccc;
}

.bottom-editor .el-form {
  display: flex;
  align-items: center;
}

.bottom-editor .el-form::v-deep .el-form-item {
  margin: 0;
}

.bottom-editor .el-form::v-deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.5);
  border: 0;
  width: 50px;
  height: 25px;
  line-height: 25px;
  color: #fff;
}

// 底部编辑栏按钮
.bottom-editor .bottom-editor-btn {
  margin-left: 20px;
  width: 40px;
  height: 25px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  border: 1px solid #ccc;
  line-height: 25px;
  text-align: center;
  color: black;
}

// 进度条
.bg {
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  top: 60px;
  background-color: rgba(204, 204, 204, .9);
  z-index: 1000;

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

.asideContainer {
  width: calc(100% - 292px);
  position: absolute;
  left: 292px;
  top: 60px;
}

// el-upload
.avatar-uploader::v-deep .el-upload {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 160px;
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 160px;
    display: block;
  }
}

.avatar-uploader::v-deep .el-upload:hover {
  border-color: #409EFF;
}

.hotspot-change {
  position: relative;

  .hotspot-change-btn {
    position: absolute;
    top: 6px;
    right: 0;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
  }

  .add {
    background: url('~@/assets/add.png') no-repeat;
    background-position: center;
    background-size: 20px;
    background-color: #409EFF;
  }

  .top {
    background: url('~@/assets/top.png') no-repeat;
    background-position: center 2px;
    background-size: 20px;
    background-color: #409EFF;
  }

  .hotspot-add {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
}

.float-clear {
  clear: both;
}

.animationOpen {
  animation: open 800ms 1;
}

.prelook {
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  background-color: #3b3b3b;
}

.reset-shotspot-form {
  margin-top: 20px;
}

@keyframes open {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
</style>
  