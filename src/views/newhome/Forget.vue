  <template>
    <div style="height: 100%">
      <div class="navbar">
        <div class="nav-left">
          <el-image src="./favicon.ico"></el-image>
        </div>
      </div>
      <div class="main">
       <div class="forgot-password">
          <el-steps :active="active" :space="200" finish-status="success">
            <el-step title="手机验证"></el-step>
            <el-step title="重置密码"></el-step>
            <el-step title="完成设置"></el-step>
          </el-steps>
          <div v-if="active=='0'">
            <el-form ref="verificationForm" :model="phoneAccount"  :rules="rules" class="demo-ruleForm" @submit.native.prevent>
              <el-form-item prop="phone" label="手机号">
                <el-input v-model="phoneAccount.phone" type="text" placeholder="手机号">
                </el-input>
              </el-form-item>
              <el-form-item prop="code" label="验证码">
                <el-input v-model="phoneAccount.code" type="text" placeholder="不超过10个字符">
                </el-input>
              </el-form-item>
            </el-form>
            <!--            <el-button style="margin-top: 12px;" @click="checkSecurityQuestion">下一步</el-button>-->
            <div class="btn-wr">
              <button type="button" class="login-btn" @click.prevent="next">下一步 <i class="el-icon-arrow-right" ></i></button>
            </div>
          </div>
          <div v-if="active=='1'">
            <el-form ref="forgotPasswordForm" :model="PasswordForm" class="demo-ruleForm" @submit.native.prevent>
              <el-form-item prop="pwd" label ="密码:">
                <el-input v-model="PasswordForm.pwd" type="password" placeholder="6-16位大小写字母+数字组合" auto-complete="off" >
                </el-input>
              </el-form-item>
              <el-form-item prop="confirmPwd" label ="确认密码:">
                <el-input v-model="PasswordForm.confirmPwd" placeholder="重复密码" type="password">
                </el-input>
              </el-form-item>
            </el-form>
            <div class="btn-wr">
              <button type="button" class="login-btn" @click.prevent="next">确认 <i class="el-icon-arrow-right" ></i></button>
            </div>
          </div>
          <div v-if="active=='2'">
            <div class="reset-success">
              <!--                <img src="../index/assets/images/success.png" alt="">-->
              <p class="set-success">设置成功，去登录</p>
            </div>
            <div class="btn-wr">
              <button type="button" class="login-btn">登录 <i class="el-icon-arrow-right" ></i></button>
            </div>
          </div>
       </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "Forget",
  data(){
    return {
      active: 0,
      phoneAccount:{
        phone:"",
        code:''
      },
      PasswordForm:{
        pwd:'',
        confirmPwd:''
      },
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号，不能为空',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码，不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods:{
     next(){
      this.active++
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
    .forgot-password{
      .return-page-wr{
        position: relative;
        top: 30px;
        left: 30px;
        color: #e5525b;
        font-size: 16px;
        margin-bottom: 15px;
        i{
          font-size: 20px;
          vertical-align: middle;
        }
      }
      width:580px;
      height:540px;
      background: #FFFFFF;
      border-radius: 6px;
      margin-left: 500px;
      .content{
        padding: 30px 90px;
        box-sizing: border-box;
      }

      /deep/.el-step.is-horizontal{
        .el-step__line{
          height: 2px;
          top: 20px;
          left: 48px;
          right: 10px;
        }
      }
      /deep/.el-step__icon{
        width: 42px;
        height: 42px;
        color: #2489f3;
        font-size: 18px;
        border: 2px solid #2489f3;
      }
      /deep/.el-step__line{
        background: #2489f3;
      }
      /deep/.is-process{
        .el-step__icon{
          background: #2489f3;
          color: #FFFFFF;
          border: 0px;

        }
      }
      /deep/.el-step__head{
        margin-bottom: 20px;
      }
      /deep/.el-step__title.is-process{
        color: #2489f3;
      }


      /deep/.el-form-item__label{
        width: 100%;
        text-align: left;
      }
      /deep/.el-form-item__content{
        display: inline-block;
        width: 100%;
        margin-left: 0px;
      }
    }
    .btn-wr{
      text-align: center;
    }
    .reset-success{
      text-align: center;
      margin: 60px 0;
    }
    .set-success{
      margin-top: 20px;
      font-weight: 600;
    }
    .login-btn{
      width: 200px;
      height:50px;
      text-align: center;
      line-height: 50px;
      margin:0 auto;
      background: #2489f3;
      font-weight: 600;
      font-size: 16px;
      color: #FFFFFF;
      border-radius: 4px;
      i{
        right: -50px;
        font-size: 27px;
        position: relative;
        vertical-align: middle;
      }
    }
  }

  </style>

