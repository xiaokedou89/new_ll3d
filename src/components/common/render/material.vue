<template>
  <div class="tabs-item-container">
    <slot name="material-select-obj"></slot>
    <!-- 选择材质部分 -->
    <div class="material-select" v-if="collapseFlag">
      <el-select v-model="materialType" :placeholder="$t('material.label')" @change="selectMaterial">
        <el-option
          v-for="(item, index) in materialArr"
          :key="index"
          :label="item.name"
          :value="item.type"
        />
      </el-select>
    </div>
    <!-- 贴图设置折叠区部分 -->
    <el-collapse accordion v-if="collapseFlag">
        <el-collapse-item :title="$t('map.basic')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="true"
              :mapCategory="mapTypeObj.basic"
              :map="materialSaveNode.basic"
              @changeMap="changeMap"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="materialType !== 'normal'" :title="$t('map.specular')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="excludeMaterialType('lambert')"
              :mapCategory="mapTypeObj.specular"
              :map="materialSaveNode.specular"
              @changeMap="changeMap"
            />
            <!-- 反射强度设置 -->
            <div class="material-set el-slider-group-parent" v-if="excludeMaterialType('lambert')">
              <span>{{ $t("map.shininess") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.specular.shininess" :step="1" :min="0" :max="200" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.specular.shininess" :precision="0" :step="1" :min="0" :max="200" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="$t('map.emissive')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="true"
              :mapCategory="mapTypeObj.emissive"
              :map="materialSaveNode.emissive"
              @changeMap="changeMap"
            />
            <!-- 高光强度设置 -->
            <div class="material-set el-slider-group-parent" v-if="excludeMaterialType('lambert')">
              <span>{{ $t("map.emissiveIntensity") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.emissive.emissiveIntensity" :step="0.1" :min="0" :max="10" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.emissive.emissiveIntensity" :precision="1" :step="0.1" :min="0" :max="10" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="materialType !== 'lambert'" :title="$t('map.bump')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.bump"
              :map="materialSaveNode.bump"
              @changeMap="changeMap"
            />
            <!-- 高度值设置 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.bumpScale") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.bump.bumpScale" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.bump.bumpScale" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="$t('map.ao')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.ao"
              :map="materialSaveNode.ao"
              @changeMap="changeMap"
            />
            <!-- ao强度设置 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.intensity") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.ao.aoMapIntensity" :step="0.01" :min="0" :max="10" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.ao.aoMapIntensity" :precision="2" :step="0.01" :min="0" :max="10" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="$t('map.light')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.light"
              :map="materialSaveNode.light"
              @changeMap="changeMap"
            />
            <!-- 强度设置 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.intensity") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.light.lightMapIntensity" :step="0.01" :min="0" :max="100" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.light.lightMapIntensity" :precision="2" :step="0.01" :min="0" :max="100" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="materialType !== 'lambert'" :title="$t('map.normal')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.normal"
              :map="materialSaveNode.normal"
              @changeMap="changeMap"
            />
            <!-- 法向深度-x -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.normalScaleX") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.normal.normalScale.x" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.normal.normalScale.x" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
            <!-- 法向深度-y -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.normalScaleY") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.normal.normalScale.y" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.normal.normalScale.y" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="materialType !== 'lambert'" :title="$t('map.displacement')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.displacement"
              :map="materialSaveNode.displacement"
              @changeMap="changeMap"
            />
            <!-- 位移值 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.displacementScale") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.displacement.displacementScale" :step="0.1" :min="-10" :max="10" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.displacement.displacementScale" :precision="1" :step="0.1" :min="-10" :max="10" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
            <!-- 偏移量 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.displacementBias") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.displacement.displacementBias" :step="0.1" :min="-1" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.displacement.displacementBias" :precision="1" :step="0.1" :min="-1" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item  :title="$t('map.alpha')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.alpha"
              :map="materialSaveNode.alpha"
              @changeMap="changeMap"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item :title="$t('map.env')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.env"
              :map="materialSaveNode.env"
              @changeMap="changeMap"
            />
            <!-- 显示类型 -->
            <div class="material-set-flex">
              <span class="material-set-radio-title">{{ $t("map.showType") }}</span>
              <div class="material-set-radio">
                <el-radio v-model="materialSaveNode.env.envMapShowType" :label="item.type" v-for="(item, index) in envMapShowTypeArr" :key="index" @change="changeMaterial">
                  {{ item.label }}
                </el-radio>
              </div>
            </div>
            <!-- 映射方式 -->
            <div class="material-set-flex">
              <span class="material-set-radio-title">{{ $t("map.typeSet") }}</span>
              <div class="material-set-radio">
                <el-radio v-model="materialSaveNode.env.envMapTypeSet" :label="item.type" v-for="(item, index) in envMapTypeSetArr" :key="index" @change="changeMaterial">
                  {{ item.label }}
                </el-radio>
              </div>
            </div>
            <!-- 组合 -->
            <div class="material-set-flex">
              <span class="material-set-radio-title">{{ $t("map.combine") }}</span>
              <div class="material-set-radio">
                <el-radio v-model="materialSaveNode.env.combine" :label="item.type" v-for="(item, index) in combineArr" :key="index" @change="changeMaterial">
                  {{ item.label }}
                </el-radio>
              </div>
            </div>
            <!-- 反射率 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.reflectivity") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.env.reflectivity" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.env.reflectivity" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
            <!-- 折射率 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.refactionRation") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.env.refactionRation" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.env.refactionRation" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="materialType === 'normal'" :title="$t('map.metalness')">
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.metalness"
              :map="materialSaveNode.metalness"
              @changeMap="changeMap"
            />
            <!-- 金属性强度 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.metalness") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.metalness.metalness" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.metalness.metalness" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="materialType === 'normal'" :title="$t('map.roughness')" >
          <div class="collapse-item-container">
            <mesh-map
              :hasColor="false"
              :mapCategory="mapTypeObj.roughness"
              :map="materialSaveNode.roughness"
              @changeMap="changeMap"
            />
            <!-- 粗糙度 -->
            <div class="material-set el-slider-group-parent">
              <span>{{ $t("map.roughness") }}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.roughness.roughness" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.roughness.roughness" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item  :title="$t('map.surface')" >
          <div class="collapse-item-container">
            <!-- 渲染表面 -->
            <div class="material-set-flex">
              <span class="material-set-radio-title">{{$t("map.surface")}}</span>
              <div class="material-set-radio">
                <el-radio v-model="materialSaveNode.surface" :label="item.type" v-for="(item, index) in surfaceArr" :key="index" @change="changeMaterial">
                  {{ item.label }}
                </el-radio>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item  :title="$t('map.opacity')" >
          <div class="collapse-item-container">
            <!-- 不透明度 -->
            <div class="material-set el-slider-group-parent">
              <span>{{$t("map.opacity")}}</span>
              <div class="el-slider-group">
                <el-slider v-model="materialSaveNode.opacity" :step="0.01" :min="0" :max="1" @change="changeMaterial"></el-slider>
                <el-input-number v-model="materialSaveNode.opacity" :precision="2" :step="0.01" :min="0" :max="1" @change="changeMaterial" label="label"></el-input-number>
              </div>
            </div>
          </div>
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import meshMap from '@/components/common/render/meshMap.vue'
import { mapType, defaultPhong, defaultNormal, defaultLambert } from '@/utils/global'

export default {
  name: 'material',
  components: {
    meshMap
  },
  props: {
    // 传入的材质类型
    materialTypeProp: {
      type: String,
      default: 'normal',
      require: true
    },
    // 传入的材质对象
    material: {
      type: Object,
      default() {
        return JSON.parse(JSON.stringify(defaultNormal))
      }
    },
    flag:{ // 模型为空的时候不显示下面的编辑内容
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      collapseFlag: true,
      // 贴图类型常量对象
      mapTypeObj: null,
      // 材质单选框绑定变量
      materialType: null,
      // 材质单选框遍历数组
      materialArr: [
        {
          name: this.$t("material.phong"),
          type: 'phong',
          material: JSON.parse(JSON.stringify(defaultPhong))
        },
        {
          name: this.$t("material.physical"),
          type: 'normal',
          material: JSON.parse(JSON.stringify(defaultNormal))
        },
        {
          name: this.$t("material.lambert"),
          type: 'lambert',
          material: JSON.parse(JSON.stringify(defaultLambert))
        }
      ],
      // 选择设置的材质对象
      materialSaveNode: null,
      // 环境光单选显示类型绑定数组
      envMapShowTypeArr: [
        {
          type: 0,
          label: this.$t("material.forbid")
        },
        {
          type: 1,
          label: this.$t("material.flexible")
        },
        {
          type: 2,
          label: this.$t("material.constraint")
        }
      ],
      // 环境光单选映射方式绑定数组
      envMapTypeSetArr: [
        {
          type: 0,
          label: this.$t("material.refraction")
        },
        {
          type: 1,
          label: this.$t("material.reflection")
        }
      ],
      // 环境光单选组合组合绑定数组
      combineArr: [
        {
          type: 0,
          label: this.$t("material.multiplication")
        },
        {
          type: 1,
          label: this.$t("material.mixture")
        },
        {
          type: 2,
          label: this.$t("material.add")
        }
      ],
      // 单选组合渲染表面绑定数组
      surfaceArr: [
        {
          type: 0,
          label: this.$t("material.doubleSurface")
        },
        {
          type: 1,
          label: this.$t("material.innerSurface")
        },
        {
          type: 2,
          label:this.$t("material.outerSurface")
        }
      ]
    }
  },
  created() {

    // 初始化贴图类型常量对象
    this.mapTypeObj = mapType
    // 初始化材质类型
    this.materialType = this.materialTypeProp
    // 初始化材质对象
    this.material !== null && (this.materialSaveNode = this.material)

  },
  watch: {
    material(val) {
      val !== null && (this.materialSaveNode = val)
      this.materialSaveNode=val
    },
    materialTypeProp(val){
      this.materialType = val
    },
    flag(val) {
      if (val === true) {
        this.collapseFlag = true
      } else {
        this.collapseFlag = false
      }
    }
  },
  methods: {
    // 排除materialType的判断函数
    excludeMaterialType(type) {
      let flag = true
      if (this.materialType === type) {
        flag = false
      }
      return flag
    },
    // 材质单选框值改变事件
    selectMaterial(e) {

      for (const item of this.materialArr) {
        if (e === item.type) {

          this.materialSaveNode = JSON.parse(JSON.stringify(item.material))
        }
      }
      this.changeMaterial()
    },
    // 接收meshMap组件发射的贴图对象改变事件
    changeMap(type, meshMap) {
      this.materialSaveNode[type] = Object.assign(this.materialSaveNode[type], meshMap.map)
      this.changeMaterial()
    },
    // 改变值发射事件
    changeMaterial() {
      this.$emit('changeMaterial', this.materialType, this.materialSaveNode)
    }
  }
}
</script>
<style lang="scss" scoped>
// 插槽容器
.material-select-obj {
  width: 100%;
}
// 选择材质下拉选择框部分
.material-select {
  width: 100%;
  padding: 12px 8px;
  border-bottom: 1px solid #000;
  .el-select {
    width: 100%;
  }
}
// 折叠区部分
.el-collapse {
  color: #fff;
  border: 0;
  // 折叠栏--头部
  .el-collapse-item::v-deep .el-collapse-item__header {
    color: #fff;
    // background-color: transparent;
    background-color: rgb(100, 100, 100);
    height: 30px;
    border-bottom: 1px solid #000;
    padding-left: 5px;
  }
  // 折叠栏--内容
  .el-collapse-item::v-deep .el-collapse-item__wrap {
    background: rgba(151, 149, 149, 0.8);
    border-bottom: 1px solid #000;
    border-left: 1px solid #000;
    .el-collapse-item__content {
      color: #fff;
      // 为了蒙层去掉el-collapse-item__content底部的25padding
      padding: 0;
      // 总容器---折叠栏主体
      .collapse-item-container {
        position: relative;
        color: #fff;
        // 为了蒙层修改el-collapse-item__content底部的25padding
        padding-bottom: 25px;
        // 材质的其他贴图设置区域
        .material-set {
          width: 95%;
          margin: 0 auto;
          padding-top: 10px;
          // 滑块整体 小
          .el-slider-group {
            width: 100%;
            padding-right: 12px;
            display: flex;
            align-items: center;
            // 滑块
            .el-slider {
              width: 100%;
              padding: 0 10px;
            }
            .el-input-number {
              width: 12%;
            }
          }
        }
        // 材质其他贴图设置flex模式
        .material-set-flex {
          width: 95%;
          margin: 10px auto 0;
          display: flex;
          align-items: center;
          // background-color: pink;
          span.material-set-radio-title {
            width: 25%;
          }
          // 单选框修改
          .material-set-radio {
            display: flex;
            width: 70%;
            // background-color: red;
            border-radius: 4px;
            overflow: hidden;
            // 单选框每项
            label.el-radio {
              // width: 20%;
              flex: 1;
              height: 30px;
              margin: 0;
              // 单选圆圈
              span.el-radio__input {
                display: none;
              }
              // 单选文字
              span.el-radio__label {
                padding: 0;
                display: block;
                height: 30px;
                line-height: 30px;
                color: #fff;
                text-align: center;
                background-color: rgba(59, 59, 59);
              }
              // 单选文字悬停
              span.el-radio__label:hover {
                background-color: rgba(59, 59, 59, .5);
              }
            }
            // 单选框每项--选中
            label.el-radio.is-checked span.el-radio__label {
              background-color: #0c0c0c;
              color: #2489f3;
            }
          }
        }
      }
    }
  }
}


.material-select::v-deep .el-input__inner {
  height: 32px;
  background-color: #3b3b3b;
  color: #fff;
  border: none;
}
.material-select::v-deep .el-input__icon {
  line-height: 32px;
}

.el-slider-group-parent .el-slider-group::v-deep .el-input-number {
  width: 12%;
  line-height: 30px;
}
.el-slider-group-parent .el-slider-group::v-deep .el-input-number span {
  display: none;
}
.el-slider-group-parent .el-slider-group::v-deep .el-input__inner {
  background-color: #333;
  font-size: 12px;
  width: 40px;
  height: 28px;
  padding: 4px;
  color: #fff;
  border: none;
}
</style>
