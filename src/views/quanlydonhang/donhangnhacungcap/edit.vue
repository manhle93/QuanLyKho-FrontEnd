<template>
  <div class="app-container">
    <h3>Cập nhật đơn hàng</h3>
    <el-row>
      <el-col :span="10" :offset="0">
        <el-steps :active="active" finish-status="success">
          <el-step title="Tạo đơn"></el-step>
          <el-step title="Duyệt"></el-step>
          <el-step title="Giao hàng"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <br />
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <br />
        <div style="font-size: 16px; color: #1F618D; font-weight: bold">1. Thông tin đơn hàng</div>
        <br />
        <el-col :span="6">
          <el-form-item label="Mã đơn hàng">
            <el-input v-model="form.ma" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Tên đơn hàng" prop="ten">
            <el-input v-model="form.ten"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Thời gian hẹn giao hàng" prop="thoi_gian">
            <br />
            <el-date-picker
              style="width: 100%"
              v-model="form.thoi_gian"
              type="datetime"
              placeholder="Nhập thời gian"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="Ghi chú">
            <el-input type="textarea" v-model="form.ghi_chu"></el-input>
          </el-form-item>
        </el-col>
        <br />
        <div style="font-size: 16px; color: #1F618D; font-weight: bold">2. Sản phẩm, hàng hóa</div>
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
                :key="item.id"
                :label="item.ten_san_pham"
                :value="item.id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Số lượng">
            <el-input type="number" :min="0" v-model="so_luong"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Đơn vị tính">
            <el-input :disabled="true" v-model="don_vi_tinh"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Đơn giá">
            <el-input v-model="don_gia" :min="0" type="number">
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
          >
            <el-table-column type="index" label="STT" width="100px"></el-table-column>
            <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
            <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column>
            <el-table-column prop="so_luong" label="Số lượng"></el-table-column>
            <el-table-column prop="don_gia" label="Đơn giá"></el-table-column>
            <el-table-column label="Thành tiền">
              <template slot-scope="scope">{{scope.row.so_luong * scope.row.don_gia}}</template>
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
          <label>Tổng thanh toán: {{form.tong_tien}} vnđ</label>
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
          style="float: right"
          icon="el-icon-check"
          class="primary-button"
          @click="submit('form')"
        >Cập nhật</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import { addSanPham, getDonHang } from "@/api/donhangnhacungcap";

export default {
  data() {
    return {
      active: 1,
      src: process.env.VUE_APP_BASE,
      form: {
        ma: new Date().getTime(),
        ten: null,
        thoi_gian: null,
        ghi_chu: null,
        tong_tien: null,
        chiet_khau: null,
        danhSachHang: []
      },
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      so_luong: null,
      don_vi_tinh: null,
      don_gia: null,
      rules: {
        ten: [
          { required: true, message: "Hãy nhập tên đơn hàng", trigger: "blur" },
          { min: 5, message: "Tên đơn hàng tối thiểu 5 ký tự", trigger: "blur" }
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không thể bỏ trống",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getSanPham();
    this.getData()
  },
  methods: {
    async getData(){
      let data = await getDonHang(this.$route.params.id)
      console.log(data.data)
      this.form.ma = data.data.ma
      this.form.thoi_gian = data.data.thoi_gian
      this.form.chiet_khau = data.data.chiet_khau
      this.form.tong_tien = data.data.tong_tien
      this.form.ten = data.data.ten
      if(data.data.trang_thai == 'moi_tao'){
        this.active = 1
      }
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 9999999
      });
      this.hangHoas = data.data.data;
    },
    doiSanPham(id) {
      this.hangHoa = this.hangHoas.find(el => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.so_luong && this.don_gia) {
        let data = {};
        data.hang_hoa = this.hangHoa;
        data.so_luong = this.so_luong;
        data.don_gia = this.don_gia;
        this.form.danhSachHang.push(data);
        for (let el of this.hangHoas) {
          if (this.hang_hoa_id == el.id) {
            el.disabled = true;
          }
        }
        this.hang_hoa_id = null;
        this.so_luong = null;
        this.don_gia = null;
        this.don_vi_tinh = null;
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
        data.reduce(
          (acc, el) => (acc += Number(el.don_gia) * Number(el.so_luong)),
          0
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.danhSachHang.length == 0) {
            this.$message({
              message: "Danh sách hàng hóa không thể bỏ trống",
              type: "warning"
            });
            return;
          }
          addSanPham(this.form)
            .then(res => {
              this.$message({
                message: "Tạo đơn hàng thành công",
                type: "success"
              });
              this.resetForm();
            })
            .catch(error => {
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
        ten: null,
        thoi_gian: null,
        ghi_chu: null,
        tong_tien: null,
        chiet_khau: null,
        danhSachHang: []
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.hangHoas = [];
      this.so_luong = null;
      this.don_vi_tinh = null;
      this.don_gia = null;
    }
  }
};
</script>
<style scoped>
</style>