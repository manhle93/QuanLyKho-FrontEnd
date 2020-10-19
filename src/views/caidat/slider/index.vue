<template>
  <div class="app-container">
    <h4><i style="color: green"> CÀI ĐẶT SLIDE CHO BLOG</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="12">
        <el-button
          @click="showFormAdd"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
        >THÊM MỚI</el-button>
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
      <el-table-column min-width="100" label="Hình ảnh">
        <template slot-scope="scope">
          <el-image style="width: 150px; height: 100px" :src="endPointImage + scope.row.hinh_anh" fit="container"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="Dòng chữ" prop="dong_chu" min-width="157"></el-table-column>
      <el-table-column label="Đường link" prop="link" min-width="157"></el-table-column>
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
      :title="edit ? 'CẬP NHẬT SLIDER' :'THÊM MỚI SLIDER'"
      :visible.sync="showForm"
      width="600px"
      center
    >
      <el-form :model="form">
        <el-row></el-row>
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: center">
            <el-form-item label="Hình ảnh">
              <br />
              <el-upload
                v-if="!form.url_slider"
                class="upload-demo"
                drag
                :action="uploadSlider"
                :headers="this.token"
                :on-change="handleUpload"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  Kéo ảnh vào đây hoặc
                  <em>click để upload</em>
                </div>
              </el-upload>
              <img
                v-else
                style="width: 550px; max-height: 550px"
                :src="endPointImage + form.url_slider"
                fit="contain"
              />
              <br />
              <el-button
                v-if="form.url_slider"
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="form.url_slider = null"
              ></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Dòng chữ">
              <el-input v-model="form.dong_chu"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Link">
              <el-input v-model="form.link"></el-input>
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
          @click="addKhoHang()"
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
import { addSlider, xoaSlider, getSlider, updateSlider } from "@/api/caidat";
import { getInfor } from "@/api/taikhoan";
import { getToken } from "@/utils/auth";

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
      uploadSlider: process.env.VUE_APP_BASE_API + "uploadslider",
      list: [],
      showForm: false,
      edit: false,
      page: 1,
      token: "",
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      form: {
        id: null,
        url_slider: null,
        dong_chu: "",
        link: "",
      },
    };
  },
  created() {
    this.getData();
    this.token = {
      Authorization: "Bearer " + getToken(),
    };
  },
  methods: {
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.showForm = true;
      this.form.url_slider = data.hinh_anh;
      this.form.dong_chu = data.dong_chu;
      this.form.link = data.link;
      this.form.id = data.id;
    },
    async getData() {
      this.listLoading = true;
      let data = await getSlider();
      this.list = data;
      this.listLoading = false;
    },

    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chán muốn xóa hình ảnh này ? "+"</br> <br>" +"<img style='width: 100px; height: 100px' src='" + this.endPointImage + item.hinh_anh + "'/>",

        "Xóa ảnh slider",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaSlider(item.id).then((res) => {
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
    addKhoHang() {
      if (!this.form.url_slider) {
        this.$message({
          message: "Hình ảnh không tồn tại",
          type: "warning",
        });
        return;
      }
      addSlider(this.form).then((res) => {
        this.resetForm();
        this.getData();
        this.$message({
          type: "success",
          message: "Thêm mới thành công",
        });
      });
    },
    updateKhoHang(formName) {
      if (!this.form.url_slider) {
        this.$message({
          message: "Hình ảnh không tồn tại",
          type: "warning",
        });
        return;
      }
      updateSlider(this.form.id, this.form).then((res) => {
        this.resetForm();
        this.getData();
        this.$message({
          type: "success",
          message: "Cập nhật thành công",
        });
      });
    },
    resetForm() {
      this.showForm = false;
      this.form = {
        id: null,
        url_slider: null,
        dong_chu: "",
        link: "",
      };
    },
    handleUpload(e) {
      if (e.response) {
        this.form.url_slider = e.response;
      }
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
