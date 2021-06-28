<template>
  <div class="app-container">
    <h4>
      <i style="color: green">DANH SÁCH SẢN PHẨM/ HÀNG HÓA</i>
    </h4>
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
      <el-col :span="4">
        <el-select
          v-model="danh_muc_id"
          placeholder="Lựa chọn danh mục"
          size="small"
          style="width: 100%"
        >
          <el-option
            v-for="item in danhMucs"
            :key="item.id"
            :label="item.ten_danh_muc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="searchData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="10">
        <router-link to="themsanpham">
          <el-button
            style="float: right"
            size="small"
            icon="el-icon-plus"
            class="primary-button"
          >THÊM HÀNG HÓA</el-button>
        </router-link>
      </el-col>
    </el-row>
    <h5>Nhập dữ liệu từ excel</h5>
    <el-row :gutter="20">
      <input ref="upload-image" class="upload-image" type="file" @change="handleChange($event)" />
      <el-col :span="20">
        <el-tooltip class="item" effect="dark" content="Tải xuống file Excel mẫu" placement="top">
          <el-button
            size="mini"
            class="primary-button block"
            :icon="iconDowload"
            @click="downloadMau"
          >Tải dữ liệu</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="Chọn file để tải lên" placement="top">
          <el-button
            :disabled="loadingUpload"
            size="mini"
            type="warning"
            class="block"
            :icon="iconUpload"
            @click="handleUpload"
          >Import dữ liệu</el-button>
        </el-tooltip>
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
      <el-table-column label="STT" width="85" type="index" align="center"></el-table-column>
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
      <el-table-column prop="ten_san_pham" min-width="160" label="Tên sản phẩm"></el-table-column>
      <el-table-column prop="danh_muc.ten_danh_muc" min-width="120" label="Danh mục"></el-table-column>
      <el-table-column prop="gia_ban" min-width="80" label="Giá bán">
        <template slot-scope="scope">
          {{
          formate.formatCurrency(scope.row.gia_ban) + " đ"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="don_vi_tinh" min-width="90" label="Đơn vị tính"></el-table-column>
      <el-table-column label="Mô tả" prop="mo_ta_san_pham" min-width="250">
        <template slot-scope="scope" v-if="scope.row.mo_ta_san_pham">
          {{
          scope.row.mo_ta_san_pham.length > 70
          ? scope.row.mo_ta_san_pham.substr(0, 70) + "..."
          : scope.row.mo_ta_san_pham
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <router-link :to="'capnhatsanpham/' + scope.row.id">
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
        :current-page.sync="currentPage"
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
  xoaDanhMuc,
} from "@/api/danhmucsanpham";
import {
  listSanPham,
  addSanPham,
  xoaSanPham,
  uploadSanPham,
} from "@/api/sanpham";

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
      iconDowload: "el-icon-bottom",
      iconUpload: "el-icon-upload",
      loadingUpload: false,
      currentPage: 1
    };
  },
  created() {
    this.getData();
    this.getDanhMuc();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    handleChange(e) {
      const files = e.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      this.loadingUpload = true;
      this.iconUpload = "el-icon-loading";
      var filePath = files[0].name.split(".").pop(); //lấy định dạng file
      var dinhDangChoPhep = ["xlsx", "xls", "xlt", "xltx"]; //các tập tin cho phép

      if (!dinhDangChoPhep.find((el) => el == filePath)) {
        this.loadingUpload = false;
        this.listLoading = false;
        this.iconUpload = "el-icon-bottom";
        this.$message({
          message: "Tập tin không hợp lệ, hãy upload file excel",
          type: "warning",
        });
      } else {
        uploadSanPham(data)
          .then((res) => {
            this.src = process.env.VUE_APP_BASE + res;
            this.listLoading = false;
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
            this.getData();
            this.$message({
              message: "Upload thành công",
              type: "success",
            });
          })
          .catch((error) => {
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
          });
      }
      this.$refs["upload-image"].value = null;
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    downloadMau() {
      window.location.assign(process.env.VUE_APP_BASE_API + "exportsanpham");
    },
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
    },
    searchData(){
      this.page = 1
      this.currentPage = 1
      this.getData()
    },
    async getData() {
      this.listLoading = true;
      let data = await listSanPham({
        per_page: this.per_page,
        page: this.page,
        search: this.search,
        danh_muc_id: this.danh_muc_id,
      });
      this.per_page = data.data.per_page;
      this.page = data.data.page;
      this.list = data.data.data;
      this.total = data.data.total;
      this.listLoading = false;
    },
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
          type: "warning",
        }
      )
        .then((_) => {
          xoaSanPham(item.id).then((res) => {
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
