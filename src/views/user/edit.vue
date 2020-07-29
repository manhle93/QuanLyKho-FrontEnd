<template>
  <div>
    <el-dialog
      :visible.sync="showCreateUsers"
      @close="close()"
      title="CẬP NHẬT THÔNG TIN"
      center
      width="650px"
    >
      <el-form
        :label-position="labelPosition"
        :rules="rules"
        ref="formLabelAlign"
        label-width="100px"
        :model="formLabelAlign"
      >
        <el-row>
          <el-col style="text-align: center">
            <div class="block">
              <img style="widht: 130px; height: 130px" :src="src" />
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
              <el-input
                size="small"
                v-model="formLabelAlign.username"
                placeholder="Nhập vào tên đăng nhập"
                :disabled="true"
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
          <el-col :span="24" v-if="passwordInfo">
            <p
              style="color: #E74C3C; line-height: 22px; word-break: keep-all !importain; font-style: italic; font-size: 13px; font-weight: bold"
            >
              Mật khẩu từ 6 kí tự, gồm cả chữ, số, viết hoa, viết thường và cả
              kí tự đặc biệt
            </p>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="role_id">
              <i class="fa fa-cog"></i>
              <label>Quyền</label>
              <el-select
                size="small"
                :disabled="chonQuyen || (role.id != 1 && role.id != 2 && role.id != 5) ? true :false"
                style="width:100%"
                v-model="formLabelAlign.role_id"
                placeholder="Chọn quyền người dùng"
              >
                <el-option
                  v-for="role in options.roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item>
              <i class="fa fa-cog"></i>
              <label>Trạng thái</label>
              <el-checkbox
                v-model="formLabelAlign.active"
                size="small"
                style="width:100%"
                border
                :disabled="disableHoatDong"
              >Hoạt động</el-checkbox>
            </el-form-item>
          </el-col>

          <el-button
            class="primary-button"
            icon="el-icon-check"
            style="width:100%;"
            :loading="loading"
            @click="submit('formLabelAlign')"
          >CẬP NHẬT</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { editUser, getRole, userAvatar } from "@/api/user";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getToaNha } from "@/api//dancu";
import { getInfor } from "@/api/taikhoan";
import { getToaNhaTheoTinh } from "@/api/toanha";

export default {
  name: "EditUser",
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.formLabelAlign.password_confirmation !== "") {
        this.$refs.formLabelAlign.validateField("password_confirmation");
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.formLabelAlign.password) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
    return {
      passwordInfo: false,
      disableHoatDong: false,
      userId: 0,
      src: "",
      chonQuyen: true,
      chonTinh: true,
      tinhthanh: false,
      toanha: false,
      loading: false,
      trangthai: 2,
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
        role_id: "",
        toa_nha_id: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        active: true,
      },
      checked: true,
      f: false,
      imageUrl: "",

      options: {
        roles: [],
        quanhuyens: [],
        tinhthanhs: [],
        toanhas: [],
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
          { unique: true, message: "Tên đăng nhập bị trùng", trigger: "blur" },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }],
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
    userEdit: {
      type: Object,
    },
  },
  watch: {
    active(val) {
      this.showCreateUsers = val;
    },
    "formLabelAlign.password": function () {
      if (this.formLabelAlign.password) {
        this.passwordInfo = true;
      }
      if (
        !this.formLabelAlign.password &&
        !this.formLabelAlign.password_confirmation
      ) {
        this.passwordInfo = false;
      }
    },
    "formLabelAlign.password_confirmation": function () {
      if (this.formLabelAlign.password_confirmation) {
        this.passwordInfo = true;
      }
      if (
        !this.formLabelAlign.password &&
        !this.formLabelAlign.password_confirmation
      ) {
        this.passwordInfo = false;
      }
    },
    userEdit(val) {
      this.userId = val.id;
      Object.assign(this.formLabelAlign, val);
      this.formLabelAlign.password_confirmation = "";
      this.formLabelAlign.password = "";
      if (this.user_login.id == val.id) {
        this.disableHoatDong = true;
      } else {
        this.disableHoatDong = false;
      }
      if (
        this.formLabelAlign.id == this.user_login.id &&
        this.user_login.role_id == 1
      ) {
        this.chonQuyen = true;
      }
      if (
        this.formLabelAlign.id != this.user_login.id &&
        this.user_login.role_id == 1
      ) {
        this.chonQuyen = false;
      }

      if (this.formLabelAlign.role_id == 1) {
        this.tinhthanh = false;
        this.toanha = false;
        this.formLabelAlign.tinh_thanh_id = null;
        this.formLabelAlign.toa_nha_id = null;
        this.trangthai = 2;
      }
      if (this.formLabelAlign.role_id == 2) {
        this.tinhthanh = true;
        this.toanha = false;
        this.trangthai = 0;
        this.formLabelAlign.toa_nha_id = null;
      }
      if (
        this.formLabelAlign.role_id == 3 ||
        this.formLabelAlign.role_id == 4
      ) {
        this.tinhthanh = true;
        this.trangthai = 0;
      }
      if (
        this.formLabelAlign.avatar_url === null ||
        this.formLabelAlign.avatar_url === ""
      ) {
        this.src =
          process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
      } else
        this.src = process.env.VUE_APP_BASE + this.formLabelAlign.avatar_url;
    },
  },

  methods: {
    async taiKhoanDangLogin() {
      await getInfor().then((res) => {
        this.user_login = res.data;
        if (this.user_login.role_id == 1) {
          this.chonQuyen = false;
          this.chonTinh = false;
        } else {
          this.chonQuyen = true;
          this.chonTinh = true;
        }
      });
      getRole().then((res) => {
        this.options.roles = res.data.data;
        if (this.user_login.role.code == "quan_ly_tinh_thanh") {
          for (var role of this.options.roles) {
            if (role.code != "quan_ly_toa_nha") {
              role.disabled = true;
            }
          }
        }
      });
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      userAvatar(this.userId, data)
        .then((res) => {
          this.formLabelAlign.avatar_url = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    close() {
      this.$emit("onClose");
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    phoneFormat(number) {
      number = String(number);
      var formatted = "";

      if (number != "" && number != "null") {
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
      }

      return formatted;
    },
    submit(editUsers) {
      this.$refs[editUsers].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (Number.isInteger(Number(this.formLabelAlign.phone))) {
            this.formLabelAlign.phone = this.phoneFormat(
              this.formLabelAlign.phone
            );
          }
          this.formLabelAlign.username = this.formLabelAlign.username.toLowerCase();
          this.formLabelAlign.email = this.formLabelAlign.email.toLowerCase();
          editUser(this.userId, this.formLabelAlign)
            .then((res) => {
              this.loading = false;
              this.$emit("onEditUser", true);
            })
            .catch((error) => {
              this.loading = false;
              this.$emit("onEditUser", error);
            });
        } else {
          return false;
        }
      });
    },
    async tinhThanh() {
      let data = await getTinhThanh();
      this.options.tinhthanhs = data.data;
    },
    changetinhThanh(id) {},
  },
  created() {
    this.taiKhoanDangLogin();
    this.tinhThanh();
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
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
.el-form-item__content {
  line-height: 30px;
  font-size: 13px;
}
</style>
