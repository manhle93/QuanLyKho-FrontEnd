<template>
  <div class="app-container">
    <h4>
      <i style="color: green">TẠO ĐƠN HÀNG TỚI NHÀ CUNG CẤP</i>
    </h4>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-steps :active="active" finish-status="success">
          <el-step title="Tạo đơn"></el-step>
          <el-step title="Nhận đơn"></el-step>
          <el-step title="Giao hàng"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <br />
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <br />
        <div style="font-size: 16px; color: #1f618d; font-weight: bold">1. Thông tin đơn hàng</div>
        <br />
        <el-col :span="6">
          <el-form-item label="Mã đơn hàng">
            <el-input v-model="form.ma" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="admin ? 4 : 6">
          <el-form-item label="Tên đơn hàng" prop="ten">
            <el-input v-model="form.ten"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="admin ? 4 : 6">
          <el-form-item label="Thời gian nhận hàng" prop="thoi_gian">
            <br />
            <el-date-picker
              style="width: 100%"
              v-model="form.thoi_gian"
              type="datetime"
              placeholder="Nhập thời gian"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="admin">
          <el-form-item label="Nhà cung cấp">
            <el-select
              style="width: 100%"
              @change="getSanPhamNCC(form.nha_cung_cap_id)"
              v-model="form.nha_cung_cap_id"
              filterable
              placeholder="Chọn nhà cung cấp"
            >
              <el-option
                v-for="item in nhaCungCaps"
                :key="item.id"
                :label="item.ten"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Ghi chú">
            <el-input type="textarea" v-model="form.ghi_chu"></el-input>
          </el-form-item>
        </el-col>
        <br />
        <div style="font-size: 16px; color: #1f618d; font-weight: bold">2. Sản phẩm, hàng hóa</div>
        <br />
        <el-col :span="6">
          <el-form-item label="Hàng hóa, sản phẩm">
            <br />
            <el-select
              style="width: 100%"
              v-model="hang_hoa_id"
              placeholder="Chọn hàng hóa, sản phẩm"
              @change="doiSanPham(hang_hoa_id)"
            >
              <el-option
                v-for="item in hangHoas"
                :key="item.san_pham.id"
                :label="item.san_pham.ten_san_pham"
                :value="item.san_pham.id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Đơn vị tính">
            <el-input :disabled="true" v-model="don_vi_tinh"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Số lượng">
            <el-input type="number" :min="0" v-model="so_luong"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Đơn giá theo báo giá">
            <el-input :disabled="true" v-model="don_gia" :min="0" type="number">
              <template slot="append">VNĐ</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <br />
            <el-button icon="el-icon-plus" class="primary-button" @click="addSanPham()"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-table
            show-summary
            :data="form.danhSachHang"
            style="width: 100%"
            :summary-method="tongTien"
            max-height="600px"
          >
            <el-table-column type="index" label="STT" width="100px"></el-table-column>
            <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
            <!-- <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column> -->
            <el-table-column prop="ton_kho" label="Tồn kho" v-if="role_id == 1">
              <template slot-scope="scope">
                {{ scope.row.ton_kho }}
                {{ scope.row.hang_hoa.don_vi_tinh }}
              </template>
            </el-table-column>
            <el-table-column prop="dat_truoc" label="Đặt trước" v-if="role_id == 1">
              <template slot-scope="scope">
                {{ scope.row.dat_truoc }}
                {{ scope.row.hang_hoa.don_vi_tinh }}
              </template>
            </el-table-column>
            <el-table-column prop="so_luong" label="Số lượng" min-width="120">
              <template slot-scope="scope">
                <!-- {{ scope.row.so_luong }}
                {{ scope.row.hang_hoa.don_vi_tinh }}-->
                <el-input-number size="small" v-model="scope.row.so_luong" :min="0.1" />
                {{ scope.row.hang_hoa.don_vi_tinh }}
              </template>
            </el-table-column>
            <el-table-column prop="don_gia" label="Đơn giá">
              <template slot-scope="scope">{{ formate.formatCurrency(scope.row.don_gia) }}</template>
            </el-table-column>
            <el-table-column label="Thành tiền">
              <template slot-scope="scope">
                {{
                formate.formatCurrency(scope.row.so_luong * scope.row.don_gia)
                }}
              </template>
            </el-table-column>
            <el-table-column label="Xóa">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="small"
                  @click="xoaSanPham(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="5">
          <br />
          <el-form-item label="Chiết khấu">
            <el-input v-model="form.chiet_khau" :min="0" type="number">
              <template slot="append">VNĐ</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1" style="padding-top: 60px">
          <label>
            Tổng thanh toán:
            {{ formate.formatCurrency(form.tong_tien) }} vnđ
          </label>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <el-row>
      <el-col :span="10">
        <el-button icon="el-icon-back" type="warning" @click="back()">Quay lại</el-button>
      </el-col>
      <el-col :span="10">
        <el-button
          :disabled="disableAdd"
          style="float: right"
          icon="el-icon-plus"
          class="primary-button"
          @click="submit('form')"
        >THÊM MỚI</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import {
  addSanPham,
  getSanPhamNhaCungCap,
  tonKhoDatTruoc,
} from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";

export default {
  data() {
    return {
      active: 0,
      src: process.env.VUE_APP_BASE,
      form: {
        ma: "ĐH_" + new Date().getTime(),
        ten:
          "Đơn hàng, ngày" +
          new Date().getUTCDate() +
          "/" +
          (+new Date().getMonth() + 1) +
          "/" +
          new Date().getUTCFullYear(),
        thoi_gian: null,
        ghi_chu: null,
        tong_tien: null,
        chiet_khau: null,
        danhSachHang: [],
        nha_cung_cap_id: null,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      admin: false,
      nhaCungCaps: [],
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      so_luong: null,
      don_vi_tinh: null,
      don_gia: null,
      formate: formate,
      ton_kho: null,
      dat_truoc: null,
      role_id: null,
      disableAdd: false,
      rules: {
        ten: [
          { required: true, message: "Hãy nhập tên đơn hàng", trigger: "blur" },
          {
            min: 5,
            message: "Tên đơn hàng tối thiểu 5 ký tự",
            trigger: "blur",
          },
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không thể bỏ trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getNhaCungCap();
    this.getInfo();
  },
  methods: {
    async doiSanPham(id) {
      this.hangHoa = this.hangHoas.find((el) => el.san_pham_id == id);
      this.don_vi_tinh = this.hangHoa.san_pham.don_vi_tinh;
      this.don_gia = this.hangHoa.don_gia;
      let data = await tonKhoDatTruoc(id);
      this.ton_kho = data.ton_kho;
      this.dat_truoc = data.dat_truoc;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.so_luong && this.don_gia) {
        let data = {};
        data.hang_hoa = this.hangHoa.san_pham;
        data.so_luong = this.so_luong;
        data.don_gia = this.don_gia;
        data.ton_kho = this.ton_kho;
        data.dat_truoc = this.dat_truoc;
        this.form.danhSachHang.push(data);
        for (let el of this.hangHoas) {
          if (this.hang_hoa_id == el.san_pham.id) {
            el.disabled = true;
          }
        }
        this.hang_hoa_id = null;
        this.so_luong = null;
        this.don_gia = null;
        this.don_vi_tinh = null;
        this.ton_kho = null;
        this.dat_truoc = null;
        this.hangHoa = {};
      }
    },
    xoaSanPham(index, data) {
      this.form.danhSachHang.splice(index, 1);
      for (let el of this.hangHoas) {
        if (data.hang_hoa.id == el.id) {
          el.disabled = false;
        }
      }
    },
    tongTien(param) {
      const { columns, data } = param;
      const sums = Array(7).fill("");
      sums[5] =
        formate.formatCurrency(
          data.reduce(
            (acc, el) => (acc += Number(el.don_gia) * Number(el.so_luong)),
            0
          )
        ) + " VND";
      sums[0] = "Tổng tiền";
      this.form.tong_tien =
        data.reduce(
          (acc, el) => (acc += Number(el.don_gia) * Number(el.so_luong)),
          0
        ) - this.form.chiet_khau;
      return sums;
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.danhSachHang.length == 0) {
            this.$message({
              message: "Danh sách hàng hóa không thể bỏ trống",
              type: "warning",
            });
            return;
          }
          this.disableAdd = true;
          addSanPham(this.form)
            .then((res) => {
              this.$message({
                message: "Tạo đơn hàng thành công",
                type: "success",
              });
              this.disableAdd = false;
              this.resetForm();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    back() {
      this.$router.push("/quanlydonhang/nhacungcap");
    },
    resetForm() {
      this.form = {
        ma: new Date().getTime(),
        ten:
          "Đơn hàng, ngày" +
          new Date().getUTCDate() +
          "/" +
          (+new Date().getMonth() + 1) +
          "/" +
          new Date().getUTCFullYear(),
        thoi_gian: null,
        ghi_chu: null,
        tong_tien: null,
        chiet_khau: null,
        danhSachHang: [],
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.hangHoas = [];
      this.so_luong = null;
      this.don_vi_tinh = null;
      this.don_gia = null;
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
    async getInfo() {
      let data = await getInfor();
      this.form.nha_cung_cap_id = null;
      this.role_id = data.data.role_id;
      if (data.data.role_id == 1 || data.data.role_id == 2) {
        this.admin = true;
      }
    },
    async getSanPhamNCC(id) {
      let data = await getSanPhamNhaCungCap({ nha_cung_cap_id: id });
      this.hangHoas = data;
      this.form.danhSachHang = [];
    },
  },
};
</script>
<style scoped></style>
