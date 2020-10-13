<template>
  <div class="app-container">
    <h3>Cập nhật đơn hàng</h3>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-steps
          :active="active"
          finish-status="success"
          v-if="form.trang_thai != 'huy_bo'"
        >
          <el-step title="Tạo đơn"></el-step>
          <el-step title="Nhận đơn"></el-step>
          <el-step title="Nhập kho"></el-step>
        </el-steps>
        <el-steps
          :active="3"
          finish-status="success"
          v-if="form.trang_thai == 'huy_bo'"
        >
          <el-step title="Tạo đơn"></el-step>
          <el-step title="Nhận đơn"></el-step>
          <el-step title="Hủy đơn"></el-step>
        </el-steps>
      </el-col>
      <!-- <el-col :span="4" :offset="10">
        <el-button>In</el-button>
      </el-col>-->
    </el-row>
    <br />
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <br />
        <div style="font-size: 16px; color: #1f618d; font-weight: bold">
          1. Thông tin đơn hàng
        </div>
        <br />
        <el-col :span="6">
          <el-form-item label="Mã đơn hàng">
            <el-input v-model="form.ma" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="admin ? 4 : 6">
          <el-form-item label="Tên đơn hàng" prop="ten">
            <el-input :disabled="!admin" v-model="form.ten"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="admin ? 4 : 6">
          <el-form-item label="Thời gian nhận hàng" prop="thoi_gian">
            <br />
            <el-date-picker
              :disabled="!admin"
              style="width: 100%"
              v-model="form.thoi_gian"
              type="datetime"
              placeholder="Nhập thời gian"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="admin">
          <el-form-item label="Nhà cung cấp">
            <el-select
              :disabled="true"
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
            <el-input
              :disabled="!admin"
              type="textarea"
              v-model="form.ghi_chu"
            ></el-input>
          </el-form-item>
        </el-col>
        <br />
        <div style="font-size: 16px; color: #1f618d; font-weight: bold">
          2. Sản phẩm, hàng hóa
        </div>
        <br />
        <el-col :span="6">
          <el-form-item label="Hàng hóa, sản phẩm">
            <br />
            <el-select
              :disabled="!admin"
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
          <el-form-item label="Số lượng">
            <el-input
              :disabled="!admin"
              type="number"
              :min="0"
              v-model="so_luong"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Đơn vị tính">
            <el-input :disabled="true" v-model="don_vi_tinh"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Đơn giá">
            <el-input :disabled="true" v-model="don_gia" :min="0" type="number">
              <template slot="append">VNĐ</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <br />
            <el-button
              icon="el-icon-plus"
              class="primary-button"
              @click="addSanPham()"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="In hóa đơn"
              placement="top-start"
            >
              <el-button
                icon="el-icon-printer"
                class="primary-button"
                @click="inDonHang()"
              ></el-button>
            </el-tooltip>
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
            max-height="500px"
          >
            <el-table-column
              type="index"
              label="STT"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="hang_hoa.ten_san_pham"
              label="Hàng hóa"
            ></el-table-column>
            <el-table-column
              prop="hang_hoa.don_vi_tinh"
              label="Đơn vị tính"
            ></el-table-column>
            <el-table-column prop="so_luong" label="Số lượng"></el-table-column>
            <el-table-column prop="so_luong_thuc_te" label="Số lượng thực tế">
              <template scope="scope">
                <el-input-number
                  size="small"
                  v-model="scope.row.so_luong_thuc_te"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="don_gia" label="Đơn giá">
              <template slot-scope="scope"
                >{{ formate.formatCurrency(scope.row.don_gia) }} đ</template
              >
            </el-table-column>
            <el-table-column label="Thành tiền">
              <template slot-scope="scope"
                >{{
                  formate.formatCurrency(scope.row.so_luong * scope.row.don_gia)
                }}
                đ</template
              >
            </el-table-column>
            <el-table-column v-if="admin" label="Xóa">
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
          <label
            >Tổng thanh toán:
            {{ formate.formatCurrency(form.tong_tien) }} vnđ</label
          >
        </el-col>
      </el-row>
    </el-form>
    <br />
    <el-row>
      <el-col :span="12">
        <el-button icon="el-icon-back" type="warning" @click="back()"
          >Quay lại</el-button
        >
        <el-button
          v-if="
            form.trang_thai != 'huy_bo' &&
            form.trang_thai != 'hoan_thanh' &&
            form.trang_thai != 'nhap_kho_ngoai' &&
            form.trang_thai != 'nhap_kho'
          "
          style="float: right"
          icon="el-icon-close"
          type="danger"
          @click="huyDon()"
          >Hủy đơn</el-button
        >
      </el-col>
      <el-col :span="6" :offset="4">
        <el-row
          v-if="
            form.trang_thai != 'nhap_kho' &&
            form.trang_thai != 'huy_bo' &&
            form.trang_thai != 'nhap_kho_ngoai'
          "
        >
          <!-- <el-col :span="8">
            <el-button
              v-if="
                form.trang_thai != 'huy_bo' && form.trang_thai != 'hoan_thanh'
              "
              style="float: right"
              icon="el-icon-close"
              type="danger"
              @click="huyDon()"
              >Hủy đơn</el-button
            >
          </el-col> -->
          <el-col :span="8">
            <el-button
              v-if="form.trang_thai == 'moi_tao'"
              style="float: right"
              icon="el-icon-check"
              type="success"
              @click="duyetDon()"
              >Nhận đơn</el-button
            >
            <el-button
              v-if="form.trang_thai == 'da_duyet' && admin"
              style="float: right"
              icon="el-icon-s-home"
              type="success"
              @click="showNhapKho()"
              >Nhập kho</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              v-if="
                form.trang_thai != 'huy_bo' &&
                form.trang_thai != 'hoan_thanh' &&
                admin
              "
              style="float: right"
              icon="el-icon-edit"
              class="primary-button"
              @click="submit('form')"
              >Cập nhật</el-button
            >
          </el-col>
        </el-row>
        <el-row
          v-if="
            form.trang_thai == 'nhap_kho' || form.trang_thai == 'nhap_kho_ngoai'
          "
        >
          <div
            style="
              height: 80px;
              width: 250px;
              border: 3px solid red;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 10px;
            "
          >
            <p style="color: red; font-weight: bold; font-size: 24px">
              ĐÃ NHẬP KHO
            </p>
          </div>
        </el-row>
        <el-row v-if="form.trang_thai == 'huy_bo'">
          <div
            style="
              height: 80px;
              width: 250px;
              border: 3px solid #e74c3c;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 10px;
            "
          >
            <p style="color: #e74c3c; font-weight: bold; font-size: 24px">
              ĐÃ HỦY ĐƠN
            </p>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      title="Nhập kho"
      :visible.sync="showFormNhapKho"
      width="20%"
      center
    >
      <el-form>
        <el-form-item label="Kho hàng">
          <br />
          <el-select
            v-model="kho_id"
            filterable
            placeholder="Chọn kho hàng"
            style="width: 100%"
          >
            <el-option
              v-for="item in khos"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Số tiền thanh toán cho NCC (VNĐ)">
          <el-input-number
            :step="100"
            :min="0"
            :max="form.tong_tien"
            v-model="so_tien_thanh_toan"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          size="small"
          icon="el-icon-close"
          @click="showFormNhapKho = false"
          >Hủy bỏ</el-button
        >
        <el-button
          class="primary-button"
          icon="el-icon-s-home"
          @click="nhapKho()"
          >Nhập kho</el-button
        >
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
  getSanPhamNhaCungCap,
} from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";
import { getKho } from "@/api/kho";
import { getInfor } from "@/api/taikhoan";

export default {
  data() {
    return {
      active: 1,
      src: process.env.VUE_APP_BASE,
      so_tien_thanh_toan: 0,
      form: {
        ma: null,
        ten: null,
        thoi_gian: null,
        ghi_chu: null,
        tong_tien: null,
        chiet_khau: null,
        danhSachHang: [],
        nha_cung_cap_id: null,
      },
      formate: formate,
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
    // this.getSanPham();
    this.getData();
    this.getKho();
    this.getNhaCungCap();
    this.getInfo();
  },
  methods: {
    async getData() {
      let data = await getDonHang(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.thoi_gian = data.data.thoi_gian;
      this.form.chiet_khau = data.data.chiet_khau;
      this.form.tong_tien = data.data.tong_tien;
      this.form.ten = data.data.ten;
      this.form.trang_thai = data.data.trang_thai;
      this.form.nha_cung_cap_id = data.data.user_id;
      if (data.data.trang_thai == "moi_tao") {
        this.active = 1;
      }
      if (data.data.trang_thai == "da_duyet") {
        this.active = 2;
      }
      if (data.data.trang_thai == "nhap_kho") {
        this.active = 3;
      }
      this.form.danhSachHang = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        if (sp.so_luong_thuc_te == null || sp.so_luong_thuc_te == undefined) {
          item.so_luong_thuc_te = sp.so_luong;
        } else {
          item.so_luong_thuc_te = sp.so_luong_thuc_te;
        }
        item.don_gia = sp.don_gia;
        item.so_luong = sp.so_luong;
        item.hang_hoa = sp.san_pham;
        this.form.danhSachHang.push(item);
      }
      let sanp = await getSanPhamNhaCungCap({
        nha_cung_cap_id: this.form.nha_cung_cap_id,
      });
      this.hangHoas = sanp;
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 9999999,
      });
      this.hangHoas = data.data.data;
    },
    doiSanPham(id) {
      this.hangHoa = this.hangHoas.find((el) => el.san_pham_id == id);
      this.don_vi_tinh = this.hangHoa.san_pham.don_vi_tinh;
      this.don_gia = this.hangHoa.don_gia;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.so_luong && this.don_gia) {
        let data = {};
        data.hang_hoa = this.hangHoa.san_pham;
        data.so_luong = this.so_luong;
        data.so_luong_thuc_te = this.so_luong
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
    inDonHang() {
      window.open(
        process.env.VUE_APP_BASE_API +
          "inhoadonnhacungcap/" +
          this.$route.params.id,
        "_blank"
      );
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
          updateDonHang(this.$route.params.id, this.form)
            .then((res) => {
              this.$message({
                message: "Cập nhật đơn hàng thành công",
                type: "success",
              });
              this.getData();
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
    async duyetDon() {
      await duyetDon(this.$route.params.id);
      this.$message({
        message: "Duyệt đơn thành công",
        type: "success",
      });
      this.getData();
    },
    async huyDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn hủy đơn hàng này",
          "Hủy đơn hàng NCC",
          {
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Thoát",
            type: "warning",
          }
        );
        let data = await huyDon(this.$route.params.id);
        this.$message({
          message: "Hủy đơn thành công",
          type: "success",
        });
        this.getData();
      } catch (console) {}
    },
    showNhapKho() {
      this.showFormNhapKho = true;
    },
    nhapKho() {
      nhapKho(this.$route.params.id, {
        kho_id: this.kho_id,
        so_tien_thanh_toan: this.so_tien_thanh_toan,
      }).then((res) => {
        this.$message({
          message: "Nhập kho thành công",
          type: "success",
        });
        this.kho_id = null;
        this.showFormNhapKho = false;
        this.getData();
      });
    },
    async getKho() {
      let data = await getKho();
      this.khos = data;
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
  },
};
</script>
<style scoped>
</style>