<template>
  <div class="app-container">
    <h3 style="margin-left: 20px">Cập nhật báo giá</h3>
    <br />
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20" style="margin-left: 20px">
        <br />
        <div style="font-size: 16px; color: #1F618D; font-weight: bold">1. Thông tin báo giá</div>
        <br />
        <el-col :span="3">
          <el-form-item label="Mã đơn hàng">
            <el-input v-model="form.ma" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Tên báo giá" prop="ten">
            <el-input v-model="form.ten"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="admin">
          <el-form-item label="Nhà cung cấp">
            <el-select
              style="width: 100%"
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
      </el-row>

      <div
        style="font-size: 16px; color: #1F618D; font-weight: bold; margin-left: 20px"
      >2. Sản phẩm, hàng hóa</div>
      <br />
      <el-row style="margin-left: 20px">
        <el-col :span="20">
          <el-table
            height="350px"
            :data="form.danhSachHang"
            style="width: 80%"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" label="Lựa chọn"></el-table-column>
            <el-table-column type="index" label="STT" width="100px"></el-table-column>
            <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
            <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column>
            <el-table-column prop="don_gia" label="Giá giao">
              <template slot-scope="scope">{{formate.formatCurrency(scope.row.don_gia)}} đ</template>
            </el-table-column>
            <el-table-column prop="gia_khuyen_cao" label="Giá khuyến cáo">
              <template slot-scope="scope">{{formate.formatCurrency(scope.row.gia_khuyen_cao)}} đ</template>
            </el-table-column>
            <el-table-column label="Giá bán" v-if="admin">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  circle
                  icon="el-icon-edit"
                  class="primary-button"
                  @click="addGiaBan(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <br />
    <el-row>
      <el-col :span="10">
        <el-button icon="el-icon-back" type="warning" @click="back()">Quay lại</el-button>
      </el-col>
      <el-col :span="7">
        <el-button
          v-if="admin"
          style="float: right"
          class="primary-button"
          @click="submit('form')"
        >DUYỆT BÁO GIÁ</el-button>
      </el-col>
    </el-row>

    <el-dialog title="CẬP NHẬT GIÁ BÁN" :visible.sync="showAddGia" width="25%" center>
      <el-form>
        <el-form-item label="Sản phẩm">
          <el-input :disabled="true" v-model="sanPham.ten_san_pham" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Giá khuyến cáo">
          <el-input size="small" :disabled="true" v-model="sanPham.gia_khuyen_cao"></el-input>
        </el-form-item>
        <el-form-item label="Giá bán">
          <el-input size="small" v-model="sanPham.gia_ban"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" @click="showAddGia = false">Hủy bỏ</el-button>
        <el-button class="primary-button" size="small" @click="capNhatGiaban">Xác nhận</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import {
  addSanPham,
  getDonHang,
  updateDonHang,
  duyetDon,
  huyDon,
  nhapKho,
} from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";
import { getKho } from "@/api/kho";
import { getInfor } from "@/api/taikhoan";

import { getChiTietBaoGia, duyetBaoGia, updateGiaBan } from "@/api/baogia";

export default {
  data() {
    return {
      active: 1,
      src: process.env.VUE_APP_BASE,
      showAddGia: false,
      form: {
        ma: new Date().getTime(),
        ten: null,
        thoi_gian: null,
        ghi_chu: null,
        tong_tien: null,
        chiet_khau: null,
        danhSachHang: [],
        nha_cung_cap_id: null,
      },
      formate: formate,
      sanPham: {
        id: null,
        ten_san_pham: null,
        gia_khuyen_cao: null,
        gia_ban: null,
      },
      multipleSelection: [],
      admin: false,
      khos: [],
      kho_id: null,
      showFormNhapKho: false,
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      so_luong: null,
      don_vi_tinh: null,
      don_gia: null,
      nhaCungCaps: [],
      san_pham_id: [],
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
    this.getData();
    this.getInfo();
  },
  methods: {
    async getData() {
      let data = await getChiTietBaoGia(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.ten = data.data.ten;
      this.form.nha_cung_cap_id = data.data.user_id;
      this.form.danhSachHang = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        item.id = sp.id;
        item.don_gia = sp.don_gia;
        item.gia_khuyen_cao = sp.gia_khuyen_cao;
        item.hang_hoa = sp.san_pham;
        item.lua_chon = sp.lua_chon;
        this.form.danhSachHang.push(item);
      }
      let toggleList = this.form.danhSachHang.filter((el) => el.lua_chon);
      setTimeout(() => {
        this.toggleSelection(toggleList);
      }, 0);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
          let sanphamID = [];
          if (this.multipleSelection.length > 0) {
            for (let i of this.multipleSelection) {
              sanphamID.push(i.id);
            }
          }
          duyetBaoGia(this.$route.params.id, { san_phams: sanphamID })
            .then((res) => {
              this.$message({
                message: "Cập nhật báo giá thành công",
                type: "success",
              });
              // this.resetForm();
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
      this.$router.push("/quanlydonhang/baogia");
    },
    resetForm() {
      this.form = {
        ma: new Date().getTime(),
        ten: null,
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
      this.kho_id = null;
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
    async getInfo() {
      let data = await getInfor();
      if (data.data.role_id == 1 || data.data.role_id == 2) {
        this.admin = true;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    addGiaBan(data) {
      this.showAddGia = true;
      this.sanPham.id = data.hang_hoa.id;
      this.sanPham.ten_san_pham = data.hang_hoa.ten_san_pham;
      this.sanPham.gia_khuyen_cao = data.gia_khuyen_cao;
      this.sanPham.gia_ban = data.hang_hoa.gia_ban;
    },
    capNhatGiaban() {
      updateGiaBan(this.sanPham).then((res) => {
        this.$message({
          message: "Cập nhật giá bán thành công",
          type: "success",
        });
        this.getData();
        this.showAddGia = false;
        this.sanPham.ten_san_pham = null;
        this.sanPham.gia_ban = null;
        this.sanPham.gia_khuyen_cao = null;
      });
    },
  },
};
</script>
<style scoped>
</style>