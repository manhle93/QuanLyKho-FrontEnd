<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16" style="border-right: 2px solid #2E86C1">
        <el-form>
          <el-row :gutter="20">
            <br />
            <el-col :span="12">
              <el-form-item>
                <el-input placeholder="Tìm kiếm sản phẩm" v-model="timKiem" @change="getSanPham()">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-select
                  clearable
                  filterable
                  style="width: 100%"
                  v-model="bang_gia_id"
                  placeholder="Chọn bảng giá"
                  @change="chonBangGia(bang_gia_id)"
                >
                  <el-option
                    v-for="item in bangGias"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                show-summary
                :data="form.danhSachHang"
                style="width: 100%"
                :summary-method="tongTien"
                height="350"
              >
                <el-table-column type="index" label="STT" width="100px"></el-table-column>
                <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
                <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column>
                <el-table-column label="Số lượng" width="150px">
                  <template slot-scope="scope">
                    <el-input-number size="small" :min="0.1" v-model="scope.row.so_luong"></el-input-number>
                  </template>
                </el-table-column>
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
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="7" :offset="1">
        <div style="margin-top: 20px;">
          <div style="font-size: 16px; color: #1F618D; font-weight: bold">Thông tin đơn hàng</div>
          <br />
          <el-form
            label-position="left"
            label-width="200px"
            ref="form"
            :model="form"
            :rules="rules"
          >
            <el-form-item label="Tên đơn hàng" prop="ten">
              <el-input size="small" style="width: 90%" v-model="form.ten"></el-input>
            </el-form-item>
            <el-form-item label="Khách hàng">
              <el-select
                size="small"
                style="width: 90%"
                v-model="form.khach_hang_id"
                filterable
                placeholder="Chọn khách hàng"
              >
                <el-option
                  v-for="item in nhaCungCaps"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.user_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Ghi chú">
              <el-input size="small" style="width: 90%" type="textarea" v-model="form.ghi_chu"></el-input>
            </el-form-item>
            <el-form-item label="Tổng thanh toán">{{form.tong_tien}} đ</el-form-item>
            <el-form-item label="Giảm giá">
              <el-input size="small" style="width: 90%" v-model="form.giam_gia"></el-input>
            </el-form-item>
            <el-form-item label="Đã thanh toán">
              <el-input size="small" style="width: 90%" v-model="form.da_thanh_toan"></el-input>
            </el-form-item>
            <el-form-item label="Phải thanh toán">{{form.con_phai_thanh_toan}} đ</el-form-item>
          </el-form>
        </div>
        <br />
        <el-row>
          <el-col :span="23">
            <el-button
              style="float: right"
              icon="el-icon-plus"
              class="primary-button"
              @click="submit('form')"
            >ĐẶT HÀNG</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="20" style="border-top: 2px solid #2E86C1">
      <br />
      <el-col :span="3" v-for="item in hangHoas" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src" class="image" />
          <div style="padding: 14px;">
            <span>{{item.ten_san_pham}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.gia_ban }} đ/{{item.don_vi_tinh}}</time>
              <el-button
                :disabled="kiemTraDaChon(item.id)"
                type="text"
                class="button"
                @click="doiSanPham(item.id)"
              >Lựa chọn</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br />
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import { getKhachHang } from "@/api/khachhang";

import {
  getBangGia,
  editDonDathang,
  getChiTietDonDathang,
  huyDon,
  chuyenHoaDon
} from "@/api/dondathang";
export default {
  data() {
    return {
      active: 0,
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      form: {
        ma: "ĐĐH_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        tong_tien: null,
        da_thanh_toan: null,
        danhSachHang: [],
        khach_hang_id: null,
        da_thanh_toan: 0,
        giam_gia: 0,
        con_phai_thanh_toan: 0
      },
      bang_gia_id: null,
      admin: false,
      timKiem: null,
      nhaCungCaps: [],
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      bangGias: [],
      so_luong: 1,
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
    this.getKhachHang();
    this.getData();
  },
  watch: {
    "form.giam_gia": function(val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.da_thanh_toan - val;
    },

    "form.da_thanh_toan": function(val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.giam_gia - val;
    },
    "form.tong_tien": function(val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.giam_gia - this.form.da_thanh_toan;
    }
  },
  methods: {
    async getData() {
      let data = await getChiTietDonDathang(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.ten = data.data.ten;
      this.form.ghi_chu = data.data.ghi_chu;
      this.form.tong_tien = data.data.tong_tien;
      this.form.da_thanh_toan = data.data.da_thanh_toan;
      this.form.trang_thai = data.data.trang_thai;
      this.form.khach_hang_id = data.data.user_id;
      this.form.giam_gia = data.data.giam_gia;
      this.form.con_phai_thanh_toan = data.data.con_phai_thanh_toan;

      this.form.danhSachHang = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        item.don_gia = sp.gia_ban;
        item.so_luong = sp.so_luong;
        item.hang_hoa = sp.san_pham;
        this.form.danhSachHang.push(item);
      }
    },

    async getSanPham() {
      let data = await listSanPham({
        per_page: 7,
        search: this.timKiem
      });
      this.hangHoas = data.data.data;
    },
    doiSanPham(id) {
      const cBangGia = this.bangGias.find(el => el.id === this.bang_gia_id);
      this.hang_hoa_id = id;
      this.hangHoa = this.hangHoas.find(el => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
      if (cBangGia) {
        const findSp = cBangGia.san_pham.find(i => i.san_pham_id === id);
        if (findSp) this.don_gia = findSp.gia_ban;
        else this.don_gia = this.hangHoa.gia_ban;
      } else {
        this.don_gia = this.hangHoa.gia_ban;
      }

      this.addSanPham();
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
        this.so_luong = 1;
        this.don_gia = null;
        this.don_vi_tinh = null;
        this.hangHoa = {};
      }
    },
    kiemTraDaChon(SanPhamID) {
      let a = this.form.danhSachHang.find(el => el.hang_hoa.id == SanPhamID);
      if (a) return true;
      return false;
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
      this.form.tong_tien = data.reduce(
        (acc, el) => (acc += Number(el.don_gia) * Number(el.so_luong)),
        0
      );
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
          editDonDathang(this.$route.params.id, this.form)
            .then(res => {
              this.$message({
                message: "Cập nhật đơn hàng thành công",
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
        ma: "ĐĐH_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        tong_tien: null,
        da_thanh_toan: null,
        danhSachHang: [],
        khach_hang_id: null,
        da_thanh_toan: 0,
        giam_gia: 0,
        con_phai_thanh_toan: 0
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.so_luong = null;
      this.don_vi_tinh = null;
      this.don_gia = null;
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999
      });
      this.nhaCungCaps = data.data.data;
    },
    async getBangGia() {
      let data = await getBangGia({
        per_page: 9999999
      });
      this.bangGias = data.data.data;
    },
    chonBangGia(id) {
      if (id) {
        let bangGia = this.bangGias.find(el => el.id == id);
        this.form.danhSachHang.map(el => {
          const findIndex = bangGia.san_pham.findIndex(
            i => i.san_pham_id === el.hang_hoa.id
          );
          if (findIndex !== -1) {
            el.don_gia = bangGia.san_pham[findIndex].gia_ban;
          }
        });
      } else {
        this.form.danhSachHang.map(el => {
          el.don_gia = el.hang_hoa.gia_ban;
        });
      }
    },
    async huyDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn hủy đơn đặt hàng hàng này",
          "Hủy đơn đặt hàng",
          {
            confirmButtonText: "Đồng y",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        let status = await huyDon(this.$route.params.id);
        this.getData();
        this.$message({
          message: "Hủy đơn thành công",
          type: "success"
        });
      } catch (error) {}
    },
    async hoaDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn chuyển hóa đơn cho đơn đặt hàng hàng này",
          "Chuyển hóa đơn",
          {
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        let status = await chuyenHoaDon(this.$route.params.id);
        this.getData();
        this.$message({
          message: "Hủy đơn thành công",
          type: "success"
        });
      } catch (error) {}
    }
  }
};
</script>
<style scoped>
.el-select-dropdown__item {
  height: auto;
}
.condau {
  height: 80px;
  width: 250px;
  border: 3px solid #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
  height: 130px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>