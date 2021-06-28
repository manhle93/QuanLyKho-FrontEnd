<template>
  <div class="app-container">
    <h4><i style="color: green"> DANH SÁCH SẢN PHẨM BÁN CHẠY</i></h4>
    <el-row :gutter="20" justify="space-around">
      <!-- <el-col :span="5">
        <el-input
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="getData()"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="danh_muc_id"
          placeholder="Chọn danh mục"
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
          @click="getData()"
        >Tìm kiếm</el-button>
      </el-col>-->
      <el-col :span="8">
        <el-select
          remote
          filterable
          v-model="sanPhamID"
          placeholder="Chọn sản phẩm"
          size="medium"
          style="width: 80%"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in sanPhams"
            :key="item.id"
            :label="item.ten_san_pham"
            :value="item.id"
            :disabled="checkDaChon(item.id)"
          >
            <span style="float: left">{{ item.ten_san_pham }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.thuong_hieu
                ? "Thương hiệu: " + item.thuong_hieu.ten
                : "Danh mục: " + item.danh_muc.ten_danh_muc
            }}</span></el-option
          >
        </el-select>
        <el-button
          circle
          icon="el-icon-plus"
          class="primary-button"
          @click="addData()"
        ></el-button>
      </el-col>
      <el-col :span="16">
        <el-button
          style="float: right"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
          @click="addSanPham"
          >CẬP NHẬT</el-button
        >
      </el-col>
    </el-row>
    <br />
    <br />
    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px;font-family: roboto;"
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
        prop="ten_san_pham"
        min-width="160"
        label="Tên sản phẩm"
      >
      <template scope="scope">
        <div style="font-weight: bold; font-style: italic">{{scope.row.ten_san_pham}}</div>
      </template>
      </el-table-column>
      <el-table-column
        prop="danh_muc.ten_danh_muc"
        min-width="160"
        label="Danh mục"
      ></el-table-column>
      <el-table-column prop="gia_ban" min-width="120" label="Giá bán">
        <template slot-scope="scope">{{
          formate.formatCurrency(scope.row.gia_ban) + " đ"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="don_vi_tinh"
        min-width="120"
        label="Đơn vị tính"
      ></el-table-column>
      <el-table-column label="Mô tả" prop="mo_ta_san_pham" min-width="157">
        <template slot-scope="scope" v-if="scope.row.mo_ta_san_pham">{{
          scope.row.mo_ta_san_pham.length > 70
            ? scope.row.mo_ta_san_pham.substr(0, 70) + "..."
            : scope.row.mo_ta_san_pham
        }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="110"
        fixed="right"
        label="Hoạt động"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="xoaSanPham(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
import { listSanPham, addSanPham, xoaSanPham } from "@/api/sanpham";

import { addMonNgon, getMonNgon } from "@/api/caidat";
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
      sanPhams: [],
      sanPhamID: null,
      list: [],
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      loading: false,
      labelPosition: "top",
      user: null,
      danhMucs: [],
      formate: formate,
      danh_muc_id: null,
      monNgon: [],
    };
  },
  created() {
    this.getMonNgonMoiNgay();
    this.getData();
    this.getDanhMuc();
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    xoaSanPham(index, data) {
      this.list.splice(index, 1);
    },
    async getMonNgonMoiNgay() {
      this.listLoading = true;
      let data = await getMonNgon();
      this.list = data;
      this.listLoading = false;
    },
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    async addSanPham() {
      this.monNgon = [];
      this.monNgon = this.list.map((el) => el.id);
      try {
        let data = await addMonNgon({ data: this.monNgon });
        this.$message({
          message: "Cập nhật thành công",
          type: "success",
        });
      } catch (error) {}
    },
    addData() {
      if (this.sanPhamID) {
        let sanPham = this.sanPhams.find((el) => el.id == this.sanPhamID);
        this.list.push(sanPham);
      }
      this.sanPhamID = null;
    },
    checkDaChon(id) {
      let a = this.list.find((el) => el.id == id);
      if (a) return true;
      return false;
    },
    async remoteMethod(query) {
      this.loading = true;
      let data = await listSanPham({
        per_page: 30,
        search: query,
      });
      this.sanPhams = data.data.data;
      this.loading = false;
    },
    async getData() {
      this.loading = true;
      let data = await listSanPham({
        per_page: 30,
      });
      this.sanPhams = data.data.data;
      this.loading = false;
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
