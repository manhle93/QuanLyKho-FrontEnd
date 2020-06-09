<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="22" :offset="1">
          <h4>Cập nhật công tác xử lý vi phạm về PCCC</h4>
          <el-row :gutter="20">
            <el-col :sm="{ span: 8 }">
              <el-form-item label="Tỉnh thành">
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
              <el-form-item label="Đối tượng vi phạm" prop="doi_tuong_vi_pham">
                <el-input
                  v-model="form.doi_tuong_vi_pham"
                  placeholder="Nhập đối tượng vi phạm"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="{ span: 8 }">
              <el-form-item label="Thời gian" prop="thoi_gian">
                <br />
                <el-date-picker
                  style="width: 100%"
                  v-model="form.thoi_gian"
                  type="date"
                  placeholder="Thời gian"
                  format="dd/MM/yyyy"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <el-form-item
                label="Nội dung hành vi cụ thể"
                prop="noi_dung_hanh_vi"
              >
                <el-input
                  v-model="form.noi_dung_hanh_vi"
                  placeholder="Nhập nội dung hành vi"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <el-form-item label="Nhóm hành vi">
                <br />
                <el-select
                  v-model="nhom_hanh_vi_id"
                  style="width: 100%"
                  multiple
                  filterable
                >
                  <el-option
                    v-for="item in nhomHanhVis"
                    :key="item.id"
                    :label="item.noi_dung"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <h4>Biện pháp xử lý</h4>
              <el-form-item>
                <label style="padding-right: 20px">1. Cảnh cáo</label>
                <el-checkbox
                  size="small"
                  border
                  label="Cảnh cáo"
                  v-model="form.canh_cao"
                ></el-checkbox>
              </el-form-item>
              <el-form-item>
                <label>2. Phạt tiền</label>
                <br />
                <el-input
                  v-model="form.phat_tien"
                  placeholder="Số tiền phạt (VNĐ)"
                  size="small"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <label style="padding-right: 20px"
                  >3. Đình chỉ/Tạm đình chỉ:</label
                >
                <el-radio-group v-model="trang_thai_dinh_chi" size="mini">
                  <el-radio-button label="Tạm đình chỉ"></el-radio-button>
                  <el-radio-button label="Đình chỉ"></el-radio-button>
                  <el-radio-button label="Không"></el-radio-button>
                </el-radio-group>
                <br />
                <el-date-picker
                  v-if="trang_thai_dinh_chi == 'Tạm đình chỉ'"
                  size="small"
                  v-model="form.thoi_gian_tam_dinh_chi"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Ngày tạm đình chỉ"
                  end-placeholder="Ngày phục hồi"
                  format="dd/MM/yyyy"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <label>4. Biện pháp xử lý khác</label>
                <br />
                <el-input
                  v-model="form.xu_ly_khac"
                  placeholder="Nhập nội dung"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-upload
                ref="upload"
                :action="urlUpload"
                :headers="this.token"
                :on-change="handleChange"
                :file-list="form.files"
                :before-upload="beforeUpload"
                :data="{
                  id: this.$route.params.id,
                  type_reference: 'xu_ly_vi_pham'
                }"
                :on-remove="removeFile"
                :on-preview="download"
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
              <router-link to="/congtacphongchay/xulyvipham">
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
  getNhomHanhVi,
  addXuLyViPham,
  showXuLyViPham,
  updateXuLyViPham
} from "@/api/xulyvipham";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getTrangThai } from "@/api/kiemtratoanha";
import { addThamDinhPheDuyet } from "@/api/thamdinhpheduyet";
import { removeFile, getToaNhaTheoTinh } from "@/api/toanha";
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
      nhom_hanh_vi_id: [],
      trang_thai_dinh_chi: "Không",
      form: {
        tinh_thanh_id: null,
        canh_cao: false,
        thoi_gian: "",
        doi_tuong_vi_pham: "",
        xu_ly_khac: "",
        tam_dinh_chi: null,
        dinh_chi: false,
        phat_tien: null,
        files: [],
        noi_dung_hanh_vi: "",
        thoi_gian_tam_dinh_chi: [],
        nhom_hanh_vi_id: [],
        trang_thai_dinh_chi: "Không",
        toa_nha_id: null
      },
      nhomHanhVis: [],
      toanhas: [],
      tinhthanhs: [],
      trang_thai: [],
      loading: false,
      rules: {
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không được bỏ trống",
            trigger: "blur"
          }
        ],
        doi_tuong_vi_pham: [
          {
            required: true,
            message: "Đối tượng vi phạm không được bỏ trống",
            trigger: "blur"
          }
        ],
        nhom_hanh_vi_id: [
          {
            required: true,
            message: "Nhóm hành vi không được bỏ trống",
            trigger: "blur"
          }
        ],
        noi_dung_hanh_vi: [
          {
            required: true,
            message: "Nội dung hành vi không được bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    changeTinhThanh(val) {
      getToaNhaTheoTinh(val).then(res => {
        this.toanhas = res.data;
      });
    },
    async getNhomHanhVi() {
      let data = await getNhomHanhVi();
      this.nhomHanhVis = data;
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
          });
      }
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
        "rar",
        "zip",
        "jpeg",
        "jpg",
        "png",
        "txt",
        "pdf"
      ]; //các tập tin cho phép
      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.$message({
          message: "Tập tin không hợp lệ !",
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
    async getData(id) {
      let data = await showXuLyViPham(id);
      this.form = data;
      this.form.trang_thai_dinh_chi = "Không";
      this.form.thoi_gian_tam_dinh_chi = [];
      this.form.nhom_hanh_vi_id = [];
      getToaNhaTheoTinh(data.tinh_thanh_id).then(res => {
        this.toanhas = res.data;
      });
      if (data.tam_dinh_chi) {
        this.trang_thai_dinh_chi = "Tạm đình chỉ";
        this.form.thoi_gian_tam_dinh_chi[0] = data.ngay_tam_dinh_chi;
        this.form.thoi_gian_tam_dinh_chi[1] = data.ngay_phuc_hoi;
      }
      if (data.dinh_chi) {
        this.trang_thai_dinh_chi = "Đình chỉ";
        this.thoi_gian_tam_dinh_chi = [];
      }
      for (let item of data.nhom_hanh_vis) {
        this.nhom_hanh_vi_id.push(item.nhom_hanh_vi_id);
      }
    },
    resetForm() {
      this.form = {
        tinh_thanh_id: null,
        canh_cao: false,
        thoi_gian: "",
        doi_tuong_vi_pham: "",
        xu_ly_khac: "",
        tam_dinh_chi: null,
        dinh_chi: false,
        phat_tien: null,
        fileList: [],
        noi_dung_hanh_vi: "",
        thoi_gian_tam_dinh_chi: [],
        nhom_hanh_vi_id: [],
        trang_thai_dinh_chi: "Không",
        toa_nha_id: null
      };
      this.$refs.upload.clearFiles();
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList.slice(-3);
    },
    async getTrangThai() {
      this.trang_thai = await getTrangThai();
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
          this.form.nhom_hanh_vi_id = this.nhom_hanh_vi_id;
          this.form.trang_thai_dinh_chi = this.trang_thai_dinh_chi;
          if (this.form.trang_thai_dinh_chi == "Không") {
            (this.form.tam_dinh_chi = false), (this.form.dinh_chi = false);
          }
          if (this.form.trang_thai_dinh_chi == "Đình chỉ") {
            (this.form.tam_dinh_chi = false), (this.form.dinh_chi = true);
          }
          if (this.form.trang_thai_dinh_chi == "Tạm đình chỉ") {
            (this.form.tam_dinh_chi = true), (this.form.dinh_chi = false);
          }
          if (
            this.form.tam_dinh_chi &&
            this.form.thoi_gian_tam_dinh_chi.length == 0
          ) {
            this.$message({
              message: "Chưa nhập thời gian tạm đình chỉ!",
              type: "warning"
            });
            return;
          }
          updateXuLyViPham(this.$route.params.id, this.form)
            .then(res => {
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
              this.loading = false;
            })
            .catch(error => {
              console.log(error);
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
    this.getNhomHanhVi();
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
