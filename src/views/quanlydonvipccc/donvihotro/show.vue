<template>
  <div class="app-container">
    <h4>Chi tiết đơn vị hỗ trợ</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mã đơn vị" label-position="right" prop="ma">
                <el-input v-model="form.ma" suffix-icon="el-icon-user" placeholder="Nhập mã đơn vị"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tên đơn vị" label-position="right" prop="ten">
                <el-input v-model="form.ten" placeholder="Nhập tên đơn vị"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col el-col :md="{span:12}">
              <el-form-item label="Số điện thoại" prop="so_dien_thoai">
                <el-input v-model="form.so_dien_thoai" placeholder="Nhập số điện thoại"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Loại đơn vị hỗ trợ" prop="loai_don_vi_id">
                <el-select
                  style="width:100%"
                  v-model="form.loai_don_vi_id"
                  placeholder="Hãy chọn loại đơn vị"
                >
                  <el-option
                    v-for="donvi in donvis"
                    :key="donvi.id"
                    :label="donvi.ten"
                    :value="donvi.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="!disabledTinhThanh" :md="{span:12}">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeQuanHuyen(form.tinh_thanh_id)"
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
            <el-col :md="{span:12}">
              <el-form-item label="Quận huyện" prop="quan_huyen_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.quan_huyen_id"
                  placeholder="Hãy chọn quận huyện"
                >
                  <el-option
                    v-for="quanhuyen in quanhuyens"
                    :key="quanhuyen.id"
                    :label="quanhuyen.name"
                    :value="quanhuyen.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Kinh độ" label-position="right" prop="long">
                <el-input v-model="form.long" suffix-icon="el-icon-map" placeholder="Nhập kinh độ"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Vĩ độ" label-position="right" prop="lat">
                <el-input v-model="form.lat" suffix-icon="el-icon-map" placeholder="Nhập vĩ độ"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :md="{span:12}">
              <router-link to="/donvipccc/quanlychung">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :md="{span:12}">
              <el-button
                style="float: right"
               class="primary-button"
                :loading="loading"
                @click="submit('form')"
                icon="el-icon-check"
              >CẬP NHẬT</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <tracking-map
            v-if="form.lat&&form.long"
            :item="form"
            @getAddress="addr => handleMap(addr)"
          ></tracking-map>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TrackingMap from "./map";
import { showChiTiet, editDonViHoTro, getLoaiDonVi } from "@/api/donvihotro";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
import { getInfor } from "@/api/taikhoan";
import BackButton from "@/layout/back";

export default {
  components: {
    TrackingMap,
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      donvis: [],
      tinhthanhs: [],
      quanhuyens: [],
      form: {
        ma: "",
        ten: "",
        loai_don_vi_id: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        lat: "",
        long: ""
      },
      rules: {
        ma: [
          {
            required: true,
            message: "Mã đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        ten: [
          {
            required: true,
            message: "Tên đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        loai_don_vi_id: [
          {
            required: true,
            message: "Hãy chọn một tinhr thành",
            trigger: "blur"
          }
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Hãy nhập số điện thoại",
            trigger: "blur"
          }
        ],
        lat: [
          {
            required: true,
            message: "Vĩ độ không được bỏ trống",
            trigger: "blur"
          }
        ],
        long: [
          {
            required: true,
            message: "Kinh độ không được bỏ trống",
            trigger: "blur"
          }
        ]
      },
      salary_level_data: [],
      loading: false
    };
  },
  methods: {
    handleMap(val) {
      this.form.dia_chi = val.address;
      this.form.lat = val.lat;
      this.form.long = val.lng;
    },
    changeQuanHuyen(val) {
      this.form.quan_huyen_id = null;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.quanhuyens = res.data;
      });
    },
    async tinhThanh() {
      await getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
      });
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          editDonViHoTro(this.$route.params.id, this.form)
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
    },
    resetForm() {
      for (let field in this.form) {
        this.form[field] = "";
      }
    },
    async quanHuyen() {
      getQuanHuyen().then(res => {
        this.quanhuyens = res.data;
      });
    },
    layLoaiDonVi() {
      getLoaiDonVi().then(res => {
        this.donvis = res.data;
      });
    },
    async showChiTietDonVi(id) {
      showChiTiet(id).then(res => {
        this.form = res.data;
        getQuanHuyen({ tinh_thanh_id: this.form.tinh_thanh_id }).then(res => {
          this.quanhuyens = res.data;
        });
      });
      this.loading = false;
      return true;
    }
  },
  layLoaiDonVi() {
    getLoaiDonVi().then(res => {
      this.donvis = res.data;
    });
  },
  created() {
    this.showChiTietDonVi(this.$route.params.id);
    this.layLoaiDonVi();
    this.quanHuyen();
    this.tinhThanh();
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },

  watch: {}
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
@media (max-width: 990px) {
  .back-button {
    width: fit-content;
    margin-top: 10px;
  }
}
</style>
