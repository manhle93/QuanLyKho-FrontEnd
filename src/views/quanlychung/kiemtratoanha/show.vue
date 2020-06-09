<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-row :gutter="20">
            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Tòa nhà"
                label-position="right"
                prop="toa_nha_id"
              >
                <el-select
                  v-model="form.toa_nha_id"
                  filterable
                  style="width:100%"
                  placeholder="Hãy chọn tòa nhà"
                >
                  <el-option
                    v-for="ma in matoanha"
                    :key="ma.id"
                    :label="ma.ten"
                    :value="ma.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Quyết định kiểm tra"
                label-position="right"
                prop="quyet_dinh_kiem_tra"
              >
                <el-input
                  v-model="form.quyet_dinh_kiem_tra"
                  placeholder="Nhập quyết định kiểm tra"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Thông tin"
                label-position="right"
                prop="thong_tin"
              >
                <el-input
                  v-model="form.thong_tin"
                  placeholder="Nhập thông tin"
                  suffix-icon="el-icon-user"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Đánh giá"
                label-position="right"
                prop="danh_gia"
              >
                <br />
                <el-select
                  v-model="form.danh_gia"
                  placeholder="Chọn một đánh giá"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in trang_thai"
                    :key="item.id"
                    :label="item.noi_dung"
                    :value="item.noi_dung"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :sm="{ span: 12 }">
              <el-form-item label="Ngày kiểm tra" prop="ngay_kiem_tra">
                <br />
                <el-date-picker
                  v-model="form.ngay_kiem_tra"
                  style="width:100%"
                  type="date"
                  placeholder="Chọn ngày kiểm tra"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Cán bộ kiểm tra"
                label-position="right"
                prop="can_bo_kiem_tra"
              >
                <el-input
                  v-model="form.can_bo_kiem_tra"
                  placeholder="Nhập tên cán bộ kiểm tra"
                  suffix-icon="el-icon-user"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Mô tả" label-position="right" prop="mo_ta">
                <el-input
                  v-model="form.mo_ta"
                  type="textarea"
                  placeholder="Nhập mô tả"
                  suffix-icon="el-icon-phone"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button :sm="{ span: 10 }">
              <el-upload
                ref="upload"
                :action="urlUpload"
                :headers="this.token"
                :data="{ id: this.$route.params.id, type_reference: 'kiem_tra_toa_nha'}"
                :on-change="handleChange"
                :file-list="form.files"
                :on-remove="removeFile"
                :on-preview="download"
                :before-upload="beforeUpload"
              >
                <el-button size="small" class="primary-button"
                  >Đính kèm tập tin</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  Tài liệu không vượt quá 20M
                </div>
              </el-upload>
            </el-button>
          </el-row>
          <br />
          <el-row :gutter="20">
            <el-col :span="10">
              <router-link to="/congtacphongchay/kiemtratoanha">
                <el-button icon="el-icon-back" type="warning"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :span="14">
              <el-button
                class="primary-button"
                icon="el-icon-check"
                style="float: right"
                :loading="loading"
                @click="submit('form')"
                >CẬP NHẬT</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { editktData, getktDetail, removeFile, getListMaTN } from "@/api/toanha";
import { getTrangThai } from "@/api/kiemtratoanha";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import axios from "axios";
export default {
  components: {
    BackButton
  },
  data() {
    return {
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      toanha: null,
      token: {},
      matoanha: [],
      form: {
        toa_nha_id: "",
        can_bo_kiem_tra: "",
        quyet_dinh_kiem_tra: "",
        thong_tin: "",
        danh_gia: "",
        ngay_kiem_tra: "",
        mo_ta: "",
        files: []
      },
      trang_thai: [],
      loading: false,
      rules: {
        thong_tin: [
          {
            required: true,
            message: "Thông tin không được bỏ trống",
            trigger: "blur"
          }
        ],
        danh_gia: [
          {
            required: true,
            message: "Đánh giá không được bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getDetail(this.$route.params.id);
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    this.getData();
    this.getTrangThai();
  },
  methods: {
    async getData() {
      getListMaTN({ per_page: 1000 }).then(response => {
        this.matoanha = response.data.data;
      });
    },
    resetForm() {
      this.form = {
        toa_nha_id: "",
        can_bo_kiem_tra: "",
        quyet_dinh_kiem_tra: "",
        thong_tin: "",
        danh_gia: "",
        ngay_kiem_tra: "",
        mo_ta: "",
        files: []
      };
       this.$refs.upload.clearFiles();
    },
    async getTrangThai() {
      this.trang_thai = await getTrangThai();
    },

    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      var filePath = file.name.split(".").pop();
      var dinhDangChoPhep = [
        "xlsx",
        "xls",
        "xlt",
        "pdf",
        "xltx",
        "doc",
        "docx",
        "rar",
        "zip",
        "jpeg",
        "jpg",
        "png",
        "txt"
      ]; //các tập tin cho phép
      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.$message({
          message: "Tập tin không hợp lệ",
          type: "warning"
        });
        // this.form.files.pop();
        return false;
      }
      if (!isLt2M) {
        // this.form.files.pop();
        this.$message.error("Kích thước tập tin tối đa 20Mb!");
        return false;
      }
      return true;
    },
    download(file) {
      if (!file.id) {
        file.id = file.response.result;
      }
      axios({
        url: process.env.VUE_APP_BASE_API + "building/" + file.id + "/file",
        method: "GET",
        headers: { Authorization: "Bearer " + getToken() },
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
      });
    },
    handleChange() {},
    removeFile(file) {
      if (file.response) {
        file.id = file.response.result;
      }
      if (file.id) {
        removeFile(file.id)
          .then(res => {
            this.loading = false;
            this.$message({
              message: "Xóa thành công!",
              type: "success"
            });
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    async getDetail(id) {
      const toanha = await getktDetail(id);
      this.toanha = toanha.data;
      for (const field in this.form) {
        this.form[field] = this.toanha[field];
      }
      this.loading = false;
      return true;
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          editktData(this.$route.params.id, this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
            })
            .catch(error => {
              this.loading = false;
              // console.log(error);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="css" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed black;

  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  border: 1px dashed black;
  /* border-radius: 50%; */
  /* width: 200px;
          height: 200px; */
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
@media (max-width: 576px) {
  .rs-button,
  .back-button {
    margin-top: 10px;
  }
  .back-button {
    width: fit-content;
  }
}
</style>
