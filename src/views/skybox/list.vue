<template>
  <div class="skybox-list">
    <div class="vild-container" v-if="list.length === 0"> {{$t("noData")}}</div>
    <div class="skybox-list-container" v-else>
      <listitem
          class="skybox-list-item"
          v-for="(item, index) in list"
          :key="index"
          :id="item.id"
          :src="item.thumb"
          :title="item.name"
          :isAr="isAr"
          :url="url"
          :updataTime="item.createTime"
          @delItem="del(item.id)"
      ></listitem>
    </div>
    <div class="skybox-list-footer">
      <el-button :loading="btnFlag" type="primary" @click="updataList"> {{$t("toViewMore")}}</el-button>
    </div>
  </div>
</template>
<script>
import listitem from '@/components/common/listItem/listitem.vue'
import * as api from '@/api/skybox/skybox.js'

const params = {
  pkId: 0,
  size: 8
}

export default {
  name: 'ArList',
  components: {
    listitem
  },
  data() {
    return {
      // 拉取数据防抖开关
      flag: false,
      params: Object.assign({}, params),
      // 拉取数据方式 0为初始化 1为按钮点击加载
      getType: 0,
      // 按钮点击加载开关
      btnFlag: false,
      // listItem设置图标显示开关
      isAr: true,
      // 模拟的列表数量
      modelNum: 8,
      // 点击item跳转的路由
      url: '/skyboxEditor',
      // url: '/vrmodelEditor',
      list: []
    }
  },
  created() {
    this.initList(this.params)
  },
  methods: {
    // 拉取列表数据
    initList() {
      if (this.flag) {
        return
      }
      if (this.getType === 1) {
        this.btnFlag = true
      }
      this.flag = true
      api.getSkyboxList(this.params)
          .then(res => {
            this.flag = false
            this.btnFlag = false
            if (res.data !== null && res.data.length > 0) {
              const arr = res.data
              this.params.pkId = arr[arr.length - 1].id
              this.list = [...this.list,...arr]
            } else {
              this.$message({
                message: this.$t("noMore"),
                type: 'warning',
                duration: 1500
              })
            }
          })
          .catch(err => {
            this.falg = false
            this.btnFlag = false
            this.$message({
              message: err,
              type: 'error',
              duration: 1500
            })
          })
    },
    // 点击查看更多事件
    updataList() {
      this.getType = 1
      this.initList()
    },
    linkToDetail() {
      this.$router.push('/vrmodelEditor')
    },
    del(id) {
      api.deletePanorama(id) .then(res => {
        this.list.splice(this.getIndex(id), 1)
      })
    },
    getIndex(id) {
      for (let [index,item] of this.list.entries()) {
        if (item.id === id) {
          return index
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// 容器
.skybox-list {
  width: 85%;
  height: 100%;
  margin: 0 auto;
  padding-top: 20px;
  .vild-container {
    width: 100%;
    height: 420px;

    //margin-top: 20px;
    border: 1px dashed #ccc;
    border-radius: 15px;
    line-height: 420px;
    text-align: center;
    font-size: 28px;
    color: #ccc;
  }
  // 列表主体
  .skybox-list-container {
    width: 100%;
    height: 420px;
    overflow-y: auto;
    // margin-top: 20px;
    padding-top: 20px;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    // 列表项
    .skybox-list-item {
      width: 22%;
      height: 180px;
      margin-left: 30px;
      border: 1px solid rgb(233,150,5);
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 3px -1px rgb(233,150,25);
      margin-top: 20px;
    }
  }
  // 修改主体滚动条
  .skybox-list-container::-webkit-scrollbar {
    width: 5px;
    background-color: rgb(37, 35, 35, .8);
    border-radius: 8px;
  }
  .skybox-list-container::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
  // 底部按钮
  .skybox-list-footer {
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

</style>
