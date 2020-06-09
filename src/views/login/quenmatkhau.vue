<template>
  <div>
    <el-row class="fluid" :style="{ backgroundImage: `url(${background})`}">
      <el-col :span="8">
        <img />
      </el-col>
      <el-col :span="9" :xs="24">
        <div style="text-align:center; margin-top: 140px" v-if="sendMail">
          <el-form :model="form" :rules="rules" ref="form">
            <el-row align="center">
              <img src="/static/img/logo.246f7a81.png" style="height: 150px" />
              <h2 style="color: white">QUÊN MẬT KHẨU</h2>
              <br />
              <el-col :span="16" :offset="4">
                <el-form-item prop="email">
                  <el-input
                    v-model="form.email"
                    name="email"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                    placeholder="Nhập địa chỉ email"
                    clearable
                  >
                    <el-button slot="prepend" icon="el-icon-message"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <br />
            <el-button type="danger" @click="submit('form')" :loading="loading">XÁC NHẬN</el-button>
          </el-form>
        </div>
        <div style="text-align:center; margin-top:" v-if="!sendMail">
          <el-form :model="form" :rules="form" ref="form">
            <el-row align="center">
              <!-- <img
                src="http://pcccapi.howizbiz.com/storage/images/avatar/1569579145.png"
                style="height: 150px"
              />-->
              <img src="http://st.howizbiz.com/static/img/vector%20image%204.782b0a36.svg" />

              <h2 style="color: white">ĐÃ GỬI EMAIL KHÔI PHỤC</h2>
              <br />
              <el-col>
                <P
                  style="font-size: 18px; color: yellow;  line-height: 25px"
                >Chúng tôi đã gửi một thư đến địa chỉ email: {{this.form.email}} của bạn. Vui lòng kiểm tra hộp thư để thay đổi mật khẩu!</P>
                <br />
                <p
                  style="font-size: 18px; color: yellow; font-weght: bold"
                >Lưu ý! Email khôi phục chỉ có hiệu lực trong 120 phút</p>
              </el-col>
              <el-col></el-col>
            </el-row>
          </el-form>
          <br />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { quenMatKhau } from "@/api/user";
import background from "@/assets/logo/background2.png";

export default {
  name: "QuenMatKhau",
  data() {
    return {
      form: {
        email: ""
      },
      rules: {
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"]
          }
        ]
      },
      background: background,
      loading: false,
      sendMail: true,
      noidung: ""
    };
  },
  watch: {},
  methods: {
    submit(change) {
      this.$refs[change].validate(valids => {
        if (valids) {
          this.loading = true;
          this.form.email = this.form.email.toLowerCase();
          quenMatKhau(this.form)
            .then(res => {
              this.noidung = res.message;
              this.sendMail = false;
              this.loading = false;
            })
            .catch(_ => {
              this.loading = false;
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
#login {
  background-color: #1d3160;
  opacity: 0.7;
  padding: 10% 10% 10%;
}
</style>
