<template>
  <div class="app-container">
    <h4>Thêm mới công tác CNCH</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Tên công tác CHCN"
                label-position="right"
                prop="ten"
              >
                <el-input
                  v-model="form.ten"
                  placeholder="Nhập tên CHCN"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Số điện thoại người báo"
                label-position="right"
              >
                <el-input
                  v-model="form.so_dien_thoai_nguoi_bao"
                  placeholder="Nhập số điện thoại"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Tên người báo"
                label-position="right"
                prop="nguoi_bao"
              >
                <el-input
                  v-model="form.nguoi_bao"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập tên người báo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Thời gian báo"
                label-position="right"
                prop="thoi_gian_nhan_tin_bao"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.thoi_gian_nhan_tin_bao"
                  type="datetime"
                  placeholder="Thời gian nhận tin báo"
                  :picker-options="pickerOptions"
                  format="dd/MM/yyyy HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Địa chỉ" prop="dia_chi">
                <el-input
                  type="text"
                  v-model="form.dia_chi"
                  placeholder="Nhập địa chỉ"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Thuộc khu vực"
                label-position="right"
                prop="khu_vuc"
              >
                <br />
                <el-select
                  v-model="form.khu_vuc"
                  placeholder="Chọn khu vực"
                  style="width: 100%"
                >
                  <el-option value="Dân sự" label="Dân sự"></el-option>
                  <el-option value="Quân đội" label="Quân đội"></el-option>
                  <el-option value="Rừng" label="Rừng"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Nơi xảy ra vụ việc"
                label-position="right"
                prop="noi_xay_ra"
              >
                <br />
                <el-select
                  v-model="form.noi_xay_ra"
                  placeholder="Chọn khu vực"
                  style="width: 100%"
                >
                  <el-option value="Khu CN, CX" label="Khu CN, CX"></el-option>
                  <el-option
                    value="Cơ quan, doanh nghiệp"
                    label="Cơ quan, doanh nghiệp"
                  ></el-option>
                  <el-option value="Khu dân cư" label="Khu dân cư"></el-option>
                  <el-option
                    value="Khu công cộng"
                    label="Khu công cộng"
                  ></el-option>
                  <el-option
                    value="Nhà cao tầng"
                    label="Nhà cao tầng"
                  ></el-option>
                  <el-option
                    value="Phương tiện GTVT"
                    label="Phương tiện GTVT"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Khoảng cách đến đội CC gần nhất"
                label-position="right"
                prop="khoang_cach_doi_cc"
              >
                <el-input
                  type="number"
                  :min="0"
                  placeholder="Nhập khoảng cách m"
                  v-model="form.khoang_cach_doi_cc"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
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
            <el-col :md="{ span: 12 }">
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
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Nguyên nhân"
                label-position="right"
                prop="nguyen_nhan"
              >
                <el-input
                  v-model="form.nguyen_nhan"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập nguyên nhân"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Số người được cứu trực tiếp"
                label-position="right"
                prop="so_nguoi_duoc_cuu_truc_tiep"
              >
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_duoc_cuu_truc_tiep"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người được cứu trực tiếp"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Số người chết"
                label-position="right"
                prop="so_nguoi_chet"
              >
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_chet"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người chết"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Ước tính thiệt hại (VNĐ)"
                label-position="right"
                prop="thiet_hai_tai_san"
              >
                <el-input
                  v-model="form.thiet_hai_tai_san"
                  placeholder="Số tiền thiệt hại ước tính"
                  type="number"
                  :min="0"
                >
                  <template slot="append"
                    >VNĐ</template
                  >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Số người tự thoát"
                label-position="right"
                prop="so_nguoi_tu_thoat"
              >
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_tu_thoat"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người chết"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Hậu quả khác"
                label-position="right"
                prop="hau_qua_khac"
              >
                <el-input
                  v-model="form.hau_qua_khac"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập hậu quả khác..."
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Số CB chiến sỹ tham gia CNCH"
                label-position="right"
                prop="so_nguoi_tham_gia"
              >
                <el-input
                  type="number"
                  min="0"
                  v-model="form.so_nguoi_tham_gia"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập số người tham gia chữa cháy"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                label="Tóm tắt diễn biến vụ việc và quá trình xử lý"
                label-position="right"
                prop="tom_tat_vu_viec_qua_trinh"
              >
                <el-input
                  type="textarea"
                  v-model="form.tom_tat_vu_viec_qua_trinh"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập ghi chú"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br />
          <el-row :gutter="25">
            <el-col :md="{ span: 20 }">
              <router-link to="/chuachayvacnch/cuunancuuho">
                <el-button icon="el-icon-back" type="warning"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :md="{ span: 4 }">
              <el-button
                class="primary-button"
                icon="el-icon-plus"
                :loading="loading"
                @click="submit('form')"
                >THÊM MỚI</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Tỉnh thành"
                label-position="right"
                prop="tinh_thanh_id"
              >
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeTinhThanh(form.tinh_thanh_id)"
                  :disabled="!disabledTinhThanh"
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
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Quận huyện"
                label-position="right"
                prop="quan_huyen_id"
              >
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.quan_huyen_id"
                  placeholder="Hãy chọn quận huyện"
                >
                  <el-option
                    v-for="toanha in quanhuyens"
                    :key="toanha.id"
                    :label="toanha.name"
                    :value="toanha.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Kinh độ" label-position="right" prop="long">
                <el-input
                  v-model="form.long"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập kinh độ"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Vĩ độ" label-position="right" prop="lat">
                <el-input
                  v-model="form.lat"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập vĩ độ"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <tracking-map @getAddress="addr => handleMap(addr)"></tracking-map>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getDanhMucCon } from "@/api/danhmuc";
import { themcnch } from "@/api/cnch";
import { getInfor } from "@/api/taikhoan";
import TrackingMap from "./map";

export default {
  components: {
    TrackingMap
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
      tinhthanhs: [],
      quanhuyens: [],
      form: {
        ten: "",
        so_nguoi_tham_gia: "",
        thoi_gian_bat_dau_xu_ly: "",
        thoi_gian_ket_thuc: "",
        nguoi_bao: "",
        so_dien_thoai_nguoi_bao: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        khu_vuc: "",
        noi_xay_ra: "",
        nguyen_nhan: "",
        so_nguoi_chet: "",
        thiet_hai_tai_san: "",
        so_nguoi_duoc_cuu_truc_tiep: "",
        dia_chi: "",
        lat: "",
        long: "",
        tom_tat_vu_viec_qua_trinh: "",
        khoang_cach_doi_cc: null
      },
      rules: {
        ten: [
          {
            required: true,
            message: "Tên không được bỏ trống",
            trigger: "blur"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Tỉnh thành không được bỏ trống",
            trigger: "blur"
          }
        ],
        quan_huyen_id: [
          {
            required: true,
            message: "Quận huyện không được bỏ trống",
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
  props: {
    active: {
      type: Boolean,
      default: false
    },
    tinhthanh: {}
  },
  methods: {
    handleMap(val) {
      this.form.dia_chi = val.address;
      this.form.lat = val.lat;
      this.form.long = val.lng;
    },
    async getData(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    resetForm() {
      this.form = {
        ten: "",
        so_nguoi_tham_gia: "",
        thoi_gian_bat_dau_xu_ly: "",
        thoi_gian_ket_thuc: "",
        nguoi_bao: "",
        so_dien_thoai_nguoi_bao: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        khu_vuc: "",
        noi_xay_ra: "",
        nguyen_nhan: "",
        so_nguoi_chet: "",
        thiet_hai_tai_san: "",
        so_nguoi_duoc_cuu_truc_tiep: "",
        dia_chi: "",
        lat: "",
        long: "",
        tom_tat_vu_viec_qua_trinh: "",
        khoang_cach_doi_cc: null
      };
    },
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinhthanhs = data.data;
    },
    async changeTinhThanh(val) {
      let data = await getQuanHuyen({ tinh_thanh_id: val });
      this.quanhuyens = data.data;
    },
    close() {
      this.$emit("onClose");
    },
    submit(createToaNha) {
      this.$refs[createToaNha].validate(valid => {
        if (valid) {
          this.loading = true;
          themcnch(this.form)
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
    this.getTinhThanh();
    getInfor().then(res => {
      if (res.data.tinh_thanh_id) {
        this.disabledTinhThanh = false;
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
        this.changeTinhThanh(this.form.tinh_thanh_id)
      } else {
        this.disabledTinhThanh = true;
      }
    });
  },
  watch: {}
};
</script>

<style></style>
