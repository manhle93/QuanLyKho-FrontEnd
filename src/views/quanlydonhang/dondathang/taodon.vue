<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18" style="border-right: 2px solid #2E86C1">
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
            <el-col :span="1">
              <el-form-item>
                <el-button circle icon="el-icon-plus" class="primary-button"></el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                show-summary
                :data="form.danhSachHang"
                style="width: 100%; height: calc(100vh - 450px)"
                :summary-method="tongTien"
                height="500"
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
        <el-row :gutter="20" style="border-top: 1px solid #2E86C1; height: 270px; background-color: #CCD1D1 ">
          <br />
          <el-col :xl="3" :md="4" :sm="6"  v-for="item in hangHoas" :key="item.id">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src" class="image" />
              <div style="padding: 14px;">
                <span style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden !important; text-overflow: ellipsis;">{{item.ten_san_pham}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.gia_ban }} đ/{{item.don_vi_tinh}}</time>
                </div>
                <div class="bottom clearfix">
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
      </el-col>
      <el-col :span="6" style="padding-left: 30px;height: calc(100vh - 120px); background-color: #FEF5E7">
        <div style="margin-top: 10px;">
          <div style="font-size: 16px; color: #1F618D; font-weight: bold">Thông tin đơn hàng</div>
          <br />
          <el-radio-group v-model="loai" size="small">
            <el-radio-button label="HÓA ĐƠN"></el-radio-button>
            <el-radio-button label="ĐẶT HÀNG"></el-radio-button>
          </el-radio-group>
          <br />
          <br />
          <el-form
            label-position="left"
            label-width="150px"
            ref="form"
            :model="form"
            :rules="rules"
          >
            <el-form-item label="Tên đơn hàng" prop="ten">
              <el-input size="small" v-model="form.ten"></el-input>
            </el-form-item>
            <el-form-item label="Khách hàng">
              <el-select
                size="small"
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
              <el-input size="small"  type="textarea" v-model="form.ghi_chu"></el-input>
            </el-form-item>
            <el-form-item label="Tổng tiền">{{form.tong_tien}} đ</el-form-item>
            <el-form-item label="Giảm giá">
              <el-input size="small" v-model="form.giam_gia"></el-input>
            </el-form-item>
            <el-form-item label="Đã thanh toán" v-if="loai != 'HÓA ĐƠN'">
              <el-input size="small"  v-model="form.da_thanh_toan"></el-input>
            </el-form-item>
            <el-form-item label="Tổng thanh toán" v-else>{{form.tong_tien - form.giam_gia}}</el-form-item>
            <el-form-item
              v-if="loai != 'HÓA ĐƠN'"
              label="Phải thanh toán"
            >{{form.con_phai_thanh_toan}} đ</el-form-item>
            <el-form-item label="Shipper" v-if="loai == 'HÓA ĐƠN'">
              <el-select
                size="small"
                
                v-model="form.nhan_vien_giao_hang"
                filterable
                placeholder="Chọn nhân viên giao hàng"
              >
                <el-option
                  v-for="item in shipper"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <br />
        <el-row>
          <el-col :span="23">
            <el-button
              v-if="loai == 'ĐẶT HÀNG'"
              style="float: right"
              icon="el-icon-plus"
              class="primary-button"
              @click="submit('form')"
            >ĐẶT HÀNG</el-button>
            <el-button
              v-else
              style="float: right"
              icon="el-icon-check"
              class="primary-button"
              @click="submit('form')"
            >THANH TOÁN</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import { addSanPham, getSanPhamNhaCungCap } from "@/api/donhangnhacungcap";
import { getKhachHang } from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";

import { addDonDatHang, getShipper } from "@/api/dondathang";
import { getBangGia } from "@/api/banggia";
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
        con_phai_thanh_toan: 0,
        nhan_vien_giao_hang: null
      },
      loai: "ĐẶT HÀNG",
      timKiem: null,
      bang_gia_id: null,
      admin: false,
      nhaCungCaps: [],
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      bangGias: [],
      so_luong: 1,
      don_vi_tinh: null,
      don_gia: null,
      shipper: [],
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
    this.getBangGia();
    this.nhanVienGiaoHang();
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
    async getSanPham() {
      let data = await listSanPham({
        per_page: 6,
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
    kiemTraDaChon(SanPhamID) {
      let a = this.form.danhSachHang.find(el => el.hang_hoa.id == SanPhamID);
      if (a) return true;
      return false;
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
          addDonDatHang(this.form)
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
    async getInfo() {
      let data = await getInfor();
      if (data.data.role_id == 1 || data.data.role_id == 2) {
        this.admin = true;
      }
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
    nhanVienGiaoHang() {
      getShipper().then(res => {
        this.shipper = res;
      });
    }
  }
};
</script>
<style scoped>
.el-select-dropdown__item {
  height: auto;
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