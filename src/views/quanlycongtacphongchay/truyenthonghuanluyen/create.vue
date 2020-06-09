<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="22" :offset="1">
          <h4>Thêm mới công tác tuyên truyền, huấn luyện, bồi dưỡng nghiệp vụ PCCC</h4>
          <el-row :gutter="20">
            <el-col :sm="{span:6}">
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
            <el-col :sm="{span:6}">
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
            <el-col :sm="{span:6}">
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
            <el-col :sm="{span:6}">
              <el-form-item label="Số giấy CN HLNV PCCC được cấp" prop="so_giay_cn">
                <el-input v-model="form.so_giay_cn" placeholder="Nhập số giấy chứng nhận được cấp"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{span:6}">
              <el-form-item label="Thời lượng (giờ)" prop="thoi_luong">
                <el-input v-model="form.thoi_luong" placeholder="Thời lượng huấn luyện, bồi dưỡng"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{span:18}">
              <el-form-item
                label="Nội dung huấn luyện, bồi dưỡng nghiệp vụ PCCC"
                label-position="right"
                prop="noi_dung"
              >
                <el-input
                  v-model="form.noi_dung"
                  placeholder="Nhập nội dung huấn luyện, bồi dưỡng nghiệp vụ PCCC"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{span:6}">
              <el-form-item
                label="Lực lượng PCCC cơ sở (người)"
                label-position="right"
                prop="pccc_co_so"
              >
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.pccc_co_so"
                  placeholder="Nhập số người tham gia"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{span:6}">
              <el-form-item
                label="Cán bộ quản lý lãnh đạo (người)"
                label-position="right"
                prop="quan_ly_lanh_dao"
              >
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.quan_ly_lanh_dao"
                  placeholder="Nhập số người tham gia"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{span:6}">
              <el-form-item
                label="Người lao động (người)"
                label-position="right"
                prop="nguoi_lao_dong"
              >
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.nguoi_lao_dong"
                  placeholder="Nhập số người tham gia"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{span:6}">
              <el-form-item
                label="Đối tượng khác (người)"
                label-position="right"
                prop="doi_tuong_khac"
              >
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.doi_tuong_khac"
                  placeholder="Nhập số người tham gia"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br />
          <el-row justify="space-around">
            <el-col :sm="{span:12}">
              <router-link to="/congtacphongchay/truyenthong">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :sm="{span:12}">
              <el-button
                icon="el-icon-plus"
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
              >Thêm mới</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addKiemtra, getListMaTN, getToaNhaTheoTinh } from "@/api/toanha";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getTrangThai } from "@/api/kiemtratoanha";
import { addHuanLuyenBoiDuong } from "@/api/huanluyenboiduong";

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
        thoi_gian: "",
        so_giay_cn: "",
        noi_dung: "",
        pccc_co_so: "",
        quan_ly_lanh_dao: "",
        nguoi_lao_dong: "",
        doi_tuong_khac: "",
        toa_nha_id: null,
        fileList: [],
        thoi_luong: 0
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
            message: "tòa nhà không được bỏ trống",
            trigger: "blur"
          }
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không được bỏ trống",
            trigger: "blur"
          }
        ],
        noi_dung: [
          {
            required: true,
            message: "Nội dung không được bỏ trống",
            trigger: "blur"
          }
        ],
        pccc_co_so: [
          {
            required: true,
            message: "Hãy nhập số lực lượng pccc cơ sở tham gia",
            trigger: "blur"
          }
        ],
        quan_ly_lanh_dao: [
          {
            required: true,
            message: "Hãy nhập số lượng cán bộ quản lý lãnh đạo tham gia",
            trigger: "blur"
          }
        ],
        nguoi_lao_dong: [
          {
            required: true,
            message: "Nhập số lượng người lao động tham gia",
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
        fileList: [],
        thoi_luong: 0
      };
      this.$refs.upload.clearFiles();
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList.slice(-3);
    },
    async getTrangThai() {
      this.trang_thai = await getTrangThai();
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          addHuanLuyenBoiDuong(this.form)
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
