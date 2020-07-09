<template>
  <div class="app-container">
    <h4>Danh sách hàng tồn kho</h4>
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
      <el-table-column label="STT" width="100px" type="index" align="center"></el-table-column>
      <el-table-column label="Mã phiếu nhập" align="center" prop="ma"></el-table-column>
      <el-table-column label="Thời gian nhập" align="center" prop="created_at"></el-table-column>
      <el-table-column label="Tổng tiền" prop="don_hang.tong_tien"></el-table-column>
      <el-table-column align="center" fixed="right" label="Chi tiết đơn hàng">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Xem đơn hàng" placement="top">
            <el-button
              size="small"
              style="background-color: #2E86C1; color: white"
              icon="el-icon-view"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getPhieuNhap } from "@/api/quanlykho";

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
      form: {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: ""
      },
      rules: {
        ten_danh_muc: [
          {
            required: true,
            message: "Tên danh mục không thể bỏ trống",
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
      this.form.ten_danh_muc = data.ten_danh_muc;
      this.form.mo_ta = data.mo_ta;
      this.form.id = data.id;
      if (data.anh_dai_dien) {
        this.src = process.env.VUE_APP_BASE + data.anh_dai_dien;
      } else {
        this.src =
          process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
      }
    },
    async getData() {
      this.listLoading = true;
      let data = await getPhieuNhap({
        page: this.page,
        per_page: this.per_page
      });
      this.list = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.listLoading = false;
    },
    searchData() {
      this.listLoading = true;
      getPhieuNhap({ search: this.search }).then(response => {
        this.list = response.data.data;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa danh mục: " +
          "<strong>" +
          item.ten_danh_muc +
          "</strong>" +
          ", cùng toàn bộ sản phẩm bên trong",
        "Xóa danh mục sản phẩm",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          xoaDanhMuc(item.id).then(res => {
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
    addDanhMuc(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addDanhMuc(this.form).then(res => {
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
    updateDanhMuc(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateDanhMuc(this.form).then(res => {
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
      this.src = process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
      this.form = {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: ""
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
      this.getData()
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
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
