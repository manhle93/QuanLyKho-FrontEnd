<template>
  <div class="app-container">
    <h4>Danh sách bài viết - Sinh thái ruộng bậc thang</h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="getData()"
        ></el-input>
      </el-col>
      <el-col :span="9">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="10">
        <router-link to="vietbai">
          <el-button
            style="float:right"
            size="small"
            icon="el-icon-plus"
            class="primary-button"
          >Thêm mới</el-button>
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
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.anh_dai_dien ? endPointImage + scope.row.anh_dai_dien: src"
            style="max-height: 90px; max-width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="tieu_de" min-width="160" label="Tiêu đề"></el-table-column>
      <el-table-column label="Nội dung" min-width="157">
        <template
          slot-scope="scope"
          v-if="scope.row.noi_dung"
        >{{scope.row.noi_dung.length > 70 ? scope.row.noi_dung.substr(0, 70)+'...' : scope.row.noi_dung}}</template>
      </el-table-column>
      <el-table-column align="center" min-width="110" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <router-link :to="'capnhatbaiviet/' + scope.row.id">
              <el-button size="small" class="primary-button" icon="el-icon-edit" circle></el-button>
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
      <el-table-column prop="user.name" label="Tác giả"></el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          <el-tag  effect="plain" v-if="scope.row.xuat_ban" title="success">Đã xuất bản</el-tag>
           <el-tag  type="warning" effect="plain" v-else>Lưu nháp</el-tag>
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

import {getBaiViet, xoaBaiViet} from "@/api/caidat"

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
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      danhMucs: [],
      formate: formate,
      danh_muc_id: null,
    };
  },
  created() {
    this.getData();
    this.getDanhMuc();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getData(this.page, this.per_page);
    },
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData(this.page, this.per_page);
    },
    async getData() {
      this.listLoading = true;
      let data = await getBaiViet({
        per_page: this.per_page,
        page: this.page,
        search: this.search,
      });
      this.per_page = data.data.per_page;
      this.page = data.data.page;
      this.list = data.data.data;
      this.total = data.data.total;
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
        "Bạn chắc chắn muốn xóa bài viết: " +
          "<strong>" +
          item.tieu_de.substr(0, 50) +
          "</strong>",
        "Xóa bài viết",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaBaiViet(item.id).then((res) => {
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.getData();
          });
        })
        .catch((_) => {});
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
