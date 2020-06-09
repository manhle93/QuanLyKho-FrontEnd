<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="22" :offset="1">
          <h4>
            Cập nhật công tác thẩm duyệt vầ cấp giấy phép chứng nhận đủ điều
            kiện về PCCC
          </h4>
          <el-row :gutter="20">
            <el-col :sm="{ span: 8 }">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  :disabled="disabledTinhThanh"
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

            <el-col :sm="{ span: 8 }">
              <el-form-item label="Tòa nhà" prop="toa_nha_id">
                <el-select
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.toa_nha_id"
                  placeholder="Hãy chọn tòa nhà"
                >
                  <el-option
                    v-for="toanha in toanhas"
                    :key="toanha.id"
                    :label="toanha.ten"
                    :value="toanha.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="{ span: 8 }">
              <el-form-item label="Ngày cấp" prop="ngay_cap">
                <br />
                <el-date-picker
                  style="width: 100%"
                  v-model="form.ngay_cap"
                  type="date"
                  placeholder="Thời gian"
                  format="dd/MM/yyyy"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <el-form-item label="Tên văn bản" prop="ten_van_ban">
                <el-input
                  type="text"
                  v-model="form.ten_van_ban"
                  placeholder="Nhập tên văn bản"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <el-form-item label="Số văn bản" prop="so_van_ban">
                <el-input
                  type="text"
                  v-model="form.so_van_ban"
                  placeholder="Nhập số văn bản"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <el-form-item label="Cơ quan cấp" prop="co_quan_cap">
                <el-input
                  type="text"
                  v-model="form.co_quan_cap"
                  placeholder="Nhập tên cơ quan cấp giấy phép"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 16 }">
              <el-form-item label="Ghi chú" prop="ghi_chu">
                <el-input
                  type="textarea"
                  v-model="form.ghi_chu"
                  placeholder="Nhập ghi chú"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-upload
                ref="upload"
                :action="urlUpload"
                :headers="this.token"
                :on-change="handleChange"
                :file-list="form.files"
                :data="{
                  id: this.$route.params.id,
                  type_reference: 'tham_duyet'
                }"
                :on-remove="removeFile"
                :on-preview="download"
                :before-upload="beforeUpload"
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
              <router-link to="/congtacphongchay/thamdinhpheduyet">
                <el-button type="warning" icon="el-icon-back"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-button
                icon="el-icon-check"
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
                >Cập nhật</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  addKiemtra,
  getListMaTN,
  getToaNhaSearch,
  getToaNhaTheoTinh
} from "@/api/toanha";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getTrangThai } from "@/api/kiemtratoanha";
import {
  showThamDinhPheDuyet,
  updateThamDinhPheDuyet,
  deleteThamDinhPheDuyet
} from "@/api/thamdinhpheduyet";
import { removeFile } from "@/api/toanha";

import axios from "axios";

export default {
  components: {
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      token: {},
      form: {
        tinh_thanh_id: null,
        toa_nha_id: "",
        ngay_cap: "",
        ten_van_ban: "",
        so_van_ban: "",
        co_quan_cap: "",
        files: []
      },
      toanhas: [],
      tinhthanhs: [],
      loading: false,
      rules: {
        tinh_thanh_id: [
          {
            required: true,
            message: "Tỉnh thành không được bỏ trống",
            trigger: "blur"
          }
        ],
        toa_nha_id: [
          {
            required: true,
            message: "Tòa nhà không được bỏ trống",
            trigger: "blur"
          }
        ],
        ngay_cap: [
          {
            required: true,
            message: "Ngày cấp không được bỏ trống",
            trigger: "blur"
          }
        ],
        ten_van_ban: [
          {
            required: true,
            message: "Tên văn bản không được bỏ trống",
            trigger: "blur"
          }
        ],
        so_van_ban: [
          {
            required: true,
            message: "Số văn bản không được bỏ trống",
            trigger: "blur"
          }
        ],
        co_quan_cap: [
          {
            required: true,
            message: "Đơn vị cấp không được bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getData(id) {
      let data = await showThamDinhPheDuyet(id);
      getToaNhaTheoTinh(data.tinh_thanh_id).then(res => {
        this.toanhas = res.data;
      });
      this.form = data;
    },
    changeTinhThanh(val) {
      getToaNhaTheoTinh(val).then(res => {
        this.toanhas = res.data;
      });
    },
    resetForm() {
      this.form = {
        tinh_thanh_id: null,
        thoi_gian: "",
        so_giay_cn: "",
        noi_dung: "",
        pccc_co_so: "",
        quan_ly_lanh_dao: "",
        nguoi_lao_dong: "",
        doi_tuong_khac: "",
        toa_nha_id: null,
        fileList: []
      };
      this.$refs.upload.clearFiles();
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      var filePath = file.name.split(".").pop();
      var dinhDangChoPhep = [
        "xlsx",
        "xls",
        "xlt",
        "xltx",
        "doc",
        "docx",
        "pdf",
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
        this.form.fileList.pop();
        return false;
      }
      if (!isLt2M) {
        this.form.fileList.pop();
        this.$message.error("Kích thước tập tin tối đa 20Mb!");
        return false;
      }
      return true;
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList.slice(-3);
    },
    async getTrangThai() {
      this.trang_thai = await getTrangThai();
    },
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
            // console.log(error);
          });
      }
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
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          updateThamDinhPheDuyet(this.$route.params.id, this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
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
      if (res.data.tinh_thanh_id) {
        this.disabledTinhThanh = true;
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
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
    this.getData(this.$route.params.id);
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
