<template>
  <div>
    <el-button
      size="small"
      class="primary-button"
      @click="showCreateUsers = true"
      icon="el-icon-plus"
    >Thêm người dùng</el-button>
    <el-dialog
      :visible.sync="showCreateUsers"
      @close="close()"
      title="THÊM NGƯỜI DÙNG"
      width="650px"
      center
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="formLabelAlign"
      >
        <el-row>
          <el-col style="text-align: center">
            <div class="block">
              <img style="width: 120px; height: 120px" :src="src" />
              <input
                ref="upload-image"
                class="upload-image"
                type="file"
                @change="handleChange($event)"
              />
              <br />
              <el-tooltip
                class="item"
                effect="dark"
                content="Thay đổi ảnh đại diện"
                placement="top"
              >
                <el-button
                  class="primary-button block"
                  style="margin-top:20px;"
                  @click="handleUpload"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>
              <!-- <img :src="src" > -->
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" justify="space-around">
          <el-col :span="11">
            <el-form-item prop="name">
              <i class="fa fa-user"></i>
              <label>Họ và tên</label>
              <el-input size="small" v-model="formLabelAlign.name" placeholder="Nhập vào họ và tên"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="username">
              <label>
                <i class="fa fa-user"></i> Tên đăng nhập
              </label>
              <!-- <el-form-item prop="username"> -->
              <el-input
                size="small"
                v-model="formLabelAlign.username"
                placeholder="Nhập vào tên đăng nhập"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <i class="fa fa-mobile"></i>
              <label>Số điện thoại</label>
              <el-input
                size="small"
                v-model="formLabelAlign.phone"
                placeholder="Nhập vào số điện thoại"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="email">
              <label>
                <i class="fa fa-envelope-o"></i> Email
              </label>

              <el-input size="small" v-model="formLabelAlign.email" placeholder="Nhập vào email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="password">
              <i class="fa fa-lock"></i>
              <label>Mật khẩu</label>

              <el-input
                size="small"
                v-model="formLabelAlign.password"
                type="password"
                placeholder="***********"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="password_confirmation">
              <label>
                <i class="fa fa-lock"></i> Xác nhận mật khẩu
              </label>

              <el-input
                size="small"
                v-model="formLabelAlign.password_confirmation"
                type="password"
                placeholder="***********"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <p
              style="color: #E74C3C; line-height: 22px; word-break: keep-all !importain; font-style: italic; font-size: 13px; font-weight: bold"
            >Mật khẩu từ 6 kí tự, gồm cả chữ, số, viết hoa, viết thường và cả kí tự đặc biệt</p>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="role_id">
              <i class="fa fa-cog"></i>
              <label>Quyền</label>
              <el-select
                size="small"
                style="width:100%"
                :disabled="user_login.role_id == 2 ? true : false"
                v-model="formLabelAlign.role_id"
                placeholder="Chọn quyền người dùng"
              >
                <el-option
                  v-for="role in options.roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                  :disabled="(role.id != 1 && role.id != 2 && role.id != 5) ? true :false"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11" :offset="2" v-if="tinhthanh">
            <el-form-item prop="tinh_thanh_id">
              <i class="fa fa-cog"></i>
              <label>Tỉnh thành</label>
              <el-select
                :disabled="chonTinhThanh"
                filterable
                clearable
                style="width:100%"
                v-model="formLabelAlign.tinh_thanh_id"
                placeholder="Chọn tỉnh thành"
                @change="getToaNha(formLabelAlign.tinh_thanh_id)"
              >
                <el-option
                  v-for="role in options.tinhthanhs"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button
            class="primary-button"
            style="width:98%; margin-left: 10px;"
            icon="el-icon-plus"
            :loading="loading"
            @click="submit('formLabelAlign')"
          >Thêm mới</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addUser, getRole, userAvatar } from "@/api/user";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getToaNha } from "@/api/dancu";
import { getInfor } from "@/api/taikhoan";
import { async } from "q";
import { getToaNhaTheoTinh } from "@/api/toanha";

export default {
  name: "CreateUser",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu mới"));
      } else {
        if (this.formLabelAlign.password_confirmation !== "") {
          this.$refs.formLabelAlign.validateField("password_confirmation");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập lại mật khẩu mới"));
      } else if (value !== this.formLabelAlign.password) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      loading: false,
      tinhthanh: false,
      toanha: false,
      chonTinhThanh: false,
      labelPosition: "top",
      showCreateUsers: false,
      formLabelAlign: {
        name: "",
        username: "",
        phone: "",
        password: "",
        email: "",
        password_confirmation: "",
        avatar_url: "",
        role_id: 2,
        tinh_thanh_id: "",
        quyen_huyen_id: "",
        toa_nha_id: "",
      },
      user_login: {
        name: "",
        email: "",
        username: "",
        phone: "",
        avatar_url: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        role: {
          code: "",
          name: "",
          description: "",
        },
      },
      imageUrl: "",
      toanhas: [],
      options: {
        roles: [],
        tinhthanhs: [],
        quanhuyens: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên không được bỏ trống",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không được bỏ trống",
            trigger: "blur",
          },
          // { unique: true, message: "Tên đăng nhập bị trùng", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            message: "Độ dài tối thiểu 6 kí tự",
            trigger: "blur",
          },
        ],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }],
        role_id: [
          {
            required: true,
            message: "Quyền không được bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async taiKhoanDangLogin() {
      await getInfor().then((res) => {
        this.user_login = res.data;
      });
      getRole().then((res) => {
        this.options.roles = res.data.data;
      });
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      userAvatar(false, data)
        .then((res) => {
          this.formLabelAlign.avatar_url = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    close() {
      this.tinhthanh = false;
      this.toanha = false;
      this.formLabelAlign.name = "";
      this.formLabelAlign.tinh_thanh_id = "";
      this.formLabelAlign.toa_nha_id = "";
      this.formLabelAlign.username = "";
      this.formLabelAlign.email = "";
      this.formLabelAlign.phone = "";
      this.formLabelAlign.password = "";
      this.formLabelAlign.password_confirmation = "";
      this.formLabelAlign.role_id = 2;
      this.$emit("close", this.formLabelAlign);
    },
    phoneFormat(number) {
      number = String(number);
      var formatted = "";
      var digits = 4; //The number of digits to pull off next time.
      var dash = "";
      while (digits > 0) {
        //Prepend final [digits] digits to formatted number, with a dash
        formatted =
          number.substr(number.length - digits, digits) + dash + formatted;
        //Remove digits from the old number
        number = number.substr(0, number.length - digits);
        digits = Math.min(number.length, 3);
        dash = ".";
      }
      return formatted;
    },
    submit(createUsers) {
      this.$refs[createUsers].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (Number.isInteger(Number(this.formLabelAlign.phone))) {
            this.formLabelAlign.phone = this.phoneFormat(
              this.formLabelAlign.phone
            );
          }
          this.formLabelAlign.username = this.formLabelAlign.username.toLowerCase();
          this.formLabelAlign.email = this.formLabelAlign.email.toLowerCase();
          addUser(this.formLabelAlign)
            .then((res) => {
              this.loading = false;
              (this.src =
                process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png"),
                (this.showCreateUsers = false);
              this.formLabelAlign.name = "";
              this.formLabelAlign.username = "";
              this.formLabelAlign.email = "";
              this.formLabelAlign.phone = "";
              this.formLabelAlign.password = "";
              this.formLabelAlign.password_confirmation = "";
              this.formLabelAlign.role_id = 2;
              this.formLabelAlign.tinh_thanh_id = "";
              this.formLabelAlign.toa_nha_id = "";
              this.$emit("onCreateUser", true);
            })
            .catch((error) => {
              this.loading = false;
              this.$emit("onCreateUser", error);
            });
        } else {
          return false;
        }
      });
    },
    async getData(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {}
    },
  },
  created() {
    this.taiKhoanDangLogin();
  },
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: inherit;
  color: #8c939d;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.avatar {
  width: 30px;
  height: 30px;
  display: block;
}
.el-form-item__content {
  line-height: 30px;
  font-size: 13px;
}
</style>
