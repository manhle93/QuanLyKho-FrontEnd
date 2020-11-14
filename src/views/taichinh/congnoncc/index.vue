<template>
  <div class="app-container">
    <h4><i style="color: green">DANH SÁCH CÔNG NỢ PHẢI TRẢ NHÀ CUNG CẤP</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="9">
        <el-input
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="searchData()"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="searchData()"
          >Tìm kiếm</el-button
        >
      </el-col>
      <el-col :span="10">
        <!-- <el-button
          style="float: right"
          @click="showFormAdd"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
          >THÊM MỚI</el-button
        > -->
        <router-link :to="'/quanlydonhang/thanhtoannhacungcap'">
        <el-button
          style="float: right"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
          >THANH TOÁN CHO NCC</el-button
        >
        </router-link>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <chi-tiet :data="props.row" @capNhatThongTin="showUpdate"></chi-tiet>
        </template>
      </el-table-column>

      <el-table-column
        label="STT"
        min-width="65"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column
        sortable
        prop="ten"
        min-width="170"
        label="Tên nhà cung cấp"
      >
        <template slot-scope="scope">
          <a @click="showUpdate(scope.row)">{{ scope.row.ten }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="Địa chỉ"
        prop="dia_chi"
        min-width="197"
      ></el-table-column>
      <el-table-column
        label="Số điện thoại"
        prop="so_dien_thoai"
        min-width="130"
        align="center"
      ></el-table-column>
      <el-table-column label="Trạng thái" min-width="130" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.user && scope.row.user.active" effect="plain"
            >HOẠT ĐỘNG</el-tag
          >
          <el-tag v-else effect="plain" type="danger">KHÔNG HOẠT ĐỘNG</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Công ty"
        min-width="157"
        prop="cong_ty"
      ></el-table-column>
      <el-table-column label="Công nợ phải trả" min-width="157" prop="cong_no">
        <template slot-scope="scope"
          ><el-tag type="danger">{{ formate.formatCurrency(scope.row.cong_no) }} đ</el-tag></template
        >
      </el-table-column>
      <!-- <el-table-column align="center" min-width="110" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="Chỉnh sửa"
            placement="top"
          >
            <el-button
              size="small"
              style="background-color: #2e86c1; color: white"
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
      </el-table-column> -->
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
      :title="edit ? 'CẬP NHẬT NHÀ CUNG CẤP' : 'THÊM MỚI NHÀ CUNG CẤP'"
      :visible.sync="showForm"
      width="60%"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-steps :space="200" :active="next ? 1 : 2" simple v-if="!edit">
          <el-step title="Thông tin nhà cung cấp" icon="el-icon-info"></el-step>
          <el-step title="Tài khoản đăng nhập" icon="el-icon-user"></el-step>
        </el-steps>
        <br />
        <el-row :gutter="40" v-show="next">
          <el-col :span="12">
            <el-form-item label="Mã nhà cung cấp" prop="ma">
              <el-input
                size="small"
                :disabled="true"
                v-model="form.ma"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tên nhà cung cấp" prop="ten">
              <el-input size="small" v-model="form.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ngày chốt công nợ">
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="form.ngay_chot_cong_no"
                type="date"
                format="'Ngày:' dd 'Hàng tháng'"
                placeholder="Ngày chốt công nợ"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ngày thanh toán">
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="form.ngay_thanh_toan"
                type="date"
                format="'Ngày:' dd 'Hàng tháng'"
                placeholder="Ngày thanh toán"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Số điện thoại" prop="so_dien_thoai">
              <el-input size="small" v-model="form.so_dien_thoai"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mã số thuế">
              <el-input size="small" v-model="form.ma_so_thue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ emal" prop="email">
              <el-input size="small" v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Công ty">
              <el-input size="small" v-model="form.cong_ty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Trạng thái">
              <br />
              <el-checkbox
                size="small"
                v-model="form.trang_thai"
                label="Hoạt động"
                border
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ghi chú">
              <el-input
                size="small"
                type="textarea"
                v-model="form.mo_ta"
                :rows="2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ">
              <el-input size="small" v-model="form.dia_chi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tín nhiệm">
              <br />
              <el-rate
                :value="+form.tin_nhiem"
                @input="form.tin_nhiem = $event"
                show-text
                :colors="colors"
                :texts="[
                  'Thường',
                  'Trung bình',
                  'Tốt',
                  'Tính nhiệm cao',
                  'Rất cao',
                ]"
              ></el-rate>
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
                  style="margin-top: 20px"
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
            <el-form-item
              label="Nhập lại mật khẩu"
              prop="password_confirmation"
            >
              <el-input
                type="password"
                v-model="form.password_confirmation"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Cancel</el-button> -->
        <el-button
          class="primary-button"
          :disabled="
            !form.ma || !form.ten || !form.so_dien_thoai || !form.email
          "
          size="small"
          v-if="next && !edit"
          icon="el-icon-right"
          @click="next = !next"
          >Tiếp theo</el-button
        >
        <el-button
          type="warning"
          size="small"
          v-if="!next && !edit"
          icon="el-icon-back"
          @click="next = !next"
          >Quay lại</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit && !next"
          icon="el-icon-plus"
          @click="addNhaCungCap('form')"
          >THÊM MỚI</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-if="edit"
          icon="el-icon-check"
          @click="updateNhaCungCap('form')"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNhaCungCap,
  editNhaCungCap,
  addNhaCungCap,
  xoaNhaCungCap,
} from "@/api/khachhang";
import { getInfor } from "@/api/taikhoan";
import { upAnhDanhMuc } from "@/api/danhmucsanpham";
import ChiTiet from "./chitiet";
export default {
  components: {
    ChiTiet,
  },
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
      formate: formate,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      form: {
        id: null,
        ten: null,
        ma: "NCC" + new Date().getTime(),
        so_dien_thoai: null,
        dia_chi: null,
        ngay_sinh: null,
        ghi_chu: null,
        ma_so_thue: null,
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        anh_dai_dien: null,
        trang_thai: false,
        tin_nhiem: null,
        cong_ty: null,
        ngay_chot_cong_no: null,
        ngay_thanh_toan: null,
      },
      rules: {
        ten: [
          {
            required: true,
            message: "Tên khách hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        ma: [
          {
            required: true,
            message: "Mã khách hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Số điện thoại không thể bỏ trống",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"],
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không thể bỏ trống",
            trigger: "blur",
          },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            message: "Độ dài tối thiểu 6 kí tự",
            trigger: "blur",
          },
        ],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.next = true;
      this.showForm = true;
      this.form.id = data.id;
      this.form.ten = data.ten;
      this.form.ma = data.ma;
      this.form.so_dien_thoai = data.so_dien_thoai;
      this.form.dia_chi = data.dia_chi;
      this.form.ghi_chu = data.ghi_chu;
      this.form.ma_so_thue = data.ma_so_thue;
      this.form.email = data.email;
      this.form.username = data.username;
      this.form.anh_dai_dien = data.anh_dai_dien;
      this.form.tin_nhiem = data.tin_nhiem;
      this.form.trang_thai = data.user.active;
      this.form.cong_ty = data.cong_ty;
      this.form.ngay_chot_cong_no = data.ngay_chot_cong_no;
      this.form.ngay_thanh_toan = data.ngay_thanh_toan;
    },
    async getData() {
      this.listLoading = true;
      let data = await getNhaCungCap({
        per_page: this.per_page,
        page: this.page,
        search: this.search,
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.list = data.data.data.filter(el=> el.cong_no > 0);
      this.listLoading = false;
    },
    searchData() {
      this.getData();
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa nhà cung cấp: " +
          "<strong>" +
          item.ten +
          "</strong>",

        "Xóa nhà cung cấp",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaNhaCungCap(item.id).then((res) => {
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
    addNhaCungCap(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addNhaCungCap(this.form).then((res) => {
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
    updateNhaCungCap(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editNhaCungCap(this.form.id, this.form).then((res) => {
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
        ma: "NCC" + new Date().getTime(),
        so_dien_thoai: null,
        dia_chi: null,
        ngay_sinh: null,
        ghi_chu: null,
        ma_so_thue: null,
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        anh_dai_dien: null,
        trang_thai: false,
        tin_nhiem: null,
        cong_ty: null,
        ngay_chot_cong_no: null,
        ngay_thanh_toan: null,
      };
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then((res) => {
          this.form.anh_dai_dien = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
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
.el-form-item__label {
  line-height: 30px;
}
</style>
