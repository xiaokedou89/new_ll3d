<template>
<div class="nav-bar">
<div class="nav-container">
<el-menu
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#222"
    text-color="#fff"
    active-text-color="#ffd04b">
<el-submenu v-for="item in menulist" index="item.parent.id">
  <template slot="title">{{item.parent.name}}</template>
  <el-menu-item v-for="child in item.childList">{{child.name}}</el-menu-item>
</el-submenu>
</el-menu>
<!--  navbar 上的搜索框区域-->
  <div class="search-input">
    <el-input
        size="small"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        >
    </el-input>
    <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
  </div>
<!--  navbar 右侧按钮组-->
  <div class="button-group">
    <el-button size="small" type="primary">模型<i class="el-icon-upload el-icon--left"></i></el-button>
    <el-button size="small" type="primary">全景<i class="el-icon-upload el-icon--left"></i></el-button>
    <el-button size="small" type="primary">webar<i class="el-icon-upload el-icon--left"></i></el-button>
    <el-button size="small" @click="toLogin" type="warning">登录</el-button>
  </div>
</div>
</div>
</template>
<script>
import {getMenuList} from "@/api/news/news";

export default {
  name: 'NavBarBak',
  data() {
    return {
      menulist:[]
    };
  },
  created() {
    // console.log('this menu')
    this.getList()
  },
  methods: {
    // 获取菜单列表，在navbar上显示
    getList(){
      getMenuList("news",null) .then(res => {
        if(res.data!=""&&res.data!=null){
          this.menulist=res.data
        }
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 跳转到登录页面
    toLogin(){
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
<style>
.nav-bar .el-submenu__title{
  padding: 0;
  margin-right: 8px;
}
.nav-bar .el-menu--horizontal>.el-submenu .el-submenu__icon-arrow {
  margin-left: 0;
}
.nav-bar .el-input {
   width: auto;
}
</style>
<style lang="scss" scoped>
.nav-bar {
  height: 60px;
  width: 100%;
  background-color: #222;
}

.nav-container {
  display: flex;
  width: 85%;
  height: 100%;
  margin: 0 auto;
}

.search-input{
  margin-top:12px;
  margin-bottom: 15px;
}
.search-input el-input{
  margin-right: 15px;
  width:80px;
}
.button-group{
  margin-top: 12px;
  margin-left: 20px;
}
</style>
