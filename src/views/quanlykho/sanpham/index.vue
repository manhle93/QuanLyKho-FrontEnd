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
            @keyup.enter.native="getData"
          ></el-input>
        </el-col>
        <el-col :span="5">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="getData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="14">
          <router-link to="themsanpham">
            <el-button style="float:right" size="small" icon="el-icon-plus" class="primary-button">Thêm mới</el-button>
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
            :src="scope.row.anh_dai_dien ? endPointImage + scope.row.anh_dai_dien: src"
            style="max-height: 90px; max-width: 90px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="ten_san_pham" min-width="160" label="Tên sản phẩm"></el-table-column>
      <el-table-column prop="danh_muc.ten_danh_muc" min-width="160" label="Danh mục"></el-table-column>
      <el-table-column prop="gia_ban" min-width="160" label="Giá bán"></el-table-column>
      <el-table-column prop="don_vi_tinh" min-width="160" label="Đơn vị tính"></el-table-column>
      <el-table-column label="Mô tả" prop="mo_ta_san_pham" min-width="157"></el-table-column>
      <el-table-column align="center" min-width="110" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <router-link :to="'capnhatsanpham/' + scope.row.id">
            <el-button
              size="small"
              style="background-color: #2E86C1; color: white"
              icon="el-icon-edit"
              circle
            ></el-button>
            </router-link>
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
import { listSanPham, addSanPham, xoaSanPham } from "@/api/sanpham";

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
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      form: {
        search: "",
        danh_muc_id: null
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getData(this.page, this.per_page);
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getData(this.page, this.per_page);
    },
    async getData() {
      this.listLoading = true;
      let data = await listSanPham({
        per_page: this.per_page,
        page: this.page,
        search: this.search
      });
      this.per_page = data.data.per_page
      this.page = data.data.page
      this.list = data.data.data;
      this.total = data.data.total
      this.listLoading = false;
    },
    // searchData(page = 1, per_page = 10) {
    //   this.listLoading = true;
    //   this.getData(this.form).then(response => {
    //     this.list = response.data.data;
    //     this.page = response.data.current_page;
    //     this.per_page = response.data.per_page;
    //     this.total = response.data.total;
    //     this.listLoading = false;
    //   });
    // },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa sản phẩm: " +
          "<strong>" +
          item.ten_san_pham +
          "</strong>",
        "Xóa sản phẩm",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          xoaSanPham(item.id).then(res => {
            this.$message({
              message: "Xóa thành công",
              type: "success"
            });
            this.getData();
          });
        })
        .catch(_ => {});
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
