<template>
  <div>
    <el-row class="fluid" :style="{ backgroundImage: `url(${background})`}">
      <el-col :span="8" :xs="24" >
          <img />
      </el-col>

      <el-col :span="9" :xs="24" >
        <div style="text-align:center; margin-top: 140px">
          <el-form :model="form" :rules="rules" ref="form">
            <el-row align="center">
              <img
                src="/static/img/logo.246f7a81.png"
                style="height: 150px"
              />
              <h2 style="color: white">TẠO MẬT KHẨU MỚI</h2>
              <br />
              <el-col :span="16" :offset="4" :sm="16">
                <el-form-item prop="password">
                  <el-input
                    v-model="form.password"
                    type="password"
                    placeholder="Mật khẩu mới"
                  >
                    <el-button slot="prepend" icon="el-icon-lock"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16" :offset="4" :sm="16">
                <el-form-item prop="rePassword">
                  <el-input
                    v-model="form.rePassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                  >
                    <el-button slot="prepend" icon="el-icon-lock"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <br />
            <el-button type="danger" @click="submit('form')" :loading="loading">XÁC NHẬN</el-button>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { resetPasswork } from "@/api/user";
import background from "@/assets/logo/background2.png";

export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu mới"));
      } else {
        if (this.form.rePassword !== "") {
          this.$refs.form.validateField("rePassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập lại mật khẩu mới"));
      } else if (value !== this.form.password) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
    return {
      form: {
        password: "",
        rePassword: "",
        token: ""
      },
      background: background,
      loading: false,
      rules: {
        password: [
          { validator: validatePass, trigger: "blur" },
          { min: 8, message: "Mật khẩu tối thiểu 8 ký tư", trigger: "blur" }
        ],
        rePassword: [
          { validator: validatePass2, trigger: "blur" },
          { min: 8, message: "Mật khẩu tối thiểu 8 ký tư", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  watch: {},
  methods: {
    submit(change) {
      this.$refs[change].validate(valids => {
        if (valids) {
          this.loading = true;
          this.form.token = this.$route.params.token;
          resetPasswork(this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Đã thay đổi mật khẩu!",
                type: "success"
              });
              this.form.password = '',
              this.form.rePassword = '',
              this.form.token = ''
              // setTimeout(function() {window.location.href = "/login"}, 2500);
            })
            .catch(error => {
              this.loading = false;
              //console.log(error);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.fluid {
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  height: 100vh;
  overflow-x: hidden;

}
</style>
