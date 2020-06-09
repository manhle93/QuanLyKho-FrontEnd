<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-row :gutter="20">
             <h4>Thêm mới kiểm tra tòa nhà</h4>
            <el-col v-if="!disabledTinhThanh" :sm="{ span: 12 }">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeTinhThanh(form.tinh_thanh_id)"
                >
                  <el-option
                    v-for="tinhthanh in tinhthanhs"
                    :key="tinhthanh.id"
                    :label="tinhthanh.name"
                    :value="tinhthanh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Tòa nhà"
                label-position="right"
                prop="toa_nha_id"
              >
                <el-select
                  filterable
                  clearable
                  style="width:100%"
                  v-model="form.toa_nha_id"
                  placeholder="Hãy chọn tòa nhà"
                >
                  <el-option
                    v-for="ma in toanhas"
                    :key="ma.id"
                    :label="ma.ten"
                    :value="ma.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="{ span: 12 }">
              <el-form-item
                label="Thông tin"
                label-position="right"
                prop="thong_tin"
              >
                <el-input
                  v-model="form.thong_tin"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập thông tin"
                ></el-input>
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
                  ></el-option>
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
                ></el-input>
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
                  suffix-icon="el-icon-user"
                  placeholder="Nhập tên cán bộ kiểm tra"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="{ span: 12 }">
              <el-form-item label="Ngày kiểm tra" prop="ngay_kiem_tra">
                <br />
                <el-date-picker
                  style="width:100%"
                  v-model="form.ngay_kiem_tra"
                  type="date"
                  placeholder="Chọn ngày kiểm tra"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 24 }">
              <el-form-item label="Mô tả" label-position="right" prop="mo_ta">
                <el-input
                  type="textarea"
                  v-model="form.mo_ta"
                  placeholder="Nhập mô tả"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="{ span: 12 }">
              <el-upload
                ref="upload"
                :action="urlUpload"
                :headers="this.token"
                :on-change="handleChange"
                :file-list="form.fileList"
                :before-upload="beforeUpload"
                :data="{type_reference:'kiem_tra_toa_nha'}"
              >
                <el-button size="small" class="primary-button"
                  >Đính kèm tập tin</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  Đính kèm files với dung lượng nhỏ hơn 20MB
                </div>
              </el-upload>
            </el-col>
          </el-row>
          <br />
          <el-row justify="space-around">
            <el-col :sm="{ span: 12 }">
              <router-link to="/congtacphongchay/kiemtratoanha">
                <el-button type="warning" icon="el-icon-back"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-button
                icon="el-icon-plus"
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
                >Thêm mới</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addKiemtra, getListMaTN, getToaNhaSearch } from "@/api/toanha";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getTrangThai } from "@/api/kiemtratoanha";

export default {
  components: {
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      token: {},
      trang_thai: [],
      form: {
        toa_nha_id: "",
        can_bo_kiem_tra: "",
        quyet_dinh_kiem_tra: "",
        thong_tin: "",
        danh_gia: "",
        ngay_kiem_tra: "",
        mo_ta: "",
        fileList: []
      },
      toanhas: [],
      tinhthanhs: [],
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
        ],
        toa_nha_id: [
          {
            required: true,
            message: "Đánh giá không được bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    changeTinhThanh(val) {
      getToaNhaSearch({ tinh_thanh_id: val }).then(res => {
        this.toanhas = res.data.data;
      });
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      var filePath = file.name.split(".").pop();
      var dinhDangChoPhep = ["xlsx", "xls", "xlt", "xltx", "doc", "docx", "rar", "zip", "jpeg", "jpg", "png", "txt", "pdf"]; //các tập tin cho phép
      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.$message({
          message: "Tập tin không hợp lệ",
          type: "warning"
        });
        this.form.fileList.pop()
        return false
      }
      if (!isLt2M) {
        this.form.fileList.pop()
        this.$message.error("Kích thước tập tin tối đa 20Mb!");
        return false
      }
      return true
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
        fileList: []
      };
      this.$refs.upload.clearFiles();
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList.slice(-10);
    },
    async getTrangThai() {
      this.trang_thai = await getTrangThai();
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          addKiemtra(this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Thêm mới thành công!",
                type: "success"
              });
              this.resetForm();
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getTrangThai();

    this.token = {
      Authorization: "Bearer " + getToken()
    };
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getToaNhaSearch({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.toanhas = res.data.data;
        });
      } else {
        this.disabledTinhThanh = false;
      }
    });

    getTinhThanh().then(res => {
      this.tinhthanhs = res.data;
    });
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
  .back-button {
    width: fit-content;
    margin-top: 10px;
  }
}
</style>
