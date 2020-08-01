<template>
  <div class="c-flex fh" style="padding-left: 20px; height: calc(100vh - 50px);overflow: hidden;">
    <div
      class="c-grow c-flex c-column"
      style="border-right: 2px solid #2E86C1; justify-content: space-between; flex: 1"
    >
      <div class="d-flex flex-collumn" style="flex: 1; min-height: 0">
        <el-form class="d-flex fill-height flex-collumn">
          <el-row :gutter="20">
            <br />
            <el-col :span="8">
              <el-form-item>
                <el-input placeholder="Tìm kiếm sản phẩm" v-model="timKiem">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-select
                clearable
                v-model="danh_muc_id"
                placeholder="Danh mục sản phẩm"
                filterable
                @change="getSanPham()"
              >
                <el-option
                  v-for="item in danhMucs"
                  :key="item.id"
                  :label="item.ten_danh_muc"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-select
                  clearable
                  filterable
                  style="width: 100%"
                  v-model="form.bang_gia_id"
                  placeholder="Chọn bảng giá"
                  @change="chonBangGia(form.bang_gia_id)"
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
                <a href="/quanlydonhang/taodondathang" target="_blank">
                  <el-button circle icon="el-icon-plus" class="success-button"></el-button>
                </a>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="d-flex" style="flex: 1; min-height: 0; overflow-y: auto">
            <div style="width: 100%">
              <el-table
                show-summary
                :data="form.danhSachHang"
                style="width: 100%;"
                :summary-method="tongTien"
              >
                <el-table-column type="index" label="STT" width="100px"></el-table-column>
                <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
                <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column>
                <el-table-column label="Số lượng" width="150px">
                  <template slot-scope="scope">
                    <el-input-number size="small" :min="0.1" v-model="scope.row.so_luong"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="don_gia" label="Đơn giá">
                  <template slot-scope="scope">{{formate.formatCurrency( scope.row.don_gia)}} đ</template>
                </el-table-column>
                <el-table-column label="Thành tiền">
                  <template
                    slot-scope="scope"
                  >{{formate.formatCurrency(Math.ceil(scope.row.so_luong * scope.row.don_gia))}} đ</template>
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
            </div>
          </div>
        </el-form>
      </div>
      <div
        class="c-column"
        style="padding-bottom: 20px; border-top: 1px solid #2E86C1; background-color: #58D68D; padding-left: 20px; padding-right: 20px"
      >
        <el-row :gutter="20">
          <br />
          <el-col :xl="3" :md="4" :sm="6" v-for="item in hangHoas" :key="item.id">
            <el-card :body-style="{ padding: '0px' }" v-show="!kiemTraDaChon(item.id)">
              <a @click="doiSanPham(item.id)">
                <img
                  :src="item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src"
                  class="image"
                />
              </a>
              <div style="padding: 14px;">
                <span
                  style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden !important; text-overflow: ellipsis;"
                >{{item.ten_san_pham}}</span>
                <div class="bottom clearfix">
                  <time
                    class="time"
                  >{{ formate.formatCurrency(item.gia_ban) }} đ/{{item.don_vi_tinh}}</time>
                </div>
                <!-- <div class="bottom clearfix">
                  <el-button
                    :disabled="kiemTraDaChon(item.id)"
                    type="text"
                    class="button"
                    @click="doiSanPham(item.id)"
                  >Lựa chọn</el-button>
                </div>-->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      class="fh c-flex c-column"
      style="padding-left: 15px; padding-right: 10px; background-color: #F2F4F4; min-width: 320px;"
    >
      <div style="margin-top: 10px;">
        <div style="font-size: 16px; color: #196F3D; font-weight: bold">Thông tin đơn hàng</div>
        <br />
        <el-button
          size="small"
          @click="form.trang_thai = 'hoa_don'"
          :class="form.trang_thai == 'hoa_don' ? 'success-button' : ''"
        >HÓA ĐƠN</el-button>
        <el-button
          size="small"
          :disabled="trang_thai == 'hoa_don'"
          :class="form.trang_thai == 'moi_tao' ? 'success-button' : ''"
          @click="form.trang_thai = 'moi_tao'"
        >ĐẶT HÀNG</el-button>
        <el-tooltip class="item" effect="dark" content="In hóa đơn" placement="top">
          <el-button
            @click="inHoaDon()"
            v-if="trang_thai == 'hoa_don'"
            size="small"
            class="primary-button"
            icon="el-icon-printer"
          ></el-button>
        </el-tooltip>
        <br />
        <br />
        <el-form
          label-position="left"
          label-width="130px"
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
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
            <el-button
              circle
              size="mini"
              icon="el-icon-info"
              class="success-button"
              @click="showInfo"
            ></el-button>
          </el-form-item>
          <el-form-item label="Ghi chú">
            <el-input size="small" type="textarea" v-model="form.ghi_chu"></el-input>
          </el-form-item>
          <el-form-item label="Tổng tiền">{{formate.formatCurrency(form.tong_tien)}} đ</el-form-item>
          <el-form-item label="Giảm giá">
            <el-input size="small" v-model="form.giam_gia"></el-input>
          </el-form-item>
          <el-form-item label="Đã thanh toán" v-if="form.trang_thai != 'hoa_don'">
            <el-input size="small" v-model="form.da_thanh_toan"></el-input>
          </el-form-item>
          <el-form-item
            label="Tổng thanh toán"
            v-else
          >{{formate.formatCurrency(form.tong_tien - form.giam_gia)}} đ</el-form-item>
          <el-form-item
            size="mini"
            v-if="form.trang_thai != 'hoa_don'"
            label="Phải thanh toán"
          >{{formate.formatCurrency(form.con_phai_thanh_toan)}} đ</el-form-item>
          <el-form-item label="Phương thúc" v-if="form.trang_thai == 'hoa_don'" prop="thanh_toan">
            <el-select v-model="form.thanh_toan" placeholder="Phương thức thanh toán">
              <el-option value="tien_mat" label="Tiền mặt"></el-option>
              <el-option value="chuyen_khoan" label="Chuyển khoản"></el-option>
              <el-option value="cod" label="Ship COD"></el-option>
              <el-option value="tai_khoan" label="Tài khoản"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Shipper" v-if="form.trang_thai == 'hoa_don'">
            <el-select
              size="small"
              v-model="form.nhan_vien_giao_hang"
              filterable
              placeholder="Chọn nhân viên giao hàng"
            >
              <el-option v-for="item in shipper" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <br />
      <el-row>
        <el-col :span="23" v-if="trang_thai == 'moi_tao'">
          <el-button size="small" icon="el-icon-close" type="warning" @click="huyDon()">HỦY ĐƠN</el-button>
          <el-button
            size="small"
            v-if="form.trang_thai == 'moi_tao'"
            icon="el-icon-check"
            class="success-button"
            @click="submit('form')"
          >CẬP NHẬT</el-button>
          <el-button
            size="small"
            v-if="form.trang_thai == 'hoa_don'"
            icon="el-icon-check"
            class="success-button"
            @click="submit('form')"
          >THANH TOÁN</el-button>
        </el-col>
        <div
          style="height: 80px; width: 250px; border: 3px solid #E74C3C; display: flex; align-items:center; justify-content: center; border-radius: 10px"
          v-if="trang_thai != 'moi_tao'"
        >
          <p
            style="color: #E74C3C; font-weight: bold; font-size: 24px"
            v-if="trang_thai == 'huy_bo'"
          >ĐÃ HỦY ĐƠN</p>
          <p
            style="color: #E74C3C; font-weight: bold; font-size: 24px"
            v-if="trang_thai == 'huy_hoa_don'"
          >HỦY HÓA ĐƠN</p>
          <p
            style="color: #E74C3C; font-weight: bold; font-size: 24px"
            v-if="trang_thai == 'hoa_don'"
          >ĐÃ THANH TOÁN</p>
        </div>
      </el-row>

      <el-dialog title="THÔNG TIN KHÁCH HÀNG" :visible.sync="showUserDetail" width="600px" center>
        <div style="display: flex; align-items: center; flex-direction: column">
          <div v-if="UserInfo.user && UserInfo.user.avatar_url">
            <img
              :src="endPointImage + UserInfo.user.avatar_url"
              style="height: 100px; width: auto; border-radius: 10px"
            />
          </div>
          <div v-else>
            <img
              :src="endPointImage + 'images/avatar/avatar_for_none.png'"
              style="height: 100px; width: auto"
            />
          </div>

          <div>
            <el-rate disabled v-model="UserInfo.tin_nhiem" :colors="colors"></el-rate>
          </div>
        </div>
        <el-row style="margin-top: 50px;">
          <el-form label-position="left" label-width="110px" size="small">
            <el-col :span="14" :offset="1">
              <el-form-item label="Khách hàng: ">{{UserInfo.ten}}</el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="Số điện thoại: ">{{UserInfo.so_dien_thoai}}</el-form-item>
            </el-col>
            <el-col :span="14" :offset="1">
              <el-form-item label="Địa chỉ Email: ">{{UserInfo.email}}</el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="Số dư TK: ">{{formate.formatCurrency(UserInfo.so_du)}} đ</el-form-item>
            </el-col>
            <el-col :span="23" :offset="1">
              <el-form-item label="Địa chỉ: ">{{UserInfo.dia_chi}}</el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button
            class="primary-button"
            @click="showUserDetail = false"
            icon="el-icon-close"
          >Đóng</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import { getKhachHang } from "@/api/khachhang";
import { getBangGia } from "@/api/banggia";
import { index } from "@/api/danhmucsanpham";
import {
  editDonDathang,
  getChiTietDonDathang,
  huyDon,
  chuyenHoaDon,
  getShipper,
} from "@/api/dondathang";
export default {
  data() {
    return {
      showUserDetail: false,
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
        nhan_vien_giao_hang: null,
        trang_thai: "moi_tao",
        bang_gia_id: null,
        thanh_toan: null,
      },
      danh_muc_id: null,
      formate: formate,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      trang_thai: "moi_tao",
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
      shipper: [],
      UserInfo: {},
      danhMucs: [],
      rules: {
        ten: [
          { required: true, message: "Hãy nhập tên đơn hàng", trigger: "blur" },
          {
            min: 5,
            message: "Tên đơn hàng tối thiểu 5 ký tự",
            trigger: "blur",
          },
        ],
        thanh_toan: [
          {
            required: true,
            message: "Phương thức thanh toán không thể bỏ trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getSanPham();
    this.getKhachHang();
    this.getData();
    this.getBangGia();
    this.nhanVienGiaoHang();
    this.getDanhMuc();
  },
  watch: {
    timKiem() {
      this.getSanPham();
    },
    "form.giam_gia": function (val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.da_thanh_toan - val;
    },

    "form.da_thanh_toan": function (val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.giam_gia - val;
    },
    "form.tong_tien": function (val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.giam_gia - this.form.da_thanh_toan;
    },
  },
  methods: {
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    async getData() {
      let data = await getChiTietDonDathang(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.ten = data.data.ten;
      this.form.ghi_chu = data.data.ghi_chu;
      this.form.tong_tien = data.data.tong_tien;
      this.form.da_thanh_toan = data.data.da_thanh_toan;
      this.form.trang_thai = data.data.trang_thai;
      this.trang_thai = data.data.trang_thai;
      this.form.khach_hang_id = data.data.user_id;
      this.form.giam_gia = data.data.giam_gia;
      this.form.con_phai_thanh_toan = data.data.con_phai_thanh_toan;
      this.form.nhan_vien_giao_hang = data.data.nhan_vien_giao_hang;
      this.form.bang_gia_id = data.data.bang_gia_id;
      this.form.thanh_toan = data.data.thanh_toan;

      this.form.danhSachHang = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        item.don_gia = sp.gia_ban;
        item.so_luong = sp.so_luong;
        item.hang_hoa = sp.san_pham;
        this.form.danhSachHang.push(item);
      }
    },
    showInfo() {
      this.UserInfo = this.nhaCungCaps.find(
        (el) => el.user_id == this.form.khach_hang_id
      );
      if (this.UserInfo) {
        this.showUserDetail = true;
      } else this.UserInfo = {};
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 6,
        search: this.timKiem,
        danh_muc_id: this.danh_muc_id,
      });
      this.hangHoas = data.data.data;
    },
    doiSanPham(id) {
      const cBangGia = this.bangGias.find(
        (el) => el.id === this.form.bang_gia_id
      );
      this.hang_hoa_id = id;
      this.hangHoa = this.hangHoas.find((el) => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
      if (cBangGia) {
        const findSp = cBangGia.san_pham.find((i) => i.san_pham_id === id);
        if (findSp) this.don_gia = findSp.gia_ban;
        else this.don_gia = this.hangHoa.gia_ban;
      } else {
        this.don_gia = this.hangHoa.gia_ban;
      }

      this.addSanPham();
    },
    async getBangGia() {
      let data = await getBangGia({
        per_page: 9999999,
      });
      this.bangGias = data.data.data;
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
      let a = this.form.danhSachHang.find((el) => el.hang_hoa.id == SanPhamID);
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.danhSachHang.length == 0) {
            this.$message({
              message: "Danh sách hàng hóa không thể bỏ trống",
              type: "warning",
            });
            return;
          }
          editDonDathang(this.$route.params.id, this.form).then((res) => {
            this.$message({
              message: "Cập nhật đơn hàng thành công",
              type: "success",
            });
          });
          this.getData().catch((error) => {
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
        con_phai_thanh_toan: 0,
        thanh_toan: null,
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.so_luong = null;
      this.don_vi_tinh = null;
      this.don_gia = null;
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
    async getBangGia() {
      let data = await getBangGia({
        per_page: 9999999,
      });
      this.bangGias = data.data.data;
    },
    chonBangGia(id) {
      if (id) {
        let bangGia = this.bangGias.find((el) => el.id == id);
        this.form.danhSachHang.map((el) => {
          const findIndex = bangGia.san_pham.findIndex(
            (i) => i.san_pham_id === el.hang_hoa.id
          );
          if (findIndex !== -1) {
            el.don_gia = bangGia.san_pham[findIndex].gia_ban;
          }
        });
      } else {
        this.form.danhSachHang.map((el) => {
          el.don_gia = el.hang_hoa.gia_ban;
        });
      }
    },
    inHoaDon() {
      window.open(
        process.env.VUE_APP_BASE_API + "inhoadon/" + this.$route.params.id,
        "_blank"
      );
    },
    async huyDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn hủy đơn đặt hàng hàng này",
          "Hủy đơn đặt hàng",
          {
            confirmButtonText: "Đồng y",
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await huyDon(this.$route.params.id);
        this.getData();
        this.$message({
          message: "Hủy đơn thành công",
          type: "success",
        });
      } catch (error) {}
    },
    nhanVienGiaoHang() {
      getShipper().then((res) => {
        this.shipper = res;
      });
    },
    async hoaDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn chuyển hóa đơn cho đơn đặt hàng hàng này",
          "Chuyển hóa đơn",
          {
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await chuyenHoaDon(this.$route.params.id, {
          thanh_toan: this.form.thanh_toan,
          khach_hang_id: this.form.khach_hang_id,
          nhan_vien_giao_hang: this.form.nhan_vien_giao_hang,
        });
        this.getData();
        this.$message({
          message: "Thanh toán thành công",
          type: "success",
        });
      } catch (error) {}
    },
  },
};
</script>
<style scoped>
.flex-collumn {
  flex-direction: column;
}
.d-flex {
  display: flex;
}
.fill-height {
  height: 100%;
}
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