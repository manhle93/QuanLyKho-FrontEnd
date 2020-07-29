<template>
  <div class="app-container">
    <h3>Danh sách hàng trong kho</h3>
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
      <el-col :span="7">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getData()"
        >Tìm kiếm</el-button>
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
      <el-table-column label="STT" width="100px" type="index" align="center"></el-table-column>
      <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.san_pham.anh_dai_dien ? endPointImage + scope.row.san_pham.anh_dai_dien: src"
            style="max-height: 90px; max-width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column label="Tên hàng hóa, sản phẩm" align="center" prop="san_pham.ten_san_pham"></el-table-column>
      <!-- <el-table-column label="Đơn vị tính" align="center" prop="san_pham.don_vi_tinh"></el-table-column> -->
      <el-table-column label="Số lượng" align="center" prop="so_luong">
        <template slot-scope="scope">{{scope.row.so_luong}} {{scope.row.san_pham ? scope.row.san_pham.don_vi_tinh: null}}</template>
      </el-table-column>
      <!-- <el-table-column label="Kho hàng" prop="kho.ten"></el-table-column> -->
      <el-table-column label="Tồn kho tối thiểu" prop="san_pham.ton_kho_thap_nhat">
        <template
        v-if="scope.row.san_pham && scope.row.san_pham.ton_kho_thap_nhat"
          slot-scope="scope"
        >{{scope.row.san_pham.ton_kho_thap_nhat}} {{scope.row.san_pham.don_vi_tinh}}</template>
      </el-table-column>
      <el-table-column label="Giá bán mặc định" prop="san_pham.gia_ban">
        <template v-if="scope.row.san_pham" slot-scope="scope">{{formate.formatCurrency(scope.row.san_pham.gia_ban)}} đ</template>
      </el-table-column>
      <el-table-column label="Đã bán" prop="da_ban">
          <template slot-scope="scope">{{scope.row.da_ban}} {{scope.row.san_pham ? scope.row.san_pham.don_vi_tinh : null}}</template>
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
import { getPhieuNhap, hangTrongKho } from "@/api/quanlykho";

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
      showForm: false,
      edit: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      formate: formate,
      form: {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: "",
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
      if (data.anh_dai_dien) {
        this.src = process.env.VUE_APP_BASE + data.anh_dai_dien;
      } else {
        this.src =
          process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
      }
    },
    async getData() {
      this.listLoading = true;
      let data = await hangTrongKho({
        page: this.page,
        per_page: this.per_page,
        search: this.search,
      });
      this.list = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.listLoading = false;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
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
