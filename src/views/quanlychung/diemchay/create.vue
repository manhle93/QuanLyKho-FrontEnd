<template>
  <div>
    <el-dialog
      :visible.sync="showCreateToanha"
      @close="close()"
      title="THÊM MỚI CƠ SỞ CÔNG TRÌNH"
      center
      width="40%"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Mã tòa nhà" label-position="right" prop="ma">
                  <el-input v-model="form.ma" suffix-icon="el-icon-user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tên tòa nhà" label-position="right" prop="ten">
                  <el-input v-model="form.ten"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Hướng vào tòa nhà"
                  label-position="right"
                  prop="huong_vao_toa_nha"
                >
                  <el-input v-model="form.huong_vao_toa_nha" suffix-icon="el-icon-user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="Loại hình sở hữu"
                  label-position="right"
                  prop="loai_hinh_so_huu_id"
                >
                  <el-select
                    style="width:100%"
                    v-model="form.loai_hinh_so_huu_id"
                    placeholder="Hãy chọn loại hình sở hữu"
                  >
                    <el-option
                      v-for="loaihinh in options.loaihinhsohuus"
                      :key="loaihinh.id"
                      :label="loaihinh.ten"
                      :value="loaihinh.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Đơn vị PCCC" prop="don_vi_pccc_id">
                  <el-select
                    filterable
                    style="width:100%"
                    v-model="form.don_vi_pccc_id"
                    placeholder="Hãy chọn đơn vị phòng cháy chữa cháy"
                  >
                    <el-option
                      v-for="donvi in options.donvis"
                      :key="donvi.id"
                      :label="donvi.ten"
                      :value="donvi.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Địa chỉ" prop="dia_chi">
                  <el-input type="textarea" v-model="form.dia_chi"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Chủ tòa nhà" label-position="right" prop="chu_toa_nha">
                  <el-input v-model="form.chu_toa_nha" suffix-icon="el-icon-user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <br />
                <el-checkbox
                  v-model="form.hien_thi_toa_nha"
                  size="medium"
                  style="float:right;margin-top:25px;width:100%"
                  border
                >Hiển thị bản đồ</el-checkbox>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Ngày đăng kí KĐ" label-position="right" prop="ngay_dang_ki_kd">
                  <el-date-picker
                    v-model="form.ngay_dang_ki_kd"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Chọn ngày"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Ngày hết hạn KĐ" label-position="right" prop="ngay_het_han_kd">
                  <el-date-picker
                    v-model="form.ngay_het_han_kd"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Chọn ngày"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-button
                  class="primary-button"
                  style="width:100%; margin-top: 15px;"
                  :loading="loading"
                  @click="submit('form')"
                  icon="el-icon-plus"
                >THÊM</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDonvi, addToaNhaDiemChay } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getDanhMucCon } from "@/api/danhmuc";
export default {
  name: "CreateToanha",
  data() {
    return {
      showCreateToanha: false,
      loading: false,
      form: {
        ma: "",
        ten: "",
        dien_thoai: "",
        dia_chi: "",
        huong_vao_toa_nha: "",
        loai_hinh_so_huu_id: "",
        hien_thi_toa_nha: true,
        don_vi_pccc_id: "",
        chu_toa_nha: "",
        ngay_dang_ki_kd: "",
        ngay_het_han_kd: ""
      },
      options: {
        quanhuyens: [],
        loaihinhsohuus: [],
        donvis: []
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
        dia_chi: [
          {
            required: true,
            message: "Địa chỉ không được bỏ trống",
            trigger: "blur"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tinhr thành",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    tinhthanh: {}
    // idDiemChay: {
    //   type: Number,
    //   default: 0
    // }
  },
  methods: {
    async getData(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async getLoaiHinhSoHuu() {
      let data = await getDanhMucCon({ ma: "LHSH" });
      this.options.loaihinhsohuus = data.data;
    },

    async getDonVi() {
      let data = await getDonvi({ tinh_thanh_id: this.tinhthanh });
      this.options.donvis = data.data;
    },
    changeTinhThanh(val) {
      this.don_vi_pcc_id = null;
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.donvis = res.data;
      });
    },
    close() {
      this.$emit("onClose");
    },
    submit(createToaNha) {
      this.$refs[createToaNha].validate(valid => {
        if (valid) {
          this.loading = true;
          addToaNhaDiemChay(this.form, this.$route.params.id)
            .then(res => {
              //console.log(res.data.id);
              this.loading = false;
              this.showCreateToanha = false;
              this.form.ma = "";
              this.form.ten = "";
              this.form.dia_chi = "";
              this.form.so_dien_thoai = "";
              this.form.chu_toa_nha = "";
              this.form.huong_vao_toa_nha = "";
              this.$emit("onCreateToaNha", true);
            })
            .catch(error => {
              this.loading = false;
              this.$emit("onCreateToaNha", error);
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    // this.getData(getTinhThanh, "tinhthanhs");
    this.getLoaiHinhSoHuu();
  },
  watch: {
    active(val) {
      this.getDonVi();
      this.showCreateToanha = val;
    }
  }
};
</script>

<style>
</style>
