<template>
  <el-form
    :rules="rules"
    class="login-container"
    label-position="left"
    label-width="0px"
    v-loading="loading"
  >
    <h3 class="login_title">系统登录</h3>
    <div v-show="mode">
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.username"  placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="loginForm.password"  placeholder="请输入密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox> -->
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%" @click="submitClick">登录</el-button>
        <el-button
          type="primary"
          style="width: 100%;margin-left:-1px;margin-top:5px"
          @click="changeLoginMode(false)"
        >手机验证码登录--></el-button>
      </el-form-item>
    </div>

    <div v-show="!mode">
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.username" autocomplete="off" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item class="phoneVerification">
        <div class="phoneVerificationCode">
          <el-input v-model="smsCode" placeholder="请输入收到的验证码"></el-input>
          <div class="phoneVerficationImage" @click="smsCodes()">{{codeText}}</div>
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <el-input
          type="text"
          style="width:50%;margin-left:-30px;"
          v-model="smsCode"
          auto-complete="off"
          placeholder="验证码"
        ></el-input>
        <el-button type="primary" :disabled="buttonVisible" @click="smsCodes()">{{codeText}}</el-button>
      </el-form-item> -->
      <!-- <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox> -->
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%" @click="submitClickSmsCode">登录</el-button>
        <el-button
          type="primary"
          style="width: 100%;margin-left:-1px;margin-top:5px"
          @click="changeLoginMode(true)"
        >密码登录--></el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
let countDown = 60;

export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    routes() {
      return this.$store.state.routes;
    }
  },
  data() {
    return {
      isDot: false,
      dialogVisible: true,
      buttonVisible: false,
      smsCode: "",
      mobile: "",
      mode: true,
      codeText: "发送手机验证码",
      rules: {
        // account: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        // checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true,
      loginForm: {},
      loading: false
    };
  },
  methods: {
    smsCodes() {
      let _this = this;
      if (this.buttonVisible) {
        return;
      }
      if (this.loginForm.username == "" || this.loginForm.username == null) {
        _this.$message({
          type: "info",
          message: "请先输入手机号"
        });
      } else {
        if (countDown >= 60) {
          this.getRequest("/nologin/code/sms?mobile=" + this.loginForm.username).then(
            resp => {
              
              // _this.$message({
              //   message: "resp.data.msg",
              //   type: "sucess"
              // });

              this.setTimeDown();
            }
          );
        }
      }
    },
    // 手机验证码定时器
    setTimeDown() {
      if (countDown === 0) {
        this.buttonVisible = false;
        this.codeText = "重新获取";
        countDown = 60;
        return;
      } else {
        this.buttonVisible = true;
        this.codeText = countDown + "s";
        countDown--;
      }
      const _self = this;
      this.timer = setTimeout(() => {
        _self.setTimeDown();
      }, 1000);
    },

    changeLoginMode(flag) {
      this.mode = flag;
    },
    login() {
      this.dialogVisible = true;
    },
    loadNF() {
      var _this = this;
      this.getRequest("/chat/sysmsgs").then(resp => {
        var isDot = false;
        resp.data.forEach(msg => {
          if (msg.state == 0) {
            isDot = true;
          }
        });
        _this.$store.commit("toggleNFDot", isDot);
      });
    },
    goChat() {
      this.$router.push({ path: "/chat" });
    },

    handleCommand(cmd) {
      var _this = this;
      if (cmd == "logout") {
        this.$confirm("注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            _this.getRequest("/logout");
            _this.$store.commit("logout");
            _this.$router.replace({ path: "/" });
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "取消"
            });
          });
      }
    },
    submitClick: function() {
      var _this = this;
      this.loading = true;
     
      this.postRequest("/login", {
        username: this.loginForm.username,
        password: this.loginForm.password,
        'remember-me':'on'
      }).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          if (data.obj.departmentId != 1) {
            _this.$message({
              type: "info",
              message: "权限不足，已阻止登陆"
            });
            _this.getRequest("/logout");
            _this.$store.commit("logout");
            _this.$router.replace({ path: "/" });
          } else {
            _this.$store.commit("login", data.obj);
            var path = _this.$route.query.redirect;
            _this.$router.replace({
              path: path == "/" || path == undefined ? "/home" : path
            });
          }
        }
      });
    },
    submitClickSmsCode: function() {
      var _this = this;
      this.loading = true;
     
      this.postRequest("/authentication/mobile", {
        mobile: this.loginForm.username,
        smsCode: this.smsCode,
        'remember-me':'on'

      }).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$store.commit("login", data.obj);
          var path = _this.$route.query.redirect;
          _this.$router.replace({
            path: path == "/" || path == undefined ? "/home" : path
          });
        }
      });
    }
  }
};
</script>
<style>
.phoneVerification .phoneVerificationCode {
  display: flex;
}
.phoneVerification .phoneVerficationImage {
  cursor: pointer;
  background-color: #ffad4d;
  width: 55%;
  height: 40px;
  margin-left: 10px;
  color: white;
  text-align: center;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
</style>