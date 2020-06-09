<template>
  <div class="app-container">
    <h4 style="color: #2E86C1">Danh sách các đơn vị hỗ trợ</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col class="el-input-form" :sm="{ span: 5 }">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-col>
        <el-col class="el-input-form" :sm="{ span: 4 }" v-if="!tinh_thanh">
          <el-select
            size="small"
            clearable
            v-model="form.quan_huyen_id"
            filterable
            allow-create
            default-first-option
            placeholder="Quận huyện"
          >
            <el-option
              v-for="item in quanhuyens"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="el-input-form" :sm="{ span: 4 }" v-if="tinh_thanh">
          <el-select
            clearable
            v-model="form.tinh_thanh_id"
            filterable
            allow-create
            default-first-option
            placeholder="Tỉnh thành"
            size="small"
          >
            <el-option
              v-for="item in tinhthanhs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col class="btnWidth" :span="3">
          <el-button
            style="background-color: #3498DB; color: white"
            icon="el-icon-search"
            @click="searchData()"
            size="small"
            >Tìm kiếm</el-button
          >
        </el-col>
        <el-col style="float:right" :span="3">
          <router-link
            style="float:right"
            tag="span"
            to="/quanlydonvipccc/donvihotro/create"
          >
            <el-tooltip content="Thêm mới đơn vị hỗ trợ">
              <el-button
                style="background-color: #3498DB; color: white"
                circle
                icon="el-icon-plus"
              ></el-button>
            </el-tooltip>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <h5>Nhập dữ liệu từ excel</h5>
    <el-row :gutter="20">
      <input
        ref="upload-image"
        class="upload-image"
        type="file"
        @change="handleChange($event)"
      />
      <el-col :span="20">
        <el-tooltip
          class="item"
          effect="dark"
          content="Tải xuống file Excel mẫu"
          placement="top"
        >
          <el-button
            size="mini"
            class="primary-button block"
            :icon="iconDowload"
            @click="downloadMau"
            >Tải file mẫu</el-button
          >
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Chọn file để tải lên"
          placement="top"
        >
          <el-button
            :disabled="loadingUpload"
            size="mini"
            type="warning"
            class="block"
            :icon="iconUpload"
            @click="handleUpload"
            >Nhập từ Excel</el-button
          >
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
          stripe
        >
          <el-table-column
            type="index"
            label="STT "
            min-width="80"
          ></el-table-column>
          <el-table-column
            sortable
            property="ma"
            label="Mã "
            min-width="113"
          ></el-table-column>
          <el-table-column
            sortable
            property="ten"
            label="Tên"
            min-width="250"
          ></el-table-column>
          <el-table-column
            sortable
            property="loai_don_vi.ten"
            label="Loại đơn vị"
            min-width="113"
          ></el-table-column>
          <el-table-column
            sortable
            property="so_dien_thoai"
            label="Số điện thoại"
            min-width="116"
          ></el-table-column>
          <el-table-column
            sortable
            property="quan_huyen.name"
            label="Quận huyện"
            min-width="113"
          ></el-table-column>
          <el-table-column
            sortable
            property="tinh_thanh.name"
            label="Tỉnh thành"
            min-width="113"
          ></el-table-column>
          <el-table-column label="Hành động" align="center" width="110">
            <template slot-scope="scope">
              <router-link
                :to="'/quanlydonvipccc/donvihotro/show/' + scope.row.id"
              >
                <el-button
                  size="mini"
                  style="background-color: #3498DB; color: white"
                  icon="el-icon-view"
                  circle
                ></el-button>
              </router-link>

              <el-tooltip
                class="item"
                effect="dark"
                content="Xóa"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getDonViHoTro,
  deleteDonViHoTro,
  uploadDonViHoTro
} from "@/api/donvihotro";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
import { getInfor } from "@/api/taikhoan";

export default {
  data() {
    return {
      disabledTinhThanh: true,
      page: 1,
      per_page: 5,
      total: 0,
      tableData: null,
      iconDowload: "el-icon-bottom",
      iconUpload: "el-icon-upload",
      loadingUpload: false,
      btnLoading: false,
      listLoading: true,
      search: "",
      quanhuyens: [],
      tinhthanhs: [],
      tinh_thanh: true,
      form: {
        search: "",
        quan_huyen_id: "",
        tinh_thanh_id: ""
      }
    };
  },
  props: {
    tinhThanhId: { type: Number },
    showAll: { type: Boolean }
  },
  watch: {
    showAll(val) {
      if (val) {
        this.tinhThanh();
        this.tableData = [];
        this.$emit("getSoLuong", false);
        getDonViHoTro({
          page: this.page,
          per_page: this.per_page
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.$emit("getSoLuong", this.total);
          this.listLoading = false;
        });
      }
    },
    tinhThanhId(val) {
      this.form.tinh_thanh_id = val;
      this.tinh_thanh = false;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.quanhuyens = res.data;
        this.quanhuyens.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
      this.tableData = [];
      this.listLoading = true;
      this.$emit("getSoLuong", false);
      getDonViHoTro({
        page: this.page,
        per_page: this.per_page,
        tinh_thanh_id: val
      }).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.$emit("getSoLuong", this.total);
        this.listLoading = false;
      });
    }
  },
  methods: {
    handleChange(e) {
      const files = e.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      this.loadingUpload = true;
      this.iconUpload = "el-icon-loading";
      var filePath = files[0].name.split(".").pop(); //lấy định dạng file
      var dinhDangChoPhep = ["xlsx", "xls", "xlt", "xltx"]; //các tập tin cho phép

      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.loadingUpload = false;
        this.listLoading = false;
        this.iconUpload = "el-icon-bottom";
        this.$message({
          message: "Tập tin không hợp lệ, hãy upload file excel",
          type: "warning"
        });
      } else {
        uploadDonViHoTro(data)
          .then(res => {
            this.src = process.env.VUE_APP_BASE + res;
            this.listLoading = false;
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
            this.getData();
            this.$message({
              message: "Upload thành công",
              type: "success"
            });
          })
          .catch(error => {
            console.log(error);
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
          });
      }
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    async downloadMau() {
      const data = await getInfor();
      if (data.data.tinhthanh != null) {
        var tinh_thanh_id = data.data.tinhthanh.id;
        window.location.assign(
          process.env.VUE_APP_BASE_API +
            "downloadmaudonvihotro?tinh_thanh_id=" +
            tinh_thanh_id
        );
      } else {
        window.location.assign(
          process.env.VUE_APP_BASE_API + "downloadmaudonvihotro"
        );
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
    async tinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
        this.tinhthanhs.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    async quanHuyen() {
      getQuanHuyen().then(res => {
        this.quanhuyens = res.data;
        this.quanhuyens.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    async getData(page = 1, per_page = 5) {
      this.listLoading = true;
      getDonViHoTro({
        page: this.page,
        per_page: this.per_page,
        tinh_thanh_id: this.form.tinh_thanh_id
      }).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.$emit("getSoLuong", this.total);
        this.listLoading = false;
      });
    },

    searchData(page = 1, per_page = 5) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getDonViHoTro(this.form).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },
    changeQuanHuyen(val) {
      this.form.quan_huyen_id = null;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.quanhuyens = res.data;
        this.quanhuyens.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    async handleDelete(data) {
      try {
        this.listLoading = true;
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa đơn vị hỗ trợ: " +
            "<strong>" +
            data.ten +
            "</strong>",
            "Xóa đơn vị hỗ trợ",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        let status = await deleteDonViHoTro(data.id);
        let getData = await this.getData();
        this.listLoading = false;
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        this.listLoading = false;
      }
    }
  },
  created() {
    this.tinhThanh();
    this.tableData = [];
    this.$emit("getSoLuong", false);
    getDonViHoTro({
      page: this.page,
      per_page: this.per_page
    }).then(response => {
      this.tableData = response.data.data;
      this.page = response.data.current_page;
      this.per_page = response.data.per_page;
      this.total = response.data.total;
      this.$emit("getSoLuong", this.total);
      this.listLoading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.search {
  margin-bottom: 20px;
}
.upload-image {
  display: none;
  z-index: -9999;
}
.btnWidth {
  width: fit-content;
}
@media (max-width: 768px) {
  .el-input-form {
    margin-bottom: 10px;
  }
}
</style>
