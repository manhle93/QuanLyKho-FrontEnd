<template>
  <div class="app-container">
    <h4>Danh sách sản phẩm hàng hóa</h4>
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
        <el-col :span="4">
          <router-link to="themsanpham">
            <el-button
              @click="showFormAdd"
              size="small"
              icon="el-icon-plus"
              class="primary-button"
            >Thêm mới</el-button>
          </router-link>
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
      <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.anh_dai_dien"
            :src="endPointImage + scope.row.anh_dai_dien"
            style="max-height: 90px; max-width: 90px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column sortable prop="ten_danh_muc" min-width="160" label="Tên"></el-table-column>
      <el-table-column label="Mô tả" prop="mo_ta" min-width="157"></el-table-column>
      <el-table-column label="Số mặt hàng" min-width="157"></el-table-column>
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
      :title="edit ? 'Cập nhật sản phẩm' :'Thêm sản phẩm, hàng hóa'"
      :visible.sync="showForm"
      width="40%"
      center
     >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row>
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Tên sản phẩm" prop="ten_san_pham">
              <el-input v-model="form.ten_san_pham"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Danh mục" prop="ten_san_pham">
              <el-input v-model="form.ten_san_pham"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Giá bán" prop="gia_ban">
              <el-input v-model="form.gia_ban"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="Giá khuyến mãi" prop="gia_sale">
              <el-input v-model="form.gia_sale"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="Đơn vị tính" prop="don_vi_tinh">
              <el-input v-model="form.don_vi_tinh"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Mô tả">
              <el-input type="textarea" v-model="form.mo_ta" :rows="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Album ảnh">
              <br />
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogAlbum">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
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
          @click="addDanhMuc('form')"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="updateDanhMuc('form')"
        >Cập nhật</el-button>
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
  xoaDanhMuc
} from "@/api/danhmucsanpham";
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
        ten_san_pham: "",
        gia_ban: "",
        gia_sale: "",
        don_vi_tinh: ""
      },
      dialogImageUrl: "",
      dialogAlbum: false,
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogAlbum = true;
    },
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
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async getData() {
      this.listLoading = true;
      let data = await index();
      this.list = data.data.data;
      this.listLoading = false;
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      index({ search: this.search }).then(response => {
        this.list = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.list.length ? this.list.length : last;
      this.fetchData(this.page, this.per_page);
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
