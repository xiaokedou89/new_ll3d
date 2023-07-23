<template>
<div style="height: 100%">
  <div class="navbar">
    <div class="nav-left">
      <el-image src="./favicon.ico"></el-image>
    </div>
  </div>
  <div class="main">
<!--    <div class="login">-->
      <el-form ref="form" :model="ruleForm" :rules="rules" class="login-box">
        <h3 class="login-title">登录</h3>
        <el-form-item label="账号" prop="name">
          <el-input type="text" placeholder="请输入用户名" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"><el-button type="text" style="float: right" @click="toForget">忘记密码</el-button>
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
        </el-form-item>
        <div class="txt">第三方登录</div>
        <div class="otherLogo">
          <div class="login-social-item bg1">
<!--            <el-image src="./QQ.png"></el-image>-->
          </div>
        </div>
        <div class="txt">没有账号,<el-button type="text" @click="toRegedist">免费注册</el-button></div>
      </el-form>
    </div>
<!--  </div>-->
</div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm:{
        name:null,
        password:null
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称，不能为空',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入名称，不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },  methods: {
    toForget(){
      this.$router.push({
        path: '/forget'
      })
    },
    toRegedist(){
      this.$router.push({
        path: '/regedist'
      })
    }
  }
}
</script>

<style scoped>
.navbar{
  color: #fff;
  text-decoration: none;
  background-color: #222;
  border-color: transparent;
  height: 60px;
  top: 0;
  border-width: 0 0 1px;
}
.nav-left{
  float: left !important;
}
.main{
  background-color: #2d2e31;
  width: 100%;
  height: 100%;
  /*margin-top:60px;*/
  transform: translate(0px, 0);
  transition: transform 0.15s ease-in-out 0s, -webkit-transform 0.15s ease-in-out 0s;
}
.login{
  width: 382px;
  position:absolute;
  padding: 80px;
  position:absolute;
  left:50%;    /* 定位父级的50% */
  top:50%;
  transform: translate(-50%,-70%); /*自己的50% */
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}
.login-box {
  background: #ffffff;
  width: 350px;
  margin-left: 50%;
  border: 1px solid #DCDFE6;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 30px #DCDFE6;
}

.login-title {
  text-align: center;
}
.txt{
  font-family: Poppins-Regular;
  font-size: 14px;
  line-height: 1.5;
  color: #666666;

}
.otherLogo{
  justify-content: center;
  display: flex;
  align-items: center;
}
.login-social-item {
  font-size: 25px;
  color: #fff;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 5px;
}

.login-social-item:hover {
  color: #fff;
  background-color: #333333;
}
.bg1 {background-color: #3b5998}
.bg2 {background-color: #1da1f2}
.bg3 {background-color: #ea4335}
</style>
