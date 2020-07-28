<template>
  <div
    class="c-flex fh ttch"
    style="padding-left: 20px; height: calc(100vh - 50px);overflow: hidden;"
  >
    <div
      class="c-grow c-flex c-column"
      style="border-right: 2px solid #2E86C1; justify-content: space-between; flex: 1"
    >
      <div class="d-flex flex-collumn" style="flex: 1; min-height: 0">
        <div class="d-flex fill-height flex-collumn">
          <el-row :gutter="20">
            <br />
            <el-col :span="8">
              <el-input placeholder="Tìm kiếm sản phẩm" v-model="timKiem">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select
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
          <br>
          <div class="d-flex" style="flex: 1; min-height: 0; overflow-y: auto">
            <div style="width: 100%">
              <el-table :data="form.danhSachHang" style="width: 100%;">
                <el-table-column type="index" label="STT" width="100px"></el-table-column>
                <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
                <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column>
                <el-table-column label="Tồn kho" prop="ton_kho"></el-table-column>
                <el-table-column label="Số thực tế" prop="so_thuc_te">
                  <template slot-scope="scope">
                    <div v-if="form.trang_thai !='moi_tao'">{{scope.row.so_thuc_te}}</div>
                    <div v-else>
                      <el-input-number size="small" :min="0" v-model="scope.row.so_thuc_te"></el-input-number>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Chênh lệch" prop="so_thuc_te">
                  <template
                    slot-scope="scope"
                  >{{scope.row.so_thuc_te - scope.row.ton_kho}} {{scope.row.hang_hoa.don_vi_tinh}}</template>
                </el-table-column>
                <el-table-column label="Xóa">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.trang_thai =='moi_tao'"
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
      <div
        class="c-column"
        style="padding-bottom: 20px; border-top: 1px solid #2E86C1; background-color: #58D68D; padding-left: 20px; padding-right: 20px"
      >
        <el-row :gutter="20">
          <br />
          <el-col :xl="3" :md="4" :sm="6" v-for="item in hangHoas" :key="item.id">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src" class="image" />
              <div style="padding: 14px;">
                <span
                  style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden !important; text-overflow: ellipsis;"
                >{{item.ten_san_pham}}</span>
                <div class="bottom clearfix">
                  <time
                    class="time"
                  >{{ formate.formatCurrency(item.gia_ban) }} đ/{{item.don_vi_tinh}}</time>
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
      </div>
    </div>
    <div
      class="fh c-flex c-column"
      style="padding-left: 15px; padding-right: 10px; background-color: #F2F4F4; width: 320px;"
    >
      <div style="margin-top: 10px;">
        <div style="font-size: 16px; color: #196F3D; font-weight: bold">Phiếu kiểm kho</div>
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
            <el-input :disabled="true" size="small" v-model="form.ten"></el-input>
          </el-form-item>
          <el-form-item label="Nhân viên">
            <el-select
              :disabled="true"
              size="small"
              v-model="form.user_nhan_vien_id"
              filterable
              style="width:100%"
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
            <el-input size="small" type="textarea" v-model="form.ghi_chu"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <br />
      <el-row :gutter="24">
        <el-col :span="24">
          <el-button
            v-if="form.trang_thai == 'moi_tao'"
            style="float: right; width: 100%"
            icon="el-icon-check"
            class="success-button"
            @click="submit('form')"
          >KIỂM KHO</el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            v-if="form.trang_thai == 'da_kiem_kho'"
            icon="el-icon-check"
            class="success-button"
            @click="pheDuyet('form')"
          >PHÊ DUYỆT</el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            v-if="form.trang_thai == 'da_kiem_kho'"
            icon="el-icon-close"
            type="warning"
            @click="huyBo('form')"
          >HỦY BỎ</el-button>
        </el-col>
        <div
          style="height: 80px; width: 250px; border: 3px solid #E74C3C; display: flex; align-items:center; justify-content: center; border-radius: 10px; margin-left: 30px"
          v-if="form.trang_thai != 'moi_tao' && form.trang_thai != 'da_kiem_kho' && form.trang_thai"
        >
          <p
            style="color: #E74C3C; font-weight: bold; font-size: 24px"
            v-if="trang_thai == 'da_huy'"
          >ĐÃ HỦY PHIẾU</p>
          <p
            style="color: #E74C3C; font-weight: bold; font-size: 24px"
            v-if="trang_thai == 'da_duyet'"
          >ĐÃ PHÊ DUYỆT</p>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getSanPhamTonKho,
  addKiemKho,
  getChiTiet,
  kiemKho,
  pheDuyet,
  huyBo,
  getNhanVien,
} from "@/api/kho";
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
        trang_thai: null,
      },
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
      don_vi_tinh: null,
      danhMucs: [],
      danh_muc_id: null,
      don_gia: null,
      so_luong_thuc_te: 0,
      shipper: [],
      formate: formate,
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
  created() {
    this.getSanPham();
    this.getKhachHang();
    this.getData();
    this.getDanhMuc();
  },
  watch: {
    timKiem(val) {
      this.getSanPham();
    },
  },
  methods: {
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    async getData() {
      let data = await getChiTiet(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.ten = data.data.ten;
      this.form.ghi_chu = data.data.ghi_chu;
      this.form.trang_thai = data.data.trang_thai;
      this.trang_thai = data.data.trang_thai;
      this.form.user_nhan_vien_id = data.data.user_nhan_vien_id;
      this.form.danhSachHang = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        item.ton_kho = sp.so_luong_truoc_kiem_kho;
        item.hang_hoa = sp.san_pham;
        item.so_thuc_te = sp.so_thuc_te;
        this.form.danhSachHang.push(item);
      }
    },

    async getSanPham() {
      let data = await getSanPhamTonKho({
        per_page: 6,
        search: this.timKiem,
        danh_muc: this.danh_muc_id
      });
      this.hangHoas = data.data;
    },
    doiSanPham(id) {
      this.hang_hoa_id = id;
      this.hangHoa = this.hangHoas.find((el) => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
      this.so_luong_thuc_te = 0;
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
        data.ton_kho = this.hangHoa.ton_kho;
        data.so_thuc_te = 0;
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
          kiemKho(this.$route.params.id, {
            danhSachHang: this.form.danhSachHang,
            ghi_chu: this.form.danhSachHang.ghi_chu,
          })
            .then((res) => {
              this.getData();
              this.$message({
                message: "Kiểm kho thành công",
                type: "success",
              });
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
    pheDuyet(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          pheDuyet(this.$route.params.id, {
            danhSachHang: this.form.danhSachHang,
          })
            .then((res) => {
              this.getData();
              this.$message({
                message: "Phê duyệt thành công",
                type: "success",
              });
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
    huyBo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          huyBo(this.$route.params.id)
            .then((res) => {
              this.getData();
              this.$message({
                message: "Hủy bỏ thành công",
                type: "success",
              });
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
</style>