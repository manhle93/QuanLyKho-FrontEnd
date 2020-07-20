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
        <el-form class="d-flex fill-height flex-collumn">
          <el-row :gutter="20">
            <br />
            <el-col :span="12">
              <el-form-item>
                <el-input placeholder="Tìm kiếm sản phẩm" v-model="timKiem" @change="getSanPham()">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="d-flex" style="flex: 1; min-height: 0; overflow-y: auto">
            <div style="width: 100%">
              <el-table
                :data="form.danhSachHang"
                style="width: 100%;"
              >
                <el-table-column type="index" label="STT" width="100px"></el-table-column>
                <el-table-column prop="hang_hoa.ten_san_pham" label="Hàng hóa"></el-table-column>
                <el-table-column prop="hang_hoa.don_vi_tinh" label="Đơn vị tính"></el-table-column>
                <el-table-column label="Tồn kho" prop="ton_kho"></el-table-column>
                <el-table-column label="Số thực tế" prop="so_thuc_te">
                  <template slot-scope="scope">
                    <el-input-number :min="0" v-model="scope.row.so_thuc_te"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="Chênh lệch" prop="so_thuc_te">
                  <template slot-scope="scope">
                   {{scope.row.so_thuc_te - scope.row.ton_kho}}
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
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src" class="image" />
              <div style="padding: 14px;">
                <span
                  style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden !important; text-overflow: ellipsis;"
                >{{item.ten_san_pham}}</span>
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
            <el-input size="small" v-model="form.ten"></el-input>
          </el-form-item>
          <el-form-item label="Nhân viên">
            <el-select
              size="small"
              v-model="form.user_nhan_vien_id"
              filterable
              style="width:80%"
              placeholder="Chọn nhân viên"
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
          >KIỂM KHO</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="THÔNG TIN KHÁCH HÀNG" :visible.sync="showUserDetail" width="600px" center>
      <div style="display: flex; align-items: center; flex-direction: column">
        <div v-if="UserInfo.avatar_url">
          <img
            :src="endPointImage + UserInfo.avatar_url"
            style="height: 100px; width: auto; border-radius: 10px"
          />
        </div>
        <div v-if="!UserInfo.avatar_url">
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
            <el-form-item label="Số dư TK: ">{{UserInfo.so_du}} đ</el-form-item>
          </el-col>
          <el-col :span="23" :offset="1">
            <el-form-item label="Địa chỉ: ">{{UserInfo.dia_chi}}</el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="primary-button" @click="showUserDetail = false" icon="el-icon-close">Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getSanPhamTonKho, addKiemKho, getChiTiet } from "@/api/kho";
import { addSanPham, getSanPhamNhaCungCap } from "@/api/donhangnhacungcap";
import { getKhachHang } from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";
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
        trang_thai: "moi_tao"
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
      don_gia: null,
      so_luong_thuc_te: 0,
      shipper: [],
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên đợt kiểm kê",
            trigger: "blur"
          },
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
    this.getData()
  },

  methods: {
        async getData() {
      let data = await getChiTiet(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.ten = data.data.ten;
      this.form.ghi_chu = data.data.ghi_chu;
      this.form.trang_thai = data.data.trang_thai;
      this.trang_thai = data.data.trang_thai;
      this.form.user_nhan_vien_id = data.data.user_nhan_vien_id;
      console.log(data.data)

      this.form.danhSachHang = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        item.ton_kho = sp.ton_kho;
        item.hang_hoa = sp.san_pham;
        item.so_thuc_te = sp.so_thuc_te
        this.form.danhSachHang.push(item);
      }
    },

    async getSanPham() {
      let data = await getSanPhamTonKho({
        per_page: 6,
        search: this.timKiem
      });
      this.hangHoas = data.data;
    },
    doiSanPham(id) {
      this.hang_hoa_id = id;
      this.hangHoa = this.hangHoas.find(el => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
      this.so_luong_thuc_te = 0;
      this.addSanPham();
    },
    kiemTraDaChon(SanPhamID) {
      let a = this.form.danhSachHang.find(el => el.hang_hoa.id == SanPhamID);
      if (a) return true;
      return false;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.so_luong) {
        let data = {};
        data.hang_hoa = this.hangHoa;
        data.ton_kho = this.hangHoa.ton_kho
        data.so_thuc_te = 0
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.danhSachHang.length == 0) {
            this.$message({
              message: "Danh sách hàng hóa không thể bỏ trống",
              type: "warning"
            });
            return;
          }
          console.log(this.form);
          addKiemKho(this.form)
            .then(res => {
              this.$message({
                message: "Tạo kiểm kho thành công",
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
        ma: "KK_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        danhSachHang: [],
        user_nhan_vien_id: null,
        trang_thai: "moi_tao"
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.don_vi_tinh = null;
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
    showInfo() {
      this.UserInfo = this.nhaCungCaps.find(
        el => el.user_id == this.form.khach_hang_id
      );
      if (this.UserInfo) {
        this.showUserDetail = true;
      } else this.UserInfo = {};
    }
  }
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