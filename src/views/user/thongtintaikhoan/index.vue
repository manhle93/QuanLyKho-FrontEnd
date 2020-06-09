<template>
  <div class="app-container">
    <h3>Thông tin</h3>
    <el-col :span="8" style="text-align:center; margin-top:30px;">
      <img class="avatar-image" :src="src" />
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
          type="success"
          style="margin-top:20px;"
          @click="handleUpload"
          class="block"
          icon="el-icon-edit"
          circle
        ></el-button>
      </el-tooltip>
    </el-col>
    <el-form :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
      <el-col :span="10">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="Tên đăng nhập"
              prop="username"
              :error="error.username"
            >
              <el-input
                :disabled="true"
                v-model="formLabelAlign.username"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="Họ tên" prop="name" :error="error.name">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Email" prop="email" :error="error.email">
          <el-input v-model="formLabelAlign.email"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="Số điện thoại" :error="error.phone">
              <el-input v-model="formLabelAlign.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4" v-if="formLabelAlign.role_id != 1">
            <el-form-item
              label="Tỉnh thành"
              prop="Tỉnh thành"
              :error="error.tinh_thanh_id"
            >
              <el-select
                :disabled="true"
                filterable
                v-model="formLabelAlign.tinh_thanh_id"
                placeholder="Chọn một tỉnh thành"
              >
                <el-option
                  v-for="item in tinhthanhs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          class="primary-button block"
          style="margin-top:20px;"
          @click="submit('formLabelAlign')"
          >Cập nhật thông tin</el-button
        >
        <el-button type="warning" @click="showUpdate()" icon="el-icon-edit"
          >Đổi mật khẩu</el-button
        >
        <el-card class="box-card" style="margin-top: 30px">
          <div slot="header" class="clearfix">
            <h4>Thông tin quyền quản trị</h4>
          </div>
          <div class="text item">
            <b>Mã quyền:</b>
            {{ formLabelAlign.role.code }}
          </div>
          <div class="text item">
            <b>Tên quyền:</b>
            {{ formLabelAlign.role.name }}
          </div>
          <div class="text item">
            <b>Mô Tả:</b>
            {{ formLabelAlign.role.description }}
          </div>
        </el-card>
        <reset-password
          :active="showEditForm"
          @onClose="handleClose()"
          @onChangePass="result => handleChangPass(result)"
        ></reset-password>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import ResetPassword from "./reset";
import { getInfor, editInfor } from "@/api/taikhoan";
import { uploadAvatar } from "@/api/taikhoan";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
// import { logOut } from "@/api/company";
export default {
  components: {
    ResetPassword
  },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      imageUrl: "",
      list: null,
      labelPosition: "left",
      pass: null,
      showEditForm: false,
      error: {
        name: "",
        username: "",
        email: "",
        phone: "",
        avatar_url: "",
        tinh_thanh_id: "",
        quan_huyen_id: ""
      },
      tinhthanhs: [],
      quanhuyens: [],
      formLabelAlign: {
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
          description: ""
        }
      },

      rules: {
        name: [
          {
            required: true,
            message: "Tên không được bỏ trống",
            trigger: "blur"
          },
          { min: 2, message: "Tên tối thiểu 2 ký tự", trigger: "blur" }
        ],
        username: [
          {
            required: true,
            message: "Tên không được bỏ trống",
            trigger: "blur"
          },
          { min: 2, message: "Tên tối thiểu 2 ký tự", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: "Email đăng nhập không được bỏ trống",
            trigger: "change"
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
    this.tinhThanh();
  },
  watch: {},
  methods: {
    showUpdate() {
      this.showEditForm = true;
    },
    async tinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
        this.tinhthanhs.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    fetchData() {
      getInfor().then(res => {
        this.formLabelAlign = res.data;
        if (res.data.avatar_url == null || res.data.avatar_url == "") {
          this.src =
            process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
        } else {
          this.src = process.env.VUE_APP_BASE + res.data.avatar_url;
        }
      });
    },
    handleUpload() {
      this.$refs["upload-image"].click();
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
    submit(updateInfo) {
      this.$refs[updateInfo].validate(valid => {
        if (valid) {
          this.error.email = "";
          this.error.name = "";
          this.error.phone = "";
          if (Number.isInteger(Number(this.formLabelAlign.phone))) {
            this.formLabelAlign.phone = this.phoneFormat(
              this.formLabelAlign.phone
            );
          }
          editInfor(this.formLabelAlign)
            .then(res => {
              this.$message({
                title: "Thành công",
                message: "Cập nhật thành công",
                type: "success"
              });
            })
            .catch(error => {
              this.$emit("onCreatePosition", error);
            });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.showEditForm = false;
      this.$emit("onRefresh");
    },
    handleChangPass(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$emit("onChangePass", true);
        this.$message({
          title: "Thành công",
          message: "Đổi mật khẩu thành công",
          type: "success"
        });
        this.logout().then(res => {});
      }
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/customer/login?redirect=${this.$route.fullPath}`);
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);

      var filePath = files[0].name.split(".").pop(); //lấy định dạng file
      var dinhDangChoPhep = ["jpg", "jpeg", "png", "gif", "tiff", "BMP"]; //các tập tin cho phép
      const isLt2M = files[0].size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.form.fileList.pop();
        this.$message.error("Kích thước tập tin tối đa 20Mb!");
        return false;
      }
      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.loadingUpload = false;
        this.listLoading = false;
        this.iconUpload = "el-icon-bottom";
        this.$message({
          message: "Tập tin không hợp lệ, hãy upload file ảnh",
          type: "warning"
        });
        return;
      } else {
        uploadAvatar(data)
          .then(res => {
            this.src = process.env.VUE_APP_BASE + res;
          })
          .catch(error => {});
      }
    }
  }
};
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-image {
  width: 250px;
  height: auto;
  line-height: 178px;
  text-align: center;
  border-radius: 10px;
}

.upload-image {
  display: none;
  z-index: -9999;
}
</style>
