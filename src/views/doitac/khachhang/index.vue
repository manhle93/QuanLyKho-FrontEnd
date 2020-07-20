<template>
  <div class="app-container">
    <h4>Danh sách khách hàng</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="search"
            suffix-icon="el-icon-search"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            style="float: right"
            @click="showFormAdd"
            size="small"
            icon="el-icon-plus"
            class="primary-button"
          >Thêm mới</el-button>
        </el-col>
      </el-row>
    </el-form>
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
      <el-table-column sortable prop="ten" min-width="160" label="Tên khách hàng"></el-table-column>
      <el-table-column label="Địa chỉ" prop="dia_chi" min-width="157"></el-table-column>
      <el-table-column label="Số điện thoại" prop="so_dien_thoai" min-width="157"></el-table-column>
      <el-table-column label="Địa chỉ email" prop="email" min-width="157"></el-table-column>
      <el-table-column label="Số dư" prop="so_du" min-width="157"></el-table-column>
      <el-table-column label="Trạng thái" min-width="157" prop="trang_thai"></el-table-column>
      <el-table-column label="Giao dịch cuối" min-width="157" prop="giao_dich_cuoi"></el-table-column>
      <el-table-column align="center" min-width="110" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <el-button
              size="small"
              style="background-color: #2E86C1; color: white"
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
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="edit ? 'CẬP NHẬT KHÁCH HÀNG' :'THÊM MỚI KHÁCH HÀNG'"
      :visible.sync="showForm"
      width="40%"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-steps :space="200" :active="next ? 1 : 2" simple v-if="!edit">
          <el-step title="Thông tin khách hàng" icon="el-icon-info"></el-step>
          <el-step title="Tài khoản đăng nhập" icon="el-icon-user"></el-step>
        </el-steps>
        <el-steps :space="200" :active="next ? 1 : 2" simple v-else>
          <el-step title="Thông tin khách hàng" icon="el-icon-info"></el-step>
          <el-step title="Thông tin giao dịch" icon="el-icon-money"></el-step>
        </el-steps>
        <br />
        <el-row :gutter="40" v-show="next">
          <el-col :span="12">
            <el-form-item label="Mã khách hàng" prop="ma">
              <el-input size="small" v-model="form.ma" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại khách hàng">
              <br />
              <el-radio v-model="form.ca_nhan" :label="true" border size="small">Cá nhân</el-radio>
              <el-radio v-model="form.ca_nhan" :label="false" border size="small">Tổ chức</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tên khách hàng" prop="ten">
              <el-input size="small" v-model="form.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mã số thuế">
              <el-input size="small" v-model="form.ma_so_thue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số điện thoại" prop="so_dien_thoai">
              <el-input size="small" v-model="form.so_dien_thoai"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Giới tính">
              <br />
              <el-radio v-model="form.gioi_tinh" :label="true" border size="small">Nam</el-radio>
              <el-radio v-model="form.gioi_tinh" :label="false" border size="small">Nữ</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ngày sinh">
              <br />
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="form.ngay_sinh"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ emal" prop="email">
              <el-input size="small" v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ">
              <el-input size="small" v-model="form.dia_chi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ghi chú">
              <el-input size="small" type="textarea" v-model="form.mo_ta" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-show="!next" v-if="!edit">
          <el-col style="text-align: center">
            <div class="block">
              <img style="widht: 150px; height: 150px" :src="src" />
              <input
                ref="upload-image"
                class="upload-image"
                type="file"
                @change="handleChange($event)"
              />
              <br />
              <el-tooltip
                class="item"
                effect="dark"
                content="Thay đổi ảnh đại diện"
                placement="top"
              >
                <el-button
                  class="primary-button block"
                  style="margin-top:20px;"
                  @click="handleUpload"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item label="Tên đăng nhập" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item label="Mật khẩu" prop="password">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item label="Nhập lại mật khẩu" prop="password_confirmation">
              <el-input type="password" v-model="form.password_confirmation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-show="!next" v-else>
          <el-col :span="12">
            <el-form-item label="Số tài khoản">
              <el-input size="small" v-model="form.so_tai_khoan"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số dư">
              <el-input size="small" :disabled="true" v-model="form.so_du"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Chuyển khoản cuối">
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="form.chuyen_khoan_cuoi"
                type="datetime"
                :disabled="true"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Giao dịch cuối">
              <el-date-picker
                :disabled="true"
                size="small"
                style="width: 100%"
                v-model="form.giao_dich_cuoi"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại thành viên">
              <el-input size="small" v-model="form.loai_thanh_vien_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Điểm quy đổi">
              <el-input size="small" v-model="form.diem_quy_doi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tiền vay">
              <el-input size="small" v-model="form.tien_vay"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Trạng thái">
              <br />
              <el-select size="small" style="width: 100%" v-model="form.trang_thai" placeholder="Select">
                <el-option label="Mới tạo" :value="'moi_tao'"></el-option>
                <el-option label="Xác nhận" :value="'xac_nhan'"></el-option>
                <el-option label="Hoạt động" :value="'hoat_dong'"></el-option>
                <el-option label="Khách hàng" :value="'khach_hang'"></el-option>
                <el-option label="Dừng hoạt động" :value="'dung_hoat_dong'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tín nhiệm">
              <br />
              <el-rate
                v-model="form.tin_nhiem"
                show-text
                :colors="colors"
                :texts="['Thường', 'Trung bình', 'Tốt', 'Tính nhiệm cao', 'Rất cao']"
              ></el-rate>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Cancel</el-button> -->
        <el-button
          class="primary-button"
          :disabled="!form.ma || !form.ten || !form.so_dien_thoai || !form.email"
          size="small"
          v-if="next"
          icon="el-icon-right"
          @click="next = !next"
        >Tiếp theo</el-button>
        <el-button
          type="warning"
          size="small"
          v-if="!next"
          icon="el-icon-back"
          @click="next = !next"
        >Quay lại</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit && !next"
          icon="el-icon-plus"
          @click="addKhachHang('form')"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="edit"
          icon="el-icon-check"
          @click="updateKhachHang('form')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getKhachHang,
  editKhachHang,
  addKhachHang,
  xoaKhachHang
} from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";
import { upAnhDanhMuc } from "@/api/danhmucsanpham";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu mới"));
      } else {
        if (this.form.password_confirmation !== "") {
          this.$refs.form.validateField("password_confirmation");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập lại mật khẩu mới"));
      } else if (value !== this.form.password) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
    return {
      next: true,
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      endPointImage: process.env.VUE_APP_BASE,
      list: [],
      showForm: false,
      edit: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      form: {
        id: null,
        ten: null,
        ma: "KH" + new Date().getTime(),
        so_dien_thoai: null,
        dia_chi: null,
        ngay_sinh: null,
        ghi_chu: null,
        ca_nhan: false,
        ma_so_thue: null,
        gioi_tinh: true,
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        anh_dai_dien: null,
        facebook: null,
        trang_thai: null,
        so_tai_khoan: null,
        so_du: null,
        chuyen_khoan_cuoi: null,
        giao_dich_cuoi: null,
        nhom_id: null,
        loai_thanh_vien_id: null,
        tin_nhiem: null,
        diem_quy_doi: null,
        tien_vay: null
      },
      rules: {
        ten: [
          {
            required: true,
            message: "Tên khách hàng không thể bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" }
        ],
        ma: [
          {
            required: true,
            message: "Mã khách hàng không thể bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" }
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Số điện thoại không thể bỏ trống",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"]
          }
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không thể bỏ trống",
            trigger: "blur"
          }
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            message: "Độ dài tối thiểu 6 kí tự",
            trigger: "blur"
          }
        ],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.showForm = true;
      this.form.id = data.id;
      this.form.ten = data.ten;
      this.form.ma = data.ma;
      this.form.so_dien_thoai = data.so_dien_thoai;
      this.form.dia_chi = data.dia_chi;
      this.form.ngay_sinh = data.ngay_sinh;
      this.form.ghi_chu = data.ghi_chu;
      this.form.ca_nhan = data.ca_nhan;
      this.form.ma_so_thue = data.ma_so_thue;
      this.form.gioi_tinh = data.gioi_tinh;
      this.form.email = data.email;
      this.form.username = data.username;
      this.form.anh_dai_dien = data.anh_dai_dien;
      this.form.facebook = data.facebook;
      this.form.so_tai_khoan = data.so_tai_khoan;
      this.form.so_du = data.so_du;
      this.form.chuyen_khoan_cuoi = data.chuyen_khoan_cuoi;
      this.form.giao_dich_cuoi = data.giao_dich_cuoi;
      this.form.nhom_id = data.nhom_id;
      this.form.loai_thanh_vien_id = data.loai_thanh_vien_id;
      this.form.tin_nhiem = data.tin_nhiem;
      this.form.diem_quy_doi = data.diem_quy_doi;
      this.form.tien_vay = data.tien_vay;
      this.form.trang_thai = data.trang_thai;
    },
    async getData(page, per_page) {
      this.listLoading = true;
      let data = await getKhachHang({
        per_page: per_page,
        page: page
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.list = data.data.data;
      this.listLoading = false;
    },
    searchData() {
      this.listLoading = true;
      getKhachHang({ search: this.search }).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa khách hàng: " + "<strong>" + item.ten + "</strong>",

        "Xóa khách hàng",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          xoaKhachHang(item.id).then(res => {
            this.$message({
              message: "Xóa thành công",
              type: "success"
            });
            this.getData();
          });
        })
        .catch(_ => {});
    },
    showFormAdd() {
      this.resetForm();
      this.showForm = true;
    },
    addKhachHang(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addKhachHang(this.form).then(res => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Thêm mới thành công"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateKhachHang(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editKhachHang(this.form.id, this.form).then(res => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Cập nhật thành công"
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
        ma: "KH" + new Date().getTime(),
        so_dien_thoai: null,
        dia_chi: null,
        ngay_sinh: null,
        ghi_chu: null,
        ca_nhan: false,
        ma_so_thue: null,
        gioi_tinh: true,
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        anh_dai_dien: null,
        facebook: null,
        so_tai_khoan: null,
        so_du: null,
        chuyen_khoan_cuoi: null,
        giao_dich_cuoi: null,
        nhom_id: null,
        loai_thanh_vien_id: null,
        tin_nhiem: null,
        diem_quy_doi: null,
        tien_vay: null,
        trang_thai: null
      };
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then(res => {
          this.form.anh_dai_dien = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch(error => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData(this.page, this.per_page);
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getData(this.page, this.per_page);
    }
  }
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
