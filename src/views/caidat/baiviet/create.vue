<template>
  <div class="app-container">
    <h3>Thêm mới bài viết</h3>
    <el-row>
      <el-form :rules="rules" ref="form" :model="form">
        <el-col :span="20">
          <el-form-item label="Tiêu đề bài viết" prop="tieu_de">
            <el-input v-model="form.tieu_de"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="Ảnh đại diện">
            <br />
            <a>
              <img @click="handleUpload" style="widht: 150px; height: 150px" :src="src" />
            </a>
            <input
              ref="upload-image"
              class="upload-image"
              type="file"
              @change="handleChange($event)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Trạng thái" prop="trang_thai">
            <br />
            <el-radio v-model="form.trang_thai" :label="true" border size="medium">Xuất bản</el-radio>
            <el-radio v-model="form.trang_thai" :label="false" border size="medium">Lưu nháp</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="Nội dung bài viết" prop="noi_dung">
            <br />
            <vue-simplemde v-model="form.noi_dung" ref="markdownEditor" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-button icon="el-icon-edit" class="primary-button" v-if="form.trang_thai" @click="submit('form')">XUẤT BẢN</el-button>
          <el-button icon="el-icon-edit" class="primary-button" v-else @click="submit('form')">LƯU NHÁP</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import {addBaiViet} from "@/api/caidat"
import {upAnhDanhMuc } from "@/api/danhmucsanpham";

export default {
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      urlUploadSanPham: process.env.VUE_APP_BASE_API + "uploadanhsanpham",
      endPointImage: process.env.VUE_APP_BASE,
      form: {
        noi_dung: "",
        trang_thai: true,
        tieu_de: null,
        anh_dai_dien: null,
      },
      rules: {
        tieu_de: [
          {
            required: true,
            message: "Tiêu đề bài viết không thể bỏ trống",
            trigger: "blur",
          },
        ],
        trang_thai: [
          {
            required: true,
            message: "Trạng thái không thể bỏ trống",
            trigger: "blur",
          },
        ],
        noi_dung: [
          {
            required: true,
            message: "Nội dung bài viết không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then((res) => {
          this.form.anh_dai_dien = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    resetForm() {
      this.form = {
        noi_dung: "",
        trang_thai: true,
        tieu_de: null,
        anh_dai_dien: null,
      };
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
          addBaiViet(this.form).then((res) => {
            this.$message({
              type: "success",
              message: "Thành công",
            });
            this.resetForm();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
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
  line-height: 40px;
}
</style>