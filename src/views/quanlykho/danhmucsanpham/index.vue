<template>
  <div class="app-container">
    <h4>Danh sách người dùng</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
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
          <el-button
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
      <el-table-column label="STT" min-width="55" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column sortable prop="name" min-width="160" label="Tên">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column sortable prop="username" label="Tên đăng nhập" min-width="150">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="Email" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại" min-width="157">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="Tỉnh thành" min-width="157">
        <template slot-scope="scope" v-if="scope.row.tinh_thanh !== null">
          {{
          scope.row.tinh_thanh.name
          }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="active"
        class-name="status-col"
        label="Trạng thái"
        align="center"
        min-width="157"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.active">Hoạt động</el-tag>
          <el-tag type="danger" v-else>Không hoạt động</el-tag>
        </template>
      </el-table-column>
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
              @click="deleteAppUserID(scope.$index, scope.row)"
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
      :title="edit ? 'Cập nhật danh mục sản phẩm' :'Thêm danh mục sản phẩm'"
      :visible.sync="showForm"
      width="30%"
      center
    >
      <el-form>
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
              <!-- <img :src="src" > -->
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Tên danh mục">
              <el-input v-model="form.ten_danh_muc"></el-input>
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
        <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Cancel</el-button>
        <el-button class="primary-button" size="small" v-if="!edit" @click="addDanhMuc()">Thêm mới</el-button>
        <el-button class="primary-button" size="small" v-else @click="showForm = false">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addDanhMuc, index } from "@/api/danhmucsanpham";
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
      list: null,
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
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: ""
      }
    };
  },
  created() {},
  methods: {
    showUpdate(user) {
      this.showEditForm = true;
      this.user = user;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getUser(this.form).then(response => {
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
    deleteAppUserID(index, item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa người dùng: " +
          "<strong>" +
          item.name +
          "</strong>",
        "Xóa người dùng",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          deleteUser(item.id).then(res => {
            this.$message({
              message: "Xóa thành công",
              type: "success"
            });
            this.fetchData();
          });
        })
        .catch(_ => {});
    },
    showFormAdd() {
      this.showForm = true;
    },
    addDanhMuc() {
      addDanhMuc(this.form).then(res => {
        this.$message({
          type: "success",
          message: "Thêm mới thành công"
        });
      });
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      userAvatar(this.userId, data)
        .then(res => {
          this.formLabelAlign.avatar_url = process.env.VUE_APP_BASE + res;
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
