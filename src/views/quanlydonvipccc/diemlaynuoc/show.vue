<template>
  <div class="app-container">
    <h4>CHI TIẾT ĐIỂM LẤY NƯỚC</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mã điểm" label-position="right" prop="ma">
                <el-input v-model="form.ma" suffix-icon="el-icon-user" placeholder="Nhập mã điểm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tên điểm lấy nước" label-position="right" prop="ten">
                <el-input v-model="form.ten" placeholder="Nhập tên điểm"></el-input>
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
              <el-form-item label="Đơn vị quản lý" label-position="right" prop="don_vi_quan_ly">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.don_vi_quan_ly_id"
                  placeholder="Hãy chọn quận huyện"
                >
                  <el-option
                    v-for="quanhuyen in donViPccc"
                    :key="quanhuyen.id"
                    :label="quanhuyen.ten"
                    :value="quanhuyen.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Loại" label-position="right" prop="loai">
                <el-input placeholder="Nhập loại điểm lấy nước" v-model="form.loai"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mô tả" label-position="right" prop="description">
                <el-input
                  v-model="form.description"
                  placeholder="Nhập mô tả"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label-position="right" prop="status">
                <br />
                <el-checkbox
                  v-model="form.kha_nang_cap_nuoc_cho_xe"
                  border
                >Có khả năng cấp nước cho xe chữa cháy</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Địa chỉ" label-position="right" prop="dia_chi">
                <el-input
                  v-model="form.dia_chi"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập địa chỉ"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Độ quan trọng" label-position="right" prop="important">
                <el-input v-model="form.important" placeholder="Nhập độ quan trọng"></el-input>
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
            <el-col :md="{span:12}">
              <el-form-item label-position="right" prop="status">
                <el-checkbox v-model="form.hien_thi_tren_map" border>Hiển thị trên bản đồ</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :md="{span:12}">
              <router-link to="/donvipccc/quanlychung">
                <el-button icon="el-icon-back" type="warning">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :md="{span:12}">
              <el-button
                class="primary-button"
                :loading="loading"
                style="float: right"
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
            :id="this.$route.params.id"
          ></tracking-map>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TrackingMap from "./map";
import { showChiTiet, editDiemLayNuoc } from "@/api/diemlaynuoc";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
import { getDanhMucCon } from "@/api/danhmuc";
import { getInfor } from "@/api/taikhoan";
import BackButton from "@/layout/back";
import { getDonViPccc } from "@/api/donvipccc";

export default {
  components: {
    TrackingMap,
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      donvi: {},
      status_diem_lay_nuoc: [],
      type_diem_lay_nuoc: [],
      form: {
        ma: "",
        ten: "",
        don_vi_quan_ly_id: null,
        kha_nang_cap_nuoc_cho_xe: true,
        loai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        dia_chi: "",
        lat: "",
        long: "",
        important: "",
        status: "",
        description: "",
        hien_thi_tren_map: true
      },
      tinhthanhs: [],
      quanhuyens: [],
      donViPccc: [],
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
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tỉnh thành",
            trigger: "blur"
          }
        ],
        quan_huyen_id: [
          {
            required: true,
            message: "Hãy chọn một quận huyện",
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
        dia_chi: [
          {
            required: true,
            message: "Địa chỉ không được bỏ trống",
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
      this.form.don_vi_quan_ly_id = null;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.quanhuyens = res.data;
      });
      getDonViPccc({ tinh_thanh_id: val, per_page: 9999999 }).then(res => {
        this.donViPccc = res.data.data;
      });
    },
    async getLoaiDLN() {
      let data = await getDanhMucCon({ ma: "LDLN" });
      this.type_diem_lay_nuoc = data.data;
    },
    async getTrangThaiDLN() {
      let data = await getDanhMucCon({ ma: "TTDLN" });
      this.status_diem_lay_nuoc = data.data;
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          editDiemLayNuoc(this.$route.params.id, this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
            })
            .catch(error => {
              this.loading = false;
              //console.log(error);
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
    async tinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
      });
    },
    async quanHuyen() {
      getQuanHuyen().then(res => {
        this.quanhuyens = res.data;
      });
    },
    async showChiTietDiemLayNuoc(id) {
      showChiTiet(id).then(res => {
        this.form = res.data;
        getQuanHuyen({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.quanhuyens = res.data;
          this.quanhuyens.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
        });
        getDonViPccc({
          tinh_thanh_id: res.data.tinh_thanh_id,
          per_page: 9999999
        }).then(res => {
          this.donViPccc = res.data.data;
        });
      });

      this.loading = false;
      return true;
    }
  },
  created() {
    this.showChiTietDiemLayNuoc(this.$route.params.id);
    this.tinhThanh();
    this.quanHuyen();
    this.getTrangThaiDLN();
    this.getLoaiDLN();
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
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
