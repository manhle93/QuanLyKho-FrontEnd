<template>
  <div class="app-container">
    <h4><i style="color: green">KHỞI TẠO BÁO GIÁ</i></h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <br />
        <div style="font-size: 16px; color: #1f618d; font-weight: bold">
          1. Thông tin chung
        </div>
        <br />
        <el-col :span="4">
          <el-form-item label="Mã báo giá">
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
        <br />
      </el-row>
      <el-row :gutter="20">
        <div style="font-size: 16px; color: #1f618d; font-weight: bold">
          2. Sản phẩm, hàng hóa
        </div>
        <br />
        <el-col :span="6">
          <el-form-item label="Hàng hóa, sản phẩm">
            <br />
            <el-select
              style="width: 100%"
              v-model="hang_hoa_id"
              filterable
              clearable
              remote
              reserve-keyword
              :remote-method="remoteMethod"
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
          <el-form-item label="Đơn vị tính">
            <el-input :disabled="true" v-model="don_vi_tinh"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Đơn giá">
            <el-input
              v-model="displayValue"
              @blur="isInputActive = false"
              @focus="isInputActive = true"
              :min="0"
            >
              <template slot="append"
                >VNĐ</template
              >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Giá khuyến cáo">
            <el-input v-model="gia_khuyen_cao" :min="0" type="number">
              <template slot="append"
                >VNĐ</template
              >
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
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-table
            :data="form.danhSachHang"
            style="width: 100%"
            max-height="350px"
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
            <el-table-column prop="don_gia" label="Đơn giá">
              <template slot-scope="scope"
                >{{ formate.formatCurrency(scope.row.don_gia) }} đ</template
              >
            </el-table-column>
            <el-table-column prop="gia_khuyen_cao" label="Giá khuyến cáo">
              <template slot-scope="scope"
                >{{
                  formate.formatCurrency(scope.row.gia_khuyen_cao)
                }}
                đ</template
              >
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
    <br />
    <br />
    <el-row>
      <el-col :span="10">
        <el-button icon="el-icon-back" type="warning" @click="back()"
          >Quay lại</el-button
        >
      </el-col>
      <el-col :span="10">
        <el-button
          style="float: right"
          icon="el-icon-right"
          class="primary-button"
          @click="submit('form')"
          >GỬI BÁO GIÁ</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listSanPham } from "@/api/sanpham";
import { addSanPham } from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";
import { addBaoGia } from "@/api/baogia";

export default {
  data() {
    return {
      active: 0,
      src: process.env.VUE_APP_BASE,
      form: {
        ma: "BG" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        danhSachHang: [],
        nha_cung_cap_id: null
      },
      isInputActive: null,
      formate: formate,
      gia_khuyen_cao: null,
      admin: false,
      nhaCungCaps: [],
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      don_vi_tinh: null,
      don_gia: "",
      rules: {
        ten: [
          { required: true, message: "Hãy nhập tên báo giá", trigger: "blur" },
          { min: 5, message: "Tên báo giá tối thiểu 5 ký tự", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    displayValue: {
      get() {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.don_gia.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.don_gia).replace(
            /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
            "$1."
          );
        }
      },
      set(modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(
          String(modifiedValue).replace(/[^\d\.]/g, "")
        );
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.don_gia = newValue;
      }
    }
  },
  created() {
    this.getSanPham();
    this.getNhaCungCap();
    this.getInfo();
  },
  methods: {
    async getSanPham() {
      let data = await listSanPham({
        per_page: 20
      });
      this.hangHoas = data.data.data;
    },
    async doiSanPham(id) {
      this.hangHoa = this.hangHoas.find(el => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.don_gia) {
        let data = {};
        data.hang_hoa = this.hangHoa;
        data.don_gia = this.don_gia;
        data.gia_khuyen_cao = this.gia_khuyen_cao;
        this.form.danhSachHang.push(data);
        for (let el of this.hangHoas) {
          if (this.hang_hoa_id == el.id) {
            el.disabled = true;
          }
        }
        this.gia_khuyen_cao = null;
        this.hang_hoa_id = null;
        this.don_gia = "";
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
    async remoteMethod(query) {
      console.log(query)
      let data = await listSanPham({
        per_page: 20,
        search: query
      });
      this.hangHoas = data.data.data;
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
          addBaoGia(this.form)
            .then(res => {
              this.$message({
                message: "Tạo báo giá thành công",
                type: "success"
              });
              this.resetForm();
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    },
    back() {
      this.$router.push("/quanlykho/baogia");
    },
    resetForm() {
      this.form = {
        ma: new Date().getTime(),
        ten: null,
        ghi_chu: null,
        tong_tien: null,
        danhSachHang: []
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.hangHoas = [];
      this.don_vi_tinh = null;
      this.don_gia = null;
      this.gia_khuyen_cao = null;
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999
      });
      this.nhaCungCaps = data.data.data;
    },
    async getInfo() {
      let data = await getInfor();
      this.form.nha_cung_cap_id = null;
      if (data.data.role_id == 1 || data.data.role_id == 2) {
        this.admin = true;
      }
    }
  }
};
</script>
<style scoped></style>
