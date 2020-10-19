<template>
  <div class="app-container">
    <h4><i style="color: green"> DANH SÁCH NHÓM HÀNG HÓA</i></h4>
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
          >Tìm kiếm</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-button
          style="float: right"
          @click="showFormAdd"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
          >THÊM MỚI</el-button
        >
      </el-col>
    </el-row>
    <br /><br />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column
        label="STT"
        min-width="55"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <img
            :src="
              scope.row.anh_dai_dien
                ? endPointImage + scope.row.anh_dai_dien
                : src
            "
            style="max-height: 90px; max-width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="ten_danh_muc"
        min-width="160"
        label="Tên"
      ></el-table-column>
      <el-table-column
        label="Mô tả"
        prop="mo_ta"
        min-width="157"
      ></el-table-column>
      <el-table-column label="Số mặt hàng" min-width="157">
        <template slot-scope="scope"
          >{{ scope.row.so_mat_hang }} sản phẩm</template
        >
      </el-table-column>
      <el-table-column label="Thứ tự hiển thị" >
        <template slot-scope="scope">{{ scope.row.thu_tu_hien_thi }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="110"
        fixed="right"
        label="Hoạt động"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="Chỉnh sửa"
            placement="top"
          >
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
      :title="edit ? 'CẬP NHẬT NHÓM HÀNG HÓA' :'THÊM NHÓM HÀNG HÓA'"
      :visible.sync="showForm"
      width="30%"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row>
          <el-col style="text-align: center">
            <div class="block">
              <img style="widht: 150px; height: 150px" :src="srcForm" />
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
              <!-- <img :src="src" > -->
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Tên nhóm hàng hóa" prop="ten_danh_muc">
              <el-input v-model="form.ten_danh_muc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Thứ tự hiển thị">
              <el-input type="number" v-model="form.thu_tu_hien_thi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Mô tả thêm">
              <el-input
                type="textarea"
                v-model="form.mo_ta"
                :rows="2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="showForm = false"
          >Hủy</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="addDanhMuc('form')"
          >THÊM MỚI</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="updateDanhMuc('form')"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addDanhMuc,
  index,
  updateDanhMuc,
  upAnhDanhMuc,
  xoaDanhMuc,
} from "@/api/danhmucsanpham";
import { getTinhThanh } from "@/api/TinhThanh";
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
      srcForm: process.env.VUE_APP_BASE + "images/avatar/product.png",
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
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: "",
        thu_tu_hien_thi: null,
      },
      rules: {
        ten_danh_muc: [
          {
            required: true,
            message: "Tên danh mục không thể bỏ trống",
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
      this.form.ten_danh_muc = data.ten_danh_muc;
      this.form.mo_ta = data.mo_ta;
      this.form.id = data.id;
      this.form.thu_tu_hien_thi = data.thu_tu_hien_thi;
      this.form.anh_dai_dien = data.anh_dai_dien;
      if (data.anh_dai_dien) {
        this.srcForm = process.env.VUE_APP_BASE + data.anh_dai_dien;
      } else {
        this.srcForm = process.env.VUE_APP_BASE + "images/avatar/product.png";
      }
    },
    async getData() {
      this.listLoading = true;
      let data = await index();
      this.list = data.data;
      this.listLoading = false;
    },
    searchData() {
      this.listLoading = true;
      index({ search: this.search }).then((response) => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa danh mục: " +
          "<strong>" +
          item.ten_danh_muc +
          "</strong>",
        "Xóa danh mục sản phẩm",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaDanhMuc(item.id).then((res) => {
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
      this.edit = false;
    },
    addDanhMuc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addDanhMuc(this.form).then((res) => {
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
    updateDanhMuc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateDanhMuc(this.form).then((res) => {
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
      this.src = process.env.VUE_APP_BASE + "images/avatar/product.png";
      this.form = {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: "",
        thu_tu_hien_thi: null,
      };
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then((res) => {
          this.form.anh_dai_dien = res;
          this.srcForm = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
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
