<template>
  <div class="app-container">
    <h4>Danh sách bảng giá</h4>
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
      <el-table-column sortable prop="ten" min-width="160" label="Tên bảng giá"></el-table-column>
      <el-table-column label="Thời gian bắt đầu" prop="ngay_bat_dau" min-width="157"></el-table-column>
      <el-table-column label="Thời gian bắt đầu" prop="ngay_ket_thuc" min-width="157"></el-table-column>
      <el-table-column label="Số sản phẩm" min-width="157"></el-table-column>
      <el-table-column align="center" min-width="140" fixed="right" label="Hoạt động">
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
          <el-tooltip class="item" effect="dark" content="Đặt giá sản phẩm" placement="top">
            <el-button size="small" type="warning" icon="el-icon-plus" circle></el-button>
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
      :title="edit ? 'Cập nhật danh mục sản phẩm' :'Thêm danh mục sản phẩm'"
      :visible.sync="showForm"
      width="30%"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Tên bảng giá" prop="ten">
              <el-input v-model="form.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Thời gian áp dụng">
              <el-date-picker
                style="width: 100%"
                v-model="form.thoi_gian"
                type="datetimerange"
                range-separator="-"
                start-placeholder="Bắt đầu"
                end-placeholder="Kết thúc"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Trạng thái" prop="ten">
              <br />
              <el-radio size="small" v-model="form.ap_dung" :label="true" border>Áp dụng</el-radio>
              <el-radio size="small" v-model="form.ap_dung" :label="false" border>Chưa áp dụng</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Cancel</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="addBangGia('form')"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="updateBangGia('form')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBangGia,
  editBangGia,
  xoaBangGia,
  getBangGia
} from "@/api/banggia";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";

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
        thoi_gian: null,
        ten: null,
        ap_dung: true
      },
      rules: {
        ten: [
          {
            required: true,
            message: "Tên bảng giá không thể bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" }
        ]
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
      this.form.ten = data.ten;
      this.form.thoi_gian = [];
      if (data.ngay_bat_dau && data.ngay_ket_thuc) {
        this.form.thoi_gian[0] = new Date(data.ngay_bat_dau);
        this.form.thoi_gian[1] = new Date(data.ngay_ket_thuc);
      }
      this.form.ap_dung = data.ap_dung;
      this.form.id = data.id;
    },
    async getData(page, per_page) {
      this.listLoading = true;
      let data = await getBangGia({
        per_page: per_page,
        page: page
      });
      this.list = data.data.data;
      this.listLoading = false;
      this.per_page = data.data.per_page;
      this.page = data.data.page;
    },
    searchData() {
      this.listLoading = true;
      getBangGia({ search: this.search }).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa bảng giá: " +
          "<strong>" +
          item.ten +
          "</strong>",
        "Xóa bảng giá",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          xoaBangGia(item.id).then(res => {
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
    addBangGia(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addBangGia(this.form).then(res => {
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
    updateBangGia(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editBangGia(this.form.id, this.form).then(res => {
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
        thoi_gian: null,
        ten: null,
        ap_dung: true
      };
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
