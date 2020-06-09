<template>
  <el-dialog
    :visible.sync="showChangePass"
    @close="close()"
    title="ĐỔI MẬT KHẨU"
    width="30%"
    center
  >
    <el-form
      :label-position="labelPosition"
      :model="formLabelAlign"
      :rules="rules"
      ref="formLabelAlign"
    >
      <el-col>
        <el-form-item :error="error.oldPassword" prop="oldPassword">
          <i class="el-icon-lock"></i>
          <label>Mật khẩu hiện tại</label>
          <el-input
            size="large"
            v-model="formLabelAlign.oldPassword"
            placeholder="*************"
            type="password"
            name="oldPassword"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item :error="error.newPassword" prop="newPassword">
          <label>
            <i class="el-icon-edit"></i> Mật khẩu mới
          </label>
          <el-input
            size="large"
            v-model="formLabelAlign.newPassword"
            placeholder="Mật khẩu mới"
            type="password"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item :error="error.reNewPassword" prop="reNewPassword">
          <label>
            <i class="el-icon-edit"></i> Nhập lại mật khẩu mới
          </label>
          <el-input
            size="large"
            v-model="formLabelAlign.reNewPassword"
            placeholder="Nhập lại mật khẩu mới"
            type="password"
          ></el-input>
        </el-form-item>
      </el-col>
        <p style="color: #E74C3C; line-height: 22px; word-break: keep-all !importain; font-style: italic; font-size: 13px; font-weight: bold">Mật khẩu từ 6 kí tự, gồm cả chữ, số, viết hoa, viết thường và cả kí tự đặc biệt</p>
      <el-button
        class="primary-button"
        style="width:100%; "
        :loading="loading"
        @click="submit('formLabelAlign')"
      >CẬP NHẬT</el-button>
    </el-form>
  </el-dialog>
</template>
<script>
import { changPassword } from "@/api/taikhoan";
// import { logOut } from '@/api/company'

export default {
  name: "ResetPass",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu mới"));
      } else {
        if (this.formLabelAlign.reNewPassword !== "") {
          this.$refs.formLabelAlign.validateField("reNewPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập lại mật khẩu mới"));
      } else if (value !== this.formLabelAlign.newPassword) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
    return {
      roomId: 0,
      loading: false,
      error: {
        oldPassword: "",
        reNewPassword: "",
        newPassword: ""
      },
      showChangePass: false,
      labelPosition: "top",
      formLabelAlign: {
        oldPassword: "",
        reNewPassword: "",
        newPassword: ""
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "Hãy nhập mật khẩu hiện tại",
            trigger: "blur"
          },
          { min: 6, message: "Mật khẩu tối thiểu 6 ký tự", trigger: "blur" }
        ],
        newPassword: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, message: "Mật khẩu tối thiểu 6 ký tư", trigger: "blur" }
        ],
        reNewPassword: [
          { validator: validatePass2, trigger: "blur" },
          { min: 6, message: "Mật khẩu tối thiểu 6 ký tư", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    active(val) {
      this.showChangePass = val;
    }
  },

  methods: {
    close() {
      this.error.reNewPassword = "";
      this.error.newPassword = "";
      this.error.oldPassword = "";
      this.formLabelAlign.oldPassword = "";
      this.formLabelAlign.reNewPassword = "";
      this.formLabelAlign.newPassword = "";
      this.$emit("onClose");
    },
    submit(change) {
      this.$refs[change].validate(valids => {
        if (valids) {
          this.loading = true;
          this.error.reNewPassword = "";
          this.error.newPassword = "";
          this.error.oldPassword = "";
          changPassword(this.formLabelAlign)
            .then(res => {
              this.loading = false;
              this.$emit("onChangePass", true);
            })
            .catch(error => {
              this.loading = false;
              this.$emit("onChangePass", error);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 73%;
}
.formcreate {
  height: 300px;
}
</style>
