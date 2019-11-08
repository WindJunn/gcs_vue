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
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
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
        <el-input type="text" v-model="mobile" auto-complete="off" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="text"
          style="width:50%;margin-left:-30px;"
          v-model="smsCode"
          auto-complete="off"
          placeholder="验证码"
        ></el-input>
        <el-button type="primary" @click="smsCodes()">发送手机验证码</el-button>
      </el-form-item>
      <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
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
      smsCode: "",
      mobile: "",
      mode: true,
      rules: {
        account: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true,
      loginForm: {},
      loading: false
    };
  },
  methods: {
    smsCodes() {
      this.getRequest("/code/sms?mobile=" + this.mobile).then(resp => {});
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
        password: this.loginForm.password
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
        mobile: this.mobile,
        smsCode: this.smsCode
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