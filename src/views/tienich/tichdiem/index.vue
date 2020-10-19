<template>
  <div class="app-container">
    <h4><i style="color: green">TÍCH LŨY ĐIỂM THƯỞNG</i></h4>
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
      <el-col :span="6">
        <el-date-picker
          size="small"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
        ></el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="7">
        <el-button
          style="float: right"
          @click="showFormAdd"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
        >CẤU HÌNH</el-button>
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
      <el-table-column sortable prop="ten" min-width="160" label="Tên cấu hình"></el-table-column>
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
            v-if=" new Date(scope.row.ket_thuc) >= new Date() && new Date >  new Date(scope.row.bat_dau) && scope.row.active"
          >Đang áp dụng</el-tag>
          <el-tag
            type="warning"
            effect="plain"
            v-if=" new Date(scope.row.ket_thuc) >= new Date() && new Date >  new Date(scope.row.bat_dau) && !scope.row.active"
          >Chưa kích hoạt</el-tag>
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
      :title="edit ? 'CẬP NHẬT CẤU HÌNH ĐIỂM THƯỞNG' :'THÊM MỚI CẤU HÌNH ĐIỂM THƯỞNG'"
      :visible.sync="showForm"
      width="600px"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Tên cấu hình" prop="ten">
              <el-input size="small" v-model="form.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Thời gian áp dụng" prop="thoi_gian">
              <el-date-picker
                format="dd/MM/yyyy"
                size="small"
                style="width: 100%"
                v-model="form.thoi_gian"
                type="daterange"
                range-separator="-"
                start-placeholder="Từ ngày"
                end-placeholder="Đến ngày"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mức 1: Hóa đơn tối thiểu">
              <el-input v-model="form.muc_hoa_don1" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Điểm thưởng mức 1" prop="giam_gia1">
              <br />
              <el-input-number
                type="number"
                :min="0"
                :max="form.loai1 == 'phan_tram' ? 100 : 99999999999999999"
                size="small"
                v-model="form.diem_thuong1"
                style="width: 60%"
              ></el-input-number>
              <el-radio-group size="small" v-model="form.loai1">
                <el-radio-button label="tien">VNĐ</el-radio-button>
                <el-radio-button label="phan_tram">%</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mức 2: Hóa đơn tối thiểu">
              <el-input v-model="form.muc_hoa_don2" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Điểm thưởng mức 2" prop="giam_gia2">
              <br />
              <el-input-number
                type="number"
                :min="0"
                :max="form.loai2 == 'phan_tram' ? 100 : 99999999999999999"
                size="small"
                v-model="form.diem_thuong2"
                style="width: 60%"
              ></el-input-number>
              <el-radio-group size="small" v-model="form.loai2">
                <el-radio-button label="tien">VNĐ</el-radio-button>
                <el-radio-button label="phan_tram">%</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="form.active" label="Kích hoạt" border></el-checkbox>
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
        >THÊM MỚI</el-button>
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
import { addCauHinh, getCauHinh, updateCauhinh, deleteCauhinh } from "@/api/diemthuong";

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
        ten: null,
        loai1: "tien",
        loai2: "tien",
        diem_thuong2: 0,
        diem_thuong1: 0,
        muc_hoa_don1: 0,
        muc_hoa_don2: 0,
        thoi_gian: [],
        active: false,
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
    this.getSanPham();
  },
  methods: {
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.showForm = true;
      this.form.ten = data.ten;
      this.form.loai1 = data.loai1;
      this.form.loai2 = data.loai2;
      this.form.diem_thuong2 = data.diem_thuong2;
      this.form.diem_thuong1 = data.diem_thuong1;
      this.form.muc_hoa_don1 = data.muc_hoa_don1;
      this.form.id = data.id;
      this.form.active = data.active
      this.form.muc_hoa_don2 = data.muc_hoa_don2;
      this.form.thoi_gian[0] = data.bat_dau;
      this.form.thoi_gian[1] = data.ket_thuc;

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
      let data = await getCauHinh({
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
        "Bạn chắc chắn muốn xóa cấu hình điểm thưởng: " + "<strong>" + item.ten + "</strong>",

        "Xóa cấu hình điểm thưởng",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          deleteCauhinh(item.id).then((res) => {
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
      this.edit = false;
      this.showForm = true;
    },
    addKhoHang(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            !(Number(this.form.muc_hoa_don1) < Number(this.form.muc_hoa_don2))
          ) {
            this.$message({
              type: "warning",
              message: "Mức hóa đơn 2 phải lớn hơn mức hóa đơn 1",
            });
            return;
          }
          addCauHinh(this.form).then((res) => {
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
          updateCauhinh(this.form.id, this.form).then((res) => {
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
        ten: null,
        loai1: "tien",
        loai2: "tien",
        diem_thuong2: 0,
        diem_thuong1: 0,
        muc_hoa_don1: 0,
        muc_hoa_don2: 0,
        thoi_gian: [],
        active: false,
      };
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 20,
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
