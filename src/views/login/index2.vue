<template>
  <div>
    <el-container
      class="c-align-center fluid wrap"
      :style="{ backgroundImage: `url(${background})`}"
    >
      <el-container class="c-justify-center">
        <img :src="sanpham" class="img-responsive" />
      </el-container>

      <el-container class="c-justify-center">
        <div id="login">
          <div class="login-background"></div>
          <el-form class="z-index-up" ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-container class="c-align-center" direction="vertical">
              <div class="logo-container">
                <img :src="logo" class="img-logo" />
              </div>
              <el-form-item prop="username" class="full-width">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                  placeholder="Tên đăng nhập"
                  clearable
                  prefix-icon="el-icon-user"
                />
              </el-form-item>
              <el-form-item prop="password" class="full-width">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  placeholder="Mật khẩu"
                  clearable
                  prefix-icon="el-icon-lock"
                  @keyup.enter.native="handleLogin"
                >
                  <!-- <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>-->
                </el-input>
              </el-form-item>
              <div style="display: flex; width: 100%;" v-if="checkCaptcha">
                <div>
                  <el-form-item prop="captcha">
                    <el-input
                      ref="captcha"
                      v-model="loginForm.captcha"
                      name="captcha"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                      placeholder="Nhập capcha"
                      clearable
                    />
                  </el-form-item>
                </div>
                <div>
                  <img
                    :src="imageCapcha"
                    style="padding-left: 5px; padding-top: 1px; border-radius: 5%"
                  />
                </div>
                <div style="padding-left: 10px;" class="button-captcha">
                  <img
                    class="captchat-reset"
                    @click="getCaptcha"
                    src="http://pcccapi.howizbiz.com/storage/images/avatar/1588654255.png"
                  />
                  <!-- <el-button @click="getCaptcha" icon="el-icon-refresh" style="color: white; border-radius: 50%; background-color: #1F618D" circle></el-button> -->
                </div>
              </div>
              <router-link to="/quenmatkhau">
                <p id="p-forgot">Quên mật khẩu</p>
              </router-link>
              <el-button
                :loading="loading"
                type="primary"
                @click.native.prevent="handleLogin"
              >ĐĂNG NHẬP</el-button>
              <br />
              <p id="p-footer">Một sản phẩm của Phúc Đại An</p>
            </el-container>
          </el-form>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getCaptcha, checkUserCaptcha } from "@/api/user";
import logo from "@/assets/logo/logo.png";
import background from "@/assets/logo/background.png";
import sanpham from "@/assets/logo/sanpham.png";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value) || value.length === 0) {
        callback(new Error("Tên đăng không hợp lệ"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("Hãy nhập mật khẩu trên 6 ký tự"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        captcha: ""
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword
          }
        ]
      },
      imageCapcha: "",
      captchaKey: "",
      checkCaptcha: false,
      loading: false,
      passwordType: "password",
      redirect: undefined,
      logo: logo,
      background: background,
      sanpham: sanpham
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.loginForm.username = this.loginForm.username.toLowerCase();
          const req = { ...this.loginForm, captchaKey: this.captchaKey };
          checkUserCaptcha({ username: this.loginForm.username }).then(res => {
            this.checkCaptcha = res.captcha;
          });
          this.$store
            .dispatch("user/login", req)
            .then(() => this.$store.dispatch("permission/getPermissions"))
            .then(() => {
              this.$router.push({ path: "/" });
              this.loading = false;
              location.reload();
            })
            .catch(() => {
              this.getCaptcha();
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    async getCaptcha() {
      let data = await getCaptcha();
      // let string = data.captcha;
      // let match = string.match(/\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/);
      this.imageCapcha = data.captcha.img;
      this.captchaKey = data.captcha.key;
    },
    async login() {
      try {
        this.loading = true;
        this.loginForm.username = this.loginForm.username.toLowerCase();
        await this.$store.dispatch("user/login", this.loginForm);
        // const permissions = await getMenuRole()
        // console.log(this.permissions.data);
        this.$router.push({ path: "/" });
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped>
#p-forgot {
  float: right;
  color: white;
}
#p-footer {
  color: white;
  text-align: center;
}
.el-button {
  width: 100%;
  margin-top: 15%;
  border: none;
  background-color: red;
  border-radius: 0px;
  font-weight: bold;
}
.logo-container {
  max-width: 250px;
  margin-top: 50px;
  padding-bottom: 50px;
}

.img-logo {
  display: block;
  width: 100%;
}
.fluid {
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  height: 100vh;
  overflow-x: hidden;
}
#login {
  position: relative;
  /*padding: 15% 15% 1px;*/
  max-width: 450px;
  /*margin-top:30%;*/
  padding: 25px;
  min-width: 320px;
  width: 100%;
  margin: 25px;
}
.captchat-reset {
  height: 40px;
  cursor: pointer;
  width: auto;
  padding-top: 5px;
}
.login-background {
  position: absolute;
  background-color: #1d3160;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}
.button-captcha:hover img {
  height: 50px;
  width: auto;
}
#f-login {
  text-align: center;
}

.el-input__inner {
  border-radius: 0px !important;
}
.img-responsive {
  width: 100%;
  min-width: 320px;
  max-width: 800px;
}
</style>
