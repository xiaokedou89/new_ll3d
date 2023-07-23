<template>
<div class="tabs-item-container">
  <el-collapse accordion>
    <el-collapse-item :title="$t('light.name')">
      <div class="collapse-item-container">
        <!-- 物理光总开关 -->
        <div class="collapse-item-switch switch-container">
          <el-switch
            v-model="phyLightFlag"
            @change="showPhysicalLight"
            active-text="ON"
            inactive-text="OFF">
          </el-switch>
        </div>
        <!-- 总开关控制的遮挡层 -->
        <div v-if="!phyLightFlag" class="mantle"></div>
        <!-- 物理光选择三个对象 -->
        <div class="phy-header">
          <span class="phy-header-label">{{$t("light.phyLight")}}</span>
          <!-- 三个灯光单选框 -->
          <div class="phy-header-body">
            <el-radio v-model="phyLightIndex" :label="item.index" v-for="(item, index) in phyLightObjArr" :key="index" @change="addPhyLight">
                {{ getPhyType(item.type) }}
            </el-radio>
          </div>
        </div>
        <!-- 三个对象对应设置 -->
        <div v-if="phyLightSaveNode !== null" class="phy-body">
          <span class="phy-body-label">{{$t("light.property")}}</span>
          <div class="phy-body-container">
            <!-- 物理光选择 -->
            <div class="phy-body-radio">
              <el-radio v-model="phyLightSaveNode.type" :label="item.type" v-for="(item, index) in phyLightSelect" :key="index" @change="selectPhyLight">
                <el-tooltip effect="dark" placement="top" popper-class="el-tooltip-pop" :content="item.description">
                  <span>
                    {{ getPhyType(item.type) }}
                  </span>
                </el-tooltip>
              </el-radio>
            </div>
            <!-- 物理光设置 -->
            <div v-if="phyLightSaveNode.type !== null && phyLightSaveNode.light !== null" class="phy-body-set">
              <!-- 平行光 -->
              <div v-if="phyLightSaveNode.type === 'directionalLight' && phyLightSaveNode.light.type === 'directionalLight'" class="directional-light-set">
                <!-- 平行光--光色、光强 -->
                <div class="directional-light-color">
                  <div class="directional-light-color-item">
                    <span>{{$t("light.color")}}</span>
                    <el-color-picker color-format="rgb"  v-model="phyLightSaveNode.light.color" @change="changeLight"></el-color-picker>
                  </div>
                  <div class="directional-light-color-item el-slider-group-parent">
                    <span>{{$t("light.intensity")}}</span>
                    <div class="el-slider-group">
                      <el-slider v-model="phyLightSaveNode.light.intensity" :step="0.01" :min="0" :max="20" @change="changeLight"></el-slider>
                      <el-input-number v-model="phyLightSaveNode.light.intensity" :step="0.01" :min="0" :max="20" :precision="2" @change="changeLight" label="label"></el-input-number>
                    </div>

                  </div>
                </div>
                <!-- 平行光--位置 -->
                <div class="directional-light-position">
                  <span class="directional-light-position-label">
                    {{$t("light.position")}}
                    <el-tooltip effect="dark" placement="top" popper-class="el-tooltip-pop" :content="description.directionalLightPosition">
                      <i class="light-position-label-icon"></i>
                    </el-tooltip>

                  </span>
                  <!--  request size   -->
                  <div class="directional-light-position-container" v-if="size!=null">
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :max="size.max.x" 
                        :min="size.min.x" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01" 
                        :precision="2"
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('light.yPosition')" placement="top">
                      <el-input-number 
                        :max="size.max.y" 
                        :min="size.min.y" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('light.zPosition')" placement="top">
                      <el-input-number 
                        :max="size.max.z" 
                        :min="size.min.z" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2"
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                  <!-- not request size -->
                  <div class="directional-light-position-container" v-else>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('light.yPosition')" placement="top">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('light.zPosition')" placement="top">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                </div>
                <!--    平行光终点            -->
<!--                <div class="directional-light-position">-->
<!--                  <span class="directional-light-position-label">-->
<!--                    {{$t("light.target")}}-->
<!--                    <el-tooltip effect="dark" placement="top" popper-class="el-tooltip-pop" :content="description.directionalLightPosition">-->
<!--                      <i class="light-position-label-icon"></i>-->
<!--                    </el-tooltip>-->

<!--                  </span>-->
<!--                  <div class="directional-light-position-container">-->
<!--                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">-->
<!--                      <el-input-number :max="size.max.x" :min="size.min.x" :disabled="phyLightSaveNode.light.isBindCamera" v-model="phyLightSaveNode.light.target.x" :step="0.1" @change="changeLight"></el-input-number>-->
<!--                    </el-tooltip>-->
<!--                    <el-tooltip effect="dark" :content="$t('light.yPosition')" placement="top">-->
<!--                      <el-input-number :max="size.max.y" :min="size.min.y" :disabled="phyLightSaveNode.light.isBindCamera" v-model="phyLightSaveNode.light.target.y" :step="0.1" @change="changeLight"></el-input-number>-->
<!--                    </el-tooltip>-->
<!--                    <el-tooltip effect="dark" :content="$t('light.zPosition')" placement="top">-->
<!--                      <el-input-number :max="size.max.z" :min="size.min.z" :disabled="phyLightSaveNode.light.isBindCamera" v-model="phyLightSaveNode.light.target.z" :step="0.1" @change="changeLight"></el-input-number>-->
<!--                    </el-tooltip>-->
<!--                  </div>-->
<!--                </div>-->
                <!-- 平行光--产生阴影、绑定相机、调节位置 -->
                <div class="directional-light-flag">
                  <!-- 产生阴影 -->
                  <div class="directional-light-flag-shadow switch-container">
                    <span>{{$t("light.castShadow")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.castShadow"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <!-- 绑定相机 -->
                  <div class="directional-light-flag-bind switch-container" v-if="isBindByPano">
                    <span>{{$t("light.bindCamera")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.isBindCamera"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <button @click="adjustPosition" :disabled="phyLightSaveNode.light.isBindCamera"  v-if="isBindByPano" class="directional-light-flag-btn">{{adjustPositionBtn}}</button>
                </div>
                <!-- 平行光--阴影斜纹 -->
                <div class="directional-light-shadow el-slider-group-parent">
                  <span>{{$t("light.bias")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.bias" :step="0.01" :min="0" :max="1" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.bias" :precision="2" :step="0.01" :min="0" :max="1" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
              </div>
              <!-- 点光源 -->
              <div v-else-if="phyLightSaveNode.type === 'pointLight' && phyLightSaveNode.light.type === 'pointLight'" class="point-light-set">
                <!-- 点光源--光色、光强 -->
                <div class="point-light-color">
                  <div class="point-light-color-item">
                    <span>{{$t("light.color")}}</span>
                    <el-color-picker color-format="rgb" v-model="phyLightSaveNode.light.color" @change="changeLight"></el-color-picker>
                  </div>
                  <div class="point-light-color-item el-slider-group-parent">
                    <span>{{$t("light.intensity")}}</span>
                    <div class="el-slider-group">
                      <el-slider v-model="phyLightSaveNode.light.intensity" :step="0.01" :min="0" :max="20"  @change="changeLight"></el-slider>
                      <el-input-number v-model="phyLightSaveNode.light.intensity" :precision="2" :step="0.01" :min="0" :max="20" @change="changeLight" label="label"></el-input-number>
                    </div>

                  </div>
                </div>
                <!-- 点光源--位置 -->
                <div class="point-light-position">
                  <span class="point-light-position-label">
                    {{$t("light.position")}}
                    <el-tooltip effect="dark" placement="top" popper-class="el-tooltip-pop" :content="description.pointLightPosition">
                      <i class="light-position-label-icon"></i>
                    </el-tooltip>
                  </span>
                  <!-- request size -->
                  <div class="point-light-position-container" v-if="size!=null">
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :max="size.max.x" 
                        :min="size.min.x" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.yPosition')">
                      <el-input-number 
                        :max="size.max.y" 
                        :min="size.min.y" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.zPosition')">
                      <el-input-number 
                        :max="size.max.z" 
                        :min="size.min.z" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                  <!--not request size-->
                  <div class="point-light-position-container" v-else>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number  
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.yPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.zPosition')">
                      <el-input-number  
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                </div>
                <!-- 点光源--衰减 -->
                <div class="point-light-decay el-slider-group-parent">
                  <span>{{$t("light.decay")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.decay" :step="0.01" :min="0" :max="10" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.decay" :precision="2" :step="0.01" :min="0" :max="10" @change="changeLight" label="label"></el-input-number>
                  </div>

                </div>
                <!-- 点光源--产生阴影、绑定相机、调节位置 -->
                <div class="point-light-flag">
                  <!-- {{$t("light.castShadow")}} -->
                  <div class="point-light-flag-shadow switch-container">
                    <span>{{$t("light.castShadow")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.castShadow"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <!-- 绑定相机 -->
                  <div class="point-light-flag-bind switch-container" v-if="isBindByPano">
                    <span>{{$t("light.bindCamera")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.isBindCamera"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <button @click="adjustPosition"  v-if="isBindByPano" class="point-light-flag-btn">{{adjustPositionBtn}}</button>
                </div>
                <!-- 点光源--阴影斜纹 -->
                <div class="point-light-shadow el-slider-group-parent">
                  <span>{{$t("light.bias")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.bias" :step="0.01" :min="0" :max="1" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.bias" :precision="2" :step="0.01" :min="0" :max="1" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
              </div>
              <!-- 聚光灯 -->
              <div v-else-if="phyLightSaveNode.type === 'spotLight' && phyLightSaveNode.light.type === 'spotLight'" class="spot-light-set">
                <!-- 聚光灯--光色、光强 -->
                <div class="spot-light-color">
                  <div class="spot-light-color-item">
                    <span>{{$t("light.color")}}</span>
                    <el-color-picker color-format="rgb" v-model="phyLightSaveNode.light.color" @change="changeLight"></el-color-picker>
                  </div>
                  <div class="spot-light-color-item el-slider-group-parent">
                    <span>{{$t("light.intensity")}}</span>
                    <div class="el-slider-group">
                      <el-slider v-model="phyLightSaveNode.light.intensity" :step="0.01" :min="0" :max="20" @change="changeLight"></el-slider>
                      <el-input-number v-model="phyLightSaveNode.light.intensity" :precision="2" :step="0.01" :min="0" :max="20" @change="changeLight" label="label"></el-input-number>
                    </div>

                  </div>
                </div>
                <!-- 聚光灯--位置 -->
                <div class="spot-light-position">
                  <span class="spot-light-position-label">
                    {{$t("light.position")}}
                    <el-tooltip effect="dark" placement="top" popper-class="el-tooltip-pop" :content="description.spotLightPosition">
                      <i class="light-position-label-icon"></i>
                    </el-tooltip>
                  </span>
                  <div class="spot-light-position-container" v-if="size!=null">
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :max="size.max.x" 
                        :min="size.min.x" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.yPosition')">
                      <el-input-number 
                        :max="size.max.y" 
                        :min="size.min.y" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.zPosition')">
                      <el-input-number 
                        :max="size.max.z" 
                        :min="size.min.z" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"></el-input-number>
                    </el-tooltip>
                  </div>
                  <div class="spot-light-position-container" v-else>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.yPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.zPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                </div>
                <!-- 聚光灯--距离 -->
                <div class="spot-light-distance el-slider-group-parent">
                  <span>{{$t("light.distance")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.distance" :step="0.1" :min="0" :max="1000" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.distance" :precision="1" :step="0.1" :min="0" :max="1000" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
                <!-- 聚光灯--衰减 -->
                <div class="spot-light-decay el-slider-group-parent">
                  <span>{{$t("light.decay")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.decay" :step="0.01" :min="0" :max="10" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.decay" :precision="2" :step="0.01" :min="0" :max="10" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
                <!-- 聚光灯--锥度 -->
                <div class="spot-light-angle el-slider-group-parent">
                  <span>{{$t("light.angle")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.angle" :step="0.01" :min="0" :max="90" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.angle" :precision="2" :step="0.01" :min="0" :max="90" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
                <!-- 聚光灯--柔和 -->
                <div class="spot-light-penumbra el-slider-group-parent">
                  <span>{{$t("light.penumbra")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.penumbra" :step="0.01" :min="0" :max="1" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.penumbra" :precision="2" :step="0.01" :min="0" :max="1" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
                <!-- 聚光灯--阴影斜纹 -->
                <div class="spot-light-shadow el-slider-group-parent">
                  <span>{{$t("light.bias")}}</span>
                  <div class="el-slider-group">
                    <el-slider v-model="phyLightSaveNode.light.bias" :step="0.01" :min="0" :max="1" @change="changeLight"></el-slider>
                    <el-input-number v-model="phyLightSaveNode.light.bias" :precision="2" :step="0.01" :min="0" :max="1" @change="changeLight" label="label"></el-input-number>
                  </div>
                </div>
                <!-- 聚光灯--产生阴影、绑定相机、调节位置 -->
                <div class="spot-light-flag">
                  <!-- 产生阴影 -->
                  <div class="spot-light-flag-shadow switch-container">
                    <span>{{$t("light.castShadow")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.castShadow"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <!-- 绑定相机 -->
                  <div class="spot-light-flag-bind switch-container" v-if="isBindByPano">
                    <span>{{$t("light.bindCamera")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.isBindCamera"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <button @click="adjustPosition" :disabled="phyLightSaveNode.light.isBindCamera"  v-if="isBindByPano" class="spot-light-flag-btn">{{adjustPositionBtn}}</button>
                </div>
              </div>
              <!-- 半球光部分 -->
              <div v-else class="hemisphere-light-set">
                <!-- 半球光--光色、光强 -->
                <div class="hemisphere-light-color">
                  <div class="hemisphere-light-color-item">
                    <span>{{$t("light.skyColor")}}</span>
                    <el-color-picker color-format="rgb" v-model="phyLightSaveNode.light.color" @change="changeLight"></el-color-picker>
                  </div>
                  <div class="hemisphere-light-color-item">
                    <span>{{$t("light.groundColor")}}</span>
                    <el-color-picker color-format="rgb" v-model="phyLightSaveNode.light.groundColor" @change="changeLight"></el-color-picker>
                  </div>
                  <div class="hemisphere-light-color-item el-slider-group-parent">
                    <span>{{$t("light.intensity")}}</span>
                    <div class="el-slider-group">
                      <el-slider v-model="phyLightSaveNode.light.intensity" :step="0.01" :min="0" :max="20" @change="changeLight"></el-slider>
                      <el-input-number v-model="phyLightSaveNode.light.intensity" :precision="2" :step="0.01" :min="0" :max="20" @change="changeLight" label="label"></el-input-number>
                    </div>
                  </div>
                </div>
                <!-- 半球光--位置 -->
                <div class="hemisphere-light-position">
                  <span class="hemisphere-light-position-label">
                    {{$t("light.position")}}
                    <el-tooltip effect="dark" placement="top" popper-class="el-tooltip-pop" :content="description.hemisphereLightPosition">
                      <i class="light-position-label-icon"></i>
                    </el-tooltip>
                  </span>
                  <div class="hemisphere-light-position-container" v-if="size!=null">
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :max="size.max.x" 
                        :min="size.min.x" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.yPosition')">
                      <el-input-number 
                        :max="size.max.y" 
                        :min="size.min.y" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.zPosition')">
                      <el-input-number 
                        :max="size.max.z" 
                        :min="size.min.z" 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                  <div class="hemisphere-light-position-container" v-else>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.xPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.x" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.yPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.y" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="top" :content="$t('light.zPosition')">
                      <el-input-number 
                        :disabled="phyLightSaveNode.light.isBindCamera" 
                        v-model="phyLightSaveNode.light.position.z" 
                        :step="0.01"
                        :precision="2" 
                        @change="changeLight"
                      ></el-input-number>
                    </el-tooltip>
                  </div>
                </div>
                <!-- 半球光--绑定相机、调节位置 -->
                <div class="hemisphere-light-flag">
                  <!-- 绑定相机 -->
                  <div class="hemisphere-light-flag-bind switch-container" v-if="isBindByPano">
                    <span>{{$t("light.bindCamera")}}</span>
                    <el-switch
                      v-model="phyLightSaveNode.light.isBindCamera"
                      active-text="ON"
                      inactive-text="OFF"
                      @change="changeLight"
                    >
                    </el-switch>
                  </div>
                  <button @click="adjustPosition" v-if="isBindByPano" class="hemisphere-light-flag-btn">{{adjustPositionBtn}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-item>
    <el-collapse-item :title="$t('light.ambientLight')">
      <!-- 环境光总容器 -->
      <div class="collapse-item-container">
        <!-- 环境光总开关 -->
        <div class="collapse-item-switch switch-container">
          <el-switch
            v-model="ambientLightMoFlag"
            @change="showAmbientLight"
            active-text="ON"
            inactive-text="OFF">
          </el-switch>
        </div>
        <!-- 环境光蒙层 -->
        <div v-if="!ambientLightMoFlag" class="mantle"></div>
        <!-- 颜色修改项 -->
        <div class="envir-collapse-item">
          <span>{{$t("light.color")}}</span>
          <el-color-picker  color-format="rgb" @change="changeAmbientLight" v-model="ambientLightMo.color" ></el-color-picker>
        </div>
        <!-- 亮度修改项 -->
        <div class="envir-collapse-item el-slider-group-parent">
          <span>{{$t("light.intensity")}}</span>
          <div class="el-slider-group">
            <el-slider v-model="ambientLightMo.intensity" :step="0.01" :min="0" :max="20" @change="changeAmbientLight"></el-slider>
            <el-input-number v-model="ambientLightMo.intensity" :precision="2" :step="0.01" :min="0" :max="20" @change="changeAmbientLight" label="label"></el-input-number>
          </div>

        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</div>

</template>

<script>
// 设置每种类型灯光要配置的参数
import {
  // 光对象
  directionalLightPro,  // 平行光
  pointLightPro,  // 点光源
  spotLightPro,  // 聚光灯
  hemisphereLightPro, // 半球光
  ambientLightPro, //环境光
  // 光文字
  directionalLight,
  pointLight,
  spotLight,
  hemisphereLight,
  ambientLight,
  filePrefix,
  image,
  getLightType,
  description // 文字描述对象
  } from "@/utils/global";

export default {
  name: "Light",//渲染里调节灯光的组件
  props: {
    isBindByPano: {
      type: Boolean,
      require: true
    },
    lights:{ //场景中一开始的灯光
      type: Object,
      default () {
        return {}
      }
    },
    position:{
      type: Object,
      default () {
        return null
      }
    },
    size: {
      type: Object
    }
  },
  computed: {
    getPhyType() {
      return function (type) {
        return getLightType(type)
      }
    }
  },
  created() {

    if (this.position != null) {
      this.initPosition()
    }
    // 构建物理光
    var phyLightSave=this.lights.phyLightSave
    for(var i=0;i<phyLightSave.length;i++){
      this.phyLightObjArr[i].light=phyLightSave[i]
      if (phyLightSave[i]!=null) {
        this.phyLightObjArr[i].type = phyLightSave[i].type
      }
    }
    this.phyLightFlag=this.lights.lightsOn
    this.ambientLightMoFlag=this.lights.ambientLightOn
    this.ambientLightMo=this.lights.ambientLightSave
  },
  data() {
    return {
      // 调节关位置按钮文字
      adjustPositionBtn: '',
      // 文字描述对象
      description: description,
      phyLightSaveNode: null,
      // 物理光总开关
      phyLightFlag: true,
      // 环境光总开关
      ambientLightMoFlag: true,
      // 环境光对象
      phyLightIndex: null,
      phyLightType: null,
      // 物理光绑定的三个对象数组
      phyLightObjArr: [
        {
          index: 0,
          type: null,
          light: null
        },
        {
          index: 1,
          type: null,
          light: null
        },
        {
          index: 2,
          type: null,
          light: null
        }
      ],
      phyLightSelect: [
        {
          type: null,
          light: null,
          description: description.unsetLightDes
        },
        {
          type: directionalLight,
          light: Object.assign({}, directionalLightPro),
          description: description.directionalLightDes
        },
        {
          type: pointLight,
          light: Object.assign({}, pointLightPro),
          description: description.pointLightDes
        },
        {
          type: spotLight,
          light: Object.assign({}, spotLightPro),
          description: description.spotLightDes
        },
        {
          type: hemisphereLight,
          light: Object.assign({}, hemisphereLightPro),
          description: description.hemisphereLightDes
        }
      ]
    }
  },
  watch: {
    'phyLightSaveNode.light.lightPositionFlag' (val) {
      this.adjustPositionBtn = val ? this.$t('adjustPostionHiden') : this.$t('adjustPostionShow');
    }
  },
  methods: {
    adjustPosition() {
      this.phyLightSaveNode.light.lightPositionFlag = this.phyLightSaveNode.light.lightPositionFlag ? false : true;
      this.$emit('adjustPosition', this.phyLightSaveNode)
    },
    initPosition() {
      const that = this
      // phyLightSelect
      this.phyLightSelect.forEach(item => {
        item.type != null && (item.light.position = Object.assign({}, that.position))
      })
    },
    addPhyLight(e) {
      this.phyLightSaveNode = this.phyLightObjArr[e]
    },
    selectPhyLight(e) {
      this.phyLightSaveNode.light = JSON.parse(JSON.stringify(this.getLightByType(e)))
      // 根据光的参数在场景中清楚第i个光重新构建
      this.$emit('changeLight', this.phyLightSaveNode)
    },
    getLightByType(type) {
      if (typeof type === 'object') {
        return null
      }
      for (let item of this.phyLightSelect) {
        if (type === item.type) {
          return item.light
        }
      }
    },
    // 更改平行光
    changeLight() {
      this.$emit('changeLight', this.phyLightSaveNode)
    },
    // 更改环境光的参数
    changeAmbientLight(){
      this.$emit('changeAmbient',this.ambientLightMo)
    },
    showPhysicalLight(){
      this.$emit('showPhysicalLight',this.phyLightFlag)
    },
    showAmbientLight(){
      this.$emit('showAmbientLight',this.ambientLightMoFlag)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
// 折叠栏修改默认样式
@include el-collapse;
// 物理光选择头部
@include phy-header;
// 折叠栏对应开关定位
.collapse-item-switch {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 2000;
}
// 修改开关的默认样式
@include render-switch;
// 侧边栏按钮默认样式
@include render-button;
// 蒙层div
@include render-mantle;

// 物理光选择主体
.phy-body {
  width: 95%;
  margin: 5px auto;
  // 标题span
  .phy-body-label {
    width: 100%;
    height: 25px;
    line-height: 25px;
    display: inline-block;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #616161;
    padding-left: 5px;
  }
  // 选择体部分
  .phy-body-container {
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: #777;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    // 选择光单选框
    .phy-body-radio {
      @include render-collapse-select-radio;
    }
    // 物理光设置
    .phy-body-set {
      width: 95%;
      margin: 0 auto;
    }
  }
}
// phy-body-set下
// 物理光设置各主container及公共样式修改
.directional-light-set,
.point-light-set,
.spot-light-set,
.hemisphere-light-set {
  width: 100%;
  // 颜色选择
  @include render-collapse-color-picker;
  // 调节位置的数字输入框
  @include render-position-input-number;
  // 位置旁边的问号图标
  @include render-position-icon;
}
@include render-position-input-number;

// phy-body-set下
// 平行光部分 .directional-light-set下的每个部分
// 平行光颜色强度部分
.directional-light-color {
  width: 100%;
  // 颜色、强度的每一项
  .directional-light-color-item {
    width: 100%;
    @include flex-align-center;
    // 滑块整体--文字水平形式
    @include render-slider-group-space;
  }
}
// 平行光位置
.directional-light-position {
  span.directional-light-position-label {
    position: relative;
  }
  width: 100%;
  margin-top: 6px;
  padding-bottom: 5px;
  border-bottom: 2px solid #444;
  // x,y,z位置容器
  .directional-light-position-container {
    width: 100%;
    margin-top: 5px;
    @include flex-just-spacearound;
  }
}
// 平行光两个开关及按钮
.directional-light-flag {
  width: 100%;
  margin-top: 6px;
  // 产生阴影
  .directional-light-flag-shadow,
  .directional-light-flag-bind {
    width: 100%;
    padding-top: 5px;
    @include flex-just-spacebetween;
  }
}
// 平行光阴影斜纹
.directional-light-shadow {
  width: 100%;
  // padding-top: 5px;
  // 滑块整体--文字上下形式
  @include render-slider-group-align;
}


// phy-body-set下
// 点光源部分 .point-light-set下的每个部分
// 点光源颜色强度部分
.point-light-color {
  width: 100%;
  // 颜色、强度的每一项
  .point-light-color-item {
    width: 100%;
    display: flex;
    align-items: center;
    // 滑块整体--文字水平形式
    @include render-slider-group-space;
  }
}
// 点光源位置
.point-light-position {
  span.point-light-position-label {
    position: relative;
  }
  width: 100%;
  margin-top: 6px;
  padding-bottom: 5px;
  border-bottom: 2px solid #444;
  // x,y,z位置容器
  .point-light-position-container {
    width: 100%;
    margin-top: 5px;
    @include flex-just-spacearound;
  }
}
// 点光源衰减
.point-light-decay {
  width: 100%;
  // padding-top: 5px;
  // 滑块整体--文字上下形式
  @include render-slider-group-align;
}
// 点光源两个开关及按钮
.point-light-flag {
  width: 100%;
  margin-top: 6px;
  // 产生阴影
  .point-light-flag-shadow,
  .point-light-flag-bind {
    width: 100%;
    padding-top: 5px;
    @include flex-just-spacebetween;
  }
}
// 点光源阴影斜纹
.point-light-shadow {
  width: 100%;
  // padding-top: 5px;
  // 滑块整体--文字上下形式
  @include render-slider-group-align;
}

// phy-body-set下
// 聚光灯部分 .spot-light-set下
// 聚光灯颜色强度部分
.spot-light-color {
  width: 100%;
  // 颜色、强度的每一项
  .spot-light-color-item {
    width: 100%;
    display: flex;
    align-items: center;
    // 滑块整体--文字水平形式
    @include render-slider-group-space;
  }
}
// 聚光灯位置
.spot-light-position {
  span.spot-light-position-label {
    position: relative;
  }
  width: 100%;
  margin-top: 6px;
  padding-bottom: 5px;
  border-bottom: 2px solid #444;
  // x,y,z位置容器
  .spot-light-position-container {
    width: 100%;
    margin-top: 5px;
    @include flex-just-spacearound;
  }
}
// 聚光灯衰减等四个滑块
.spot-light-distance,
.spot-light-decay,
.spot-light-angle,
.spot-light-penumbra,
.spot-light-shadow {
  width: 100%;
  padding-top: 5px;
  // 滑块整体--文字上下形式
  @include render-slider-group-align;
}
// 聚光灯两个开关及按钮
.spot-light-flag {
  width: 100%;
  margin-top: 6px;
  // 产生阴影
  .spot-light-flag-shadow,
  .spot-light-flag-bind {
    width: 100%;
    padding-top: 5px;
    @include flex-just-spacebetween;
  }
}

// phy-body-set下
// 半球光部分 .hemisphere-light-set下
// 半球光 颜色强度部分
.hemisphere-light-color {
  width: 100%;
  // 颜色、强度的每一项
  .hemisphere-light-color-item {
    margin-top: 2px;
    width: 100%;
    display: flex;
    align-items: center;
    @include flex-align-center;
    // 滑块整体--文字水平形式
    @include render-slider-group-space;
  }
}
// 半球光位置
.hemisphere-light-position {
  span.hemisphere-light-position-label {
    position: relative;
  }
  width: 100%;
  margin-top: 6px;
  // background-color: yellow;
  padding-bottom: 5px;
  border-bottom: 2px solid #444;
  // x,y,z位置容器
  .hemisphere-light-position-container {
    width: 100%;
    margin-top: 5px;
    @include flex-just-spacearound;
  }
}
// 半球光开关及按钮
.hemisphere-light-flag {
  width: 100%;
  margin-top: 6px;
  // 产生阴影
  .hemisphere-light-flag-bind {
    width: 100%;
    display: flex;
    padding-top: 5px;
    justify-content: space-between;
    @include flex-just-spacebetween;
  }
}

// 环境光单个修改项
.envir-collapse-item {
  display: flex;
  flex-direction: column;
  padding: 5px 0 5px 5px;
  // 滑块整体
  @include render-slider-group-align;
}
</style>
