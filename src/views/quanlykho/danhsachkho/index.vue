<template>
  <div class="app-container">
    <h4>Danh sách kho hàng</h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="searchData()"
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
      <el-table-column sortable prop="ten" min-width="160" label="Tên kho"></el-table-column>
      <el-table-column label="Địa chỉ" prop="dia_chi" min-width="157"></el-table-column>
      <el-table-column label="Số điện thoại" prop="so_dien_thoai" min-width="157"></el-table-column>
      <el-table-column label="Người quản lý" prop="nguoi_quan_ly" min-width="157"></el-table-column>
      <el-table-column label="Trạng thái" min-width="157">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="!scope.row.trang_thai">Không hoạt động</el-tag>
          <el-tag type="success" v-else>Đang hoạt động</el-tag>
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
    <el-dialog
      :title="edit ? 'CẬP NHẬT KHO HÀNG' :'THÊM MỚI KHO HÀNG'"
      :visible.sync="showForm"
      width="30%"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row></el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Tên kho hàng" prop="ten">
              <el-input v-model="form.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Số điên thoại">
              <el-input v-model="form.so_dien_thoai"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Người quản lý">
              <el-input v-model="form.nguoi_quan_ly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Địa chỉ">
              <el-input v-model="form.dia_chi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Mô tả">
              <el-input type="textarea" v-model="form.mo_ta" :rows="2"></el-input>
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
import { getKho, editKho, addKho, xoaKho } from "@/api/kho";
import { getInfor } from "@/api/taikhoan";

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
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      form: {
        id: null,
        ten: null,
        ma: null,
        so_dien_thoai: null,
        dia_chi: null,
        nguoi_quan_ly: null,
        trang_thai: true,
        mo_ta: null,
      },
      rules: {
        ten: [
          {
            required: true,
            message: "Tên kho hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
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
      this.showForm = true;
      this.form.ten = data.ten;
      this.form.mo_ta = data.mo_ta;
      this.form.so_dien_thoai = data.so_dien_thoai;
      this.form.dia_chi = data.dia_chi;
      this.form.nguoi_quan_ly = data.nguoi_quan_ly;
      this.form.id = data.id;
    },
    async getData() {
      this.listLoading = true;
      let data = await getKho();
      this.list = data;
      this.listLoading = false;
    },
    searchData() {
      this.listLoading = true;
      getKho({ search: this.search }).then((response) => {
        this.list = response;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa kho: " + "<strong>" + item.ten + "</strong>",

        "Xóa kho hàng",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaKho(item.id).then((res) => {
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
      this.showForm = true;
      this.edit = false
    },
    addKhoHang(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addKho(this.form).then((res) => {
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
          editKho(this.form.id, this.form).then((res) => {
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
        ma: null,
        so_dien_thoai: null,
        dia_chi: null,
        nguoi_quan_ly: null,
        trang_thai: true,
        mo_ta: null,
      };
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
