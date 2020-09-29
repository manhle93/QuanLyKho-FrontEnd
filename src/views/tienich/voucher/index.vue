<template>
  <div class="app-container">
    <h4><i style="color: green"> DANH SÁCH VOUCHER KHUYẾN MÃI</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="getData()"
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-date-picker
          size="small"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
        ></el-date-picker>
      </el-col>
      <el-col :span="8">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          style="float: right"
          @click="showFormAdd"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
        >Thêm mới</el-button>
      </el-col>
    </el-row>
    <br />
    <br />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <el-table-column sortable prop="ma" min-width="160" label="Mã voucher"></el-table-column>
      <el-table-column label="Số lượng" prop="so_luong" min-width="157"></el-table-column>
      <el-table-column label="Ngày bắt đầu" prop="bat_dau" min-width="157"></el-table-column>
      <el-table-column label="Ngày kết thúc" prop="ket_thuc" min-width="157"></el-table-column>
      <el-table-column label="Trạng thái" min-width="157">
        <template slot-scope="scope">
          <el-tag
            effect="plain"
            type="danger"
            v-if=" new Date(scope.row.ket_thuc) < new Date()"
          >Hết hạn</el-tag>
          <el-tag effect="plain" v-if=" new Date(scope.row.bat_dau) > new Date()">Chưa áp dụng</el-tag>
          <el-tag
            type="success"
            effect="plain"
            v-if=" new Date(scope.row.ket_thuc) >= new Date() && new Date >  new Date(scope.row.bat_dau)"
          >Đang áp dụng</el-tag>
          <el-tag effect="plain" type="warning" v-if="scope.row.so_luong <= 0">Sử dụng hết</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <el-button
              size="small"
              class="primary-button"
              icon="el-icon-edit"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteAppUserID(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-sizes="[5, 10, 15, 20]"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="edit ? 'CẬP NHẬT VOUCHER' :'THÊM MỚI VOUCHER'"
      :visible.sync="showForm"
      width="600px"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Mã voucher" prop="ma">
              <el-input size="small" v-model="form.ma"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Giảm giá" prop="giam_gia">
              <br />
              <el-input-number
                type="number"
                :min="0"
                :max="form.loai == 'phan_tram' ? 100 : 99999999999999999"
                size="small"
                v-model="form.giam_gia"
                style="width: 60%"
              ></el-input-number>
              <el-radio-group size="small" v-model="form.loai">
                <el-radio-button label="tien">VNĐ</el-radio-button>
                <el-radio-button label="phan_tram">%</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số lượng" prop="so_luong">
              <el-input size="small" v-model="form.so_luong"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Áp dụng cho" prop="ap_dung_cho">
              <el-select
                size="small"
                v-model="form.ap_dung_cho"
                placeholder="Áp dụng cho"
                style="width: 100%"
              >
                <el-option value="toan_bo" label="Toàn bộ sản phẩm"></el-option>
                <el-option value="danh_muc" label="Danh mục sản phẩm"></el-option>
                <el-option value="san_pham" label="Theo sản phẩm"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.ap_dung_cho == 'danh_muc'">
            <el-form-item label="Danh mục sản phẩm">
              <el-select
                size="small"
                v-model="form.danhMucs"
                multiple
                collapse-tags
                style="width: 100%"
                placeholder="Chọn danh mục sản phẩm"
              >
                <el-option
                  v-for="item in danhMucs"
                  :key="item.id"
                  :label="item.ten_danh_muc"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.ap_dung_cho == 'san_pham'">
            <el-form-item label="Sản phẩm">
              <el-select
                size="small"
                v-model="form.sanPhams"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="Chọn sản phẩm"
                :remote-method="remoteMethod"
                :loading="loading"
                collapse-tags
                style="width: 100%"
              >
                <el-option
                  v-for="item in hangHoas"
                  :key="item.id"
                  :label="item.ten_san_pham"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="form.ap_dung_cho == 'toan_bo' ? 24 : 12">
            <el-form-item label="Đơn hàng tối thiểu" prop="don_toi_thieu">
              <el-input size="small" v-model="form.don_toi_thieu"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <br />
            <el-form-item label="Thời gian áp dụng" prop="thoi_gian">
              <el-date-picker
                format="dd/MM/yyyy HH:mm"
                size="small"
                style="width: 100%"
                v-model="form.thoi_gian"
                type="datetimerange"
                range-separator="-"
                start-placeholder="Từ ngày"
                end-placeholder="Đến ngày"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Mô tả">
              <el-input size="small" type="textarea" v-model="form.mo_ta" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Hủy</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="addKhoHang('form')"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="updateKhoHang('form')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInfor } from "@/api/taikhoan";
import { index } from "@/api/danhmucsanpham";
import { listSanPham } from "@/api/sanpham";
import { addVoucher, voucher, updateVoucher, deleteVoucher } from "@/api/voucher";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      list: [],
      showForm: false,
      edit: false,
      loading: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      danhMucs: [],
      hangHoas: [],
      date: [],
      form: {
        id: null,
        ma: null,
        loai: "tien",
        giam_gia: 0,
        so_luong: null,
        ap_dung_cho: "toan_bo",
        sanPhams: [],
        danhMucs: [],
        don_toi_thieu: 0,
        thoi_gian: [],
        mo_ta: null,
      },
      rules: {
        ma: [
          {
            required: true,
            message: "Mã voucher không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        so_luong: [
          {
            required: true,
            message: "Số lượng voucher không thể bỏ trống",
            trigger: "blur",
          },
        ],
        giam_gia: [
          {
            required: true,
            message: "Giảm giá không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getData();
    this.getDanhMuc();
    // this.getSanPham();
  },
  methods: {
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.showForm = true;
      this.form.ma = data.ma;
      this.form.loai = data.loai;
      this.form.giam_gia = data.giam_gia;
      this.form.so_luong = data.so_luong;
      this.form.ap_dung_cho = data.ap_dung_cho;
      this.form.id = data.id;
      this.form.don_toi_thieu = data.don_toi_thieu;
      this.form.mo_ta = data.mo_ta;
      this.form.thoi_gian[0] = data.bat_dau;
      this.form.thoi_gian[1] = data.ket_thuc;
      if (data.ap_dung_cho == "san_pham") {
        this.form.sanPhams = data.san_phams.map((el) => el.san_pham_id);
        this.form.danhMucs = [];
        this.getSanPham();
      }
      if (data.ap_dung_cho == "danh_muc") {
        this.form.danhMucs =  Array.from(new Set(data.san_phams.map(
          (el) => el.san_pham.danh_muc_id
        )));
        this.form.sanPhams = [];
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
    },
    async getData() {
      this.listLoading = true;
      let data = await voucher({
        per_page: this.per_page,
        page: this.page,
        search: this.search,
        date: this.date,
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.list = data.data.data;
      this.listLoading = false;
    },

    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn voucher: " + "<strong>" + item.ma + "</strong>",

        "Xóa Voucher",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          deleteVoucher(item.id).then((res) => {
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.getData();
          });
        })
        .catch((_) => {});
    },
    showFormAdd() {
      this.resetForm();
      this.getSanPham();
      this.edit = false;
      this.showForm = true;
    },
    addKhoHang(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.ma = this.form.ma.toUpperCase();
          addVoucher(this.form).then((res) => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Thêm mới thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateKhoHang(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateVoucher(this.form.id, this.form).then((res) => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Cập nhật thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.showForm = false;
      this.form = {
        id: null,
        ma: null,
        so_luong: null,
        ap_dung_cho: "toan_bo",
        loai: "tien",
        sanPhams: [],
        danhMucs: [],
        don_toi_thieu: 0,
        thoi_gian: [],
        mo_ta: null,
      };
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 20,
        san_pham_id: this.form.sanPhams,
      });
      this.hangHoas = data.data.data;
    },
    async remoteMethod(query) {
      this.loading = true;
      let data = await listSanPham({
        per_page: 999999,
        search: query,
      });
      this.loading = false;
      this.hangHoas = data.data.data;
    },
  },
};
</script>
<style>
.search {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: inherit;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
</style>
