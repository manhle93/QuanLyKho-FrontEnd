<template>
  <div
    class="c-flex fh ttch"
    style="padding-left: 20px; height: calc(100vh - 50px); overflow: hidden"
  >
    <div
      class="c-grow c-flex c-column"
      style="
        border-right: 2px solid #2e86c1;
        justify-content: space-between;
        flex: 1;
      "
    >
      <div class="d-flex flex-collumn" style="flex: 1; min-height: 0">
        <div class="d-flex fill-height flex-collumn">
          <el-row :gutter="20">
            <br />
            <el-col :span="8">
              <el-select
                style="width: 100%"
                clearable
                remote
                reserve-keyword
                v-model="idSanPham"
                :remote-method="remoteMethod"
                placeholder="Hàng hóa, sản phẩm"
                filterable
                @change="doiSanPham(idSanPham)"
              >
                <el-option
                  :disabled="kiemTraDaChon(item.id)"
                  v-for="item in hangHoas"
                  :key="item.id"
                  :label="item.ten_san_pham"
                  :value="item.id"
                ></el-option>
              </el-select>
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
          </el-row>
          <br />
          <div class="d-flex" style="flex: 1; min-height: 0; overflow-y: auto">
            <div style="width: 80%">
              <el-table :data="form.danhSachHang" style="width: 100%">
                <el-table-column
                  type="index"
                  label="STT"
                  min-width="50px"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="hang_hoa.ten_san_pham"
                  label="Hàng hóa"
                ></el-table-column>
                <el-table-column
                  prop="hang_hoa.don_vi_tinh"
                  label="Đơn vị tính"
                ></el-table-column>
                <el-table-column
                  label="Tồn kho"
                  width="150px"
                  prop="so_luong_truoc_kiem_kho"
                ></el-table-column>
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
        </div>
      </div>
      <div class="sanpham">
        <transition name="bounce" v-for="item in hangHoas" :key="item.id">
          <div v-show="!kiemTraDaChon(item.id)">
            <el-card
              :body-style="{ padding: '0px' }"
              style="width: 140px; margin-right: 20px"
            >
              <a @click="doiSanPham(item.id)">
                <img
                  :src="
                    item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src
                  "
                  class="image"
                />
              </a>
              <div style="padding: 14px">
                <span
                  style="
                    font-size: 14px;
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden !important;
                    text-overflow: ellipsis;
                  "
                  >{{ item.ten_san_pham }}</span
                >
                <div class="bottom clearfix">
                  <time class="time"
                    >{{ formate.formatCurrency(item.gia_ban) }} đ</time
                  >
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
          </div>
        </transition>
      </div>
    </div>
    <div
      class="fh c-flex c-column"
      style="
        padding-left: 15px;
        padding-right: 10px;
        background-color: #f2f4f4;
        width: 320px;
      "
    >
      <div style="margin-top: 10px">
        <div style="font-size: 16px; color: #196f3d; font-weight: bold">
          <h4><i style="color: green">THÔNG TIN PHIẾU KIỂM KHO</i></h4>
        </div>
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
          <el-form-item label="Tên kiểm kê" prop="ten">
            <el-input size="small" v-model="form.ten"></el-input>
          </el-form-item>
          <el-form-item label="Nhân viên">
            <el-select
              size="small"
              v-model="form.user_nhan_vien_id"
              filterable
              style="width: 100%"
              placeholder="Chọn nhân viên"
            >
              <el-option
                v-for="item in nhaCungCaps"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Ghi chú">
            <el-input
              size="small"
              type="textarea"
              v-model="form.ghi_chu"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <br />
      <el-row>
        <el-col :span="23">
          <el-button
            style="float: right; width: 100%"
            icon="el-icon-plus"
            class="success-button"
            @click="submit('form')"
            >TẠO PHIẾU KIỂM KHO</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getSanPhamTonKho, addKiemKho, getNhanVien } from "@/api/kho";
import { addSanPham, getSanPhamNhaCungCap } from "@/api/donhangnhacungcap";
import { getKhachHang } from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";
import { index } from "@/api/danhmucsanpham";

export default {
  data() {
    return {
      showUserDetail: false,
      active: 0,
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      form: {
        ma: "KK_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        danhSachHang: [],
        user_nhan_vien_id: null,
        trang_thai: "moi_tao",
      },
      idSanPham: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      UserInfo: {},
      timKiem: null,
      admin: false,
      nhaCungCaps: [],
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      bangGias: [],
      so_luong: 1,
      formate: formate,
      danhMucs: [],
      danh_muc_id: null,
      don_vi_tinh: null,
      don_gia: null,
      shipper: [],
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên đợt kiểm kê",
            trigger: "blur",
          },
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
  watch: {
    timKiem(val) {
      this.getSanPham();
    },
  },
  created() {
    this.getSanPham();
    this.getKhachHang();
    this.getDanhMuc();
  },

  methods: {
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    async getSanPham() {
      let data = await getSanPhamTonKho({
        per_page: 12,
        search: this.timKiem,
        danh_muc: this.danh_muc_id,
      });
      this.hangHoas = data.data;
    },
    doiSanPham(id) {
      this.idSanPham = null
      this.hang_hoa_id = id;
      this.hangHoa = this.hangHoas.find((el) => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
      this.so_luong = 1;
      this.addSanPham();
    },
    kiemTraDaChon(SanPhamID) {
      let a = this.form.danhSachHang.find((el) => el.hang_hoa.id == SanPhamID);
      if (a) return true;
      return false;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.so_luong) {
        let data = {};
        data.hang_hoa = this.hangHoa;
        data.so_luong_truoc_kiem_kho = this.hangHoa.ton_kho;
        this.form.danhSachHang.push(data);
        for (let el of this.hangHoas) {
          if (this.hang_hoa_id == el.id) {
            el.disabled = true;
          }
        }
        this.hang_hoa_id = null;
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
          addKiemKho(this.form)
            .then((res) => {
              this.$message({
                message: "Tạo kiểm kho thành công",
                type: "success",
              });
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
        ma: "KK_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        danhSachHang: [],
        user_nhan_vien_id: null,
        trang_thai: "moi_tao",
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.don_vi_tinh = null;
    },
    async getKhachHang() {
      let data = await getNhanVien();
      this.nhaCungCaps = data;
    },
    async getInfo() {
      let data = await getInfor();
      if (data.data.role_id == 1 || data.data.role_id == 2) {
        this.admin = true;
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
.bounce-enter-active {
  animation: bounce-in 0.8s;
}
.bounce-leave-active {
  animation: bounce-in 0.8s reverse;
}
.maint {
  padding-left: 10px;
  overflow: hidden;
}
.sanpham {
  overflow: auto;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  border-top: 1px solid #2e86c1;
  background-color: #58d68d;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  scroll-behavior: smooth;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>