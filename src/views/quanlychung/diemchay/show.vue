<template>
  <div class="app-container">
    <create-toanha
      :active="showCreateForm"
      :tinhthanh="form.tinh_thanh_id"
      @onCreateToaNha="toanha => handleCreateToaNha(toanha)"
      @onClose="handleClose()"
    ></create-toanha>
    <h4>Chi tiết điểm cháy</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Tên" label-position="right" prop="ten">
                <el-input
                  v-model="form.ten"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập tên điểm cháy"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Số điện thoại" label-position="right">
                <el-input v-model="form.so_dien_thoai" placeholder="Nhập số điện thoại"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tên người báo" label-position="right" prop="ten_nguoi_bao">
                <el-input
                  v-model="form.ten_nguoi_bao"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập tên người báo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="!disabledTinhThanh" :md="{span:12}">
              <el-form-item label="Tỉnh thành" label-position="right" prop="tinh_thanh_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeTinhThanh(form.tinh_thanh_id)"
                >
                  <el-option
                    v-for="tinhthanh in options.tinhthanhs"
                    :key="tinhthanh.id"
                    :label="tinhthanh.name"
                    :value="tinhthanh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tòa nhà" label-position="right" prop="toa_nha_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.toa_nha_id"
                  placeholder="Hãy chọn tòa nhà"
                >
                  <el-option
                    v-for="toanha in options.toanhas"
                    :key="toanha.id"
                    :label="toanha.ten"
                    :value="toanha.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Địa chỉ" prop="dia_chi">
                <el-input type="text" v-model="form.dia_chi" placeholder="Nhập địa chỉ"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Thời gian báo cháy"
                label-position="right"
                prop="thoi_gian_bao_chay"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.thoi_gian_bao_chay"
                  type="datetime"
                  placeholder="Thời gian báo cháy"
                  :picker-options="pickerOptions"
                  format="dd/MM/yyyy HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Trạng thái" label-position="right" prop="trang_thai">
                <el-select
                  style="width:100%"
                  v-model="form.trang_thai"
                  placeholder="Hãy chọn trạng thái"
                >
                  <el-option
                    v-for="trangthai in options.trangthais"
                    :key="trangthai.ma"
                    :label="trangthai.ten"
                    :value="trangthai.ma"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Thời bắt đầu xử lý"
                label-position="right"
                prop="thoi_gian_bat_dau_xu_ly"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.thoi_gian_bat_dau_xu_ly"
                  type="datetime"
                  placeholder="Thời gian bắt đầu xử lý"
                  format="dd/MM/yyyy HH:mm:ss"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Thời gian kết thúc xử lý"
                label-position="right"
                prop="thoi_gian_ket_thuc"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.thoi_gian_ket_thuc"
                  type="datetime"
                  placeholder="Thời gian kết thúc xử lý"
                  format="dd/MM/yyyy HH:mm:ss"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Nguyên nhân cháy" label-position="right" prop="nguyen_nhan">
                <el-input
                  v-model="form.nguyen_nhan"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập nguyên nhân cháy"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Số người bị thương"
                label-position="right"
                prop="so_nguoi_bi_thuong"
              >
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_bi_thuong"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người bị thương"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="{span:12}">
              <el-form-item label="Số người chết" label-position="right" prop="so_nguoi_chet">
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_chet"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người chết"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Ước tính thiệt hại (VNĐ)"
                label-position="right"
                prop="uoc_tinh_thiet_hai"
              >
                <el-input
                  v-model="form.uoc_tinh_thiet_hai"
                  placeholder="Số tiền thiệt hại ước tính"
                  type="number"
                  :min="0"
                ><template slot="append">VNĐ</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Số CB chiến sỹ tham gia chữa cháy"
                label-position="right"
                prop="so_nguoi_tham_gia_chua_chay"
              >
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_tham_gia_chua_chay"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người tham gia chữa cháy"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Ghi chú" label-position="right" prop="ghi_chu">
                <el-input
                  type="textarea"
                  v-model="form.ghi_chu"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập ghi chú"
                ></el-input>
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
          <br />
          <el-row :gutter="25">
            <el-col :md="{span:20}">
              <router-link to="/chuachayvacnch/chuachay">
                <el-button icon="el-icon-back" type="warning">Quay lại</el-button>
              </router-link>
              <el-button class="primary-button" icon="el-icon-plus" @click="createToaNha()">Thêm tòa nhà</el-button>
            </el-col>
            <el-col :md="{span:4}">
              <el-button class="primary-button" icon="el-icon-check" :loading="loading" @click="submit('form')">CẬP NHẬT</el-button>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12" v-if="form.lat&&form.long">
          <tracking-map
            @getAddress="addr => handleMap(addr)"
            v-if="diemchay"
            :item="diemchay"
            :id="this.$route.params.id"
          ></tracking-map>
          <br />
          <el-tabs>
            <el-tab-pane label="Phương tiện">
              <el-table :data="form.phuong_tien_pccc" border fit highlight-current-row>
                <el-table-column property="don_vi_pccc.ten" label="Đơn vị"></el-table-column>
                <el-table-column sortable property="ten" label="Tên"></el-table-column>
                <el-table-column property="bien_so" label="Biển số"></el-table-column>
                <el-table-column property="so_hieu" label="Số hiệu"></el-table-column>
                <el-table-column property="so_dien_thoai" label="Số điện thoại"></el-table-column>
                <el-table-column property="loai_phuong_tien_pccc.ten" label="Loại phương tiện"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Đơn vị hỗ trợ">
              <el-table :data="form.don_vi_ho_tro" border fit highlight-current-row>
                <el-table-column property="loai_don_vi.ten" label="Loại đơn vị"></el-table-column>
                <el-table-column sortable property="ten" label="Tên"></el-table-column>
                <el-table-column property="so_dien_thoai" label="Số điện thoại"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TrackingMap from "./map";
import { getDataDetail, updateDiemChay, getToaNha } from "@/api/diemchay";
import { getDanhMucCon } from "@/api/danhmuc";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getToaNhaSearch } from "@/api/toanha";
import CreateToanha from "./create";

export default {
  components: {
    TrackingMap,
    BackButton,
    CreateToanha
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "Hôm nay",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "Hôm qua",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "Tuần trước",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      showCreateForm: false,
      disabledTinhThanh: true,
      toanha: null,
      token: {},
      form: {
        ten: "",
        so_nguoi_tham_gia_chua_chay: "",
        thoi_gian_bat_dau_xu_ly: "",
        thoi_gian_ket_thuc: "",
        thoi_gian_bao_chay: "",
        ten_nguoi_bao: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        toa_nha_id: "",
        nguyen_nhan: "",
        so_nguoi_chet: "",
        uoc_tinh_thiet_hai: "",
        so_nguoi_bi_thuong: "",
        dia_chi: "",
        lat: "",
        long: "",
        phuong_tien_pccc: [],
        don_vi_ho_tro: [],
        trang_thai: "",
        ghi_chu: ""
      },
      options: {
        toanhas: [],
        trangthais: [],
        tinhthanhs: []
      },
      rules: {
        ten: [
          {
            required: true,
            message: "Tên không được bỏ trống",
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
      loading: false
    };
  },
  methods: {
    createToaNha(id) {
      this.showCreateForm = true;

      //console.log(id);
    },
    handleMap(val) {
      this.form.dia_chi = val.address;
      this.form.lat = val.lat;
      this.form.long = val.lng;
    },
    async getDanhSachToaNha() {
      let data = await getToaNha();
      this.options.toanhas = data.data;
    },
    async getTranThaiDiemChay() {
      let data = await getDanhMucCon({ ma: "TTDC" });
      this.options.trangthais = data.data;
    },
    handleCreateToaNha(result) {
      if (result === true) {
        this.$message({
          type: "success",
          message: "Thêm mới thành công"
        });
        this.changeTinhThanh(this.form.tinh_thanh_id)
      }
    },
    handleClose() {
      this.showCreateForm = false;
      this.$emit("onRefresh");
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;

          if (
            this.form.thoi_gian_bat_dau_xu_ly != null &&
            this.form.thoi_gian_bao_chay != null &&
            this.form.thoi_gian_bat_dau_xu_ly < this.form.thoi_gian_bao_chay
          ) {
            this.loading = false;
            return this.$message({
              message: "Thời gian báo cháy phải nhỏ hơn thời gian xử lý!",
              type: "warning"
            });
          }
          if (
            this.form.thoi_gian_bat_dau_xu_ly > this.form.thoi_gian_ket_thuc &&
            this.form.thoi_gian_ket_thuc != null &&
            this.form.thoi_gian_bat_dau_xu_ly != null
          ) {
            this.loading = false;
            return this.$message({
              message: "Thời gian xử lý phải nhỏ hơn thời gian kết thúc xử lý!",
              type: "warning"
            });
          }
          updateDiemChay(this.$route.params.id, this.form)
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

    changeTinhThanh(val) {
      getToaNhaSearch({ tinh_thanh_id: val }).then(res => {
        this.options.toanhas = res.data.data;
        this.form.toa_nha_id = null;
      });
    },

    resetForm() {
      this.form = {
        ten: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        toa_nha_id: "",
        nguyen_nhan: "",
        so_nguoi_chet: "",
        uoc_tinh_thiet_hai: "",
        so_nguoi_bi_thuong: "",
        dia_chi: "",
        lat: "",
        long: "",
        ghi_chu: ""
      };
    },
    async getDetail(id) {
      let diemchay = await getDataDetail(id);
      this.diemchay = diemchay.data;
      for (let field in this.form) {
        this.form[field] = this.diemchay[field];
      }
      if (this.form.tinh_thanh_id) {
        getToaNhaSearch({ tinh_thanh_id: this.form.tinh_thanh_id, per_page: 10000}).then(
          res => {
            this.options.toanhas = res.data.data;
          }
        );
      }
      this.loading = false;
      return true;
    },
    async getData(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    }
  },
  created() {
    this.getDetail(this.$route.params.id);

    this.getTranThaiDiemChay();

    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        this.getDanhSachToaNha();
      } else {
        this.disabledTinhThanh = false;
        this.getData(getTinhThanh, "tinhthanhs");
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
